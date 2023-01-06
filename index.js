/** PACKAGES: IMPORT */
const puppeteer = require('puppeteer');
const EventEmitter = require('events').EventEmitter;
const Eris = require('eris');

/** BLACKLIST: CHANGE, ADD OR REMOVE KEYWORDS HERE */
const NSFW_LIST = 'https://raw.githubusercontent.com/LDNOOBW/List-of-Dirty-Naughty-Obscene-and-Otherwise-Bad-Words/master/en';
const blacklist = ['localhost', 'tcp', 'ngrok', 'file', 'settings', 'chrome://', 'ip', 'address', 'internet', 'wifi'];
const obscureResponseURL = 'https://cdn.discordapp.com/attachments/907306705090646066/1060484860122247178/Untitle41d.png';

/** PLUGINS: IMPORT */
const plugin = require('./utils/plugin');
const { collectInteractions } = require('./utils/interactionCollector');

/** VARIABLES: DATA SET */
const data = [];
const filterListener = new EventEmitter();

let messageID;
let obscureWords;
let browser;
let page;
let runningUser;
let collector;
let mouseModifier = 70;
let x = 980;
let y = 400;
let date;
let responseBuffer;


/** FUNCTIONS: INIT */

async function loadFilters() {
	const fetchData = await fetch(NSFW_LIST);
	obscureWords = await fetchData.text();
}

async function resetProcess(sussyFilter) {
	runningUser = undefined;

	if (page) await page.close();
	page = await browser.newPage();

	await page.setViewport({
		width: 1920,
		height: 1080,
	});

	await plugin(page);
	await page.goto('https://google.com');

	if (sussyFilter) {
		await loadFilters();

		/** ATTACH A REDIRECT LISTENER FOR POSSIBLE SUSPICIOUS WEBSITES/KEYWORDS */
		page.on('response', async response => {
			const status = response.status();

			if ((status >= 300) && (status <= 399)) {
				const NSFW_OR_NOT = await sussySearch(response.headers()['location']);

				console.log(NSFW_OR_NOT, response.headers()['location']);
				if (NSFW_OR_NOT === true) {
					const interval = setInterval(() => {
						if (filterListener.listenerCount('redirect') !== 0) {
							filterListener.emit('redirect', NSFW_OR_NOT);
							clearInterval(interval);
						}
					}, 100);
				}
			}
		});
	}

	await page.mouse.move(x, y);
}
/**
 * Turn an URL to Buffer
 * @param {String} url The url to fetch for buffer.
 * @returns Buffer
 */
async function buffer(url) {
	const response = await fetch(url);
	const bufferdata = await response.arrayBuffer();

	return Buffer.from(new Uint8Array(bufferdata), 'utf-8');
}

/**
 * Filter suspicious exploits/obscure keywords.
 * @param {String} content The content which will be used to search for obscure/exploits.
 * @returns Boolean
 */
async function sussySearch(content) {
	content = content.toLowerCase();

	const words = obscureWords.split('\n');

	words.pop();
	words.concat(blacklist);

	return words.some(word => content.includes(word));
}

/**
 * The move function that manages the mouse.
 * @param {String} dir The directions where the mouse shall be moved. (click, up, down, left, right)
*/
async function move(dir) {
	if (dir === 'click') await page.mouse.click(x, y);
	if (dir === 'up' && y <= 1080) await page.mouse.move(x, y - mouseModifier), y -= mouseModifier;
	if (dir === 'down' && y <= 1080) await page.mouse.move(x, y + mouseModifier), y += mouseModifier;
	if (dir === 'left' && x <= 1920) await page.mouse.move(x - mouseModifier, y), x -= mouseModifier;
	if (dir === 'right' && x <= 1920) await page.mouse.move(x + mouseModifier, y), x += mouseModifier;
}

/**
 * Update the message for video output.
 * @param {*} int The interaction to edit.
 * @param {*} messageObject The message object that shall be shown once the message is edited.
*/
async function update(int, messageObject) {
	const screenshot = await page.screenshot();

	await int.editOriginalMessage(messageObject, { name: 'file.png', file: screenshot });
}

/** EXPORT CODE */

/**
 * The main browse function.
 * @param {String} token The Discord bot token which we'll use to connect to Discord.
 * @param {String} guildID The server ID in which you want to use the bot in.
 * @param {Number} clearTime The time allocated to each user (default: 300000 | Milliseconds)
 * @param {Boolean} sussyFilter The filter for suspicious searches and sites (default: true)
 */
module.exports = async function browse(token, guildID, clearTime = 300000, sussyFilter = true) {

	const bot = new Eris(token, { intents: ['allNonPrivileged', 'guildMessages'] });

	responseBuffer = await buffer(obscureResponseURL);
	browser = await puppeteer.launch();

	await resetProcess(sussyFilter);

	bot.on('ready', () => {
		console.log('Connected to Discord!');

		bot.bulkEditGuildCommands(guildID, [{
			name: 'browse',
			description: 'open a virtual browser',
			options: [
				{
					name: 'url',
					description: 'The url you want to go to',
					type: Eris.Constants.ApplicationCommandOptionTypes.STRING,
					required: false,
				},
			],
		}]);
	});

	bot.on('messageCreate', async (msg) => {
		// eslint-disable-next-line no-shadow
		const found = data.find((x) => x.id == msg.author.id);

		if (found !== undefined) {
			data.splice(found, 1);

			const NSFW_OR_NOT = await sussySearch(msg.content);

			if (NSFW_OR_NOT === true) {
				return msg.channel.createMessage({
					content: '\u200b',
					messageReference: { messageID: msg.id },
				}, { file: responseBuffer, name: 'response.png' });
			}

			await page.keyboard.type(msg.content, { delay: 10 });

			await msg.addReaction('✅');
		}
	});
	bot.on('interactionCreate', async (int) => {
		if (int instanceof Eris.CommandInteraction) {

			if (int.data.name === 'browse') {
				await int.acknowledge();

				if (runningUser !== undefined) return int.createFollowup(`sir. 1 browser is already opened by someone else!! i dont have nasa PC so plz no.\n\nA new browser will be able to be opened in <t:${Math.floor(date / 1000)}:R>`);
				if (int.data.options) {
					const NSFW_OR_NOT = await sussySearch(int.data.options?.[0]?.value);

					if (NSFW_OR_NOT === true) return int.createFollowup('\u200b', { file: responseBuffer, name: 'response.png' });
					if (!/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/.test(int.data.options?.[0]?.value)) return int.createFollowup('Please provide a valid URL.');

					await page.goto(int.data.options[0].value);

					filterListener.once('redirect', async () => {
						if (messageID) bot.deleteMessage(int.channel.id, messageID), messageID = false;
						if (collector) collector?.stopListening('end').catch(() => {});
						int.channel.createMessage(`<@${runningUser}> please avoid browsing websites that are blacklisted.`, { file: responseBuffer, name: 'response.png' });

						await resetProcess(sussyFilter);
					});
				}

				try {
					runningUser = int.member.id;

					date = Date.now() + clearTime;

					setTimeout(async () => {
						resetProcess();
					}, clearTime);

					const image = await page.screenshot();
					const ids = [];

					for (let i = 0; i < 15; i++) {
						ids.push(String(Math.random()));
					}

					const componentsArray = [
						{
							type: 1,
							components: [
								{ type: 2, label: 'x10', custom_id: ids[0], style: 1 },
								{ type: 2, label: 'x25', custom_id: ids[1], style: 1 },
								{ type: 2, label: 'x50', custom_id: ids[2], style: 1 },
								{ type: 2, label: 'x75', custom_id: ids[3], style: 1 },
								{ type: 2, label: 'x100', custom_id: ids[4], style: 1 },
							],
						},
						{
							type: 1,
							components: [
								{ type: 2, label: '\u200b', custom_id: ids[5], emoji: { id: '1059027778021896203' }, style: 2 },
								// { type: 2, label: '\u200b', custom_id: ids[6], emoji: { id: '1059032779230294038' }, style: 2 },
								{ type: 2, label: '\u200b', custom_id: ids[6], emoji: { id: '1059434860864884837' }, style: 2 },
								{ type: 2, label: '\u200b', custom_id: ids[7], emoji: { id: '1001533471023452270' }, style: 3 },
								{ type: 2, label: '\u200b', custom_id: ids[8], emoji: { id: '1025434642112856116' }, style: 2 },
								{ type: 2, label: '\u200b', custom_id: ids[9], emoji: { id: '1025712385866092594' }, style: 2 },
							],
						},
						{
							type: 1,
							components: [
								{ type: 2, label: '\u200b', custom_id: ids[10], emoji: { id: '1025708958905806878' }, style: 2 },
								{ type: 2, label: '\u200b', custom_id: ids[11], emoji: { id: '1001533781880094721' }, style: 3 },
								{ type: 2, label: '\u200b', custom_id: ids[12], emoji: { id: '1001533779933921380' }, style: 3 },
								{ type: 2, label: '\u200b', custom_id: ids[13], emoji: { id: '1001533778210074635' }, style: 3 },
								{ type: 2, label: '\u200b', custom_id: ids[14], emoji: { id: '1025711319506231316' }, style: 2 },
							],
						},
					];
					const messageObject = {
						content: '\u200b',
						components: componentsArray,
						embeds: [{
							image: { url: 'attachment://file.png' },
							color: 0xFFFFFF,
						}],
						attachments: [],
					};

					messageID = await int.createFollowup(messageObject, { name: 'file.png', file: image });

					collector = await collectInteractions({
						client: bot,
						componentType: 2,
						filter: (_) => _.member.id === int.member.id,
					});

					collector.on('collect', async interaction => {
						await interaction.deferUpdate();

						if (!ids.includes(interaction.data.custom_id)) return;

						/** MOUSE SENSITIVITY INCREASEMENT | FIRST ROW */
						switch (interaction.data.custom_id) {

						case ids[0]:
							mouseModifier = 20;
							break;

						case ids[1]:
							mouseModifier = 25;
							break;
						case ids[2]:
							mouseModifier = 50;
							break;
						case ids[3]:
							mouseModifier = 75;
							break;
						case ids[4]:
							mouseModifier = 100;
							break;

							/** SECOND ROW */
						case ids[5]:
							await page.keyboard.press('Tab');
							break;
						case ids[6]:
							await page.close();
							page = await browser.newPage();

							await page.setViewport({
								width: 1920,
								height: 1080,
							});

							await plugin(page);
							await page.goto('https://google.com');

							await page.mouse.move(x, y);
							break;
						case ids[7]:
							await move('up');
							break;
						case ids[8]:
							await move('click');
							break;
						case ids[9]:
							await page.keyboard.down('Control');
							await page.keyboard.press('A');
							await page.keyboard.up('Control');
							await page.keyboard.press('Backspace');
							break;

							/** THIRD ROW */
						case ids[10]:
							interaction.createMessage('Please type here your text, which will be typed in the browser.');
							data.push({ id: interaction.member.id });
							break;
						case ids[11]:
							await move('left');
							break;
						case ids[12]:
							await move('down');
							break;
						case ids[13]:
							await move('right');
							break;
						case ids[14]:
							await page.keyboard.press('Enter');
							break;

						}
						update(int, messageObject);
					});
				}
				catch (e) {
					/** AVOID LOGGING ERRORS THAT ARE KNOWN */
					if (!e.message.includes('Target closed.')) console.log(e);
				}
			}
		}
	});

	bot.connect();
};
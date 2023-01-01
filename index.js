module.exports = async function browse(token, guildID, clearTime = 300000) {

	const puppeteer = require('puppeteer');
	const Eris = require('eris');
	const data = [];

	const plugin = require('./utils/plugin');
	const { collectInteractions } = require('./utils/interactionCollector');

	const bot = new Eris(token, { intents: ['allNonPrivileged', 'guildMessages'] });
	function wait(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	let browser;
	let page;
	let alreadyRunning;
	let collector;
	let mouseModifier = 70;
	let x = 980;
	let y = 400;

	async function move(dir) {
		if (dir === 'click') await page.mouse.click(x, y);
		if (dir === 'up' && y <= 1080) await page.mouse.move(x, y - mouseModifier), y -= mouseModifier;
		if (dir === 'down' && y <= 1080) await page.mouse.move(x, y + mouseModifier), y += mouseModifier;
		if (dir === 'left' && x <= 1920) await page.mouse.move(x - mouseModifier, y), x -= mouseModifier;
		if (dir === 'right' && x <= 1920) await page.mouse.move(x + mouseModifier, y), x += mouseModifier;
	}
	async function update(int, messageObject) {
		const screenshot = await page.screenshot();

		await int.editOriginalMessage(messageObject, { name: 'file.png', file: screenshot });
	}

	(async () => {
		browser = await puppeteer.launch();
		page = await browser.newPage();

		await page.setViewport({
			width: 1920,
			height: 1080,
		});


		await plugin(page);

		// start in middle
		await page.mouse.move(x, y);

		await page.goto('https://google.com');
	})();

	bot.on('ready', () => {
		console.log('Connected to Discord!');
		bot.bulkEditGuildCommands(guildID, [	{
			name: 'browse',
			description: 'open a virtual browser',
		}]);
	});
	bot.on('messageCreate', async (msg) => {
	// eslint-disable-next-line no-shadow
		const found = data.find((x) => x.id == msg.author.id);

		if (found !== undefined) {
			await page.keyboard.type(msg.content, { delay: 10 });

			data.splice(found, 1);
			await msg.addReaction('✅');
		}
	});
	bot.on('interactionCreate', async (int) => {
		if (int instanceof Eris.CommandInteraction) {

			if (int.data.name === 'browse') {
				await int.acknowledge();

				if (alreadyRunning !== undefined) return int.createFollowup('sir. 1 browser is already opened by someone else!! i dont have nasa PC so plz no.');

				alreadyRunning = true;

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
							{ type: 2, label: '\u200b', custom_id: ids[6], style: 2, disabled: true },
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
				const messageObject = { content: '\u200b',
					components: componentsArray,
					embeds: [{
						image: { url: 'attachment://file.png' },
						footer: { text: 'plz read docs on how use!!' },
						color: 0xFFFFFF,
					}],
					attachments: [],
				};

				await int.createFollowup(messageObject, { name: 'file.png', file: image });

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
					// case ids[6]:
					// 	await page.keyboard.press('F5');
					// 	break;
					case ids[7]:
						await move('click');
						break;
					case ids[8]:
						await move('up');
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
		}
	});
	bot.connect();

	setInterval(async () => {
		alreadyRunning = false;
		collector?.stopListening?.('end').catch(() => {});
	}, clearTime);
};
module.exports = async function browse(token, guildID) {

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
	let mouseModifier = 10;
	let x = 0;
	let y = 0;

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

				for (let i = 0; i < 10; i++) {
					ids.push(String(Math.random()));
				}

				const componentsArray = [
					{
						type: 1,
						components: [
							{ type: 2, label: 'x10', custom_id: ids[0], style: 1 },
							{ type: 2, label: '\u200b', custom_id: ids[1], emoji: { id: '1001533471023452270' }, style: 2 },
							{ type: 2, label: 'x50', custom_id: ids[2], style: 1 },
							{ type: 2, label: '\u200b', custom_id: ids[6], emoji: { id: '1025434642112856116' }, style: 2 },
							{ type: 2, label: '\u200b', custom_id: ids[9], emoji: { id: '1025712385866092594' }, style: 2 },
						],
					},
					{
						type: 1,
						components: [
							{ type: 2, label: '\u200b', custom_id: ids[3], emoji: { id: '1001533781880094721' }, style: 2 },
							{ type: 2, label: '\u200b', custom_id: ids[4], emoji: { id: '1001533779933921380' }, style: 2 },
							{ type: 2, label: '\u200b', custom_id: ids[5], emoji: { id: '1001533778210074635' }, style: 2 },
							{ type: 2, label: '\u200b', custom_id: ids[7], emoji: { id: '1025708958905806878' }, style: 2 },
							{ type: 2, label: '\u200b', custom_id: ids[8], emoji: { id: '1025711319506231316' }, style: 2 },
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

				const collector = await collectInteractions({
					client: bot,
					componentType: 2,
					filter: (_) => true,
				});

				collector.on('collect', async interaction => {
					await interaction.deferUpdate();

					if (!ids.includes(interaction.data.custom_id)) return;

					/** MOUSE SENSITIVITY INCREASEMENT */
					if (ids[0] === interaction.data.custom_id) {
						mouseModifier = 10;
					}

					if (ids[2] === interaction.data.custom_id) {
						mouseModifier = 50;
					}
					if (ids[6] === interaction.data.custom_id) {
						await move('click');
					}
					if (ids[9] === interaction.data.custom_id) {
						await page.keyboard.down('Control');
						await page.keyboard.press('A');
						await page.keyboard.up('Control');
						await page.keyboard.press('Backspace');
						return update(int, messageObject);
					}

					if (ids[1] === interaction.data.custom_id) {
						await move('up');
					}
					/** SECOND LINE OF BUTTONS */
					if (ids[3] === interaction.data.custom_id) {
						await move('left');
					}
					if (ids[4] === interaction.data.custom_id) {
						await move('down');
					}
					if (ids[5] === interaction.data.custom_id) {
						await move('right');
					}
					if (ids[7] === interaction.data.custom_id) {
						interaction.createMessage('Please type here your text, which will be typed in the browser.');
						return data.push({ id: interaction.member.id });
					}
					if (ids[8] === interaction.data.custom_id) {
						await page.keyboard.press('Enter');
						return update(int, messageObject);
					}


					wait(1000);
					update(int, messageObject);
				});
			}
		}
	});
	bot.connect();
};
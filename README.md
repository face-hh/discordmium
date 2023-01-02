# Discordmium

Warning: This is meant for self-use only. You should not host this and make it publicly available to users, as they have full control over a browser inside your PC, as well as network information and user agent.

## 🤨 ● What the hell is this?
Discordmium brings the Chromium browser instance in Discord, of course limited to the Discord API.

![image](https://user-images.githubusercontent.com/69168154/210166179-4cda39b1-a191-4dd0-85bd-51b12c670942.png)

## Installation

```shell
npm i discordmium
```

## Bot Creation
A bot account is required in order to run Discordmium. This is an easy process and will help you get set up.

1. Ensure you are logged in to the Discord website by clicking [here](https://discord.com/app).
2. Once logged in, visit the [Discord Developer Portal](https://discord.com/developers/applications).
3. Click the **New Application** button in the top right.
4. Give the application a name and agree to Discord's Developer ToS and Developer Policy.
5. Click **Create**.
6. On the left of the screen, click the **Bot** section.
7. Click the **Add Bot** button.
8. Confirm the creation of the bot by clicking the **Yes, do it!** button.
9. Congratulations! A bot has been created on your application. Just a little more configuration is needed.
10. Set the bot's profile picture if desired.
11. Scroll down until you see the **Message Content Intent** option and toggle it. (Remember to save your changes!)
12. Scroll back up and click **Reset Token**.
13. Confirm by clicking the **Yes, do it!** button.
14. Your bot's token will now be displayed. Don't share it with anyone, and keep it somewhere safe as it will be required for the bot to function!

Now that the bot has been set up, the token can now be used to run Discordmium!

## Usage

```javascript
const Browser = require('discordmium');

Browser(<DiscordToken>, <GuildId>, <RestartTime>)
/** Note - tokens and IDs should be strings "like this" */

/** DiscordToken - Get it from Discord Developers Portal */
/** RestartTime - (optional, default = 300000) The amount of ms to wait to restart the current browser and let other users run the command again */
```

## Running

```bash
node .
```

## License
Free use as long as credited.

## Hackathon
Documatic is a search engine for your codebase; Ask documatic a question and find relevant code snippets and insights in seconds.

https://www.documatic.com/
Documatic acts as a search engine for your codebase; once you describe what you're looking for, Documatic pulls up related code or documentation making it easier to find what you're looking for in seconds!

Not sitting next to each other? No problem. Ask Documatic questions of your codebase to learn and understand your code in seconds. Documatic is the team member you wish you had

Our Visual studio Code extension: https://marketplace.visualstudio.com/items?itemName=Documatic.documatic
https://cdn.discordapp.com/attachments/926110059782615071/1037404343470661713/Documatic_sh6hrz.gif

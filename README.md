# Discordmium

Warning: This is meant for self-use only. You should not host this and make it publicly available to users, as they have full control over a browser inside your PC, as well as network information and user agent.

## 🤨 ● What the hell is this?
Discordmium brings the Chromium browser instance in Discord, of course limited to the Discord API.

![image](https://user-images.githubusercontent.com/69168154/210166179-4cda39b1-a191-4dd0-85bd-51b12c670942.png)

## Installation

```shell
npm i discordmium
```

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

import Server from "./Server";
import fs from "node:fs";
import path from "node:path";
import { Interaction } from "discord.js";
import {
	Client,
	Collection,
	Events,
	GatewayIntentBits,
	SlashCommandBuilder,
} from "discord.js";
require("dotenv").config();
//invite link: https://discord.com/api/oauth2/authorize?client_id=1054440759094415390&permissions=133184&scope=bot

export type Command = {
	data: SlashCommandBuilder;
	execute: (interaction: Interaction) => void;
};

let server = new Server();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

export const commands: Collection<string, Command> = new Collection();

const commandsPath = path.join(__dirname, "commands");
const commandFiles = fs
	.readdirSync(commandsPath)
	.filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command: Command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ("data" in command && "execute" in command) {
		commands.set(command.data.name, command);
	} else {
		console.log(
			`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
		);
	}
}

client.once(Events.ClientReady, (c) => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;
	const command = commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: "There was an error while executing this command!",
			ephemeral: true,
		});
	}
});

client.login(process.env.DISCORD_TOKEN);

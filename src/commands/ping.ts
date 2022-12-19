import { SlashCommandBuilder, SlashCommandUserOption, User } from "discord.js";
import { Command } from "../index";
import Server from "../Server";

module.exports = {
	data: new SlashCommandBuilder()
		.setName("ping")
		.setDescription("Pings a given user")
		.addUserOption((option) =>
			option
				.setName("user")
				.setDescription("The user to ping")
				.setRequired(true)
		)
		.addStringOption((option) =>
			option
				.setName("message")
				.setDescription("The message to send the user")
				.setRequired(true)
		),
	async execute(
		interaction: {
			getString(name: string): string;
			getUser(name: string): User;
			reply: (message: string) => any;
		},
		server: Server
	) {
		server.send(
			interaction.getUser("user").id,
			interaction.getString("message")
		);
		await interaction.reply("Pong!");
	},
};

"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName("ping")
        .setDescription("Pings a given user")
        .addUserOption((option) => option
        .setName("user")
        .setDescription("The user to ping")
        .setRequired(true))
        .addStringOption((option) => option
        .setName("message")
        .setDescription("The message to send the user")
        .setRequired(true)),
    execute(interaction, server) {
        return __awaiter(this, void 0, void 0, function* () {
            server.send(interaction.getUser("user").id, interaction.getString("message"));
            yield interaction.reply("Pong!");
        });
    },
};

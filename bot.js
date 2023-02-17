const { Client } = require("discord.js");

const bot = new Client({ intents: ["Guilds"] });
console.log("Connexion au bot...");
bot.login("MTAwNDQ1MzM2MDgzOTE4NDUxNQ.GgtMS_.hDTuEhsSfkIwCrSNYLX8kiQ4ImHvCyy_2c9Uh8")
    .then(() => console.log("Connecté au bot !"))
    .catch((error) => console.log("Impossible de se connecter au bot - " + error));

bot.on("ready", async () => {
    await bot.application.commands.set([
        {
            name: "help",
            description: "Vous donne le discord du bot !"
        }
    ]);

    console.log("Le bot est prêt !");
});
bot.on("interactionCreate", (interaction) => {
    
    if (!interaction.isCommand()) return;

    if (interaction.commandName === "help")
        interaction.reply("Si vous avez besoin d'aide ! Venez sur mon serveur d'aide, faite un ticket et un Helper Va venir vous aidez !");
});
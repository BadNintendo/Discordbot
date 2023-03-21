const { Client, Events, REST, Routes, Collection, ActivityType, GatewayIntentBits, Partials, ActionRowBuilder, StringSelectMenuBuilder, ContextMenuCommandBuilder, EmbedBuilder, ApplicationCommandType } = require("discord.js");
const { clientId, guildId, token } = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');
const client = new Client({
	presence: {
		afk: false,
		activities: [{ name: `Bot by BN`, type: ActivityType.Watching }],
		status: 'dnd',
	},
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildIntegrations],
	partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}
client.once('ready', c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});
client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;
	if(interaction.commandName == 'ping') {
		const timeTaken = Date.now() - interaction.createdTimestamp;
		interaction.reply(`Pong! ${timeTaken}ms.`);
	}
	else if(interaction.commandName == 'diablo4') {
		const daysUntil = (year, month, day) => {
			var now = new Date(),
			dateEnd = new Date(year, month - 1, day),
			days = (dateEnd - now) / 1000/60/60/24;
			return Math.round(days);
		};
		const message = interaction.reply({ content: 'Diablo 4 Release Date Jun 06, 2023 remaining days are ('+daysUntil(2023,06,06)+')!', fetchReply: true });
	}
	else if (interaction.commandName == 'embedcreator') {
	}
});
client.on(Events.GuildMemberAdd, (member) => {
	const exampleEmbed = new EmbedBuilder()
	.setTitle('Welcome')
	.setDescription('Now, you may select roles to access member channels for different games. Kindly go to the <#1077756914848501910> and select a role.')
	.setAuthor({ name: 'Bot', iconURL: client.guilds.resolve('1023079512256282635').members.resolve('1072278798751510558').user.avatarURL(), url: 'https://discord.gg/rsXJtCXuhP' })
	.setColor('#0099ff')
	.addFields({ name: '\u200B', value: '<@'+member.user.id+'>' },)
	.setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
	.setTimestamp();
    member.guild.channels.cache.get('1065988581857972224').send({ embeds: [exampleEmbed] });
});
client.on(Events.MessageReactionRemove, async (reaction, user) => { //remove role reaction
	if (reaction.message.partial) await reaction.message.fetch();
		if (reaction.message.id === '1077757512910131210') { //msg id to watch for reations 
		const member = await reaction.message.guild.members.fetch(user.id);
		switch (reaction.emoji.id) {
			case '1072734547986358282': //diablo 3
				member.roles.remove('1072733191342936144');
				break;
			case '1077816147598119002': //diablo 2
				member.roles.remove('1077816441891475456');
				break;
			case '1077814966796693615': //last epoch
				member.roles.remove('1072733007183630497');
				break;
		}
	}
});
client.on(Events.MessageReactionAdd, async (reaction, user) => {  //remove role reaction
	if (reaction.message.partial) await reaction.message.fetch();
		if (reaction.message.id === '1077757512910131210') { //msg id to watch for reations 
		const member = await reaction.message.guild.members.fetch(user.id);
		switch (reaction.emoji.id) {
			case '1072734547986358282': //diablo 3
				member.roles.add('1072733191342936144');
				break;
			case '1077816147598119002': //diablo 2
				member.roles.add('1077816441891475456');
				break;
			case '1077814966796693615': //last epoch
				member.roles.add('1072733007183630497');
				break;
		}
	}
});
client.login(token);
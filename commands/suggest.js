const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageEmbed } = require('discord.js')

const channel_id = process.env.SUGGESTIONS

module.exports = {

    data: new SlashCommandBuilder()
        .setName('suggest')
        .setDescription('Suggest something to #suggestions')
        .addStringOption(option => option
            .setName('title')
            .setDescription('Your subject/idea/topic')
            .setRequired(true)
            .addChoices(
                { name: 'MH+ Web Extension', value: 'Extension' },
                { name: 'MH+ Mod', value: 'Mod' },
                { name: 'MH+ Discord Server', value: 'Discord' },
                { name: 'Other', value: 'Other' }
            ))
        .addStringOption(option => option
            .setName('input')
            .setDescription('Your suggestion')
            .setRequired(true)),
    async run(interaction) {

        const suggest = interaction.client
            .channels
            .cache
            .get(channel_id)

        if (!suggest) {
            return interaction.reply({
                content: 'Failed to create suggestion.',
                ephemeral: true
            })
        }

        const title = interaction.options.getString('title')
        const suggestion = interaction.options.getString('input')

        const embed = new MessageEmbed()
            .setTitle('Description')
            .setAuthor({
                name: interaction.user.tag,
                iconURL: interaction.user.avatarURL()
            })
            .setTimestamp(new Date())
            .setDescription(suggestion)
            .setFooter({
                text: `${interaction.user.id}`
            })


        await suggest.send({
            embeds: [embed]
        }).then((message) =>
            message.startThread({
                name: title,
                autoArchiveDuration: (60 * 24) * 7,
                reason: 'To discuss the suggestion attached to this thread.'
            })
        ).catch((error) => {
            interaction.reply({
                content: 'Failed suggestion',
                ephemeral: true
            })
            throw new Error(error)
        })

        interaction.reply({
            content: 'Completed suggestion.',
            ephemeral: true
        })
    }
}
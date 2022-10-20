const {MessageEmbed} = require("discord.js")

exports.run = (client,msg) => {
    try {
        msg.member.voice.channel.leave()
        client.connection = undefined
        msg.reply(
            new MessageEmbed()
                .setAuthor("ok bye")
                .setDescription(":wave_tone5:")
                .setColor(0xC03FC0)
        )
    } catch {
        msg.channel.send("um what")
    }  
}
exports.names = [
    "disconnect",
    "dc"
]
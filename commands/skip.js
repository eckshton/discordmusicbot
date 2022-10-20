const { MessageEmbed } = require("discord.js")

exports.run = (client,msg,args) => {
    if(!args[0]) {
        var prev = client.queue[0].name
        client.connection.player.dispatcher.destroy()
        msg.reply(
            new MessageEmbed()
                .setDescription("Skipped **" + prev + "**")
                .setColor(0x3FC0C0)
        )
    }
}
exports.names = [
    "skip",
    "s"
]
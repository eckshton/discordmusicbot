const { MessageEmbed } = require("discord.js")

exports.run = (client,msg,args) => {
    if(!Number(args[0])) {
        msg.reply(
            new MessageEmbed()
                .setDescription("that's not a number..........")
                .setColor(0x3FC0C0)
        )
        return
    }
    client.opts.volume = Number(args[0])
    client.connection.dispatcher.setVolumeLogarithmic(Number(args[0]))
    msg.reply(
        new MessageEmbed()
            .setDescription("set volume to **" + args[0] + "**")
            .setColor(0x3FC0C0)
    )
}
exports.names = [
    "volume",
    "vol",
    "v"
]
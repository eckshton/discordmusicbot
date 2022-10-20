const {MessageEmbed} = require("discord.js")

exports.run = (client,msg,args) => {
    if(!client.queue[0]) {
        msg.channel.send("no queue")
        return
    }
    client.opts.loop = !client.opts.loop
        
    msg.reply(
        new MessageEmbed()
            .setAuthor("Looping song: " + client.opts.loop)
            .setColor(0x3FC0C0)
    )
}
exports.names = [
    "repeat",
    "r"
]
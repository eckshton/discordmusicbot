const {MessageEmbed} = require("discord.js")

exports.run = (client,msg,args) => {
    if(!client.queue[0]) {
        msg.channel.send("no queue")
        return
    }
    client.opts.qloop = !client.opts.qloop
        
    msg.reply(
        new MessageEmbed()
            .setAuthor("Looping queue: " + client.opts.qloop)
            .setColor(0x3FC0C0)
    )
}
exports.names = [
    "repeatqueue",
    "rq"
]
const {MessageEmbed} = require("discord.js")

exports.run = (client,msg) => {
    var queue = ""

    client.queue.forEach((song,ind) => {
        queue += "**" + (ind+1)+":" + "** " + song.name + "\n"
    })

    queue = queue.slice(0,queue.length-1)

    msg.reply(
        new MessageEmbed()
            .setAuthor("Queue")
            .setColor(0x3FC0C0)
            .setDescription(queue)
    )
}
exports.names = [
    "queue",
    "q"
]
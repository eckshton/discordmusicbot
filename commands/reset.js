const {MessageEmbed} = require("discord.js")

exports.run = (client,msg) => {
    msg.reply(
        new MessageEmbed()
            .setAuthor("resetting")
            .setColor(0xC03F41)
    ).then(() => {
        process.exit(0)
    })
}
exports.names = [
    "reset",
    "r"
]
const { MessageEmbed } = require("discord.js")
const ytdl = require("ytdl-core")

exports.run = async (client,msg,args) => {
    var current = client.queue[0].url
    client.queue = client.queue.slice(1)

    ytdl.getInfo(current).then(deets => {
        if(deets.videoDetails.lengthSeconds < Number(args[0])) {
            msg.reply(
                new MessageEmbed()
                    .setDescription("That's longer than the video :o")
                    .setColor(0x3FC0C0)
            )
            return
        }

        if(current.includes("youtu")) {
            var audio = ytdl(current,{
                filter: 'audioonly',
                quality: 'highestaudio',
                opusencoded:true,
                highWaterMark: 1 << 25,
                dlChunkSize: 0
            })
            var name = deets.videoDetails.title
            client.queue.push({
                url:current,
                audio:audio,
                name:name,
                seek:Number(args[0])
            })
        }
        else {
            client.queue.unshift({
                name: current.split("/")[current.split("/").length-1].split(".")[0],
                url: current,
                audio: current,
                seek:Number(args[0])
            })
        }
    
        client.queue.unshift(1)
        client.connection.player.dispatcher.destroy()

        msg.reply(
            new MessageEmbed()
                .setDescription("Skipped **" + args[0] + " seconds** in")
                .setColor(0x3FC0C0)
        )
    })
}
exports.names = [
    "jump",
    "j",
    "seek"
]
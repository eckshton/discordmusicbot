const {MessageEmbed} = require("discord.js")
const ytdl = require("ytdl-core")
const ytsr = require("ytsr")
const ytpl = require("ytpl")

exports.run = async (client,msg,args) => {
    if(!msg.member.voice.channel) {
        msg.channel.send("u aren't in a vc :(")
        return
    }


    function play(song) {
        client.queue.push(song)
        msg.reply(
            new MessageEmbed()
                .setDescription("Added **" + song.name + "** to the queue")
                .setColor(0x3FC0C0)
        )
        client.play(msg.member.voice.channel,msg)
    }

    try {
        if(Array.from(msg.attachments)[0]) {
            play({
                name: Array.from(msg.attachments)[0][1].name.split(".")[0],
                url: Array.from(msg.attachments)[0][1].url,
                audio: Array.from(msg.attachments)[0][1].url
            })
        }
        else if(args[0].includes("playlist")) {
            var pl = await ytpl(args[0])
            pl.items.forEach(val => {
                var audio = ytdl(val.shortUrl,{
                    filter: 'audioonly',
                    quality: 'highestaudio',
                    opusencoded:true,
                    dlChunkSize: 0
                })
                client.queue.push({
                    url:args[0],
                    audio:audio,
                    name:val.title
                })
            })
            msg.reply(
                new MessageEmbed()
                    .setDescription("Added **" + pl.title + "** to the queue")
                    .setColor(0x3FC0C0)
            )
            client.play(msg.member.voice.channel,msg)
        }
        else if(args[0].includes("youtu")) {
            var audio = ytdl(args[0],{
                filter: 'audioonly',
                quality: 'highestaudio',
                opusencoded:true,
                highWaterMark: 1 << 25,
                dlChunkSize: 0
            })
            var name = (await ytdl.getBasicInfo(args[0])).videoDetails.title
            play({
                url:args[0],
                audio:audio,
                name:name
            })
        }
        else if(args[0].includes("http")) {
            var o = notr.split("/")[notr.split("/").length-1].split(".")
            play({
                name: o.slice(0,o.length-1).join(" "),
                url: args[0],
                audio:args[0]
            })
        }
        else if(!args[0]) {
            msg.channel.send("que")
        }
        else {
            var filt = await ytsr.getFilters(args.join(" "))
            var search = (await ytsr(filt.get('Type').get('Video').url,{limit:1})).items[0]
            
            var audio = ytdl(search.url,{
                filter: 'audioonly',
                quality: 'highestaudio',
                opusencoded:true,
                highWaterMark: 1 << 250,
                dlChunkSize: 0
            })
            play({
                url:search.url,
                audio:audio,
                name:search.title
            })
        }
    } catch {
        msg.channel.send("que")
    }
}
exports.names = [
    "play",
    "p"
]
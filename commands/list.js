const {MessageEmbed} = require("discord.js")
const fs = require("fs")
const ytdl = require("ytdl-core")
const ytsr = require("ytsr")
const ytpl = require("ytpl")

exports.run = (client,msg,args) => {
    function done(resp,write) {
        var embed = new MessageEmbed()
        if(resp.a) embed.setAuthor(resp.a)
        if(resp.d) embed.setDescription(resp.d)
        embed.setColor(0x3F3FC0)

        msg.reply(embed)
        if(write) {
            fs.writeFile("C:/ashgarbot/playlists.json",JSON.stringify(lists),err => {
                if(err) console.log(err)
            })
        }
    }
    commands = [
        {names:["add","a"],run:async () => {
            var l = lists[args[args.length-1]]
            
            if(!l) {
                l = []
            }

            if(Array.from(msg.attachments)[0]) {
                l.push({
                    name: Array.from(msg.attachments)[0][1].name.split(".")[0],
                    url: Array.from(msg.attachments)[0][1].url
                })
            }
            else if(notr.includes("playlist")) {
                var pl = await ytpl(notr)
                pl.items.forEach(val => {
                    l.push({
                        url:val.shortUrl,
                        name:val.title
                    })
                })

                lists[args[args.length-1]] = l
                done({
                    d:"Added **" + pl.title + "** to **" + args[args.length-1] + "**"
                },true)
                return
            }
            else if(notr.includes("youtu")) {
                var name = (await ytdl.getBasicInfo(notr)).videoDetails.title
                l.push({
                    url:notr,
                    name:name
                })
            }
            else if(notr.includes("http")) {
                var o = notr.split("/")[notr.split("/").length-1].split(".")
                l.push({
                    name: o.slice(0,o.length-1).join(" "),
                    url: notr
                })
            }
            else if(!notr) {
                msg.channel.send("que")
            }
            else {
                var search = (await ytsr(notr,{limit:1})).items[0]
                l.push({
                    url:search.url,
                    name:search.title
                })
            }

            lists[args[args.length-1]] = l
            done({
                d:"Added **" + l[l.length-1].name + "** to **" + args[args.length-1] + "**"
            },true)
        }},
        {names:["delete","del","d"],run:() => {
            if(notr) {
                var name = lists[args[arglen]][Number(notr)-1].name
                lists[args[arglen]].splice(Number(notr)-1,1)
                done({
                    d:"Removed **" + name + "** from **" + args[arglen] + "**"
                },true)
            } else {
                delete lists[args[arglen]]
                done({
                    d:"Deleted **" + args[arglen] + "**"
                },true)
            }
        }},
        {names:["view","v"],run:() => {
            if(!lists[args[arglen]]) {
                done({
                    d:"Put a name"
                })
                return
            }
            var contents = ""
            lists[args[arglen]].forEach((val,i) => {
                contents += "**"+(i+1)+":** " + val.name + "\n"
            })
            contents = contents.slice(0,contents.length-1)
            if(!contents) contents = "empty list"
            done({
                a:args[arglen],
                d:contents
            })
        }},
        {names:["viewall","va"],run:() => {
            var contents = ""
            Object.keys(lists).forEach(name => {
                contents += name + "\n"
            })
            contents = contents.slice(0,contents.length-1)
            if(!contents) contents = "no lists"
            done({
                a:"All Lists",
                d:contents
            })
        }},
        {names:["play","p"],run:() => {
            if(!lists[args[arglen]]) {
                done({
                    d:"That list is fake"
                })
                return
            }
            lists[args[arglen]].forEach(v => {
                if(v.url.includes("youtu")) {
                    var audio = ytdl(v.url,{
                        filter: 'audioonly',
                        quality: 'highestaudio',
                        opusencoded:true,
                        highWaterMark: 1 << 25,
                        dlChunkSize: 0
                    })
                    client.queue.push({
                        url:v.url,
                        audio:audio,
                        name:v.name
                    })
                }
                else {
                    client.queue.push({
                        name: v.url.split("/")[v.url.split("/").length-1].split(".")[0],
                        url: v.url,
                        audio:v.url
                    })
                }
            })
            client.play(msg.member.voice.channel,msg)
            done({
                d:"Added **" + args[arglen] + "** to the queue"
            })
        }}
    ]

    var lists
    var arglen = args.length-1
    var notr = args.slice(1,arglen).join(" ")

    fs.readFile("C:/ashgarbot/playlists.json",(err,data) => {
        if(err) console.log(err)

        lists = JSON.parse(String(data))
        commands.forEach(val => {
            val.names.forEach(name => {
                if(args[0] == name) {
                    val.run()
                    return
                }
            })
        })
    })
}
exports.names = [
    "list",
    "l"
]
const { Client } = require("discord.js")
const fs = require("fs")
const list = require("./commands/list")
const play = require("./commands/play")
const { token } = require("./config.json")

const client = new Client()
client.commands = {}
client.queue = []
client.playing = false
client.connection
client.opts = {
    loop:false,
    qloop:false,
    volume:100
}

client.play = async (vc,msg) => {
    function run(connection) {
        var prev = client.queue.shift()
        if(client.opts.loop) {
            client.queue.unshift(prev)
        }
        if(client.opts.qloop && !client.opts.loop) {
            client.queue.push(prev)
        }
        if(client.queue[0]) {
            if(!client.queue[0].seek) client.queue[0].seek = 0
            connection.play(client.queue[0].audio, {
                seek:client.queue[0].seek,volume:client.opts.volume/100
            }).on("close",() => {run(connection)})
        } 
        else {
            connection.disconnect()
            client.connection = undefined
        }
    }

    if(client.playing) return
    if(!vc) {
        msg.channel.send("u aren't in a vc :(")
        return
    }
    client.playing = true
    vc.join().then(connection => {
        client.connection = connection
        if(!client.queue[0]) {
            client.connection.disconnect()
            return
        }

        if(!client.queue[0].seek) client.queue[0].seek = 0
        connection.play(client.queue[0].audio, {
            seek:client.queue[0].seek,volume:client.opts.volume/100
        }).on("close",() => {run(connection)})

        client.connection.on("disconnect",() => {
            client.queue = []
            client.playing = false
            client.opts = {
                loop:false,
                qloop:false,
                volume:100
            }
        })
    })
}

client.on("message",(msg) => {
    if(msg.content[0]!="d") return
    var cmd = msg.content.split(" ")[0].slice(1)
    var args = msg.content.split(" "); args.shift()

    if(!client.commands[cmd]) { fs.readFile("./playlists.json",(err,data) => {
        if(err) {
            console.log(err)
            return
        }
        if(msg.channel.name != 'bot') return
        var lists = JSON.parse(String(data))

        if(lists[cmd]) {
            list.run(client,msg,["play",cmd])
        } else {
            play.run(client,msg,[cmd].concat(args))
        }
    })} else {
        client.commands[cmd](client,msg,args)
    }
})

client.on("ready",() => {
    console.log("Logged in")
})

fs.readdir("./commands",(err,files) => {
    files.forEach((val) => {
        var event = require("./commands/"+val)
        event.names.forEach((name) => {
            client.commands[name] = event.run
        })
    })
})

client.login(token)
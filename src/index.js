const { socket } = require('./connect')
const { prefix } = require("./constants")
const { getHelp } =  require ("./commands/help")
const { GroupUser, GroupInviteCode } = require("./commands/group")
const { getUserMessage, getUserCommandFromMessage, sendMessageWTyping } = require('./functions')

socket.ev.on('messages.upsert', async (m) => {
    const msg = m.messages[0]

    //Send Read Receipt
    await socket.sendReadReceipt(msg.key.remoteJid, msg.key.participant, [msg.key.id])

    //Only Read Messages with Prefix
    const { command, args } = getUserCommandFromMessage(prefix, getUserMessage(msg))
    const chat_or_group = msg.key.remoteJid.endsWith('@g.us') ? 'group' : 'chat'

    //Respond to messages which are NOT from Bot
    if(!(msg.key.fromMe)) {
        switch(command){
            case 'help':
                getHelp(msg, socket, prefix)
                break
            case 'add':
            case 'ban':
            case 'kick':
            case 'remove':
            case 'promote':
            case 'demote':
                GroupUser(command, args, msg, socket)                        
                break
            case 'getlink':
            case 'grouplink':
            case 'link':
                GroupInviteCode(msg, socket)
                break
            default:
                break
        }
    }
})
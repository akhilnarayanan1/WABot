const { socket } = require('./connect')
const { prefix } = require("./constants")
const { getUserMessage, getUserCommandFromMessage, sendMessageWTyping } = require('./functions')

socket.ev.on('messages.upsert', async (m) => {
    const msg = m.messages[0]

    //Send Read Receipt
    await socket.sendReadReceipt(msg.key.remoteJid, msg.key.participant, [msg.key.id])

    //Only Read Messages with Prefix
    const { command, args } = getUserCommandFromMessage(prefix, getUserMessage(msg))
    const chat_or_group = msg.key.remoteJid.endsWith('@g.us') ? 'group' : 'chat'

})
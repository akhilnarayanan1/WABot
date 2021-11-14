const { socket } = require('./connect')

socket.ev.on('messages.upsert', async (m) => {
    const msg = m.messages[0]

    //Send Read Receipt
    await socket.sendReadReceipt(msg.key.remoteJid, msg.key.participant, [msg.key.id])

})
const { socket } = require('./connect')

socket.ev.on('messages.upsert', async (m) => {
    // New Messages
    console.log(JSON.stringify(m, null, 2))
})
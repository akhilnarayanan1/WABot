let sock = undefined
const  filePath = './auth_info_multi.json'

const loadState = () => {
    const { readFileSync } = require('fs')
    const { BufferJSON, initInMemoryKeyStore } = require('@adiwajshing/baileys-md')
    let state = undefined
    try {
        const value = JSON.parse(
            readFileSync(filePath, { encoding: 'utf-8' }), 
            BufferJSON.reviver
        )
        state = { 
            creds: value.creds, 
            keys: initInMemoryKeyStore(value.keys) 
        }
    } catch{  }
    return state
}

const saveState = (state) => {
    const { writeFileSync } = require('fs')
    const { BufferJSON } = require('@adiwajshing/baileys-md')
    console.log('saving pre-keys')
    state = state || sock?.authState
    writeFileSync(filePath, JSON.stringify(state, BufferJSON.replacer, 2))
}

const startSock = () => {
    const { default: makeWASocket, DisconnectReason, delay } = require("@adiwajshing/baileys-md")
    const { default: P } = require("pino")
    const connSock = makeWASocket({
        logger: P({ level: 'trace' }),
        printQRInTerminal: true,
        auth: loadState()
    })
    connSock.ev.on('auth-state.update', () => saveState())
    connSock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update
        if(connection === 'close') {
            // reconnect if not logged out
            const shouldReconnect = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut;
            if(shouldReconnect) {
                await delay(5000)
                sock = startSock()
            } else {
                console.log('Connection Closed!')
            }
        }
        console.log('connection update', update)
    })
    return connSock
}

sock = startSock()

module.exports.socket = sock
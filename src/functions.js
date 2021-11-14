const getUserMessage = (msg) => {
    const type = Object.keys(msg.message)[0]
    let body = null
    switch(type){
        case 'conversation':
            body = msg.message.conversation
            break
        case 'imageMessage':
            body = msg.message.imageMessage.caption
            break
        case 'videoMessage':
            body = msg.message.videoMessage.caption
            break
        case 'extendedTextMessage':
            body = msg.message.extendedTextMessage.text
            break
        case 'buttonsResponseMessage':
            body = msg.message.buttonsResponseMessage.selectedDisplayText
            break
        case 'listResponseMessage':
            body= msg.message.listResponseMessage.title
            break
        default:
            body = null
            break
    }
    return body
}

const getUserCommandFromMessage = (prefix, body) => {
    let command = body?.startsWith(prefix) ? body?.slice(1).trim().split(/ +/).shift().toLowerCase():undefined
    const args = body?.startsWith(prefix) ? body?.trim().split(/ +/).slice(1):undefined
    return { command, args }
}

const sendMessageWTyping = async (msg, jid, socket, msgoptions={}) => {
    const { delay } = require('@adiwajshing/baileys-md')
    let delay1 = Math.floor((Math.random() * 500) + 300)
    let delay2 = Math.floor((Math.random() * 1500) + 1500)
    await socket.presenceSubscribe(jid)
    await delay(delay1)
    await socket.sendPresenceUpdate('composing', jid)
    await delay(delay2)
    await socket.sendPresenceUpdate('paused', jid)
    await socket.sendMessage(jid, msg, msgoptions)
}

const getGroupAdmins = (participants) => {
    let admins = []
    for (let i of participants) {
        (i.admin === 'admin' || i.admin === 'superadmin') ? admins.push(i.id) : ''
    }
    return admins
}

module.exports = {
    getUserMessage,
    getUserCommandFromMessage,
    sendMessageWTyping,
    getGroupAdmins
}
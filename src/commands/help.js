const chat_help = async (msg, socket, prefix) => { 
    return `${msg.pushName} - Sample help text for chat`
} 

const group_help = async (msg, socket, prefix) => {
    const metadata = await socket.groupMetadata(msg.key.remoteJid) 
    return `${metadata.subject} - Sample help text for group`
} 

const getHelp = async(msg, socket, prefix) => {
    const { sendMessageWTyping } = require('../functions')
    const chat_or_group = msg.key.remoteJid.endsWith('@g.us') ? 'group' : 'chat'
    const helpText = chat_or_group==='group' ? 
                     await group_help(msg, socket, prefix) : await chat_help(msg, socket, prefix)
    await sendMessageWTyping({text: helpText}, msg.key.remoteJid, socket)
} 


module.exports = { getHelp }
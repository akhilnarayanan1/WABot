import { errors } from "../constants"

import { sendMessageWTyping } from '../functions';

import { getGroupAdmins } from '../functions';

const getGroupInfo = async (msg: any, socket:any) => {

    const botNumber = `${socket.user.id.split(":")[0]}@s.whatsapp.net`
    const isGroup = msg.key.remoteJid.endsWith('@g.us') 
    const sender = isGroup ? msg.key.participant : msg.key.remoteJid
    const groupMetadata = isGroup ? await socket.groupMetadata(msg.key.remoteJid) : ''
    const groupName = isGroup ? groupMetadata.subject : ''
    const groupMembers = isGroup ? groupMetadata.participants : ''
    const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : ''
    const isBotGroupAdmin = groupAdmins.includes(botNumber) || false
    const isSenderGroupAdmin = groupAdmins.includes(sender) || false

    return {
        botNumber,
        isGroup,
        sender,
        groupMetadata,
        groupName,
        groupMembers,
        groupAdmins,
        isBotGroupAdmin,
        isSenderGroupAdmin
    }
}

const GroupUser = async (type:any, args:any, msg:any, socket:any) => {     
    const {isGroup, isBotGroupAdmin, isSenderGroupAdmin } = await getGroupInfo(msg, socket)

    type = (type === 'ban' || type === 'kick') ? 'remove' : type

    if (!isGroup) return;
    if (!isBotGroupAdmin){
        await sendMessageWTyping({text: errors.bot_admin_error}, msg.key.remoteJid, 
            socket, { quoted: msg })
        return
    }
    if (!isSenderGroupAdmin) {
        await sendMessageWTyping({text: errors.sender_admin_error}, msg.key.remoteJid, 
            socket, { quoted: msg })
        return;
    }
    

    let num = "";
    if (args.length > 1) {
        for (let j = 0; j < args.length; j++) {
            num = num + args[j]
        }
        num = `${num.replace(/ /g, '')}@s.whatsapp.net`
    } else {
        num = `${args[0].replace(/ /g, '')}@s.whatsapp.net`
    }
    if (num.startsWith('+')) {
        num = `${num.split('+')[1]}`
    }
    let numbers = []
    numbers.push(num)
    let response = await socket.groupParticipantsUpdate(
        msg.key.remoteJid,
        [num,],
        type
    )

    await sendMessageWTyping({text: `${JSON.stringify(response, undefined, 2)}`},
        msg.key.remoteJid, socket, { quoted: msg })
}


const GroupInviteCode = async(msg:any, socket:any) => {
    const {isGroup, isBotGroupAdmin} = await getGroupInfo(msg, socket)

    if (!isGroup) return;
    if (!isBotGroupAdmin){
        await sendMessageWTyping({text: errors.bot_admin_error}, msg.key.remoteJid, 
            socket, { quoted: msg })
        return
    }

    const code = await socket.groupInviteCode(msg.key.remoteJid)
    await sendMessageWTyping({text: `https://chat.whatsapp.com/${code}`}, 
        msg.key.remoteJid, socket, { quoted: msg, detectLinks: true })
}

export { 
    GroupUser,
    GroupInviteCode
}
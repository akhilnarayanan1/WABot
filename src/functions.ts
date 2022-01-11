import {delay} from "@adiwajshing/baileys-md";

const getUserMessage = (msg: any) => {
  const type = Object.keys(msg.message)[0];
  let body = null;
  switch (type) {
    case "conversation":
      body = msg.message.conversation;
      break;
    case "imageMessage":
      body = msg.message.imageMessage.caption;
      break;
    case "videoMessage":
      body = msg.message.videoMessage.caption;
      break;
    case "extendedTextMessage":
      body = msg.message.extendedTextMessage.text;
      break;
    case "buttonsResponseMessage":
      body = msg.message.buttonsResponseMessage.selectedDisplayText;
      break;
    case "listResponseMessage":
      body= msg.message.listResponseMessage.title;
      break;
    default:
      body = null;
      break;
  }
  return body;
};


const getUserCommandFromMessage = (prefix: any, body: any) => {
  const command = body?.startsWith(prefix) ? body?.slice(1).trim().split(/ +/).shift().toLowerCase():undefined;
  const args = body?.startsWith(prefix) ? body?.trim().split(/ +/).slice(1):undefined;
  return {command, args};
};


const sendMessageWTyping = async (msg: any, jid: any, socket: any, msgoptions={}) => {
  const delay1 = Math.floor((Math.random() * 500) + 300);
  const delay2 = Math.floor((Math.random() * 1500) + 1500);
  await socket.presenceSubscribe(jid);
  await delay(delay1);
  await socket.sendPresenceUpdate("composing", jid);
  await delay(delay2);
  await socket.sendPresenceUpdate("paused", jid);
  await socket.sendMessage(jid, msg, msgoptions);
};


const getGroupAdmins = (participants: any) => {
  let admins = [];
  for (const i of participants) {
    (i.admin === "admin" || i.admin === "superadmin") ? admins.push(i.id) : "";
  }
  return admins;
};

export {
  getUserMessage,
  getUserCommandFromMessage,
  sendMessageWTyping,
  getGroupAdmins,
};

import {startSock} from "./connect";
import {prefix} from "./constants";
import {GroupUser, GroupInviteCode} from "./commands/group";
import {getUserMessage, getUserCommandFromMessage, sendMessageWTyping} from "./functions";

const socket = startSock();

socket.ev.on("messages.upsert", async (m: any) => {
    const msg = m.messages[0];
  
    // Send Read Receipt
    await socket.sendReadReceipt(msg.key.remoteJid, msg.key.participant, [msg.key.id]);
  
    // Respond to messages which are NOT from Bot
    if (!(msg.key.fromMe)) {

      // Only Read Messages with Prefix
      const {command, args} = getUserCommandFromMessage(prefix, getUserMessage(msg));
      const chartOrGroup = msg.key.remoteJid.endsWith("@g.us") ? "group" : "chat";

      switch (command) {
        case "help":
          await sendMessageWTyping({text: `yoooooooo this works ${chartOrGroup} ${args}`}, msg.key.remoteJid, socket);
          break;
        case 'add':
        case 'ban':
        case 'kick':
        case 'remove':
        case 'promote':
        case 'demote':
            GroupUser(command, args, msg, socket)                        
            break;
        case 'getlink':
        case 'grouplink':
        case 'link':
            GroupInviteCode(msg, socket)
            break;
        default:
          break;
      }
    }
});
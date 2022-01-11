import {startSock} from "./connect";
import {prefix} from "./constants";
import {getUserMessage, getUserCommandFromMessage, sendMessageWTyping} from "./functions";

const socket = startSock();

socket.ev.on("messages.upsert", async (m: any) => {
    const msg = m.messages[0];
  
    // Send Read Receipt
    await socket.sendReadReceipt(msg.key.remoteJid, msg.key.participant, [msg.key.id]);
  
    // Only Read Messages with Prefix
    const {command, args} = getUserCommandFromMessage(prefix, getUserMessage(msg));
    const chartOrGroup = msg.key.remoteJid.endsWith("@g.us") ? "group" : "chat";
  
    // Respond to messages which are NOT from Bot
    if (!(msg.key.fromMe)) {
      switch (command) {
        case "help":
          await sendMessageWTyping({text: `yoooooooo this works ${chartOrGroup} ${args}`}, msg.key.remoteJid, socket);
          break;
        default:
          break;
      }
    }
});
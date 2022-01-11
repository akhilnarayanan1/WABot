import makeWASocket, {delay, DisconnectReason, useSingleFileAuthState} from "@adiwajshing/baileys-md";
import P from "pino";

const filePath = "./auth_info_multi.json";
const {state, saveState} = useSingleFileAuthState(filePath);

const startSock = () => {
  const connSock = makeWASocket({
    logger: P({level: "trace"}),
    printQRInTerminal: true,
    auth: state,
  });
  connSock.ev.on("creds.update", saveState);
  connSock.ev.on("connection.update", async (update: any) => {
    const {connection, lastDisconnect} = update;
    if (connection === "close") {
      // @ts-ignore
      const shouldReconnect = (lastDisconnect?.error)?.output?.statusCode !== DisconnectReason.loggedOut;
      console.log("connection closed due to ", lastDisconnect?.error, ", reconnecting ", shouldReconnect);
      // reconnect if not logged out
      if (shouldReconnect) {
        await delay(5000);
        startSock();
      } else {
        console.log("Connection Closed!", update);
      }
    } else if (connection === "open") {
      console.log("opened connection");
    }
  });
  return connSock;
};

export {startSock};

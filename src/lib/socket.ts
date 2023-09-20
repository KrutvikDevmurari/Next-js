import { Server } from "socket.io";
import cors from "cors";
import nextConnect from "next-connect";

const handler = nextConnect();

// Enable CORS
handler.use(cors());

handler.all((req, res) => {
   
});

export default handler;
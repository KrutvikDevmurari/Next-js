import { NextApiRequest, NextApiResponse } from 'next';
import { Server } from "socket.io";

export async function GET(req: NextApiRequest, res: any) {
    // Change the HTTP method to GET
    // req.method = "GET";

    // Create a new socket.io server
    const io = new Server(res.socket.server);

    // Event handler for client connections
    io.on("connection", (socket) => {
        const clientId = socket.id;
        console.log("A client connected.");
        console.log(`A client connected. ID: ${clientId}`);
        io.emit("client-new", clientId);

        // Event handler for receiving messages from the client
        socket.on("message", (data) => {
            console.log("Received message:", data);
        });

        // Event handler for client disconnections
        socket.on("disconnect", () => {
            console.log("A client disconnected.");
        });
    });

    // Set the socket.io server on the response object
    res.socket.server.io = io;

    // End the response
    res.end();
}
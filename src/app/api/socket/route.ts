import { NextApiRequest, NextApiResponse } from 'next';
import io from 'socket.io';

export default async function socket(req: NextApiRequest, res: NextApiResponse) {
    // Create a Socket.IO server
    const server = io(res.socket, { serveClient: false });

    // Listen for new connections
    server.on('connection', (socket: { on: (arg0: string, arg1: (message: any) => void) => void; }) => {
        // Handle events from the client
        socket.on('message', (message) => {
            // Broadcast the message to all other clients
            server.emit('message', message);
        });
    });

    // Close the Socket.IO server when the connection ends
    res.on('close', () => {
        server.close();
    });
}
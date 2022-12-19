import express from "express";
import http from "http";
import { Server as SocketServer, Socket } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server);

export default class Server {
	app: Express.Application;
	server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>;
	io: SocketServer;
	clients: Map<string, Socket>;

	constructor() {
		this.app = express();
		this.server = http.createServer(this.app);
		this.io = new SocketServer(this.server);
		this.server.listen(3000, this.handleBootup);
		this.io.on("connection", this.handleConnection);

		this.clients = new Map();
	}

	send(id: string, message: string) {
		if (!this.clients.has(id)) return;
		this.clients.get(id)!.emit("message", message);
	}

	handleBootup() {
		console.log("listening on *:3000");
	}

	handleConnection(socket: Socket) {
		console.log("a user connected: " + socket.id);

		socket.on("identify", (id: string) => {
			this.handleIdentify(socket, id);
		});
	}

	handleIdentify(socket: Socket, id: string) {
		if (this.clients.has(id)) {
			socket.send("failed identification");
			return;
		}
		this.clients.set(id, socket);
	}
}

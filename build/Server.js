"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server);
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.server = http_1.default.createServer(this.app);
        this.io = new socket_io_1.Server(this.server);
        this.server.listen(3000, this.handleBootup);
        this.io.on("connection", this.handleConnection);
        this.app.get("/", (_req, res) => {
            res.send("Hello world");
        });
        this.clients = new Map();
    }
    send(id, message) {
        if (!this.clients.has(id))
            return;
        this.clients.get(id).emit("message", message);
    }
    handleBootup() {
        console.log("listening on *:3000");
    }
    handleConnection(socket) {
        console.log("a user connected: " + socket.id);
        socket.emit("hello world", "this is data");
        socket.on("identify", (id) => {
            this.handleIdentify(socket, id);
        });
    }
    handleIdentify(socket, id) {
        if (this.clients.has(id)) {
            socket.send("failed identification");
            return;
        }
        this.clients.set(id, socket);
    }
}
exports.default = Server;

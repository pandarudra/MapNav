import { createServer } from "http";
import { env } from "./configs/env";
import { Server } from "socket.io";
import app from "./app";
import { setupSocket } from "./sockets/appSocket";

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

setupSocket(io);

const PORT = env.PORT;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

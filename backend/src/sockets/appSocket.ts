import { Server, Socket } from "socket.io";
import { findShortestPath } from "../services/graphService";

export const setupSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("find_path", (data: any) => {
      const { start, end } = data;
      console.log("Start:", start, "End:", end);

      const shortestPath = findShortestPath(start, end);
      console.log("Shortest Path:", shortestPath);
      io.emit("update_path", shortestPath);
    });
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

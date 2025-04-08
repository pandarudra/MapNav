import { Server, Socket } from "socket.io";
import { getRoute } from "../services/graphService";

export const setupSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);

    socket.on("find_path", async ({ start, end }: { start: any; end: any }) => {
      try {
        if (!start || !end) {
          socket.emit("update_path", []);
          return;
        }
        const routeData = await getRoute({
          s_lat: start.lat,
          s_lng: start.lng,
          e_lat: end.lat,
          e_lng: end.lng,
        });

        const coordinates = routeData.features[0].geometry.coordinates;
        const path = coordinates.map((coord: number[]) => ({
          lat: coord[1],
          lng: coord[0],
        }));

        socket.emit("update_path", path);
      } catch (error) {
        console.error("Error fetching route:", error);
        socket.emit("update_path", []);
      }
    });
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });
};

import { useState, useEffect, FC } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
  Popup,
} from "react-leaflet";
import io from "socket.io-client";
import "leaflet/dist/leaflet.css";

interface LatLng {
  lat: number;
  lng: number;
}

export const Mapview = () => {
  const [start, setStart] = useState<LatLng | null>(null);
  const [end, setEnd] = useState<LatLng | null>(null);
  const [path, setPath] = useState<LatLng[]>([]);

  const MapClickHandler: FC = () => {
    useMapEvents({
      click(e: { latlng: LatLng }) {
        if (!start) setStart(e.latlng);
        else if (!end) setEnd(e.latlng);
      },
    });
    return null;
  };

  useEffect(() => {
    const socket = io("http://localhost:3000");

    if (start && end) {
      socket.emit("find_path", { start, end });
    }

    const updatePath = (newPath: LatLng[]) => {
      setPath(newPath);
      console.log("New Path:", newPath);
    };

    socket.on("update_path", updatePath);

    return () => {
      socket.off("update_path", updatePath);
      socket.disconnect();
    };
  }, [start, end]);

  const resetMap = () => {
    setStart(null);
    setEnd(null);
    setPath([]);
  };

  return (
    <>
      <button
        onClick={resetMap}
        className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white border border-black px-4 py-2 shadow-md rounded-md hover:bg-gray-200 transition"
        style={{ zIndex: 1000 }}
      >
        Reset
      </button>

      <MapContainer
        center={{ lat: 20.5937, lng: 78.9629 }}
        zoom={5}
        style={{ height: "100vh", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <MapClickHandler />
        // start pt.
        {start && (
          <Marker position={start}>
            <Popup>Start</Popup>
          </Marker>
        )}
        // end pt.
        {end && (
          <Marker position={end}>
            <Popup>End</Popup>
          </Marker>
        )}
        // path line
        {path.length > 0 && <Polyline positions={path} color="blue" />}
      </MapContainer>
    </>
  );
};

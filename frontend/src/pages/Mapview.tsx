import { useState, useEffect, FC, useCallback } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvents,
  Popup,
} from "react-leaflet";
import { LatLngLiteral } from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";

const ORS_API_KEY = import.meta.env.VITE_ORS_API_KEY;

export const Mapview: FC = () => {
  const [start, setStart] = useState<LatLngLiteral | null>(null);
  const [end, setEnd] = useState<LatLngLiteral | null>(null);
  const [path, setPath] = useState<LatLngLiteral[]>([]);

  const MapClickHandler: FC = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        const clickedPoint: LatLngLiteral = { lat, lng };

        if (!start) setStart(clickedPoint);
        else if (!end) setEnd(clickedPoint);
        else {
          setStart(clickedPoint);
          setEnd(null);
          setPath([]);
        }
      },
    });
    return null;
  };

  const fetchRoute = useCallback(async () => {
    if (!start || !end) return;

    try {
      const res = await axios.post(
        "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
        {
          coordinates: [
            [start.lng, start.lat],
            [end.lng, end.lat],
          ],
        },
        {
          headers: {
            Accept:
              "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
            Authorization: ORS_API_KEY,
            "Content-Type": "application/json; charset=utf-8",
          },
        }
      );

      console.log("API Response:", res.data);
      const geometry = res.data.features[0].geometry.coordinates;
      const formattedPath: LatLngLiteral[] = geometry.map(
        (coord: number[]) => ({
          lat: coord[1],
          lng: coord[0],
        })
      );

      setPath(formattedPath);
    } catch (err) {
      console.error("Error fetching route:", err);
    }
  }, [start, end]);

  useEffect(() => {
    fetchRoute();
  }, [start, end, fetchRoute]);

  const resetMap = () => {
    setStart(null);
    setEnd(null);
    setPath([]);
  };

  return (
    <>
      <button
        onClick={resetMap}
        className="fixed bottom-6 right-6 bg-white border border-black px-4 py-2 shadow-md rounded-md hover:bg-gray-200 transition"
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

        {start && (
          <Marker position={start}>
            <Popup>Start</Popup>
          </Marker>
        )}

        {end && (
          <Marker position={end}>
            <Popup>End</Popup>
          </Marker>
        )}

        {path.length > 0 && <Polyline positions={path} color="blue" />}
      </MapContainer>
    </>
  );
};

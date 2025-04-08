import axios from "axios";
export const getRoute = async ({
  s_lat,
  s_lng,
  e_lat,
  e_lng,
}: {
  s_lat: number | null;
  s_lng: number | null;
  e_lat: number | null;
  e_lng: number | null;
}): Promise<any> => {
  try {
    const response = await axios.post(
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
      {
        coordinates: [
          [s_lng || 0, s_lat || 0],
          [e_lng || 0, e_lat || 0],
        ],
      },
      {
        headers: {
          Accept:
            "application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8",
          Authorization:
            "5b3ce3597851110001cf6248ee4a339c6aa14e80b34312b628897409", // Replace with actual key
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error:",
      error instanceof Error ? error.message : "Unknown error"
    );

    throw error;
  }
};

import React, { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

/* -------------------- Custom Icons -------------------- */
const createIcon = (color) =>
  new L.Icon({
    iconUrl: `/images/marker-icon-2x-${color}.webp`,
    shadowUrl: "/images/marker-shadow.webp",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

const blueIcon = createIcon("blue");
const greenIcon = createIcon("green");
const redIcon = createIcon("red");

/* -------------------- Curved Bezier Route Animation -------------------- */
const CurvedBezierRouting = ({ userLocation, offices }) => {
  const map = useMap();
  const animationRefs = useRef([]);

  useEffect(() => {
    if (!userLocation || !offices?.length || !map) return;

    // Remove previous layers
    map.eachLayer((layer) => {
      if (layer.customBezierRoute) map.removeLayer(layer);
    });

    animationRefs.current.forEach((id) => cancelAnimationFrame(id));
    animationRefs.current = [];

    const createCurve = (start, end, strength = 0.28) => {
      const [lat1, lng1] = start;
      const [lat2, lng2] = end;

      const controlLat = (lat1 + lat2) / 2 + strength * (lng2 - lng1);
      const controlLng = (lng1 + lng2) / 2 - strength * (lat2 - lat1);

      const curve = [];
      for (let t = 0; t <= 1; t += 0.02) {
        const x =
          (1 - t) ** 2 * lat1 + 2 * (1 - t) * t * controlLat + t ** 2 * lat2;
        const y =
          (1 - t) ** 2 * lng1 + 2 * (1 - t) * t * controlLng + t ** 2 * lng2;
        curve.push([x, y]);
      }
      return curve;
    };

    offices.forEach((office) => {
      if (!office.coords) return;

      const curve = createCurve(userLocation, office.coords);

      const line = L.polyline(curve, {
        color: "#999",
        weight: 3,
        opacity: 0.9,
      }).addTo(map);

      line.customBezierRoute = true;

      const bus = L.marker(curve[0], {
        icon: L.divIcon({
          html: "🚌",
          className: "vehicle-icon",
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        }),
      }).addTo(map);

      bus.customBezierRoute = true;

      let idx = 0;
      const animate = () => {
        idx = (idx + 1) % curve.length;
        bus.setLatLng(curve[idx]);
        const id = requestAnimationFrame(animate);
        animationRefs.current.push(id);
      };
      animate();
    });

    return () => {
      animationRefs.current.forEach((id) => cancelAnimationFrame(id));
      animationRefs.current = [];
      map.eachLayer((layer) => {
        if (layer.customBezierRoute) map.removeLayer(layer);
      });
    };
  }, [userLocation, offices, map]);

  return null;
};

/* -------------------- Quick Jump Buttons -------------------- */
const QuickJump = ({ offices, userLocation }) => {
  const map = useMap();

  const jump = (coords) => {
    if (coords) map.setView(coords, 13, { animate: true });
  };

  return (
    <div className="absolute top-3 right-3 bg-white shadow-md rounded-lg p-2 z-[1000] space-y-1 text-xs sm:text-sm">
      {offices?.map(
        (o, i) =>
          o.coords && (
            <p
              key={i}
              onClick={() => jump(o.coords)}
              className="cursor-pointer hover:text-yellow-600 font-medium"
            >
              📍 {o.name}
            </p>
          )
      )}
      {userLocation && (
        <p
          onClick={() => jump(userLocation)}
          className="cursor-pointer hover:text-red-600 font-medium"
        >
          🧍‍♂️ Your Location
        </p>
      )}
    </div>
  );
};

/* -------------------- Auto Fit Bounds -------------------- */
const FitBounds = ({ offices, userLocation }) => {
  const map = useMap();
  useEffect(() => {
    const points = [];
    offices?.forEach((o) => o.coords && points.push(o.coords));
    if (userLocation) points.push(userLocation);

    if (points.length > 0) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [offices, userLocation, map]);

  return null;
};

/* -------------------- Main Map Component -------------------- */
export default function ContactMap({ offices, userLocation }) {
  const center =
    offices?.[0]?.coords?.length === 2 ? offices[0].coords : [7.8731, 80.7718]; // Sri Lanka center

  return (
    <MapContainer
      center={center}
      zoom={9}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <QuickJump offices={offices} userLocation={userLocation} />
      <FitBounds offices={offices} userLocation={userLocation} />
      {userLocation && (
        <CurvedBezierRouting userLocation={userLocation} offices={offices} />
      )}

      {offices?.map(
        (office, i) =>
          office.coords && (
            <Marker
              key={i}
              position={office.coords}
              icon={
                office.name.toLowerCase().includes("corporate")
                  ? greenIcon
                  : blueIcon
              }
            >
              <Popup>
                <b>{office.name}</b>
                <br />
                {office.address}
              </Popup>
            </Marker>
          )
      )}

      {userLocation && <Marker position={userLocation} icon={redIcon} />}
    </MapContainer>
  );
}

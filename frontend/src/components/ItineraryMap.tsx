import React, { useEffect } from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { DayPlan } from '../types/travel';
import ReactDOMServer from 'react-dom/server';
import { FaPaintbrush, FaTree, FaLandmark, FaHotel } from 'react-icons/fa6';
import { FaPlateWheat } from 'react-icons/fa6';

const createIcon = (iconComponent: React.ReactElement) => {
  return L.divIcon({
    html: ReactDOMServer.renderToString(iconComponent),
    className: 'bg-transparent',
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

const icons: { [key: string]: L.DivIcon } = {
  museum: createIcon(<FaPaintbrush size={24} className="text-indigo-600" />),
  restaurant: createIcon(
    <FaPlateWheat size={24} className="text-orange-600" />
  ),
  park: createIcon(<FaTree size={24} className="text-green-600" />),
  attraction: createIcon(<FaLandmark size={24} className="text-purple-600" />),
  hotel: createIcon(<FaHotel size={24} className="text-red-600" />),
};

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const MapUpdater: React.FC<{ center: [number, number]; zoom: number }> = ({
  center,
  zoom,
}) => {
  const map = useMap();
  useEffect(() => {
    if (center[0] !== 0 && center[1] !== 0) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
};

const ItineraryMap: React.FC<{ itinerary: DayPlan[] }> = ({ itinerary }) => {
  if (!itinerary || itinerary.length === 0) {
    // Default view if no itinerary
    return (
      <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      </MapContainer>
    );
  }

  // Combine all activities and hotels to find the center
  const allPoints = itinerary.flatMap((day) =>
    [...day.activities, day.hotel]
      .filter((p) => p && p.lat && p.lng)
      .map((p) => ({ lat: p.lat, lng: p.lng }))
  );

  const center: [number, number] =
    allPoints.length > 0
      ? [
          allPoints.reduce((sum, p) => sum + p.lat, 0) / allPoints.length,
          allPoints.reduce((sum, p) => sum + p.lng, 0) / allPoints.length,
        ]
      : [0, 0];

  const routeLines = itinerary.flatMap((day) => {
    const dayPoints = [...day.activities, day.hotel]
      .filter((p) => p && p.lat && p.lng)
      .map((p) => [p.lat, p.lng] as [number, number]);
    return dayPoints
      .slice(1)
      .map(
        (point, index) =>
          [dayPoints[index], point] as [[number, number], [number, number]]
      );
  });

  return (
    <MapContainer
      center={center}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <MapUpdater center={center} zoom={12} />
      {itinerary.map((day) => (
        <React.Fragment key={day.id}>
          {day.activities.map((activity) => (
            <Marker
              key={activity.id}
              position={[activity.lat, activity.lng]}
              icon={icons[activity.type] || new L.Icon.Default()}
            >
              <Popup>
                <b>{activity.place}</b> ({activity.type})
                <br />
                {activity.description}
                <br />
                Cost: ${activity.cost}
              </Popup>
            </Marker>
          ))}
          {day.hotel && day.hotel.lat && (
            <Marker
              position={[day.hotel.lat, day.hotel.lng]}
              icon={icons.hotel}
            >
              <Popup>
                <b>Hotel: {day.hotel.name}</b>
                <br />
                Price: ${day.hotel.price}
              </Popup>
            </Marker>
          )}
        </React.Fragment>
      ))}
      <Polyline
        positions={routeLines}
        color="#3f51b5"
        weight={5}
        opacity={0.7}
      />
    </MapContainer>
  );
};

export default ItineraryMap;

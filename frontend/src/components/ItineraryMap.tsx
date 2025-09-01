import React from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { DayPlan } from '../types/travel';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

interface MapProps {
  itinerary: DayPlan[];
}

const ItineraryMap: React.FC<MapProps> = ({ itinerary }) => {
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
    [...day.activities, day.hotel].map((p) => ({ lat: p.lat, lng: p.lng }))
  );

  const centerLat =
    allPoints.reduce((sum, p) => sum + p.lat, 0) / allPoints.length;
  const centerLng =
    allPoints.reduce((sum, p) => sum + p.lng, 0) / allPoints.length;

  const routeLines = itinerary.flatMap((day) => {
    const dayPoints = [...day.activities, day.hotel].map(
      (p) => [p.lat, p.lng] as [number, number]
    );
    return dayPoints
      .slice(1)
      .map(
        (point, index) =>
          [dayPoints[index], point] as [[number, number], [number, number]]
      );
  });

  return (
    <MapContainer
      center={[centerLat, centerLng]}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {itinerary.map((day) => (
        <React.Fragment key={day.day}>
          {day.activities.map((activity, index) => (
            <Marker key={index} position={[activity.lat, activity.lng]}>
              <Popup>
                <b>{activity.place}</b> ({activity.type})<br />
                {activity.description}
                <br />
                Cost: ${activity.cost}
              </Popup>
            </Marker>
          ))}
          {day.hotel && (
            <Marker position={[day.hotel.lat, day.hotel.lng]}>
              <Popup>
                <b>Hotel: {day.hotel.name}</b>
                <br />
                Price: ${day.hotel.price}
              </Popup>
            </Marker>
          )}
        </React.Fragment>
      ))}
      <Polyline positions={routeLines} color="blue" />
    </MapContainer>
  );
};

export default ItineraryMap;

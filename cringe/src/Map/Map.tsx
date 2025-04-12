import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import axios, { AxiosError } from 'axios';
import L, { DivIcon, LatLngBounds} from 'leaflet';
import {renderToString} from "react-dom/server"


import scss from "./Map.module.scss";
import 'leaflet/dist/leaflet.css';
import { mapSettings } from './mapSettings';
import Icon from '../modified_icons/icon';
import { default_marker } from '../modified_icons/ICONS';

interface Location {
  id: number;
  name: string;
  lat: number;
  lon: number;
  type: string;
  subtype: string;
  description: string;
  inclusivity: number;
  rating: number;
  hasAdaptiveToilet: boolean;
  hasElevator: boolean;
  hasRamp: boolean;
  hasTactilePaving: boolean;
  onFirstFloor: boolean;
  //isClaster: boolean;
}

interface ApiResponse {
  data: Location[];
}

// Компонент для слідкування за змінами карти
const MapBoundsLogger: React.FC<{ onBoundsChange: (bounds: LatLngBounds) => void }> = ({ onBoundsChange }) => {
  useMapEvents({
    moveend: (e) => {
      const map = e.target;
      const bounds = map.getBounds();
      onBoundsChange(bounds);
    }
  });

  return null;
};

const customIcon : DivIcon = new DivIcon({
  html : renderToString(<Icon path={default_marker}/>)
})

const LocationData: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [mapBounds, setMapBounds] = useState<LatLngBounds | null>(null);


  // Запит при зміні меж карти
  useEffect(() => {
    if (mapBounds) {
      axios.get("http://localhost:8080/locations/filter?", {
        params: {
        }
      })
      .then((res: ApiResponse) => {
        setLocations(res.data);
      })
      .catch((err: AxiosError) => {
        console.error("Помилка при запиті з координатами:", err);
      });
    }
  }, [mapBounds]);

  // Визначаємо, чи є кластери
  //const hasClusters = locations.some(loc => loc.isClaster);

  // Фільтровані локації: або тільки кластери, або всі
  // const filteredLocations = hasClusters
  //   ? locations.filter(loc => loc.isClaster)
  //   : locations;

  const filteredLocations = locations;

  return (
    <MapContainer {...mapSettings} className={scss.mapContainer}>
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <MapBoundsLogger onBoundsChange={setMapBounds} />

      {filteredLocations.map(loc => (
        <Marker
          key={loc.id}
          position={[loc.lat, loc.lon]}
          icon= {customIcon}

        >
          <Popup>
            <strong>{loc.type}</strong><br />
            {loc.subtype}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default LocationData;

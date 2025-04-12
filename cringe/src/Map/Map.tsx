import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import axios, { AxiosError } from 'axios';
import L, { DivIcon, LatLngBounds } from 'leaflet';
import { renderToString } from "react-dom/server"

import scss from "./Map.module.scss";
import 'leaflet/dist/leaflet.css';
import { mapSettings } from './mapSettings';
import Icon from '../modified_icons/icon';
import { default_marker } from '../modified_icons/ICONS';
import { Location } from "../types/Location"
import { LocationInfoModal  } from "../modals/locationInfo"

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

const LocationData: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [mapBounds, setMapBounds] = useState<LatLngBounds | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);  // Тепер всередині компонента
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Запит при зміні меж карти
  useEffect(() => {
    if (mapBounds) {
      axios.get("http://localhost:8080/locations/filter?", {
        params: {
          latMin: mapBounds.getSouthWest().lat,
          latMax: mapBounds.getNorthEast().lat,
          lonMin: mapBounds.getSouthWest().lng,
          lonMax: mapBounds.getNorthEast().lng
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

  const customIcon: DivIcon = new L.DivIcon({
    html: renderToString(
      <Icon
        path={default_marker}
        style={{
          stroke: 'none',
          outline: 'none',
          background: 'transparent',
          display: 'block',
          color: '#333', // або інший колір
        }}
      />
    ),
    className: '', // дуже важливо
    iconSize: [30, 30], // або твої розміри
    iconAnchor: [15, 30], // налаштування позиції іконки
  });

  const openModal = (location: Location) => {
    setSelectedLocation(location);  // Встановлюємо вибрану локацію
    setIsModalOpen(true);            // Відкриваємо модальне вікно
  };

  const closeModal = () => {
    setIsModalOpen(false);  // Закриваємо модальне вікно
  };

  return (
    <div>
      <MapContainer {...mapSettings} className={scss.mapContainer}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <MapBoundsLogger onBoundsChange={setMapBounds} />

        {locations.map(loc => (
          <Marker
            key={loc.id}
            position={[loc.lat, loc.lon]}
            icon={customIcon}
            eventHandlers={{
              click: () => openModal(loc),  // Встановлюємо вибрану локацію при кліку
            }}
          >
            <Popup>
              <strong>{loc.type}</strong><br />
              {loc.subtype}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {
        isModalOpen && selectedLocation && (
          <LocationInfoModal
            location={selectedLocation}
            onClose={closeModal}
          />
        )
      }
    </div>
  );
};

export default LocationData;

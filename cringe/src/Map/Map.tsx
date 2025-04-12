import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';

import scss from "./Map.module.scss"

import 'leaflet/dist/leaflet.css';
import { mapSettings } from './mapSettings';

const Map: React.FC = () => {

  return (
    <MapContainer {...mapSettings} className={scss.mapContainer} >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
    </MapContainer>
  );
}

export default Map;

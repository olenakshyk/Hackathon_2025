import React from 'react';
import { MapContainer, Marker, TileLayer, ZoomControl } from 'react-leaflet';

import scss from "./Map.module.scss"

import 'leaflet/dist/leaflet.css';
import { mapSettings } from './mapSettings';
import CustomZoomButtons from './CustomControls';
import Icon from '../modified_icons/icon';
import { alien } from '../modified_icons/ICONS';
import { DivIcon } from 'leaflet';
import { renderToString } from 'react-dom/server';

const Map: React.FC = () => {

  const customIcon: DivIcon = new DivIcon({
    html : renderToString(<Icon path={alien} />)
  })

  return (
    <MapContainer {...mapSettings} className={scss.mapContainer} zoomControl={false} >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      />
      <CustomZoomButtons />
      <Marker position={[49.889003, 23.840990]} icon={customIcon}/>
    </MapContainer>
  );
}

export default Map;

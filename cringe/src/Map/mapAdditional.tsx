import L, { DivIcon, LatLngBounds, MapOptions } from "leaflet"
import { Claster } from "./types/Claster";
import { renderToString } from "react-dom/server";
import { default_marker } from "../modified_icons/ICONS";
import Icon from "../modified_icons/icon";

export const mapSettings: MapOptions = {
    maxBounds: [
        [44.0, 22.0], // південний-захід
        [53.0, 41.0], // північний-схід
    ],
    zoom: 7 ,
    center: [49.0, 31.0],
    minZoom: 6.5,
    maxZoom: 18,
    maxBoundsViscosity: 0.9,
    zoomControl: false,
}
  
export  const customIcon: DivIcon = new L.DivIcon({
    html: renderToString(

      <Icon
        path={default_marker}
        style={{
          stroke: 'none',
          outline: 'none',
          background: 'transparent',
          display: 'block',
          color: '#333',
        }}
      />
    ),
    className: '',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -35],
  });

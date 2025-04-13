import L, { DivIcon, MapOptions } from "leaflet"
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
  
import React, { useEffect, useRef, useState } from 'react';
import { MaptilerLayer } from '@maptiler/leaflet-maptilersdk';
import scss from "./Map.module.scss"

import 'leaflet/dist/leaflet.css';
import { mapSettings } from './mapSettings';
import L from 'leaflet';
import Icon from '../modified_icons/icon';
import { minus, plus, plus_minus, target } from '../modified_icons/ICONS';
import style from "../style.module.scss"
import Loading from './Loading';


const Map: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [loading, setLoading] = useState<Boolean>(true);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;
  
    mapInstance.current = L.map(mapRef.current, mapSettings)

    setTimeout(() => {
      setLoading(false)
    }, 5000);
    
    const mtLayer = new MaptilerLayer({
      apiKey: 'fndbosCWDMCazHqfNJKp',
      style: "https://api.maptiler.com/maps/01962b90-5229-7672-8f8f-131549661b39/style.json?key=fndbosCWDMCazHqfNJKp"
    });
    
    mapInstance.current.on('tileload', () => {
      setLoading(false);
    });
    mtLayer.addTo(mapInstance.current);

  }, []);
  

  return <div className={scss.mapContainer}>
    {loading ? <Loading /> : <></>}
    <div>
      <div ref={mapRef} className={scss.mapContainer} />
      <div className={scss.controls1}>
        <Icon path={plus} className={style.icon_btn + " " + style.icon_black + " " + scss.button} onClick={() => mapInstance.current ? mapInstance.current.zoomIn() : false} />
        <Icon path={minus} className={style.icon_btn + " " + style.icon_black + " " + scss.button} onClick={() => mapInstance.current ? mapInstance.current.zoomOut() : false} />
      </div>
      <div className={scss.controls2}>
        <Icon
          path={plus_minus}
          style={{ width: "2.9dvw", margin: "0.55dvw" }}
          className={style.icon_btn + " " + style.icon_black + " " + scss.button}
          onClick={() => (Math.random() * 10) > 5 ? (mapInstance.current ? mapInstance.current.zoomIn() : false) : mapInstance.current ? mapInstance.current.zoomOut() : false} />
        <Icon
          path={target}
          style={{ width: "2.9dvw", margin: "0.55dvw  " }}
          className={style.icon_btn + " " + style.icon_black + " " + scss.button}
          onClick={() => {
            const link = "tel:" + "+380977557070";
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  const x = position.coords.latitude;
                  const y = position.coords.longitude;
                  mapInstance.current ? mapInstance.current.flyTo([x, y], 16) : ""
                },
                (error) => {
                  window.location.href = link
                }
              );
            } else
              window.location.href = link
          }} />
      </div>
    </div>
  </div>;
}

export default Map;

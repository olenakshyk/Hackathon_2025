import React, { useEffect, useRef, useState } from 'react';
import { MaptilerLayer } from '@maptiler/leaflet-maptilersdk';
import scss from "./Map.module.scss"

import 'leaflet/dist/leaflet.css';
import { customIcon, mapSettings } from './mapSettings';
import L, { LatLngBounds, marker } from 'leaflet';
import Icon from '../modified_icons/icon';
import { minus, plus, plus_minus, target } from '../modified_icons/ICONS';
import style from "../style.module.scss"
import Loading, { MiniLoading } from './Loading';
import { Claster } from './types/Claster';
import axios, { AxiosError } from 'axios';
import { Location } from "./types/Location";
import { renderToString } from 'react-dom/server';







export interface ApiResponse {
  data: any[];
}

const handleResponse = (locations: Location[], clasters: Claster[], data: Location | Claster) => {
  if ('count' in data) {
    clasters.push(data);
  } else if ('name' in data && 'subtype' in data) {
    locations.push(data);
  }
};


const Map: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [loading, setLoading] = useState<Boolean>(true);
  const [flagLoading, setFlagLoading] = useState<Boolean>(false);

  const markersRef = useRef<L.Marker[]>([]);
  const [mapBounds, setMapBounds] = useState<LatLngBounds | null>(null);



  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    mapInstance.current = L.map(mapRef.current, mapSettings)

    //get coords
    mapInstance.current.on('moveend', () => {
      if (mapInstance.current) {
        const currentBounds = mapInstance.current.getBounds();
        setMapBounds(currentBounds)
      }
    });

    setTimeout(() => {
      setLoading(false)
    }, 5000);

    const mtLayer = new MaptilerLayer({
      apiKey: 'fndbosCWDMCazHqfNJKp',
      style: "https://api.maptiler.com/maps/01962b90-5229-7672-8f8f-131549661b39/style.json?key=fndbosCWDMCazHqfNJKp"
    });

    mtLayer.addTo(mapInstance.current);

  }, []);




  useEffect(() => {
    setFlagLoading(true)
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
        const newLocations: Location[] = [];
        const newClasters: Claster[] = [];
        res.data.forEach((item) => handleResponse(newLocations, newClasters, item));
        
        markersRef.current.forEach(marker => {
          if (mapInstance.current)
            mapInstance.current.removeLayer(marker);
        });
        
        markersRef.current = newLocations.map(loc => {
          if (!mapInstance.current) return null
          return L.marker([loc.lat, loc.lon], {
            icon: customIcon
          })
          .addTo(mapInstance.current)
          .bindPopup(() => renderToString(<>
                <strong>{loc.name}</strong><br />
                {loc.subtype}
              </>))
          }).filter(el => el !== null)
          
          
          
          markersRef.current = newClasters.map(claster => {
            if (!mapInstance.current) return null
            return L.marker([claster.lat, claster.lon], {
              icon: customIcon
            })
            .addTo(mapInstance.current)
            .bindPopup(`Об'єктів: ${claster.count}`)
            
          }).filter(el => el !== null)
          setFlagLoading(false)

          console.log(markersRef.current);
          
          
        })
        
        .catch((err: AxiosError) => {
          console.error("Помилка при запиті з координатами:", err);
        });
      }
  }, [mapBounds]);

  return <div className={scss.mapContainer}>
    {loading ? <Loading /> : <></>}
    {flagLoading ? <MiniLoading /> : <></>}
    <div>
      <div ref={mapRef} className={scss.mapContainer} />


      {/* controls */}
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

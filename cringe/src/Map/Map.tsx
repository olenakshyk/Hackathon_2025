import React, { useEffect, useRef, useState } from 'react';
import { MaptilerLayer } from '@maptiler/leaflet-maptilersdk';
import scss from "./Map.module.scss"

import 'leaflet/dist/leaflet.css';
import { customIcon, mapSettings } from './mapAdditional';
import L, { LatLngBounds } from 'leaflet';
import Icon from '../modified_icons/icon';
import { minus, plus, plus_minus, target } from '../modified_icons/ICONS';
import style from "../style.module.scss"
import Loading from './Loading';
import { Claster } from './types/Claster';
import axios, { AxiosError } from 'axios';
import { Marker, Popup } from 'react-leaflet';
import { Location } from "../../src/Map/types/Location";







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




  const [locations, setLocations] = useState<Location[]>([]);
  const [clasters, setClasters] = useState<Claster[]>([]);
  const [mapBounds, setMapBounds] = useState<LatLngBounds | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  


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
          setLocations(newLocations);
          setClasters(newClasters);
        })
        .catch((err: AxiosError) => {
          console.error("Помилка при запиті з координатами:", err);
        });
    }
  }, [mapBounds]);



  


  return <div className={scss.mapContainer}>
    {loading ? <Loading /> : <></>}
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


      {locations.map((loc, index) => (
          <Marker
            key={index}
            position={[loc.lat, loc.lon]}
            icon={customIcon}

            // eventHandlers={{
            //   click: () => openModal(loc),
            //   mouseover: (e) => {
            //     clearTimeout(closeTimeout); 

            //     openTimeout = setTimeout(() => {
            //       e.target.openPopup();
            //     }, 300);
            //   },
            //   mouseout: (e) => {

            //     closeTimeout = setTimeout(() => {
            //       e.target.closePopup();
            //     }, 1000);
            //   }
            // }}
          >
            <Popup closeOnClick={false}>
              <strong>{loc.name}</strong><br />
              {loc.subtype}
            </Popup>
          </Marker>
        ))}



                





{clasters.map((claster, index) => (
          <Marker
            key={index}
            position={[claster.lat, claster.lon]}
            icon={customIcon}
            // eventHandlers={{
            //   mouseover: (e) => {
            //     clearTimeout(closeTimeout); 

            //     openTimeout = setTimeout(() => {
            //       e.target.openPopup();
            //     }, 300);
            //   },
            //   mouseout: (e) => {

            //     closeTimeout = setTimeout(() => {
            //       e.target.closePopup();
            //     }, 1000);
            //   }
            // }}
          >
            <Popup
  closeOnClick={false}>
              {`Об'єктів: ${claster.count}`}
            </Popup>
          </Marker>
        ))}
        
    </div>
  </div>;
}

export default Map;

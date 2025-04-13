import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import axios, { AxiosError } from 'axios';
import L, { DivIcon, LatLngBounds } from 'leaflet';
import qs from 'qs';
import { renderToString } from "react-dom/server";

import scss from "./Map.module.scss";
import 'leaflet/dist/leaflet.css';
import Icon from '../modified_icons/icon';
import { default_marker } from '../modified_icons/ICONS';
import { Location } from "../types/Location";
import { LocationInfoModal } from "../modals/locationInfo";
import { Claster } from '../types/Claster';
import { mapSettings } from './mapSettings';
import { Ifilter } from '../App';
import { filters } from '../Panel/Filter/Filter';


interface ApiResponse {
  data: any[];
}

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

const handleResponse = (locations: Location[], clasters: Claster[], data: Location | Claster) => {
  if ('count' in data) {
    clasters.push(data);
  } else if ('name' in data && 'subtype' in data) {
    locations.push(data);
  }
};

const LocationData: React.FC<{ filter: Ifilter | undefined }> = ({ filter: filter }) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [clasters, setClasters] = useState<Claster[]>([]);
  const [mapBounds, setMapBounds] = useState<LatLngBounds | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location>();
  const [isModalOpen, setIsModalOpen] = useState(false);


  let openTimeout: ReturnType<typeof setTimeout>;
  let closeTimeout: ReturnType<typeof setTimeout>;



  useEffect(() => {
    if (mapBounds) {
      axios.get("http://localhost:8080/locations/filter?", {
        params: {
          latMin: mapBounds.getSouthWest().lat,
          latMax: mapBounds.getNorthEast().lat,
          lonMin: mapBounds.getSouthWest().lng,
          lonMax: mapBounds.getNorthEast().lng,
          features: filter?.features,
          subtypes: filter?.types
        },
        paramsSerializer: params => qs.stringify(params, { arrayFormat: "repeat" })
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
  }, [mapBounds, filter]);

  const customIcon = (type: string): DivIcon => {
    let color = '#333'
    let path = default_marker
    filters.byType.forEach((t, i) => {
      if (type == t){
        // color = filters.typeColors[i]
        // path = filters.typeIcons[i]
      }
    })


    return new L.DivIcon({
      html: renderToString(

        <Icon
          path={path}
          style={{
            stroke: 'none',
            outline: 'none',
            background: 'transparent',
            display: 'block',
            color: color,
            fill: color,
            // scale: type == '' ? 1.5 : 1
          }}
        />
      ),
      className: '',
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -35],
    });
  }

  const openModal = (loc: Location) => {
    setSelectedLocation(loc);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <MapContainer {...mapSettings} className={scss.mapContainer}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <MapBoundsLogger onBoundsChange={setMapBounds} />

        {locations.map((loc, index) => (
          <Marker
            key={index}
            position={[loc.lat, loc.lon]}
            icon={customIcon(loc.subtype)}

            eventHandlers={{
              click: () => openModal(loc),
              mouseover: (e) => {
                clearTimeout(closeTimeout);

                openTimeout = setTimeout(() => {
                  e.target.openPopup();
                }, 300);
              },
              mouseout: (e) => {

                closeTimeout = setTimeout(() => {
                  e.target.closePopup();
                }, 1000);
              }
            }}
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
            icon={customIcon('')}
            eventHandlers={{
              mouseover: (e) => {
                clearTimeout(closeTimeout);

                openTimeout = setTimeout(() => {
                  e.target.openPopup();
                }, 300);
              },
              mouseout: (e) => {

                closeTimeout = setTimeout(() => {
                  e.target.closePopup();
                }, 1000);
              }
            }}
          >
            <Popup
              closeOnClick={false}>
              {`Об'єктів: ${claster.count}`}
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {isModalOpen && selectedLocation && (
        <LocationInfoModal
          location={selectedLocation}
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default LocationData;
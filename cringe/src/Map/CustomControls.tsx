// CustomZoomButtons.tsx
import { useMap } from 'react-leaflet';
import React from 'react';
import scss from "./Map.module.scss"
import Icon from '../modified_icons/icon';
import { minus, plus, plus_minus, target } from '../modified_icons/ICONS';
import style from "../style.module.scss"




const CustomZoomButtons = () => {
    const map = useMap();


    return (<>
        <div className={scss.controls1}>
            <Icon path={plus} className={style.icon_btn + " " + scss.button} onClick={() => map.zoomIn()} />
            <Icon path={minus} className={style.icon_btn + " " + scss.button} onClick={() => map.zoomOut()} />
        </div>
        <div className={scss.controls2}>
            <Icon
                path={plus_minus}
                style={{ width: "2.9dvw", margin: "0.55dvw" }}
                className={style.icon_btn + " " + scss.button}
                onClick={() => (Math.random() * 10) > 5 ? (map.zoomIn()) : map.zoomOut()} />
            <Icon
                path={target}
                style={{ width: "2.9dvw", margin: "0.55dvw  " }}
                className={style.icon_btn + " " + scss.button}
                onClick={() => {
                    const link = "tel:" + "+380977557070";
                    if (navigator.geolocation) {

                        navigator.geolocation.getCurrentPosition(
                            (position) => {
                                const x = position.coords.latitude;
                                const y = position.coords.longitude;
                                map.flyTo([x, y], 16);
                            },
                            (error) => {
                                window.location.href = link
                            }
                        );
                    } else
                        window.location.href = link

                }} />
        </div>
    </>
    );
};

export default CustomZoomButtons;

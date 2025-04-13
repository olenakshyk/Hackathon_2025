import React from 'react';
import { Location } from "../types/Location"

export const LocationInfoModal: React.FC<{ location: Location; onClose: () => void }> = ({ location, onClose }) => {
    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '8px',
                maxWidth: '500px',
                width: '100%',
                boxShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}>
                <h2>{location.name}</h2>
                <p><strong></strong> {location.subtype}</p>
                <p><strong>Rating:</strong> {location.rating}</p>

                {location.hasAdaptiveToilet && <p><strong>✔ Адаптивний туалет</strong></p>}
                {location.hasElevator && <p><strong>✔ Ліфт:</strong></p>}
                {location.hasRamp && <p><strong>✔ Пандус</strong></p>}
                {location.hasTactilePaving && <p><strong>✔ Тактильна плитка:</strong></p>}
                {location.onFirstFloor && <p><strong>✔ На першому поверсі</strong></p>}
                <p><strong>Рівень інклюзивності: </strong> {location.inclusivity} / 4</p>
                <button onClick={onClose}>Закрити</button>
            </div>
        </div>
    );
};

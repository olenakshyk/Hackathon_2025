import React, { useEffect, useState } from 'react';
import { Location } from "../types/Location"
import axios from 'axios';
import ReactDOM from 'react-dom/client';
import scss from "./locationInfo.module.scss"

const root = ReactDOM.createRoot(document.getElementById('root')!);


interface ApiResponse {
    data: Review[];
}

interface Review {
    comment: string;
    rating: number;
    author: string;
}

const getReviews = async (id: number) => {
    try {
        const response = await axios.get<Review[]>(`http://localhost:8080/locations/${id}/reviews`);
        return response.data;
    } catch (error) {
        console.error('Error fetching reviews:', error);
        return [];
    }
}


export const LocationInfoModal: React.FC<{ location: Location; onClose: () => void }> = ({ location, onClose }) => {
    const [reviews, setReviews] = useState<Review[]>([]);


    useEffect(() => {
        const fetchReviews = async () => {
            const fetchedReviews = await getReviews(location.id);
            setReviews(fetchedReviews);
        };

        fetchReviews();
    }, []); 

    return (
        <div 
        className={scss.container}
        onClick={onClose}
        style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
        }}>
            <div 
                onClick={(e) => e.stopPropagation()}
                style={{
                    backgroundColor: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    maxWidth: '500px',
                    width: '100%',
                    maxHeight: '80vh', // Максимальна висота вікна
                    overflowY: 'auto',  // Вертикальна прокрутка при потребі
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

                
                <div>
                    <h3>Відгуки:</h3>
                    {reviews?.length > 0 ? (
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                        {reviews.map((review, index) => (
                            <li
                                key={index}
                                style={{
                                    border: '1px solid #ccc',
                                    borderRadius: '8px',
                                    padding: '12px',
                                    marginBottom: '10px',
                                    backgroundColor: '#f9f9f9',
                                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.05)'
                                }}
                            >
                                <p><strong>Автор:</strong> {review.author}</p>
                                <p><strong>Оцінка:</strong> {review.rating}</p>
                                <p><strong>Відгук:</strong> {review.comment}</p>
                            </li>
                        ))}
                    </ul>
                    
                    ) : (
                        <p>Відгуків немає</p>
                    )}
                </div>
            </div>
        </div>
    );
};

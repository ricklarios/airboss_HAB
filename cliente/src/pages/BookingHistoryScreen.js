import './css/booking-history-screen.css';
import { useEffect, useState } from 'react';
import axios from 'axios';

export const BookingHistoryScreen = () => {
    const idUser = localStorage.getItem('idUser');

    const [showResults, setShowResults] = useState(false);
    const [dataResults, setDataResults] = useState('');

    useEffect(() => {
        setShowResults(false);
        setDataResults('');
        const getUserBooking = async () => {
            const { data } = await axios.get(
                `http://localhost:3001/allBooking/${idUser}`
            );
            if (data) {
                setDataResults(data);
                console.log(data);
                // Si no hay resultados muestro aviso en pantalla
                if (data?.data?.data?.length === 0) {
                    console.log('No hay datos!!');
                    // setValues({
                    //     ...values,
                    //     info: 'No hay resultados con la búsqueda indicada.',
                    //     showInfo: true,
                    // });
                }
            }
        };
        setShowResults(true);
        getUserBooking();
    }, [idUser]);

    return (
        <div id='history-container'>
            <div id='history-window'>
                <h3 id='history-header'>Mis vuelos</h3>
                <ul id='history-ul-container'>
                    {dataResults &&
                    showResults &&
                    dataResults.status === 'ok' ? (
                        dataResults?.data?.map((booking) => (
                            <li key={booking.id} id='history-li'>
                                <p>{`Booking Code: ${booking.bookingCode}`}</p>
                                <p>{`Origen: ${booking.origin}`}</p>
                                <p>{`Destino: ${booking.destination}`}</p>
                                <p>{`Duración: ${booking.duration}`}</p>
                            </li>
                        ))
                    ) : (
                        <div className='sin-resultados'>
                            No hay vuelos que mostrar para este usuario
                        </div>
                    )}
                </ul>
            </div>
        </div>
    );
};

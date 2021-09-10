import './css/booking-history-screen.css';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { getSymbol } from '../helpers';

import { Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

export const BookingHistoryScreen = () => {
    const idUser = localStorage.getItem('idUser');

    const [showResults, setShowResults] = useState(false);
    const [dataHistoryResults, setDataResults] = useState('');

    const [values, setValues] = useState({
        info: '',
        showInfo: false,
    });

    function getMyDateTime(resultsDate) {
        // console.log(resultsDate);
        const dateTime = new Date(resultsDate);
        const date = dateTime.toLocaleDateString('es-ES');
        const time = dateTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });

        const myDate = [date, time];
        return myDate;
    }

    useEffect(() => {
        setShowResults(false);
        setDataResults('');
        const getUserBooking = async () => {
            const { data } = await axios.get(
                `http://localhost:3001/allBooking/${idUser}`
            );
            if (data) {
                setDataResults(data);
                console.log('data:::',data);
                // Si no hay resultados muestro aviso en pantalla
                if (data?.data?.length === 0) {
                    console.log('No hay datos!!');
                    setValues({
                        ...values,
                        info: 'No hay resultados con la búsqueda indicada.',
                        showInfo: true,
                    });
                }
            }
        };
        setShowResults(true);
        getUserBooking();
    }, [idUser]);

    const handleCloseOk = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setValues({ ...values, showInfo: false });
    };

    return (
        <div id='history-container'>
            <div id='history-window'>
                <h3 id='history-header'>Mis vuelos</h3>
                <ul id='history-ul-container'>
                    {dataHistoryResults &&
                    showResults &&
                    dataHistoryResults.status === 'ok' ? (
                        dataHistoryResults?.data?.map((booking) => (
                            <li key={booking.id} id='history-li'>
                                {/* <p>{`Booking Code: ${booking.bookingCode}`}</p> */}
                                <p>
                                    Fecha compra:{' '}
                                    {getMyDateTime(booking.createdAt)[0]} (
                                    {getMyDateTime(booking.createdAt)[1]})
                                </p>
                                <p>IDA:</p>
                                <p>
                                    Origen:{' '}
                                    {booking.itineraries[0].segments[0].origin}
                                </p>
                                <p>
                                    Destino:{' '}
                                    {
                                        booking.itineraries[0].segments[
                                            booking.itineraries[0].segments
                                                .length - 1
                                        ].destination
                                    }
                                </p>
                                <p>
                                    Escalas:{' '}
                                    {booking.itineraries[0].segments.length >= 2
                                        ? 'Si'
                                        : 'No'}
                                    {/* {booking.itineraries[0].segments.length >=
                                        2 ?? (
                                        <ul>
                                            {booking.itineraries[0].segments.map(
                                                (segment) => (
                                                    <li key={segment.segmentId}>
                                                        <p>
                                                            {segment.origin} '→'{' '}
                                                            {
                                                                segment.destination
                                                            }
                                                        </p>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    )} */}
                                </p>
                                <p>
                                    {booking.oneWay === 1
                                        ? 'Sólo Ida'
                                        : `Ida/Vuelta`}
                                </p>
                                <p>
                                    {booking.oneWay === 1
                                        ? 'Precio Final: '
                                        : 'Precio Ida/Vuelta: '}
                                    {booking.finalPrice}
                                    {getSymbol(booking.currency)}
                                </p>
                                <p>
                                    Salida:{' '}
                                    {
                                        getMyDateTime(
                                            booking.itineraries[0].segments[0].departure_datetime
                                        )[0]
                                    }{' '}
                                    (
                                    {
                                        getMyDateTime(
                                            booking.itineraries[0].segments[0].departure_datetime
                                        )[1]
                                    }
                                    )
                                </p>
                                <p>
                                    Llegada:{' '}
                                    {getMyDateTime(booking.arrival_datetime)[0]}{' '}
                                    (
                                    {getMyDateTime(booking.arrival_datetime)[1]}
                                    )
                                </p>
                            </li>
                        ))
                    ) : (
                        <div className='sin-resultados'>
                            No hay vuelos que mostrar para este usuario
                        </div>
                    )}
                </ul>
            </div>
            <Snackbar
                open={values.showInfo}
                autoHideDuration={5000}
                onClose={handleCloseOk}
            >
                <Alert onClose={handleCloseOk} severity='info'>
                    {values.info}
                </Alert>
            </Snackbar>
        </div>
    );
};

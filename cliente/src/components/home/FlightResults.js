import { useContext } from 'react';
import { getSymbol } from '../../helpers';
import { UserContext } from '../../routers/AppRouter';
import './css/flight-results.css';

import { parse } from 'iso8601-duration';
import { useHistory } from 'react-router-dom';
import airplane from '../../assets/airplane-vector.png';
import { CgAirplane } from 'react-icons/cg';

function FlightResults({ dataResults, oneWay, numAdults, numChilds }) {
    // console.log(dataResults);
    const { preferredCurrency } = useContext(UserContext);

    // console.log(dataResults.data.dictionaries.aircraft);
    function getMyCarrier(carrierCode) {
        const myCarrier =
            dataResults.data.dictionaries.carriers[`${carrierCode}`];
        return myCarrier;
    }
    function getMyAircraft(aircraft) {
        const myAircraft =
            dataResults.data.dictionaries.aircraft[`${aircraft}`];
        return myAircraft;
    }

    function getMyDateTime(resultsDate) {
        const dateTime = new Date(resultsDate);
        const date = dateTime.toLocaleDateString('es-ES');
        const time = dateTime.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });

        const myDate = [date, time];
        return myDate;
    }

    function formatDuration(duration) {
        const durationObj = parse(duration);
        return `${durationObj.hours}h ${durationObj.minutes}m`;
    }

    function stopSpots(num) {
        for (let i = 1; i <= num; i++) {
            return <span id='red-spot'></span>;
        }
    }

    function stopAirportsName(flightSegments) {
        let arrivalCities = '';
        if (flightSegments.length === 2) {
            return `  ${flightSegments[0].arrival.iataCode}`;
        } else {
            for (let i = 0; i < flightSegments.length - 1; i++) {
                if (i === 0) {
                    arrivalCities = ` ${flightSegments[i].arrival.iataCode}`;
                } else {
                    arrivalCities += `, ${flightSegments[i].arrival.iataCode}`;
                }
            }
            return arrivalCities;
        }
    }

    const history = useHistory();

    function handleSearch(flight) {
        const myCarrier = getMyCarrier(
            flight.itineraries[0].segments[0].carrierCode
        );
        const myAircraft = getMyAircraft(
            flight.itineraries[0].segments[0].aircraft.code
        );

        const myDuration = formatDuration(flight.itineraries[0]?.duration);

        const myReturnDuration =
            flight.itineraries.length > 1
                ? formatDuration(flight.itineraries[1].duration)
                : null;
        const myReturnCarrier =
            flight.itineraries.length > 1
                ? getMyCarrier(flight.itineraries[1].segments[0].carrierCode)
                : null;
        const myReturnAircraft =
            flight.itineraries.length > 1
                ? getMyAircraft(flight.itineraries[1].segments[0].aircraft.code)
                : null;

        const myFlightObject = {
            myCarrier,
            myAircraft,
            myDuration,
            myReturnDuration,
            myReturnCarrier,
            myReturnAircraft,
            ...flight,
        };

        history.push(`/pricing`, [myFlightObject]);
    }

    return (
        <ul id='results-list'>
            {dataResults?.data?.data?.map((flight) => (
                <li
                    key={flight.id}
                    className={
                        oneWay === 'true' ? 'results-li' : 'results-li-2'
                    }
                >
                    <div id='id-oneway-title'>
                        <span>IDA</span> <CgAirplane id='logo-ida' />
                    </div>
                    <div id='carrier-container'>
                        {getMyCarrier(
                            flight.itineraries[0].segments[0].carrierCode
                        )}
                    </div>

                    <div id='price-text-container'>Precio</div>
                    <div id='info-flight-container'>
                        <div className='date-time-container'>
                            <b>
                                {
                                    flight.itineraries[0].segments[0].departure
                                        ?.iataCode
                                }
                            </b>

                            {
                                <span>
                                    {
                                        getMyDateTime(
                                            flight.itineraries[0].segments[0]
                                                .departure?.at
                                        )[1]
                                    }
                                </span>
                            }

                            {
                                <span>
                                    {
                                        getMyDateTime(
                                            flight.itineraries[0].segments[0]
                                                .departure?.at
                                        )[0]
                                    }
                                </span>
                            }
                        </div>
                        <div id='info-flight'>
                            <div id='duration-container'>
                                {formatDuration(
                                    flight.itineraries[0]?.duration
                                )}
                            </div>
                            <div id='itineraries-container'>
                                <div id='itineraries-line'>
                                    {flight.itineraries[0].segments?.length > 1
                                        ? stopSpots(
                                              flight.itineraries[0]?.segments
                                                  .length
                                          )
                                        : null}
                                </div>
                                <img src={airplane} alt='' id='airplane-logo' />
                            </div>
                            <div id='itineraries-info'>
                                {flight.itineraries[0].segments?.length ===
                                1 ? (
                                    <div id='non-stop-text'>Vuelo directo</div>
                                ) : (
                                    <div id='exist-stop-text'>
                                        {flight.itineraries[0]?.segments
                                            .length === 2
                                            ? '1 escala '
                                            : `${
                                                  flight.itineraries[0]
                                                      ?.segments.length - 1
                                              } escalas `}
                                        <div id='stops-name'>
                                            {stopAirportsName(
                                                flight.itineraries[0]?.segments
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='date-time-container'>
                            {
                                <b>
                                    {
                                        flight.itineraries[0].segments[
                                            flight.itineraries[0]?.segments
                                                .length - 1
                                        ].arrival?.iataCode
                                    }
                                </b>
                            }

                            {
                                <span>
                                    {
                                        getMyDateTime(
                                            flight.itineraries[0]?.segments[
                                                flight.itineraries[0]?.segments
                                                    .length - 1
                                            ].arrival?.at
                                        )[1]
                                    }
                                </span>
                            }

                            {
                                <span>
                                    {
                                        getMyDateTime(
                                            flight.itineraries[0]?.segments[
                                                flight.itineraries[0].segments
                                                    .length - 1
                                            ].arrival?.at
                                        )[0]
                                    }
                                </span>
                            }
                        </div>
                    </div>
                    <div
                        id={
                            oneWay === 'true'
                                ? 'price-container'
                                : 'price-container-2'
                        }
                    >
                        {/* aca agregar los detalles del precio */}
                        <div id='price-details'>
                            <p>
                                {numAdults}{' '}
                                {Number(numAdults) === 1
                                    ? 'adulto: '
                                    : 'adultos: '}
                                {(
                                    flight.travelerPricings[0]?.price?.total *
                                    Number(numAdults)
                                ).toFixed(2)}
                                {getSymbol(preferredCurrency.currency)}
                            </p>
                            {numChilds > 0 && (
                                <p>
                                    {numChilds}{' '}
                                    {Number(numChilds === 1)
                                        ? 'niño/a: '
                                        : 'niños/as: '}
                                    {(
                                        flight.travelerPricings[numAdults]
                                            ?.price?.total * Number(numChilds)
                                    ).toFixed(2)}
                                    {getSymbol(preferredCurrency.currency)}
                                </p>
                            )}
                        </div>
                        <p>Incluye impuestos, tasas y cargos</p>
                        <p>
                            {flight.price?.total}
                            {getSymbol(preferredCurrency.currency)}
                        </p>
                        <div id='select-button-container'>
                            <button
                                id='select-button'
                                onClick={() => {
                                    handleSearch(flight);
                                }}
                            >
                                SELECCIONAR
                            </button>
                        </div>
                    </div>

                    {(oneWay === 'false' || !oneWay) && (
                        <>
                            <div id='id-no-oneway-title'>
                                <span>VUELTA</span> <CgAirplane id='logo-ida' />
                            </div>
                            <div id='carrier-container'>
                                {getMyCarrier(
                                    flight.itineraries[1]?.segments[0]
                                        ?.carrierCode
                                )}
                            </div>

                            <div id='info-flight-container'>
                                <div className='date-time-container'>
                                    <b>
                                        {
                                            flight.itineraries[1]?.segments[0]
                                                ?.departure?.iataCode
                                        }
                                    </b>

                                    {
                                        <span>
                                            {
                                                getMyDateTime(
                                                    flight.itineraries[1]
                                                        ?.segments[0].departure
                                                        ?.at
                                                )[1]
                                            }
                                        </span>
                                    }

                                    {
                                        <span>
                                            {
                                                getMyDateTime(
                                                    flight.itineraries[1]
                                                        ?.segments[0].departure
                                                        ?.at
                                                )[0]
                                            }
                                        </span>
                                    }
                                </div>
                                <div id='info-flight'>
                                    <div id='duration-container'>
                                        {formatDuration(
                                            flight.itineraries[1]?.duration
                                        )}
                                    </div>
                                    <div id='itineraries-container'>
                                        <div id='itineraries-line'>
                                            {flight.itineraries[1]?.segments
                                                .length > 1
                                                ? stopSpots(
                                                      flight.itineraries[1]
                                                          ?.segments.length
                                                  )
                                                : null}
                                        </div>
                                        <img
                                            src={airplane}
                                            alt=''
                                            id='airplane-logo'
                                        />
                                    </div>
                                    <div id='itineraries-info'>
                                        {flight.itineraries[1]?.segments
                                            .length === 1 ? (
                                            <div id='non-stop-text'>
                                                Vuelo directo
                                            </div>
                                        ) : (
                                            <div id='exist-stop-text'>
                                                {flight.itineraries[1]?.segments
                                                    .length === 2
                                                    ? '1 escala '
                                                    : `${
                                                          flight.itineraries[1]
                                                              ?.segments
                                                              .length - 1
                                                      } escalas `}
                                                <div id='stops-name'>
                                                    {stopAirportsName(
                                                        flight.itineraries[1]
                                                            ?.segments
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className='date-time-container'>
                                    {flight.itineraries[1]?.segments.length ===
                                    1 ? (
                                        <b>
                                            {
                                                flight.itineraries[1]
                                                    ?.segments[0].arrival
                                                    ?.iataCode
                                            }
                                        </b>
                                    ) : (
                                        <b>
                                            {
                                                flight.itineraries[1]?.segments[
                                                    flight.itineraries[1]
                                                        ?.segments.length - 1
                                                ].arrival?.iataCode
                                            }
                                        </b>
                                    )}

                                    {flight.itineraries[1]?.segments.length ===
                                    1 ? (
                                        <span>
                                            {
                                                getMyDateTime(
                                                    flight.itineraries[1]
                                                        ?.segments[0].arrival
                                                        ?.at
                                                )[1]
                                            }
                                        </span>
                                    ) : (
                                        <span>
                                            {
                                                getMyDateTime(
                                                    flight.itineraries[1]
                                                        ?.segments[
                                                        flight.itineraries[1]
                                                            .segments.length - 1
                                                    ].arrival?.at
                                                )[1]
                                            }
                                        </span>
                                    )}

                                    {flight.itineraries[1]?.segments.length ===
                                    1 ? (
                                        <span>
                                            {
                                                getMyDateTime(
                                                    flight.itineraries[1]
                                                        ?.segments[0].arrival
                                                        ?.at
                                                )[0]
                                            }
                                        </span>
                                    ) : (
                                        <span>
                                            {
                                                getMyDateTime(
                                                    flight.itineraries[1]
                                                        ?.segments[
                                                        flight.itineraries[1]
                                                            .segments.length - 1
                                                    ].arrival?.at
                                                )[0]
                                            }
                                        </span>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </li>
            ))}
        </ul>
    );
}

export default FlightResults;

import './css/search-box.css';
import { useContext, useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import CitySearch from './CitySearch';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {
    dateIsPrevious,
    handleClickOptionsSearch,
    formatDate,
} from '../../helpers';
import { FLIGHT_CLASSES, OPTIONS_SEARCH } from '../../constants';
import { UserContext } from '../../routers/AppRouter';

function SearchBox({ history, vertical }) {
    // Estados de los parametros de Busqueda
    const [numAdults, setNumAdults] = useState(1);
    const [numChilds, setNumChilds] = useState(0);
    const [originLocationCode, setOriginLocationCode] = useState({
        city: '',
        country: '',
    });
    const [destinationLocationCode, setDestinationLocationCode] = useState({
        city: '',
        country: '',
    });
    const [travelClass, setTravelClass] = useState('ECONOMY');
    const [oneWay, setOneWay] = useState(true);
    const [nonStop, setNonStop] = useState(true);
    const [crossBorderAllowed, setCrossBorderAllowed] = useState(false);
    const [departureDate, setDepartureDate] = useState('');
    const [returnDate, setReturnDate] = useState('');

    // Estado de las opciones de busqueda.
    const [optionsSearch, setOptionSearch] = useState({
        soloIda: true,
        idaYvuelta: false,
    });

    //Estado de la label en el select de clases/personas
    const [labelSelectClasses, setLabelSelectClasses] = useState('Turista');

    //Estado para mostrar opciones de los viajeros (adultos, niños y clase)
    const [showTravelersOptions, setshowTravelersOptions] = useState(false);

    // Estado para mostrar los errores en los campos de busqueda de fechas.
    const [showErrorDateDeparture, setShowErrorDateDeparture] = useState(false);
    const [showErrorDateReturn, setShowErrorDateReturn] = useState(false);

    // Extraigo el objeto con el valor del currency en el header.
    const { preferredCurrency } = useContext(UserContext);

    const querysHistory = `?currencyCode=${
        preferredCurrency.currency
    }&oneWay=${oneWay}&nonStop=${nonStop}&originLocationCode=${
        originLocationCode.city
    }&destinationLocationCode=${
        destinationLocationCode.city
    }&departureDate=${formatDate(departureDate)}&returnDate=${
        returnDate && formatDate(returnDate)
    }&numAdults=${numAdults}&numChilds=${numChilds}&crossBorderAllowed=${crossBorderAllowed}&travelClass=${travelClass}&maxFlightOffers=10`;

    //Manejador del boton de busqueda
    const handleSearch = (e) => {
        e.preventDefault();
        history.push(`/searches${querysHistory}`);
    };
    return (
        <div
            id={
                !vertical
                    ? 'searchbox-container'
                    : 'searchbox-container-vertical'
            }
        >
            {/* CONTENEDOR SOLO IDA, IDA Y VUELTA */}
            <div className='oneway-container'>
                {OPTIONS_SEARCH.map((option_search) => (
                    <button
                        className={`oneway-option-${option_search.id}`}
                        onClick={(e) => {
                            handleClickOptionsSearch(
                                e.target,
                                setOptionSearch,
                                setOneWay
                            );
                        }}
                        key={option_search.id}
                        value={option_search.value}
                    >
                        {option_search.value}
                    </button>
                ))}
            </div>

            {/* CONTENEDOR DEL LA CAJA DE BUSQUEDA */}
            <div className='searchbox-form-container'>
                <form
                    className={
                        !vertical ? 'searchbox-form' : 'searchbox-form-vertical'
                    }
                    onSubmit={handleSearch}
                >
                    <div
                        id={
                            !vertical
                                ? 'first-search-options'
                                : 'first-search-options-vertical'
                        }
                    >
                        <label>
                            <input
                                onChange={() => setNonStop(!nonStop)}
                                type='checkbox'
                            />
                            Con escalas
                        </label>
                        <div id='container-class-selector'>
                            <input
                                type='text'
                                readOnly
                                value={
                                    numAdults === 1 && numChilds === 0
                                        ? `${numAdults} adulto, ${labelSelectClasses}`
                                        : `${
                                              numAdults + numChilds
                                          } viajeros, ${labelSelectClasses}`
                                }
                                id='select-class-options'
                                onClick={(e) => {
                                    setshowTravelersOptions(true);
                                }}
                            />
                            {showTravelersOptions && (
                                <div id='class-adults-search'>
                                    <label htmlFor='class_options'>Clase</label>
                                    <select
                                        name='class_options'
                                        value={labelSelectClasses}
                                        onChange={(e) => {
                                            if (e.target.value === 'Turista') {
                                                setTravelClass('ECONOMY');
                                                setLabelSelectClasses(
                                                    'Turista'
                                                );
                                            }
                                            if (
                                                e.target.value ===
                                                'Turista Superior'
                                            ) {
                                                setTravelClass(
                                                    'PREMIUM_ECONOMY'
                                                );
                                                setLabelSelectClasses(
                                                    'Turista Superior'
                                                );
                                            }
                                            if (e.target.value === 'Business') {
                                                setTravelClass('BUSINESS');
                                                setLabelSelectClasses(
                                                    'Business'
                                                );
                                            }
                                            if (e.target.value === 'Primera') {
                                                setTravelClass('FIRST');
                                                setLabelSelectClasses(
                                                    'Primera'
                                                );
                                            }
                                        }}
                                    >
                                        {FLIGHT_CLASSES.map((flight_class) => (
                                            <option
                                                key={flight_class}
                                                value={flight_class}
                                            >
                                                {flight_class}
                                            </option>
                                        ))}
                                    </select>
                                    <label htmlFor='adults_options'>
                                        Adultos <span>(+16 años)</span>
                                    </label>
                                    <div className='adults-childs-container'>
                                        <div
                                            onClick={() =>
                                                numAdults !== 1
                                                    ? setNumAdults(
                                                          numAdults - 1
                                                      )
                                                    : setNumAdults(1)
                                            }
                                            className='button'
                                        >
                                            -
                                        </div>
                                        <input
                                            value={numAdults}
                                            type='text'
                                            readOnly
                                        />
                                        <div
                                            onClick={() =>
                                                setNumAdults(numAdults + 1)
                                            }
                                            className='button'
                                        >
                                            +
                                        </div>
                                    </div>
                                    <label htmlFor='adults_options'>
                                        Niños <span>(de 0 a 15 años)</span>
                                    </label>
                                    <div className='adults-childs-container'>
                                        <div
                                            onClick={() =>
                                                numChilds !== 0
                                                    ? setNumChilds(
                                                          numChilds - 1
                                                      )
                                                    : setNumChilds(0)
                                            }
                                            className='button'
                                        >
                                            -
                                        </div>
                                        <input
                                            value={numChilds}
                                            type='text'
                                            readOnly
                                        />
                                        <div
                                            onClick={() =>
                                                setNumChilds(numChilds + 1)
                                            }
                                            className='button'
                                        >
                                            +
                                        </div>
                                    </div>
                                    <div
                                        id='finish-selection-button-class-adults'
                                        onClick={() =>
                                            setshowTravelersOptions(false)
                                        }
                                    >
                                        Aceptar
                                    </div>
                                </div>
                            )}
                        </div>
                        <label>
                            <input
                                onChange={() =>
                                    setCrossBorderAllowed(!crossBorderAllowed)
                                }
                                type='checkbox'
                            />
                            Buscar vuelos cercanos
                        </label>
                    </div>

                    <div id='separation-line'></div>
                    <div
                        id={
                            !vertical
                                ? 'second-search-options'
                                : 'second-search-options-vertical'
                        }
                    >
                        <div id='input-origin'>
                            <CitySearch
                                label={'Seleccione el origen'}
                                setInput={setOriginLocationCode}
                            />
                        </div>
                        <div id='input-destination'>
                            <CitySearch
                                label={'Seleccione el destino'}
                                setInput={setDestinationLocationCode}
                            />
                        </div>
                        <div id='input-departure-date'>
                            <DatePicker
                                className='datepicker'
                                isClearable={false}
                                closeOnScroll={true}
                                placeholderText='Fecha de ida *'
                                dateFormat='yyyy/MM/dd'
                                selected={departureDate}
                                required
                                onChange={(date) => {
                                    setDepartureDate(date);
                                    //Evitamos que de error si no se ha seleccionado aun fecha de vuelta
                                    if(returnDate !== ""){
                                        if ( !dateIsPrevious(date, returnDate) && optionsSearch.idaYvuelta ) {
                                            setShowErrorDateDeparture(true);
                                        } else {
                                            setShowErrorDateDeparture(false);
                                            setShowErrorDateReturn(false);
                                        }
                                    }
                                }}
                            />

                            {showErrorDateDeparture && (
                                <div className='div-error'>
                                    La fecha de ida debe ser anterior
                                </div>
                            )}
                        </div>
                        <div id='input-return-date'>
                            <DatePicker
                                value={returnDate}
                                closeOnScroll={true}
                                isClearable={false}
                                required
                                placeholderText='Fecha de vuelta *'
                                disabled={optionsSearch.soloIda && true}
                                dateFormat='yyyy/MM/dd'
                                selected={!optionsSearch.soloIda && returnDate}
                                onChange={(date) => {
                                    setReturnDate(date);
                                    if (!dateIsPrevious(departureDate, date)) {
                                        setShowErrorDateReturn(true);
                                    } else {
                                        setShowErrorDateReturn(false);
                                        setShowErrorDateDeparture(false);
                                    }
                                }}
                            />

                            {showErrorDateReturn && (
                                <div className='div-error'>
                                    La fecha de vuelta debe ser posterior
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        id={
                            !vertical
                                ? 'search-button'
                                : 'search-button-vertical'
                        }
                    >
                        <FaSearch />
                        Buscar
                    </button>
                </form>
            </div>
        </div>
    );
}

export default SearchBox;

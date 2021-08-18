import './css/flight-selection-screen.css';
import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import FlightResults from '../components/home/FlightResults';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import { UserContext } from '../routers/AppRouter';
import { formatDate } from '../helpers';
import SearchBox from '../components/home/SearchBox';
import { AuthContext } from '../App';

const queryString = require('query-string');

export const FlightSelectionScreen = ({ history }) => {
    const idUser = localStorage.getItem('idUser');

    const [showResults, setShowResults] = useState(false);
    const [dataResults, setDataResults] = useState('');

    const location = useLocation();
    const { preferredCurrency } = useContext(UserContext);
    const { opacity } = useContext(AuthContext);

    //Extraigo los valores separados de las querys de busqueda.
    const {
        oneWay,
        nonStop,
        originLocationCode,
        destinationLocationCode,
        departureDate,
        returnDate,
        numAdults,
        numChilds,
        crossBorderAllowed,
        travelClass,
    } = queryString.parse(location.search);

    let querysAPI = `?currencyCode=${
        preferredCurrency.currency
    }&oneWay=${oneWay}&nonStop=${nonStop}&originLocationCode=${originLocationCode}&destinationLocationCode=${destinationLocationCode}&departureDate=${formatDate(
        departureDate
    )}&returnDate=${returnDate}&numAdults=${numAdults}&numChilds=${numChilds}&crossBorderAllowed=${crossBorderAllowed}&travelClass=${travelClass}&maxFlightOffers=10`;

    useEffect(() => {
        setShowResults(false);
        setDataResults('');
        history.push(`/searches${querysAPI}`);
        const getFlights = async () => {
            const { data } = await axios.post(
                `http://localhost:3001/searches${querysAPI}`,
                { idUser: idUser }
            );

            if (data) {
                setDataResults(data);
                console.log(data);
            }
        };

        setShowResults(true);

        getFlights();
    }, [querysAPI, history]);

    const useStyles = makeStyles((theme) => ({
        root: {
            position: 'absolute',
            top: '10%',
            width: '100%',
            zIndex: '2000',
            '& > * + *': {
                marginTop: theme.spacing(2),
            },
        },
    }));
    const classes = useStyles();

    return (
        <div id='searches-container-all' style= {opacity}>
            <div id='searches-container'>
                {showResults && !dataResults && (
                    <LinearProgress className={classes.root} />
                )}
                {showResults && dataResults && (
                    <div id='flight-screen-results'>
                        <SearchBox history={history} vertical={true} />
                        <FlightResults
                            dataResults={dataResults}
                            oneWay={oneWay}
                            numAdults={numAdults}
                            numChilds={numChilds}
                        />
                        <div>aca va algo</div>
                    </div>
                )}
            </div>
        </div>
    );
};

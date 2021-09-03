import { useLocation } from 'react-router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import './css/selected-flight-details.css';
import SearchBox from '../components/home/SearchBox';
import { PoisDestinations } from '../components/utilities/PoisDestinations';

import SelectedFlightInfo from '../components/home/SelectedFlightInfo';

export const SelectedFlightDetailsScreen = ({ history }) => {
    const selectedFlight = useLocation().state[0];

    console.log(useLocation());

    const {
        myCarrier,
        myAircraft,
        myDuration,
        myReturnDuration,
        myReturnCarrier,
        myReturnAircraft,
    } = selectedFlight;
    const destinationLocationCode =
        selectedFlight.itineraries[0].segments[0].arrival.iataCode;

    const [dataResults, setDataResults] = useState('');
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        setShowResults(false);
        setDataResults('');
        const getPricing = async () => {
            const flightPrincingObject = {
                data: {
                    type: 'flight-offers-pricing',
                    flightOffers: [{ ...selectedFlight }],
                },
            };
            const { data } = await axios.post(
                `http://localhost:3001/pricing`,
                flightPrincingObject
            );
            if (data) {
                setDataResults({
                    myCarrier,
                    myAircraft,
                    myDuration,
                    myReturnDuration,
                    myReturnCarrier,
                    myReturnAircraft,
                    ...data,
                });
            }
        };
        getPricing();
        setShowResults(true);
    }, [
        selectedFlight,
        myCarrier,
        myAircraft,
        myDuration,
        myReturnDuration,
        myReturnCarrier,
        myReturnAircraft,
    ]);

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
        <div id='selected-flight-info-container-all'>
            {showResults && !dataResults && (
                <LinearProgress className={classes.root} />
            )}
            {showResults && dataResults && (
                <SelectedFlightInfo dataResults={dataResults} />
            )}
        </div>
    );
};

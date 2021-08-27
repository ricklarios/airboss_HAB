import { useLocation } from 'react-router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import LinearProgress from '@material-ui/core/LinearProgress';
import { makeStyles } from '@material-ui/core/styles';
import './css/selected-flight-details.css';

import SelectedFlightInfo from '../components/home/SelectedFlightInfo';
import { Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

export const SelectedFlightDetailsScreen = ({ history }) => {
    const selectedFlight = useLocation().state[0];
    const [values, setValues] = useState({
        info: '',
        showInfo: false,
    });
    const {
        myCarrier,
        myAircraft,
        myDuration,
        myReturnDuration,
        myReturnCarrier,
        myReturnAircraft,
    } = selectedFlight;

    const [dataResults, setDataResults] = useState('');
    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        setShowResults(false);
        setDataResults('');
        setValues({...values, showInfo: true, info: 'Recuerda que debes confirmar pasajeros y realizar pago para confirmar tu reserva'});
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
    const handleCloseOk = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setValues({...values, showInfo: false});
    };
    return (
        <div id='selected-flight-info-container-all'>
            {showResults && !dataResults && (
                <LinearProgress className={classes.root} />
            )}
            {showResults && dataResults && (
                <SelectedFlightInfo dataResults={dataResults} />
            )}
            <Snackbar open={values.showInfo} autoHideDuration={5000} onClose={handleCloseOk}>
                    <Alert onClose={handleCloseOk} severity="info">
                    {values.info}
                    </Alert>
                </Snackbar>
        </div>
    );
};

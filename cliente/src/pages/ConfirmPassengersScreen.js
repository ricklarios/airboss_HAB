import { useLocation } from 'react-router';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import './css/selected-flight-details.css';
import PasesengersForm from '../components/passengers/passengers-form';
import { Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import PassengersForm from '../components/passengers/passengers-form';

export const ConfirmPassengersScreen = ({ history }) => {
    // const selectedFlight = useLocation().state[0];
    const [values, setValues] = useState({
        info: '',
        showInfo: false,
    });
    const [travelersInfo, setTravelersInfo] = useState(null);
    const data = useLocation();
    if (travelersInfo === null){
        console.log('ENTRO EN IF');
        //setTravelersInfo("HOLA");
        console.log(data);
        const travelers = data.state.data.data.flightOffers[0].travelerPricings.map ((e) => (
            {travelerId: e.travelerId,
             typePassenger: e.travelerType, 
             typeSeat: e.fareOption,
             travelerValidate: false,
             name: "",
             lastname: "",}));
        setTravelersInfo(travelers);
        
    };
            
    useEffect(() => {
        setValues({...values, showInfo: true, info: 'Recuerda que debes confirmar pasajeros y realizar pago para confirmar tu reserva'});
        
    }, []);

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
        setValues({...values, showOk: false});
    };
    
    return (
        <div id='selected-flight-info-container-all'>
            <PassengersForm travelersInfo={travelersInfo}/>
            <Snackbar open={values.showOk} autoHideDuration={5000} onClose={handleCloseOk}>
                    <Alert onClose={handleCloseOk} severity="info">
                    {values.ok}
                    </Alert>
            </Snackbar>
        </div>
    );
};

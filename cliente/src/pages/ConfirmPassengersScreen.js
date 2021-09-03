import { useLocation } from 'react-router';
import { useState, useEffect, useContext, createContext } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import './css/ConfirmPassengersScreen.css'
import { Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import PassengersForm from '../components/passengers/passengers-form';
import EditIcon from '@material-ui/icons/Edit';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { green, red } from '@material-ui/core/colors';
import Tooltip from '@material-ui/core/Tooltip';
import { Fab } from '@material-ui/core';
import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import { AuthContext } from '../App';
require('dotenv').config();

export const TravelersContext = createContext(null);
export const ConfirmPassengersScreen = ({ history }) => {
    const {
        setShowForm,
        setAnimation,
        opacity,
        setOpacity,
        setShowRegisterForm,
        setRestorePasswordForm,
        showForm,
        showRegisterForm,
    } = useContext(AuthContext);
    const [values, setValues] = useState({
        info: '',
        showInfo: false,
        ok: '',
        showOk: false,
    });
    const [travelersInfo, setTravelersInfo] = useState(null);
    const [showEditTravelerForm, setShowEditTravelerForm] = useState(false);
    const [currentTraveler, setCurrentTraveler] = useState(null);
    const [bookingDone, setBookingDone] = useState(false);
    const data = useLocation();

    if (travelersInfo === null){
        // console.log(data);
        // console.log(data.state[0].data.data.flightOffers[0].travelerPricings);
        const travelers = data?.state[0]?.data?.data?.flightOffers[0].travelerPricings.map ((e) => (
            {id: e.travelerId,
             typePassenger: e.travelerType, 
             typeSeat: e.fareOption,
             validate: false,
             documents: [],
             name: "",
             lastname: "",}));
        setTravelersInfo(travelers);
        
    };
    let price = data?.state[0]?.data?.data?.flightOffers[0]?.travelerPricings[0]?.price?.total;
    useEffect(() => {
        setValues({...values, showInfo: true, info: 'Recuerda que debes confirmar pasajeros y realizar pago para confirmar tu reserva'});
    }, [travelersInfo]);

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
    const handleCloseInfo = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setValues({...values, showInfo: false});
    };
    function editTraveler (id){
        setAnimation('animate__backInDown');
        setCurrentTraveler(id);
        setShowEditTravelerForm(true);
        setOpacity({
            opacity: 0.5,
        });
    }


    async function paymentSuccess (details){
        setValues({...values, showOk: true, ok: 'Pago realizado correctamente', disabledPDF: false});
        try {
            const body = {
                idUser: localStorage.getItem('idUser'),
                flightObject: data.state[0].data.data.flightOffers[0],
                travelers: travelersInfo,
            };
            const res = await axios.post('http://localhost:3001/booking',body);
            console.log(res);
            if (res?.data?.data?.data?.id){
                setBookingDone(true);
                setValues({...values, showOk: true, ok: 'Reserva Confirmada'});
            }else if(res?.data?.data?.message?.code === 'ClientError'){
                setValues({...values, showInfo: true, info: 'No se ha podido completar la reserva'});
            }
        } catch (error) {
            setValues({...values, showInfo: true, info: 'No se ha podido completar la reserva'});
            // console.log(error);
        }
    }

    return (
        <TravelersContext.Provider 
            value={{travelersInfo, setTravelersInfo, setShowEditTravelerForm}}>
            <div id='selected-flight-info-container-all' style={opacity}>
                {showEditTravelerForm && <PassengersForm travelersInfo={travelersInfo} currentTraveler={currentTraveler}/>}
                <div className= "passengers-form">
                    <div id="passengers">Listado de pasajeros</div>
                    <div id="passengers-titles">
                        <span>Identificación</span>
                        <span>Nombre</span>  
                    </div> 
                    {travelersInfo?.map((e)=>{
                        return(
                            <div className="list-travelers" key={e.id}>
                               <span>{e?.documents[0]?.number || ''}</span> <span>{e.name.firstName || 'DEBES COMPLETAR DATOS DEL PASAJERO'}</span>
                                <Tooltip title="Editar los datos del pasajero">
                                    <span>
                                        <Fab 
                                            color="primary" 
                                            aria-label="Añadir datos pasajero" 
                                            size = "small"
                                            onClick={()=> editTraveler(e.id)}
                                        >
                                            <EditIcon />
                                        </Fab>
                                    </span>
                                </Tooltip>
                                { e.validate && <Tooltip title="Pasajero guardado correctamente">
                                    <span>
                                        <Fab style={{ color: green[500]}} aria-label="Borrar datos pasajero" size = "small" disabled>
                                            <CheckCircleIcon style={{ color: green[500]}}/>
                                        </Fab>
                                    </span>
                                </Tooltip> }
                                {!e.validate && <Tooltip title="Debes completar los datos del pasajero">
                                    <span>
                                        <Fab style={{ color: red[500]}} aria-label="Borrar datos pasajero" size = "small" disabled>
                                            <ErrorIcon style={{ color: red[500]}}/>
                                        </Fab>
                                    </span>
                                    </Tooltip>}
                            </div>

                        )})}
                    {travelersInfo?.every(e => e.validate) && !bookingDone && <PayPalScriptProvider 
                        className="paypal-container" 
                        options={{ "client-id": `${process.env.REACT_APP_PAYPAL_CLIENTID}`, 
                                "currency":  `${data?.state[0]?.data?.data?.flightOffers[0]
                                    ?.travelerPricings[0]?.price?.currency}`,
                                    "disable-funding": "sofort",}}>
                        <PayPalButtons
                            className = "paypal-container"
                            style={{ height: 44 }}
                            createOrder={(data, actions) => {
                                    return actions.order.create({
                                        purchase_units: [
                                            {
                                                amount: {
                                                    value: `${price}`,
                                                    
                                                },
                                            },
                                        ],
                                    });
                            
                            }}
                            onApprove = {(data, actions) => {
                                // This function captures the funds from the transaction.
                                return actions.order.capture().then(function(details) {
                                  // This function shows a transaction success message to your buyer.
                                  paymentSuccess(details);
                                  //alert('Transaction completed by ' + details.payer.name.given_name);
                                });
                            }}
                            onCancel = { function ( data ){
                                console.log('CANCEL');
                            }}
                            onError = { function ( err ) {
                                console.log( err );
                            } }
                        />
                         </PayPalScriptProvider>}
                    {/* <div id='container-button'>
                            <button id='payment-button' onClick={goToPayment}>Ir a Pago</button>
                    </div> */}
                </div>
                <Snackbar open={values.showOk} autoHideDuration={5000} onClose={handleCloseOk}>
                        <Alert onClose={handleCloseOk} severity="success">
                        {values.ok}
                        </Alert>
                </Snackbar>
                <Snackbar open={values.showInfo} autoHideDuration={3000} onClose={handleCloseInfo}>
                        <Alert onClose={handleCloseInfo} severity="info">
                        {values.info}
                        </Alert>
                </Snackbar>
            </div>
        </TravelersContext.Provider>
    );
};

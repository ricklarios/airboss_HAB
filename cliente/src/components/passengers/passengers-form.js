import { useContext, useState, useEffect, Fragment, useRef } from 'react';
import './passengers-form.css';
import validator from 'validator';
// import 'react-datepicker/dist/react-datepicker.css';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';
import ErrorIcon from '@material-ui/icons/Error';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { green, red } from '@material-ui/core/colors';
import InputAdornment from '@material-ui/core/InputAdornment';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import clsx from 'clsx';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import { AuthContext } from '../../App';
import MaterialUiPhoneNumber from 'material-ui-phone-number';
import Tooltip from '@material-ui/core/Tooltip';
import { Fab } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(10),
            width: '50px',
        },
    },
}));
const useStylesFlags = makeStyles({
    option: {
        fontSize: 15,
        '& > span': {
            marginRight: 10,
            fontSize: 18,
        },
    },
});

function countryToFlag(isoCode) {
    return typeof String.fromCodePoint !== 'undefined'
        ? isoCode
              .toUpperCase()
              .replace(/./g, (char) =>
                  String.fromCodePoint(char.charCodeAt(0) + 127397)
              )
        : isoCode;
}

function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
}

function PassengersForm({ travelersInfo }) {
    //Control de la alerta SnackBar
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setValues({ ...values, showError: false });
    };
    const handleCloseOk = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setValues({ ...values, showOk: false });
    };
    // Estados de los parametros de Busqueda
    const { setShowForm, refApp, animation, setOpacity, setShowRegisterForm } =
        useContext(AuthContext);

    const [values, setValues] = useState({
        email: '',
        password: '',
        showPassword: false,
        repeatPassword: '',
        showRepeatPasswor: false,
        name: '',
        lastname: '',
        error: '',
        showError: false,
        nationality: '',
        phone: '',
        ok: '',
        showOk: false,
    });
    const [travelers, setTravelers] = useState(travelersInfo);
    const [showEditTravelerForm, setShowEditTravelerForm] = useState(false);
    const classes = useStyles();
    const classesFlags = useStylesFlags();

    const refRegisterForm = useRef (null);
    
    /* +
    )); */
    useEffect(() => {
        //console.log(travelersInfo);
        return () => {
        };
    }, [travelers]);

    document.addEventListener('keydown', handleKeyDown);

    function handleKeyDown (e){
        if (e.keyCode === 27){
            setShowRegisterForm(false);
        }
    }
    function editTraveler (id){
        setShowEditTravelerForm(true);
       /*  setTravelers(travelers.map ( e => {
            if(e.travelerId=== id){
                return {...e, name: "OLE Ahí"}
            }
            return e
        })) */
    }
    return (
        <div
            id='passengers-form'
            className="passengers-form"
        >
            <form id='register-form' >
                {travelers.map((e)=>{
                    return(
                        <div className="list-travelers">
                            {e.name}
                            <Tooltip title="Editar los datos del pasajero">
                                <span>
                                    <Fab 
                                        color="primary" 
                                        aria-label="Añadir datos pasajero" 
                                        size = "small"
                                        onClick={()=> editTraveler(e.travelerId)}
                                    >

                                            <EditIcon />
                                    </Fab>
                                </span>
                            </Tooltip>
                            { e.travelerValidate && <Tooltip title="Pasajero guardado correctamente">
                                <span>
                                    <Fab style={{ color: green[500]}} aria-label="Borrar datos pasajero" size = "small" disabled="true">
                                        <CheckCircleIcon style={{ color: green[500]}}/>
                                    </Fab>
                                </span>
                            </Tooltip> }
                            {!e.travelerValidate && <Tooltip title="Debes completar los datos del pasajero">
                                <span>
                                    <Fab color="disabled" aria-label="Borrar datos pasajero" size = "small" disabled="true">
                                        <ErrorIcon style={{ color: red[500]}}/>
                                    </Fab>
                                </span>
                                </Tooltip>}
                        </div>

                    )})}
                {showEditTravelerForm && <span>MUESTRO</span>}
                <div id='container-button'>
                    <button id='register-button'>Registrarse</button>
                </div>
                <>
                    <Snackbar
                        open={values.showError}
                        autoHideDuration={3000}
                        onClose={handleClose}
                    >
                        <Alert onClose={handleClose} severity='error'>
                            {values.error}
                        </Alert>
                    </Snackbar>
                    <Snackbar
                        open={values.showOk}
                        autoHideDuration={3000}
                        onClose={handleCloseOk}
                    >
                        <Alert onClose={handleClose} severity='success'>
                            {values.ok}
                        </Alert>
                    </Snackbar>
                </>
            </form>
        </div>
    );
}
export default PassengersForm;

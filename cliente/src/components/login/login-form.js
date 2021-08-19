import { useState, useEffect, useContext } from 'react';
import './login-form.css';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import clsx from 'clsx';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Button from '@material-ui/core/Button';
import GoogleLogin from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { AuthContext } from '../../App';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { Link } from 'react-router-dom';
import axios from 'axios';

const idFB = process.env.REACT_APP_ID_FB;
const idGoogle = process.env.REACT_APP_ID_GOOGLE;
const urlGoogle = `${idGoogle}-pelele5h6cbtvccnk47pourck5eq82pd.apps.googleusercontent.com`;
//const axios = require('axios');

const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            width: '100%',
        },
    },
}));

function Alert(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
}
function LoginForm() {
    //setShowForm, setLogin, login
    //REV_ERRRORS
    //const [data, setData] = useState({});
    //const [error, setError] = useState("");
    const [values, setValues] = useState({
        email: '',
        password: '',
        showPassword: false,
        error: '',
        showError: false,
        ok: '',
        showOk: false,
    });
    const classes = useStyles();
    const {
        login,
        setShowForm,
        setShowRegisterForm,
        setEmail,
        setRestorePasswordForm,
        setLogin,
        setNameUser,
        ref,
        animation,
        setOpacity,
        setPicture,
        setPhone,
        setNationality,
        setCreatedAt,
        setBirthday,
        setLastname,
        name,
        lastname,
        email,
    } = useContext(AuthContext);

    useEffect(() => {
        setShowRegisterForm(false);
        return () => {
            setOpacity({
                opacity: 1,
            });
        };
    }, [setShowRegisterForm, setOpacity]); //REV_ERRORS

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

    //Funciones para el manejo de respuestas de las API de Google y Facebook
    const responseGoogle = (response) => {
        //console.log('login-form 100');
        //console.log(response);
        if (response?.profileObj?.name) {
            setNameUser(response?.profileObj?.givenName);
            setLastname(response?.profileObj?.familyName);
            setPicture(response?.profileObj?.imageUrl);
            setEmail(response.profileObj.email);

            setValues({
                ...values,
                ok: 'Te has logado con éxito',
                showOk: true,
            });
            setTimeout(() => {
                setShowForm(false);
                setLogin(true);
            }, 2000);
            localStorage.setItem('userToken', response.tokenObj.id_token);
            localStorage.setItem('userName', response.profileObj.name);
            localStorage.setItem('typeAuth', 'google');
            //*******************/
            async function loginGoogle() {
                const token = localStorage.getItem('userToken');
                const typeAuth = localStorage.getItem('typeAuth');
                const myHeaders = new Headers();

                myHeaders.append('Content-Type', 'application/json');
                myHeaders.append('authorization', response.tokenObj.id_token);
                myHeaders.append('email', email);
                myHeaders.append('name', name);
                myHeaders.append('lastname', lastname);

                const res = await axios.get(
                    `http://localhost:3001/users/validate-token/${typeAuth}`,
                    myHeaders
                );
                //console.log(res);
                if (res.data.status === 'ok') {
                    setValues({
                        ...values,
                        ok: 'Logado Google OK!',
                        showOk: true,
                    });
                }
            }

            loginGoogle();

            //*******************/
        } else {
            setValues({
                ...values,
                error: 'No ha sido posible logarte mediante Google, inténtalo más tarde',
                showError: true,
            });
        }
    };
    const responseFacebook = (response) => {
        // setData(response); //REV_ERRORS
        //console.log('DENTRO DE RESPONSE FACEBOOK');
        //console.log('RESPONSE**************:',response);
        if (response.accessToken) {
            setPicture(response?.picture?.data?.url);
            setEmail(response.email);
            setNameUser(response.first_name);
            setLastname(response.last_name);
            setValues({
                ...values,
                ok: 'Te has logado con éxito',
                showOk: true,
            });
            setTimeout(() => {
                setShowForm(false);
                setLogin(true);
            }, 2000);
            localStorage.setItem('userToken', response.accessToken);
            localStorage.setItem('userName', response.first_name);
            localStorage.setItem('typeAuth', 'fb');
            //Validamos en back si el usuario ya está registrado en la BBDD, sino se creará
            async function loginFB() {
                const token = localStorage.getItem('userToken');
                const typeAuth = localStorage.getItem('typeAuth');
                const myHeaders = new Headers();

                myHeaders.append('Content-Type', 'application/json');
                myHeaders.append('Authorization', token);
                myHeaders.append('email', email);
                myHeaders.append('name', name);
                myHeaders.append('lastname', lastname);

                const res = await axios.get(
                    `http://localhost:3001/users/validate-token/${typeAuth}`,
                    myHeaders
                );
                console.log(res);
                if (res.data.status === 'ok') {
                    setValues({
                        ...values,
                        ok: 'Logado Facebook OK!',
                        showOk: true,
                    });
                }
            }

            loginFB();
        } else {
            setLogin(false);
        }
    };

    const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
    };
    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
        if (
            event.target.id === 'standard-adornment-password' &&
            event.charCode === 13
        ) {
            onSubmitLogin(event);
        }
    };

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const goToRegister = () => {
        setShowForm(false);
        setShowRegisterForm(true);
    };

    const restorePassword = () => {
        setOpacity({
            opacity: 1,
        });
        setShowForm(false);
        setRestorePasswordForm(true);
    };

    function onSubmitLogin(event) {
        //console.log('ENTRA EN SUBMIT');
        event.preventDefault();

        fetch('http://localhost:3001/users/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: values.email,
                password: values.password,
            }),
        })
            .then((res) => res.json())
            .then((response) => {
                // response
                //console.log(response);

                if (response.status === 'error') {
                    // error
                    setValues({
                        ...values,
                        error: response.message,
                        showError: true, //REV_ERRORS
                    });
                    //console.log(error.message);
                } else {
                    // si NO hay error seteo la sesion redirect a /home
                    setValues({
                        ...values,
                        ok: 'Te has logado con éxito',
                        showOk: true,
                    });
                    setNameUser(response.data.name);
                    setPhone(response.data.phoneNumber);
                    setNationality(response.data.nationality);
                    setCreatedAt(response.data.createdAt);
                    setBirthday(response.data.birthDate);
                    setEmail(values.email);
                    setPicture(response.data.avatar);
                    // console.log(response.data.avatar);
                    // console.log(response);
                    setTimeout(() => {
                        setShowForm(false);
                        setLogin(true);
                    }, 3000);
                    localStorage.setItem('userToken', response.data.token);
                    localStorage.setItem('userName', response.data.name);
                    localStorage.setItem('idUser', response.data.idUser);
                    localStorage.setItem('typeAuth', 'API');
                }
            });
    }

    return (
        <div
            className={'login-container animate__animated ' + animation}
            ref={ref}
        >
            <div>Logo</div>
            <form id='form-login' onSubmit={onSubmitLogin}>
                <div>
                    <TextField
                        className='inputs-form'
                        id='standard-basic-email'
                        label='Correo electrónico'
                        value={values.email}
                        onChange={handleChange('email')}
                        autoFocus
                    />
                </div>
                <FormControl
                    className={clsx(classes.margin, classes.textField)}
                >
                    <InputLabel
                        htmlFor='standard-adornment-password'
                        id='standard-adornment-password-label'
                    >
                        Contraseña
                    </InputLabel>
                    <Input
                        id='standard-adornment-password'
                        type={values.showPassword ? 'text' : 'password'}
                        value={values.password}
                        onChange={handleChange('password')}
                        endAdornment={
                            <InputAdornment position='end'>
                                <IconButton
                                    aria-label='toggle password visibility'
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                >
                                    {values.showPassword ? (
                                        <Visibility />
                                    ) : (
                                        <VisibilityOff />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        }
                        onKeyPress={handleChange('password')}
                        className='inputs-form'
                    />
                </FormControl>
                <div id='forgot-password'>
                    <Link to='/' onClick={restorePassword} className='small'>
                        Olvidé mi contraseña
                    </Link>
                </div>
                <div>
                    <Button
                        variant='contained'
                        id='button-login'
                        color='primary'
                        className='button-form'
                        onClick={onSubmitLogin}
                    >
                        Iniciar Sesión
                    </Button>
                </div>
                <div className='line-v'></div>
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
                <div id='social-btn'>
                    {!login && (
                        <GoogleLogin
                            clientId={urlGoogle}
                            buttonText='Login with Google'
                            id='google-login'
                            onSuccess={responseGoogle}
                            onFailure={responseGoogle}
                            cookiePolicy={'single_host_origin'}
                        />
                    )}
                    {!login && (
                        <FacebookLogin
                            appId={idFB}
                            cssClass='btnFacebook'
                            autoLoad={false}
                            fields='name,email,picture,first_name,last_name'
                            scope='public_profile,user_friends, email'
                            callback={responseFacebook}
                            icon='fa-facebook'
                        />
                    )}
                </div>
                <div id='no-account-container'>
                    <Link to='/' onClick={goToRegister}>
                        ¿No tienes cuenta? Regístrate
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;

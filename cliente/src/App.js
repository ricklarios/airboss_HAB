import { AppRouter } from './routers/AppRouter';
import './App.css';
import { createContext, useState, useEffect, useRef } from 'react';
import axios from 'axios';

export const AuthContext = createContext(null);

export const App = () => {
    const [showForm, setShowForm] = useState(false);
    const [name, setNameUser] = useState(null);
    const [lastname, setLastname] = useState(null);
    const [phone, setPhone] = useState('');
    const [nationality, setNationality] = useState('');
    const [birthday, setBirthday] = useState(null);
    const [createdAt, setCreatedAt] = useState(null);
    const [email, setEmail] = useState('');
    const [animation, setAnimation] = useState('animate__backInDown');
    const [picture, setPicture] = useState('');
    const [opacity, setOpacity] = useState({
        opacity: 1,
    });
    const [showRegisterForm, setShowRegisterForm] = useState(false);
    const [showRestorePasswordForm, setRestorePasswordForm] = useState(false);
    const [showEditTravelerForm, setShowEditTravelerForm] = useState(false);
    const [travelersInfo, setTravelersInfo] = useState(null);
    //Hook para recoger información de pasajeros relacionados con el idUSer
    const [saveTravelers, setSaveTravelers] = useState(null);
    const [currentTraveler, setCurrentTraveler] = useState('');
    const refApp = useRef(null);

    const isLogged = () => {
        const token = localStorage.getItem('userToken');
        if (token) {
            return true;
        }
        return false;
    };

    const [login, setLogin] = useState(isLogged());

    useEffect(() => {
        function handleKeyDown(e) {
            if (!refApp.current || refApp.current.contains(e.target)) {
                return;
            }
            if (e.keyCode === 27) {
                setShowRegisterForm(false);
                setShowForm(false);
            }
            //si pulsamos ESC cambiamos la clase para la animación y tras 2 segundos fijamos a false
            if (e.keyCode === 27) {
                setAnimation('animate__backOutUp');
                setTimeout(() => {
                    //Si se está mostrando el formulario de login fijo el valor a false,
                    //sino es que se está mostrando el formulario de registro
                    setShowForm(false);
                    setShowRegisterForm(false);
                    setOpacity({
                        opacity: 1,
                    });
                    showForm ? setShowForm(false) : setShowRegisterForm(false);
                }, 1000);
            }
        }
        document.addEventListener('keydown', handleKeyDown);

        const token = localStorage.getItem('userToken');
        const typeAuth = localStorage.getItem('typeAuth');

        if (token && typeAuth === 'API') {
            const idUser = localStorage.getItem('idUser');
            const myHeaders = new Headers();
            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append('Authorization', token);
            myHeaders.append('idUser', idUser);

            // console.log(myHeaders);
            fetch(`http://localhost:3001/users/validate-token/${typeAuth}`, {
                method: 'GET',
                headers: myHeaders,
            })
                .then((res) => res.json())
                .then((response) => {
                    if (response.status === 'error') {
                        // error
                        console.log(response.message);
                        setLogin(false);
                    } else {
                        // si NO hay error seteo la sesion redirect a /home
                        setLogin(true);
                        setNameUser(localStorage.getItem('userName'));
                        setLastname(response.data.lastname);
                        setPhone(response.data.phoneNumber);
                        setNationality(response.data.nationality);
                        setCreatedAt(response.data.createdAt);
                        setBirthday(response.data.birthDate);
                        setEmail(response.data.email);
                        setPicture(response.data.avatar);
                    }
                });
        }
        if (token && (typeAuth === 'google' || typeAuth === 'fb')) {

                try {
                    async function validateToken(){
                        const res = await axios.get(`http://localhost:3001/users/validate-token/${typeAuth}`, {
                            headers:{ 'Content-Type': 'application/json',
                            'Authorization': token,  
                        },
                    })
                    if (res.data.status === 'ok'){
                        //setValues({...values, ok: "Logado Google OK!", showOk: true});
                        // si NO hay error seteo la sesion redirect a /home
                        setLogin(true);
                        

                        setNameUser(res.data.data.name);
                        setLastname(res.data.data.lastname);
                        setPhone(res.data.data?.phoneNumber);
                        setNationality(res.data.data?.nationality);
                        setCreatedAt(res.data.data.createdAt);
                        setBirthday(res.data.data?.birthday);
                        setEmail(res.data.data.email);
                        setPicture(res.data.data?.avatar);

                        console.log('DENTRO DE GOOGLE EN APP');
                        localStorage.setItem('idUser', res.data.data.idUser)
                    }else{
                            console.log('HAY UN PROBLEMA EN EL LOGADO DE GOOGLE/FB APP.JS');
                            setLogin(false)
                    }

                    }
                }
                validateToken();
            } catch (error) {
                console.log('ERROR EN VALIDATE');
            }
        }

        return function cleanup() {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [showForm, email]);

    return (
        <div ref={refApp}>
            <AuthContext.Provider
                value={{
                    login,
                    setLogin,
                    showForm,
                    setShowForm,
                    email,
                    setEmail,
                    name,
                    setNameUser,
                    lastname,
                    setLastname,
                    refApp,
                    animation,
                    setAnimation,
                    phone,
                    setPhone,
                    nationality,
                    setNationality,
                    createdAt,
                    setCreatedAt,
                    birthday,
                    setBirthday,
                    opacity,
                    setOpacity,
                    picture,
                    setPicture,
                    showRegisterForm,
                    setShowRegisterForm,
                    setRestorePasswordForm,
                    showRestorePasswordForm,
                    showEditTravelerForm,
                    setShowEditTravelerForm,
                    travelersInfo,
                    setTravelersInfo,
                    currentTraveler,
                    setCurrentTraveler,
                    saveTravelers,
                    setSaveTravelers,
                }}
            >
                <AppRouter />
            </AuthContext.Provider>
        </div>
    );
};

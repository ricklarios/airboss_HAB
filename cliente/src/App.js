import { AppRouter } from './routers/AppRouter';
import './App.css';
import { createContext, useState, useEffect, useRef } from 'react';

export const AuthContext = createContext(null);

export const App = () => {
    const [login, setLogin] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [nameUser, setNameUser] = useState(null);
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

    const ref = useRef(null);

    useEffect(() => {
        function handleKeyDown(e) {
            if (!ref.current || ref.current.contains(e.target)) {
                return;
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
        if (token) {
            const typeAuth = localStorage.getItem('typeAuth');
            const idUser = localStorage.getItem('idUser');

            const myHeaders = new Headers();
            

            myHeaders.append('Content-Type', 'application/json');
            myHeaders.append('Authorization', token);
            myHeaders.append('idUser', idUser);
            console.log(email);
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
                        //console.log(error.message);
                    } else {
                        // si NO hay error seteo la sesion redirect a /home
                        // console.log(response);
                        setLogin(true);
                        setNameUser(localStorage.getItem('userName'));
                        setNameUser(response.data.name);
                        setPhone(response.data.phoneNumber);
                        setNationality(response.data.nationality);
                        setCreatedAt(response.data.createdAt);
                        setBirthday(response.data.birthDate);
                        setEmail(response.data.email);
                        setPicture(response.data.avatar);
                    }
                });
        }

        return function cleanup() {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [showForm]);//REV_ERRORS

    return (
        <div ref={ref}>
            <AuthContext.Provider
                value={{
                    login,
                    setLogin,
                    showForm,
                    setShowForm,
                    email,
                    setEmail,
                    nameUser,
                    setNameUser,
                    ref,
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
                    showRestorePasswordForm
                }}
            >
                <AppRouter />
            </AuthContext.Provider>
        </div>
    );
};

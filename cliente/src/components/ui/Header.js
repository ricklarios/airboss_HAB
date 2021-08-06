import './header.css';
import logo from '../../assets/logo.png';
import { RiMoneyDollarCircleLine } from 'react-icons/ri';
import { CURRENCY_CODES } from '../../constants';
import { UserContext } from '../../routers/AppRouter';
import { AuthContext } from '../../App';
import { useContext } from 'react';
import SimpleMenu from '../login/menu-login';

import { getSymbol } from '../../helpers';
import { useHistory } from 'react-router-dom';

export const Header = () => {
    
    const { login, setShowForm, setAnimation, opacity, setOpacity, setShowRegisterForm,setRestorePasswordForm } = useContext(AuthContext);
    const { preferredCurrency, setPreferredCurrency } = useContext(UserContext);
    const history = useHistory();

    
    function launchFormLogin() {
        setAnimation('animate__backInDown');
        setRestorePasswordForm(false);
        setShowForm(true);
        setOpacity({
            opacity: 0.5,
        });
    }
    function launchFormRegister() {
        setAnimation('animate__backInDown');
        setRestorePasswordForm(false);
        setShowRegisterForm(true);
        setOpacity({
            opacity: 0.5,
        });
    }
    return (
        <header id='header-container' style={opacity}>
            <div id='logo-container'>
                <img
                    onClick={() => history.push('/')}
                    src={logo}
                    alt='logo airboss plataforma de vuelos'
                    width='100%'
                />
            </div>
            <div id='button-container'>
                <div id='container-exchange-icon'>
                    <RiMoneyDollarCircleLine size={22} color='#132c33' />
                    <select
                        id='select-currency'
                        value={preferredCurrency.currency}
                        onChange={(e) => {
                            setPreferredCurrency({
                                currency: e.target.value,
                                symbol: getSymbol(e.target.value),
                            });
                        }}
                    >
                        {CURRENCY_CODES.map(({ currency, id }) => (
                            <option key={id}>{currency}</option>
                        ))}
                    </select>
                </div>
                {!login && <button id='login-button' onClick={launchFormLogin}>Inicia Sesión</button>}
                {!login && <button id='signup-button' onClick={launchFormRegister}>Registrate</button>}
                {login && <SimpleMenu /> }
            </div>
        </header>
    );
};

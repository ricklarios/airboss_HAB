import '../App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from 'react-router-dom';
import { HomeScreen } from '../pages/HomeScreen';
import { LoginScreen } from '../pages/LoginScreen';
import { ProfileScreen } from '../pages/ProfileScreen';
import { ConfirmedOrderScreen } from '../pages/ConfirmedOrderScreen';
import { FlightSelectionScreen } from '../pages/FlightSelectionScreen';
import { SelectedFlightDetailsScreen } from '../pages/SelectedFlightDetailsScreen';
import { ValidateScreen } from '../pages/ValidateScreen';
import { ResetPasswordScreen } from '../pages/ResetPasswordScreen';
import { Header } from '../components/ui/Header';
import { createContext, useState} from 'react';
import { useContext } from 'react';
import { AuthContext } from '../App';
import LoginForm from '../components/login/login-form';
import RegisterForm from '../components/login/register-form';
import RestorePasswordForm from '../components/login/restore-pwd-form'

export const UserContext = createContext(null);

export const AppRouter = () => {
    const [preferredCurrency, setPreferredCurrency] = useState({
        currency: 'EUR',
        symbol: '€',
    });

    const { login, showForm, showRegisterForm, showRestorePasswordForm } =
        useContext(AuthContext);

    return (
        <Router>
            <div>
                <UserContext.Provider
                    value={{
                        preferredCurrency,
                        setPreferredCurrency,
                    }}
                >
                    <Header />
                    {showForm && !login && <LoginForm className='TEST' />}
                    {showRegisterForm && <RegisterForm className='TEST' />}
                    {showRestorePasswordForm && <RestorePasswordForm />}
                    <Switch>
                        <Route exact path='/' component={HomeScreen} />
                        <Route
                            exact
                            path='/searches'
                            component={FlightSelectionScreen}
                        />
                        <Route
                            exact
                            path='/pricing'
                            component={SelectedFlightDetailsScreen}
                        />
                        <Route
                            exact
                            path='/order'
                            component={ConfirmedOrderScreen}
                        />
                        <Route exact path='/login' component={LoginScreen} />
                        <Route
                            exact
                            path='/profile'
                            component={ProfileScreen}
                        />
                        <Route
                            exact
                            path='/users/validate/:registrationCode'
                            component={ValidateScreen}
                        />
                        <Route
                            exact
                            path='/users/reset-password/:recoverCode'
                            component={ResetPasswordScreen}
                        />
                        <Redirect to='/' />
                    </Switch>
                </UserContext.Provider>
            </div>
        </Router>
    );
};

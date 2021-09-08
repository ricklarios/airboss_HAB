import '../App.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from 'react-router-dom';
import { HomeScreen } from '../pages/HomeScreen';
import { ProfileScreen } from '../pages/ProfileScreen';
import { BookingHistoryScreen } from '../pages/BookingHistoryScreen';
import { ConfirmedOrderScreen } from '../pages/ConfirmedOrderScreen';
import { FlightSelectionScreen } from '../pages/FlightSelectionScreen';
import { SelectedFlightDetailsScreen } from '../pages/SelectedFlightDetailsScreen';
import { ValidateScreen } from '../pages/ValidateScreen';
import { ResetPasswordScreen } from '../pages/ResetPasswordScreen';
import { ConfirmPassengersScreen } from '../pages/ConfirmPassengersScreen';
import { Header } from '../components/ui/Header';
import { createContext, useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../App';
import LoginForm from '../components/login/LoginForm';
import RegisterForm from '../components/login/RegisterForm';
import RestorePasswordForm from '../components/login/RestorePasswordForm';
import PassengersForm from '../components/passengers/passengers-form';
import { routes } from './routes';
import { PrivateRoute } from './PrivateRoute';

export const UserContext = createContext(null);

export const AppRouter = () => {
    const [preferredCurrency, setPreferredCurrency] = useState({
        currency: 'EUR',
        symbol: '€',
    });

    const {
        login,
        showForm,
        showRegisterForm,
        showRestorePasswordForm,
        showEditTravelerForm,
    } = useContext(AuthContext);

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
                    {showEditTravelerForm && <PassengersForm />}
                    {showRestorePasswordForm && <RestorePasswordForm />}
                    <Switch>
                        <Route
                            exact
                            path={routes.home}
                            component={HomeScreen}
                        />
                        <Route
                            exact
                            path={routes.searches}
                            component={FlightSelectionScreen}
                        />
                        <PrivateRoute
                            exact
                            path={routes.pricing}
                            component={SelectedFlightDetailsScreen}
                        />
                        <PrivateRoute
                            exact
                            path={routes.passengers}
                            component={ConfirmPassengersScreen}
                        />
                        <Route
                            exact
                            path={routes.order}
                            component={ConfirmedOrderScreen}
                        />
                        <PrivateRoute
                            exact
                            path={routes.profile}
                            component={ProfileScreen}
                        />
                        <Route
                            exact
                            path='/bookingHistory'
                            component={BookingHistoryScreen}
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
                        <Redirect to={routes.home} />
                    </Switch>
                </UserContext.Provider>
            </div>
        </Router>
    );
};

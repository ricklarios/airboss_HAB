import { AuthContext } from '../App';
import { useContext } from 'react';
import { routes } from './routes';
import { Redirect, Route } from 'react-router';
import { UserContext } from './AppRouter';

export const PrivateSearchRoute = (props) => {
    const { login } = useContext(AuthContext);
    const { selectedFlight } = useContext(UserContext);

    if (!login || !selectedFlight) {
        return <Redirect to={routes.home} />;
    }

    return <Route {...props} />;
};

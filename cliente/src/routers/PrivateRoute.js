import { AuthContext } from '../App';
import { useContext } from 'react';
import { routes } from './routes';
import { Redirect, Route } from 'react-router';

export const PrivateRoute = (props) => {
    const { login } = useContext(AuthContext);
    
    if (!login) return <Redirect to={routes.home} />;
    
    return <Route {...props} />;
};

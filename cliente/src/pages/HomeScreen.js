import {useContext} from 'react'
import { AuthContext } from '../App';
import SearchBox from '../components/home/SearchBox';
import { TitleHome } from '../components/home/Title';
import './css/home-screen.css';

export const HomeScreen = ({ history }) => {
    const { opacity } = useContext(AuthContext);
    return (
        <div id='home-section-container' style={opacity}>
            <div id='home-container'>
                <TitleHome />
                <SearchBox history={history} vertical={false} />
            </div>
        </div>
    );
};

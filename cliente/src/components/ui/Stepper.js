import './css/stepper.css';
import { RiArrowRightSLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import { routes } from '../../routers/routes';

export const Stepper = ({ step, history }) => {
    return (
        <div id='stepper-container'>
            <div id='stepper'>
                {step === 'flightSelection' && (
                    <>
                        <Link to={routes.home}>Home</Link>
                        <RiArrowRightSLine />
                        <div className='current-step'>Selección de vuelo</div>
                    </>
                )}
                {step === 'selectedFlight' && (
                    <>
                        <Link to={routes.home}>Home</Link>
                        <RiArrowRightSLine />
                        <div
                            onClick={() => {
                                history.goBack();
                            }}
                            className='fligh-selection'
                        >
                            Selección de vuelo
                        </div>
                        <RiArrowRightSLine />
                        <div className='current-step'>Detalles del vuelo</div>
                    </>
                )}

                {step === 'confirmPassengers' && (
                    <>
                        <Link to={routes.home}>Home</Link>
                        <RiArrowRightSLine />
                        <div>Selección de vuelo</div>
                        <RiArrowRightSLine />
                        <div>Detalles del vuelo</div>
                        <RiArrowRightSLine />
                        <div className='current-step'>Confirmar pasajeros</div>
                    </>
                )}
            </div>
        </div>
    );
};

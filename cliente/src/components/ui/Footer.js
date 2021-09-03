import './css/footer.css';
import { GrPaypal } from 'react-icons/gr';
import { AiOutlineCopyrightCircle } from 'react-icons/ai';
import {
    FaFacebookSquare,
    FaTwitterSquare,
    FaInstagramSquare,
} from 'react-icons/fa';

export const Footer = () => {
    return (
        <footer id='footer'>
            <div>
                <GrPaypal />
            </div>
            <div>
                Conecta con nosotros <FaFacebookSquare />
                <FaTwitterSquare /> <FaInstagramSquare />
            </div>
            <div>
                2021 <AiOutlineCopyrightCircle /> Airboss. Todos los derechos
                reservados
            </div>
        </footer>
    );
};

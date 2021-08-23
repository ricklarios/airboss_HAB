import './pois-destination-card.css';

export const PoiDestinationCard = ({
    name,
    description,
    image,
    bookingLink,
    price,
}) => {
    return (
        <div className='poi-card'>
            <div>
                <img src={image} alt='' width='100%' />
            </div>
            <h3>{name}</h3>
            <p>{description} </p>
            <div>
                <a target='__blank' href={bookingLink}>
                    Comprar Entradas
                </a>
            </div>
        </div>
    );
};

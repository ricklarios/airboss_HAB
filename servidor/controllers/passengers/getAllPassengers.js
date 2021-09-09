const {getDB} = require('../../bbdd/db');

const getAllPassengers = async (req, res, next) => {
    let connection;

    try {
        connection = await getDB();
        const { iduser } = req.headers;
        const { idBooking } = req.query;
        // Obtenemos la info y los pasajeros de un idBooking en concreto
        let passengerInfo = [];
        if(idBooking){
            const [passengers] = await connection.query(
                `SELECT id, name, lastname, documentNumber, birthDate, documentType, nationality, issuanceDate, issuanceCountry, gender FROM passengers WHERE idBooking = ?;`,
                [idBooking]
                );
                for (const passenger of passengers) {
                const fragInfo = {
                    id: passenger.id,
                    name: passenger.name,
                    lastname: passenger.lastname,
                    documentNumber: passenger.documentNumber,
                    documentType: passenger.documentType,
                    birthDate: passenger.birthDate,
                    nationality: passenger.nationality,
                    gender: passenger.gender,
                    emailAddress: passenger.emailContact,
                    issuanceDate: passenger.issuanceDate,

                };
                passengerInfo.push(fragInfo);
            }
        }else{
            const [passengers] = await connection.query(
                `SELECT p.id, p.name, p.lastname, p.documentNumber, p.birthDate, p.documentType, p.nationality, p.issuanceDate, p.issuanceCountry, p.gender, p.emailContact, p.birthPlace, p.issuanceCountry FROM passengers p, bookings b WHERE p.idBooking = b.id AND b.idUser= ?;`,
                [iduser]
            );
            for (const passenger of passengers) {
                const fragInfo = {
                    id: passenger.id,
                    name: passenger.name,
                    lastname: passenger.lastname,
                    documentNumber: passenger.documentNumber,
                    documentType: passenger.documentType,
                    birthDate: passenger.birthDate,
                    nationality: passenger.nationality,
                    gender: passenger.gender,
                    emailAddress: passenger.emailContact,
                    issuanceDate: passenger.issuanceDate,
                    birthPlace: passenger.birthPlace,
                    issuanceCountry: passenger.issuanceCountry,

                };
                // console.log(fragInfo);
                passengerInfo.push(fragInfo);
            }
        };

        
        //console.log(passengers);
        // Creamos un array vacío y pusheamos la info de cada pasajero
        /* for (const passenger of passengers) {
            const fragInfo = {
                name: passenger.name,
                lastname: passenger.lastname,
                documentNumber: passenger.documentNumber,
                birthDate: passenger.birthDate,
                nationality: passenger.nationality,
            };
            passengerInfo.push(fragInfo);
        } */

        res.send({
            status: 'ok',
            data: passengerInfo,
        });
    } catch (error) {
        console.log(error);
        next(error);
    } finally {
        if (connection) connection.release();
    }
};

module.exports = getAllPassengers;

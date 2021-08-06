require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const app = express();

const { PORT } = process.env;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(fileUpload());
app.use(express.json());
app.use('/users/login', require('./routes/auth'));

//Middlewares
const { userExists } = require('./middlewares/userExists');
const { authUser } = require('./middlewares/authUser');

//Controladores Usuarios
const {
    newUser,
    validateUser,
    loginUser,
    editUser,
    editUserPass,
    recoverUserPass,
    resetUserPass,
    deleteUser,
    validateToken,
    changeAvatar
} = require('./controllers/users');

//Newsletter
const {
    requestNL,
    validateEmail,
    changeNL,
    unsubscribeNL,
    validateUnsubscribeNL,
} = require('./controllers/newsletter');

//Searches
const {
    citySearch,
    newSearch,
    flightPrice,
} = require('./controllers/searches/index');

// Controladores Booking
const {
    getBooking,
    createOrder,
    getOrder,
    checkInLinks,
} = require('./controllers/booking/index');

//Controladores Utilities
const {
    covidRestrictions,
    poisDestination,
} = require('./controllers/utilities/index');

const { appsactivity } = require('googleapis/build/src/apis/appsactivity');

/*
    #########################
    ## Endpoints Usuarios ##
    #########################
*/

// Crear un usuario.
app.post('/users/', newUser);

//Valida usuario recogiendo el código de registro recibido por correo
app.get('/users/validate/:registrationCode', validateUser);

//Logado de usuario, genera un token de logado
app.post('/users/login', loginUser);

//Editar datos de usuario
app.put('/users/:idUser', authUser, userExists, editUser);

//Edita contraseña de usuario
app.put('/users/:idUser/password', authUser, userExists, editUserPass);

//Recuperar contraseña
app.put('/users/password/recover', recoverUserPass);

// Resetear contraseña de usuario con un código de recuperación.
app.put('/users/password/reset', resetUserPass);

//Eliminamos usuario
app.delete('/users/:idUser', authUser, userExists, deleteUser);

//Validar token
app.get('/users/validate-token/:typeAuth', validateToken);

//Modificación de Avatar
app.post('/users/avatar', authUser, changeAvatar);

/*
    ################################
    ## EndPoint NewsLetter##
    ################################
*/
//Inicio de alta para un usuario que no no tiene cuenta
app.get('/newsletter', requestNL);

//Validamos el correo con el código enviado
app.get('/newsletter/validate/:newsletterCode', validateEmail);

//Alta en newsletter para usuarios registrados
app.put('/newsletter/changeNLState', authUser, changeNL);

//Usuario solicita baja en la newsletter
app.get('/newsletter/unsubscribe', unsubscribeNL);

//Validamos el correo con el código enviado para la baja en newsletter y procedemos
app.get(
    '/newsletter/unsubscribe/validate/:newsletterCode',
    validateUnsubscribeNL
);

/*
    ################################
    ## Endpoints Búsqueda/Reserva ##
    ################################
*/

// Devuelve las ciudades que coincidan con lo que se escriba.
app.get(`/citySearch`, citySearch);

// Inserta una nueva búsqueda
app.post('/searches', newSearch);

// Fija el precio de la busqueda seleccionada.
app.post('/pricing', flightPrice);

/*
    #########################
    ## Endpoints Reservas ##
    ########################
*/

// Inserta una nueva reserva.
app.post('/booking', createOrder);

// Obtiene una reserva en específico.
app.get('/booking/:idBooking', getBooking);

// Obtiene todas las reservas de un usuario
//app.get('/booking/:idUser', getBooking);

// Devuelve el link donde hacer el check in.
app.get('/checkInLink/:airlineCode', checkInLinks);

/*
    ##########################
    ## Endpoints Pasajeros ##
    #########################
*/

// Obtiene todos los pasajeros de una reserva:
//app.get('/passengers/:idBooking', getAllPassengers);

/*
    ##########################
    ## Endpoints Utilities ##
    #########################
*/

app.post('/covidRestrictions', covidRestrictions);
app.get('/poisDestination', poisDestination);

/**
 * #######################
 * ## Error & Not Found ##
 * #######################
 */

// Middleware de error.
app.use((error, req, res, next) => {
    res.status(error.httpStatus || 500).send({
        status: 'error',
        message: error.message,
    });
});

//Middleware de not found.
app.use((req, res) => {
    res.status(404).send({
        status: 'error',
        message: 'Not found',
    });
});

app.listen(PORT, () =>
    console.log(`Server listening at http://localhost:${PORT}`)
);

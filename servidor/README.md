## Airboss

-   Plataforma de búsqueda de vuelos.

## Endpoints del usuario

-   **POST** - [/users] - Crea un usuario pendiente de activar.✅
-   **POST** - [/users/login] - Logea a un usuario retornando un token.✅
-   **GET** - [/users/validate/:registrationCode] - Valida un usuario recién registrado.✅
-   **PUT** - [/users/:idUser] - Edita el nombre, el email o el avatar de un usuario.✅
-   **PUT** - [/users/:idUser/password] - Edita la contraseña de un usuario.✅
-   **PUT** - [/users/password/recover] - Envia un correo con el código de reseteo de contraseña a un email.✅
-   **PUT** - [/users/password/reset] - Cambia la contraseña de un usuario.✅
-   **DELETE** - [/users/:idUser] - Borra un usuario.✅

## Endpoints búsquedas

-   **GET** - [/citySearch] - Devuelve las ciudades que coincidan con lo lo escrito. (Falta ver bien como implementarlo.) ✅
-   **POST** - [/searches] - Inserta una nueva búsqueda. ✅
-   **POST** - [/searches/pricing] - Fija el precio de la búsqueda selccionada. ✅

## Endpoints reservas

-   **GET** - [/booking/:idBooking] - Devuelve una reserva en específico. ✅
-   **GET** - [/booking/:idUser] - Devuelve todas las reservas de un usuario.
-   **GET** - [/checkInLink/:airlineCode] - Devuelve el link para el check in según la aerolinea. ✅
-   **POST** - [/booking] - Inserta una nueva reserva. ✅
-   **DELETE** - [/booking/:idBooking] - Cancelar una reserva.

## Endpoints newsletter

-   **GET** - [/newsletter] - Genera un código de validación para poder activar la newsletter✅
-   **GET** - [/newsletter/validate/:newsletterCode] - Valida el código que recibimos por email y activa la recepción de newsletter✅
-   **PUT** - [/newsletter/changeNLState] - Modifica el valor active de la lista de emails para newsletter, solo para usuarios registrados.✅
-   **GET** - [/newsletter/unsubscribe] - Genera un código de validación para poder desactivar la suscripción a la Newsletter para usuarios no registrados


const Joi = require('joi');

const newUserSchema = Joi.object().keys({
    email: Joi.string()
        .required()
        .email()
        .error((errors) => {
            switch (errors[0].code) {
                case 'any.required':
                    return new Error('Se requiere un email');

                default:
                    return new Error('El email no es válido');
            }
        }),

    password: Joi.string()
        .required()
        // .alphanum() --> Solo admite letras o números.
        .min(8)
        .max(100)
        .error((errors) => {
            console.log(errors[0]);
            switch (errors[0].code) {
                case 'any.required':
                    return new Error('Se requiere una contraseña');

                default:
                    return new Error(
                        'La contraseña debe tener entre 8 y 100 caracteres'
                    );
            }
        }),
    name: Joi.string()
        .required()
        .min(4)
        .max(100)
        .error((errors) => {
            console.log(errors[0]);
            switch (errors[0].code) {
                case 'any.required':
                    return new Error('Se requiere un nombre');

                default:
                    return new Error(
                        'El nombre debe tener entre 4 y 100 caracteres'
                    );
            }
        }),
    lastname: Joi.string()
        .required()
        .min(4)
        .max(100)
        .error((errors) => {
            console.log(errors[0]);
            switch (errors[0].code) {
                case 'any.required':
                    return new Error('Se requiere un nombre');

                default:
                    return new Error(
                        'El apellido debe tener entre 4 y 100 caracteres'
                    );
            }
        }),
    nationality: Joi.string()
        .required()
        .error((errors) => {
            console.log(errors[0]);
            switch (errors[0].code) {
                case 'any.required':
                    return new Error('Se requiere una nacionalidad');

                default:
                    return new Error(
                        'Se requiere una nacionalidad'
                    );
            }
        }),
    phone: Joi.string(),
    birthday: Joi.date(),
});

module.exports = {newUserSchema};

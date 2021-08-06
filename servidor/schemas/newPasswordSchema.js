const Joi = require('joi');

const newPasswordSchema = Joi.object().keys({
    newPassword: Joi.string()
        .required()
        // .alphanum() --> Solo admite letras o números.
        .min(8)
        .max(100)
        .error((errors) => {
            switch (errors[0].code) {
                case 'string.min':
                    return new Error('La contraseña debe tener 8 caracteres como mínimo');
                case 'string.max':
                    return new Error('La contraseña debe tener 100 caracteres como máximo');
                /* case 'any.required':
                    return new Error('Se requiere una contraseña'); */
                default:
                    return new Error(
                        'La contraseña debe tener entre 8 y 100 caracteres'
                    );
            }
        }),
    recoverCode: Joi.string()
        .required(),
});

module.exports = {newPasswordSchema};

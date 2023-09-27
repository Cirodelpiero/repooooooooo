const {check, body} = require('express-validator');

module.exports = [
    check('title')
        .notEmpty().withMessage('El titulo es obligatorio'),
    check('rating')
        .notEmpty().withMessage('La rating es requerido'),
    check('awards')
        .notEmpty().withMessage('Debes indicar el awards').bail()
        .notEmpty().withMessage('Awards debe ser un número'),
        check('length')
        .notEmpty().withMessage('Debes indicar el length').bail()
        .notEmpty().withMessage('Length debe ser un número')
    
]
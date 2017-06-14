const mongoose = require('mongoose');

//le digo a mongoose que use las promesas nativas de ES6 para usar async/await
mongoose.Promise = global.Promise;

//para hacer las url amigables
const slug = require('slugs');

//me creo un nuevo Schema de mongoose y lo almaceno en la variable storeSchema
const storeSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    slug: String,
    description: {
        type: String,
        trim: true
    },
    tags: [String],
    created: {
        type: Date,
        default: Date.now
    },
    location: {
        type: {
            type: String,
            default: 'Point'
        },
        coordinates: [{
            type: Number,
            required: 'You must supplies coordinates'
        }],
        address: {
            type: String,
            required: 'You must supplie and Adress'
        }
    },
    photo: String

})

//Antes de salvar la tienda introducido, haz lo siguiente coger el numbre y aplicarle la funcion slug que defini en lso helpers. Y cuando acaba de salva con el next();
//solo aplicamos el slug cuando el nombre ha sido modificado si no saltamos.
storeSchema.pre('save', function (next) {
    if (!this.isModified('name')) {
        next(); //pasa al siguiente
        return; //acaba la funcion
    }
    this.slug = slug(this.name);
    next();
})

//exporto el modelo Store que se corresponde con el schema creado.
module.exports = mongoose.model('Store', storeSchema)
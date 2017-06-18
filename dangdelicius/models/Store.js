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
storeSchema.pre('save', async function (next) {
    if (!this.isModified('name')) {
        next(); //pasa al siguiente
        return; //acaba la funcion
    }
    this.slug = slug(this.name);
    //Lo primero sera encontrar las tiendas que coincidan con la regular expresion que escriba
    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
    //hacemos una busqueda de todas las tiendas que empiecen por los datos introducidos
    const storesWithSlug = await this.constructor.find({ slug: slugRegEx });
    //si hay mas de uno entonces la length sera mayor que 0 y entonces al slug le añado la length mas uno, para generar
    //el nuevo slug
    if(storesWithSlug.length){
        this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
    }

    next();
})

//exporto el modelo Store que se corresponde con el schema creado.
module.exports = mongoose.model('Store', storeSchema)
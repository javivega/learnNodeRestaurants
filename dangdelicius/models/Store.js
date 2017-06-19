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
    if (storesWithSlug.length) {
        this.slug = `${this.slug}-${storesWithSlug.length + 1}`;
    }

    next();
})

storeSchema.statics.getTagsList = function () {
    //aggregate coge un array de posibles operators de lo que estamos buscando
    //Usaremos el operator unwild que lo que hace es en un item con multiples tags los separa en items individuales por tag
    //El this de este metodo hace referencia al modelo: Store, osea es como si pusieramos Store.aggregate
    //El operador $group agrupa, en nuestro caso agruparé por tags, que se lo paso en las opciones
    //A parte a cada uno de los grupos le añado una nueva propiedad count y cada vez que encuentra otro elemento con dicho
    //tag le suma 1 al contador del grupo indicandome cuantos elementos hay en dicho grupo
    //Con sort ordenamos los resultados de mayor a menor, esto completa el pipeline de input y outputs.
    return this.aggregate([
        { $unwind: '$tags' },
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        { $sort: {count: -1}}
    ])
}

//exporto el modelo Store que se corresponde con el schema creado.
module.exports = mongoose.model('Store', storeSchema)
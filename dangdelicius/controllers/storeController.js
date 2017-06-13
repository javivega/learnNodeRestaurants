const mongoose = require('mongoose');
const Store = mongoose.model('Store');

//multer manejara la subida de los archivos
const multer = require('multer');
//en las opciones le decimos donde tiene que almacenar el archivo y luego con el metodo comprobamos que 
//sea del tipo imagen y si es asi que prosiga con la subida.
const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next){
        const isPhoto = file.mimetype.startsWith('/image');
        if(isPhoto){
            //con este le decimos que si el tipo de archivo es una foto prosiga con la subida
            next(null, true);
        } else {
            next({message: 'No es un tipo de archivo permitido'}, false);
        }
    }
};



exports.homePage = (req, res) => {
    res.render('index');
}

exports.addStore = (req, res) => {
    res.render('editStore', { name: 'miguel' });
}

//podemos manejar varios archivos en la subida pero con single le decimos que solo el campo photo
exports.upload = multer(multerOptions).single('photo')

exports.createStore = async (req, res) => {
    const store = await (new Store(req.body)).save();
    //Cuando se haya salvado con exito se ejecuta el codigo de a continuacion que es el flash y la redireccion
    req.flash('success', `Succesfully created ${store.name}`);
    res.redirect(`/store/${store.slug}`);
}
exports.getStores = async (req, res) => {
    const stores = await Store.find();
    res.render('stores', { title: 'Stores', stores });
}

exports.editStore = async (req, res) => {
    const store = await Store.findOne({ _id: req.params.id });
    res.render('editStore', { title: 'Edit Store', store })
}

exports.updateStore = async(req, res) => {
    req.body.location.type = 'Point';
    //el metodo findoneandupdate coge tres parametros que son en ordenL la query, los datos, y opciones
    //el new true hace que se retorne una nueva tienda en lugar de la vieja
    //el runvalidators fuerza al modelo a comprobar los campos requeridos en el modelo, tambien en la actualizacion
    //pues por defecto son se chequean en la creacción de nuevos documentos.
    const store = await Store.findOneAndUpdate({_id: req.params.id}, req.body, {
        new: true, 
        runValidators: true} 
    ).exec();
    req.flash('success', 'Succesfully updated');
    res.redirect(`/stores/${store._id}/edit`);

    //el .exec hace que se envie la query, que por defecto no se envia.
}
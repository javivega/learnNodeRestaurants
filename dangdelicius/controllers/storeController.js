const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const jimp = require('jimp');
const uuid = require('uuid');

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
//multer pone el file en el req.file
exports.upload = multer(multerOptions).single('photo')

//creamos el middleware para redimensionar las fotos que suba con multer, pasamos next porque no renderizaremos nada
//sino que recibiremos el file que guarde multer y lo redimensionamos y lo pasamos para crear la tienda.
exports.resize = async(req, res, next) => {
    //si no hay archivo pasa al siguiente middleware, multer pone el archivo subido en la propidad file del request
    if(!req.file){
        next(); //salta al siguiente middleware
        return;
    }

    //el req.file donde se guarda el archivo con multer tiene una propiedad buffer que es el archivo en memoria
    //por otro lado en la propiedad mimetype se guarda el formato del archivo inferido desde el servidor. lo saco con split

    const extension = req.file.mimetype.split('/')[1];
    //Establezco el valor de la propiedad foto que la paso en la creaccion de la tienda en req.body.photo
    //el uuida module nos devuelve un numero unico y le pongo la extension obteniendo algo como 234324324.jpg
    req.body.photo = `${uuid.v4()}.${extension}`
    //redimensionamos la foto con jimp que pide un file path o un buffer del archivo en memoria
    const photo = await jimp.read(req.file.buffer); //como jimp se basa en promesas la resuelvo con await
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`)
    next();//llama al siguiente middleware
}

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
const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
    res.render('index');
}

exports.addStore = (req, res) => {
    res.render('editStore', { name: 'miguel' });
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
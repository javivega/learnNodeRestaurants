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
exports.getStores = async(req, res) => {
    const stores = await(Store.find())
    res.render('stores', { title: 'Stores', stores});
}
const mongoose = require('mongoose');
const Store = mongoose.model('Store');

exports.homePage = (req, res) => {
    res.render('index');
}

exports.addStore = (req, res) => {
    res.render('editStore', { name: 'miguel' });
}

exports.createStore = async (req, res) => {
    const store = new Store(req.body);
    await store.save();
    //Cuando se haya salvado con exito se ejecuta el codigo de a continuacion que es la redireccion
    res.redirect('/');
}
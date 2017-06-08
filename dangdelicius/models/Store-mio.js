
const mongoose = require('mongoose');
const slug = require('slugs');

const storeSchemma = mongoose.Schema({
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
    tags: [String]
})


//Completar lo que falta
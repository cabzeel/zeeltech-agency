const mongoose = require('mongoose');

const {Schema, model} = mongoose;

const roleShema = new Schema({
    title: {
        type: String
    }
})
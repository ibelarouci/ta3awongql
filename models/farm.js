const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const farmSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    address: {
        type: String,

    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',

    },
    date: {
        type: Date
    },
    disable: {
        type: Boolean,
        default: false
    },
})

const Farm = mongoose.model('Farm', farmSchema);
module.exports = { Farm }
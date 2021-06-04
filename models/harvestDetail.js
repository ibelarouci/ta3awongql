const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const harvestDetailSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    discription: { type: String },
    approvation: {
        by: { type: Schema.Types.ObjectId, ref: 'User' },
        date: { type: Date },
        state: { type: Boolean },
        comment: { type: String },
    },
    disable: {
        type: Boolean,
        default: false
    },

})

const HarvestDetail = mongoose.model('HarvestDetail', harvestDetailSchema);
module.exports = { HarvestDetail }
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const harvestSchema = mongoose.Schema({
    harvestDetail: {
        type: Schema.Types.ObjectId,
        ref: 'HarvestDetail',
        //        required: true
    },
    discription: { type: String },
    startDate: {
        type: Date,
        //بداية المشروع 
    },
    harvestDate: {
        type: Date,
        // التاريخ المتوقع للحصاد

    },
    harvestCycle: {
        type: Number,
        // دورة الحصاد بالأيام

    },
    farmHarvest: {
        type: Schema.Types.ObjectId,
        ref: 'Farm',

    },
    harvestQuantity: {
        type: Number
    },
    firstApprovation: {
        by: { type: Schema.Types.ObjectId, ref: 'User' },
        date: { type: Date },
        state: { type: Boolean },
        comment: { type: String },
    },
    secondValidation: {
        by: { type: Schema.Types.ObjectId, ref: 'User' },
        date: { type: Date },
        state: { type: Boolean },
        comment: { type: String },
    },
    disable: {
        type: Boolean,
        default: false
    },

}, { timestamps: true });

const Harvest = mongoose.model('Harvest', harvestSchema);
module.exports = { Harvest }
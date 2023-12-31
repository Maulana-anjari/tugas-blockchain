const mongoose = require('mongoose')
const Schema = mongoose.Schema
const AssetsSchema = new Schema({
    assetName: {
        type: String
    },
    assetType: {
        type: String
    },
    institution: {
        type: String
    },
    assetDesc: {
        type: String
    },
    valueEstimation: {
        type: Number
    },
    location: {
        type: String
    },
    toAddress: {
        type: String
    },
    acquisitionDate: {
        type: Date
    },
},
    {
        timestamps: true
    }
)
const Assets = mongoose.model('Assets', AssetsSchema)
module.exports = Assets
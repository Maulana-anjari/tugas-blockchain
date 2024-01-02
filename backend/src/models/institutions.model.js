const mongoose = require('mongoose')
const Schema = mongoose.Schema
const InstitutionsSchema = new Schema({
    name: {
        type: String
    },
    walletAddress: {
        type: String
    }
},
    {
        timestamps: true
    }
)
const Institutions = mongoose.model('Institutions', InstitutionsSchema)
module.exports = Institutions
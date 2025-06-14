const mongoose = require('mongoose');

const BedRequestSchema = new mongoose.Schema({
    patientName: { type: String, required: true },
    patientAge : { type: Number , required : true},
    patientGender:{type : String , required : true},
    contactNumber:{type: Number , required :true},
    bedType: { type: String, required: true },
    priority: { type: String, required: true },
    medicalCondition : {type : String , required : true},
    status: { type: String, default: 'Pending' },
    timestamp: { type: Date, default: Date.now },
    hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

module.exports = mongoose.model('BedRequest', BedRequestSchema);
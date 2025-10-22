import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const authSchema = new Schema({
    name: { type: String, required: true },
    phone: { type: Number, required: true, unique: true, minlength: 11 },
    address: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: Number, default: 1 },
    report: [{
        title: String,
        fileUrl: String,
        aiSummary: String,
        date: { type: Date, default: Date.now },
    }],
})

const authModel = mongoose.model('auth', authSchema);
export default authModel;
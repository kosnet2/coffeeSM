/*
*   The mongoose schema defining each user
*/
import * as mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    surname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    alias: {
        type: String,
        required: false
    },
    age: {
        type: Number,
        required: false,
    },
    priviledge: {
        type: String,
        required: true,
    },
    position: {
        type: String,
        required: false
    },
    password: {
        type: String,
        required: true
    },
    rate: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    unavailability: {
        type: {
            permanent: {
                monday: [String],
                tuesday: [String],
                wednesday: [String],
                thursday: [String],
                friday: [String],
                saturday: [String],
                sunday: [String]
            },
            requested: [
                { fromDate: Date, toDate: Date}
            ]
        },
        required: false,
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export default userSchema;

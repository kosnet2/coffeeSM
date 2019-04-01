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
    password: {
        type: String,
        required: true
    },
    rate: {
        type: {
            hourly: { type: Number, required: false},
            fixed: { type: Number, required: false},
            unpaid: { type: Boolean, required: false}
        },
        required: true
    },
    unavailability: {
        type: {
            daysOff: [Boolean],
            hoursOff: [{start: Date, end: Date}],
        },
        required: false,
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export default userSchema;

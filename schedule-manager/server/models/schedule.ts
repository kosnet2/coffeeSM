import * as mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
    dateTime: {
        type: {
            bar1: String,
            bar2: String,
            bar3: String,
            cashier: String
        },
        required: true,
    },
    

}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export default scheduleSchema;

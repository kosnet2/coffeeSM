import * as mongoose from 'mongoose';

const scheduleSchema = new mongoose.Schema({
    dateTime: {
        type: Date,
        required: true
    },
    allocatedStaff: {
        type: [],
        required: true
    }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export default scheduleSchema;

/*
*  The mongoose schema defining the positions
*/
import * as mongoose from 'mongoose';

const positionsSchema = new mongoose.Schema({
    bar: {
        type: Number,
        required: true,
    },
    cleaners: {
        type: Number,
        required: true
    },
    kitchen: {
        type: Number,
        required: true
    },
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } });

export default positionsSchema;

import mongoose from 'mongoose';
import followSchema from './follow-schema.js'

const followModel = mongoose
    .model('Follow', followSchema);
export default followModel;

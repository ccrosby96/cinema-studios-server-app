import mongoose from 'mongoose';
import commentSchema from "./comment-schema.js";

const Comment = mongoose
    .model('Comment', commentSchema);
export default Comment;


const {Schema, model} = require('mongoose');

const BlogSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    body: {
        type: String,
        required: true,
    },
    coverImageURL: {
        type: String,
        default: './images/default_blog.png',
        required: false,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "user",
    }
}, {timestamps: true})

const Blog = model("blog", BlogSchema);

module.exports = Blog;
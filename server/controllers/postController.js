const expressAsyncHandler = require("express-async-handler");
const Post = require('../models/Post');

//get all
exports.getAllPosts = expressAsyncHandler(async (req, res) => {
const pageSize = 12;
const page = Number(req.query.pageNumber) || 1;

const keyword = req.query.keyword
? {
    category: {
        $regex: req.query.keyword,
        $options: 'i',
    },
}
: {};


const count = await Post.countDocuments({ ...keyword });
const posts = await Post.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 })

res.json({ posts, page, pages: Math.ceil(count / pageSize), count });
});
//get one
exports.getPostById = expressAsyncHandler(async (req, res) => {
const post = await Post.findById(req.params.id);
if (post) {
    res.json(post);
} else {
    res.status(404);
    throw new Error('Post não encontrado');
}
});

// create
exports.createPost = expressAsyncHandler(async (req, res) => {
const post = new Post({
    title: 'Sample title',
    user: req.user._id,
    image: '/images/sample.jpg',
    numComments: 0,
    description: 'Sample description',
    body: 'Sample body',
    category: 'Sample category'
});

const createdPost = await post.save();
res.status(201).json(createdPost);
});

//update 
exports.updatePost = expressAsyncHandler(async (req, res) => {
const {
    title,
    description,
    image,
    category,
    body,
} = req.body;

const post = await Post.findById(req.params.id);

if (post) {
    post.title = title;
    post.body = body;
    post.description = description;
    post.category = category;
    post.image = image;

    const updatedPost = await post.save();
    res.json(updatedPost);
} else {
    res.status(404);
    throw new Error('Post não encontrado');
}
});
//excluir 
exports.deletePost = expressAsyncHandler(async (req, res) => {
const post = await Post.findById(req.params.id);

if (post) {
    await post.remove();
    res.json({ message: 'Post excluído' });
} else {
    res.status(404);
    throw new Error('Post não encontrado');
}
});

exports.incrementViews = expressAsyncHandler(async (req, res) => {
    const post = await Post.findByIdAndUpdate(req.params.id, {
        $inc: { "views" : 1 }
    }, {new: true}).exec();

    if (!post)
        return res.status(204).json();
    return res.json(post);
});


//adicionar comentário

exports.createPostComment = expressAsyncHandler(async (req, res) => {
const { content } = req.body;
const post = await Post.findById(req.params.id);

if (post) {
    const comment = {
        name: req.user.name,
        avatar: req.user.avatar,
        content,
        user: req.user._id,
    };

    post.comments.push(comment);
    post.numComments = post.comments.length;

    await post.save();
    res.status(201).json({ message: 'Comentário adicionado' });
} else {
    res.status(404);
    throw new Error('Post não encontrado');
}
})

exports.getTopPosts = expressAsyncHandler(async (req, res) => {
    const posts = await Post.find({}).sort({ views: -1 }).limit(4);

    res.json(posts);
})
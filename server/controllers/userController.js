const expressAsyncHandler = require("express-async-handler");
const  generateToken = require('../utils/token');
const User = require('../models/User');

//registro

exports.registerUser = expressAsyncHandler(async (req, res) => {
const { name, email, password } = req.body;
const userExists = await User.findOne({ email });

if (userExists) {
   res.status(400);
   throw new Error('User já existe');
}
const user = await User.create({
    name,
    email,
    password,
 });
 if (user) {
    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
    });
} else {
    res.status(400);
    throw new Error('Dados de usuário inválidos');
}
});


//login
exports.authUser = expressAsyncHandler(async (req, res) => {
const { email, password } = req.body;

const user = await User.findOne({ email });

if (user && (await user.matchPassword(password))) {
    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isAdmin: user.isAdmin,
        token: generateToken(user._id),
    });
} else {
    res.status(401);
    throw new Error('Usuário ou senha inválidos');
}
});



// obter perfil
exports.getUserProfile = expressAsyncHandler(async (req, res) => {
const user = await User.findById(req.user._id);

if (user) {
    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        isAdmin: user.isAdmin,
    });
} else {
    res.status(404);
    throw new Error('User não encontrado');
}
});


exports.updateUserProfile = expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.avatar = req.body.avatar || user.avatar;
        if (req.body.password) {
            user.password = req.body.password;
        }
    
        const updatedUser = await user.save();
    
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            avatar: updatedUser.avatar,
            isAdmin: updatedUser.isAdmin,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404);
        throw new Error('User não encontrado');
    }
});


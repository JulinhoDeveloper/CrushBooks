const expressAsyncHandler = require("express-async-handler");
const User = require('../models/User')

//ver todos os usuários
exports.getAllUsers = expressAsyncHandler(async (req, res) => {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.json(users);
});

//usuário pelo id

exports.getUserById = expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    if (user) {
        res.json(user);
    } else {
        res.status(404);
        throw new Error('Usuário não encontrado');
    }
});

//atualizar
exports.updatedUser = expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = req.body.isAdmin;

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error('Usuário não encontrado');
    }
});

//excluir

exports.deleteUser = expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        await user.remove();
        res.json({ message: 'Excluído com sucesso' });
    } else {
        res.status(404);
        throw new Error('Usuário não encontrado');
    }
});
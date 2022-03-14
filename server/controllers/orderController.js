const expressAsyncHandler = require("express-async-handler");
const Order = require('../models/Order')


//create
exports.createOrder = expressAsyncHandler(async (req, res) => {
const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
} = req.body;

if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error('Sem ordems adicionado');
    return;
} else {
    const order = new Order({
        orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
}

});

exports.getOrderById = expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        'user',
        'name email avatar'
    );

    if (order) {
        res.json(order);
    } else {
        res.status(404);
        throw new Error('Order não encontrada');
    }
});


exports.getMyOrders = expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
        .sort({ createdAt: -1 });
    res.json(orders);
})


exports.getAllOrders = expressAsyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate('user', 'id name avatar')
        .sort({ createdAt: -1 });
        
    res.json(orders);
});

//atualizar ordem
exports.updateOrder = expressAsyncHandler(async (req, res) => {
const order = await Order.findById(req.params.id);
if (order) {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder)
} else {
    res.status(404);
    throw new Error('Order não encontrada');
}

});
// atualizar ordem admin
exports.updateOrderEntrega = expressAsyncHandler(async (req, res) => {
const order = await Order.findById(req.params.id);

if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
} else {
    res.status(404);
    throw new Error('Order não encontrado');
}
});
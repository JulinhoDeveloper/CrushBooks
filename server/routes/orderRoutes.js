const express = require('express')
const router = express.Router()
const OrderCtrl = require('../controllers/orderController')
const { protect, admin } = require('../middleware/authMiddleware')

router
    .route('/')
    .get(OrderCtrl.getAllOrders)
    .get(protect, OrderCtrl.getMyOrders)
    .post(protect, OrderCtrl.createOrder)
    .put(protect, OrderCtrl.updateOrder)


router
    .route('/:id')
    .get(OrderCtrl.getOrderById)
    .put(protect, admin, OrderCtrl.updateOrderEntrega)

module.exports = router
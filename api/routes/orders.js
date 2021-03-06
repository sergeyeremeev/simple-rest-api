const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const checkAuth = require('./../middleware/check-auth');

const Order = require('./../models/order');
const Product = require('./../models/product');

const ordersController = require('./../controllers/orders');

router.get('/', checkAuth, ordersController.orders_get_all);

router.post('/', checkAuth, (req, res, next) => {
    Product.findById(req.body.productId)
        .then(product => {
            if (!product) {
                return res.status(404).json({
                    message: 'Product not found'
                });
            }

            const order = new Order({
                _id: new mongoose.Types.ObjectId(),
                quantity: req.body.quantity,
                product: req.body.productId
            });

            return order.save();
        })
        .then(result => {
            console.log(result);

            res.status(201).json({
                message: 'Order stored',
                createdOrder: {
                    _id: result._id,
                    product: result.product,
                    quantity: result.quantity
                },
                request: {
                    type: 'GET',
                    url: 'http://localhost/orders/' + result._id
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
});

router.get('/:orderId', (req, res, next) => {
    Order.findById(req.params.orderId)
        .populate('product')
        .exec()
        .then(order => {
            if (!order) {
                return res.status(404).json({
                    message: 'Order not found'
                });
            }

            res.status(200).json({
                message: 'Order fetched',
                order: order,
                request: {
                    type: 'GET',
                    url: 'http://localhost/orders'
                }
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        });
});

router.delete('/:orderId', checkAuth, (req, res, next) => {
    Order.remove({ _id: req.params.orderId }).exec()
        .then(result => {
            res.status(200).json({
                message: 'Order deleted',
                order: result,
                request: {
                    type: 'POST',
                    url: 'http://localhost:3000/orders',
                    body: {
                        "quantity": "Number",
                        "productId": "ID"
                    }
                }
            })
        })
        .catch(err => {
            res.status(500).json({ error: err });
        });
});

router.get('/:orderId', (req, res, next) => {
    res.status(200).json({
        message: 'Order details',
        id: req.params.orderId
    });
});

module.exports = router;
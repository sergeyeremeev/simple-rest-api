const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// const productRoutes = require('./api/routes/products');
// const orderRoutes = require('./api/routes/orders');
const userRoutes = require('./api/routes/user');

mongoose.connect('mongodb+srv://restApiAdmin:' + process.env.MONGO_ATLAS_PW + '@restapilesson-5jubm.mongodb.net/test?retryWrites=true', { useNewUrlParser: true })
    .then(res => {
        console.log('connected successfully');
    })
    .catch(err => {
        console.log(err);
    });

mongoose.set('useCreateIndex', true);

app.use(morgan('dev'));
app.use('/uploads/', express.static('uploads')); // without first argument we would be able to access image on the root path
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE');
        return res.status(200).json({});
    }

    next();
});

// app.use('/products', productRoutes);
// app.use('/orders', orderRoutes);
app.use('/user', userRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({ // Set up this object as you like
        error: {
            message: error.message
        }
    });
});

module.exports = app;
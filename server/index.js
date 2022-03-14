const path = require('path');
const express = require("express");
require('dotenv').config();
const morgan = require("morgan");
const cors = require('cors');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const {connectDB}  = require("./config/db");

//importando as rotas
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const orderRoutes = require('./routes/orderRoutes');
const authorRoutes = require('./routes/authorRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();

//middlewares
app.use(express.json());
app.use(morgan("tiny"));
app.use(cors());

// Base de dados
connectDB();

//rotas
app.use('/api/books', bookRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/upload', uploadRoutes);

__dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

app.use(notFound);
app.use(errorHandler);

PORT =process.env.PORT || 8000;

app.listen(PORT, ()=>{
    console.log(`servidor rodando na porta:${PORT}`);
});
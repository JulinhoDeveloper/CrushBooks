const expressAsyncHandler = require("express-async-handler");
const Book = require('../models/Book')
// criar 
exports.createBook = expressAsyncHandler(async (req, res) => {
const book = new Book({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    author: 'Sample author',
    genres: 'Sample genres',
    language: 'Sample language',
    publishedAt: 'Sample Published at',
    publisher: 'Sample Publisher',
    pages: 0,
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
});
const createdBook = await book.save();
res.status(201).json(createdBook);
});

// Get All

exports.getAllBooks = expressAsyncHandler(async (req, res) => {
    const pageSize = 12;
    const page = Number(req.query.pageNumber) || 1;
    const sort = req.query.sort || '-createdAt';

    const count = await Book.countDocuments({});
    const books = await Book.find({})
        .sort(sort)
        .limit(pageSize)
        .skip(pageSize * (page - 1))

    res.json({ books, page, pages: Math.ceil(count / pageSize), count });
});

// Get One

exports.getBookById = expressAsyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);

    if (book) {
        res.json(book);
    } else {
        res.status(404)
        throw new Error('Book não encontrado');
    }
});

// Update

exports.updateBook = expressAsyncHandler(async (req, res) => {
    const {
        name,
        price,
        description,
        image,
        author,
        genres,
        language,
        publishedAt,
        publisher,
        pages,
        sales,
        countInStock,
    } = req.body;

    const book = await Book.findById(req.params.id);

    if (book) {
        book.name = name;
        book.price = price;
        book.description = description;
        book.image = image;
        book.author = author;
        book.genres = genres;
        book.language = language;
        book.publishedAt = publishedAt;
        book.publisher = publisher;
        book.pages = pages;
        book.sales = sales;
        book.countInStock = countInStock;

        const updatedBook = await book.save();

        res.json(updatedBook);
    } else {
        res.status(404);
        throw new Error('Book não encontrado');
    }
});

// Delete
exports.deleteBook = expressAsyncHandler(async (req, res) => {
    const book = await Book.findById(req.params.id);

    if (book) {
        await book.remove();
        res.json({ message: 'Excluído com sucesso' });
    } else {
        res.status(404);
        throw new Error('Book não encontrado');
    }
});

// Features
// Review criar
exports.createBookReview = expressAsyncHandler(async (req, res) => {
const { rating, comment } = req.body;
const book = await Book.findById(req.params.id);

if (book) {
    const alreadyReviewed = book.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
        res.status(400);
        throw new Error('Book já tem seu review');
    }

    const review = {
        name: req.user.name,
        avatar: req.user.avatar,
        rating: Number(rating),
        comment,
        user: req.user._id,
    };

    book.reviews.push(review);
    book.numReviews = book.reviews.length;
    book.rating = book.reviews.reduce((acc, item) => item.rating + acc, 0) / book.reviews.length;

    await book.save();
    res.status(201).json({ message: 'Review adicionado' });
} else {
    res.status(404);
    throw new Error('Book não encontrado');
}
});

// Search
exports.searchBooks = expressAsyncHandler(async (req, res) => {
const pageSize = 12;
const page = Number(req.query.pageNumber) || 1;

const keyword = req.query.keyword
    ? {
        name: {
            $regex: req.query.keyword,
            $options: 'i',
        },
    }
    : {};

const genres = req.query.genres
    ? {
        genres: {
            $regex: req.query.genres,
            $options: 'i',
        },

    }
    : {};

const rate = req.query.rate
    ? {
        rating: {
            $eq: req.query.rate,
        },

    }
    : {};

const price = req.query.bottom && req.query.top
    ? {
        price: {
            $gte: req.query.bottom,
            $lte: req.query.top,
        }
    } : {};

const count = await Book.countDocuments({ ...keyword, ...genres, ...rate, ...price });
const books = await Book.find({ ...keyword, ...genres, ...rate, ...price })
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

res.json({ books, page, pages: Math.ceil(count / pageSize), count });

});

// top 

exports.getTopBooks = expressAsyncHandler(async (req, res) => {
    const books = await Book.find({}).sort({ rating: -1 }).limit(3);

    res.json(books);
});

// top vendas
exports.getSalesBook = expressAsyncHandler(async (req, res) => {
    const books = await Book.find({}).sort({ sales: -1 }).limit(4)

    res.json(books);
});

//novos 

exports.getNewReleasesBook = expressAsyncHandler(async (req, res) => {
    const books = await Book.find({}).sort({ createdAt: -1 }).limit(5)

    res.json(books);
});


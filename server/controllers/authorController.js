const expressAsyncHandler = require("express-async-handler");
const Author = require('../models/Author')
// create
exports.createAuthor = expressAsyncHandler(async (req, res) => {
const {
    name,
    about,
    portrait,
} = req.body;

const author = await Author.findById(req.params.id);

if (author) {
    author.name = name;
    author.about = about;
    author.portrait = portrait;

    const keyword = name
        ? {
            author: {
                $regex: name,
                $options: 'i',
            },
        }
        : {};

    const count = await Book.countDocuments({ ...keyword });
    const books = await Book.find({ ...keyword })
    books.map((book) => {
        const addBook = {
            item: book._id,
            image: book.image,
            name: book.name,
        };

        const alreadyBook = author.books.find(
            (r) => r.item.toString() === addBook.item.toString()
        )

        if (!alreadyBook) {
            author.books.push(addBook);
        }
    })

    author.numBooks = count;
    const updatedAuthor = await author.save();
    res.json(updatedAuthor);
} else {
    res.status(404);
    throw new Error('Author não encontrado');
}
});
// alterar
exports.updateAuthor = expressAsyncHandler(async (req, res) => {
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

    const authorOfBook = await Author.findOne({ name: book.author });

    if (authorOfBook) {
        const addBook = {
            item: updatedBook._id,
            image: updatedBook.image,
            name: updatedBook.name,
        };

        const alreadyBook = authorOfBook.books.find(
            (r) => r.item.toString() === addBook.item.toString()
        );

        if (!alreadyBook) {
            authorOfBook.books.push(addBook);
        }

        authorOfBook.numBooks = authorOfBook.books.length;
        await authorOfBook.save();
    }

    res.json(updatedBook);
} else {
    res.status(404);
    throw new Error('Book não encontrado');
}
});

// get
exports.getAllAuthors = expressAsyncHandler(async (req, res) => {
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

const count = await Author.countDocuments({ ...keyword });
const authors = await Author.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 })

res.json({ authors, page, pages: Math.ceil(count / pageSize), count });
});


//get one
exports.getAuthorById = expressAsyncHandler(async (req, res) => {
const author = await Author.findById(req.params.id);
if (author) {
    res.json(author);
} else {
    res.status(404)
    throw new Error('Author não encontrado');
}
});
// excluir  
exports.deleteAuthor = expressAsyncHandler(async (req, res) => {
const author = await Author.findById(req.params.id);

if (author) {
    await author.remove();
    res.json({ message: 'Author excluído com sucesso' });
} else {
    res.status(404);
    throw new Error('Author não encontrado');
}
});

exports.getTopAuthors = expressAsyncHandler(async (req, res) => {
    const authors = await Author.find({}).sort({ numBooks: -1 }).limit(4);

    res.json(authors);
})

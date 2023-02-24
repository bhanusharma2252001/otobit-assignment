const express = require('express');
const app = express();
const { v4 : uuidv4 } = require('uuid')
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

const dotenv = require('dotenv').config();
const db = require("./db/db")
 
let authors = [ ];
let books = [];

app.get("/",(req,res)=>
{
    res.json({message:"Welcome to Server"})
})


// author module
app.post("/author",( req, res)=>
{
  if(authors.length!=0) {
    const isNameExist = authors.find(author=>author.name === req.body.name)
    if(isNameExist) return res.status(400).json({ message:'failure',error:'author already exist'})
  }
  const createdAuthor = {...req.body,id:uuidv4()}
  authors.push(createdAuthor)
  return res.status(200).json({ 
    message:'success',
    user:createdAuthor })
})

app.get("/author", ( req, res)=>
{
  return res.status(200).json({ message:'success', authors})
})

app.patch("/author/:id", ( req, res)=>{
 
  const foundAuthor = authors.find((author)=>author.id === req.params.id);
  if(!foundAuthor)  return res.status(400).json({ message:'failure',error:'author id does not exist'})

  const isNameExist = authors.find(author=>author.name === req.body.name)
  if(isNameExist) return res.status(400).json({ message:'failure',error:'author name already exist'})
 let updatedAuthor;
  for (const author of authors) {
    if(author.id === req.params.id){
      author.name = req.body.name;
      updatedAuthor = author;
    }
  }
  return res.status(200).json({ 
    message:'success',
    user:updatedAuthor })
})

app.delete("/author/:id", (req, res)=>
{
  const foundAuthor = authors.find((author)=>author.id === req.params.id);
  if(!foundAuthor)  return res.status(400).json({ message:'failure',error:'author id does not exist'})

  authors = authors.filter((author)=>author.id !== req.params.id);
  return res.status(200).json({ 
    message:'success',
    deletedAuthor:foundAuthor })
})

app.get("/author/getAllbooksOfAuthor/:id", ( req, res)=>
{
  const foundAuthor = authors.find((author)=>author.id === req.params.id);
  if(!foundAuthor)  return res.status(400).json({ message:'failure',error:'author id does not exist'});

  const foundBooksOfAuthor = books.filter((book)=>book.authorId === req.params.id);

  return res.status(200).json({ 
    message:'success',
    foundAuthor,
    foundBooksOfAuthor })

})


// Book Module 
app.post("/book",(req,res)=>
{
  if(books.length!=0){
    const isISBNExist = books.find((book)=>book.ISBN === req.body.ISBN);
    if(isISBNExist) return res.status(400).json( { message: 'failure', error: ' ISBN already exists'})
  }
  const createdBook = {...req.body,id:uuidv4()}
  books.push(createdBook)
  return res.status(200).json({ 
    message:'success',
    user:createdBook })
})

app.get("/book", ( req, res)=>
{
  return res.status(200).json({ message:'success', books})
})

app.patch("/book/:id", ( req, res)=>{
 
  const foundBook = books.find((book)=>book.id === req.params.id);
  if(!foundBook)  return res.status(400).json({ message:'failure',error:'book id does not exist'})

  const isISBNExist = books.find(book=>book.ISBN === req.body.ISBN)
  if(isISBNExist) return res.status(400).json({ message:'failure',error:'book ISBN already exist'})
 
  let updatedBook;

  for (const book of books) {
    if(book.id === req.params.id) {
      if(req.body.ISBN) { book.ISBN = req.body.ISBN}
      if(req.body.authorId) { book.authorId = req.body.authorId}
      if(req.body.bookName) { book.bookName = req.body.bookName};
      updatedBook = book;
    }
  }
  return res.status(200).json({ 
    message:'success',
    updatedBook })
})

app.delete("/book/:id", (req, res)=>
{
  const foundBook = books.find((book)=>book.id === req.params.id);
  if(!foundBook)  return res.status(400).json({ message:'failure',error:'book id does not exist'})

  books = books.filter((book)=>book.id !== req.params.id);
  return res.status(200).json({ 
    message:'success',
    deletedBook:foundBook })
})

app.get("/getBookWithAuthor/:id", ( req, res)=>{
  const foundBook = books.find((book)=>book.id === req.params.id);
  if(!foundBook)  return res.status(400).json({ message:'failure',error:'book id does not exist'});

  const foundAuthorOfBook = authors.find((author)=>author.id === foundBook.authorId);

  return res.status(200).json({ 
    message:'success',
    foundBook,
    foundAuthorOfBook })
})

const PORT = process.env.port || 3000 ;

app.listen(PORT,(err)=>
{
if(err) throw err;
else console.log(`Server is running on port ${process.env.port}`);

})
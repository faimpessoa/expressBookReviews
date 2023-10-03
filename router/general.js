const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.query.username;
  const password = req.query.password;

  if (username && password) {
    if (!isValid(username)) { 
      users.push({"username":username,"password":password});
      return res.status(200).json({message: "User successfully registred. Now you can login"});
    } else {
      return res.status(404).json({message: "User already exists!"});    
    }
  } 
  return res.status(404).json({message: "Unable to register user."});
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books));
  return res.status(200).json({message: "OK"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  if (req.params.isbn in books) 
  {
    res.send(JSON.stringify(books[req.params.isbn]));
    return res.status(200).json({message: "OK"});
  }
  
  return res.status(404).json({message: "ISBN not found"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  let resBooks = [];
  for (const bk in books)
  {
    if (books[bk].author == req.params.author)
    {
      resBooks.push(books[bk]);
    }
  }

  res.send(JSON.stringify(resBooks));
  return res.status(200).json({message: "OK"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  let resBooks = [];
  for (const bk in books)
  {
    if (books[bk].title === req.params.title)
    {
      resBooks.push(books[bk]);
    }
  }

  res.send(JSON.stringify(resBooks));
  return res.status(200).json({message: "OK"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  if (req.params.isbn in books) 
  {
    let resRevs = [];
    for (rev in books[req.params.isbn].reviews)
    {
        resRevs.push(books[req.params.isbn].reviews[rev]);
    }
    return res.send(JSON.stringify(resRevs)).status(200);
  }
  else
  {
    return res.status(404).json({message: "ISBN not found"});
  }
});

module.exports.general = public_users;

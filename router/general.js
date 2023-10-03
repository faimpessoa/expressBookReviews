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
/*
public_users.get('/',function (req, res) {
  //Write your code here
  return res.send(JSON.stringify(books)).status(200);
});
*/

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    //Write your code here
    const promGetAll = new Promise((resolve, reject) => {
      resolve([200, JSON.stringify(books)]);
    });
  
    promGetAll.then((resp_data) => {return res.send(resp_data[1]).status(resp_data[0])});
   
  });
  

// Get book details based on ISBN
/*
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  if (req.params.isbn in books) 
  {
    return res.send(JSON.stringify(books[req.params.isbn])).status(200);
  }
  
  return res.status(404).json({message: "ISBN not found"});
 });
 */

  public_users.get('/isbn/:isbn',function (req, res) {
    //Write your code here

    const promGetISBN = new Promise((resolve, reject) => {
        if (req.params.isbn in books) 
        {
            resolve([200, JSON.stringify(books[req.params.isbn])]);
        }
        else
        {
            resolve([404, "ISBN not found"]);
        }
        
      });
    
      promGetISBN.then((resp_data) => {
        if (resp_data[0] == 200)
        {  
            return res.send(resp_data[1]).status(resp_data[0]);
        }

        return res.status(resp_data[0]).json({errmessage:resp_data[1]});
    });
   });
  

  
// Get book details based on author
/*
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

  return res.send(JSON.stringify(resBooks)).status(200);
});
*/

public_users.get('/author/:author',function (req, res) {
    //Write your code here

    const promGetByAuthor = new Promise((resolve, reject) => {

        let resBooks = [];
        for (const bk in books)
        {
            if (books[bk].author == req.params.author)
            {
                resBooks.push(books[bk]);
            }
        }

        if (resBooks.length > 0) 
        {
            resolve([200, JSON.stringify(resBooks)]);
        }
        else
        {
            resolve([404, "No books from author " + req.params.author]);
        }
        
      });
    
      promGetByAuthor.then((resp_data) => {
        if (resp_data[0] == 200)
        {  
            return res.send(resp_data[1]).status(resp_data[0]);
        }

        return res.status(resp_data[0]).json({errmessage:resp_data[1]});
        });
  });
  


// Get all books based on title
/*
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

  return res.send(JSON.stringify(resBooks)).status(200);
});
*/

public_users.get('/title/:title',function (req, res) {
    //Write your code here
    const promGetByTitle = new Promise((resolve, reject) => {

        let resBooks = [];
        for (const bk in books)
        {
            if (books[bk].title === req.params.title)
            {
            resBooks.push(books[bk]);
            }
        }

        if (resBooks.length > 0) 
        {
            resolve([200, JSON.stringify(resBooks)]);
        }
        else
        {
            resolve([404, "No title found: " + req.params.title]);
        }
        
      });

      promGetByTitle.then((resp_data) => {
        if (resp_data[0] == 200)
        {  
            return res.send(resp_data[1]).status(resp_data[0]);
        }

        return res.status(resp_data[0]).json({errmessage:resp_data[1]});
        });
  });


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  if (req.params.isbn in books) 
  {
    return res.send(JSON.stringify(books[req.params.isbn].reviews)).status(200);
  }
  else
  {
    return res.status(404).json({message: "ISBN not found"});
  }
});

module.exports.general = public_users;

const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
  let userswithsamename = users.filter((user)=>{
    return user.username === username
  });
  if(userswithsamename.length > 0){
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
  let validusers = users.filter((user)=>{
    return (user.username === username && user.password === password)
  });
  if(validusers.length > 0){
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const username = req.query.username;
  const password = req.query.password;

  if (!username || !password) {
      return res.status(404).json({message: "Error logging in"});
  }

  if (authenticatedUser(username,password)) {
    let accessToken = jwt.sign({
      data: password
    }, 'access', { expiresIn: 60 * 60 });

    req.session.authorization = {
      accessToken,username
  }
  return res.status(200).send("User successfully logged in");
  } else {
    return res.status(208).json({message: "Invalid Login. Check username and password"});
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  if (req.params.isbn in books) 
  {
    if (req.session.authorization.username in books[req.params.isbn].reviews)
    {
        books[req.params.isbn].reviews[req.session.authorization.username].text = req.query.text;
        return res.status(200).json({message:"Review updated"})    
    }
    else
    {
        let rev = {};
        rev["text"] = req.query.text;
        books[req.params.isbn].reviews[`${req.session.authorization.username}`] = rev;
        return res.status(200).json({message:"Review added"})    
    }
  }
  return res.status(404).json({message: "ISBN not found"});
  
});
  
  regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    if (req.params.isbn in books) 
    {
      if (req.session.authorization.username in books[req.params.isbn].reviews)
      {
          delete books[req.params.isbn].reviews[req.session.authorization.username];
          return res.status(200).json({message:"Review deleted"})    
      }
      else
      {
        return res.status(404).json({message: "Review not found"});
      }
    }
  
  return res.status(404).json({message: "ISBN not found"});
  
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;

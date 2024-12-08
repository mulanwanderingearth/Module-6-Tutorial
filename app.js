// const express = require("express");
// const morgan = require('morgan');
// const mongoose=require('mongoose');
// const Blog= require('./models/blog');

// const app = express();

// //conect to mongodb
// // dbURI='mongodb+srv://IvytechXinLi:Elements%402019@cluster0.2tqvg.mongodb.net/';
// const dbURI = 'mongodb+srv://IvytechXinLi:test1234@cluster0.2tqvg.mongodb.net/note-tuts?retryWrites=true&w=majority';

// mongoose.connect(dbURI)
// .then((result) => app.listen(3000))
// .catch((err) => console.log('Error connecting to MongoDB:', err));
// app.set("view engine", "ejs");
// app.set('views', './views');

// app.use(express.static('public'));
// app.use(morgan('dev'));

// app.get('/add-blog',(req,res)=>{
//   const blog=new Blog({
//     title:'new blog',
//     snippet:'about my new blog',
//     body:'more about the new day'
//   });

//   blog.save()
//     .then((result)=>{
//       res.send(result)
//     })
//     .catch((err)=>{
//       console.log(err);
//   });
  
// })
 


// app.get("/", (req, res) => {
//   const blogs = [
//     { title: 'Yoshi finds eggs', snippet: " lorem1kjsdjsifals  " },
//     { title: 'How finds eggs', snippet: " lorem1kjsdjsifals  " },
//     { title: 'mario finds eggs', snippet: " lorem1kjsdjsifals  " },
//   ];

//   res.render("index", { title: "Home",blogs:blogs });
// });

// app.get("/about", (req, res) => {
//   res.render("about", { title: "About" });
// });

// app.get("/blogs/create", (req, res) => {
//   res.render("create", { title: "Creat a blog" });
// });

// app.use((req, res) => {
//   res.render("404", { title: "404" });
// });
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');

// express app
const app = express();

// connect to mongodb & listen for requests
const dbURI = "mongodb+srv://IvytechXinLi:test1234@cluster0.2tqvg.mongodb.net/note-tuts?retryWrites=true&w=majority";

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => app.listen(3000))
  .catch(err => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use((req, res, next) => {
  res.locals.path = req.path;
  next();
});

// routes
app.get('/', (req, res) => {
  res.redirect('/blogs');
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

// blog routes
app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create a new blog' });
});

app.get('/blogs', (req, res) => {
  Blog.find().sort({ createdAt: -1 })
    .then(result => {
      res.render('index', { blogs: result, title: 'All blogs' });
    })
    .catch(err => {
      console.log(err);
    });
});

app.post('/blogs', (req, res) => {
  // console.log(req.body);
  const blog = new Blog(req.body);

  blog.save()
    .then(result => {
      res.redirect('/blogs');
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/blogs/:id', (req, res) => {
  const id = req.params.id;
  Blog.findById(id)
    .then(result => {
      res.render('details', { blog: result, title: 'Blog Details' });
    })
    .catch(err => {
      console.log(err);
    });
});

app.delete('/blogs/:id', (req, res) => {
  const id = req.params.id;
  
  Blog.findByIdAndDelete(id)
    .then(result => {
      res.json({ redirect: '/blogs' });
    })
    .catch(err => {
      console.log(err);
    });
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});
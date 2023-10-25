//jshint esversion:6

const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");
const bodyParser = require("body-parser");


const connectionDone= mongoose.connect("mongodb+srv://antispam103:AntiSpam103@cluster0.qtkc7bu.mongodb.net/BlogsDB", {useNewUrlParser: true,})
if (connectionDone){
  console.log("Connection done and DB created");
}else{
  console.log("Connection failed");
};
// const connectionDone= mongoose.connect("mongodb://127.0.0.1:27017/BlogDB", {useNewUrlParser: true,})
// if (connectionDone){
//   console.log("Connection done and DB created");
// }else{
//   console.log("Connection failed");
// };

const blogSchema=new mongoose.Schema({
  Title: String,
  Content: String
});

const Blog= mongoose.model("Blog", blogSchema);



const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public")) ;

// var blogs=[];
const blog1= new Blog({
  Title: "Hello World",
  Content: "lorem ipsum dolor sit amet lorem23  velit lore mauris vel"
});
const blog2= new Blog({
  Title: "Hello World Again",
  Content: "lorem ipsum dolor sit amet lorem23  fg fg fg fg fg fgf g fg f gfg velit lore mauris vel"
});
// var defBlogs=[blog1,blog2];

app.get('/', (req, res) => {
  // res.send("Home");
  Blog.find({}).then(foundBlogs =>{
    if(foundBlogs.length===0){
      Blog.insertMany([blog1,blog2]);
    }
    else{
      // console.log(foundBlogs.Title);
      foundBlogs.forEach(blog =>{
        console.log(blog._id);
      })
      res.render("home",{homeText:homeStartingContent , postblogs:foundBlogs});
    }
  })
  

  // res.sendFile(__dirname+"home.ejs");  
});



app.get('/about',(req,res) =>{
  res.render("about",{abouttext:aboutContent});
});

app.get('/contact',(req,res) =>{
  res.render("contact",{ contactText:contactContent});
});
app.get('/compose',(req,res) =>{
  res.render("compose");
});

app.post('/compose', (req, res) => {
  const newBlog = {
    Title: req.body.title,
    Content: _.replace(req.body.publishText, /[\r\n]/g, '')
  };

  // Check if a blog with the same title already exists
  Blog.findOne({ Title: newBlog.Title })
    .then(existingBlog => {
      if (existingBlog) {
        // A blog with the same title already exists, so send a message to the user
        // res.send("A blog with the same title already exists. Please choose a different title.");
        res.render("errors");
      } else {
        // Blog with this title doesn't exist, create a new one
        Blog.create(newBlog)
          .then(() => {
            console.log("Inserted new blog!");
            // You can add more code here to handle the success, if needed.
            res.redirect("/");
          })
          .catch((error) => {
            console.error("Error inserting the blog:", error);
            // You can add error handling code here, but don't send another response.
          });
      }
    })
    .catch((error) => {
      console.error("Error checking for existing blog:", error);
      // You can add error handling code here, but don't send another response.
    });
});



app.get("/blogs/:blogId", (req, res) => {
  var requestedTitle=req.params.blogId;

  Blog.findOne({Title:requestedTitle}).then(blog => {
    res.render("post", {title:requestedTitle, text: blog.Content});
  })
  
  
});


app.listen(3000, function() {
  console.log("Server started on port 3000");
});

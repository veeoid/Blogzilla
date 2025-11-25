const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const userRoute = require('./routes/user');

const app = express();
const PORT = 8000
mongoose.connect('mongodb://localhost:27017/blogzilla').then( (e) => {
    console.log('Sucessfully connected to mongoDB')
}
)

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.urlencoded({extended:false}));  //to handle form data
app.get("/", (req, res) =>{
    return res.render('home')
})

app.use('/user', userRoute)

app.listen(PORT, ()=>console.log(`Server started at PORT: ${PORT}, http://localhost:${PORT}`));
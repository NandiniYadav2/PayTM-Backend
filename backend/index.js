// mongodb+srv://nandiniyadav2104:Nandini@cluster0.caomkxn.mongodb.net/


const express = require("express");
const cors = require("cors");

const mainRouter = require("./routes/index");
const app = express();


app.use(cors());

app.use(express.json());



//to structure our app better --> what is this -- anew ex[ress router request would come to this handled by this router]
app.use("/api/v1", mainRouter);


// const mongoose = require("mongoose");
// mongoose.connect("mongodb+srv://nandiniyadav2104:Nandini@cluster0.caomkxn.mongodb.net/");


app.listen(3000);
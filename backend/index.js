const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const { studentRouter } = require("./router/student.router");
app.use(express.json())

app.use("/students", studentRouter);

app.get("/", (req, res) => {
    res.send("Welcome to Connect.")
})

app.listen(process.env.PORT, async () => {
    try {
        await mongoose.connect(process.env.mongoURL);
        console.log("Connected to DB")
    } catch (error) {
        console.log(error);
    }
})
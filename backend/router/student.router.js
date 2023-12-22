const express = require("express");
const studentRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { StudentModel } = require("../model/student.model");
const { auth } = require("../middlewares/auth.middleware");
studentRouter.get("/", async (req, res) => {
    try {
        let data = await StudentModel.find();
        res.status(200).send(data);
    } catch (error) {
        res.status(400).send({ "message": "Something went wrong", "err": error });
    }
})

studentRouter.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const data = await StudentModel.findOne({ email });
        if (data) {
            res.status(201).send({ "message": "Student data is already present." })
        }
        else {
            bcrypt.hash(password, 5, async (err, hash) => {
                if (err) {
                    res.status(202).send({ "message": "Something went wrong" })
                }
                else {
                    let studentData = new StudentModel({
                        name,
                        email,
                        password: hash,
                        student_code: "",
                        todo: [],
                        active: false,
                        batch: ""
                    })
                    await studentData.save()
                    res.status(200).send({ "message": "Student data is added", "data": studentData })
                }
            })
        }
    } catch (error) {
        res.status(400).send({ "message": "Something went wrong", "err": error })
    }
})

studentRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const data = await StudentModel.findOne({ email });
    try {
        if (!data) {
            res.status(201).send({ "message": "Student data is not Present, Please Register." })
        }
        else {
            bcrypt.compare(password, data.password, (err, result) => {
                if (err) {
                    res.status(202).send({ "message": "Something went wrong" })
                }
                else {
                    let token = jwt.sign({ username: data.username, userId: data._id }, "students", { expiresIn: "1h" })
                    res.status(400).send({ "message": "Login Successfully", "token": token, "studentData": data })
                }
            })
        }
    } catch (error) {
        res.status(400).send({ "message": "Something went wrong", "err": error })
    }
})

studentRouter.patch("/update/:id", auth, async (req, res) => {
    const { id } = req.params;
    try {
        await StudentModel.findByIdAndUpdate({ id }, req.body);
        res.status(200).send({ "message": "Student data Updated" })
    } catch (error) {
        res.status(400).send({ "message": "Something went wrong", "err": error })
    }
})

studentRouter.delete("/update/:id", auth, async (req, res) => {
    const { id } = req.params;
    try {
        await StudentModel.findByIdAndDelete({ id });
        res.status(200).send({ "message": "Student data Deleted" })
    } catch (error) {
        res.status(400).send({ "message": "Something went wrong", "err": error })
    }
})

module.exports = { studentRouter };
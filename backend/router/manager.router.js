const express = require("express");
const managerRouter = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { auth } = require("../middlewares/auth.middleware");
const { ManagerModel } = require("../model/manager.model");

managerRouter.get("/", async (req, res) => {
    try {
        let data = await ManagerModel.find();
        res.status(200).send(data);
    } catch (error) {
        res.status(400).send({ "message": "Something went wrong", "err": error });
    }
})

managerRouter.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const data = await ManagerModel.findOne({ email });
        if (data) {
            res.status(201).send({ "message": "Manager data is already present." })
        }
        else {
            bcrypt.hash(password, 5, async (err, hash) => {
                if (err) {
                    res.status(202).send({ "message": "Something went wrong" })
                }
                else {
                    let managerData = new ManagerModel({
                        name,
                        email,
                        password: hash,
                        student_code: "",
                        todo: [],
                        active: false
                    })
                    await studentData.save()
                    res.status(200).send({ "message": "Manager data is added", "data": managerData })
                }
            })
        }
    } catch (error) {
        res.status(400).send({ "message": "Something went wrong", "err": error })
    }
})

managerRouter.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const data = await ManagerModel.findOne({ email });
    try {
        if (!data) {
            res.status(201).send({ "message": "Manager data is not Present, Please Register." })
        }
        else {
            bcrypt.compare(password, data.password, (err, result) => {
                if (err) {
                    res.status(202).send({ "message": "Something went wrong" })
                }
                else {
                    let token = jwt.sign({ username: data.username, userId: data._id }, "students", { expiresIn: "1h" })
                    res.status(400).send({ "message": "Login Successfully", "token": token, "managerData": data })
                }
            })
        }
    } catch (error) {
        res.status(400).send({ "message": "Something went wrong", "err": error })
    }
})

managerRouter.patch("/update/:id", auth, async (req, res) => {
    const { id } = req.params;
    try {
        await ManagerModel.findByIdAndUpdate({ id }, req.body);
        res.status(200).send({ "message": "Manager data Updated" })
    } catch (error) {
        res.status(400).send({ "message": "Something went wrong", "err": error })
    }
})

managerRouter.delete("/update/:id", auth, async (req, res) => {
    const { id } = req.params;
    try {
        await ManagerModel.findByIdAndDelete({ id });
        res.status(200).send({ "message": "Manager data Deleted" })
    } catch (error) {
        res.status(400).send({ "message": "Something went wrong", "err": error })
    }
})

module.exports = { managerRouter };
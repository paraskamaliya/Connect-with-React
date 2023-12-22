const mongoose = require("mongoose");
const managerSchema = mongoose.Schema({
    name: String,
    student_code: String,
    email: String,
    password: String,
    todo: Array,
    active: Boolean
}, {
    versionKey: false
})
const ManagerModel = mongoose.model("manager", managerSchema);

module.exports = { ManagerModel };
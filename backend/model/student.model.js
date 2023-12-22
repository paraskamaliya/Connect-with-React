const mongoose = require("mongoose");
const studentSchema = mongoose.Schema({
    name: String,
    student_code: String,
    email: String,
    password: String,
    todo: Array,
    active: Boolean,
    batch: String
}, {
    versionKey: false
})
const StudentModel = mongoose.model("student", studentSchema);

module.exports = { StudentModel };
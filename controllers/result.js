const express = require("express");
const Result = require("../models/results.js");

module.exports.create = (req, res) => {
    res.render("create.ejs");
}

module.exports.post_create = async (req, res) => {
    let {name, subject1, marks1, subject2, marks2, subject3, marks3, subject4, marks4} = req.body;
    console.log(name, subject1,marks1, subject2, marks2, subject3, marks3, subject4, marks4);

    let final = await Result.create({name, subject1, marks1, subject2, marks2, subject3, marks3, subject4, marks4});

    console.log(final);
    res.redirect("/read");
}

module.exports.readResult = async (req, res) => {
    let read = await Result.find({});
    res.render("read.ejs", { read });
}

module.exports.editResult = async (req, res) => {
    let { id } = req.params;
    const edit = await Result.findById(id);
    if (!edit) {
        req.flash("error", "Listing you requested not exist.!");
        res.redirect("/read");
    }
    res.render("edit.ejs", { edit });
}
module.exports.put_update = async (req, res) => {
    let { id } = req.params;
    let finalResult = await Result.findByIdAndUpdate(id, {...req.body.result});
    res.redirect("/read");
}

module.exports.delete = async (req, res) => {
    let { id } = req.params;
    await Result.findByIdAndDelete(id);
    req.flash("error", "Result deleted");
    res.redirect("/read");
}
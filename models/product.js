const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    categories: {
        type: String
    },
    productname: {
        type: String,
    },
    Description: {
        type: String
    },
    price: {
        type: Number
    },
    link: {
        type: String
    }
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
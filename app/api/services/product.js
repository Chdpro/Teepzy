const productModel = require('../models/product');

exports.CreateProduct = async (Product) => {
    try {
        let product = await productModel.create(Product);
        let data = { status: 200, data: product, message: "Product created successfully", }
        return data;
    } catch (error) {
        console.log(error);
    }
}

exports.GetAllProducts = async (userId) => {
    try {
        let products = await productModel.find({ userId: userId, isDelete: false }).sort({ "createdAt": 1 });
        return products;
    } catch (error) {
        console.log(error);
    }
}

exports.GetAllProductsFromDash = async (userId) => {
    try {
        let products = await productModel.find({ userId: userId }).sort({ "createdAt": 1 });
        return products;
    } catch (error) {
        console.log(error);
    }
}

exports.getProductsOnSearchMatch = async (searchValue) => {
    try {
        let products = await productModel.find({ $text: { $search: searchValue }, isDelete: false })
        return products;
    } catch (error) {
        console.log(error);
    }
}

exports.DeleteProduct = async (productId) => {
    try {
        let query = { isDelete: true }
        await productModel.findByIdAndUpdate(productId, query);
    } catch (error) {
        console.log(error);
    }
}
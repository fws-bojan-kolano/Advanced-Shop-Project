const fs = require('fs');

//Load products
const getProducts = () => {
    try {
        return JSON.parse(fs.readFileSync('data/products.json', {encoding: 'utf-8'}));
    } catch (error) {
        return [];
    }
}

const getProductById = (id) => {
    const products = getProducts();
    return products.find(product => product.id === id);
}

//Get all products
const productsControllerGet = async (req, res) => {
    const products = getProducts();
    res.send({products});
}

//Get product by ID
const productsControllerGetById = async(req, res) => {
    const {id} = req.params;//get id from url params
    const product = getProductById(id);

    if(product) {
        return res.json(product);
    } else {
        return res.status(404).send({message: "Product not found!"});
    }
}

//Get product by reccomended
const productsControllerGetByRecommended = async(req, res) => {
    const {id} = req.query;
    const products = getProducts();
    let recommendedProducts = products.filter(product => product.recommended === true);

    if(id) {//exclude current product
        recommendedProducts = recommendedProducts.filter(product => product.id !== id);
    }

    if(recommendedProducts.length > 0) {
        return res.json(recommendedProducts);
    } else {
        return res.status(404).send({message: "No recommended products found!"});
    }
}

module.exports = {
    productsController: {
        productsControllerGet,
        productsControllerGetById,
        productsControllerGetByRecommended
    }
}
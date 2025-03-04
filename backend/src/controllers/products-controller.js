const fs = require('fs');
const {v4: uuidv4} = require('uuid');

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

const productsControllerAddNew = async(req, res) => {
    try {
        const { name, price, creator, description, image, recommended } = req.body;

        if(!name || !price || !creator || !description || !image || !recommended) {
            return res.status(400).send({success: false, message: "All fields are required!"});
        }

        const productsData = getProducts();

        const existingProduct = productsData.find(product => product.name === name);
        if(existingProduct) {
            return res.status(400).send({success: false, message: 'Product with this name already exists!'});
        }

        const isRecommended = recommended === "no" ? false : true;

        const newProduct = {
            id: uuidv4(),
            name,
            price,
            creator,
            description,
            image,
            recommended: isRecommended
        }

        productsData.push(newProduct);
        fs.writeFileSync(`data/products.json`, JSON.stringify(productsData, null, 2));

        res.status(201).send({
            success: true,
            message: 'Added new product!',
            product: {
                id: newProduct.id,
                name: newProduct.name,
                price: newProduct.price,
                creator: newProduct.creator,
                description: newProduct.description,
                image: newProduct.image,
                recommended: newProduct.recommended
            }
        })
    } catch (error) {
        console.error('Error during product creation:', error);
        res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
}

module.exports = {
    productsController: {
        productsControllerGet,
        productsControllerGetById,
        productsControllerGetByRecommended,
        productsControllerAddNew
    }
}
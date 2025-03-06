const fs = require('fs');
const {v4: uuidv4, validate} = require('uuid');

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

    if(req.query.page && req.query.limit) {//Show pagination only if page and limit are added as parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
    
        const totalProducts = products.length;
        const totalPages = Math.ceil(totalProducts / limit);
    
        //Page needs to be in range
        if(page < 1 || page > totalPages) {
            return res.status(400).json({success: false, message: 'Invalid page number!'});
        }
    
        const startIndex = (page -1) * limit;
        const endIndex = startIndex + limit;
        const paginatedProducts = products.slice(startIndex, endIndex);
    
        res.json({
            success: true,
            products: paginatedProducts,
            totalPages
        });
    } else {
        return res.json({success: true, products});
    }
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

//Add new product
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

//Remove product
const productsControllerRemove = async(req, res) => {
    try {
        const productsData = getProducts();
        const foundIndex = productsData.findIndex(product => product.id === req.params.id);

        if(foundIndex === -1) {
            return res.status(400).send({message: 'Product not found!'});
        }
        
        productsData.splice(foundIndex, 1);
        fs.writeFileSync(`data/products.json`, JSON.stringify(productsData, null, 2));
        return res.send({message: 'Product deleted!'});
    } catch (error) {
        console.error('Error removing product:', error);
        return res.status(500).send({success: false, message: 'Internal Server Error'});
    }
}

//Change Product
const productsControllerChange = async(req, res) => {
    try {
        const {id} = req.params;
        const updates = req.body;

        const productsData = getProducts();
        const foundIndex = productsData.findIndex(product => product.id === id);

        if(foundIndex === -1) {
            return res.status(400).send({message: 'Product not found!'});
        }

        Object.entries(updates).forEach(([key, value]) => {
            if(typeof value === 'string' && value.trim() !== '') {
                productsData[foundIndex][key] = value;
            } else if(typeof value === 'number' || typeof value === 'boolean') {
                productsData[foundIndex][key] = value;
            }
        })

        fs.writeFileSync('data/products.json', JSON.stringify(productsData, null, 2));
        return res.send({success: true, message: 'Product updated!', product: productsData[foundIndex]});

    } catch (error) {
        console.error('Error changing product:', error);
        return res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
}

module.exports = {
    productsController: {
        productsControllerGet,
        productsControllerGetById,
        productsControllerGetByRecommended,
        productsControllerAddNew,
        productsControllerRemove,
        productsControllerChange
    }
}
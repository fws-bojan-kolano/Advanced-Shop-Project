const fs = require('fs');
const {v4: uuidv4} = require('uuid');

//Load products
const getProducts = () => {
    try {
        return JSON.parse(fs.readFileSync('data/products.json', {encoding: 'utf-8'}));
    } catch (error) {
        console.error('Error loading products.json:', error);
        return [];
    }
}

const getProductById = (id) => {
    const products = getProducts();
    return products.find(product => product.id === id);
}

//Get all products
const productsControllerGet = async (req, res) => {
    let products = getProducts();

    const { sort, category, categories, creators, priceMin, priceMax, recommended } = req.query;

    if (category) {
        products = products.filter(product => product.category === category);
    }

    if (categories) {
        const selectedCategories = Array.isArray(categories) ? categories : [categories];
        products = products.filter(product => selectedCategories.includes(product.category));
    }

    if (creators) {
        const selectedCreators = Array.isArray(creators) ? creators : [creators];
        products = products.filter(product => selectedCreators.includes(product.creator));
    }

    if (priceMin !== undefined) {
        products = products.filter(product => parseFloat(product.price) >= parseFloat(priceMin));
    }

    if (priceMax !== undefined) {
        products = products.filter(product => parseFloat(product.price) <= parseFloat(priceMax));
    }

    if (recommended !== undefined) {
        const recommendedBool = String(recommended) === 'true';
        products = products.filter(product => product.recommended === recommendedBool);
    }

    switch (sort) {
        case 'asc':
            products.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'desc':
            products.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'price_low':
            products.sort((a, b) => a.price - b.price);
            break;
        case 'price_high':
            products.sort((a, b) => b.price - a.price);
            break;
        default:
            break;
    }

    if(req.query.page && req.query.limit) {//Show pagination only if page and limit are added as parameters
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
    
        const totalProducts = products.length;
        const totalPages = Math.ceil(totalProducts / limit);

        if (totalPages === 0) {
            return res.json({
                success: true,
                products: [],
                totalPages: 0,
                totalCount: 0,
                currentPage: 1
            });
        }
    
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
            totalPages,
            totalCount: totalProducts,
            currentPage: page
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
        const { name, price, creator, description, image, recommended, category } = req.body;

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
            recommended: isRecommended,
            category,
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
                recommended: newProduct.recommended,
                category: newProduct.category
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

const productsControllerSearch = async(req, res) => {
    try {
        const { query, page = 1, limit = 6, category, creators, priceMin, priceMax } = req.query;

        if(!query || query.trim() === '') {
            return res.status(400).json({ error: 'Search query is required' });
        }

        const product = getProducts();
        let  filteredProducts = product.filter(p => 
            p.name.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase())
        );

        if (category) {
            const categoryArray = Array.isArray(category) ? category : [category];
            filteredProducts = filteredProducts.filter(p => categoryArray.includes(p.category));
        }
    
        if (creators) {
            const creatorArray = Array.isArray(creators) ? creators : [creators];
            filteredProducts = filteredProducts.filter(p => creatorArray.includes(p.creator));
        }
    
        if (priceMin) {
            filteredProducts = filteredProducts.filter(p => p.price >= Number(priceMin));
        }

        if (priceMax) {
            filteredProducts = filteredProducts.filter(p => p.price <= Number(priceMax));
        }

        const total = filteredProducts.length;
        const availableCategories = Array.from(new Set(filteredProducts.map(p => p.category)));
        const availableCreators = Array.from(new Set(filteredProducts.map(p => p.creator)));

        if (total === 0) {
            return res.json({
                products: [],
                total: 0,
                totalPages: 0,
                currentPage: parseInt(page, 10),
                message: 'No products found matching your criteria.',
                categories: [],
                creators: []
            });
        }

        const pageInt = parseInt(page, 10);
        const limitInt = parseInt(limit, 10);
        const startIndex = (pageInt - 1) * limitInt;
        const endIndex = startIndex + limitInt;
        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

        res.json({
            products: paginatedProducts,
            total,
            totalPages: Math.ceil(total/limitInt),
            currentPage: pageInt,
            categories: availableCategories,
            creators: availableCreators
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const productsControllerFilters = (res) => {
    try {
        const products = getProducts();
        const categories = Array.from(new Set(products.map(p => p.category)));
        const creators = Array.from(new Set(products.map(p => p.creator)));
        res.json({ categories, creators });
    } catch (error) {
        console.error('Error fetching filter data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    productsController: {
        productsControllerGet,
        productsControllerGetById,
        productsControllerGetByRecommended,
        productsControllerAddNew,
        productsControllerRemove,
        productsControllerChange,
        productsControllerSearch,
        productsControllerFilters
    }
}
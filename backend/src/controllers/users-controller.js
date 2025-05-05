const fs = require('fs');
const bcrypt = require('bcrypt');
const {v4: uuidv4} = require('uuid');
const SALT_ROUNDS = 10;

//Load all users
const getUsers = () => {
    try {
        return JSON.parse(fs.readFileSync('data/users.json', {encoding: 'utf-8'}));
    } catch (error) {
        console.error('Error loading users.json:', error);
        return [];
    }
}

//Get all users
const usersControllerGet = async (req, res) => {
    res.send({users: getUsers()});
}

//Login
const usersLoginController = async (req, res) => {
    try {
        const {username, password} = req.body;
        const users = getUsers();
        const user = users.find(user => user.username === username);
        const isPasswordValid = user ? await bcrypt.compare(password, user.password) : false;

        if (user && isPasswordValid) {
            res.status(200).send({
                success: true,
                message: 'Login successful',
                user: {
                    id: user.id,
                    username: user.username,
                    password: user.password,
                    role: user.role,
                    email: user.email,
                    cart: user.cart,
                    orders: user.orders
                }
            });
        } else {
            res.status(400).send({success: false, message: 'Invalid username or password'});
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
}

//Registration
const usersRegisterController = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        if(!username || !email || !password || !role) {
            return res.status(400).send({ success: false, message: 'All fields are required!' });
        }

        const usersData = getUsers();
        const existingUser = usersData.find(user => user.username === username || user.email === email);
        if (existingUser) {
            return res.status(400).send({ success: false, message: 'Username or email already exists!' });
        }

        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        const newUser = {
            id: uuidv4(),
            username,
            password: hashedPassword,
            role: role,
            email,
            cart: [],
            orders: []
        }

        usersData.push(newUser);
        fs.writeFileSync('data/users.json', JSON.stringify(usersData, null, 2));

        res.status(201).send({ 
            success: true, 
            message: 'Registration successful!', 
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            } 
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
}

//My account update account
const usersUpdateAccountController = async (req, res) => {
    try {
        const { id, username, password, email } = req.body;
        const usersData = getUsers();
        const foundIndex = usersData.findIndex(user => user.id === id);

        if(!foundIndex === -1) {
            return res.status(404).send({message: 'User not found!'});
        }

        if (username) usersData[foundIndex].username = username;
        if (email) usersData[foundIndex].email = email;
        
        if (password && password.trim() !== "") {
            const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
            usersData[foundIndex].password = hashedPassword;
        }
        
        fs.writeFileSync('data/users.json', JSON.stringify(usersData, null, 2));
        return res.send({ success: true, message: 'User updated!', user: usersData[foundIndex] });
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
}

//Remove user - my account
const usersRemoveController = async (req, res) => {
    try {
        const usersData = getUsers();
        const foundIndex = usersData.findIndex(user => user.id === req.params.id);

        if(foundIndex === -1) {
            return res.status(404).send({message: 'User not found!'});
        }

        usersData.splice(foundIndex, 1);
        fs.writeFileSync('data/users.json', JSON.stringify(usersData, null, 2));
        return res.send({message: 'User deleted!'});
    } catch (error) {
        console.error('Error removing user:', error);
        return res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
}

//Change user - my account
const usersChangeUser = async (req, res) => {
    try {
        const {id} = req.params;
        const updates = req.body;//get fields to update
        const usersData = getUsers();
        const foundIndex = usersData.findIndex(user => user.id === id);

        if(foundIndex === -1) {
            return res.status(404).send({message: 'User not found!'});
        }

        //Update only provided fields
        for(const [key, value] of Object.entries(updates)) {
            if(value & value.trim() !== '') {//ignore empty values
                if(key === 'password') {
                    usersData[foundIndex][key] = await bcrypt.hash(value, SALT_ROUNDS);
                } else {
                    usersData[foundIndex][key] = value;
                }
            }
        }

        fs.writeFileSync('data/users.json', JSON.stringify(usersData, null, 2));
        return res.send({success: true, message: 'User updated!', user: usersData[foundIndex]});
    } catch (error) {
        console.error('Error changing user:', error);
        return res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
}

//Update Cart
const userUpdateCartController = async (req, res) => {
    try {
        const {id, cart} = req.body;

        if(!id || !Array.isArray(cart)) {
            return res.status(400).send({success: false, message: 'Invalid user ID or cart data!'});
        }

        const usersData = getUsers();
        const foundIndex = usersData.findIndex(user => user.id === id);

        if(foundIndex === -1) {
            return res.status(404).send({message: 'User not found!'});
        }

        //Update cart
        usersData[foundIndex].cart = cart;
        fs.writeFileSync('data/users.json', JSON.stringify(usersData, null, 2));
        res.send({
            success: true,
            message: 'Cart updated succesfully!',
            cart: usersData[foundIndex].cart
        });
    } catch (error) {
        console.error('Error changing user:', error);
        return res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
}

//Checkout
const usersControllerCheckout = async (req, res) => {
    try {
        const {id} = req.params;
        const info = req.body;
        const usersData = getUsers();
        const foundIndex = usersData.findIndex(user => user.id === id);

        if(foundIndex === -1) {
            return res.status(404).send({message: 'User not found!'});
        }

        if (!id) {
            return res.status(400).send({ success: false, message: 'User ID is required!' });
        }

        const user = usersData[foundIndex];
        
        if(!Array.isArray(user.cart) || user.cart.length === 0) {
            return res.status(400).send({ success: false, message: 'Cart is empty!' });
        }

        const newOrder = {
            orderId: uuidv4(),
            date: new Date().toISOString(),
            items: [...user.cart],
            total: info.total,
            name: info.firstAndLastName,
            email: info.checkoutEmail,
            phone: info.phone,
            address: info.address,
            zip: info.zip,
            company: info.company
        }

        user.orders.push(newOrder);
        user.cart = [];

        fs.writeFileSync('data/users.json', JSON.stringify(usersData, null, 2));
        return res.send({
            success: true,
            message: 'Checkout completed successfully!',
            order: newOrder,
            orders: user.orders
        });
    } catch (error) {
        console.error('Error during checkout:', error);
        return res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
}

module.exports = {
    usersController: {
        usersControllerGet,
        usersLoginController,
        usersRegisterController,
        usersUpdateAccountController,
        usersRemoveController,
        usersChangeUser,
        userUpdateCartController,
        usersControllerCheckout
    }
}
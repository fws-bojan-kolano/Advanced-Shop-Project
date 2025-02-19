const fs = require('fs');
const bcrypt = require('bcrypt');
const {v4: uuidv4} = require('uuid');
const SALT_ROUNDS = 10;

//Load users
const getUsers = () => {
    try {
        return JSON.parse(fs.readFileSync('data/users.json', {encoding: 'utf-8'}));
    } catch (error) {
        return [];
    }
}

//Get users
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
                    email: user.email,
                    password: user.password
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

const usersRegisterController = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if(!username || !email || !password) {
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
            email,
            password: hashedPassword
        }

        usersData.push(newUser);
        fs.writeFileSync('data/users.json', JSON.stringify(usersData, null, 2));

        res.status(201).send({ 
            success: true, 
            message: 'Registration successful!', 
            user: { id: newUser.id, username: newUser.username, email: newUser.email } 
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

module.exports = {
    usersController: {
        usersControllerGet,
        usersLoginController,
        usersRegisterController,
        usersUpdateAccountController
    }
}
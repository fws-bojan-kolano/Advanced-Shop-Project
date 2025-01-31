const fs = require('fs');

//Load users
const getUsers = () => {
    return JSON.parse(fs.readFileSync('data/users.json', {encoding: 'utf-8'}));
}

//Get users
const usersControllerGet = async (req, res) => {
    res.send({users: getUsers()});
}

//Login
const loginController = async (req, res) => {
    try {
        const {username, password} = req.body;
        const users = getUsers();
    
        const user = users.find(user => user.username === username && user.password === password);
    
        if(user) {
            res.status(200).send({success: true, message: 'Login successful'});
        } else {
            res.status(400).send({success: false, message: 'Invalid username or password'});
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
}

module.exports = {
    usersController: {
        usersControllerGet,
        loginController
    }
}
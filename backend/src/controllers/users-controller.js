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
const usersLoginController = async (req, res) => {
    try {
        const {username, password} = req.body;
        const users = getUsers();
    
        const user = users.find(user => user.username === username && user.password === password);

        if(user) {
            res.status(200).send({
                success: true,
                message: 'Login successful',
                user: user
            });
        } else {
            res.status(400).send({success: false, message: 'Invalid username or password'});
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send({ success: false, message: 'Internal Server Error' });
    }
}

//My account update account
const usersUpdateAccountController = async (req, res) => {
    try {
        const { id, username, email } = req.body;
        const usersData = getUsers();
        const foundIndex = usersData.findIndex(user => user.id === id);

        if(!foundIndex === -1) {
            return res.status(404).send({message: 'User not found!'});
        }

        if (username) usersData[foundIndex].username = username;
        if (email) usersData[foundIndex].email = email;
        
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
        usersUpdateAccountController
    }
}
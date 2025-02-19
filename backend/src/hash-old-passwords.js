/* Script that hashes unhashed passwords. Needs to be run only once in case there are unhashed passwords in data. */

const fs = require('fs');
const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

// Load users
const getUsers = () => {
    return JSON.parse(fs.readFileSync('data/users.json', { encoding: 'utf-8' }));
};

// Save users
const saveUsers = (users) => {
    fs.writeFileSync('data/users.json', JSON.stringify(users, null, 2));
    console.log('User passwords updated successfully!');
};

// Check if a string is already hashed
const isHashed = (password) => password.startsWith('$2b$');

const updatePasswords = async () => {
    let users = getUsers();
    
    for (let user of users) {
        if (!isHashed(user.password)) {
            console.log(`Hashing password for user: ${user.username}`);
            user.password = await bcrypt.hash(user.password, SALT_ROUNDS);
        }
    }

    saveUsers(users);
};

updatePasswords().catch(err => console.error('Error updating passwords:', err));
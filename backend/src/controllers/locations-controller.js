const fs = require('fs');

//Load products
const getLocations = () => {
    try {
        return JSON.parse(fs.readFileSync('data/locations.json', {encoding: 'utf-8'}));
    } catch (error) {
        console.error('Error loading locations.json:', error);
        return [];
    }
}

//Get all products
const locationsControllerGet = async (req, res) => {
    res.send({locations: getLocations()});
}

module.exports = {
    locationsController: {
        locationsControllerGet
    }
}
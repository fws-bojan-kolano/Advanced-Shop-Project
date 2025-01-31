// Example
const testData = require('../data/test.json');
const fs = require('fs');

const exampleControllerGet = async (req, res) => {
  res.send({ products: testData });
};

const exampleControllerPost = async (req, res) => {
  const { body: newProduct } = req;
  const newData = [...testData, newProduct];
  fs.writeFileSync('src/data/test.json', JSON.stringify(newData, null, 2));
  res.send({ message: 'created bla bla' });
};

const exampleControllerPut = async (req, res) => {
  const newData = [...testData];
  const foundIndex = [...newData].findIndex(
    (product) => product.id === req.body.id
  );
  if (!foundIndex === -1) {
    return res.status(404).send({ message: 'not found' });
  }

  newData[foundIndex] = req.body;
  fs.writeFileSync('src/data/test.json', JSON.stringify(newData, null, 2));
  return res.send({ message: 'updated' });
};

const exampleControllerDelete = async (req, res) => {
  const newData = [...testData];
  const foundIndex = [...newData].findIndex(
    (product) => product.id === req.body.id
  );

  if (foundIndex === -1) {
    return res.status(404).send({ message: 'not found' });
  }

  newData.splice(foundIndex, 1);
  fs.writeFileSync('src/data/test.json', JSON.stringify(newData, null, 2));
  return res.send({ message: 'deleted' });
};

module.exports = {
  exampleController: {
    exampleControllerGet,
    exampleControllerPost,
    exampleControllerPut,
    exampleControllerDelete,
  },
};

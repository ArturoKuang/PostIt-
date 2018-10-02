const fs = require('fs'); // pull in the file system module

const index = fs.readFileSync(`${__dirname}/../hosted/client.html`);
const jsBundle = fs.readFileSync(`${__dirname}/../hosted/bundle.js`);
const stylesheet = fs.readFileSync(`${__dirname}/../hosted/style.css`);

const getIndex = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'text/html' });
  response.write(index);
  response.end();
};

const getBundle = (request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/javascript' });
  response.write(jsBundle);
  response.end();
};

const getStyleSheet = (request, response) => {
  response.writeHead(200, { 'Content-type': 'text/css' });
  response.write(stylesheet);
  response.end();
};

module.exports = {
  getIndex,
  getBundle,
  getStyleSheet,
};

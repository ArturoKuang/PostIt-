const http = require('http');
const url = require('url');
const query = require('querystring');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

// added route to get for our ES5 JS bundle.
// This bundle will be created by our babel
// watch/build scripts in package.json
const urlStruct = {
  '/': htmlHandler.getIndex,
  '/bundle.js': htmlHandler.getBundle,
  '/style.css': htmlHandler.getStyleSheet,
  '/addPost': jsonHandler.addPost,
  '/getPosts': jsonHandler.getPosts,
  notFound: jsonHandler.notFound,
};

const handlePost = (request, response, parsedUrl) => {
  if (urlStruct[parsedUrl.pathname]) {
    const res = response;
    const body = [];

    request.on('error', (err) => {
      console.dir(err);
      res.statusCode = 400;
      res.end();
    });

    request.on('data', (chunk) => {
      body.push(chunk);
    });

    // on end of upload stream
    request.on('end', () => {
      const bodyString = Buffer.concat(body).toString();
      const bodyParams = query.parse(bodyString);
      urlStruct[parsedUrl.pathname](request, response, bodyParams);
    });
  }
};

const onRequest = (request, response) => {
  const parsedUrl = url.parse(request.url);
  const params = query.parse(parsedUrl.query);

  console.log(request.method);

  switch (request.method) {
    case 'GET':
      if (urlStruct[parsedUrl.pathname]) {
        urlStruct[parsedUrl.pathname](request, response, params);
      } else {
        urlStruct.notFound(request, response);
      }
      break;
    case 'HEAD':
      if (urlStruct[parsedUrl.pathname]) {
        urlStruct[parsedUrl.pathname](request, response, params);
      }
      break;
    case 'POST':
      if (urlStruct[parsedUrl.pathname]) { handlePost(request, response, parsedUrl); }
      break;
    default:
      urlStruct.notFound(request, response);
      break;
  }
};

http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);

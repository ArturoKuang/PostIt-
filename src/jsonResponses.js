const posts = {};
let id = 0;

const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

const notFound = (request, response) => {
  const responseJSON = {
    message: 'The page you are looking for was not found.',
    id: 'notFound',
  };

  respondJSON(request, response, 404, responseJSON);
};

const addPost = (request, response, body) => {
  const responseJSON = {
    message: 'invalid post',
  };

  if (!body) {
    responseJSON.id = 'missing post';
    return respondJSON(request, response, 400, responseJSON);
  }

  let responseCode = 201;

  if (posts[body.title]) {
    responseCode = 204;
  } else {
    posts[body.title] = {};
    id++;
  }

  posts[body.title].id = id;
  posts[body.title].title = body.title;
  posts[body.title].data = body.data;

  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }
  return respondJSONMeta(request, response, responseCode);
};

const getPosts = (request, response) => {
  const responseJSON = {
    posts,
  };
  respondJSON(request, response, 200, responseJSON);
};

module.exports = {
  addPost,
  notFound,
  getPosts,
};

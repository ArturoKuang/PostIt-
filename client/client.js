const handleResponse = (xhr) => {
  const content = document.querySelector("#content");

  const obj = JSON.parse(xhr.response);
  console.dir(obj);

  switch (xhr.status) {
    case 200:
      console.log('Success');
      break;
    case 201:
      console.log('Message: Created Successfully');
      break;
    case 204:
      console.log('Updated');
      break;
    case 400:
      console.log('Bad Request');
      break;
    case 404:
      console.log('Resource Not Found');
      break;
    default:
      console.log('Error code not implemented by client');
      break;
  }
};


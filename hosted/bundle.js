'use strict';

var handleResponse = function handleResponse(xhr) {
  var content = document.querySelector("#content");

  //const obj = JSON.parse(xhr.response);
  //console.dir(obj);

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
'use strict';

document.addEventListener('DOMContentLoaded', function () {

    //Initialize grid 
    var grid = null;
    var postData;
    var gridElement = document.querySelector('.grid');
    var sortField = document.querySelector('.sortOptions');
    var searchField = document.querySelector('.inputSearch');
    var updateButton = document.querySelector('#save');
    var dragOrder = [];
    var sortFieldValue;
    var searchFieldValue;

    var init = function init() {
        initGrid();
        postData = postsObject.getInstance();
        //Reset field values
        searchField.value = '';
        sortField.value = sortField[0].value;

        //set initial search query, active sort value
        searchFieldValue = searchField.value.toLowerCase();
        sortFieldValue = sortField.value;

        //search field binding
        searchField.addEventListener('keyup', function () {
            var newSearch = searchField.value.toLowerCase();
            if (searchField !== newSearch) {
                searchFieldValue = newSearch;
                filter();
            }
        });

        //sort layout binding 
        sortField.addEventListener('change', sort);

        gridElement.addEventListener('click', function (e) {
            //TODO: GET REQUEST -> QUIL
            var postKey = e.target.innerText;
            if (e.target.className !== "grid muuri") {
                if (e.target.className === "card") {
                    postKey = e.target.children[0].innerText;
                }
                var titleField = document.querySelector('#titleField');
                var quillDelta = JSON.parse(postData.getPostList[postKey].data);
                postText.setContents(quillDelta);
            }
        });

        updateButton.addEventListener('click', function (e) {
            var titleField = document.querySelector('#titleField');
            if (titleField.value.length !== 0) {
                window.delta = quill.getContents();

                var xhr = new XMLHttpRequest();
                xhr.open('POST', '/addPost');
                xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                xhr.setRequestHeader('Accept', 'application/json');
                xhr.onload = function () {
                    return handleResponse(xhr, true);
                };
                var data = 'title=' + titleField.value + '&data=' + JSON.stringify(window.delta);
                //const postData = JSON.stringify(data);
                xhr.send(data);
            }
            grid.refreshItems();
            updateGrid(e);
            e.preventDefault();
            return false;
        });
    };

    var filter = function filter() {
        grid.filter(function (item) {
            var element = item.getElement();
            var isSearchMatch = !searchFieldValue ? true : (element.getAttribute('data-title') || '').toLowerCase().indexOf(searchFieldValue) > -1;
            return isSearchMatch;
        });
    };

    var sort = function sort() {
        //Do nothing if sort value did not change
        var currentSort = sortField.value;
        if (sortFieldValue === currentSort) {
            return;
        }

        if (sortFieldValue === 'order') {
            dragOrder = grid.getItems();
        }

        grid.sort(currentSort === 'title' ? compareItemTitle : currentSort === 'recent' ? compareItemRecent : dragOrder);
        sortFieldValue = currentSort;
    };

    var updateGrid = function updateGrid(e) {
        requestUpdate(e);
    };

    var initGrid = function initGrid() {
        grid = new Muuri(gridElement, {
            layoutDuration: 400,
            layoutEasing: 'ease'
        });
    };

    var handleGetResponse = function handleGetResponse(xhr) {
        handleResponse(xhr);
        var posts = JSON.parse(xhr.response);
        postData.addPost(posts.posts);
        var newElems = generateElements(postData.getNewPost);
        if (newElems.length) grid.add(newElems);

        //sort items
        grid.sort(sortFieldValue === 'title' ? compareItemTitle : compareItemRecent);
        //filter items
        filter();
    };

    var requestUpdate = function requestUpdate(e) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', '/getPosts');
        xhr.setRequestHeader("Accept", 'application/json');

        xhr.onload = function () {
            return handleGetResponse(xhr);
        };

        xhr.send();
        e.preventDefault();
        return false;
    };

    var getRandomInt = function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    var compareItemTitle = function compareItemTitle(a, b) {
        var aVal = a.getElement().getAttribute('data-title') || '';
        var bVal = b.getElement().getAttribute('data-title') || '';
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    };

    var compareItemRecent = function compareItemRecent(a, b) {
        var aId = parseInt(a.getElement().getAttribute('data-id'));
        var bId = parseInt(b.getElement().getAttribute('data-id'));
        return aId - bId;
    };

    var generateElements = function generateElements(posts) {
        var ret = [];
        while (postData.getNewPost.length > 0) {
            var newPost = postData.getNewPost.pop();
            ret.push(generateElement(newPost.id, newPost.title));
        }
        return ret;
    };

    var generateElement = function generateElement(id, title) {
        var itemElem = document.createElement('div');
        var height = getRandomInt(1, 2);
        var width = 2;
        var classNames = 'item h' + height + ' w' + width;
        var itemTemplate = '' + '<div class="' + classNames + '" data-id="' + id + '" data-title="' + title + '">' + '<div class="item-content">' + '<div class="card">' + '<div class="card-title">' + title + '</div>' + '<div class="card-id">' + id + '</div>' + '</div>' + '</div>' + '</div>';

        itemElem.innerHTML = itemTemplate;
        return itemElem.firstChild;
    };

    var quill = new Quill('#editor', {
        theme: 'snow'
    });

    var postText = new Quill('#postText', {
        theme: ''
    });

    postText.enable(false);

    // $('#save').click(function (e) {
    //     const titleField = document.querySelector('#titleField');
    //     if (titleField.value.length !== 0) {
    //         window.delta = quill.getContents();

    //         const xhr = new XMLHttpRequest();
    //         xhr.open('POST', '/addPost');
    //         xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    //         xhr.setRequestHeader('Accept', 'application/json');
    //         xhr.onload = () => handleResponse(xhr, true);
    //         const data = `title=${titleField.value}&data=${JSON.stringify(window.delta)}`;
    //         //const postData = JSON.stringify(data);
    //         xhr.send(data);
    //         e.preventDefault();
    //         return false;
    //     }
    // });

    init();
});
"use strict";

var postsObject = function () {
    var instance;

    function createInstance() {
        var postsList = {};
        var newPost = [];

        return {
            addPost: function addPost(serverPostList) {
                for (var key in serverPostList) {
                    if (!postsList[key]) {
                        postsList[key] = {};
                        newPost.push(serverPostList[key]);
                    }
                    postsList[key].id = serverPostList[key].id;
                    postsList[key].title = serverPostList[key].title;
                    postsList[key].data = serverPostList[key].data;
                }
            },
            getPostList: postsList,
            getNewPost: newPost
        };
    };

    return {
        getInstance: function getInstance() {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
}();

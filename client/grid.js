document.addEventListener('DOMContentLoaded', function () {

    //Initialize grid 

    var grid = null;
    var docElem = document.documentElement;
    var gridElement = document.querySelector('.grid');
    var sortField = document.querySelector('.sort');
    var searchField = document.querySelector('.search');
    var updateButton = document.querySelector('.updateButton');
    var sortFieldValue;
    var searchFieldValue;

    function init() {
        initGrid();

        //Reset field values
        searchField.value = '';
        sortField.value = sortField.querySelector('.sortOptions')[0].value;

        //set initial search query, active sort value
        searchFieldValue = searchField.value.toLowerCase();
        sortFieldValue = sortField.value;

        //search field binding
        searchField.addEventListener('keyup', function () {
            var newSearch = searchField.value.toLowerCase();
            if (searchField !== newSearch) {
                searchFieldValue = newSearch;
                //filter();
            }
        });

        //sort layout binding 
        //TODO: sortField.addEventListener('change', sort);

        gridElement.addEventListener('click', function (e) {
            //TODO: GET REQUEST -> QUIL
        });

        updateButton.addEventListener('click', function (e) {
            clearGrid();
            grid.refreshItems();
            updateGrid(e);
        });

    }

    function clearGrid(e) {
        gridElement.innerHTML = '';
    }

    function updateGrid(e) {
        requestUpdate(e);
    }

    function initGrid() {
        grid = new Muuri(gridElement);
    }

    const handleGetResponse = (xhr) => {
        handleResponse(xhr);
        const posts = JSON.parse(xhr.response);
        var newElems = generateElements(posts);
        grid.add(newElems);

    };

    const requestUpdate = (e) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', '/getPosts');
        xhr.setRequestHeader("Accept", 'application/json');

        xhr.onload = () => handleGetResponse(xhr);

        xhr.send();
        e.preventDefault();
        return false;
    };


    const getRandomInt = (min, max) => {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };

    const generateElements = (posts) => {
        const grid = document.querySelector('.grid');
        var ret = [];
        var postList = posts.posts;
        for (var key in postList) {
            ret.push(generateElement(key, postList[key].title));
        }
        return ret;
    };

    const generateElement = (id, title) => {
        var itemElem = document.createElement('div');
        var height = getRandomInt(1, 2);
        var width = getRandomInt(1, 2);
        var classNames = 'item h' + height + ' w' + width;
        itemElem.className = 'item';
        var itemTemplate = '' +
            '<div class="' + classNames + '" data-id="' + id + '" data-title="' + title + '">' +
            '<div class="item-content">' +
            '<div class="card">' +
            '<div class="card-title">' + title + '</div>' +
            '<div class="card-id">' + id + '</div>' +
            '</div>' +
            '</div>';
        '</div>';

        itemElem.innerHTML = itemTemplate;
        return itemElem.firstChild;
    };

    init();
});


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


    const init = () => {
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
                const titleField = document.querySelector('#titleField');
                var quillDelta = JSON.parse(postData.getPostList[postKey].data);
                postText.setContents(quillDelta);
            }
        });

        updateButton.addEventListener('click', function (e) {
            const titleField = document.querySelector('#titleField');
            const xhr = new XMLHttpRequest();
            if (titleField.value.length !== 0) {
                window.delta = quill.getContents();

                xhr.open('POST', '/addPost');
                xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                xhr.setRequestHeader('Accept', 'application/json');
                xhr.onload = () => {
                    handleResponse(xhr, true);
                    grid.refreshItems();
                    updateGrid(e);
                }
                const data = `title=${titleField.value}&data=${JSON.stringify(window.delta)}`;
                //const postData = JSON.stringify(data);
                xhr.send(data);
            }
            e.preventDefault();
            return false;
        });

    };

    const filter = () => {
        grid.filter(function (item) {
            var element = item.getElement();
            var isSearchMatch = !searchFieldValue ? true : (element.getAttribute('data-title') || '').toLowerCase().indexOf(searchFieldValue) > -1;
            return isSearchMatch;
        });
    };

    const sort = () => {
        //Do nothing if sort value did not change
        var currentSort = sortField.value;
        if (sortFieldValue === currentSort) {
            return;
        }

        if (sortFieldValue === 'order') {
            dragOrder = grid.getItems();
        }

        grid.sort(
            currentSort === 'title' ? compareItemTitle :
                currentSort === 'recent' ? compareItemRecent :
                    dragOrder
        );
        sortFieldValue = currentSort;
    };

    const updateGrid = (e) => {
        requestUpdate(e);
    };

    const initGrid = () => {
        grid = new Muuri(gridElement, {
            layoutDuration: 400,
            layoutEasing: 'ease'
        });
    };

    const handleGetResponse = (xhr) => {
        handleResponse(xhr);
        const posts = JSON.parse(xhr.response);
        postData.addPost(posts.posts);
        var newElems = generateElements(postData.getNewPost);
        if (newElems.length)
            grid.add(newElems);

        //sort items
        grid.sort(sortFieldValue === 'title' ? compareItemTitle : compareItemRecent);
        //filter items
        filter();
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

    const compareItemTitle = (a, b) => {
        var aVal = a.getElement().getAttribute('data-title') || '';
        var bVal = b.getElement().getAttribute('data-title') || '';
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
    }

    const compareItemRecent = (a, b) => {
        var aId = parseInt(a.getElement().getAttribute('data-id'));
        var bId = parseInt(b.getElement().getAttribute('data-id'));
        return aId - bId;
    }

    const generateElements = (posts) => {
        var ret = [];
        while (postData.getNewPost.length > 0) {
            var newPost = postData.getNewPost.pop();
            ret.push(generateElement(newPost.id, newPost.title));
        }
        return ret;
    };

    const generateElement = (id, title) => {
        var itemElem = document.createElement('div');
        var height = getRandomInt(1, 2);
        var width = 2;
        var classNames = 'item h' + height + ' w' + width;
        var itemTemplate = '' +
            '<div class="' + classNames + '" data-id="' + id + '" data-title="' + title + '">' +
            '<div class="item-content">' +
            '<div class="card">' +
            '<div class="card-title">' + title + '</div>' +
            '<div class="card-id">' + id + '</div>' +
            '</div>' +
            '</div>' +
            '</div>';

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
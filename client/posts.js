var postsObject = (function () {
    var instance;

    function createInstance() {
        var postsList = {};
        var newPost = [];

        return {
            addPost: function (serverPostList) {
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
            getNewPost: newPost,
        }
    };

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    }

})();

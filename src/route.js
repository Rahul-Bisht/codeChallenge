app.config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'views/welcome.html',
        controller: 'locations'
    }).when('/category', {
        templateUrl: 'views/category.html',
        //controller: 'category'
    }).when('/subcategory',{
        templateUrl:'views/subcategory.html'
    });

});
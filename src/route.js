app.config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'views/welcome.html',
        controller: 'mainCtrl'
    }).when('/category/:name', {
        templateUrl: 'views/category.html',
        controller: 'category'
    }).when('/subcategory/:name',{
        templateUrl:'views/subcategory.html',
        controller: 'subcategory'
    });

});
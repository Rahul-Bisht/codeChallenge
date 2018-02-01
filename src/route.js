app.config(function ($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'views/welcome.html',
        controller: 'mainCtrl'
    }).when('/category/:action/:name', {
        templateUrl: 'views/category.html',
        controller: 'category'
    }).when('/subcategory/:action/:name',{
        templateUrl:'views/subcategory.html',
        controller: 'subcategory'
    });

});
var app =angular.module('myApp',['ngRoute']);

app.controller('locations',['$scope','$location','selectedData',function(scope,$location,selectedData){
    scope.category=[];
    scope.subCategory=[];
    scope.goToCategory=function(){
        
        var args=arguments;
        if (!args) return;
        var loc=data.data.locations[args[0]];
        scope.category=loc.branches[args[1]].categories
         $location.path('/category');
    }
    scope.goToSubCategory=function(index){
        scope.subCategory=scope.category[index].subcategories;
        $location.path('/subcategory');
    }
    scope.goBack=function(){
        $location.path('/category');
    }
}]);
app.controller('category',['$scope','selectedData',function(scope,selectedData){
    
    scope.category=[];
    var args=selectedData.get();
    if (!args) return;
    var loc=data.data.locations[args[0]];
    scope.category=loc.branches[args[0]].categories
}]);


app.directive('dropDown',function($compile,$http){
    return{
        restrict:'E',
        compile:function(elem,attr){
            return{
                pre:function(scope,iElem,iAttr){
                    scope.location=[];
                    // /data &&  (scope.location=data.data.locations);
                },
                post:function(scope,iElem,iAttr){
                    $http.get('/data/catalog_backup.json').then(function(res){
                        scope.location=res.data.data.locations;
                    }).catch(function(err){
                        console.log(err.msg);
                    });
                    var template='<ul class="dropdown-menu"> <li ng-repeat="loc in location" class="dropdown-submenu"> <a href="#" class="expand" location="{{loc.name}}" dealerid="{{loc.dealers_id}}">{{loc.name}}<span class="caret"></span></a> <ul class="dropdown-menu" ng-if="loc.branches.length>0"> <li ng-repeat="branch in loc.branches"> <a href="#category" class="expand" branch="{{branch.name}}" ng-click="goToCategory($parent.$index,$index)" dealerid="{{branch.branch_id}}">{{branch.name}}</a> </li></ul> </li></ul>';
                    var linkFunction=$compile(template);
                    var content=linkFunction(scope);
                    var target=$(iElem);
                    target.after(content);
                    target.remove();
                    setTimeout(() => {
                        (function(){   
                            var prev; 
                            $('.dropdown-submenu a.expand').on("click", function (e) {
                                if (prev){
                                    prev.toggle();
                                }
                            prev=$(this).next('ul');
                            prev.toggle();
                            e.stopPropagation();
                            e.preventDefault();
                        });
                        })();
                    }, 500);
                }
            }
        }
    }
});
var app =angular.module('myApp',['ngRoute']);
app.factory('selectedData',function(){
    var _data;
    function getData(){
        return _data;
    }
    function setData(data){
        _data=data;
    }
    return{get:getData,set:setData}
})

app.controller('locations',['$scope','$window','selectedData',function(scope,$window,selectedData){
    scope.category=[];
    scope.subCategory=[];
    scope.isCategory=false;
    scope.isSubCategory=true;
    scope.goToCategory=function(){
        
        var args=arguments;
        if (!args) return;
        var loc=data.data.locations[args[0]];
        scope.category=loc.branches[args[1]].categories
        //toggleCategories();
        // var host=$window.location.host;
        // var url=host+'/category'
        // $window.location.href=url;
        // selectedData.set(arguments);
         $location.path('/category');
    }
    scope.goToSubCategory=function(index){
        scope.subCategory=scope.category[index].subcategories;
        $location.path('/subcategory');
        //toggleCategories();
    }
    scope.goBack=function(){
        //toggleCategories();
    }

    function toggleCategories(){
        scope.isCategory=!scope.isCategory;
        scope.isSubCategory=!scope.isSubCategory;
    }
}]);
app.controller('category',['$scope','selectedData',function(scope,selectedData){
    
    scope.category=[];
    var args=selectedData.get();
    if (!args) return;
    var loc=data.data.locations[args[0]];
    scope.category=loc.branches[args[0]].categories
}]);


app.directive('dropDown',function($compile){
    return{
        restrict:'E',
        compile:function(elem,attr){
            return{
                pre:function(scope,iElem,iAttr){
                    scope.location=[];
                    data &&  (scope.location=data.data.locations);
                },
                post:function(scope,iElem,iAttr){
                    var template='<ul class="dropdown-menu"> <li ng-repeat="loc in location" class="dropdown-submenu"> <a href="#" class="expand" location="{{loc.name}}" dealerid="{{loc.dealers_id}}">{{loc.name}}<span class="caret"></span></a> <ul class="dropdown-menu" ng-if="loc.branches.length>0"> <li ng-repeat="branch in loc.branches"> <a href="#" class="expand" branch="{{branch.name}}" ng-click="goToCategory($parent.$index,$index,branch.name)" dealerid="{{branch.branch_id}}">{{branch.name}}</a> </li></ul> </li></ul>';
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
                            prev=$(this).next('ul')
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
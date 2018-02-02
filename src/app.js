
var app =angular.module('myApp',['ngRoute']);

app.factory('selectedCategory',function(){
    var _data;

    function getData(){
        return _data;
    }
    function setData(data){
        _data=data;
    }
    return{set:setData,get:getData};

});
app.factory('selectedSubCategory',function(){
    var _data;

    function getData(){
        return _data;
    }
    function setData(data){
        _data=data;
    }
    return{set:setData,get:getData};
});
app.factory('locationData',function(){
    var _data;

    function getData(){
        return _data;
    }
    function setData(data){
        _data=data;
    }
    return{set:setData,get:getData};
});

app.factory('breadCrumb',
['$rootScope','$location',function($rootScope,$location){
    var brCrumbs=[],breadCrumbService={};
    var step=0,crums={};
    
    $rootScope.$on('$routeChangeSuccess',function(event,current){
        var pElements=$location.path().split('/'),result={};
        pElements.shift();

        if (pElements.length<=0) return;
        var route=pElements[0];

        if (route.trim() === '') {
            brCrumbs.length = 0;
            return;
        }


        if(crums.hasOwnProperty(route)){
            step=crums[route];
            brCrumbs.splice(step+1);

            for(var key of Object.keys(crums)){
                if (crums[key]>step){
                    delete crums[key];
                }
            }
        }
        else{
            crums[route]=step;
            result['action']='#'+route;
            result['name']=current.params.name ||route;
            brCrumbs.push(result);
        }       
        step=brCrumbs.length;
    });
    breadCrumbService.getAll=function(){
        return brCrumbs;
    }

    return breadCrumbService;
}]);

app.controller('mainCtrl',['$scope','$location','$timeout','selectedCategory'
,'selectedSubCategory','locationData','breadCrumb',
function($scope,$location,$timeout,selectedCategory,selectedSubCategory,locationData,breadCrumb){
    $scope.breadCrumb=breadCrumb;

    $scope.goToCategory=function(pIndex,cIndex){
        selectedCategory.set({pIndex:pIndex,cIndex:cIndex});//update selected category indexes
        $timeout(function(){
            $location.path('/category/Equipment category');
        });
        
    };
    $scope.goToSubCategory=function(index,name){
        selectedSubCategory.set({index:index});//update selected sub-category index
        $timeout(function(){
            $location.path('/subcategory/'+name);
        });
    };
}]);

app.controller('category',['$scope','locationData','selectedCategory',
function($scope,locationData,selectedCategory){
    var index=selectedCategory.get();
    var data=locationData.get();
    var loc=data[index.pIndex];
    $scope.category=loc.branches[index.cIndex].categories;
}]);

app.controller('subcategory',['$scope','selectedCategory','selectedSubCategory','locationData',
function($scope,selectedCategory,selectedSubCategory,locationData){
    var cIndex=selectedCategory.get();
    var data=locationData.get();
    var loc=data[cIndex.pIndex];
    var category=loc.branches[cIndex.cIndex].categories;
    $scope.subCategory=category[selectedSubCategory.get().index].subcategories;
}]);


app.directive('dropDown',['$compile','$http','locationData',function($compile,$http,locationData){
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
                        locationData.set(res.data.data.locations);
                        scope.location=res.data.data.locations;
                    }).catch(function(err){
                        console.log(err.msg);
                    });
                    var template='<ul class="dropdown-menu"> <li ng-repeat="loc in location" class="dropdown-submenu"> <a href="#" class="expand" location="{{loc.name}}" dealerid="{{loc.dealers_id}}">{{loc.name}}<span class="caret"></span></a> <ul class="dropdown-menu" ng-if="loc.branches.length>0"> <li ng-repeat="branch in loc.branches"> <a href="#" class="expand" branch="{{branch.name}}" ng-click="goToCategory($parent.$index,$index)" dealerid="{{branch.branch_id}}">{{branch.name}}</a> </li></ul> </li></ul>';
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
}]);
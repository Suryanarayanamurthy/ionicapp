// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('PomodoroApp', ['ionic','ionic.service.core','PomodoroApp.services' ,'PomodoroApp.controllers'])


//
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
      //initilize parse.
      Parse.initialize("F5XCrepedBGlhJ9Mv7EvAIxY3ESu4bsWLbkWq52h", "eWrNoxx37SIRrB2KtFWsMKe3I05auYQUNnrTV07p");
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})


.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.karma', {
    url: '/karma',
    views: {
      'menuContent': {
        templateUrl: 'templates/karma.html',
          controller: 'karmaCtrl'
      }
    }
  })

  .state('app.settings', {
      url: '/settings',
      views: {
        'menuContent': {
          templateUrl: 'templates/settings.html',
            //controller: 'clockCtrl'
        }
      }
    })
  
  .state('app.watsthis', {
      url: '/watsthis',
      views: {
        'menuContent': {
          templateUrl: 'templates/watsthis.html'
        }
      }
    })
  
    .state('app.clock', {
      url: '/clock',
      
      views: {
        'menuContent': {
          templateUrl: 'templates/clock.html',
            controller: 'clockCtrl'
        }
    }
    });

//  .state('app.single', {
//    url: '/playlists/:playlistId',
//    views: {
//      'menuContent': {
//        templateUrl: 'templates/playlist.html',
//        controller: 'PlaylistCtrl'
//      }
//    }
//  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/clock');
})


//.run(
//    ['$rootScope', '$state', '$stateParams',
//      function ($rootScope, $state, $stateParams) {
//          $rootScope.$state = $state;
//          $rootScope.$stateParams = $stateParams;
//      }
//    ])
//

angular.module('PomodoroApp.services', [])
  .factory('ListFactory', function() {

    var list = [];
    var TaskListObject = Parse.Object.extend("TaskList");
    var taskListObject = new TaskListObject();
    var query = new Parse.Query(TaskListObject);
      var ObjId;
    var listStore = localStorage.getItem("list");
    if (listStore != null && listStore != '' && angular.isArray(angular.fromJson(listStore))) {
      list = angular.fromJson(listStore);
    }
    var listSrv = {
      setList: function(newList) {
        list = newList;
        localStorage.setItem("list", angular.toJson(list));
          
          /////
          
          console.log("json:  "+angular.toJson(list));
          

//taskListObject.save(list).then(function(object) {
//  console.log("wat do u know, i actually works");
//});

              
          ///////////
          taskListObject.set("taskList", angular.toJson(list));
          taskListObject.save(null, {
  success: function(taskListObject) {
    // The object was saved successfully.
      ObjId = taskListObject.id;
      console.log("wat do u know, it actually works"+ "obj id: "+ ObjId);
  },
  error: function(taskListObject, error) {
    // The save failed.
    // error is a Parse.Error with an error code and message.
      console.log("error");
  }
});
          //////
        return true;
      },
      getList: function() {
          var foo = taskListObject.get("taskList");
          console.log(foo);
//          query.get(ObjId,{
//  success: function(myObject) {
//    console.log("success in getting" + myObject);
//      list = myObject;
//  },
//  error: function(myObject, error) {
//    // The object was not refreshed successfully.
//    console.log(" error in getting ."+error.message);
//  }
//});
          
        if (list != null) {
          return list;
        } else {
          return [];
        }
      }
    };
    return listSrv;
  })
//.factory('ParseServer',['$http','PARSE_CREDENTIALS',function($http,PARSE_CREDENTIALS){
//    return {
//        getAll:function(){
//            return $http.get('https://api.parse.com/1/classes/Todo',{
//                headers:{
//                    'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
//                    'X-Parse-REST-API-Key':PARSE_CREDENTIALS.REST_API_KEY,
//                }
//            });
//        },
//        get:function(id){
//            return $http.get('https://api.parse.com/1/classes/Todo/'+id,{
//                headers:{
//                    'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
//                    'X-Parse-REST-API-Key':PARSE_CREDENTIALS.REST_API_KEY,
//                }
//            });
//        },
//        create:function(data){
//            return $http.post('https://api.parse.com/1/classes/Todo',data,{
//                headers:{
//                    'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
//                    'X-Parse-REST-API-Key':PARSE_CREDENTIALS.REST_API_KEY,
//                    'Content-Type':'application/json'
//                }
//            });
//        },
//        edit:function(id,data){
//            return $http.put('https://api.parse.com/1/classes/Todo/'+id,data,{
//                headers:{
//                    'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
//                    'X-Parse-REST-API-Key':PARSE_CREDENTIALS.REST_API_KEY,
//                    'Content-Type':'application/json'
//                }
//            });
//        },
//        delete:function(id){
//            return $http.delete('https://api.parse.com/1/classes/Todo/'+id,{
//                headers:{
//                    'X-Parse-Application-Id': PARSE_CREDENTIALS.APP_ID,
//                    'X-Parse-REST-API-Key':PARSE_CREDENTIALS.REST_API_KEY,
//                    'Content-Type':'application/json'
//                }
//            });
//        }
//    }
//}]).value('PARSE_CREDENTIALS',{
//    APP_ID: 'F5XCrepedBGlhJ9Mv7EvAIxY3ESu4bsWLbkWq52h',
//    REST_API_KEY:'eWrNoxx37SIRrB2KtFWsMKe3I05auYQUNnrTV07p'
//});
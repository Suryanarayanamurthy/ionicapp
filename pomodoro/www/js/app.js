// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('PomodoroApp', ['ionic','ionic.service.core','PomodoroApp.services' ,'PomodoroApp.controllers'])

//
.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
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

//config for, side navigation router.
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
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/clock');
})

// using factory for list services.
angular.module('PomodoroApp.services', [])
  .factory('ListFactory', function($ionicPopup,$timeout,$q) {
    //initilize parse.
    Parse.initialize("F5XCrepedBGlhJ9Mv7EvAIxY3ESu4bsWLbkWq52h", "eWrNoxx37SIRrB2KtFWsMKe3I05auYQUNnrTV07p");
    var list = [];
    var parseObjId;
    var ParseObjIdStore =  localStorage.getItem("objID");
    var ParseString = Parse.Object.extend("TaskList");
    var parseObject = new ParseString();
    var listStore = localStorage.getItem("list");

    if (listStore != null && listStore != '' && angular.isArray(angular.fromJson(listStore))) {
        list = angular.fromJson(listStore);
    }

    // if the parse's object id is saved locally then reuse it
    if (ParseObjIdStore != null && ParseObjIdStore != '') {
        parseObjId =   ParseObjIdStore;
    }
    // else save a new obj in parse and get it's id, and save it locally for further use.
    else
    {
        parseObject.save(null, {
        success: function(newObj) {
        // The object was saved successfully.
        parseObjId = newObj.id;
        localStorage.setItem("objID",parseObjId);
        },
        error: function(newObj, error) {
        // The save failed.
        // error is a Parse.Error with an error code and message.
        console.log(error.message);
        }
        });
    }
    var listSrv = {
        // set the list locally.
        setList: function(newList) {
            list = newList;
            localStorage.setItem("list", angular.toJson(list));
            return true;
        },
        // get the list from the local storage.
        getList: function() {
            if (list != null) {
            return list;
            } else {
            return [];
            }
        },
        // set the list obj to the parse server.
        setInParse: function(){
            var showMessage;
            //upload the list to the existing object, using parseObjID as the key
            if(parseObjId != null && parseObjId !=''){
                    var query = new Parse.Query(ParseString);
                    query.get(parseObjId, {
                    success: function(response) {
                    // The object was retrieved successfully.
                    response.set('taskList', angular.toJson(list));
                    //response.set('taskList', JSON.stringify(list));
                    response.save(null, {
                    success: function(result) {
                    // The object was saved successfully.
                    showMessage = "<h3>Success!!</h3>,<br><b> Obj id: "+ parseObjId +"</b><br> saved the Json object<br>"+angular.toJson(list) ;
                    showPopup("Message from Server",showMessage);
                    },
                    error: function(taskListObject, error) {
                    showMessage ="<h3> Error :-( </h3> <br> something went wrong, error code is: "+ error.code+ "and error message is: " +    error.message;
                    showPopup("Message from Server", showMessage);
                    }
                    });
                    },
                    error: function(object, error) {
                    showMessage ="<h3> Error :-( </h3> <br> something went wrong, error code is: "+ error.code+ "and error message is: " +    error.message;
                    showPopup("Message from Server",showMessage);
                    }
                    });
            }
            // create a new object in parse and save the object id.
            else{
                parseObject.set('taskList', angular.toJson(list));
                parseObject.save(null, {
                success: function(newObj) {
                // The object was saved successfully.
                parseObjId = newObj.id;
                localStorage.setItem("objID",parseObjId);
                showMessage = "<h3>Success!!</h3>,<br><b> Obj id: "+ parseObjId +"</b><br> saved the Json object<br>"+angular.toJson(list) ;
                showPopup("Message from Server",showMessage);
                },
                error: function(object, error) {
                showMessage ="<h3> Error :-( </h3> <br> something went wrong, error code is: "+ error.code+ "and error message is: " +    error.message;
                showPopup("Message from Server",showMessage);
                }
                });
            }
        },
        // perform asynchronous get,
        // 1st look for the list in the local storage if not available then try getting it from the server.        
        getListAsync: function(){
            return $q(function(resolve, reject) {
            //list is available locally.
            if (list != null) {
                resolve(list);
            }
            // else try to get it from the Parse using the object id
            else{
                // if the parse's object id is saved locally then reuse it
                if (parseObjId != null && parseObjId != '') {
                    var query = new Parse.Query(ParseString);
                    query.get(parseObjId, {
                    success: function(response) {
                    list = angular.fromJson(response.get("taskList"));
                    resolve(list);
                    },
                    error: function(object, error) {
                    console.log("get from parse had an error: " + error.message);
                    reject("get from parse had an error: " + error.message);
                    }
                    });
                }
                // else save a new obj in parse and get it's id, and save it locally for further use.
                // and return an empty list.
                else
                {
                    parseObject.save(null, {
                        success: function(newObj) {
                            // The object was saved successfully.
                            parseObjId = newObj.id;
                            list =[];
                            localStorage.setItem("objID",parseObjId);
                            localStorage.setItem("list", angular.toJson(list));
                            resolve(list);
                        },
                        error: function(newObj, error) {
                            // The save failed.
                            // error is a Parse.Error with an error code and message.
                            console.log(error.message);
                            reject( "could not create an object in Parse"+error.message);
                        }
                    });
                }
            }
        });
        }
    };
    
    //display a popup message for 4 seconds, accepts the title and sub title texts.
    function showPopup(titleText,subtitleTest) {
        var myPopup = $ionicPopup.show({
            title: titleText,
            subTitle: subtitleTest,
        });
        $timeout(function() {
            myPopup.close(); //close the popup after 4 seconds for some reason
        }, 4000);
    };
    return listSrv;
    })
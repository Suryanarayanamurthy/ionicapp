// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('PomodoroApp', ['ionic', 'PomodoroApp.controllers'])

app.run(function($ionicPlatform) {
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



app.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
//    controller: 'AppCtrl'
  })

  .state('app.karma', {
    url: '/karma',
    views: {
      'menuContent': {
        templateUrl: 'templates/karma.html'
      }
    }
  })

  .state('app.settings', {
      url: '/settings',
      views: {
        'menuContent': {
          templateUrl: 'templates/settings.html',
//            controller: 'clockCtrl'
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
});
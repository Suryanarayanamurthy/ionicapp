// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic'])
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
});
app.controller('wApp',function($scope, $ionicLoading, $compile, $state){
function initialize() {
    setCurrentPosition();
      }
      google.maps.event.addDomListener(window, 'load', initialize);
      
      $scope.centerOnMe = function() {
        if(!$scope.map) {
            return;
        }

        $scope.loading = $ionicLoading.show({
          content: 'Getting current location...',
          showBackdrop: false
        });
          setCurrentPosition();
          
      };
    function GetWeatherCordenates(place)
    {
        if(place === "")
            {
                setCurrentPosition();
                
            }
        
    }
    function YahooWeatherAPI(lat,long)
    {
        // Simple GET request example:
$http({
  method: 'GET',
    // get the query sting from the yahoo's yql console: query string =" select * from weather.forecast where woeid in (SELECT woeid FROM geo.placefinder WHERE text="52.4849956,13.4379836" and gflags="R") "
  url: 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(SELECT%20woeid%20FROM%20geo.placefinder%20WHERE%20text%3D%22'+lat+'%2C'+long+'%22%20and%20gflags%3D%22R%22)&format=json&diagnostics=true&callback='
}).then(function successCallback(response) {
    return response;
  }, function errorCallback(response) {
    return response;
  });
    }
      var myLatlng;
    function setCurrentPosition(){
                navigator.geolocation.getCurrentPosition(function(pos) {
          myLatlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        $scope.temp = myLatlng;
        var mapOptions = {
          center: myLatlng,
          zoom: 16,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        var map = new google.maps.Map(document.getElementById("map"),
            mapOptions);
        
        var marker = new google.maps.Marker({
          position: myLatlng,
          map: map,
          
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map,marker);
        });

        $scope.map = map;           
          $scope.loading.hide();
        }, function(error) {
          alert('Unable to get location: ' + error.message);
        });
    }
    
//    https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22nome%2C%20ak%22)&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=
    
  });

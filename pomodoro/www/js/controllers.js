angular.module('PomodoroApp.controllers', [])

//.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
//
//  // With the new view caching in Ionic, Controllers are only called
//  // when they are recreated or on app start, instead of every page change.
//  // To listen for when this page is active (for example, to refresh data),
//  // listen for the $ionicView.enter event:
//  //$scope.$on('$ionicView.enter', function(e) {
//  //});
//
//  // Form data for the login modal
//  $scope.loginData = {};
//
//  // Create the login modal that we will use later
//  $ionicModal.fromTemplateUrl('templates/login.html', {
//    scope: $scope
//  }).then(function(modal) {
//    $scope.modal = modal;
//  });
//
//  // Triggered in the login modal to close it
//  $scope.closeLogin = function() {
//    $scope.modal.hide();
//  };
//
//  // Open the login modal
//  $scope.login = function() {
//    $scope.modal.show();
//  };
//
//  // Perform the login action when the user submits the login form
//  $scope.doLogin = function() {
//    console.log('Doing login', $scope.loginData);
//
//    // Simulate a login delay. Remove this and replace with your login
//    // code if using a login system
//    $timeout(function() {
//      $scope.closeLogin();
//    }, 1000);
//  };
//})

.controller("clockCtrl", function($scope, $interval, $timeout) {
  $scope.breaktime =5;
  $scope.worktime =25;
  $scope.longBreaktime =15;
  $scope.minutes=25;
  $scope.seconds=0;
  $scope.pomoNum=1;

  var timeLeft = $scope.worktime * 60;
  var secession = "work";
  var promise;

  var wav = 'http://www.oringz.com/oringz-uploads/sounds-917-communication-channel.mp3';
  var audio = new Audio(wav);


  function ShowTime(){
    $scope.minutes = Math.floor(timeLeft / 60);
    $scope.seconds = timeLeft - ($scope.minutes * 60);
    timeLeft -= 1;
    if(secession == "work" && timeLeft <= 0)
    {
        $scope.pomoNum++;
        if($scope.pomoNum >= 4)
            {
                secession = "playHard";
                timeLeft = $scope.longBreaktime * 60;                        
            }
        else{
                secession = "play";
                timeLeft = $scope.breaktime * 60;
            }
        audio.play();
    }
    else if(secession == "play"  && timeLeft <= 0)
    {
        secession = "work";
        timeLeft = $scope.worktime * 60;
        audio.play();
    }
      else if( secession =="playHard" && timeLeft <= 0)
          {
              secession = "work";
              timeLeft = $scope.worktime * 60;
              $scope.pomoNum =1;
              audio.play();
          }
};

  $scope.play = function() {
    promise = $interval(ShowTime,1000,0);
  };
  $scope.pause = function()
  {
     $interval.cancel(promise);
  };
  $scope.reset = function()
  {
  $interval.cancel(promise);
  $scope.breaktime =5;
  $scope.worktime =25;
  $scope.minutes=25;
  $scope.seconds=00;
  timeLeft = $scope.worktime * 60;
  secession = "work";
  }
  $scope.workUpdated = function()
  {
  if(secession == "work")
  timeLeft = $scope.worktime*60;

  if($scope.worktime < 0) $scope.worktime = 0;
  }
  $scope.playUpdated = function()
  {
    if(secession == "play")
    timeLeft = $scope.breaktime *60;

    if($scope.breaktime < 0 ) $scope.breaktime =0;
  }
  $scope.playHardUpdated = function()
  {
      if(secession == "playHard")
          timeLeft =$scope.longBreaktime *60;
      
      if($scope.longBreaktime < 0 ) $scope.longBreaktime =0;
  }
});
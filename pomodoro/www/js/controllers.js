var app = angular.module('PomodoroApp.controllers', [])

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



app.controller("clockCtrl", function($scope, $interval, $timeout) {
  //initial default value of all the parameters you see on the page.
  $scope.breaktime =5;
  $scope.worktime =25;
  $scope.longBreaktime =15;
  $scope.minutes=25;
  $scope.seconds=0;
  $scope.pomoNum=1;
  var secession = "work";
  var timeLeft = $scope.worktime * 60;
  var promise;

    //source for the audio track, to notifification when the counddown reaches 0.
    // TODO: make the resourse local.
  var wav = 'http://www.oringz.com/oringz-uploads/sounds-917-communication-channel.mp3';
  var audio = new Audio(wav);

    // called using a promise todo the countdown on the screen, here all the behaviour of the app is done.
    // called this functiontion irrespective of the type of secession we are in.
  function ShowTime(){
    $scope.minutes = Math.floor(timeLeft / 60);
    $scope.seconds = timeLeft - ($scope.minutes * 60);
    timeLeft -= 1;
      //logic when a work secession is over.
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
      //logic when a break(aka play) secession is over
    else if(secession == "play"  && timeLeft <= 0)
    {
        secession = "work";
        timeLeft = $scope.worktime * 60;
        audio.play();
    }
      // logic when a longbreak(asks playHard) secession is over
      else if( secession =="playHard" && timeLeft <= 0)
          {
              secession = "work";
              timeLeft = $scope.worktime * 60;
              $scope.pomoNum =1;
              audio.play();
          }
};

    // when play button is clicked call the showTime for every once second, 
    // irrespective of the secession we are in right now,
    //because the logic for handiling behaviour during each secession is on showtime function.
  $scope.play = function() {
    promise = $interval(ShowTime,1000,0);
  };
    // cancel the promise when pause button is clicked, the play will continue from where we left of 
    //becuase the current secession and the time where we paused is in the variables "timeLeft" and "secession".
  $scope.pause = function()
  {
     $interval.cancel(promise);
  };
    // reset all the variables to default;
    // work = 25mins, break = 5 mins, long break = 15 mins and secession = work.
    // and cancel the existing promise.
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
  
//  /* updates the default time values for each secession*/
  
  $scope.workUpdated = function(worktime)
  {
      $scope.worktime = worktime;
  if(secession == "work")
      
  timeLeft = $scope.worktime*60;

  if($scope.worktime < 0) $scope.worktime = 0;
  }
  $scope.playUpdated = function(breaktime)
  {
      $scope.breaktime = breaktime;
    if(secession == "play")
    timeLeft = $scope.breaktime *60;

    if($scope.breaktime < 0 ) $scope.breaktime =0;
      console.log($scope.breaktime);
  }
  $scope.playHardUpdated = function(longBreaktime)
  {
      $scope.longBreaktime = longBreaktime;
      if(secession == "playHard")
          timeLeft =$scope.longBreaktime *60;
      
      if($scope.longBreaktime < 0 ) $scope.longBreaktime =0;
  }
});


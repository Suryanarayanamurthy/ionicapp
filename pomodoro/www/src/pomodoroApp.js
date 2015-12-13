
var app = angular.module('PomodoroApp', ['ngRoute']);
app.controller("AppController", function($scope, $interval, $timeout) {
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

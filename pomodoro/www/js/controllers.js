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

.controller('clockCtrl', function($scope, $interval, $timeout) {
  //initial default value of all the parameters you see on the page.
  $scope.breaktime =5;
  $scope.worktime =25;
  $scope.longBreaktime =15;
  $scope.minutes=25;
  $scope.seconds=0;
  $scope.pomoNum=1;
  $scope.cb_alarm = true;
  $scope.cb_ticking = true;
  $scope.cb_wNoise = false;
  var secession = "work";
  var timeLeft = $scope.worktime * 60;
  var promise;

    //source for the audio track, to notifification when the counddown reaches 0.
    // TODO: make the resourse local.
  //var wav = 'http://www.oringz.com/oringz-uploads/sounds-917-communication-channel.mp3';
    var alarmFile = 'resources/alarm.mp3';
    var tickingFile = 'resources/tick.mp3';
    //var whiteNoiseFile = 'resources/whitenoise.mp3';
    var longbreak_deltaFile = 'resources/longbreak_delta.mp3';
    var shortbreak_high_alphaFile = 'resources/shortbreak_high_alpha.mp3';
    var Work_gammaFile = 'resources/Work_gamma.mp3';
    var alarmAudio = new Audio(alarmFile);
    var tickingAudio = new Audio(tickingFile);
    var workAudio = new Audio(Work_gammaFile);
    var shortBreakAudio = new Audio(shortbreak_high_alphaFile);
    var longBreakAudio = new Audio(longbreak_deltaFile);
    
    
    

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
                $scope.toggleWhiteNoise();
            }
        else{
                secession = "play";
                timeLeft = $scope.breaktime * 60;
                $scope.toggleWhiteNoise();
            }
        if($scope.cb_alarm) alarmAudio.play();
    }
      //logic when a break(aka play) secession is over
    else if(secession == "play"  && timeLeft <= 0)
    {
        secession = "work";
        timeLeft = $scope.worktime * 60;
        if($scope.cb_alarm) alarmAudio.play();
        $scope.toggleWhiteNoise();
    }
      // logic when a longbreak(asks playHard) secession is over
      else if( secession =="playHard" && timeLeft <= 0)
          {
              secession = "work";
              timeLeft = $scope.worktime * 60;
              $scope.pomoNum =1;
                if($scope.cb_alarm) alarmAudio.play();
              $scope.toggleWhiteNoise();
          }
      if($scope.cb_ticking)
    tickingAudio.play();  
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
  $scope.longBreaktime =15;
  timeLeft = $scope.worktime * 60;
  secession = "work";
  }
  
  $scope.toggleWhiteNoise = function(){
    if($scope.cb_wNoise){
    switch(secession) {
    case "work":{
    workAudio.play();
    workAudio.loop;
    longBreakAudio.pause();
    shortBreakAudio.pause();
    break;
    }
    case "play":{
    shortBreakAudio.play();
    shortBreakAudio.loop;
    workAudio.pause();
    longBreakAudio.pause();
    break;
    }
    case "playHard":{
    longBreakAudio.play();
    longBreakAudio.loop;
    workAudio.pause();
    shortBreakAudio.pause();
    break;
    }
    }
    }
    // pause all background noise
    else{
        workAudio.pause();
        shortBreakAudio.pause();
        longBreakAudio.pause();
    }
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
})

.controller('karmaCtrl', ['ListFactory', '$scope', '$ionicModal',
    function(ListFactory, $scope, $ionicModal) {

        $ionicModal.fromTemplateUrl('templates/add-change-dialog.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then( function(modal) {
        $scope.addDialog = modal;
      });


      $scope.showAddChangeDialog = function(action) {
        $scope.action = action;
        $scope.addDialog.show();
      };

      $scope.leaveAddChangeDialog = function() {
        // Remove dialog 
        $scope.addDialog.remove();
          // hide is behaving, in a weard way, using brute force way of deling with it.
        // Reload modal template to have cleared form
        $ionicModal.fromTemplateUrl('templates/add-change-dialog.html', function(modal) {
          $scope.addDialog = modal;
        }, {
          scope: $scope,
          animation: 'slide-in-up'
        });
      };

      // Get list from storage
      $scope.list = ListFactory.getList();

      // Used to cache the empty form for Edit Dialog
      $scope.saveEmpty = function(form) {
        $scope.form = angular.copy(form);
      }

      $scope.addItem = function(form) {
        var newItem = {};
        // Add values from form to object
        newItem.name = form.name.$modelValue;
        newItem.description = form.description.$modelValue;
        newItem.useAsDefault = form.useAsDefault.$modelValue;
        // If this is the first item it will be the default item
        if ($scope.list.length == 0) {
          newItem.useAsDefault = true;
        } else {
          // Remove old default entry from list	
          if (newItem.useAsDefault) {
            removeDefault();
          }
        }
          // add pomodoros default values
          newItem.pomoNum = 0;
          newItem.pomoCycles =0;
          newItem.Isdone = false;
          
        // Save new list in scope and factory
        $scope.list.push(newItem);
        ListFactory.setList($scope.list);
        // Close dialog
        $scope.leaveAddChangeDialog();
      };

      $scope.removeItem = function(item) {
        // Search & Destroy item from list
        $scope.list.splice($scope.list.indexOf(item), 1);
        // If this item was the Default we set first item in list to default
        if (item.useAsDefault == true && $scope.list.length != 0) {
          $scope.list[0].useAsDefault = true;
        }
        // Save list in factory
        ListFactory.setList($scope.list);
      }

      $scope.makeDefault = function(item) {
        removeDefault();
        var newDefaultIndex = $scope.list.indexOf(item);
        $scope.list[newDefaultIndex].useAsDefault = true;
        ListFactory.setList($scope.list);
      }

      function removeDefault() {
        //Remove existing default
        for (var i = 0; i < $scope.list.length; i++) {
          if ($scope.list[i].useAsDefault == true) {
            $scope.list[i].useAsDefault = false;
          }
        }
      }

      $scope.showEditItem = function(item) {

        // Remember edit item to change it later
        $scope.tmpEditItem = item;
        
          
        // Preset form values
        $scope.form.name.$setViewValue(item.name);  
        $scope.form.description.$setViewValue(item.description);
        $scope.form.useAsDefault.$setViewValue(item.useAsDefault);
        // Open dialog
        $scope.showAddChangeDialog('change');
      };

      $scope.editItem = function(form) {

        var item = {};
        item.name = form.name.$modelValue;
        item.description = form.description.$modelValue;
        item.useAsDefault = form.useAsDefault.$modelValue;

        var editIndex = ListFactory.getList().indexOf($scope.tmpEditItem);
        $scope.list[editIndex] = item;
        // Set first item to default
        if ($scope.tmpEditItem.useAsDefault == true && item.useAsDefault == false) {
          $scope.list[0].useAsDefault = true;
        }

        ListFactory.setList($scope.list);
        if (item.useAsDefault) {
          $scope.makeDefault(item);
        }

        $scope.leaveAddChangeDialog();
      }
    }
  ]);
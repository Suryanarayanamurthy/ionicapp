angular.module('PomodoroApp.controllers', [])

.controller('AppCtrl', [ '$scope', '$ionicModal', '$timeout', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
}])

.controller('clockCtrl', ['ListFactory','$scope', '$interval', '$timeout' ,function(ListFactory, $scope, $interval, $timeout) {
  
    
    //source for the audio track, to notifification when the counddown reaches 0.
    //var wav = 'http://www.oringz.com/oringz-uploads/sounds-917-communication-channel.mp3';
    var alarmFile = 'resources/alarm.mp3';
    var tickingFile = 'resources/tick.mp3';
    var longbreak_deltaFile = 'resources/longbreak_delta.mp3';
    var shortbreak_high_alphaFile = 'resources/shortbreak_high_alpha.mp3';
    var Work_gammaFile = 'resources/Work_gamma.mp3';
    var alarmAudio = new Audio(alarmFile);
    var tickingAudio = new Audio(tickingFile);
    var workAudio = new Audio(Work_gammaFile);
    var shortBreakAudio = new Audio(shortbreak_high_alphaFile);
    var longBreakAudio = new Audio(longbreak_deltaFile);
    var timeLeft;
    var pomoNumber = 0;
    var playTimer = false;
    var promise;
    // using init() as the constructor
  
    $scope.init = function (){
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
    $scope.secession = "work";
    $scope.currentAudio = "";
    // timeLeft should me defined after the worktime is assigned.
    timeLeft  = $scope.worktime * 60;
        // Get list from the service
        var promise = ListFactory.getListAsync();
            promise.then(function(listFromService){
                $scope.list = listFromService;
                // see if the list is empty, if yes create a default item and select it.
    if( $scope.list.length == 0 )
    {
    $scope.selectedItem = createDefaultTaskItem();
    }
    //else select the 1st task item as selected item, 
    else
    {
    $scope.selectedItem = $scope.list[0];
    }
          
            },function(errorMsg){
                $scope.list = [];
             console.log("could not do async get from controller");
            });
        
    
    };
    
    //To listen for when this page is active (for example, to refresh data),
    // listen for the $ionicView.enter event:
    $scope.$on('$ionicView.enter', function(e) {
// // Get list from the service
//        var promise = ListFactory.getListAsync();
//            promise.then(function(listFromService){
//                $scope.list = listFromService;
//               
//                // see if the list is empty, if yes create a default item and select it.
//    if( $scope.list.length == 0 )
//    {
//    $scope.selectedItem = createDefaultTaskItem();
//    }
//       
//            },function(errorMsg){
//                $scope.list = [];
//             console.log("could not do async get from controller");
//            });
          
    });

    
    function createDefaultTaskItem()
    {
        var newItem = {};
        // Add default valuse
        newItem.name = "Other";
        newItem.description = "other misc tasks";
        
        // add pomodoros default values
        newItem.pomoNum = 0;
        newItem.pomoCycles =0;
        
          
        // Save new list in scope and factory
        $scope.list.push(newItem);
        ListFactory.setList($scope.list);
        return newItem;
    };
    
    // called using a promise todo the countdown on the screen, here all the behaviour of the app is done.
    // called this functiontion irrespective of the type of secession we are in.
    function ShowTime(){
    displaySecToMnS(timeLeft);
    timeLeft -= 1;
      //logic when a work secession is over.
    if($scope.secession == "work" && timeLeft <= 0)
    {
        $scope.pomoNum++;
        // increment the pomo number for the selected task
        updateSelectedItemPomoNum();
        //if($scope.pomoNum >= 4)
        if($scope.pomoNum > 4)
            {
                $scope.secession = "playHard";
                timeLeft = $scope.longBreaktime * 60;
                // change the white noise to break time
                $scope.toggleWhiteNoise();
                // increment the pomo cycles for the selected task
                updateSelectedItemPomoCycle();
            }
        else{
                $scope.secession = "play";
                timeLeft = $scope.breaktime * 60;
                // change the white noise for long break
                $scope.toggleWhiteNoise();
            }
        if($scope.cb_alarm) alarmAudio.play();
    }
      //logic when a break(aka play) secession is over
    else if($scope.secession == "play"  && timeLeft <= 0)
    {
        $scope.secession = "work";
        timeLeft = $scope.worktime * 60;
        if($scope.cb_alarm) alarmAudio.play();
        $scope.toggleWhiteNoise();
    }
      // logic when a longbreak(asks playHard) secession is over
      else if( $scope.secession =="playHard" && timeLeft <= 0)
    {
          $scope.secession = "work";
          timeLeft = $scope.worktime * 60;
          $scope.pomoNum =1;
          if($scope.cb_alarm) alarmAudio.play();
          $scope.toggleWhiteNoise();
    }
      if($scope.cb_ticking)
    tickingAudio.play();
        fillHeightNdColor();
};
    
    function updateSelectedItemPomoNum(){
        //scenario wen the selected item is deleted from the karma page.
        if(ListFactory.getList().indexOf($scope.selectedItem) ==-1)
        {
            //set it to the "other" task item
             $scope.selectedItem =  $scope.list[0];
            }
         $scope.selectedItem.pomoNum++;
        // save it to the updated value to the list.
        saveTaskList($scope.selectedItem);
    };
    
    function updateSelectedItemPomoCycle(){
          //scenario wen the selected item is deleted from the karma page.
        if(ListFactory.getList().indexOf($scope.selectedItem) ==-1)
        {
            //set it to the other taask item.
            $scope.selectedItem =  $scope.list[0];
        }
        $scope.selectedItem.pomoCycles++;
        //save the selected task with the updated info.
        saveTaskList($scope.selectedItem);
    };
    

    function fillHeightNdColor()
    {
    var denom;
    switch($scope.secession)
        {
    case "work":{
        denom = 60 * $scope.worktime;
    break;
    }
    case "play":{
        denom = 60 * $scope.breaktime;
    break;
    }
    case "playHard":{
        denom = 60 * $scope.longBreaktime;
    break;
    }
        }
    var perc = Math.abs((timeLeft / denom) * 100 - 100);
    $scope.fillHeight = perc + '%';
    };
    
    
    // display the remaining secs to mins and seconds
    function displaySecToMnS(timeLeft){
    $scope.minutes = Math.floor(timeLeft / 60);
    $scope.seconds = timeLeft - ($scope.minutes * 60);
    };
    
    // when play button is clicked call the showTime for every once second, 
    // irrespective of the secession we are in right now,
    //because the logic for handiling behaviour during each secession is on showtime function.
    $scope.play = function() {
    promise = $interval(ShowTime,1000,0);
  };
    // cancel the promise when pause button is clicked, the play will continue from where we left of 
    //becuase the current secession and the time where we paused is in the variables "timeLeft" and "secession".
    $scope.pause = function(){
     $interval.cancel(promise);
  };
    
    // using toggle player on the clock section insted of having 2 buttons for play and pause
    // using previously implimented functions.
    $scope.toggleTimer = function(){
        if(!playTimer)
        {
            $scope.play();
            playTimer = true;
        }
        else{
            $scope.pause();
            playTimer = false;
        }
    };
    
    // reset all the variables to default;
    // work = 25mins, break = 5 mins, long break = 15 mins and secession = work.
    // and cancel the existing promise.
    $scope.reset = function(){
        
  
  $scope.breaktime =5;
  $scope.worktime =25;
  $scope.minutes=25;
  $scope.seconds=00;
  $scope.longBreaktime =15;
  timeLeft = $scope.worktime * 60;
  $scope.secession = "work";
  $scope.currentAudio ="";
      $interval.cancel(promise);
  };
  
    $scope.toggleWhiteNoise = function(cb_wNoise){
        // this if is required bcos togglewhitenoise is also called locally and the cb_wNoise is set to undefined.
        if(cb_wNoise != undefined)
            $scope.cb_wNoise = cb_wNoise;
    if($scope.cb_wNoise){
    switch($scope.secession) {
    case "work":{
    workAudio.play();
    workAudio.loop;
    longBreakAudio.pause();
    shortBreakAudio.pause();
    $scope.currentAudio = "Gamma";
    break;
    }
    case "play":{
    shortBreakAudio.play();
    shortBreakAudio.loop;
    workAudio.pause();
    longBreakAudio.pause();
    $scope.currentAudio = "Alpha";
    break;
    }
    case "playHard":{
    longBreakAudio.play();
    longBreakAudio.loop;
    workAudio.pause();
    shortBreakAudio.pause();
    $scope.currentAudio = "Delta";
    break;
    }
    }
    }
    // pause all background noise
    else{
        workAudio.pause();
        shortBreakAudio.pause();
        longBreakAudio.pause();
        $scope.currentAudio = "";
    }
    };
  
    $scope.toggleAlarm = function (cb_alarm){
      $scope.cb_alarm = cb_alarm;
  };
    
    $scope.toggleticking = function (cb_ticking){
        $scope.cb_ticking = cb_ticking;
    };
  
  
//  /* updates the default time values for each secession*/
  
  $scope.workUpdated = function(worktime)
  {
      $scope.worktime = worktime;
  if($scope.secession == "work")
      
  timeLeft = $scope.worktime*60;
      displaySecToMnS(timeLeft);

//  if($scope.worktime < 0) $scope.worktime = 0;
  };
  $scope.playUpdated = function(breaktime)
  {
      $scope.breaktime = breaktime;
    if($scope.secession == "play")
    timeLeft = $scope.breaktime *60;
displaySecToMnS(timeLeft);
//    if($scope.breaktime < 0 ) $scope.breaktime =0;
  };
  $scope.playHardUpdated = function(longBreaktime)
  {
      $scope.longBreaktime = longBreaktime;
      if($scope.secession == "playHard")
          timeLeft =$scope.longBreaktime *60;
      displaySecToMnS(timeLeft);
//      if($scope.longBreaktime < 0 ) $scope.longBreaktime =0;
  };
  
  //update the selected item
  $scope.selectedItemChanged = function(selectedItem){
      $scope.selectedItem = selectedItem;
  };
  
 
  
  function saveTaskList(item)
    {
         if(item !== undefined)
        {
            var editIndex = ListFactory.getList().indexOf(item);
            $scope.list[editIndex] = item;
        }
        ListFactory.setList($scope.list);
        
    };
  
}])

.controller('karmaCtrl', ['ListFactory', '$scope', '$ionicModal','$timeout',
    function(ListFactory, $scope, $ionicModal, $timeout) {
        
      // Get list from the service
        var promise = ListFactory.getListAsync();
            promise.then(function(listOnServerDB){
                $scope.list = listOnServerDB;
          
            },function(errorMsg){
                $scope.list = [];
             console.log("could not do async get from controller");
            });
        
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


      // Used to cache the empty form for Edit Dialog
      $scope.saveEmpty = function(form) {
        $scope.form = angular.copy(form);
      }

      $scope.addItem = function(form) {
        var newItem = {};
        // Add values from form to object
        newItem.name = form.name.$modelValue;
        newItem.description = form.description.$modelValue;
        
        
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
       
        // Save list in factory
        ListFactory.setList($scope.list);
      }

      $scope.showEditItem = function(item) {
        // Remember edit item to change it later
        $scope.tmpEditItem = item;
                  
        // Preset form values
        $scope.form.name.$setViewValue(item.name);  
        $scope.form.description.$setViewValue(item.description);
        // Open dialog
        $scope.showAddChangeDialog('change');
      };

      $scope.editItem = function(form) {
        var item = {};
        item.name = form.name.$modelValue;
        item.description = form.description.$modelValue;
        var editIndex = ListFactory.getList().indexOf($scope.tmpEditItem);
        $scope.list[editIndex] = item;
        ListFactory.setList($scope.list);
        $scope.leaveAddChangeDialog();
      };
        
        $scope.doRefresh = function(){
            //refresh the task list saved locally, and set it to the list.
            $scope.list = ListFactory.getList();
             $timeout( function() {
                 ListFactory.setInParse();
        
                 //Stop the ion-refresher from spinning
      $scope.$broadcast('scroll.refreshComplete');
                  }, 1000);
            
        };
        
        
    }
  ]);
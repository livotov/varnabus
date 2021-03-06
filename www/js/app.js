// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('VarnaBus', ['ionic', 'ui.router', 'ngCordova', 'LocalStorageModule', 'ngMap', 'ngTouch']);

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

app.config(function(localStorageServiceProvider){
  localStorageServiceProvider.setPrefix('VarnaBus2');
});

app.config(function($ionicConfigProvider){
  $ionicConfigProvider.backButton.text('').icon('ion-arrow-left-c').previousTitleText(false);
});

app.run(function($rootScope, StopService){
  document.addEventListener("pause", function(){
      $rootScope.inBackground = true;
  }, false);
  document.addEventListener("resume", function(){
      $rootScope.inBackground = false;
  }, false);

  StopService.get().warnings().success(function(data){
    var warnings = [];
    for(var i in data){
      warnings[i] = data[i].level;
      StopService.pushWarnings(warnings);
    }
  });

});

app.run(function(localStorageService, $http){
  var stops = localStorageService.get('stops') || false;
  if(!stops){
    $http.get("http://varnatraffic.com/Ajax/GetStations").success(function(data){
      localStorageService.set('stops', data);
    });
  }
});

app.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
    .state('home', {
      url: '/home',
      controller: 'HomeCtrl',
      templateUrl: 'templates/home.html'
    })
    .state('stops', {
      url: '/stops',
      controller: 'StopsCtrl',
      templateUrl: 'templates/stops.html'
    })
    .state('stop', {
      url: '/stop/:stopId?stopName',
      controller: 'StopCtrl',
      templateUrl: 'templates/stop.html'
    })
    .state('stop.livedata', {
      url: '/',
      views: {
        "stopContent": { templateUrl: "templates/stop-livedata.html" }
      }
    })
    .state('stop.timetable', {
      url: '/timetable',
      views: {
        "stopContent": { templateUrl: "templates/stop-timetable.html" }
      }
    })
    .state('device', {
      url: '/device/:deviceId',
      controller: 'DeviceCtrl',
      templateUrl: 'templates/device.html'
    })
    .state('settings', {
      url: '/settings',
      controller: 'SettingsCtrl',
      templateUrl: 'templates/settings.html'
    })
    .state('map', {
      url: '/map',
      controller: 'MapCtrl',
      templateUrl: 'templates/map.html'
    })
    .state('scanner', {
      url: '/scanner',
      controller: 'ScannerCtrl',
      templateUrl: 'templates/scanner.html'
    })
    .state('stoptimetable', {
      url: '/stoptimetable/:stopId?stopName',
      controller: 'StopTimetableCtrl',
      templateUrl: 'templates/stop-timetable.html'
    });


  $urlRouterProvider.otherwise("/home");
});

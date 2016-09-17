// angular.module is a global place for creating, registering and retrieving Angular modules
// 'SLBizReviews' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'dependencies'

var SLBizReviews = angular.module('SLBizReviews', ['ionic','ngCordova','ngCordovaOauth','ngStorage','SLBizReviews.config']);

SLBizReviews.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    //navigator.splashscreen.hide();

    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
  $ionicPlatform.registerBackButtonAction(function() {
    if ($ionicHistory.currentStateName() == 'login') {
        navigator.app.exitApp();
    }
    if($ionicHistory.currentStateName() == 'app.home'){
        navigator.app.exitApp();
    }
    else {
      $ionicHistory.goBack();
    }
  }, 100);
});

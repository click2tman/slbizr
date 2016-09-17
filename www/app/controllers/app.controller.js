
SLBizReviews.controller('MainCtrl', function($scope,$localStorage,$rootScope,$state) {
  $rootScope.currentUser = '';
  $rootScope.profile = '';
  $localStorage.isLogedin = 'false';
  $rootScope.isLogedin = 'false';
});

SLBizReviews.controller('SplashCtrl',function($rootScope,$scope,$state,$window,$ionicSlideBoxDelegate){
  $scope.signinClick = function () {
    $state.go('login');
  }
  $scope.signupClick = function () {
    $state.go('signup');
  }
  $scope.nextSlide = function () {
    $ionicSlideBoxDelegate.next();
  }
});

SLBizReviews.controller('menuCtrl',function($rootScope,$scope,$state,$window,$ionicSlideBoxDelegate){
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    viewData.enableBack = true;
  });
});

SLBizReviews.controller('DashCtrl', function($scope,$state,$ionicHistory,$rootScope,$localStorage,ProfileService) {
  //$scope.currentUser = profile;
  $scope.$on("$ionicView.enter", function(event, data){
      $rootScope.$broadcast('loading:show', {loading_settings: {template: "<p><ion-spinner></ion-spinner><br/>Loading...</p>"}});
      $ionicHistory.clearHistory(); //hide the back button.
      ProfileService.getProfile()
        .then(function (profile) {
          $rootScope.currentUser = profile;
          console.log($rootScope.currentUser);
      }) .finally(function () { $rootScope.$broadcast('loading:hide');});
  });

});

SLBizReviews.controller('otherCtrl', function($scope,$state,$ionicHistory,$rootScope,$localStorage,ProfileService) {

  $scope.$on("$ionicView.enter", function(event, data){
      $rootScope.$broadcast('loading:show', {loading_settings: {template: "<p><ion-spinner></ion-spinner><br/>Loading...</p>"}});
      $ionicHistory.clearHistory(); //hide the back button.
      ProfileService.getProfile()
        .then(function (profile) {
          $rootScope.currentUser = profile;
          console.log($rootScope.currentUser);
      }) .finally(function () { $rootScope.$broadcast('loading:hide');});
  });
});

SLBizReviews.controller('AccountCtrl', function($scope,$state,$rootScope,$localStorage,ProfileService) {
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    viewData.enableBack = true;
  });

  $scope.showProfile = function () {
    $state.go('app.viewProfile');
  }
});

SLBizReviews.controller('subProfileCtrl', function($scope,$state,$rootScope,$localStorage,ProfileService) {
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    viewData.enableBack = true;
  });
});



SLBizReviews.controller('ProfileCtrl', function($scope,$rootScope,ProfileService,$ionicHistory,$localStorage,$state,AuthenticationServiceConstant, AuthenticationService) {
  $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
    viewData.enableBack = true;
  });
  $scope.profileUpdate = {};

  $rootScope.$on('profile:changed', function(e,data) {
    ProfileService.getProfile().then(function (profile) {
         $rootScope.profile = profile;
    });
  });

  $scope.$on("$ionicView.enter", function(event, data){
     ProfileService.getProfile().then(function (profile) {
          $rootScope.profile = profile;
          $scope.profileUpdate = {"uid": profile.uid,
                                  "field_user_nick_name":{"und":[{"value": profile.field_user_nick_name.und[0].value}]},
                                  "field_mobile_user_telephone":{"und":[{"value": profile.field_mobile_user_telephone.und[0].value}]},
                                  //"field_user_about_me":{"und":[{"value": profile.field_user_about_me.und[0].value}]}
                                };
      }) .finally(function () { });
  });

  $scope.editProfile = function () {
    $state.go('app.updateProfile');
  }

  $scope.saveProfile = function (editProfileForm) {
    $rootScope.$broadcast('loading:show', {loading_settings: {template: "<p><ion-spinner></ion-spinner><br/>Loading...</p>"}});
    ProfileService.updateProfile($scope.profileUpdate).then(function (profile) {
          $rootScope.$broadcast('profile:changed');
          //console.log(profile);
    }).finally(function (findata) {
       $rootScope.$broadcast('loading:hide');
    });
    $state.go('app.viewProfile');
  }

  $scope.doLogout = function () {
    $rootScope.$broadcast('loading:show', {loading_settings: {template: "<p><ion-spinner></ion-spinner><br/>Loading...</p>"}});
    AuthenticationService.logout().then(function (data) {
      //$localStorage.isLogedin = false;
      $state.go('splash', {}, {reload: true});
      $ionicHistory.clearHistory();
    }).finally(function () {$rootScope.$broadcast('loading:hide');});
  }
});

// SLBizReviews.controller('SignupCtrl',function($rootScope,$scope,$state,$window,UserResource, AuthenticationService, $localStorage){
//
// });

SLBizReviews.controller('ForgetPassCtrl',function($rootScope,$scope,$state,$window,$ionicSlideBoxDelegate){
  $rootScope.doSignup = function () {
    console.log($state.is);
  }
});

SLBizReviews.controller('LoginCtrl',function($scope,$rootScope,$ionicPopup,$state,$ionicLoading,$localStorage,AuthenticationService){
  //data for vm.loginForm
  $scope.user = {};
  $scope.serverErrors = [];
  $scope.doLogin = function(loginForm) {
    $scope.serverErrors = [];
    console.log(loginForm);
    if (loginForm.$valid) {
      $rootScope.$broadcast('loading:show', {loading_settings: {template: "<p><ion-spinner></ion-spinner><br/>Connecting...</p>"}});
      AuthenticationService.login($scope.user).then(function (data) {
          console.log(data);
          $rootScope.currentUser = data.user;
          $localStorage.isLogedin = true;
          $rootScope.$broadcast('loading:hide');
          $state.go('location');
        },
        //error
        function (errorResult) {
          if (errorResult.status >= 400 && errorResult.status < 500) {
              $scope.serverErrors.push(errorResult.data[0]);
          }
          if(errorResult.status == -1){
              $scope.serverErrors.push("The 'Access-Control-Allow-Origin' header has a value that is not equal to the supplied origin.");
          }
          else {
            $scope.serverErrors.push(errorResult.statusText);
          }

        }).finally(function() {$rootScope.$broadcast('loading:hide'); });
    } else {
        $scope.serverErrors.push('Username and Password is required');
    }
  }
  $scope.iAgree = function () {
    var confirmPopup = $ionicPopup.confirm({
         template: 'Allow SLBizReviews to access your location while you use the app?',
         cancelText:"Don't Allow",
         okText: 'Allow',
         cancelType:'button button-clear button-positive',
         okType:'button button-clear button-positive'
      });

      confirmPopup.then(function(res) {
        if(res) {
            $state.go('app.nearBy', {}, {reload: true});
         } else {
            console.log('Not sure!');
         }
      });
  }
});
SLBizReviews.controller('SocialCtrl',function($rootScope,$cordovaOauth,$scope,$state,$window,$ionicSlideBoxDelegate){
  $scope.data = [];
  $scope.facebookLogin = function() {
    $cordovaOauth.facebook("1630550960608590", ["email"]).then(function(result) {
            // results
            console.log(result);
            alert(JSON.stringify(result));
        }, function(error) {
          alert(JSON.stringify(error));
            // error
    });
  }
  $scope.twitterLogin = function() {

    $cordovaOauth.twitter('jBKY4qR6Zgr5G9vbPmqqFo7tU','zk9joXsDthf8HJKzygy3ZIgeuNEythqceJm7VkvGbaRQaI6und').then(function(result) {
      console.log(result);
        alert(result);
    }, function(error) {
      console.log(error);
    });
  }
  $scope.googleLogin = function() {
    $cordovaOauth.google('763923498182-4rt0vruclqkc0itb6k4tvl0h3ec2bt95.apps.googleusercontent.com',$scope.data).then(function(result) {
      console.log(result);
        alert(result);
    }, function(error) {
      console.log(error);
    });
  }

});

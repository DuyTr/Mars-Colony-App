function runBlock($rootScope, $state) {

    $rootScope.$state = $state;


    $rootScope.$on('$stateChangeStart', function (event, toState) {
        $rootScope.stateName = toState.name;
    });

};


(function(){
   angular.module('marApp',['ui.router','ngAnimate','ngTouch','ngCookies'])

   .run(runBlock)


   .config(['$stateProvider',
            '$urlRouterProvider',
            '$locationProvider',
          function($stateProvider,$urlRouterProvider,$locationProvider){
      $locationProvider.html5Mode({
        enabled: false,
        requireBase: false,
        rewriteLinks: false
      });

      $stateProvider
        .state('welcome',{
          url: '',
          templateUrl:'state1.html',
          controller: ['$cookies','$scope','$state',function($cookies,$scope,$state){
            $cookies.putObject('mars_user',undefined);
            $scope.next = function(){
              $state.go('register');
            }
          }]
        })

      $stateProvider
        .state('register',{
          url: '/register',
          templateUrl:'state2.html',
          controller: 'RegisterFormCtrl',
          resolve: {
            user: ['$cookies',function($cookies){
              if($cookies.getObject('mars_user')){
                $state.go('encounter');
              }
            }]
          }
        })

      $stateProvider
        .state('encounter',{
          url: '/encounter',
          templateUrl:'state3.html',
          controller: 'EncounterCtrl'
        })

      $stateProvider
        .state('report',{
          url: '/report',
          templateUrl:'state4.html',
          controller:'ReportFormCtrl'
        })
   }])

   .controller('RegisterFormCtrl',['$scope','$state','$http','$cookies',function($scope,$state,$http, $cookies){
     var API_URL_GET_JOBS = "https://red-wdp-api.herokuapp.com/api/mars/jobs";
     var API_URL_CREATE_COLONIST = "https://red-wdp-api.herokuapp.com/api/mars/colonists";
     $scope.registerCheck = false;
     $scope.colonist={};
     $http.get(API_URL_GET_JOBS)
      .then(function(response){
          $scope.jobs = response.data.jobs;
      });
     $scope.next = function(){
       $state.go('encounter');
     }
     $scope.prev = function(){
       $state.go('welcome');
     }

     $scope.invalidName = false;
     $scope.invalidAge = false;
     $scope.invalidOcc= false;
     $scope.change = function(){
       if ($scope.registerCheck){
         $scope.invalidName = true;
         $scope.invalidAge = true;
         $scope.invalidOcc = true;
         if ($scope.registerForm.name.$valid){
           $scope.invalidName = false;
         }
         if ($scope.registerForm.age.$valid){
           $scope.invalidAge = false;
         }
         if ($scope.registerForm.occupation.$valid){
           $scope.invalidOcc = false;
         }
       }
     }
     $scope.submitRegistration = function(e){
       e.preventDefault();
       $scope.registerCheck = true;
       $scope.invalidName = true;
       $scope.invalidAge = true;
       $scope.invalidOcc = true;
       if ($scope.registerForm.name.$valid){
         $scope.invalidName = false;
       }
       if ($scope.registerForm.age.$valid){
         $scope.invalidAge = false;
       }
       if ($scope.registerForm.occupation.$valid){
         $scope.invalidOcc = false;
       }
       if ($scope.registerForm.name.$valid && $scope.registerForm.age.$valid && $scope.registerForm.occupation.$valid){
        $http({
          method: 'POST',
          url: API_URL_CREATE_COLONIST,
          data: {colonist: $scope.colonist}
        }).then(function(response){
         $cookies.putObject('mars_user',response.data.colonist);
         $state.go('encounter');
        //  debugger;
       })
     };
     }
   }])

   .controller('EncounterCtrl',['$scope','$http','$state',function($scope,$http,$state){
     var ENCOUNTER_API_URL = "https://red-wdp-api.herokuapp.com/api/mars/encounters";
     $http.get(ENCOUNTER_API_URL)
      .then(function(response){
          $scope.encounters = response.data.encounters;
      });
     $scope.next = function(){
        $state.go('report');
      }
     $scope.prev = function(){
        $state.go('register');
      }
   }])
// STATE 4 FORM
   .controller('ReportFormCtrl',['$scope','$state','$http','$cookies',function($scope,$state,$http,$cookies){
     var ALIEN_TYPE_API_URL = "https://red-wdp-api.herokuapp.com/api/mars/aliens";
     var ENCOUNTER_API_URL1 = "https://red-wdp-api.herokuapp.com/api/mars/encounters";
     $scope.reportCheck = false;
     $http.get(ALIEN_TYPE_API_URL)
      .then(function(response){
          $scope.aliens = response.data.aliens;
      });
     var date = new Date();
     $scope.prev = function(){
         $state.go('encounter');
      }

     $scope.encounter={date:date.getFullYear()+"-"+(date.getMonth()+1)+"-"+date.getDate(), colonist_id: $cookies.getObject('mars_user').id};
     $scope.invalidType = false;
     $scope.invalidAct = false;

     $scope.change = function(){
       if ($scope.reportCheck){
         $scope.invalidType = true;
         $scope.invalidAct = true;
         if ($scope.reportForm.type.$valid){
           $scope.invalidType = false;
         }
         if ($scope.reportForm.act.$valid){
           $scope.invalidAct = false;
         }
       }
     }

     $scope.submitReport = function(e){
       e.preventDefault();
       $scope.reportCheck = true;
       $scope.invalidType = true;
       $scope.invalidAct = true;
       if ($scope.reportForm.type.$valid){
         $scope.invalidType = false;
       }
       if ($scope.reportForm.act.$valid){
         $scope.invalidAct = false;
       }
       if ($scope.reportForm.type.$valid && $scope.reportForm.act.$valid){
        $http({
          method: 'POST',
          url: ENCOUNTER_API_URL1,
          data: {encounter: $scope.encounter}
        }).then(function(response){
         $state.go('encounter');
       })
     };
     }
   }]);
})();

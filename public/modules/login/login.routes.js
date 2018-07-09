(function () {

  'use strict';

  angular.module('login').config(function ($stateProvider) {
    $stateProvider.state('login', {
      url: '/login',
      resolve: {
        MockData: function (MockDataFactory) {
          return MockDataFactory.query({ filename: 'data' });
        }
      },
      data: {
        pageTitle: 'Login',
        access: 'private',
        bodyClass: 'signin'
      },
      views: {
        'content': {
          controller: 'LoginController as loginCtrl',
          templateUrl: 'modules/login/templates/login.html'
        }
      }
    });

    $stateProvider.state('signUp', {
      url: '/signUp',
      resolve: {
        MockData: function (MockDataFactory) {
          return MockDataFactory.query({ filename: 'data' });
        }
      },
      data: {
        pageTitle: 'Signup',
        access: 'private',
        bodyClass: 'signin'
      },
      views: {
        'content': {
          controller: 'LoginController as loginCtrl',
          templateUrl: 'modules/login/templates/signUp.html'
        }
      }
    });

    $stateProvider.state('verifyEmail', {
      url: '/verifyEmail',
      data: {
        pageTitle: 'Verify Email',
        access: 'private',
        bodyClass: 'signin'
      },
      views: {
        'content': {
          controller: 'LoginController as loginCtrl',
          templateUrl: 'modules/login/templates/verify.html'
        }
      }
    });
  });

})();

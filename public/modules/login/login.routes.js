(function () {

  'use strict';

  angular.module('login').config(function ($stateProvider) {
    $stateProvider.state('login', {
      url: '/login',
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

    $stateProvider.state('showDashboard', {
      url: '/showDashboard',
      resolve: {
        categories: function (blogsService) {
          return blogsService.getCategories();
        },
        blogs: function (blogsService, loginService) {
          var loggedInUser = loginService.getCurrentUser();
          if (loginService.getCurrentUser() === undefined) {
            return undefined;
          }
          return blogsService.getBlogsByUser(loggedInUser);
        }
      },
      data: {
        pageTitle: 'Dashboard',
        access: 'private',
        bodyClass: 'home'
      },
      views: {
        'header': {
          controller: 'HeaderController as header',
          templateUrl: 'modules/main/templates/header.html'
        },
        'content': {
          controller: 'DashBoardController as dashCtrl',
          templateUrl: 'modules/login/templates/dashboard.html'
        },
        'footer': {
          controller: 'FooterController as footer',
          templateUrl: 'modules/main/templates/footer.html'
        }
      }
    });

    $stateProvider.state('signUp', {
      url: '/signUp',
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
  });

})();

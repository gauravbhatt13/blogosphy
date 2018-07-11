(function () {

  'use strict';

  angular.module('app').controller('HeaderController', function ($scope, $log, $state, $uibModal, categories, loginService) {
    console.log('header controller called : ' + $state.current.name);

    var _this = this;
    _this.login = function () {
      $state.go('login');
    };
    _this.signUp = function () {
      $state.go('signUp');
    };
    _this.isUserAdmin = false;
    _this.isUserVerified = loginService.getCurrentUser() !== undefined;
    _this.blogsCategoryData = categories;
    _this.showDashboard = function () {
      $state.go('showDashboard');
    };
    _this.modals = {
      logOutConfirm: function () {
        $uibModal.open({
          templateUrl: '/modules/main/modals/logOutConfirmModal.html',
          controller: 'LogOutConfirmModalController',
          controllerAs: '$ctrl'
        });
      }
    };
    _this.createBlog = function () {
      $state.go('createBlog');
    };

    _this.manageBlogCategory = function () {
      $state.go('manageBlogCategory');
    };

    if (_this.isUserVerified) {
      _this.email = loginService.getCurrentUser().email;
      _this.isUserAdmin = loginService.getCurrentUser().admin;
    }

    _this.logOut = function ($uibModal) {
      loginService.logOut();
      _this.modals.logOutConfirm();
    };
  });

  angular.module('app').controller('LogOutConfirmModalController', function ($state, $uibModalInstance, loginService) {
    var _this = this;

    _this.signOut = function () {
      $uibModalInstance.close();
      $state.go('login');
    };
    _this.close = function () {
      $uibModalInstance.close();
    };
    _this.modalOK = function () {
      // handle the ok button click
      loginService.currentUser = null;
      $uibModalInstance.close();
    };
  });
})();

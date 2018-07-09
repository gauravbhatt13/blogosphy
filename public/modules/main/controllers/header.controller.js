(function () {

  'use strict';

  angular.module('app').controller('HeaderController', function ($log, $state, $uibModal, blogsCategoryData) {
    var _this = this;
    _this.blogsCategoryData = blogsCategoryData;
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

    if ($state.userData) {
      _this.email = $state.userData.user.email;
    }

    _this.logOut = function ($uibModal) {
      _this.modals.logOutConfirm();
    };
  });

  angular.module('app').controller('LogOutConfirmModalController', function ($state, $uibModalInstance) {
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
      $uibModalInstance.close();
    };
  });
})();

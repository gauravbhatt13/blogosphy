(function () {
  'use strict';
  angular.module('login').controller('LoginController', function ($state, loginService, $uibModal) {
    var _this = this;
    _this.showModal = function (heading, message) {
      $uibModal.open({
        templateUrl: '/modules/login/templates/loginModal.html',
        controller: 'LoginModalController',
        controllerAs: '$ctrl',
        resolve: {
          heading: function () {
            return heading;
          },
          message: function () {
            return message;
          }
        }
      });

    };

    _this.model = {email: '', pwd: ''};

    if ($state.verifyEmail) {
      _this.verifyEmail = $state.verifyEmail.email;
    }

    _this.signUp = function () {
      $state.go('signUp');
    };

    _this.completeRegistration = function () {
      loginService.completeRegistration(_this.model).then(function (data, err) {
        if (err) {
          console.log(err);
        } else {
          console.log(data);
          if (data.code === 1) {
            $state.verifyEmail = {email: data.user.email};
            $state.go('verifyEmail');
          } else if (data.code === 2) {
            _this.showModal('Registration', 'The email id provided by you is already registered.');
          }
        }
      });

    };

    _this.login = function () {
      loginService.login(_this.model).then(function (data, err) {
        if (err) {
          console.log(err);
          _this.showModal(err);
        } else {
          console.log(data);
          if (data.code === 3) {
            _this.showModal('Login Failed', 'Please provide correct email and password.');
          } else if (data.code === 4) {
            $state.userData = data;
            $state.go('home');
          }
        }
      });
    };
  });

  angular.module('login').controller('LoginModalController', function ($uibModalInstance, heading, message) {
    var _this = this;
    _this.heading = heading;
    _this.message = message;
    _this.close = function () {
      $uibModalInstance.close();
    };
  });

})();

(function () {
  'use strict';
  angular.module('login').controller('LoginController', function ($state, loginService, $uibModal) {
    var _this = this;
    _this.showModal = function (heading, message, isOk) {
      $uibModal.open({
        templateUrl: '/modules/login/templates/loginModal.html',
        controller: 'LoginModalController',
        controllerAs: '$ctrl',
        resolve: {
          isOkModal: isOk,
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
            _this.showModal('User registration', 'Registration email sent to ' + data.user.email + '. It contains a link to ' +
              'verify your identity and complete your registration.', true);
          } else if (data.code === 2) {
            _this.showModal('User Registration', 'The email id provided by you is already registered.', false);
          }
        }
      });

    };

    _this.login = function () {
      loginService.login(_this.model).then(function (data, err) {
        if (err) {
          console.log(err);
          _this.showModal('Login Failed', 'Error during login', false);
        } else {
          console.log(data);
          if (data.code === 3) {
            _this.showModal('Login Failed', 'Please provide correct email and password.', false);
          } else if (data.code === 4) {
            $state.go('showDashboard');
          }
        }
      });
    };
  });

  angular.module('login').controller('LoginModalController', function ($uibModalInstance, heading, message, isOkModal, $state) {
    var _this = this;
    _this.isOkModal = isOkModal;
    _this.heading = heading;
    _this.message = message;
    _this.close = function () {
      $uibModalInstance.close();
    };
    _this.Ok = function () {
      $uibModalInstance.close();
      $state.go('login');
    };
  });

  angular.module('login').controller('DashBoardController', function ($state, blogs, loginService) {
    var _this = this;
    if (loginService.getCurrentUser() === undefined) {
      $state.go('login');
    } else {

      _this.blogCount = blogs.length;
      _this.data = blogs;
      _this.groups = [];
      _this.readMore = function (blogTitle) {
        console.log('setting blogTitle: ' + blogTitle);
        $state.go('showBlog', {blogTitle: blogTitle}, undefined);
      };
      _this.data.forEach(function (item) {
        _this.groups.push({title: item.blogTitle, content: item.blogDescription});
      });
      _this.accordionGraybg = {
        isFirstOpen: true,
        isFirstDisabled: false
      };
    }
  });
})();

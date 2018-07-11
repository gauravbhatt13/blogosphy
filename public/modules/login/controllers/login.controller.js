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

  angular.module('login').controller('DashBoardController', function ($state, blogs, loginService, blogsService) {
    var _this = this;
    if (loginService.getCurrentUser() === undefined) {
      $state.go('login');
    } else {
      _this.editBlog = function () {
        _this.blogs.filter(function (blog) {
          if (blog.blogTitle === _this.table.selectedRows[0]) {
            $state.go('createBlog', {blog: blog});
          }
        });
      };

      _this.deleteBlog = function () {
        blogsService.deleteBlog(_this.table.selectedRows).then(function (data, err) {
          if (err) {
            setTimeout(function () {
              $state.go($state.current, {}, {reload: true});
            }, 1000);
          } else {
            setTimeout(function () {
              $state.go($state.current, {}, {reload: true});
            }, 1000);
          }
        });
      };
      _this.createBlog = function () {
        $state.go('createBlog');
      };
      _this.blogs = blogs;
      _this.table = {
        data: _this.blogs,
        sort: {
          type: 'full_name',
          reverse: false,
          change: function (key) {
            _this.table.sort.type = key;
            _this.table.sort.reverse = !_this.table.sort.reverse;
          }
        },
        selectedRows: [],
        selectRow: function (data, $event) {
          $event.stopPropagation();

          if (_this.table.selectedRows.indexOf(data.blogTitle) === -1) {
            _this.table.selectedRows.push(data.blogTitle);
            data.selected = true;
          } else {
            _this.table.selectedRows.splice(_this.table.selectedRows.indexOf(data.blogTitle), 1);
            _this.table.allRowsSelected = false;
            data.selected = false;
          }
        },
        selectAllRows: function () {
          var checked = !_this.table.selectAllFilteredRows();

          _this.table.selectedRows = [];

          angular.forEach(_this.table.data, function (value, key) {
            value.selected = checked;

            if (checked) {
              _this.table.selectedRows.push(value.blogTitle);
            }
          });
        },
        selectAllFilteredRows: function () {
          var selected = 0;

          angular.forEach(_this.table.data, function (value, key) {
            if (value.selected) {
              selected++;
            }
          });

          return (selected !== 0 && selected === _this.table.data.length);
        }

      };
      _this.blogCount = blogs.length;

    }
  });
})();

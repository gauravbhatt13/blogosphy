(function () {

  'use strict';

  angular.module('app').factory('loginService', function ($http, $q) {
    var _this = this;
    console.log('login service initialized');
    _this.currentUser;

    _this.login = function (data) {
      var deferred = $q.defer();

      $http.post('/blogs/login/signin', data).success(function (data) {
        _this.currentUser = data.user;
        deferred.resolve(data);
      }).error(function (msg, code) {
        console.log(code);
        deferred.reject(msg);
      });
      return deferred.promise;
    };

    _this.completeRegistration = function (data) {
      var deferred = $q.defer();

      $http.post('/blogs/login/register', data).success(function (data) {
        deferred.resolve(data);
      }).error(function (msg, code) {
        deferred.reject(msg);
        console.log(msg, code);
      });
      return deferred.promise;
    };

    _this.getCurrentUser = function () {
      return _this.currentUser;
    };

    _this.logOut = function () {
      _this.currentUser = undefined;
    };

    return {
      getCurrentUser: _this.getCurrentUser,
      login: _this.login,
      completeRegistration: _this.completeRegistration,
      logOut: _this.logOut
    };
  });

})();

(function () {

  'use strict';

  angular.module('app').factory('loginService', function ($http, $q) {
    console.log('login service initialized');
    return {
      login: function (data) {
        var deferred = $q.defer();

        $http.post('/blogs/login/signin', data).success(function (data) {
          deferred.resolve(data);
        }).error(function (msg, code) {
          console.log(code);
          deferred.reject(msg);
        });
        return deferred.promise;
      },
      completeRegistration: function (data) {
        var deferred = $q.defer();

        $http.post('/blogs/login/register', data).success(function (data) {
          deferred.resolve(data);
        }).error(function (msg, code) {
          deferred.reject(msg);
          console.log(msg, code);
        });
        return deferred.promise;
      }
    };
  });

})();

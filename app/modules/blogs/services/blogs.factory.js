(function () {

  'use strict';

  angular.module('blogs').factory('blogsService', function ($http, $q) {
    return {
      getBlog: function (blogTitle) {
        var deferred = $q.defer();

        $http({url: '/blogs', method: 'GET', params: {blogTitle: blogTitle}}).success(function (data) {
          deferred.resolve(data);
        }).error(function (msg, code) {
          console.log(code);
          deferred.reject(msg);
        });
        return deferred.promise;
      },
      getBlogs: function () {
        var deferred = $q.defer();

        $http.get('/blogs/getBlogs').success(function (data) {
          deferred.resolve(data);
        }).error(function (msg, code) {
          console.log(code);
          deferred.reject(msg);
        });
        return deferred.promise;
      },
      saveCategory: function (data) {
        var deferred = $q.defer();

        $http.post('/blogs/category', data).success(function (data) {
          deferred.resolve(data);
        }).error(function (msg, code) {
          console.log(code);
          deferred.reject(msg);
        });
        return deferred.promise;
      },
      getCategories: function () {
        var deferred = $q.defer();

        $http.get('/blogs/category/getCategories').success(function (data) {
          deferred.resolve(data);
        }).error(function (msg, code) {
          console.log(code);
          deferred.reject(msg);
        });
        return deferred.promise;
      },
      saveBlog: function (data) {

        var deferred = $q.defer();

        $http.post('/blogs', data).success(function (data) {
          deferred.resolve(data);
        }).error(function (msg, code) {
          console.log(code);
          deferred.reject(msg);
        });
        return deferred.promise;
      }
    };
  });

})();

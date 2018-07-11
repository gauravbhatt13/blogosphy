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
      },
      deleteBlogCategory: function (data) {
        var promises = [];
        var deferred = $q.defer();
        angular.forEach(data, function (category) {
          var promise = $http({
            url: '/blogs/category/',
            method: 'DELETE',
            data: {categoryName: category},
            headers: {
              'Content-type': 'application/json;charset=utf-8'
            }
          });
          promises.push(promise);

        });
        return $q.all(promises);
      },
      deleteBlog: function (data) {
        var promises = [];
        var deferred = $q.defer();
        angular.forEach(data, function (blog) {
          var promise = $http({
            url: '/blogs',
            method: 'DELETE',
            data: {blogTitle: blog},
            headers: {
              'Content-type': 'application/json;charset=utf-8'
            }
          });
          promises.push(promise);

        });
        return $q.all(promises);
      },
      getBlogsByUser: function (data) {
        var deferred = $q.defer();

        $http.post('/blogs/blogsByUser', {email: data.email}).success(function (data) {
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

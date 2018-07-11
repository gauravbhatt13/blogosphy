(function () {

  'use strict';

  angular.module('blogs').config(function ($stateProvider) {
    $stateProvider.state('home', {
      url: '/home',
      resolve: {
        categories: function (blogsService) {
          return blogsService.getCategories();
        },
        blogsData: function (blogsService) {
          return blogsService.getBlogs();
        }
      },
      data: {
        pageTitle: 'Home',
        access: 'private',
        bodyClass: 'home'
      },
      views: {
        'header': {
          controller: 'HeaderController as header',
          templateUrl: 'modules/main/templates/header.html'
        },
        'content': {
          controller: 'HomeController as home',
          templateUrl: 'modules/blogs/templates/home.html'
        },
        'footer': {
          controller: 'FooterController as footer',
          templateUrl: 'modules/main/templates/footer.html'
        }
      }
    });
    $stateProvider.state('showBlog', {
      url: '/showBlog?blogTitle',
      resolve: {
        categories: function (blogsService) {
          return blogsService.getCategories();
        },
        blogData: function (blogsService, $stateParams) {
          console.log('calling with param: ' + $stateParams.blogTitle);
          return blogsService.getBlog($stateParams.blogTitle);
        }
      },
      data: {
        pageTitle: 'Blog',
        access: 'private',
        bodyClass: 'home'
      },
      views: {
        'header': {
          controller: 'HeaderController as header',
          templateUrl: 'modules/main/templates/header.html'
        },
        'content': {
          controller: 'ShowBlogController as showBlogCtrl',
          templateUrl: 'modules/blogs/templates/showBlog.html'
        },
        'footer': {
          controller: 'FooterController as footer',
          templateUrl: 'modules/main/templates/footer.html'
        }
      }
    });

    $stateProvider.state('createBlog', {
      url: '/createBlog',
      resolve: {
        categories: function (blogsService) {
          return blogsService.getCategories();
        }
      },
      params: {
        'blog': ''
      },
      data: {
        pageTitle: 'Create Blog',
        access: 'private',
        bodyClass: 'home'
      },
      views: {
        'header': {
          controller: 'HeaderController as header',
          templateUrl: 'modules/main/templates/header.html'
        },
        'content': {
          controller: 'BlogsController as blogCtrl',
          templateUrl: 'modules/blogs/templates/createBlog.html'
        },
        'footer': {
          controller: 'FooterController as footer',
          templateUrl: 'modules/main/templates/footer.html'
        }
      }
    });
    $stateProvider.state('manageBlogCategory', {
      url: '/manageBlogCategory',
      resolve: {
        categories: function (blogsService) {
          return blogsService.getCategories();
        }
      },
      data: {
        pageTitle: 'Manage Blog Category',
        access: 'private',
        bodyClass: 'home'
      },
      views: {
        'header': {
          controller: 'HeaderController as header',
          templateUrl: 'modules/main/templates/header.html'
        },
        'content': {
          controller: 'ManageBlogCategoryCtrl as blogCatCtrl',
          templateUrl: 'modules/blogs/templates/manageBlogCategory.html'
        },
        'footer': {
          controller: 'FooterController as footer',
          templateUrl: 'modules/main/templates/footer.html'
        }
      }
    });
  });

})();

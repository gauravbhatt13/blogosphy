(function () {
  'use strict';

  // Home Controller
  angular.module('blogs').controller('HomeController', function (blogsData, blogsService, $state) {
    var _this = this;
    _this.data = blogsData;
    _this.groups = [];
    _this.readMore = function (blogTitle) {
      console.log('setting blogTitle: ' + blogTitle);
      $state.go('showBlog', {blogTitle: blogTitle}, undefined);
    };
    blogsData.forEach(function (item) {
      _this.groups.push({title: item.blogTitle, content: item.blogDescription});
    });
    _this.oneAtATime = true;

    _this.accordionGraybg = {
      isFirstOpen: true,
      isFirstDisabled: false
    };

  });

  // Show Blog Controller
  angular.module('blogs').controller('ShowBlogController', function (blogData) {
    var _this = this;
    console.log(blogData);
    _this.blogTitle = blogData.blogTitle;
    _this.previewHTML = blogData.blogHTML;
  });
  // Blogs Controller
  angular.module('blogs').controller('BlogsController', function (categories, $uibModal, $scope, blogsService) {
    console.log('blogs controller initialized');
    var _this = this;
    _this.isSaved = false;
    _this.model = {blogTitle: '', blogCategory: '', blogDescription: '', blogHTML: ''};
    _this.messages = {blogSaved: 'Blog saved successfully'};
    _this.showPreviewModal = function (heading, previewHTML) {
      $uibModal.open({
        templateUrl: '/modules/blogs/templates/previewModal.html',
        controller: 'PreviewModalController',
        controllerAs: '$ctrl',
        resolve: {
          heading: function () {
            return heading;
          },
          previewHTML: function () {
            return previewHTML;
          }
        }
      });

    };
    _this.categories = categories;
    _this.wordCount = 0;
    _this.charCount = 0;
    // on-content-changed="blogCtrl.blogContentChangedCallback(editor, html, text, content, delta, oldDelta, source)"
    _this.blogContentChangedCallback = function (editor, html, text, content, delta, oldDelta, source) {
      console.log(delta);
    };
    _this.saveBlog = function () {
      blogsService.saveBlog(_this.model).then(function (data, err) {
        if (err) {

        } else {
          _this.isSaved = true;
          setTimeout(function () {
            _this.isSaved = false;
          }, 3000);
        }
      });
    };
    _this.blogCallback = function (editor) {
      editor.on('text-change', function () {
        var text = editor.getText();
        var regex = /\s+/gi;
        var wordCount = text.trim().replace(regex, ' ').split(' ').length;
        var totalChars = text.length;
        var charCount = text.trim().length;
        var charCountNoSpace = text.replace(regex, '').length;
        _this.wordCount = wordCount;
        _this.charCount = charCountNoSpace;
      });
    };
    _this.previewHTML = undefined;

    _this.preview = function () {

    };
  });

  // Blogs Category Controller
  angular.module('blogs').controller('BlogsCategoryController', function ($scope, $base64, $uibModal, blogsService, categories) {
    var _this = this;
    _this.showModal = function (heading, message) {
      $uibModal.open({
        templateUrl: '/modules/blogs/templates/blogModal.html',
        controller: 'BlogModalController',
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
    _this.categories = categories;
    _this.model = {categoryName: '', categoryDescription: '', categoryImgIcon: ''};
    _this.dragdrop = {files: []};
    $scope.$watch('blogCatCtrl.dragdrop.files', function () {
      _this.upload(_this.dragdrop.files);
    });
    _this.hideDragDrop = false;
    _this.upload = function (files) {
      console.log('upload called : ' + files.length);
      if (files && files.length) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          if (!file.$error) {
            var reader = new FileReader();
            reader.onload = function () {
              _this.model.categoryImgIcon = $base64.encode(reader.result);
              _this.hideDragDrop = true;
              $scope.$apply();
            };
            reader.readAsBinaryString(file);
          }
        }
      }
    };
    _this.reset = function () {
      _this.model = {categoryName: '', categoryDescription: '', categoryImgIcon: ''};
      _this.hideDragDrop = false;
      _this.dragdrop = {files: []};
    };
    _this.save = function () {
      blogsService.saveCategory(_this.model).then(function (data, err) {
        if (err) {
          _this.showModal('Blog Category', 'Error creating blog category');
        } else {
          _this.showModal('Blog Category', 'Blog category created.');
          _this.reset();
        }
      });
    };
    _this.slickConfig = {
      enabled: true,
      autoplay: true,
      draggable: false,
      autoplaySpeed: 3000,
      method: {},
      event: {
        beforeChange: function (event, slick, currentSlide, nextSlide) {
        },
        afterChange: function (event, slick, currentSlide, nextSlide) {
        }
      }
    };
  });

  angular.module('blogs').controller('BlogModalController', function ($uibModalInstance, heading, message) {
    var _this = this;
    _this.heading = heading;
    _this.message = message;
    _this.close = function () {
      $uibModalInstance.close();
    };
  });

  angular.module('blogs').controller('PreviewModalController', function ($uibModalInstance, heading, previewHTML) {
    var _this = this;
    _this.heading = heading;
    _this.previewHTML = previewHTML;
    _this.close = function () {
      $uibModalInstance.close();
    };
  });
})();

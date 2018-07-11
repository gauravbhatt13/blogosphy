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
    _this.blogTitle = blogData.blogTitle;
    _this.previewHTML = blogData.blogHTML;
  });
  // Blogs Controller
  angular.module('blogs').controller('BlogsController', function (categories, $uibModal, $scope, blogsService, loginService) {
    console.log('blogs controller initialized');
    var _this = this;
    _this.isSaved = false;
    _this.model = {blogTitle: '', blogCategory: '', blogDescription: '', blogHTML: '', userEmail: ''};
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
      _this.model.userEmail = loginService.getCurrentUser().email;
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
  angular.module('blogs').controller('ManageBlogCategoryCtrl', function ($state, $scope, $uibModal, blogsService, categories) {
    var _this = this;
    _this.deleteBlogCategory = function () {
      blogsService.deleteBlogCategory(_this.table.selectedRows).then(function (data, err) {
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

    _this.createBlogCategoryModal = function () {
      $uibModal.open({
        templateUrl: '/modules/blogs/templates/createBlogCategoryModal.html',
        controller: 'CreateBlogCatModalCtrl',
        controllerAs: 'createBlogCtrl'
      }).closed.then(function () {
        setTimeout(function () {
          $state.go($state.current, {}, {reload: true});
        }, 1000);
      });
    };
    _this.categories = categories;
    _this.table = {
      data: _this.categories,
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

        if (_this.table.selectedRows.indexOf(data.categoryName) === -1) {
          _this.table.selectedRows.push(data.categoryName);
          data.selected = true;
        } else {
          _this.table.selectedRows.splice(_this.table.selectedRows.indexOf(data.categoryName), 1);
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
            _this.table.selectedRows.push(value.categoryName);
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

  angular.module('blogs').controller('CreateBlogCatModalCtrl', function ($scope, blogsService, $state, $uibModal, $base64, $uibModalInstance) {
    var _this = this;
    _this.model = {categoryName: '', categoryDescription: ''};

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
              // _this.model.categoryImgIcon = $base64.encode(reader.result);
              _this.hideDragDrop = true;
              $scope.$apply();
            };
            reader.readAsBinaryString(file);
          }
        }
      }
    };
    _this.reset = function () {
      _this.model = {categoryName: '', categoryDescription: ''};
      _this.hideDragDrop = false;
      _this.dragdrop = {files: []};
    };
    _this.save = function () {
      blogsService.saveCategory(_this.model).then(function (data, err) {
        if (err) {

        } else {
          $uibModalInstance.close();
        }
      });
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

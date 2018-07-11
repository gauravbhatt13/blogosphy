const express = require('express');
const router = express.Router();
const util = require('util');
const esClient = require('../modules/esClient');
const blogCatIndexName = 'blogcategories';
const blogCatPrimaryKey = 'categoryName';

router.post('/', function (req, res, next) {
  console.log('****************create blog category request received*******************');
  manageBlogCategory(res, req.body);
});

router.get('/getCategories', function (req, res, next) {
  getBlogCategories(res);
});

router.delete('/', function (req, res, next) {
  deleteCategory(res, req.body);
});

async function deleteCategory (res, category) {
  console.log('category received' + category.categoryName);
  esClient.deleteEntity(blogCatIndexName, category, blogCatPrimaryKey);
  res.send({code: 1});
}
async function manageBlogCategory (res, data) {
  const exists = await esClient.exists(blogCatIndexName, data, blogCatPrimaryKey);
  if (!exists) {
    console.log('category exists status : ' + exists);
    esClient.saveEntity(blogCatIndexName, data, blogCatPrimaryKey);
    res.send({code: 1, blogCategory: data});
    console.log('*************category created*********************');
  } else {
    res.send({code: 2, blogCategory: data});
  }
}

async function getBlogCategories (res) {
  const allCategories = await esClient.getAll(blogCatIndexName);
  const categories = [];
  allCategories.hits.hits.forEach(function (hit) {
    categories.push(hit._source);
  });
  res.send(categories);
}
module.exports = router;

const express = require('express');
const router = express.Router();
const util = require('util');
const esClient = require('../modules/esClient');
const blogsIndexName = 'blogs';
const blogsPrimaryKey = 'blogTitle';

router.post('/', function (req, res, next) {
  console.log('****************create blog request received*******************');
  createBlog(res, req.body);
});

router.get('/getBlogs', function (req, res, next) {
  getBlogs(res);
});

router.get('/', function (req, res, next) {
  getBlog(res, req.query.blogTitle);
});

async function getBlog (res, blogTitle) {
  const blog = await esClient.getEntity(blogsIndexName, {blogTitle: blogTitle}, blogsPrimaryKey);
  res.send(blog.hits.hits[0]['_source']);
}

async function createBlog (res, data) {
  esClient.saveEntity(blogsIndexName, data, blogsPrimaryKey);
  res.send({code: 1, blog: data});
}

async function getBlogs (res) {
  const allBlogs = await esClient.getAll(blogsIndexName);
  const blogs = [];
  allBlogs.hits.hits.forEach(function (hit) {
    blogs.push(hit._source);
  });
  res.send(blogs);
}
module.exports = router;

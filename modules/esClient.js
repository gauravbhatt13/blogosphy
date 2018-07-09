const elasticsearch = require('elasticsearch');
const typeSuffix = '_type';
const client = new elasticsearch.Client({
  host: 'localhost:9201',
  log: 'trace'
});

async function saveEntity (index, entity, primaryKey) {
  const response = client.index({
    index: index,
    type: index + typeSuffix,
    id: entity[primaryKey],
    body: entity
  });
  return response;
}

async function getEntity (index, entity, primaryKey) {
  const response = await client.search({
    index: index,
    q: '_id:' + entity[primaryKey]
  });
  return response;
}

async function exists (index, entity, primaryKey) {
  const exists = await client.exists({
    index: index,
    type: index + typeSuffix,
    id: entity[primaryKey]
  });
  return exists;
}

async function deleteEntity (index, entity) {

}

async function updateEntity (index, entity) {

}

async function getAll (index) {
  const response = await client.search({
    index: index,
    body: {
      query: {
        match_all: {}
      }
    }
  });
  return response;
}

module.exports = {
  saveEntity: saveEntity,
  getEntity: getEntity,
  deleteEntity: deleteEntity,
  updateEntity: updateEntity,
  exists: exists,
  getAll: getAll
};

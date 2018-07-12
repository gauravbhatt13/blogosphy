const elasticsearch = require('elasticsearch');
const typeSuffix = '_type';
const client = new elasticsearch.Client({
  host: 'https://j6kqp1mxtz:f0lqra40ea@dogwood-2836663.us-east-1.bonsaisearch.net',
  log: 'trace'
});

/*const client = new elasticsearch.Client({
  host: 'localhost:9201',
  log: 'trace'
});*/

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

async function getEntityByUser (index, user) {
  const response = await client.search({
    index: index,
    q: 'userEmail:' + user.email
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

async function deleteEntity (index, entity, primaryKey) {
  await client.delete({
    index: index,
    type: index + typeSuffix,
    id: entity[primaryKey]
  });
}

async function updateEntity (index, entity) {

}

async function verifyUser (index, verificationCode, primaryKey) {
  const result = await client.search({
    index: index,
    body: {
      query: {
        term: {
          verificationCode: verificationCode
        }
      }
    }
  });
  if (result) {
    if (result.hits.hits.length === 0) {
      return 0;
    } else {
      var user = result.hits.hits[0]._source;
      user.verified = true;
      user.verificationCode = undefined;
      const response = client.index({
        index: index,
        type: index + typeSuffix,
        id: user[primaryKey],
        body: user
      });
      return 1;
    }
  }
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
  getAll: getAll,
  getEntityByUser: getEntityByUser,
  verifyUser: verifyUser
};

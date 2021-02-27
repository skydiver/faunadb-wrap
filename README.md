# faunadb-helpers
> Helpers to interact with FaunaDB


## Install


## Usage

### Create collections
```js
await fauna.createCollection('my_collection');
```

## Delete collections
```js
await fauna.deleteCollection('my_collection');
```

### Create indexes
```js
// create an index called "index_name"
await fauna.createIndex('my_collection', 'index_name');

// create index with terms
await fauna.createIndex('customers', 'index_with_terms', {
  terms: [{ field: ['data', 'firstName'] }]
});

// create index with field firstName unique
await fauna.createIndex('customers', 'index_unique', {
  terms: [{ field: ['data', 'firstName'] }],
  unique: true
});
```

### Delete indexes
```js
await fauna.deleteIndex('index_name');
```
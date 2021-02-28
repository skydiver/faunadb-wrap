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

### Create documents
```js
await fauna.createDocument('customers', {
  firstName: 'John',
  lastName: 'Smith',
  age: 40
});
```

### Retrieve documents
```js
const documents = await fauna.retrieveDocuments('customers');
console.log(documents);             // PRINT ALL DOCUMENTS
console.log(documents[0]);          // PRINT FIRST DOCUMENT
console.log(documents[0].data);     // PRINT DOCUMENT FIELDS
```

### Update document
```js
// Update firstName, age and add tags
await fauna.updateDocument('customers', '291699840069403141', {
  firstName: 'Peter',
  age: 41,
  tags: ['customer', 'financial']
});

// Remove tags property
await fauna.updateDocument('customers', '291699840069403141', {
  tags: null
});
```

### Delete document
```js
await fauna.deleteDocument('customers', '291699840069403141');
```
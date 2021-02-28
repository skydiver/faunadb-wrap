import faunadb from 'faunadb';

class Fauna {
  secret: string;
  client: faunadb.Client;
  q: typeof faunadb.query;

  constructor({ secret }: { secret: string }) {
    this.secret = secret;
    this.client = new faunadb.Client({ secret });
    this.q = faunadb.query;
  }

  /**
   * Create new collection
   *
   * @param name
   * @returns {Promise}
   */
  createCollection(name: string) {
    return this.client.query(this.q.CreateCollection({ name }));
  }

  /**
   * Delete collection
   *
   * @param name
   * @returns {Promise}
   */
  deleteCollection(name: string) {
    return this.client.query(this.q.Delete(this.q.Collection(name)));
  }

  /**
   * Create new index
   *
   * @param collection
   * @param name
   * @param terms
   * @param unique
   * @returns {Promise}
   */
  createIndex(collection: string, name: string, parameters = { terms: [], unique: false }) {
    interface indexParameters {
      name: string;
      source: unknown;
      terms?: Array<string>;
      unique?: boolean;
    }

    const params: indexParameters = {
      name,
      source: this.q.Collection(collection),
    };

    const { terms, unique } = parameters;

    if (terms) {
      params.terms = terms;
    }

    if (unique) {
      params.unique = unique;
    }

    return this.client.query(this.q.CreateIndex(params));
  }

  /**
   * Delete index
   *
   * @param name
   * @returns {Promise}
   */
  deleteIndex(name: string) {
    return this.client.query(this.q.Delete(this.q.Index(name)));
  }

  /**
   * Create new document
   *
   * @param collection
   * @param data
   * @returns {Promise}
   */
  createDocument(collection: string, data: object) {
    return this.client.query(this.q.Create(this.q.Collection(collection), { data }));
  }

  /**
   * Retrieve all documents from a collection
   *
   * @param collection
   * @returns {Promise}
   */
  async retrieveDocuments(collection: string) {
    const result: Record<string, unknown> = await this.client.query(
      this.q.Map(
        this.q.Paginate(this.q.Documents(this.q.Collection(collection))),
        this.q.Lambda((x) => this.q.Get(x)),
      ),
    );

    return result.data;
  }

  /**
   * Update document
   *
   * @param collection
   * @param documentId
   * @param data
   * @returns {Promise}
   */
  async updateDocument(collection: string, documentId: string, data: Record<string, unknown>) {
    return this.client.query(this.q.Update(this.q.Ref(this.q.Collection(collection), documentId), { data }));
  }

  /**
   * Retrieve document(s)
   * @param index
   * @param value
   * @returns {Promise}
   */
  async retrieveDocument(index: string, value: string) {
    const match = this._matchDocument(index, value);

    const exists = await this.client.query(this.q.Exists(match));

    if (exists) {
      return this.client.query(this.q.Get(match));
    }

    return null;
  }

  /**
   * Retrieve documents count
   *
   * @param index
   * @param value
   * @returns {Promise}
   */
  getDocumentsCount(index: string, value: string) {
    return this.client.query(this.q.Count(this._matchDocument(index, value)));
  }

  /**
   * Helper to search documents on specific index
   *
   * @param index
   * @param value
   * @returns {*}
   * @private
   */
  _matchDocument(index: string, value: string) {
    return this.q.Match(this.q.Index(index), value);
  }
}

module.exports = Fauna;

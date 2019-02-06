const { ApolloServer, gql } = require('apollo-server');
const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.
// const url = 'mongodb://localhost:27017';

let mongo;
async function context() {
  if (!mongo) {
    mongo = await MongoClient.connect('mongodb://localhost:27017')
    mongo = mongo.db('graphQlWorkshopDB')
  }
    return { mongo } 
}

const books = [
  {
    id: 1,
    title: 'Harry Potter and the Chamber of Secrets',
    authorId: 1,
    publisherId: 1,
  },
  {
    id: 2,
    title: 'Jurassic Park',
    authorId: 2,
    publisherId: 1,
  },
];

const authors = [
    {
     id: 1,
     name: 'J.K. Rowling'
    },
    {
     id: 2,
     name: 'Michael Crichton'
    }
];

const publishers = [
    {
        id: 1,
        name: 'Penguin',
        city: 'London',
    },
    {
        id: 2,
        name: 'RandomHouse',
        city: 'New York',
    }
]

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # This "Book" type can be used in other type declarations.
  type Book {
    id: Int
    title: String
    author: Author
    publisher: Publisher
  }
  type Author {
    id: Int
    name: String
  }
  type Publisher {
      id: Int
      name: String
      city: String
      books: [Book]
  }


  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    books: [Book]
    authors: [Author]
    publishers: [Publisher]
    book(id: Int): Book
  }
`;

// Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.
const resolvers = {
  Query: {
    books: async (_, args, context) => await context.mongo.collection('books').find().toArray(),
    authors: () => authors,
    publishers: () => publishers,
    book: async (_, {id}, context) => await context.mongo.collection('books').findOne({id})
  },
  Book: {
    author: (book) => authors.find( author => author.id === book.authorId),
    publisher: (book) => publishers.find(publisher => publisher.id === book.publisherId)
  },
  Publisher: {
    books: (publisher) => books.filter(book => book.publisherId == publisher.id )
  }
};

// In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.
const server = new ApolloServer({ typeDefs, resolvers, context });

// This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

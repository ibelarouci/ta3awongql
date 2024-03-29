const { ApolloServer, gql, makeExecutableSchema } = require("apollo-server");
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge");
const { AccountsModule } = require("@accounts/graphql-api");
const mongoose = require("mongoose");
//const { MongoClient, ObjectId } = require("mongodb");
const resolvers = require('./graphql/resolver');
const typeDefs = require('./graphql/schema');
const { Mongo } = require("@accounts/mongo");
const { AccountsServer } = require("@accounts/server");
const { AccountsPassword } = require("@accounts/password");
const permissions = require('./graphql/permission');
const { applyMiddleware } =require( 'graphql-middleware');



// We connect mongoose to our local mongodb database
mongoose.connect("mongodb://localhost:27017/ta3awongql", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});


//
// We tell accounts-js to use the mongo connection
const accountsMongo = new Mongo(mongoose.connection);

const accountsPassword = new AccountsPassword({
    // You can customise the behavior of the password service by providing some options
});

const accountsServer = new AccountsServer({
    ambiguousErrorMessages: false,

    enableAutologin: false,
    // We link the mongo adapter to the server
    db: accountsMongo,
    // Replace this value with a strong random secret
    tokenSecret: "my-super-random-secret"
}, {
    // We pass a list of services to the server, in this example we just use the password service
    password: accountsPassword
});





// We generate the accounts-js GraphQL module
const accountsGraphQL = AccountsModule.forRoot({ accountsServer });


// A new schema is created combining our schema and the accounts-js schema
const schema = makeExecutableSchema({
    typeDefs: mergeTypeDefs([typeDefs, accountsGraphQL.typeDefs]),
    resolvers: mergeResolvers([accountsGraphQL.resolvers, resolvers]),
    
});
//schema = applyMiddleware(schema, permissions);
const server = new ApolloServer({ schema:applyMiddleware(schema, permissions), 
 context: accountsGraphQL.context
  
});

// The `listen` method launches a web server.
server.listen().then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
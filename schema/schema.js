const graphql = require('graphql');
const _ = require('lodash');
const { 
  GraphQLObjectType, /* Table */
  GraphQLString,
  GraphQLInt,
  GraphQLSchema
} = graphql;

const users = [
  { id: '1', firstname: 'Dhilip', age: 24 }
];
const userType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString},
    firstname: { type: GraphQLString},
    age: { type: GraphQLInt}

  }
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: userType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return _.find(users, {id: args.id});
      }
    }
  }
});
/* meaning:you can ask rootquery users in the application, if you give the id of the user i will return the user */
/* Resolve reaches out and gets the real data */

module.exports = new GraphQLSchema({
  query: RootQuery
});
/* It gets the Root Query and returns the instance of user */
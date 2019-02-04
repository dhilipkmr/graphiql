const graphql = require('graphql');
const axios = require('axios');
const { 
  GraphQLObjectType, /* Table */
  GraphQLString,
  GraphQLInt,
  GraphQLSchema
} = graphql;

const companyType = new GraphQLObjectType({
  name: 'Company',
  fields: {
    id:  { type: GraphQLString},
    name:  { type: GraphQLString},
    description:  { type: GraphQLString}
  }
});

const userType = new GraphQLObjectType({
  name: 'User',
  fields: {
    id: { type: GraphQLString},
    firstName: { type: GraphQLString},
    age: { type: GraphQLInt},
    company: {
      type: companyType,
      resolve(parentValue, args) {
        /*Here parentValue gives all the content returned from first query where we Got the users with particular Id then we make another call with that userId to get the details */
        return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`).then((response) => {
          return response.data;
        });
      }
    }
  }
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: userType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/users/${args.id}`).then((response) => {
          return response.data;
        });
      }
    },
    company: {
      type: companyType,
      args: { id: { type: GraphQLString } },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3000/companies/${args.id}`).then((response) => {
          return response.data;
        });
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
const graphql = require('graphql');
const axios = require('axios');
const { 
  GraphQLObjectType, /* Table */
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = graphql;

const companyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => {
    return (
      {
        id:  { type: GraphQLString},
        name:  { type: GraphQLString},
        description:  { type: GraphQLString},
        user: {
          type: new GraphQLList(userType),
          resolve(parentValue, args) {
            return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`).then((response) => {
              return response.data;
            });
          }
        }
      }
    );
  }
});

const userType = new GraphQLObjectType({
  name: 'User',
  fields: () => {
    return {
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

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: {
      type: userType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString)},
        age:  { type: new GraphQLNonNull(GraphQLInt)},
        companyId: { type: GraphQLString}
      },
      resolve(parentValue, args) {
        const {firstName, age, companyId = ''} = args;
        return axios.post('http://localhost:3000/users', {firstName, age, companyId}).then((res) => res.data);
      }
    },
    deleteUser: {
      type: userType,
      args: { id: { type: new GraphQLNonNull(GraphQLString)} },
      resolve(parentValue, args) {
        const { id } = args;
        return axios.delete(`http://localhost:3000/users/${id}`).then((res) => res.data);
      }
    },
    editUser: {
      type: userType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString)},
        firstName: { type: GraphQLString},
        age:  { type: GraphQLString},
        companyId: { type: GraphQLString},
      },
      resolve(parentValue, args) {
        return axios.patch(`http://localhost:3000/users/${args.id}`, args).then((res) => res.data);
      }
    }
  }
});
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation
});
/* It gets the Root Query and returns the instance of user */
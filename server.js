var app = require('express')();
var expressGraphQL = require('express-graphql');
var schema = require('./schema/schema');

/* whenever client makes response with graphql let expressGraphQL handle it */
app.use('/graphql', expressGraphQL({
  graphiql: true,
  schema: schema
}));
app.listen(4000, () => {
  console.log('Server started on Port 4000');
});

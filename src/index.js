import React from "react";
import ApolloClient from "apollo-boost";
import { render } from "react-dom";
import { ApolloProvider } from "react-apollo";
import gql from "graphql-tag";
import App from "./App";

const defaults = {
  ip: "206.51.242.1"
};

const typeDefs = gql`
  extend type Query {
    ip: String
  }

  extend type Mutation {
    updateIp: Boolean
  }
`;

const resolvers = {
  Mutation: {
    updateIp: (_, { value }, { cache }) => {
      cache.writeData({ data: { ip: value } });
      return null;
    }
  }
};

// Configure Apollo client.
const client = new ApolloClient({
  uri: "https://api.graphloc.com/graphql",
  clientState: {
    defaults,
    typeDefs,
    resolvers
  }
});

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);

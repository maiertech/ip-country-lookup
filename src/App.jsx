import React from "react";
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
import { ApolloProvider, ApolloConsumer, Query } from "react-apollo";
import Lookup from "./Lookup";

// IP of Apollo's documentation.
const defaults = {
  ip: "206.51.242.1"
};

// Configure Apollo client.
const client = new ApolloClient({
  uri: "https://api.graphloc.com/graphql",
  clientState: {
    defaults,
    resolvers: {
      Mutation: {
        updateIp: (_, { value }, { cache }) => {
          cache.writeData({ data: { ip: value } });
          return null;
        }
      }
    }
  }
});

const GET_COUNTRY = gql`
  query($ip: String!) {
    getLocation(ip: $ip) {
      country {
        names {
          en
        }
        iso_code
      }
    }
  }
`;

const GET_IP = gql`
  query {
    ip @client
  }
`;

const UPDATE_IP = gql`
  mutation updateIp($value: String!) {
    updateIp(value: $value) @client
  }
`;

export default ({ ip }) => (
  <ApolloProvider client={client}>
    <Query query={GET_IP}>
      {({ data: { ip } }) => (
        <Query query={GET_COUNTRY} variables={{ ip }}>
          {({ loading, error, data, refetch }) => {
            if (loading) {
              return <Lookup loading={true} />;
            }

            // For internal IPs API returns null for getLocation.
            if (!data.getLocation || error) {
              return (
                <ApolloConsumer>
                  {client => (
                    <Lookup
                      error={error}
                      onSearch={async value => {
                        client.mutate({
                          mutation: UPDATE_IP,
                          variables: { value }
                        });
                        await refetch({ ip: value });
                      }}
                    />
                  )}
                </ApolloConsumer>
              );
            }

            return (
              <ApolloConsumer>
                {client => (
                  <Lookup
                    flagUrl={`https://flags.fmcdn.net/data/flags/w1160/${data.getLocation.country.iso_code.toLowerCase()}.png`}
                    name={data.getLocation.country.names.en}
                    onSearch={async value => {
                      client.mutate({
                        mutation: UPDATE_IP,
                        variables: { value }
                      });
                      await refetch({ ip: value });
                    }}
                    defaultValue={ip}
                  />
                )}
              </ApolloConsumer>
            );
          }}
        </Query>
      )}
    </Query>
  </ApolloProvider>
);

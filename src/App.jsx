import React from "react";
import { ApolloConsumer, Query } from "react-apollo";
import Lookup from "./Lookup";
import getIp from "./graphql/getIp";
import getCountry from "./graphql/getCountry";
import updateIp from "./graphql/updateIp";

export default () => (
  <Query query={getIp}>
    {({ data: { ip } }) => (
      <Query query={getCountry} variables={{ ip }}>
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
                        mutation: updateIp,
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
                      mutation: updateIp,
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
);

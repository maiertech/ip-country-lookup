import gql from "graphql-tag";

export default gql`
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

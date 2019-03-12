import gql from "graphql-tag";

export default gql`
  query {
    ip @client
  }
`;

import gql from "graphql-tag";

export default gql`
  mutation updateIp($value: String!) {
    updateIp(value: $value) @client
  }
`;

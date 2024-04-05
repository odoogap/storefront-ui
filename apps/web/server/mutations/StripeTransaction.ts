import gql from "graphql-tag";

export default gql`
  mutation ($providerId: Int!) {
    stripeTransaction(providerId: $providerId) {
      transaction
    }
  }
`;

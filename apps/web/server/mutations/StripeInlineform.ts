import gql from "graphql-tag";

export default gql`
  mutation ($providerId: Int!) {
    stripeInlineForm(providerId: $providerId) {
      inlineFormValues
    }
  }
`;

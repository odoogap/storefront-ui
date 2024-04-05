import { gql } from "@apollo/client/core";

export default gql`
  query {
    paymentProviders {
      id
      name
      code
      image
      publicKey
      paymentMethods {
        id
        name
        sequence
        code
        brands {
          id
          name
          image
        }
        image
        imagePaymentForm
      }
    }
  }
`;

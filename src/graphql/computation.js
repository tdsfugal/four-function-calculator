import gql from 'graphql-tag';

export const defaults = {
  computations: []
};

export const typeDefs = `

  type ComputationState {
    displayString: String
    buffer: Number
    accumulator: Number
    operator: String
  }

  type Computation {
    id: String!
    eventKey: String
    eventPending: String
    state: ComputationState
  }

  type Query {
    computations: [Computation]
    computation( $id: String!): Computation
  }

`;

export const getComputations = gql`
  query getComputations {
    computations @client {
      id
      eventKey
      eventPending
      state {
        displayString
        buffer
        accumulator
        operator
        __typename
      }
      __typename
    }
  }
`;

export const stateFragment = gql`
  fragment stateFragment on Computation @client {
    state {
      displayString
      buffer
      accumulator
      operator
      __typename
    }
  }
`;

export const eventFragment = gql`
  fragment eventFragment on Computation @client {
    eventKey
    eventPending
    __typename
  }
`;

export const resolvers = {
  Mutation: {
    registerKeyEvent: (_, variables, { cache, getCacheKey }) => {
      const id = getCacheKey({ __typename: 'Computation', id: variables.id });
      const data = {
        eventKey: variables.key,
        eventPending: true,
        __typename: 'Computation'
      };
      cache.writeFragment({ id, fragment: eventFragment, data });
      return null;
    }
  }
};

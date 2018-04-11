import getApolloClient from '../../graphql/getApolloClient';
import { getComputations } from '../../graphql/computation';

import calculate from './calculate';

export const NONE = 'none';
export const ADD = 'add';
export const SUBTRACT = 'subtract';
export const MULTIPLY = 'multiply';
export const DIVIDE = 'divide';

export const DEFAULT_COMPUTATION_STATE = {
  bufferString: '',
  bufferNegative: false,
  buffer: 0,
  accumulator: 0,
  operator: NONE,
  __typename: 'ComputationState'
};

const client = getApolloClient();

const observable = client.watchQuery({
  query: getComputations,
  pollInterval: 500
});

const subscription = observable.subscribe({
  next: ({ data: { computations = [] } }) => {
    console.log('----Start----');
    console.log(computations);
    const pendingComputations = computations.length
      ? computations.filter(c => c && c.event && c.event.pending)
      : [];
    console.log('pending');
    console.log(pendingComputations);
    console.log('--------');
    pendingComputations.forEach(
      ({ id, event, state = DEFAULT_COMPUTATION_STATE }) => {
        console.log(`====== ${id} Pending =======`);
        console.log(event);
        console.log(state);
        const newState = calculate(event.key, state);
        console.log(newState);
      }
    );
  },
  error: err => {
    console.log(err);
  },
  complete: () => console.log('Subscription Complete')
});

export default subscription;

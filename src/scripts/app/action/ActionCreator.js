import AppActionConstants from './ActionConstants.js';

/**
 * Purely for convenience, an Event ("action") Creator ala Flux spec. Follow
 * guidelines for creating actions: https://github.com/acdlite/flux-standard-action
 */
export default {

  mutateSomeData(data) {
    return {
      type   : AppActionConstants.MUTATION_TYPE,
      payload: {
        data: data
      }
    };
  }

};
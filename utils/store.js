import { createStore } from 'redux';

const initialState = {
  event: {
    title: '',
    start: '',
    end: '',
    description: '',
  },
  uid: null,
  events: [],
};

function reducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_EVENT':
      return {
        ...state,
        event: action.payload,
      };
    case 'SET_UID':
      return {
        ...state,
        uid: action.payload,
      };
    case 'SET_EVENTS':
      return {
        ...state,
        events: action.payload,
      };
    default:
      return state;
  }
}

const store = createStore(reducer);

export default store;

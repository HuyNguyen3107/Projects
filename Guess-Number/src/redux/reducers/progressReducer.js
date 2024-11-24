const initialState = {
  width: 100,
  count: 1,
};

export const progressReducer = (state = initialState, action) => {
  switch (action.type) {
    case "progress/update": {
      return {
        ...state,
        width: ((action.payload - state.count) / action.payload) * 100,
        count: state.count + 1,
      };
    }
    case "progress/reset": {
      return { ...state, width: 100, count: 1 };
    }
    default: {
      return state;
    }
  }
};

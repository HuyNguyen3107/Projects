const initialState = {
  correctNum: 0,
  maxNum: 0,
};

export const randomReducer = (state = initialState, action) => {
  switch (action.type) {
    case "correct/random": {
      return {
        ...state,
        correctNum: Math.floor(Math.random() * (action.payload - 1 + 1) + 1),
        maxNum: action.payload,
      };
    }
    case "correct/update": {
      return {
        ...state,
        correctNum: Math.floor(Math.random() * (state.maxNum - 1 + 1) + 1),
      };
    }
    default: {
      return state;
    }
  }
};

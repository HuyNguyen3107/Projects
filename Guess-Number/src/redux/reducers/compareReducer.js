const initialState = {
  message: "Chào mừng bạn đến với trò chơi đoán số!",
  arr: [],
};

export const compareReducer = (state = initialState, action) => {
  switch (action.type) {
    case "compare": {
      return { ...state, message: action.payload };
    }
    case "compare/reset": {
      return {
        ...state,
        message: "Chào mừng bạn đến với trò chơi đoán số!",
        arr: [],
      };
    }
    case "compare/push": {
      return { ...state, arr: [...state.arr, action.payload] };
    }
    default: {
      return state;
    }
  }
};

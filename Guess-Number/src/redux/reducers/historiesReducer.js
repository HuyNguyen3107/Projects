const initialState = {
  histories: localStorage.getItem("data")
    ? JSON.parse(localStorage.getItem("data"))
    : [],
  history: [],
  isDelete: false,
  isUpdate: false,
};

export const historiesReducer = (state = initialState, action) => {
  switch (action.type) {
    case "histories/update": {
      state.histories.unshift(action.payload);
      localStorage.setItem("data", JSON.stringify(state.histories));
      return { ...state, histories: state.histories };
    }
    case "histories/clear": {
      localStorage.removeItem("data");
      return { ...state, histories: [] };
    }
    case "histories/add": {
      return { ...state, history: [...state.history, action.payload] };
    }
    case "histories/remove": {
      return { ...state, history: [] };
    }
    case "delete/toggle": {
      return { ...state, isDelete: !state.isDelete };
    }
    case "update": {
      return { ...state, isUpdate: !state.isUpdate };
    }
    default: {
      return state;
    }
  }
};

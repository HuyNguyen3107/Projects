const initialState = {
  maxValue: localStorage.getItem("range_number")
    ? localStorage.getItem("range_number")
    : "614",
};

export const rangeReducer = (state = initialState, action) => {
  switch (action.type) {
    case "change/value": {
      return {
        ...state,
        maxValue: Math.floor((action.payload / 100) * 2048),
      };
    }
    default: {
      return state;
    }
  }
};

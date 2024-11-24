const initialState = {
  maxTimes: localStorage.getItem("maxTimes")
    ? localStorage.getItem("maxTimes")
    : 10,
  maxNum: 614,
};

export const timesPlayReducer = (state = initialState, action) => {
  switch (action.type) {
    case "update/times": {
      localStorage.setItem("maxTimes", Math.ceil(Math.log2(action.payload)));
      return {
        ...state,
        maxTimes: Math.ceil(Math.log2(action.payload)),
        maxNum: action.payload,
      };
    }
    default: {
      return state;
    }
  }
};

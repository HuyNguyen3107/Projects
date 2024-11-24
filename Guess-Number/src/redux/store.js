import { combineReducers, legacy_createStore as createStore } from "redux";
import { rangeReducer } from "./reducers/rangeReducer";
import { timesPlayReducer } from "./reducers/timesPlayReducer";
import { remainTimesReducer } from "./reducers/remainReducer";
import { progressReducer } from "./reducers/progressReducer";
import { randomReducer } from "./reducers/randomReducer";
import { compareReducer } from "./reducers/compareReducer";
import { historiesReducer } from "./reducers/historiesReducer";
const rootReducer = combineReducers({
  range: rangeReducer,
  timesPlay: timesPlayReducer,
  remain: remainTimesReducer,
  progress: progressReducer,
  random: randomReducer,
  compare: compareReducer,
  histories: historiesReducer,
});
export const store = createStore(rootReducer);

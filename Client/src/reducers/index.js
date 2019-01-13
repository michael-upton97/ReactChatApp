import { combineReducers } from 'redux';

import Prss from './Prss';
import Msgs from './Msgs';
import Cnvs from './Cnvs';
import Errs from './Errs';

const rootReducer = combineReducers({Errs, Prss, Cnvs, Msgs});

export default rootReducer;



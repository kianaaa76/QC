import {
  LOGIN,
  LOGOUT,
  GET_TABS,
  SET_SELECTED_PRODUCT_LINE
} from '../actions/types';

const INITIAL_STATE = {
  access_token: '',
  refresh_token: '',
  userRole:'',
  tabs: [],
  selectedProductLineOfErrorTab: ''
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        access_token: action.access_token,
        refresh_token: action.refresh_token
      };
    case LOGOUT:
      return {
        ...state,
        access_token: '',
        refresh_token: ''
      };
    case GET_TABS:
      return {
        ...state,
        tabs: action.tabs
      };
    case SET_SELECTED_PRODUCT_LINE:
      return {
        ...state,
        selectedProductLineOfErrorTab: action.selectedProductLineOfErrorTab
      };
    default:
      return state;
  }
};

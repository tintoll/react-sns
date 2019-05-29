// dummny
const dummyUser = {
  nickname : '틴톨',
  Post : [],
  Followings : [],
  Followers  : []
}


// 초기 state
export const initialState = {
  isLoggedIn : false,
  user : null,
  signUpData : {},
  loginData : {}
}

// 액션 정의
export const SIGN_UP = 'SIGN_UP';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const LOGIN_IN = 'LOGIN_IN';
export const LOGIN_IN_SUCCESS = 'LOGIN_IN_SUCCESS';
export const LOGIN_IN_FAILURE = 'LOGIN_IN_FAILURE';
export const LOG_OUT = 'LOG_OUT';

// 액션 생성 함수 
export const signUp = (data) => {
  return {
    type : SIGN_UP,
    data : data
  }
}
export const signUpSuccess = (data) => {
  return {
    type: SIGN_UP_SUCCESS,
  }
}
export const loginAction = (data) => {
  return {
    type: LOGIN_IN,
    data
  }
}
export const logoutAction = (data) => {
  return {
    type: LOG_OUT,
  }
}
// 리듀서 
export default (sate=initialState, action) => {
  switch (action.type) {
    case LOGIN_IN:
      return {
        ...state,
        isLoggedIn : true,
        user: dummyUser,
        loginData : action.data
      };
    case LOGIN_OUT:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
      };
    case SIGN_UP:
      return {
        ...state,
        signUpData: action.data
      };  
    default:
      return Object.assign({}, state);
  }
}
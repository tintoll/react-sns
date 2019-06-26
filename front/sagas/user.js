import { all , fork, takeLatest, takeEvery, call, put, take, delay } from "redux-saga/effects";
import axios from "axios";
import 
{ 
  SIGN_UP_REQUEST, SIGN_UP_SUCCESS, SIGN_UP_FAILURE,
  LOGIN_IN_SUCCESS, LOGIN_IN_FAILURE, LOGIN_IN_REQUEST,
  LOG_OUT_SUCCESS, LOG_OUT_FAILURE, LOG_OUT_REQUEST,
  LOAD_USER_SUCCESS, LOAD_USER_FAILURE, LOAD_USER_REQUEST,
} from "../reducers/user";

// 설정을 해놓으면 어느곳에서든 axios를 사용하면 기본 URL이 붙어서 호출이 된다. 
axios.defaults.baseURL = 'http://localhost:3065/api';


// saga 생성 패턴을 이용해서 작성할수 있다.
// API 요청하는 함수 
function signUpAPI(signUpData) {
  return axios.post('/user', signUpData);
}
// 실제 saga 로직
function* signUp(action) {
  try {
    // API 호출 
    yield call(signUpAPI, action.data);
    // 성공 했을때 액션을 실행 
    yield put({
      type: SIGN_UP_SUCCESS,
    });

  } catch(e) {
    // put은 액션을 dispatch하는 것과 동일하다.
    // SIGN_UP_FAILURE액셜을 실행한다. 
    yield put({
      type:SIGN_UP_FAILURE,
      error : e
    })
    
  }
}
// signUp Action을 대기 하는 함수 
function* watchSignUp() {
  // SIGN_UP_REQUEST액션이 들어오면 signUp함수를 실행 시켜줍니다.
  yield takeEvery(SIGN_UP_REQUEST, signUp);
}



/////// 로그인 ///////////
function loginAPI(loginData) {
  // 서버에 요청을 보내는 부분
  return axios.post('/user/login', loginData, {
    withCredentials : true, // 이 부분을 해줘야 프론트에서 쿠키에 저장이 된다.
  });
}
function* login(action) {
  try {
    const result = yield call(loginAPI, action.data);
    yield put({ // put은 dispatch 동일
      type: LOGIN_IN_SUCCESS,
      data : result.data
    });
  } catch (e) { // loginAPI 실패
    yield put({
      type: LOGIN_IN_FAILURE,
    });
  }
}
function* watchLogin() {
  yield takeEvery(LOGIN_IN_REQUEST, login);
}



///  로그 아웃 
function logoutAPI() {
  return axios.post('/user/logout', {}, {
    withCredentials : true, 
  });
}
function* logout() {
  try {
    yield call(logoutAPI);
    yield put({ 
      type: LOG_OUT_SUCCESS,
    });
  } catch (e) { 
    yield put({
      type: LOG_OUT_FAILURE,
    });
  }
}
function* watchLogout() {
  yield takeEvery(LOG_OUT_REQUEST, logout);
}


/// 유저정보가지오기
function loadUserAPI() {
  // get은 데이터 부분이 필요없어서 2번째인자에 옵션이 들어간다.
  return axios.get('/user', {
    withCredentials : true, 
  });
}
function* loadUser() {
  try {
    const result = yield call(loadUserAPI);
    yield put({ 
      type: LOAD_USER_SUCCESS,
      data : result.data
    });
  } catch (e) { 
    yield put({
      type: LOAD_USER_FAILURE,
    });
  }
}
function* watchLoadUser() {
  yield takeEvery(LOAD_USER_REQUEST, loadUser);
}

export default function* userSaga() {
  yield all([
    fork(watchSignUp),
    fork(watchLogin),
    fork(watchLogout),
    fork(watchLoadUser),
  ]);
}
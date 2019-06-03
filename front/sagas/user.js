import { all , fork, takeLatest, takeEvery, call, put, take, delay } from "redux-saga/effects";
import axios from "axios";
import { SIGN_UP_REQUEST, SIGN_UP_SUCCESS, SIGN_UP_FAILURE, LOGIN_IN_SUCCESS, LOGIN_IN_FAILURE, LOGIN_IN_REQUEST } from "../reducers/user";

// saga 생성 패턴을 이용해서 작성할수 있다.
// API 요청하는 함수 
function signUpAPI() {
  return axios.post('/login');
}
// 실제 saga 로직
function* signUp() {
  try {
    // API 호출 
    // yield call(signUpAPI);
    yield delay(2000);
    // throw new Error('에러');

    // 성공 했을때 액션을 실행 
    yield put({
      type: SIGN_UP_SUCCESS,
    });

  } catch(e) {
    console.error(e);
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
function loginAPI() {
  // 서버에 요청을 보내는 부분
  return axios.post('/login');
}
function* login() {
  try {
    // yield call(loginAPI);
    yield delay(2000);
    yield put({ // put은 dispatch 동일
      type: LOGIN_IN_SUCCESS,
    });
  } catch (e) { // loginAPI 실패
    console.error(e);
    yield put({
      type: LOGIN_IN_FAILURE,
    });
  }
}
function* watchLogin() {
  yield takeEvery(LOGIN_IN_REQUEST, login);
}

export default function* userSaga() {
  yield all([
    fork(watchSignUp),
    fork(watchLogin)
  ]);
}
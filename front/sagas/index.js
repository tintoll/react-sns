import { all, fork } from 'redux-saga/effects';
import user from './user';
import post from './post';

// 비동기 처리들도 리듀서 같이 관련 작업끼리 파일을 만들고 
// index.js에서 이부분을 묶어주는 방식으로 관리하면 된다. 
export default function* rootSaga() {
  yield all([
    fork(user),
    fork(post),
  ]);
}
#### eslint 설정

```javascript
// .eslintrc
{
  "parserOptions" : {
    "ecmaVersion" : 2018,
    "sourceType" : "module",
    "ecmaFeatures" : {
      "jsx" : true
    }
  },
  "env" : {
    "browser" : true,
    "node" : true
  },
	// role 설정
  "extends" : [
    "eslint:recommended",  // eslint가 추천하는것들
    "plugin:react/recommended" // react에서 추천하는것들
  ],
	// eslint가 기본적으로 es6나 react를 지원하지 않기때문에 플러그인 추가 
  "plugins" : [
    "import",
    "react-hooks"
  ]
}

// 설치 패키지
$ npm i -D eslint eslint-plugin-import eslint-plugin-react eslint-plugin-react-hooks
```



##  Next

#### pages 폴더 구조

- next에서는 pages파일을 만들면 자동으로 router적용이 되면서 code spliting과 server side rendering이 적용된다. 
  - pages/index.js -> http://localhost:3000/
  - pages/about.js -> http://localhost:3000/about
  - pages/user/create.js -> http://localhost:3000/user/create

#### Link 사용 방법 

```javascript
import Link from "next/link";

// Link 컴포넌트를 가져와서 자식 컴포넌트로 a컴포넌트를 주고 href속성에 주소를 작성 해주면 된다.
<Link href="/about">
  <a>about</a>
</Link>
<Link href="/user/create">
  <a>create</a>
</Link>

```

#### Head 사용법

- next에서 head 태그에서 사용되는 값들을 사용하기 위해서는 Head컴포넌트를 이용한다.

```javascript
import Head from "next/head";

// Head컴포넌트 안에 head태그에 넣어줄 태그들을 기술하면 된다. 
<Head>
  <title>NodeBird</title>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css"/>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.js" />
</Head>
```



#### _app.js 사용 용도

- head태그 같이 공통으로 모든 페이지에 사용되는 요소들이 있다. 이런 공통 요소들을 처리할때 _app.js를 사용한다. 

- pages/_app.js 로 파일을 만들어 공통 요소 컴포넌트를 작성하면 다른 페이지에서는 이부분이 무조건 적용되어 나타나게 된다. 

  ```javascript
  import React from 'react';
  import Head from 'next/head';
  import PropTypes from 'prop-types';
  import AppLayout from '../components/AppLayout';
  
  // 무조건 Component props로 넘어온다. 
  // 사용시 <Component /> 로 사용해야 합니다. 
  // eslint 사용시 타입에러가 나기때문에 propTypes를 설정해주어야 한다. 
  const NodeSNS = ({Component}) => {
    return (
      <>
        <Head>
          <title>NodeBird</title>
          <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css"
          />
          <script src="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.js" />
        </Head>
        <AppLayout>
          <Component />
        </AppLayout>
      </>
    );
  };
  
  NodeSNS.propTypes = {
    Component : PropTypes.elementType
  }
  
  export default NodeSNS;
  ```




#### next에서 Redux 설정

next에서 Redux를 사용하기 위해서는 기존 패키지 외에 추가 패키지가 필요하다.

```javascript
// 패키지 설치 
$ npm i redux react-redux next-redux-wrapper

// _app.js
import { applyMiddleware, compose, createStore } from "redux";
import { Provider } from "react-redux";
import withRedux from 'next-redux-wrapper';
import reducer from '../reducers';

...

// withRedux 함수안에 redux관련 설정을 해줘야 한다. 마지막에 생성된 store를 리턴 시켜줘야한다. 
export default withRedux((initialState, options) => {
  const middleware = [];
  const enhancer = compose(
    applyMiddleware(...middleware),
    !options.isServer && window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined' ? window.__REDUX_DEVTOOLS_EXTENSION__() : (f) => f,
  )
  const store = createStore(reducer, initialState, enhancer);
  return store;
})(NodeSNS);
```



#### react-redux hooks 사용

```javascript
// react-redux -> ^7.1.0-alpha.4 버전부터 hooks를 제공한다. 

// useSelect는 mapStateToProps역할을 useDispatch는 mapDispatchToProps역할을 한다. 
import { useSelector, useDispatch } from "react-redux";
const {user} = useSelector(state => state.user);
const dispatch = useDispatch();
```





## redux-saga 적용



1. rootSaga 생성 

```javascript
// sagas/index.js
import { all, fork } from 'redux-saga/effects';
import user from './user';
import post from './post';

// 비동기 처리들도 리듀서 같이 관련 작업끼리 파일을 만들고 
// index.js에서 이부분을 묶어주는 방식으로 관리하면 된다. 
export default function* rootSaga() {
  yield all([
    forl(user),
    fork(post),
  ]);
}

// sagas/user.js
import { all , fork } from "redux-saga/effects";
export default function* userSaga() {
  yield all([
  ]);
}

// sagas/post.js
import { all, fork } from "redux-saga/effects";
export default function* postSaga() {
  yield all([
  ]);
};
```

2. next에서 saga 미들웨어 적용

```javascript
// pages/_app.js

export default withRedux((initialState, options) => {
  // 1.미들웨어 생성
  const sagaMiddleware = createSagaMiddleware();
  
  const middlewares = [sagaMiddleware];
  // 2.리덕스 store에 미들웨어 적용 
  const enhancer = compose(
    applyMiddleware(...middlewares));
  const store = createStore(reducer, initialState, enhancer);
  
  // 3.rootSaga 실행
  sagaMiddleware.run(rootSaga);
  return store;
})(NodeBird);
```



#### reducer Action 정의 

비동기 관련 해서 액션을 정의할때 3가지를 기본으로 정의 할수 있겠다.

request, success, failure

```javascript
// 회원가입
export const SIGN_UP_REQUEST = 'SIGN_UP_REQUEST';
export const SIGN_UP_SUCCESS = 'SIGN_UP_SUCCESS';
export const SIGN_UP_FAILURE = 'SIGN_UP_FAILURE';
// 로그인
export const LOGIN_IN_REQUEST = 'LOGIN_IN_REQUEST';
export const LOGIN_IN_SUCCESS = 'LOGIN_IN_SUCCESS';
export const LOGIN_IN_FAILURE = 'LOGIN_IN_FAILURE';

export default (state=initialState, action) => {
  switch (action.type) {
    case LOG_IN_REQUEST: {
      return {
        ...state,
        isLoggingIn: true,
        logInErrorReason: '',
      };
    }
    case LOG_IN_SUCCESS: {
      return {
        ...state,
        isLoggingIn: false,
        isLoggedIn: true,
        me: dummyUser,
        isLoading: false,
      };
    }
    case LOG_IN_FAILURE: {
      return {
        ...state,
        isLoggingIn: false,
        isLoggedIn: false,
        logInErrorReason: action.error,
        me: null,
      };
    }
    case LOG_OUT_REQUEST: {
      return {
        ...state,
        isLoggedIn: false,
        me: null,
      };
    }
    case SIGN_UP_REQUEST: {
      return {
        ...state,
        isSigningUp: true,
        isSignedUp: false,
        signUpErrorReason: '',
      };
    }
    case SIGN_UP_SUCCESS: {
      return {
        ...state,
        isSigningUp: false,
        isSignedUp: true,
      };
    }
    case SIGN_UP_FAILURE: {
      return {
        ...state,
        isSigningUp: false,
        signUpErrorReason: action.error,
      };
    }  
    default:
      return {
        ...state
      };
  }
}
```





#### saga 생성 패턴

```javascript
import { all , fork, takeLatest, takeEvery, call, put, take, delay } from "redux-saga/effects";
import axios from "axios";
import { SIGN_UP_REQUEST, SIGN_UP_SUCCESS, SIGN_UP_FAILURE } from "../reducers/user";

// 1. API 요청하는 함수 
function signUpAPI() {
  return axios.post('/login');
}
// 2.실제 saga 로직
function* signUp() {
  try {
    // API 호출 
    yield call(signUpAPI);
   
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
// 3. signUp Action을 대기 하는 함수 
function* watchSignUp() {
  // SIGN_UP_REQUEST액션이 들어오면 signUp함수를 실행 시켜줍니다.
  yield takeEvery(SIGN_UP_REQUEST, signUp);
}

export default function* userSaga() {
  // 비동기 호출 
  yield all([
    fork(watchSignUp),
  ]);
}
```


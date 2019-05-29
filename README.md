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


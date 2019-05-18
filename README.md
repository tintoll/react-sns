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






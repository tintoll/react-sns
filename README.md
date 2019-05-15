# react-sns

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

  "extends" : [
    "eslint:recommended",  // eslint가 추천하는것들
    "plugin:react/recommended" // react에서 추천하는것들
  ],

  "plugins" : [
    "import",
    "react-hooks"
  ]
}

// 설치 패키지
$ npm i -D eslint eslint-plugin-import eslint-plugin-react eslint-plugin-react-hooks
```
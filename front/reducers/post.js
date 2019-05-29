export const initialState = {
  mainPosts : [
    {
      User : {
        id : 1,
        nickname : '틴톨',
      },
      content : '첫번째 게시글',
      img: 'https://bookthumb-phinf.pstatic.net/cover/137/995/13799585.jpg?udate=20180726',
    }
  ],
  imagePaths : [],
}

// 액션들
const ADD_POST = 'ADD_POST';
const ADD_DUMMY = 'ADD_DUMMY';

// 액션 생성 함수 
// 데이터가 없어서 함수가 아닌 객체를 보내준다. 
const addPost = {
  type : ADD_POST
}
const addDummy = {
  type : ADD_DUMMY,
  data : {
    content : 'hello',
    UserId : 1,
    User : {
      nickname : '틴톨'
    }
  }
}

// 리듀서 
export default (state=initialState, action) => {
  switch (action.type) {
    case ADD_POST:
      return {
        ...state,
      }
    case ADD_DUMMY:
      return {
        ...state,
        mainPosts : [action.data, ...state.mainPosts],
      }
    default:
      return {
        ...state
      }
  }
}
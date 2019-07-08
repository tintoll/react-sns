import React, {useEffect} from "react";
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { useSelector, useDispatch } from "react-redux";
import { LOAD_MAIN_POSTS_REQUEST } from "../reducers/post";

const Home = () => {
  // hooks를 이용하여 props데이터 가져오기 
  // mapStateToProps를  대체 하는게 useSelector이다. 
  const { me } = useSelector(state => state.user);
  const { mainPosts } = useSelector(state => state.post);
  const dispatch = useDispatch();

  return (
    <div>
      {me && <PostForm />}
      {mainPosts.map((c) => {
        return (
          <PostCard key={c} post={c} />
        );
      })}
    </div>
  );
};

Home.getInitialProps = async (context) => {
  console.log(Object.keys(context));
  context.store.dispatch({
    type : LOAD_MAIN_POSTS_REQUEST
  })
}

export default Home;

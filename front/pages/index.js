import React from "react";
import PostCard from '../components/PostCard';
import PostForm from '../components/PostForm';
import { useSelector } from "react-redux";

const Home = () => {
  // hooks를 이용하여 props데이터 가져오기 
  // mapStateToProps를  대체 하는게 useSelector이다. 
  const { isLoggedIn } = useSelector(state => state.user);
  const { mainPosts } = useSelector(state => state.post);
  return (
    <div>
      {isLoggedIn && <PostForm />}
      {mainPosts.map((c) => {
        return (
          <PostCard key={c} post={c} />
        );
      })}
    </div>
  );
};

export default Home;

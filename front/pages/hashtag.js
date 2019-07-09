import React, {useEffect, useCallback} from 'react';
import PropTypes from 'prop-types';
import {useSelector, useDispatch} from 'react-redux';
import { LOAD_HASHTAG_POSTS_REQUEST} from '../reducers/post';
import PostCard from '../components/PostCard'

const Hashtag = ({ tag }) => {

  const { mainPosts, hasMorePost } = useSelector(state => state.post);
  const dispatch = useDispatch();
  
  const onScroll = useCallback( () => {
    if(window.scrollY + document.documentElement.clientHeight > document.documentElement.scrollHeight - 300) {
      if(hasMorePost) {
        dispatch({
          type : LOAD_HASHTAG_POSTS_REQUEST,
          lastId : mainPosts[mainPosts.length -1].id,
          data : tag,
        })
      }
    }
  },[hasMorePost, mainPosts.length]);

  useEffect(() => {
    window.addEventListener('scroll', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
    }
  }, [mainPosts.length]);

  return (
    <div>
      {mainPosts.map(c => (
        <PostCard key={+c.createdAt} post={c} /> 
      ))}
    </div>
  )
}

Hashtag.propTypes = {
  tag : PropTypes.string.isRequired,
}

Hashtag.getInitialProps = async (context) => {
  console.log('Hashtag getInitialProps :', context);
  const tag = context.query.tag;
  context.store.dispatch({
    type : LOAD_HASHTAG_POSTS_REQUEST,
    data : tag,
  });

  return { tag};
}
export default Hashtag;
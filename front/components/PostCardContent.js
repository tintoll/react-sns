import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

const PostCardContent = ({postData}) => {
  return (
    <div>
      {
        // /(#[^\s]+)/g는 해시태를 포함한 배열을 만들어준다. 
        postData.split(/(#[^\s]+)/g).map(v => {
          // 해시태그이면 링크로 변경해준다.
          if (v.match(/#[^\s]+/)) {
            return (
              <Link
                href={{ pathname: '/hashtag', query: { tag: v.slice(1) } }}
                as={`/hashtag/${v.slice(1)}`}
                key={v}><a>{v}</a></Link>
            );
          }
          return v;
        })}
    </div>
  );
}

PostCardContent.propTypes = {
  postData : PropTypes.string.isRequired
}


export default PostCardContent;

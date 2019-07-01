import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Icon, Button, Avatar, Form, Input, List, Comment } from "antd";
import PropTypes from "prop-types";
import Link from 'next/link';
import { ADD_COMMENT_REQUEST, LOAD_COMMENTS_REQUEST } from "../reducers/post";
import PostImages from './PostImages';

const PostCard = ({ post }) => {
  const [commentFormOpened, setCommentFormOpened] = useState(false);
  const [commentText, setCommentText] = useState("");
  const { me } = useSelector(state => state.user);
  const { commentAdded, isAddingComment } = useSelector(state => state.post);
  const dispatch = useDispatch();

  const onToggleComment = useCallback(() => {
    setCommentFormOpened(prev => !prev);
    // 댓글 창을 열면서 데이터를 가져옵니다. 
    if (!commentFormOpened) {
      dispatch({
        type: LOAD_COMMENTS_REQUEST,
        data: post.id,
      });
    }
  }, []);

  const onSubmitComment = useCallback(
    e => {
      e.preventDefault();
      if (!me) {
        return alert("로그인이 필요합니다.");
      }
      return dispatch({
        type: ADD_COMMENT_REQUEST,
        data: {
          postId: post.id,
          content: commentText,
        }
      });
    },
    [me && me.id, commentText]
  );

  useEffect(() => {
    setCommentText("");
  }, [commentAdded === true]);

  const onChangeCommentText = useCallback(e => {
    setCommentText(e.target.value);
  }, []);

  return (
    <div>
      <Card
        key={+post.createdAt}
        cover={post.Images && post.Images[0] && <PostImages images={post.Images} />}
        actions={[
          <Icon type="retweet" key="retweet" />,
          <Icon type="heart" key="heart" />,
          <Icon type="message" key="message" onClick={onToggleComment} />,
          <Icon type="ellipsis" key="ellipsis" />
        ]}
        extra={<Button>팔로우</Button>}
      >
        <Card.Meta
          avatar={(
            <Link
              href={{ pathname: '/user', query: { id: post.User.id } }}
              as={`/user/${post.User.id}`}
            >
            <a><Avatar>{post.User.nickname[0]}</Avatar></a>
          </Link>
          )}
          title={post.User.nickname}
          description={(
            <div>
              { 
                // /(#[^\s]+)/g는 해시태를 포함한 배열을 만들어준다. 
                post.content.split(/(#[^\s]+)/g).map( v => {
                  // 해시태그이면 링크로 변경해준다.
                  if(v.match(/#[^\s]+/)) {
                    return (
                      <Link 
                        href={{ pathname : '/hashtag', query : {tag : v.slice(1)} }} 
                        as={`/hashtag/${v.slice(1)}`}
                        key={v}><a>{v}</a></Link>
                    );
                  }
                return v;
              })}
            </div>
          )}
        />
      </Card>
      {commentFormOpened && (
        <>
          <Form onSubmit={onSubmitComment}>
            <Form.Item>
              <Input.TextArea
                rows={4}
                value={commentText}
                onChange={onChangeCommentText}
              />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={isAddingComment}>
              삐약
            </Button>
          </Form>
          <List
            header={`${post.Comments ? post.Comments.length : 0} 댓글`}
            itemLayout="horizontal"
            dataSource={post.Comments || []}
            renderItem={item => (
              <li>
                <Comment
                  author={item.User.nickname}
                  avatar={(
                    <Link href={{ pathname: '/user', query: { id: item.User.id } }} as={`/user/${item.User.id}`}>
                      <a><Avatar>{item.User.nickname[0]}</Avatar></a>
                    </Link>
                  )}
                  content={item.content}
                />
              </li>
            )}
          />
        </>
      )}
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    User: PropTypes.object,
    content: PropTypes.string,
    img: PropTypes.string,
  }).isRequired,
};

export default PostCard;

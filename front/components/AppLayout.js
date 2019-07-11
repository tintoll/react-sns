import React, {useEffect} from "react";
import Link from "next/link";
import { Menu, Input,  Row, Col } from "antd";
import PropTypes from 'prop-types';
import UserProfile from './UserProfile';
import LoginForm from './LoginForm';
import { useSelector, useDispatch } from "react-redux";
import {LOAD_USER_REQUEST} from '../reducers/user';
import Router from "next/router";

const AppLayout = ({ children}) => {

  const {  me } = useSelector(state => state.user);
  const dispatch = useDispatch();

  // 첫페이지에서 유저가없으면 정보를 요청한다. 
  useEffect( () => {
    if(!me) {
      dispatch({
        type : LOAD_USER_REQUEST
      })
    }
  }, []);
  const onSearch = (value) => {
    Router.push({pathname : '/hashtag', query:{tag:value}}, `/hashtag/${value}`);
  }

  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item key="home">
          <Link href="/">
            <a>노드버드</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="profile">
          <Link href="/profile" prefetch>
            <a>프로필</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="mail">
          <Input.Search enterButton style={{ verticalAlign: "middle" }} onSearch={onSearch}/>
        </Menu.Item>
      </Menu>
      
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {me ? <UserProfile /> : <LoginForm />}
        </Col>
        <Col xs={24} md={12}>
          {children}
        </Col>
        <Col xs={24} md={6}>
          <Link href="https://www.naver.com" ><a target="_blank">네이버</a></Link>
        </Col>
      </Row>

    </div>
  );
};

AppLayout.propTypes = {
  children : PropTypes.node
}

export default AppLayout;

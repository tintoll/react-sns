import React from "react";
import Link from "next/link";
import { Menu, Input, Button, Row, Col } from "antd";
import PropTypes from 'prop-types';
import UserProfile from './UserProfile';
import LoginForm from './LoginForm';


const dummy = {
  nickname: '틴톨',
  Post: [],
  Followings: [],
  Followers: [],
  isLoggedIn: false,
};

const AppLayout = ({ children }) => {
  return (
    <div>
      <Menu mode="horizontal">
        <Menu.Item key="home">
          <Link href="/">
            <a>노드버드</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="profile">
          <Link href="/profile">
            <a>프로필</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="mail">
          <Input.Search enterButton style={{ verticalAlign: "middle" }} />
        </Menu.Item>
      </Menu>
      
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {dummy.isLoggedIn ? <UserProfile dummy={dummy}/> : <LoginForm />}
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

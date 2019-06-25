import React, {useCallback} from 'react';
import { Avatar, Card, Button } from 'antd';
import { useSelector, useDispatch } from "react-redux";
import { LOGIN_IN_REQUEST } from '../reducers/user';


const UserProfile = () => {

  const {me} = useSelector(state => state.user);
  const dispatch = useDispatch();

  const onLogout = useCallback(() => {
    dispatch({
      type: LOGIN_IN_REQUEST
    });
  }, []);


  return (
    <Card
      actions={[
      ]}
    >
      <Card.Meta
        avatar={<Avatar>{me.nickname[0]}</Avatar>}
        title={me.nickname}
      />
      <Button onClick={onLogout}>로그아웃</Button>
    </Card>
  );
}

export default UserProfile;
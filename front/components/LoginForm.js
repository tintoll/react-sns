import React, { useCallback} from 'react'
import { Button, Form, Input } from 'antd';
import Link from 'next/link';
import { useInput } from '../pages/signup'; // TODO: util 폴더로 옮기기
import { useDispatch, useSelector } from "react-redux";
import { LOGIN_IN_REQUEST } from "../reducers/user";

const LoginForm = () => {
  const [id, onChangeId] = useInput('');
  const [password, onChangePassword] = useInput('');
  const dispatch = useDispatch();
  const { isLoggingIn } = useSelector(state => state.user);


  const onSubmitForm = useCallback((e) => {
    e.preventDefault();
    dispatch({
      type: LOGIN_IN_REQUEST,
      data : {
        userId : id,
        password
      }
    });
  }, [id, password]);
  // antd에서는 Button의 type을 htmlType="submit"로 정의해야 한다. type은 생삭용도로 사용한다.
  return (
    <Form onSubmit={onSubmitForm} style={{ padding: '10px' }}>
      <div>
        <label htmlFor="user-id">아이디</label>
        <br />
        <Input name="user-id" value={id} onChange={onChangeId} required />
      </div>
      <div>
        <label htmlFor="user-password">비밀번호</label>
        <br />
        <Input name="user-password" value={password} onChange={onChangePassword} type="password" required />
      </div>
      <div style={{ marginTop: '10px' }}>
        <Button type="primary" htmlType="submit" loading={isLoggingIn}>로그인</Button>
        <Link href="/signup"><a><Button>회원가입</Button></a></Link>
      </div>
    </Form>
  );
}

export default LoginForm;
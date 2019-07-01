import React, { useCallback, useState, useEffect, useRef} from 'react';
import {Form, Input, Button} from 'antd';
import { useSelector, useDispatch } from "react-redux";
import { ADD_POST_REQUEST, UPLOAD_IMAGES_REQUEST, REMOVE_IMAGE } from "../reducers/post";


const PostForm = () => {
  const [text, setText] = useState('');
  const imageInput =  useRef();

  const dispatch = useDispatch();
  const {imagePaths, isAddingPost, postAdded } = useSelector(state => state.post);

  useEffect(() => {
    setText('');
  }, [postAdded === true]);

  const onChangeText = useCallback((e) => {
    setText(e.target.value);
  }, []);
  const onSubmitForm = useCallback((e) => {
    e.preventDefault();
    if(!text || !text.trim()) {
      return alert('게시글 내용을 입력하여 주세요');  // return 안하면 아래가 실행됨.
    }
    dispatch({
      type : ADD_POST_REQUEST,
      data : {
        content : text.trim(),
      }
    });
  }, [text]);

  const onChangeImages = useCallback( (e) => {
    console.log(e.target.files);
    const imageFormData = new FormData();
    [].forEach.call(e.target.files, (f) => {
      imageFormData.append('image', f);
    });

    dispatch({
      type : UPLOAD_IMAGES_REQUEST,
      data : imageFormData
    });

  }, []);
  const onClickImageUpload = useCallback(() => {
    imageInput.current.click();
  }, [imageInput.current]);

  const onRemoveImage = useCallback( index => () => {
    dispatch({
      type : REMOVE_IMAGE,
      index,
    })
  });

  return (
    <Form style={{ margin: '10px 0 20px' }} 
      encType="multipart/form-data" onSubmit={onSubmitForm}>
      <Input.TextArea maxLength={140} 
        placeholder="어떤 신기한 일이 있었나요?"
        onChange={onChangeText} 
        value={text}  
      />
      <div>
        <input type="file" multiple hidden ref={imageInput} onChange={onChangeImages} />
        <Button onClick={onClickImageUpload}>이미지 업로드</Button>
        <Button type="primary" style={{ float: 'right' }} htmlType="submit" loading={isAddingPost}>짹짹</Button>
      </div>
      <div>
        {imagePaths.map((v, i) => {
          return (
            <div key={v} style={{ display: 'inline-block' }}>
              <img src={'http://localhost:3065/' + v} style={{ width: '200px' }} alt={v} />
              <div>
                <Button onClick={onRemoveImage(i)}>제거</Button>
              </div>
            </div>
          )
        })}
      </div>
    </Form>
  );
}

export default PostForm;
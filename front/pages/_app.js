import React from 'react';
import Head from 'next/head';
import PropTypes from 'prop-types';
import AppLayout from '../components/AppLayout';

import { applyMiddleware, compose, createStore } from "redux";
import { Provider } from "react-redux";
import withRedux from 'next-redux-wrapper';
import reducer from '../reducers';


const NodeSNS = ({Component}) => {
  return (
    <>
      <Head>
        <title>NodeBird</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.css"
        />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/antd/3.16.2/antd.js" />
      </Head>
      <AppLayout>
        <Component />
      </AppLayout>
    </>
  );
};

NodeSNS.propTypes = {
  Component : PropTypes.elementType
}

export default NodeSNS;
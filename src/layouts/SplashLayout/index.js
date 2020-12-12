import React, { useState, useEffect } from 'react';
import { colors } from '@material-ui/core';
import { checkToken } from '../../redux/actions/api';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LOGOUT, GET_TABS } from '../../redux/actions/types';

const Splash = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const selector = useSelector(state => state);
  useEffect(() => {
    if (!!selector.access_token) {
      checkToken(selector.access_token).then(data => {
        console.warn('DDDD', data);
        if (data.statusCode == 200) {
          dispatch({
            type: GET_TABS,
            tabs: data.data
          });
          navigate('/app');
        } else {
          dispatch({
            type: LOGOUT
          });
          navigate('/main/login');
        }
      });
    } else {
      navigate('/main/login');
    }
  }, []);
  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: colors.indigo[500],
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <h1
        style={{
          textAlign: 'center',
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)'
        }}
      >
        <b>
          <big>QC</big>
        </b>
      </h1>
    </div>
  );
};

export default Splash;

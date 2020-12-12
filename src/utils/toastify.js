import React from 'react';
import { toast, Slide } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { css } from 'glamor';

const options = {
  position: toast.POSITION.BOTTOM_LEFT,
  autoClose: 3000,
  transition: Slide
};
toast.configure();

export default {
  success(message, details, subtitle) {
    return toast.success(
      <Toaster message={message} subtitle={subtitle} details={details} />,
      {
        ...options,
        className: css({
          background: '#85EAA2 !important',
          color: '#222f3e !important'
        }),
        progressClassName: css({
          background: '#A4EAB8 !important'
        })
      }
    );
  },
  error(message, details, subtitle) {
    return toast.error(
      <Toaster message={message} subtitle={subtitle} details={details} />,
      {
        ...options,
        className: css({
          background: '#FC5858 !important',
          color: '#222f3e !important'
        }),
        progressClassName: css({
          background: '#E66F6A !important'
        })
      }
    );
  },
  warn(message, details, subtitle) {
    return toast.warn(
      <Toaster message={message} subtitle={subtitle} details={details} />,
      {
        ...options,
        className: css({
          background: '#fedb9b !important',
          color: '#84dcc6 !important'
        }),
        progressClassName: css({
          background: '#ffe9b7 !important'
        })
      }
    );
  },
  info(message, details, subtitle) {
    return toast.info(
      <Toaster message={message} subtitle={subtitle} details={details} />,
      {
        ...options,
        className: css({
          background: '#84dcc6 !important',
          color: '#222f3e !important'
        }),
        progressClassName: css({
          background: '#A5FFD6 !important'
        })
      }
    );
  }
};

const Toaster = ({ message, subtitle, details }) => {
  return (
    <div style={{padding:5}}>
      <h5 className="toastify-header" style={{color:"#000", textAlign:"right"}}>{message}</h5>
      <div className="toastify-body">
        <span>{subtitle}</span>
        <span>{details}</span>
      </div>
    </div>
  );
};

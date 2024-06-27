// CustomScrollbars.js
import React from 'react';
import { Scrollbars } from 'react-custom-scrollbars-2';

const CustomScrollbars = ({ children, style }) => (
  <Scrollbars
    renderThumbVertical={({ style, ...props }) =>
      <div {...props} style={{ ...style, backgroundColor: '#002B5C', borderRadius: '4px' }} />
    }
    renderThumbHorizontal={({ style, ...props }) =>
      <div {...props} style={{ ...style, backgroundColor: '#002B5C', borderRadius: '4px' }} />
    }
    renderTrackVertical={({ style, ...props }) =>
      <div {...props} style={{ ...style, width: '6px', right: '2px', bottom: '2px', top: '2px', borderRadius: '3px' }} />
    }
    renderTrackHorizontal={({ style, ...props }) =>
      <div {...props} style={{ ...style, height: '6px', left: '2px', right: '2px', bottom: '2px', borderRadius: '3px' }} />
    }
    style={{ ...style, width: '100%', height: '100%' }}
  >
    {children}
  </Scrollbars>
);

export default CustomScrollbars;

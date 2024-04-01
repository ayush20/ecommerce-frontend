import React, { useEffect, useState, useRef } from 'react';
import { ColorRing } from  'react-loader-spinner'
function SpinnerLoader() {
  return (
    <>
      <div className='parentDisable' width="100%">
          <div className='overlay-box'>
            <ColorRing
              visible={true}
              height="80"
              width="80"
              ariaLabel="blocks-loading"
              wrapperStyle={{}}
              wrapperClass="blocks-wrapper"
              colors={['#ed1c24', '#ed1c24', '#ed1c24', '#ed1c24', '#ed1c24']}
            />
          </div>
        </div>
    </>
  );
}
export default SpinnerLoader;

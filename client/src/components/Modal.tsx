import Card from './Card';
import React from 'react';

const Modal = ({
  state = false,
  setter,
  allowAnimations = false,
  scheme,
  children,
}) => {
  return (
    <>
      {state && (
        <div
          onClick={setter}
          className="z-50 fixed end-0 top-0 grid place-content-center w-full min-h-full bg-black/30"
        >
          <Card
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="relative"
            scheme={scheme}
          >
            <div
              className={
                (allowAnimations ? 'animate-fadeIn ' : '') +
                  ' relative grid grid-cols-2 gap-3 overflow-hidden max-w-xl'
              }
            >
              {children}
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default Modal;

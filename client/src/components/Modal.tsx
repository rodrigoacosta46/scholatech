import Card from './Card';

const Modal = ({
  state = false,
  setter,
  scheme,
  children,
  cardStyles=''
}) => {
  return (
    <>
      {state && (
        <div
          role="dialog"
          onClick={setter}
          className="z-50 fixed end-0 top-0 grid place-content-center w-full min-h-svh bg-black/30"
        >
          <Card
            onClick={(e) => {
              e.stopPropagation();
            }}
            className={`relative grid grid-cols-2 gap-3 overflow-hidden max-w-xl ${cardStyles}`}
            scheme={scheme}
          >
            {children}
          </Card>
        </div>
      )}
    </>
  );
};

export default Modal;

const onWindowKeyDown = (event, callback) => {
  if (event.defaultPrevented) {
    return;
  }

  if (event.key === 'Escape') {
    callback();
  }
};

const onWindowClick = (event, callback) => {
  if (event.defaultPrevented) {
    return;
  }

  callback();
};

const onWindowTouchEnd = (event, callback) => {
  if (event.defaultPrevented) {
    return;
  }

  callback();
};

export const windowEventHandler = {
  'click': onWindowClick,
  'keydown': onWindowKeyDown,
  'touchend': onWindowTouchEnd
};
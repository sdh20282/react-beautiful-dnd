// 윈도우에 등록될 이벤트 정의
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

export const windowEventHandler = {
  'click': onWindowClick,
  'keydown': onWindowKeyDown
};
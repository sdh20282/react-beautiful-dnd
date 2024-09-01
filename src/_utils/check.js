// 입력된 이벤트가 ctrl 키를 통한 이벤트인지 확인
const checkCtrlKey = (event) => {
  const isUsingWindows = navigator.platform.indexOf('Win') >= 0;

  return isUsingWindows ? event.ctrlKey : event.metaKey;
};

// 입력된 이벤트가 shift 키를 통한 이벤트인지 확인
const checkShiftUsed = (event) => {
  return event.shiftKey;
}

// 입력된 이벤트의 타입 반환
export const checkEventType = (event) => {
  if (checkCtrlKey(event)) {
    return 'ctrl';
  }

  if (checkShiftUsed(event)) {
    return 'shift';
  }

  return 'click';
}
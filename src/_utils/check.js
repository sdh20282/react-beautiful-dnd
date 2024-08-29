const checkCtrlKey = (event) => {
  const isUsingWindows = navigator.platform.indexOf('Win') >= 0;

  return isUsingWindows ? event.ctrlKey : event.metaKey;
};

const checkShiftUsed = (event) => {
  return event.shiftKey;
}

export const checkEventType = (event) => {
  if (checkCtrlKey(event)) {
    return 'ctrl';
  }

  if (checkShiftUsed(event)) {
    return 'shift';
  }

  return 'click';
}
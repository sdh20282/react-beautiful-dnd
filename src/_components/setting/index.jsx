import { useCallback, useEffect, useState } from 'react';

import * as s from './styles';

const Setting = ({
  description,
  addTitle,
  removeTitle,
  addCallback,
  removeCallback,
  type,
  settingType,
  setType,
  disableRemove = false
}) => {
  const [show, setShow] = useState(false);

  const toggleModal = useCallback(() => {
    setShow(s => !s);
    setType(type);
  }, []);

  const unShowModal = useCallback(() => {
    setShow(false);
  }, []);

  const onClickAdd = (event) => {
    addCallback(event);
  };

  const onClickRemove = (event) => {
    removeCallback(event);
  };

  useEffect(() => {
    window.addEventListener('click', unShowModal);

    return () => {
      window.removeEventListener('click', unShowModal);
    };
  }, []);

  useEffect(() => {
    if (settingType !== type) {
      setShow(false);
    }
  }, [type, settingType]);

  return (
    <s.ContainerStyle onClick={(event) => { event.stopPropagation() }}>
      <s.ToggleButtonStyle onClick={toggleModal} $clicked={show}>
        <span>{description}</span>
      </s.ToggleButtonStyle>
      {
        show &&
        <s.ModalStyle>
          <s.AddButtonStyle onClick={onClickAdd}>
            <span>{addTitle}</span>
          </s.AddButtonStyle>
          <s.RemoveButtonStyle onClick={onClickRemove} disabled={disableRemove}>
            <span>{removeTitle}</span>
          </s.RemoveButtonStyle>
        </s.ModalStyle>
      }
    </s.ContainerStyle>
  )
}

export { Setting };
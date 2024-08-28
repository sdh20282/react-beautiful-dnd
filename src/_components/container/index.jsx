import { Context } from "@components";

import * as s from "./styles";

const Container = () => {
  return (
    <s.ContainerStyle>
      <s.TitleStyle>React DnD using react-beautiful-dnd</s.TitleStyle>
      <Context />
    </s.ContainerStyle>
  )
}

export { Container };
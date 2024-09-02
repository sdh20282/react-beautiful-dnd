import { Context } from "@components";

import * as s from "./styles";

const Container = () => {
  return (
    <s.ContainerStyle>
      <header>
        <s.TitleStyle>React DnD using react-beautiful-dnd</s.TitleStyle>
      </header>
      <Context />
    </s.ContainerStyle>
  )
}

export { Container };
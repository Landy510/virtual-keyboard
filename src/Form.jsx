import { useState } from "react";
import CustomizedKeyboard from "./CustomizedKeyboard";
function Form() {
  const [formVal, setFormVal] = useState({
    name: "",
  });
  return (
    <>
      <p>Name: {formVal.name}</p>
      <CustomizedKeyboard setFormVal={setFormVal} />
    </>
  );
}

export default Form;

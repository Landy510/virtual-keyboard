import { useEffect, useMemo, useRef, useState } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import Input from "./components/Input/Input";

const isOneOfKeyBoardClassName = function check(className) {
  // 判斷被點擊的元素是否為虛擬鍵盤內的元素
  const simpleKeyboardMembersClassName = {
    "skb-input": "skb-input", // 需要虛擬鍵盤輸入內容的元素 className
  };

  return simpleKeyboardMembersClassName[className]
}

const CustomizedKeyboard = ({ setFormVal }) => {
  const [formData, setFormData] = useState({
    month: '',
    year: ''
  })
  const [isKeyboardShow, setIsKeyboardShow] = useState(false);
  const [keyboardLayoutName, setKeyboardLayoutName] = useState("default");
  const keyboardRef = useRef(null);

  const handleKeyPress = (button) => {
    if (button === "{lock}") {
      // 如果是點擊了 caps 按鈕，代表要切換大寫鍵盤或者小寫鍵盤
      setKeyboardLayoutName((prev) => {
        if (prev === "default") return "caps";
        return "default";
      });
    }
  };

  const handleInputChangeModule = useMemo(function updateInput() {
    let _key = '';
    const publicAPI = {
      changeKey(_target) {
        _key = _target;
      },
      handleChange(_val) {
        keyboardRef.current.setInput(_val);
        setFormData(prev => ({
          ...prev,
          [_key]: _val
        }))
      }
    }
    return publicAPI 
  }, [setFormData])

  useEffect(() => {
    document.addEventListener("click", documentClickEvt);

    function documentClickEvt(e) {      
      const virtualKeyBoardRowsAreaRef = keyboardRef.current.keyboardRowsDOM;
      const isTriggeredInKeyBoardRowsArea = virtualKeyBoardRowsAreaRef.contains(e.target)
      const isTriggeredBySecuredInputField = [...e.target.classList].filter(
            (className) => isOneOfKeyBoardClassName(className),
          ).length !== 0
      if(!isTriggeredInKeyBoardRowsArea && !isTriggeredBySecuredInputField){
        setIsKeyboardShow(false);
        setKeyboardLayoutName("default");
      }
    }    

    return () => document.removeEventListener("click", documentClickEvt);
  }, []);

  return (
    <div>
      <label htmlFor="month">
        month: 
        <Input
          type="text"
          id='month'
          inputFieldClassName="mb-1 skb-input"
          placeholder="please input content via virtual keyboard"
          inputMode="none"
          value={formData.month}
          onFocus={e => {
            handleInputChangeModule.changeKey('month');
            keyboardRef.current.setInput(e.target.value);
            setIsKeyboardShow(true)
          }}
          onChange={val => handleInputChangeModule.handleChange(val)}
        />
      </label>
      
      <label htmlFor="year">
        year: 
        <Input
          type="text"
          id='year'
          inputFieldClassName="mb-1 skb-input"
          placeholder="please input content via virtual keyboard"
          inputMode="none"
          value={formData.year}
          onFocus={e => {
            handleInputChangeModule.changeKey('year');
            keyboardRef.current.setInput(e.target.value);
            setIsKeyboardShow(true)
          }}
          onChange={val => handleInputChangeModule.handleChange(val)}
        />
      </label>

      <input />

      <div className={`keyboardAnimation ${isKeyboardShow ? "active" : ""}`}>
        <Keyboard
          baseClass="customizedKeyboard"
          keyboardRef={(ref) => {
            keyboardRef.current = ref;
            
          }}
          onChange={val => handleInputChangeModule.handleChange(val)}
          layoutName={keyboardLayoutName}
          onKeyPress={handleKeyPress}
          display={{
            "{bksp}": "⬅",
            "{lock}": "caps",
          }}
          layout={{
            default: [
              "1 2 3 4 5 6 7 8 9 0 {bksp}",
              "q w e r t y u i o p",
              "a s d f g h j k l",
              "{lock} z x c v b n m",
            ],
            caps: [
              "1 2 3 4 5 6 7 8 9 0 {bksp}",
              "Q W E R T Y U I O P",
              "A S D F G H J K L",
              "{lock} Z X C V B N M",
            ],
          }}
        />
      </div>
    </div>
  );
};

export default CustomizedKeyboard;

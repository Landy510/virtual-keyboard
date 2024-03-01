import { useEffect, useMemo, useRef, useState } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import Input from "./components/Input/Input";

// simpleKeyboardMembersClassName 裡的內容是用來判別使用者是否在和
// 會觸發 virtual keyboard 的 input 欄位 (input 欄位的 className 有 skb-input)，
// 或者是否使用者正在打擊 virtual keyboard 的按鍵 (className 含有 hg-button 元素)。
const simpleKeyboardMembersClassName = {
  "skb-input": "skb-input",
  "hg-button": "hg-button",
};

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
    document.addEventListener("click", function documentClick(e) {
      // 利用觸發 click 事件的元素的 class 內容來與 simpleKeyboardMembersClassName 對照，
      // 如果有任何符合的內容，就代表使用者目前在與 virutal keyboard 互動 或者
      // 點擊了會觸發 virtual keyboard 出現的 input 欄位。
      const result = [...e.target.classList].filter(
        (className) => simpleKeyboardMembersClassName[className],
      );
      !result.length && setIsKeyboardShow(false);
    });
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
          keyboardRef={(ref) => (keyboardRef.current = ref)}
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

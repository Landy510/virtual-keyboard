import { forwardRef, useEffect, useRef } from "react";

// 2023.10.05
// Input_v2 這個共用元件是基於 Input.jsx 這個共用元件來設計，
// 將原本 Input.jsx 元件裡有關正則式的使用錯誤的部分做修正，並把一些不需要使用的 useState 和 useEffect 刪除掉。
// 
// ***特別注意***
// Input_v2 這個元件透過 inputRef.current.value 來直接修改 <input /> 的 value 值的原因是，
// 如果，將外部透過 props 傳送進來的 value 值，綁定到 <input /> 的 value 屬性上的話，
// 雖然，可以將外部元件的值與 <input /> 的 value 值做同步，
// 但是，會造成在中文輸入法的狀態下，一直無法觸發 compositionend 這個事件，進而導致 isCompositioningRef 這個旗標值無法被設為 false，
// 最終導致 <input /> 的 onChange 事件裡判定 isCompositioningRef 的部分無法正常運作，讓 <input /> 無法再被輸入任何內容的問題，
// 所以，才需要直接透過 inputRef.current.value 對 <input /> 的 value 值做設定。

const Input = forwardRef(function Input_v2(props, externalRef) {

    const inputRef = useRef(null);
    const isCompositioningRef = useRef(false);

    const { title, id, replaceRegex, errorStatus, errorMessage, className, inputFieldClassName, value, onChange, ...attrs } = props;

    useEffect(() => {
        // 2023.10.05
        // 這個部分的程式碼，是為了處理像是 配息帳戶的下拉選單在手機板的狀態下，
        // 會透過點擊某個按鈕來清空 input 欄位的內容，而不是透過鍵盤改變 (e.g onChange, onCompositionstart, etc.) input 欄位內容的情境。
        inputRef.current.value = value;
    } ,[value])

    const isChrome = window.navigator.userAgent.indexOf("Chrome") !== -1;

    const handleComposition = e => {
        if(e.type === 'compositionend'){

            //composition結束，代表中文輸入完成
            isCompositioningRef.current = false;
            
            if (!isCompositioningRef.current) {  

                if(isChrome) {
                    // 修正 Chrome v53 之後的 onChange 和 onCompositionend 這兩個事件觸發順序與其他瀏覽器不同的問題。
                    // reference: https://github.com/facebook/react/issues/3926 - 這篇文章的 julen 發言者，有提到這個問題，所以，需要特別處理 Chrome 的狀態。
                    const temp = e.target.value;
                    const newVal = temp.replace(replaceRegex, '');
                    inputRef.current.value = newVal;
                    onChange(newVal);
                }
                else {
                    const temp = e.target.value;
                    const newVal = temp.replace(replaceRegex, '');
                    inputRef.current.value = newVal;
                    onChange(newVal);
                }
            }
    
        } else {
            // composition 進行中，代表正在輸入中文
            isCompositioningRef.current = true;
        }
    }
 
    return(
        <div 
            className={[
                'input',
                className ? className : '',
                errorStatus ? 'error' : ''
            ].join(' ')}
        >
            {
                title ? <label htmlFor={id}>{title}</label> : null
            }
            
            <input 
                {...attrs}
                id={id}
                ref={node => {
                    // if(externalRef) externalRef.current = node;
                    if(externalRef) {
                        if(typeof externalRef === 'function') externalRef(node); // 為了要因應在註冊流程 otp 驗證，是傳入 function 而不是傳入 ref 的寫法
                        else externalRef.current = node;
                    }
                    inputRef.current = node;
                }}
                className={inputFieldClassName}
                onChange={e => {
                    if(!isCompositioningRef.current) {
                        const temp = e.target.value;
                        const newVal = replaceRegex ? temp.replace(replaceRegex, '') : temp;
                        inputRef.current.value = newVal;
                        onChange(newVal);
                    }
                }}
                onCompositionStart={e => handleComposition(e)}
                onCompositionEnd={e => handleComposition(e)}
                onCompositionUpdate={e => handleComposition(e)}
            />

            {
                errorStatus && errorMessage
                ?<div className="error_msg">{errorMessage}</div>
                :null
            }
        </div>
    );
    
})

export default Input;
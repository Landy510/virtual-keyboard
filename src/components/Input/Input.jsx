import { forwardRef, useEffect, useRef } from "react";

const Input = forwardRef(function Input_v2(props, externalRef) {

    const inputRef = useRef(null);
    const isCompositioningRef = useRef(false);

    const { title, id, replaceRegex, errorStatus, errorMessage, className, inputFieldClassName, value, onChange, ...attrs } = props;

    useEffect(() => {
        inputRef.current.value = value;
    } ,[value])

    const isChrome = window.navigator.userAgent.indexOf("Chrome") !== -1;

    const handleComposition = e => {
        if(e.type === 'compositionend'){

            isCompositioningRef.current = false;
            
            if (!isCompositioningRef.current) {  

                if(isChrome) {
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
                    if(externalRef) {
                        if(typeof externalRef === 'function') externalRef(node);
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
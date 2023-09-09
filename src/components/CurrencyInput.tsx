"use client";

import { useCallback, useRef, useState } from "react";

interface CurrencyInputProps extends React.HTMLProps<HTMLInputElement> {
  onChangeAmount?: (value: number) => void;
}

/*
  bug: Caret changes position; the input appends the last token again.
  bug: can't highlight multiple characters and remove them
*/

function CurrencyInput(props: CurrencyInputProps) {
  const { onChangeAmount, ...otherProps } = props;
  const [value, setValue] = useState("$0.00");

  // Uses a stack to keep track of all the numbers only.
  const numbers = useRef<string[]>([]);

  const handleOnChange: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    const target = event.target;
    const native = event.nativeEvent as InputEvent;

    // const start = target.selectionStart;

    const token = native.data;

    // Ensures only integers can get through
    if (token && !Number.isInteger(parseInt(token))) {
      return;
    }

    // inputType can either be "insertText" or "deleteContentBackward"
    if (native.inputType == "insertText") {
      numbers.current.push(token!);
    } else {
      numbers.current.pop();
    }

    // Concat all the numbers
    let amount = numbers.current.join("");

    // remove leading zeros from amount
    amount = amount.replace(/^0+/, "");

    if (amount.length >= 3) {
      const right = amount.substring(amount.length - 2);
      const left = amount.substring(0, amount.length - 2);
      amount = `${left}.${right}`;
    } else if (amount.length == 2) {
      amount = `0.${amount}`
    } else if (amount.length == 1) {
      amount = `0.0${amount}`
    } else {
      amount = `0.00`;
    }

    // serialize back to the format.
    setValue(`\$${amount}`);

    if (onChangeAmount !== undefined) {
      onChangeAmount(parseFloat(amount));
    }

  }, [onChangeAmount]);

  return (
    <input
      {...otherProps}
      type="text"
      pattern="\d*"
      value={value}
      onChange={handleOnChange}
    />
  );
}

export default CurrencyInput;
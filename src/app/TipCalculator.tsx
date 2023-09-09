"use client";

import { useCallback, useMemo, useRef, useState } from "react";

import CurrencyInput from "@/components/CurrencyInput";

interface TipPercentageEventTarget extends EventTarget {
  value?: number;
}

const tipPercentages = [0, 15, 18, 20];

function TipCalculator() {
  const [subTotal, setSubtotal] = useState(0);
  const [tip, setTip] = useState(0);

  const customTipInput = useRef<HTMLInputElement>(null);
  const [isCustomTip, setIsCustomTip] = useState(false);

  const tipAmount = useMemo(() => {
    const tipPercentage = tip * 0.01;
    return Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format(subTotal * tipPercentage);
  }, [subTotal, tip]);

  const total = useMemo(() => {
    const tipPercentage = tip * 0.01;
    return Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD"
    }).format((subTotal * tipPercentage) + subTotal);
  }, [subTotal, tip]);

  const handleSetTipPercentage: React.MouseEventHandler<HTMLButtonElement> = useCallback((event) => {
    const target = event.target as TipPercentageEventTarget;
    const percentage = target.value;
    if (percentage != undefined) {
      setTip(percentage);
      setIsCustomTip(false);

      if (customTipInput?.current) {
        customTipInput.current.style.width = "4ch"
      }
    }
  }, []);

  const tipOptions = useMemo(() => {
    return tipPercentages.map((value) => {
      return (
        <button
          key={value}
          className={`w-16 font-bold rounded-md bg-gray-100 h-9
            ${(!isCustomTip && tip == value) ? "bg-gray-200" : ""}`}
          onClick={handleSetTipPercentage}
          value={value}>
          {value}%
        </button>  
      );
    });
  }, [tip, handleSetTipPercentage, isCustomTip]);

  const handleSetCustomTipPercentage: React.ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    const target = event.target;
    let value = parseInt(target.value);

    target.style.width = `${value.toString().length}ch`;

    if (Number.isNaN(value)) {
      setTip(0);
    } else {
      setTip(value);
    }
  }, []);

  const handleOnClickCustomTip = useCallback(() => {
    setIsCustomTip(true);
    setTip(0);
    if (customTipInput?.current) {
      customTipInput.current.style.width = "1ch"
    }
  }, []);

  return (
    <section>
      <div>
        <label htmlFor="bill" className="text-xl font-semibold">Bill</label>
        <CurrencyInput
          id="bill"
          className="w-full font-bold text-7xl"
          onChangeAmount={(value) => setSubtotal(value)}
        />
      </div>
      <div>
        <label className="text-xl font-semibold">Tip</label>
        <div className="flex gap-2 my-2">
          {tipOptions}
          <button
            className="flex-grow"
            onClick={handleOnClickCustomTip}>
            <label htmlFor="customTip" className={`my-auto justify-center flex font-bold rounded-md bg-gray-100 h-9 ${isCustomTip ? "bg-gray-200" : ""}`}>
              <input
                id="customTip"
                type="text"
                ref={customTipInput}
                placeholder="Other"
                value={isCustomTip ? tip : "other"}
                className="text-right bg-transparent w-[1ch]"
                onChange={handleSetCustomTipPercentage}
              />
              {
                isCustomTip &&
                <span className="my-auto text-left">%</span>
              }
            </label>
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-y-2">
        <hr className="my-2"/>
        <div className="flex justify-between font-medium">
          <p>Tip Amount:</p>
          <p>{tipAmount}</p>
        </div>
        <div className="flex justify-between font-medium">
          <p>Total:</p>
          <p className="text-lg font-bold">{total}</p>
        </div>
      </div>
      <canvas></canvas>
    </section>
  );
}

export default TipCalculator;
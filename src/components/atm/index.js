import React, { useState, useEffect } from "react";
import Numpad from "../numpad";

import "./Atm.scss";
import getBanknotes from "../../services/ATMfunction";
import Input from "../common/Input";
import Button from "../common/Button";
import { langRu } from "../../services/language";
import Select from "../common/Select";
import { limits } from "../../services/limits";
import { useKey } from "../../services/hooks";

function ATM() {
  const [amount, setAmount] = useState("");
  const [sum, setSum] = useState(0);
  const [outputLimit, setLimitOutput] = useState(limits[0]);
  const [limit, setLimit] = useState(limits[0] || []);
  const [result, setResult] = useState(null);

  useKey("Enter", onSubmit);

  useEffect(() => {
    setAmount("");
    setResult(null);
  }, [outputLimit]);

  function onSubmit() {
    if (result?.remains > 50) return;

    setSum(Number.parseFloat(sum) + Number.parseFloat(amount));

    const banknotes = getBanknotes(amount, limit.value);
    let resultCopy = Object.assign({}, result);

    if (result) {
      for (const key in banknotes) {
        if (!resultCopy.hasOwnProperty(key)) {
          resultCopy = { ...resultCopy, ...banknotes };
          console.log(resultCopy);
          continue;
        }

        if (resultCopy.hasOwnProperty(key)) {
          resultCopy[key] += banknotes[key];
        }
      }

      setResult(resultCopy);
    } else setResult(banknotes);

    let limitCopy = Object.assign({}, limit.value);

    for (const key in limitCopy) {
      if (banknotes.hasOwnProperty(key)) {
        limitCopy[key] = limitCopy[key] - banknotes[key];
      }
    }

    setLimit({ ...limit, value: limitCopy });
  }

  return (
    <div className="atm">
      <Select
        options={limits}
        setSelected={(attr) => {
          setLimit(attr);
          setLimitOutput(attr);
        }}
        selected={limit}
        name="key"
        value={""}
      />

      <Input
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        type="number"
        placeholder="Введите сумму"
      />

      <Numpad value={amount} setValue={setAmount} />

      <Button onClick={onSubmit}>Выдать</Button>

      <div className="atm__info">
        <h3>Оставшиеся купюры</h3>
        <ul className="atm__list">
          <li className="atm__item atm__header">
            <span>Номинал</span> <span>Количество</span>
          </li>
          {Object.keys(limit?.value).map((value) => (
            <li className="atm__item" key={value}>
              <span>{value}</span> <span>{limit?.value[value]}</span>
            </li>
          ))}
        </ul>

        {result && (
          <>
            <h3>Выданная сумма: {sum}</h3>
            <h3>Выданные купюры</h3>
            <ul className="atm__list">
              <li className="atm__item atm__header">
                <span>Номинал</span> <span>Количество</span>
              </li>
              {Object.keys(result).map((value) => (
                <li className="atm__item" key={value}>
                  <span>{langRu[value] || value}</span>{" "}
                  <span>{result[value]}</span>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default ATM;
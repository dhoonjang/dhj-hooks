import { isNumber } from "dhj-string";
import { useState } from "react";

export interface IValueChangeElementProps<T = HTMLInputElement, V = string> {
  value: V;
  onChange: (e: React.ChangeEvent<T>) => void;
  ref?: React.RefObject<T>;
}

export const useValueChangeElement = (
  initialValue: string,
  option?: {
    english?: boolean;
    number?: boolean;
  },
): [IValueChangeElementProps, React.Dispatch<React.SetStateAction<string>>] => {
  const [state, setState] = useState(initialValue);

  return [
    {
      value: state,
      onChange: (e) => {
        const value = e.currentTarget.value;

        if (option?.english)
          if (value.match(/^.*[ㄱ-ㅎㅏ-ㅣ가-힣]+.*/) !== null)
            return alert("한/영 키를 확인해 주세요!");

        if (option?.number) if (!isNumber(value) && value.length > 0) return;

        setState(value);
      },
    },
    setState,
  ];
};

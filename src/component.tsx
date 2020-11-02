import * as React from "react";
import { forwardRef, useImperativeHandle, useState } from "react";

export const Input = forwardRef((_, ref) => {
  const [value, setValue] = useState<string>("");
  useImperativeHandle(ref, () => ({ value }), [value]);

  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
});

import * as React from "react";
import {
  forwardRef,
  useImperativeHandle,
  useState,
  useRef,
  useLayoutEffect,
} from "react";

export const Input = forwardRef((_, ref) => {
  const [value, setValue] = useState<string>("");
  useImperativeHandle(ref, () => ({ value }), [value]);

  return <input value={value} onChange={(e) => setValue(e.target.value)} />;
});

export const ScrollView: React.FC<{
  className?: string;
  state?: any;
  refProps?: React.RefObject<HTMLDivElement>;
}> = ({ className, refProps, children, state }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (refProps) refProps.current?.scrollIntoView(true);
    else scrollRef.current?.scrollIntoView(true);
  }, [refProps, state]);

  return (
    <div className={`${className}`} ref={refProps ? refProps : scrollRef}>
      {children}
    </div>
  );
};

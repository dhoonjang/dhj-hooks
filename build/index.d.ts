export declare const useTimeout: () => (callback: (...args: any[]) => void, ms: number) => void;
export declare const useToggle: <T>(ref: import("react").RefObject<T>) => [boolean, (b?: boolean | undefined) => void];
export declare const useKeyDown: (callback: (event: Event) => any) => void;
export declare const useKeyUp: (callback: (event: Event) => any) => void;
export declare const useScroll: (callback: (event: Event) => void) => void;
export declare const useFullscreenChange: (callback: () => void) => void;
export declare const useOutsideClick: (callback: (event: MouseEvent) => any, ref: React.RefObject<any>) => void;
export declare const useWindowSize: () => {
    width: number | undefined;
    height: number | undefined;
    isSemi: boolean;
};
export declare const useQuadrant: (parentRef: React.RefObject<any>, cwidth: number, cheight: number, defaultQuadrant: number) => number;

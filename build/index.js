'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');

var useTimeout = function () {
    var _a = react.useState(null), to = _a[0], setTo = _a[1];
    react.useEffect(function () {
        return function () {
            if (to)
                clearTimeout(to);
        };
    }, [to]);
    return function (callback, ms) {
        var to = setTimeout(callback, ms);
        setTo(to);
    };
};
var useToggle = function (ref) {
    var _a = react.useState(false), state = _a[0], setState = _a[1];
    useOutsideClick(function () { return setState(false); }, ref);
    return [
        state,
        function (bool) {
            if (bool)
                setState(bool);
            else
                setState(!state);
        },
    ];
};
var useKeyDown = function (callback) {
    react.useEffect(function () {
        window.addEventListener("keydown", callback);
        return function () { return window.removeEventListener("keydown", callback); };
    }, [callback]);
};
var useKeyUp = function (callback) {
    react.useEffect(function () {
        window.addEventListener("keyup", callback);
        return function () { return window.removeEventListener("keyup", callback); };
    }, [callback]);
};
var useScroll = function (callback) {
    react.useEffect(function () {
        document.addEventListener("scroll", callback);
        return function () { return document.removeEventListener("scroll", callback); };
    }, [callback]);
};
var useFullscreenChange = function (callback) {
    react.useEffect(function () {
        callback();
        document.addEventListener("fullscreenchange", callback);
        return function () { return document.removeEventListener("fullscreenchange", callback); };
    }, [callback]);
};
var useOutsideClick = function (callback, ref) {
    var handleOutsideClick = react.useCallback(function (e) {
        if (ref.current && !ref.current.contains(e.target))
            callback(e);
    }, [callback, ref]);
    react.useEffect(function () {
        document.addEventListener("mousedown", handleOutsideClick);
        return function () {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [handleOutsideClick]);
};
var useWindowSize = function () {
    var isClient = typeof window === "object";
    function getSize() {
        return {
            width: isClient ? window.innerWidth : undefined,
            height: isClient ? window.innerHeight : undefined,
            isSemi: window.innerWidth <= 1560,
        };
    }
    var _a = react.useState(getSize), windowSize = _a[0], setWindowSize = _a[1];
    react.useEffect(function () {
        if (!isClient)
            return;
        function handleResize() {
            setWindowSize(getSize());
        }
        window.addEventListener("resize", handleResize);
        return function () { return window.removeEventListener("resize", handleResize); };
        // eslint-disable-next-line
    }, []);
    return windowSize;
};
var useQuadrant = function (parentRef, cwidth, cheight, defaultQuadrant) {
    var _a = react.useState(defaultQuadrant), quadrant = _a[0], setQuadrant = _a[1];
    var _b = useWindowSize(), width = _b.width, height = _b.height;
    react.useLayoutEffect(function () {
        if (parentRef.current && width && height) {
            var newQuadrant = defaultQuadrant;
            var _a = parentRef.current.getBoundingClientRect(), x = _a.x, y = _a.y;
            if (x + cwidth > width) {
                if (newQuadrant === 1)
                    newQuadrant = 4;
                else if (newQuadrant === 2)
                    newQuadrant = 3;
            }
            if (y + cheight > height) {
                if (newQuadrant === 3)
                    newQuadrant = 2;
                else if (newQuadrant === 4)
                    newQuadrant = 1;
            }
            setQuadrant(newQuadrant);
        }
    }, [parentRef, width, height, defaultQuadrant, cwidth, cheight]);
    return quadrant;
};

exports.useFullscreenChange = useFullscreenChange;
exports.useKeyDown = useKeyDown;
exports.useKeyUp = useKeyUp;
exports.useOutsideClick = useOutsideClick;
exports.useQuadrant = useQuadrant;
exports.useScroll = useScroll;
exports.useTimeout = useTimeout;
exports.useToggle = useToggle;
exports.useWindowSize = useWindowSize;
//# sourceMappingURL=index.js.map

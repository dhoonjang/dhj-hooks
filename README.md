# dhoonjang-s-hooks

- React에서 재사용 가능성이 높은 Custom Hook들을 모아놓은 라이브러리입니다.

## Hooks

### Async

- useUpdateFetch: 비동기 요청을 반복해서 요청할 수 있는 hook
- useTimeout: timeout event를 따로 clear 할 필요 없이 Timeout 이벤트를 걸 수 있는 함수를 반환하는 hook
- useFlicker: false --filckFunc()--> true --n초 후--> false 로 바뀌는 상태와 함수를 반환하는 hook (기본 3초)

### Listener

- useWindowEventListner: window에 이벤트를 걸 수 있는 hook (option.initExecute로 처음에 실행여부 결정 가능)
- useDocumentEventListner: document에 이벤트를 걸 수 있는 hook (option.initExecute로 처음에 실행여부 결정 가능)
- useEventListener: 전달받은 ref element에 이벤트를 걸 수 있는 hook (element가 없으면 window)
- useOutsideClick: 전달받은 ref element 바깥을 클릭하는 이벤트를 핸들링 할 수 있는 hook

### Display

- useDomRect: ref element의 client rect를 가지고 오는 hook (resize 이벤트에 따라 동기화)
- useWindowSize: window의 크기를 가지오 오는 hook (resize 이벤트에 따라 동기화)
- useQuadrant: window의 크기와 부모 요소의 위치에 따라 option 뷰가 1 ~ 4분면 중 어느 곳에 있어야 하는지 판단하는 hook
- useCanvas2D: canvas에 2d context를 가지고 와서 data에 따라 조작할 수 있는 hook
- useToggle: 전달받은 ref element 바깥을 클릭하면 닫히는 toggle을 위한 hook

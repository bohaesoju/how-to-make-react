export const notReact = (function() {
  let _root: Element;
  let _templateCallback: ITemplateCallback;

  let hookStates: Array<any> = [];
  let currentIndex: number = 0;

  const _eventArray: IEventArray = [];

  function useState(initValue: any) {
    let state;
    state = hookStates[currentIndex] !== undefined ? hookStates[currentIndex] : initValue;
    const _currentIndex = currentIndex;
    const setState = (newValue: any) => {
      hookStates[_currentIndex] = newValue;
      render();
    }
    currentIndex++;
    return [state, setState];
  }
  function useEffect(callback: any, dependancyArray: Array<any>) {
    //맨 처음에는 undefined

    // 2번째 실행부터는 oldDependancies 에는 이전 의존성 배열 값이 담깁니다.
    const prevDependancies = hookStates[1]
    // const oldDependancies = hookStates[currentIndex]

    //맨 처음에는 useEffect 가 실행되야 하니까 true로
    let hasChanged = true;

    // useEffect 가 맨 처음에는 그냥 실행된다. 그래서 이 로직은 맨처음 실행되지 않는다.
    // 자.. 이전 prevDependancies 가 있다면, 이 useEffect 가 다시 실행되어야 할지 말지 판단을 내려야겠지?
    if (prevDependancies) {
      // 이건 내일 아침에 분석해보자 ^^
      console.log('dependancyArray', dependancyArray)
      hasChanged = dependancyArray.some((dependancy, index) => !Object.is(dependancy, prevDependancies[index]));
    }
    // 그거알아? dependencyArray 는 value 를 return 받는 거였어.. value 는 계속 변하겠지. 변하는 값을
    // hookStates 두번째 배열로 넣어주고 있었어..
    // hook 배열에 dependencyArray Value 를 할당해준다. 그럼 2번째부터는 의존성 체크를 하는거야
    hookStates[1] = dependancyArray;
    if (hasChanged) callback();
  }
  function init(rootElement: Element, templateCallback: ITemplateCallback) {
    _root = rootElement;
    _templateCallback = templateCallback;
    render();
  }
  function render() {
    currentIndex=0;
    _eventArray.length = 0;
    _root.innerHTML = _templateCallback();
  }
  //event Listeners
  //@ts-ignore
  document.addEventListener('click', (e) => handleEventListeners(e));
  function handleEventListeners(e: any) {
    _eventArray.forEach((target: any) => {
      if (e.target.id === target.id) {
        e.preventDefault();
        target.callback();
      }
    });
  }
  function addOnClick(id: string, callback: any) {
    _eventArray.push({id, callback});
  }

  return {useState, useEffect, init, render, addOnClick};
})();


type ITemplateCallback = { (): string; }
type IEventArray = [{id: string, callback: any}] | Array<any>;
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
  function useEffect(callback: any) {
    callback();
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
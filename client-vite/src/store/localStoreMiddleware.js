export const localStorageMiddleware = ({ getState }) => {
  return next => action => {
    const result = next(action);
    const {newAction,auth,filter,nutrients}=getState();
    localStorage.setItem('applicationState', JSON.stringify({newAction,auth,filter,nutrients})); // save the state to localStorage
    return result;
  };
};

export const reHydrateStore = () => {
  if (localStorage.getItem('applicationState') !== null) {
    return JSON.parse(localStorage.getItem('applicationState')); // re-hydrate the store
  }
};
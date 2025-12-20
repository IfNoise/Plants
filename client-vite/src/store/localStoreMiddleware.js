// Дебаунсинг для записи в localStorage
let saveTimeout = null;

const debouncedSave = (state) => {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  
  saveTimeout = setTimeout(() => {
    const { newAction, auth, filter, nutrients } = state;
    try {
      localStorage.setItem(
        'applicationState',
        JSON.stringify({ newAction, auth, filter, nutrients })
      );
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  }, 500); // Сохраняем не чаще чем раз в 500ms
};

export const localStorageMiddleware = ({ getState }) => {
  return next => action => {
    const result = next(action);
    
    // Игнорируем RTK Query действия для улучшения производительности
    if (!action.type?.includes('/pending') && 
        !action.type?.includes('/fulfilled') &&
        !action.type?.includes('/rejected')) {
      debouncedSave(getState());
    }
    
    return result;
  };
};

export const reHydrateStore = () => {
  try {
    const savedState = localStorage.getItem('applicationState');
    if (savedState !== null) {
      return JSON.parse(savedState);
    }
  } catch (error) {
    console.error('Failed to rehydrate store:', error);
    return undefined;
  }
};
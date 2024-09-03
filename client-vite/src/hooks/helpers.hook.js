import { useState } from 'react';


export const useDiscloser = () => {
  const [isOpen, setIsOpen] = useState(false);
  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);
  return { isOpen, onClose, onOpen };
}

export const usePagination = (initialPage = 1) => {
  const [page, setPage] = useState(initialPage);
  const nextPage = () => setPage(page + 1);
  const prevPage = () => setPage(page - 1);
  return { page, nextPage, prevPage };
}

export const useToggle = (initialState = false) => {
  const [state, setState] = useState(initialState);
  const toggle = () => setState(!state);
  return { state, toggle };
}

export const useInput = (initialValue = '') => {
  const [value, setValue] = useState(initialValue);
  const onChange = (e) => setValue(e.target.value);
  return { value, onChange };
}
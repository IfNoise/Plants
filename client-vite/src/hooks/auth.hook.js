import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { selectIsAuth } from '../store/authSlice'


export const useAuth = () => {
  const isAuth = useSelector(selectIsAuth)

  return useMemo(() => ({ isAuth }), [isAuth])
}
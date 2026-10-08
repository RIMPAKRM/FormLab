import { Navigate, Outlet, useLocation } from 'react-router'
import { useAppSelector } from '../../app/hooks'

export function RequireAuth() {
  const user = useAppSelector((state) => state.auth.user)
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

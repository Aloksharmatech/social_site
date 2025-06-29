import React, { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import {checkAuth} from '../../store/authSlice';

const CheckAuth = () => {
  // const{isAuthenthicated,isLoading} = useSelector((state)=>state.auth)
  // useEffect(()=>{
  //   dispatchEvent(checkAuth())
  // },[])
  const isAuthenticated = false;
  const isLoading = false;
  
  const location = useLocation()

  const path = location.pathname

  const isPublicRoute = path === "/auth/login" || path === "/auth/register"

  if (isLoading) {
    return <div className="bg-black min-h-screen text-white flex justify-center items-center">Loading...</div>;
  }

  if (!isAuthenthicated && !isPublicRoute) {
    return <Navigate to="/auth/login" replace />
  }

  if (isAuthenthicated && isPublicRoute) {
    return <Navigate to="/auth/home" replace />
  }

  return (
    <Outlet />
  )
}

export default CheckAuth
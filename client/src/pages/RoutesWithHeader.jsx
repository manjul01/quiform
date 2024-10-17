import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'

function RoutesWithHeader() {
  return (
    <>
    <Header/>
    <Outlet></Outlet>
    </>
  )
}

export default RoutesWithHeader
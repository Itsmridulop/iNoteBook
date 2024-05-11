import React, { useState } from 'react'
import Sidebar from './SideBar';

function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const openSiderBar = () => {
    setIsOpen(true)
  }
  return (
    <>
      <div className='flex justify-end'>
        {/* <button><i className="fa-solid fa-user p-4 rounded-full m-5" style={{ backgroundColor: "#454545" }}></i></button> */}
        <button onClick={openSiderBar}><i className="fa-solid fa-user p-4 rounded-full m-5" style={{ backgroundColor: "#454545" }}></i></button>
      </div>
      <div className='p-24'>
        <h3>Add Notes</h3>
      </div>
      <div className='flex justify-end'>
        <button><i className="fa-solid fa-plus p-8"/></button>
      </div>
      {isOpen ? <Sidebar closeSiderBar={setIsOpen}/> : null}
    </>
  )
}

export default Header
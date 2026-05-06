import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import categories from '../utils/categories'
import Navbar from './Navbar'
import { setSelectedCategory, setSidebarExtendedValue } from '../redux/categorySlice'
import Menu from '../assets/Menu'
import { MdHistory } from 'react-icons/md'
import { colors } from '../theme'

function Sidebar() {
  const pageRoute = useNavigate()
  const dispatch = useDispatch()
  const { selectedCategory } = useSelector((state) => state.category)
  const [sidebarExtended, setSidebarExtended] = useState(false)

  return (
    <>
      <Navbar
        sidebarExtended={sidebarExtended}
        setSidebarExtended={setSidebarExtended}
      />

      {/* DESKTOP SIDEBAR */}
      <div
        className="absolute w-[10%] top-20 hidden sm:block"
        style={{ backgroundColor: colors.white }}
      >
        <div className="flex flex-col gap-y-6 fixed z-20">

          {categories.map((e) => (
            <button
              key={e.id}
              onClick={() => {
                dispatch(setSelectedCategory(e.name))
                pageRoute(e.name === "Home" ? "/" : `/feed/${e.name}`)
              }}
            >
              <div
                className={`
                  flex items-center gap-x-4 ml-2 px-2 py-2 
                  cursor-pointer 
                  transition-colors duration-200 
                  hover:bg-[#8adaf5]
                  ${selectedCategory === e.name ? "bg-[#d9f3fb] rounded-[10px]" : ""}
                `}
              >
                {selectedCategory === e.name ? e.active : e.icon}

                {sidebarExtended && (
                  <h4 className="text-md font-semibold tracking-wide">
                    {e.name}
                  </h4>
                )}
              </div>
            </button>
          ))}

          {/* HISTORY */}
          <button onClick={() => pageRoute('/history')}>
            <div className="flex items-center gap-x-4 ml-2 px-2 py-2 cursor-pointer transition-colors duration-200 hover:bg-[#8adaf5]">
              <MdHistory style={{ height: "22px", width: "30px" }} />
              {sidebarExtended && (
                <h4 className="text-md font-semibold tracking-wide">
                  History
                </h4>
              )}
            </div>
          </button>

        </div>
      </div>

      {/* MOBILE SIDEBAR */}
      <div
        className="block sm:hidden top-0 fixed z-10 h-[100vh]"
        style={{ backgroundColor: colors.white }}
      >

        {/* MENU BUTTON */}
        <div
          className={`${sidebarExtended ? "block" : "hidden"} flex items-center space-x-4 ml-3 -mt-4 pl-2`}
        >
          <button
            onClick={() => {
              dispatch(setSidebarExtendedValue(!sidebarExtended))
              setSidebarExtended(!sidebarExtended)
            }}
          >
            <Menu />
          </button>
        </div>

        {/* MOBILE LIST */}
        <div className="flex flex-col gap-y-6">

          {categories.map((e) => {
            if (!sidebarExtended) return null

            return (
              <button
                key={e.id}
                onClick={() => {
                  dispatch(setSelectedCategory(e.name))
                  dispatch(setSidebarExtendedValue(false))
                  setSidebarExtended(false)

                  pageRoute(e.name === "Home" ? "/" : `/feed/${e.name}`)
                }}
              >
                <div
                  className={`
                    flex items-center gap-x-4 ml-2 px-2 py-2 
                    cursor-pointer 
                    transition-colors duration-200 
                    hover:bg-[#8adaf5]
                    ${selectedCategory === e.name ? "bg-[#d9f3fb] rounded-[10px]" : ""}
                  `}
                >
                  {selectedCategory === e.name ? e.active : e.icon}

                  <h4 className="text-md font-semibold tracking-wide">
                    {e.name}
                  </h4>
                </div>
              </button>
            )
          })}

          {/* HISTORY MOBILE */}
          <button
            onClick={() => {
              dispatch(setSidebarExtendedValue(false))
              setSidebarExtended(false)
              pageRoute('/history')
            }}
          >
            <div className="flex items-center gap-x-4 ml-2 px-2 py-2 cursor-pointer transition-colors duration-200 hover:bg-[#8adaf5]">
              <MdHistory style={{ height: "22px", width: "30px" }} />
              <h4 className="text-md font-semibold tracking-wide">
                History
              </h4>
            </div>
          </button>

        </div>
      </div>
    </>
  )
}

export default Sidebar
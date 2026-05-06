import React, { useState, useRef, useEffect } from 'react'
import Menu from '../assets/Menu'
import { Link, useNavigate } from 'react-router-dom'
import { setSidebarExtendedValue } from '../redux/categorySlice'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../redux/authSlice'
import LinearProgress from '@mui/material/LinearProgress'

// Icons
import { FiSearch, FiMic, FiX } from "react-icons/fi"
import { IoMdNotificationsOutline } from "react-icons/io"
import { HiOutlinePlus } from "react-icons/hi"
import { FaUserCircle, FaYoutube } from "react-icons/fa"
import { MdOutlineFileUpload } from "react-icons/md"
import { GoBroadcast } from "react-icons/go"

function Navbar({ sidebarExtended, setSidebarExtended }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [searchValue, setSearchValue] = useState("")
  const [profileOpen, setProfileOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)

  const profileRef = useRef(null)
  const createRef = useRef(null)
  const notifRef = useRef(null)

  const { isLoading } = useSelector((state) => state.category)
  const channelLoading = useSelector((state) => state.channel.isLoading)
  const videoLoading = useSelector((state) => state.video.isLoading)
  const searchLoading = useSelector((state) => state.search.isLoading)
  const { isAuthenticated, user } = useSelector((state) => state.auth)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
      if (createRef.current && !createRef.current.contains(e.target)) setCreateOpen(false)
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchValue.trim()) {
      navigate(`/search/${searchValue}`)
    }
  }

  return (
    <div className="fixed top-0 left-0 w-full z-50 shadow-md" style={{ backgroundColor: "#44a6c6" }}>

      {(videoLoading || channelLoading || isLoading || searchLoading) && (
        <LinearProgress color="inherit" />
      )}

      <nav className="flex items-center justify-between h-[60px] px-4 text-white">

        {/* LEFT */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              dispatch(setSidebarExtendedValue(!sidebarExtended))
              setSidebarExtended(!sidebarExtended)
            }}
            className="p-2 rounded-full hover:bg-white/20"
          >
            <Menu />
          </button>

          <div className="flex items-center gap-2">
            <FaYoutube size={28} />
            <h1 className="font-bold text-lg hidden sm:block">MyTube</h1>
          </div>
        </div>

        {/* SEARCH */}
        <form onSubmit={handleSearch} className="flex flex-1 max-w-[600px] mx-4">
          <div className="flex w-full bg-white rounded-full overflow-hidden items-center">

            <input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search"
              className="flex-1 px-4 py-2 text-black outline-none text-sm"
            />

            {searchValue && (
              <button
                type="button"
                onClick={() => setSearchValue("")}
                className="px-2 text-gray-500 hover:text-black"
              >
                <FiX size={18} />
              </button>
            )}

            {/* SEARCH TOOLTIP */}
            <div className="relative group">
              <button
                type="submit"
                className="px-4 text-black hover:bg-gray-100"
              >
                <FiSearch />
              </button>

              <span className="absolute left-1/2 -translate-x-1/2 top-12 scale-0 group-hover:scale-100 transition bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                Search
              </span>
            </div>

          </div>
        </form>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4">

          {/* MIC + TOOLTIP */}
          <div className="relative group">
            <button
              onClick={() => alert("Voice search not implemented yet")}
              className="p-2 rounded-full hover:bg-white/20"
            >
              <FiMic size={18} />
            </button>

            <span className="absolute left-1/2 -translate-x-1/2 top-12 scale-0 group-hover:scale-100 transition bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              Voice Search
            </span>
          </div>

          {/* CREATE */}
          <div className="relative" ref={createRef}>
            <button
              onClick={() => setCreateOpen(!createOpen)}
              className="flex items-center gap-1 px-3 py-2 rounded-full bg-white/20 hover:bg-white/30 text-sm"
            >
              <HiOutlinePlus size={18} />
              Create
            </button>

            {createOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white text-black border rounded-lg shadow-lg overflow-hidden">

                <Link to="/upload" className="flex items-center gap-3 px-4 py-2 hover:bg-[#8adaf5]">
                  <MdOutlineFileUpload size={18} />
                  Upload Video
                </Link>

                <button
                  onClick={() => alert("Go Live not implemented yet")}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-[#8adaf5] text-left"
                >
                  <GoBroadcast size={18} />
                  Go Live
                </button>


              </div>
            )}
          </div>

          {/* NOTIFICATIONS */}
          <div className="relative group" ref={notifRef}>
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="p-2 rounded-full hover:bg-white/20"
            >
              <IoMdNotificationsOutline size={22} />
            </button>

            <span className="absolute left-1/2 -translate-x-1/2 top-12 scale-0 group-hover:scale-100 transition bg-gray-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              Notifications
            </span>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-black border rounded-lg shadow-lg p-3">
                <p className="text-sm font-medium">Notifications</p>
                <p className="text-xs text-gray-500 mt-2">No new notifications</p>
              </div>
            )}
          </div>

          {/* PROFILE */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="p-1 rounded-full hover:bg-white/20"
            >
              <FaUserCircle size={26} />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black border rounded-lg shadow-lg overflow-hidden">

                {isAuthenticated ? (
                  <>
                    <div className="px-4 py-2 text-sm border-b">{user?.email}</div>
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                    <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100">Settings</Link>
                    <button
                      onClick={() => {
                        dispatch(logout())
                        setProfileOpen(false)
                      }}
                      className="w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="block px-4 py-2 hover:bg-[#8adaf5]">Login</Link>
                    <Link to="/register" className="block px-4 py-2 hover:bg-[#8adaf5]">Sign up</Link>
                  </>
                )}

              </div>
            )}
          </div>

        </div>
      </nav>
    </div>
  )
}

export default Navbar
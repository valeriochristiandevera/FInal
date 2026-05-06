import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import VideoCard from '../components/VideoCard'
import { getCategoryVideos } from '../redux/categorySlice'
import timeSince from '../utils/date'
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"

function Profile() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { user, isAuthenticated } = useSelector((state) => state.auth)
  const { sidebarExtend, categoryVideos } = useSelector((state) => state.category)
  const { history } = useSelector((state) => state.history)

  const historyRef = useRef(null)

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    const query = user?.email
      ? user.email.split('@')[0]
      : 'coding'

    dispatch(getCategoryVideos(`search?part=snippet&q=${query}`))
  }, [isAuthenticated, user, dispatch, navigate])

  // scroll controls
  const scrollLeft = () => {
    historyRef.current?.scrollBy({ left: -350, behavior: "smooth" })
  }

  const scrollRight = () => {
    historyRef.current?.scrollBy({ left: 350, behavior: "smooth" })
  }

  // remove duplicates safely
  const uniqueHistory = history?.reduce((acc, item) => {
    if (!item) return acc
    const exists = acc.find(v => v.videoId === item.videoId)
    if (!exists) acc.push(item)
    return acc
  }, [])

  return (
    <>
      {/* overlay */}
      <div className={`sm:hidden overlayEffect ${sidebarExtend ? "block" : "hidden"}`}></div>

      <div className={`pl-0 ${sidebarExtend ? "sm:pl-[180px]" : "sm:pl-[70px]"} pt-16`}>

        {/* BANNER */}
        <div className="w-full h-[140px] md:h-[180px] bg-[#8adaf5]"></div>

        {/* PROFILE HEADER */}
        <div className="px-4 md:px-8 -mt-10">
          <div className="flex items-center gap-4">

            <div className="w-20 h-20 md:w-28 md:h-28 rounded-full bg-indigo-600 flex items-center justify-center text-white text-3xl font-bold border-4 border-white">
              {user?.email ? user.email[0].toUpperCase() : 'U'}
            </div>

            <div>
              <h2 className="text-xl md:text-2xl font-bold">
                {user?.email || "User Channel"}
              </h2>

              <p className="text-sm text-gray-500">
                @{user?.email ? user.email.split('@')[0] : "user"}
              </p>
            </div>

          </div>
        </div>

        {/* HISTORY / VIDEOS SECTION */}
        <div className="mt-10 px-4 md:px-8">

          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">History</h3>

            <div className="flex items-center gap-2">

              <button
                onClick={() => navigate('/history')}
                className="px-4 py-1.5 text-sm font-medium bg-gray-100 hover:bg-gray-200 rounded-full"
              >
                View all
              </button>

              <button
                onClick={scrollLeft}
                className="bg-white border shadow p-2 rounded-full hover:bg-gray-100"
              >
                <FiChevronLeft size={18} />
              </button>

              <button
                onClick={scrollRight}
                className="bg-white border shadow p-2 rounded-full hover:bg-gray-100"
              >
                <FiChevronRight size={18} />
              </button>

            </div>
          </div>

          {/* CAROUSEL */}
          <div
            ref={historyRef}
            className="flex gap-4 overflow-x-auto scroll-smooth scrollbar-hide px-1"
          >

            {/* 🔥 HISTORY EXISTS */}
            {uniqueHistory?.length > 0 ? (
              uniqueHistory.map((item, index) => (
                <div key={item.videoId || index} className="min-w-[260px]">
                  <VideoCard
                    title={item.title}
                    videoId={item.videoId}
                    channel="History"
                    on={timeSince(new Date(item.timestamp))}
                    thumbnail={`https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg`}
                  />
                </div>
              ))
            ) : (
              /* 🔥 FALLBACK: CATEGORY VIDEOS */
              categoryVideos?.map((video, index) => (
                <div key={index} className="min-w-[260px]">
                  <VideoCard
                    title={video?.snippet?.title}
                    videoId={video?.id?.videoId}
                    channel={video?.snippet?.channelTitle}
                    on={timeSince(new Date(video?.snippet?.publishedAt))}
                    thumbnail={video?.snippet?.thumbnails?.medium?.url}
                  />
                </div>
              ))
            )}

          </div>

        </div>

      </div>
    </>
  )
}

export default Profile
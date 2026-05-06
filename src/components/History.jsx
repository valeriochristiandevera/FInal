import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RiDeleteBinLine } from 'react-icons/ri'

import VideoCard from './VideoCard'
import { getHistory, removeFromHistory, clearAllHistory } from '../redux/historySlice'
import timeSince from '../utils/date'
import '../pages/feed.css'

function History() {
  const dispatch = useDispatch()
  const { history, isLoading } = useSelector((state) => state.history)
  const { sidebarExtend } = useSelector((state) => state.category)

  useEffect(() => {
    dispatch(getHistory())
  }, [dispatch])

  const handleRemove = (videoId) => {
    dispatch(removeFromHistory(videoId))
  }

  const handleClearAll = () => {
    if (window.confirm('Clear all watch history?')) {
      dispatch(clearAllHistory())
    }
  }

  // ✅ REMOVE DUPLICATES + KEEP LATEST FIRST
  const uniqueHistory = Array.from(
    new Map(history.map(item => [item.videoId, item])).values()
  ).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

  if (isLoading) {
    return (
      <div className="pt-24 text-center text-gray-600 text-lg">
        Loading watch history...
      </div>
    )
  }

  return (
    <div
      className={`pt-24 px-4 sm:px-6 lg:px-10 transition-all duration-300
        ${sidebarExtend ? "sm:ml-[180px]" : "sm:ml-[70px]"}`}
    >

      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">

        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Watch history
          </h1>
          <p className="text-sm text-gray-500">
            Videos you’ve watched recently
          </p>
        </div>

        {uniqueHistory.length > 0 && (
          <button
            onClick={handleClearAll}
            className="
              flex items-center gap-2
              px-4 py-2
              text-sm font-medium
              text-red-600
              bg-red-50
              hover:bg-red-100
              rounded-full
              transition
            "
          >
            <RiDeleteBinLine />
            Clear history
          </button>
        )}

      </div>

      {/* CONTENT */}
      {uniqueHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-gray-500">
          <p className="text-lg">No watch history yet</p>
          <p className="text-sm">Videos you watch will appear here</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

          {uniqueHistory.map((item) => (
            <div key={item.videoId} className="relative group">

              <VideoCard
                title={item.title}
                videoId={item.videoId}
                channel="History"
                on={timeSince(new Date(item.timestamp))}
                thumbnail={`https://img.youtube.com/vi/${item.videoId}/mqdefault.jpg`}
              />

              {/* DELETE BUTTON */}
              <button
                onClick={() => handleRemove(item.videoId)}
                className="
                  absolute top-2 right-2
                  p-2
                  bg-white/90
                  hover:bg-red-500 hover:text-white
                  text-gray-600
                  rounded-full
                  shadow-md
                  opacity-0 group-hover:opacity-100
                  transition
                "
                title="Remove from history"
              >
                <RiDeleteBinLine className="w-4 h-4" />
              </button>

            </div>
          ))}

        </div>
      )}

    </div>
  )
}

export default History
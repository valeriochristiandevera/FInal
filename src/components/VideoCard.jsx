import React from 'react'
import { useNavigate } from 'react-router-dom'
import "../pages/feed.css"
import { colors } from '../theme'

function VideoCard({
  videoId,
  thumbnail,
  title,
  channel,
  channelId,
  on,
  width,
  display,
  rightWidth
}) {
  const navigate = useNavigate()

  const goToVideo = () => {
    if (videoId) navigate(`/watch/${videoId}`)
  }

  const goToChannel = () => {
    if (channelId) navigate(`/channel/${channelId}`)
  }

  return (
    <div
      style={{ width: width || "100%", display: display || "block" }}
      className="w-full sm:w-[90%] md:w-full cursor-pointer group"
    >
      {/* THUMBNAIL */}
      <div className="relative overflow-hidden rounded-xl">
        <img
          onClick={goToVideo}
          src={thumbnail || "https://via.placeholder.com/300x200"}
          alt={title || "Video thumbnail"}
          className="
            w-full 
            md:w-56 
            lg:w-72 
            rounded-xl 
            object-cover 
            transition-transform 
            duration-300 
            group-hover:scale-105
          "
        />
      </div>

      {/* INFO */}
      <div
        style={{ width: rightWidth || "100%" }}
        className="flex gap-x-3 mt-3"
      >
        <div className="w-full">
          {/* TITLE */}
          <h3
            onClick={goToVideo}
            className="
              text-[14px] lg:text-[16px] 
              font-semibold 
              leading-[1.3] 
              line-clamp-2
              hover:text-blue-600
              transition
            "
          >
            {title || "Untitled Video"}
          </h3>

          {/* CHANNEL + META */}
          <div className="mt-1">
            <p
              onClick={goToChannel}
              className="text-[12px] lg:text-[13px] font-medium tracking-wide cursor-pointer"
              style={{ color: colors.textSecondary }}
            >
              {channel || "Unknown Channel"}
            </p>

            <p
              onClick={goToVideo}
              className="text-[12px] lg:text-[13px] font-medium cursor-pointer"
              style={{ color: colors.textSecondary }}
            >
              {on || "No data"}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoCard
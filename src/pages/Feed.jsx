import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import VideoCard from '../components/VideoCard'
import { getCategoryVideos } from '../redux/categorySlice'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import timeSince from '../utils/date'
import './feed.css'
function Feed() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const { categoryVideos } = useSelector((state) => state.category)
  const { sidebarExtend } = useSelector((state) => state.category)
  const { token, isAuthenticated } = useSelector((state) => state.auth)
  const [myUploads, setMyUploads] = useState([])
  
  useEffect(() => {
    dispatch(getCategoryVideos(`search?part=snippet&q=${id ? id : "Coding development"}`))
    document.title = `${id ? id + "- Youtube" : "Home - Youtube"}`
  }, [id])

  // Load user's uploads to show on home page
  useEffect(() => {
    if (isAuthenticated && token) {
      axios.get('http://localhost:5000/api/upload', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setMyUploads(res.data))
      .catch(err => console.error(err));
    }
  }, [isAuthenticated, token])

  var aDay = 24 * 60 * 60 * 1000;
  return (
    <>
      {/* <Sidebar /> */}
      <div className={`sm:hidden overlayEffect ${sidebarExtend ? "block" : "hidden"}`}></div>
      <div className={`pl-0  ${sidebarExtend ? "sm:pl-[180px]" : "sm:pl-[70px]"} feedGrid grid sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-x-[4%] pt-20 mx-3 sm:ml-4 md:pr-[28px] lg:pr-14 gap-y-6 max-w-[100%] bg-contain `}>

        {/* Show my uploads at the top if logged in */}
        {isAuthenticated && myUploads.length > 0 && (
          <>
            {myUploads.map((upload, index) => (
              <div key={`upload-${index}`}>
                <VideoCard 
                  title={upload.title} 
                  thumbnail={`https://img.youtube.com/vi/${upload.videoId}/mqdefault.jpg`} 
                  on={timeSince(new Date(Date.parse(upload.createdAt) - aDay))} 
                  channel={upload.userId} 
                  channelId={upload.userId} 
                  videoId={upload.videoId} 
                />
              </div>
            ))}
          </>
        )}

        {
          categoryVideos?.map((e, index) => {
            return (
              <div key={index} style={{ marginTop: index === 0 ? "0px" : "0px" }}>
                <VideoCard key={index} title={e.snippet.title} thumbnail={e.snippet?.thumbnails?.medium?.url} on={timeSince(new Date(Date.parse(e.snippet.publishedAt) - aDay))} channel={e.snippet.channelTitle} channelId={e.snippet.channelId} videoId={e.id.videoId} />
              </div>
            )
          })
        }
      </div>
    </>
  )
}

export default Feed

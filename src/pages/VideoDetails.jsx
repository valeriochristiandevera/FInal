import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { getVideoDetails, getRelatedVideos } from '../redux/videoSlice'
import { addToHistory } from '../redux/historySlice'
import { fetchComments, addComment, deleteComment } from '../redux/commentSlice'
import { fetchLikes, toggleLike } from '../redux/likeSlice'
import { fetchUnlikes, toggleUnlike } from '../redux/unlikeSlice'
import { fetchViews, incrementView } from '../redux/viewSlice'
import ReactPlayer from 'react-player'
import { FiThumbsUp, FiThumbsDown } from "react-icons/fi"
import { FaThumbsUp, FaThumbsDown, FaTrash } from "react-icons/fa"
import timeSince from '../utils/date'
import convertToInternationalCurrencySystem from '../utils/convert'

// VIDEO CARD
const Video = (props) => {
  const navigate = useNavigate()

  return (
    <div className='flex gap-3 cursor-pointer'>
      <img
        src={props.thumbnail}
        alt="thumb"
        onClick={() => navigate(`/watch/${props.videoId}`)}
        className='w-[160px] h-[90px] object-cover rounded'
      />

      <div>
        <h3
          onClick={() => navigate(`/watch/${props.videoId}`)}
          className='text-sm font-medium line-clamp-2'
        >
          {props.title}
        </h3>

        <p
          onClick={() => navigate(`/channel/${props.channelId}`)}
          className='text-xs text-gray-600 mt-1'
        >
          {props.channel}
        </p>

        <p className='text-xs text-gray-500'>
          {props.on}
        </p>
      </div>
    </div>
  )
}

function VideoDetails() {
  const { sidebarExtend } = useSelector((state) => state.category)
  const dispatch = useDispatch()
  const { id } = useParams()
  const navigate = useNavigate()

  const { videoDetails, relatedVideos } = useSelector((state) => state.video)
  const { comments } = useSelector((state) => state.comments)
  const { isAuthenticated, user } = useSelector((state) => state.auth)
  const { isLiked, count: likeCount } = useSelector((state) => state.likes)
  const { isUnliked, count: unlikeCount } = useSelector((state) => state.unlikes)
  const { count: viewCount } = useSelector((state) => state.views)

  const [commentText, setCommentText] = useState('')

  // FETCH DATA
  useEffect(() => {
    dispatch(getVideoDetails(`videos?part=snippet,statistics&id=${id}`))
    dispatch(getRelatedVideos(`search?part=snippet&relatedToVideoId=${id}&type=video`))
    dispatch(fetchComments(id))
    dispatch(fetchLikes(id))
    dispatch(fetchUnlikes(id))
    dispatch(fetchViews(id))
  }, [id, dispatch])

  // VIEW COUNT
  useEffect(() => {
    if (id && videoDetails?.snippet?.channelId) {
      dispatch(incrementView({ videoId: id, channelId: videoDetails.snippet.channelId }))
    }
  }, [id, videoDetails?.snippet?.channelId, dispatch])

  // HISTORY
  useEffect(() => {
    if (videoDetails?.snippet?.title) {
      dispatch(addToHistory({
        videoId: id,
        title: videoDetails.snippet.title,
        timestamp: new Date().toISOString()
      }))
    }
  }, [videoDetails?.snippet?.title, id, dispatch])

  const handleCommentSubmit = (e) => {
    e.preventDefault()
    if (commentText.trim()) {
      dispatch(addComment({ videoId: id, text: commentText }))
      setCommentText('')
    }
  }

  const handleDeleteComment = (commentId) => {
    dispatch(deleteComment(commentId))
  }

  return (
    <div className="bg-white min-h-screen text-black">

      <div
        className={`
          pt-20 px-4 lg:flex lg:gap-6 transition-all duration-300
          ${sidebarExtend ? "sm:pl-[240px]" : "sm:pl-[80px]"}
        `}
      >

        {/* LEFT */}
        <div className="w-full lg:max-w-[850px]">

          {/* VIDEO */}
          <div className="w-full h-[240px] sm:h-[320px] lg:h-[430px]">
            <ReactPlayer
              width="100%"
              height="100%"
              url={`https://www.youtube.com/watch?v=${id}`}
              controls
            />
          </div>

          {/* TITLE */}
          <h2 className="text-xl font-semibold mt-3">
            {videoDetails?.snippet?.title}
          </h2>

          {/* CHANNEL + ACTIONS */}
          <div className="flex flex-col sm:flex-row justify-between mt-4 gap-3">

            <h5
              onClick={() => navigate(`/channel/${videoDetails?.snippet?.channelId}`)}
              className="cursor-pointer font-medium text-gray-800"
            >
              {videoDetails?.snippet?.channelTitle}
            </h5>

            {/* 👍 👎 UI FIXED (SAME STYLE) */}
            <div className="flex gap-3 items-center">

              {/* LIKE */}
              <button
                onClick={() => {
                  if (!isAuthenticated) return alert('Login first')
                  if (isLiked) dispatch(toggleLike(id))
                  else {
                    if (isUnliked) dispatch(toggleUnlike(id))
                    dispatch(toggleLike(id))
                  }
                }}
                className="
                  flex items-center gap-2 px-4 py-2
                  bg-gray-100 rounded-full
                  hover:bg-gray-200 transition
                  text-sm font-medium
                "
              >
                {isLiked ? (
                  <FaThumbsUp className="text-blue-600" />
                ) : (
                  <FiThumbsUp />
                )}

                <span>
                  {convertToInternationalCurrencySystem(
                    (videoDetails?.statistics?.likeCount || 0) + likeCount
                  )}
                </span>
              </button>

              {/* DISLIKE (NOW SAME UI AS LIKE) */}
              <button
                onClick={() => {
                  if (!isAuthenticated) return alert('Login first')
                  if (isUnliked) dispatch(toggleUnlike(id))
                  else {
                    if (isLiked) dispatch(toggleLike(id))
                    dispatch(toggleUnlike(id))
                  }
                }}
                className="
                  flex items-center gap-2 px-4 py-2
                  bg-gray-100 rounded-full
                  hover:bg-gray-200 transition
                  text-sm font-medium
                "
              >
                {isUnliked ? (
                  <FaThumbsDown className="text-blue-600" />
                ) : (
                  <FiThumbsDown />
                )}

                <span>
                  {convertToInternationalCurrencySystem(unlikeCount || 0)}
                </span>
              </button>

              <span className="text-sm text-gray-600">
                {convertToInternationalCurrencySystem(
                  (videoDetails?.statistics?.viewCount || 0) + viewCount
                )} views
              </span>

            </div>
          </div>

          {/* COMMENTS */}
          <div className="mt-8">
            <h3 className="font-semibold mb-4">
              {comments?.length || 0} Comments
            </h3>

            {isAuthenticated ? (
              <form onSubmit={handleCommentSubmit}>
                <textarea
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full border p-3 rounded"
                />
                <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">
                  Comment
                </button>
              </form>
            ) : (
              <p className="text-gray-500">Login to comment</p>
            )}

            <div className="mt-4 space-y-4">
              {comments?.map((comment) => (
                <div key={comment.id} className="bg-gray-100 p-3 rounded">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-sm font-medium">{comment.userEmail}</p>
                      <p className="text-sm">{comment.text}</p>
                      <p className="text-xs text-gray-500">
                        {timeSince(new Date(comment.createdAt))}
                      </p>
                    </div>

                    {user?.id === comment.userId && (
                      <button onClick={() => handleDeleteComment(comment.id)}>
                        <FaTrash className="text-red-500" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT */}
        <div className="mt-10 lg:mt-0 flex flex-col gap-4">
          {relatedVideos?.map((e, index) => (
            <Video
              key={index}
              thumbnail={e?.snippet?.thumbnails?.medium?.url}
              title={e?.snippet?.title}
              channel={e?.snippet?.channelTitle}
              on={timeSince(new Date(e?.snippet?.publishedAt))}
              channelId={e?.snippet?.channelId}
              videoId={e?.id?.videoId}
            />
          ))}
        </div>

      </div>
    </div>
  )
}

export default VideoDetails
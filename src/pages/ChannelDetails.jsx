import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import VideoCard from '../components/VideoCard'
import { getChannelVideos, getChannelDetails } from '../redux/channelSlice'
import { fetchSubscriptions, toggleSubscription } from '../redux/subscriptionSlice'
import { fetchChannelViews } from '../redux/viewSlice'
import convertToInternationalCurrencySystem from '../utils/convert'
import timeSince from '../utils/date'
import { colors } from '../theme'

function ChannelDetails() {
  const { id } = useParams()
  const dispatch = useDispatch()

  const { sidebarExtend } = useSelector((state) => state.category)
  const { channelDetails, channelVideos } = useSelector((state) => state.channel)
  const { isSubscribed, count: subscriberCount } = useSelector((state) => state.subscriptions)
  const { isAuthenticated } = useSelector((state) => state.auth)
  const { channelCount: viewCount } = useSelector((state) => state.views)

  const aDay = 24 * 60 * 60 * 1000

  useEffect(() => {
    if (id) {
      dispatch(getChannelVideos(`search?channelId=${id}&part=snippet&order=date`))
      dispatch(getChannelDetails(`channels?part=snippet&id=${id}`))
      dispatch(fetchSubscriptions(id))
      dispatch(fetchChannelViews(id))
    }
  }, [id, dispatch])

  const handleSubscribe = () => {
    if (isAuthenticated) {
      dispatch(toggleSubscription(id))
    } else {
      alert('Please login to subscribe')
    }
  }

  return (
    <>
      {/* overlay */}
      <div className={`sm:hidden overlayEffect ${sidebarExtend ? "block" : "hidden"}`}></div>

      <div className={`pt-14 pl-0 ${sidebarExtend ? "sm:pl-[180px]" : "sm:pl-[70px]"}`}>

        {/* BANNER */}
        <div className="w-full h-[120px] sm:h-[160px] lg:h-[210px] bg-gray-200 overflow-hidden">
          <img
            className="w-full h-full object-cover"
            src={channelDetails?.brandingSettings?.image?.bannerExternalUrl}
            alt="channel banner"
          />
        </div>

        {/* CHANNEL INFO */}
        <div className="flex items-center gap-x-5 my-5 px-4">

          <img
            className="rounded-full w-12 h-12 md:w-16 md:h-16 object-cover"
            src={channelDetails?.snippet?.thumbnails?.medium?.url}
            alt="channel avatar"
          />

          <div className="flex flex-col">
            <h3 className="text-md md:text-xl font-medium tracking-wide">
              {channelDetails?.snippet?.title}
            </h3>

            <div className="flex flex-col">
              <span
                className="text-[12px] md:text-[14px] font-medium"
                style={{ color: colors.textTertiary }}
              >
                {channelDetails?.snippet?.customUrl}
              </span>

              <span
                className="text-[12px] md:text-[13px] font-medium"
                style={{ color: colors.textTertiary }}
              >
                {convertToInternationalCurrencySystem(
                  (channelDetails?.statistics?.subscriberCount || 0) + (subscriberCount || 0)
                )} subscribers
              </span>

              <span
                className="text-[12px] md:text-[13px] font-medium"
                style={{ color: colors.textTertiary }}
              >
                {convertToInternationalCurrencySystem(
                  (channelDetails?.statistics?.viewCount || 0) + (viewCount || 0)
                )} views
              </span>
            </div>
          </div>

          {/* SUBSCRIBE BUTTON (UNCHANGED LOGIC) */}
          <button
            onClick={handleSubscribe}
            className={`ml-auto md:ml-0 px-4 py-2 rounded-full font-medium text-sm transition-colors ${
              isSubscribed
                ? 'bg-gray-200 text-gray-800 border border-gray-400 hover:bg-gray-300'
                : 'text-white hover:opacity-90'
            }`}
            style={{
              backgroundColor: isSubscribed ? '#8adaf5' : '#44a6c6',
              color: isSubscribed ? '#1f2937' : '#ffffff',
              border: isSubscribed ? '1px solid #0f7da2' : 'none'
            }}
          >
            {isSubscribed ? 'Subscribed' : 'Subscribe'}
          </button>

        </div>

        {/* VIDEOS SECTION */}
        <div className="px-4">
          <h4
            className="text-[16px] font-bold tracking-wider"
            style={{ color: colors.textMuted }}
          >
            VIDEOS
          </h4>

          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-4">
            {channelVideos?.map((e, index) => (
              <VideoCard
                key={index}
                thumbnail={e?.snippet?.thumbnails?.medium?.url}
                width="210px"
                title={e?.snippet?.title}
                channel={e?.snippet?.channelTitle}
                on={timeSince(new Date(Date.parse(e?.snippet?.publishedAt) - aDay))}
                channelId={e?.snippet?.channelId}
                videoId={e?.id?.videoId}
              />
            ))}
          </div>
        </div>

      </div>
    </>
  )
}

export default ChannelDetails
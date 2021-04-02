import request from '@/utils/request'

export default {
  // 添加小节信息
  addVideo(video) {
    return request({
      url: `/eduservice/eduvideo/addVideo`,
      method: 'post',
      data: video
    })
  },
  // 删除小节信息
  removeVideo(videoId) {
    return request({
      url: `/eduservice/eduvideo/${videoId}`,
      method: 'delete'
    })
  },
  // 删除视频信息
  deleteAliyunVideo(id) {
    return request({
      url: `/eduvod/video/deleteAlyVideo/${id}`,
      method: 'delete'
    })
  }
}
import request from '@/utils/request'

export default {
  // 查询章节列表
  getAllChapterVideoByCourseId(courseId) {
    return request({
      url: `/eduservice/chapter/getChapterVideo/${courseId}`,
      method: 'get'
    })
  },
  // 添加章节
  addChapter(chapter) {
    return request({
      url: `/eduservice/chapter/addChapter`,
      method: 'post',
      data: chapter
    })
  },
  // 查询章节
  getChapter(courseId) {
    return request({
      url: `/eduservice/chapter/getChapterById/${courseId}`,
      method: 'get'
    })
  },
  // 修改章节
  updateChapter(chapter) {
    return request({
      url: `/eduservice/chapter/updateChapter`,
      method: 'post',
      data: chapter
    })
  },
  // 删除章节
  deleteChapter(capterId) {
    return request({
      url: `/eduservice/chapter/${capterId}`,
      method: 'delete'
    })
  }
}
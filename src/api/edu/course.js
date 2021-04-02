import request from '@/utils/request'

export default {
  // 添加课程信息
  addCourseInfo(courseInfo) {
    return request({
      url: `/eduservice/educourse/addCourseInfo`,
      method: 'post',
      data: courseInfo
    })
  },
  // 查询所有教师信息
  getAllTeacherList() {
    return request({
      url: `/eduservice/teacher/findAll`,
      method: 'get'
    })
  },
  // 查询课程信息
  getCourseInfo(id) {
    return request({
      url: `/eduservice/educourse/getCourseInfo/${id}`,
      method: 'get'
    })
  },

  // 修改课程信息
  updateCourseInfo(courseInfo) {
    return request({
      url: `/eduservice/educourse/updateCourse`,
      method: 'post',
      data: courseInfo
    })
  },

  // 查询最终发布信息回显
  getCoursePublishInfo(id) {
    return request({
      url: `/eduservice/educourse/getCoursePublish/${id}`,
      method: 'get'
    })
  },

  // 课程信息最终发布确认
  updatePublish(id) {
    return request({
      url: `/eduservice/educourse/updatePublish/${id}`,
      method: 'post'
    })
  },

  // 查询所有课程信息列表
  getCourseList() {
    return request({
      url: `/eduservice/educourse`,
      method: 'get'
    })
  },
  // 删除课程信息
  deleteCourseInfo(id) {
    return request({
      url: `/eduservice/educourse/${id}`,
      method: 'delete'
    })
  }
}
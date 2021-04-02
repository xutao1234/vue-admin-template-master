<template>

    <div class="app-container">
  
      <h2 style="text-align: center;">发布新课程</h2>
  
      <el-steps :active="1" process-status="wait" align-center style="margin-bottom: 40px;">
        <el-step title="填写课程基本信息"/>
        <el-step title="创建课程大纲"/>
        <el-step title="提交审核"/>
      </el-steps>
  
      <el-form label-width="120px">

        <el-form-item label="课程标题">
          <el-input v-model="courseInfo.title" placeholder=" 示例：机器学习项目课：从基础到搭建项目视频课程。专业名称注意大小写"/>
        </el-form-item>
      
        <!-- 所属分类 TODO -->
        <el-form-item label="课程分类">
          <el-select v-model="courseInfo.subjectId" 
          placeholder="一级分类" @change="subjectLevelOneChange">
          <el-option
          v-for="subject in subjectOneList"
          :key="subject.id"
          :label="subject.title"
          :value="subject.id"/>
          </el-select>

          <el-select v-model="courseInfo.subjectParentId" 
          placeholder="二级分类">
          <el-option
          v-for="subject in subjectTwoList"
          :key="subject.id"
          :label="subject.title"
          :value="subject.id"/>
          </el-select>
        </el-form-item>

        <!-- 课程讲师 TODO -->
        <el-form-item label="课程讲师">
          <el-select v-model="courseInfo.teacherId" 
          placeholder="请选择">
          <el-option
          v-for="teacher in teacherList"
          :key="teacher.id"
          :label="teacher.name"
          :value="teacher.id"/>
          </el-select>
        </el-form-item>

        <el-form-item label="总课时">
          <el-input-number :min="0" v-model="courseInfo.lessonNum" controls-position="right" placeholder="请填写课程的总课时数"/>
        </el-form-item>
      
        <!-- 课程简介 TODO -->
        <!-- 课程简介-->
        <el-form-item label="课程简介">
          <tinymce :height="300" v-model="courseInfo.description"/>
        </el-form-item>
      
        <!-- 课程封面 TODO -->
        <el-form-item label="课程封面">
          <el-upload
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
            :action="BASE_API+'/eduoss/fileoss'"
            class="avatar-uploader">
            <img :src="courseInfo.cover">
          </el-upload>
        </el-form-item>
      
        <el-form-item label="课程价格">
          <el-input-number :min="0" v-model="courseInfo.price" controls-position="right" placeholder="免费课程请设置为0元"/> 元
        </el-form-item>
      
        <el-form-item>
          <el-button :disabled="saveBtnDisabled" type="primary" @click="saveOrUpdate">保存并下一步</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
  <script>
  import course from '@/api/edu/course'
  import subject from '@/api/edu/subject'
  import Tinymce from '@/components/Tinymce' //引入组件

  export default {
    // 声明组件
    components: { Tinymce },

    data() {
      return {
        saveBtnDisabled: false, // 保存按钮是否禁用
        courseInfo: {
          title: '',
          subjectId: '',
          subjectParentId: '',
          teacherId: '',
          lessonNum: 0,
          description: '',
          cover: '/static/01.jpg',
          price: 0
        },
        courseId:"",
        BASE_API: process.env.BASE_API,//接口API地址
        teacherList:[], //封装所有讲师
        subjectOneList:[],// 课程一级分类
        subjectTwoList:[] // 课程二级分类
      }
    },
  
    created() {
      console.log('info created')
      this.init()
      this.courseInfo.cover="/static/01.jpg"
    },
    watch: {
      $route(to,from) {
        this.init()
      }
    },
    methods: {
      init() {
        // 取地址栏中传回的课程ID
      if(this.$route.params && this.$route.params.id){
        this.courseId = this.$route.params.id
        this.getCourseInfo()
      }else {
        
        // 初始化所有讲师
        this.getAllTeacherList()
        // 初始化所有课程分类二级联动
        this.getAllSubject()

        this.courseInfo = {}
      }
      },
      //查询课程信息做回显
      getCourseInfo() {
        course.getCourseInfo(this.courseId)
        .then(response => {
          this.courseInfo = response.data.courseInfoVo
          //获取所有的一级和二级课程目录
          subject.getAllSubject()
          .then(response => {
            //所有的一级目录
            this.subjectOneList = response.data.list;
           
            // 遍历所有的一级目录
            for(var i=0;i<this.subjectOneList.length;i++){
              var oneSubject = this.subjectOneList[i];
              
              //判断，如果一级目录的ID与二级目录的父级ID相等，就取出该一级目录中的二级目录
              if(this.courseInfo.subjectId == oneSubject.id){
                this.subjectTwoList = oneSubject.children
              }
            }
          })
          // 初始化所有讲师
          this.getAllTeacherList()
        })
      },
      handleAvatarSuccess(res, file) {
        console.log(res)// 上传响应
        console.log(URL.createObjectURL(file.raw))// base64编码
        this.courseInfo.cover = res.data.url
      },

      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      },

      // 一级分类发生改变是动态获取二级分类
      subjectLevelOneChange(value) {
        // value就是一级分类的ID值
        for(var i=0;i<this.subjectOneList.length;i++){
          // 每一个一级分类
          var oneSubject=this.subjectOneList[i];
          // 判断：所有一级分类ID和点击的一级分类ID是否一样
          if(oneSubject.id === value){
            // 从一级分类获取里面多有的二级分类
            this.subjectTwoList = oneSubject.children;
            // 将二级分类中的ID清空
            this.courseInfo.subjectParentId = "";
          }
        }
      },
      //所有课程分类信息
      getAllSubject() {
        subject.getAllSubject()
        .then(response => {
          this.subjectOneList = response.data.list;
        })
      },
      // 查询所有讲师信息
      getAllTeacherList() {
        course.getAllTeacherList()
        .then(response => {
          this.teacherList=response.data.items;
        })
      },
      // 保存课程信息
      saveOrUpdate() {
        // 判断是添加还是修改，根据地址栏中是否有courseid来判断
        if(!this.courseId){
          // 添加
          this.addcourse()
        }else{
          //修改
          this.updateCourse()
        }
      },
      addcourse() {
        course.addCourseInfo(this.courseInfo)
        .then(response => {
          this.$message({
            type: 'success',
            message: '添加课程信息成功！'
          })
          this.$router.push({ path:'/course/chapter/'+response.data.courseId})
        })
      },
      updateCourse() {
        course.updateCourseInfo(this.courseInfo)
        .then(response => {
          this.$message({
            type: 'success',
            message: '修改课程信息成功！'
          })
          this.$router.push({ path:'/course/chapter/'+this.courseId})
        })
      }
    }
  }
  </script>
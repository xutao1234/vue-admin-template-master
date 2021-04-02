<template>

    <div class="app-container">
  
      <h2 style="text-align: center;">发布新课程</h2>
  
      <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
        <el-step title="填写课程基本信息"/>
        <el-step title="创建课程大纲"/>
        <el-step title="提交审核"/>
      </el-steps>
      

      <el-button type="text" @click="openChapterDialog">添加章节</el-button>
      <!-- 章节 -->
      <ul class="chanpterList">
          <li
              v-for="chapter in chapterVideoList"
              :key="chapter.id">
              <p>
                  {{ chapter.title }}

                  <span class="acts">
                    <el-button type="text" @click="openVideoDialog(chapter.id)">添加小节</el-button>
                    <el-button style="" type="text" @click="editChapterDialog(chapter.id)">编辑</el-button>
                    <el-button type="text" @click="removeChapterById(chapter.id)">删除</el-button>
                  </span>
              </p>
              <ul class="videoList">
                <li
                    v-for="vedio in chapter.children"
                    :key="vedio.id">
                    <p>
                        {{ vedio.title }}

                        <span class="acts">
                          <el-button style="" type="text" @click="editVideoDialog(vedio.id)">编辑</el-button>
                          <el-button type="text" @click="removeVideoById(vedio.id)">删除</el-button>
                        </span>
                    </p>
                </li>
            </ul>
          </li>
      </ul>
      <el-form label-width="120px">
  
        <el-form-item>
          <el-button @click="previous">上一步</el-button>
          <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
        </el-form-item>
      </el-form>

      <!-- 添加和修改章节表单 -->
      <el-dialog :visible.sync="dialogChapterFormVisible" title="添加章节">
        <el-form :model="chapter" label-width="120px">
            <el-form-item label="章节标题">
                <el-input v-model="chapter.title"/>
            </el-form-item>
            <el-form-item label="章节排序">
                <el-input-number v-model="chapter.sort" :min="0" controls-position="right"/>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 添加和修改小节表单-->
      <el-dialog :visible.sync="dialogVideoFormVisible" title="添加小节">
        <el-form :model="video" label-width="120px">
            <el-form-item label="课时标题">
                <el-input v-model="video.title"/>
            </el-form-item>
            <el-form-item label="课时排序">
                <el-input-number v-model="video.sort" :min="0" controls-position="right"/>
            </el-form-item>
            <el-form-item label="是否免费">
                <el-radio-group v-model="video.isFree">
                  <el-radio :label="true">免费</el-radio>
                  <el-radio :label="false">默认</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="上传视频">
              <el-upload
                     :on-success="handleVodUploadSuccess"
                     :on-remove="handleVodRemove"
                     :before-remove="beforeVodRemove"
                     :on-exceed="handleUploadExceed"
                     :file-list="fileList"
                     :action="BASE_API+'/eduvod/video/uploadVideo'"
                     :limit="1"
                     class="upload-demo">
              <el-button size="small" type="primary">上传视频</el-button>
              <el-tooltip placement="right-end">
                  <div slot="content">最大支持1G，<br>
                      支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                      GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                      MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                      SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
                  <i class="el-icon-question"/>
              </el-tooltip>
              </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="saveOrUpdateVideo">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </template>
  
  <script>
  import chapter from '@/api/edu/chapter'
  import video from '@/api/edu/video'
  export default {
    data() {
      return {
        courseId: "",
        chapterVideoList:[],
        saveBtnDisabled: false, // 保存按钮是否禁用
        dialogChapterFormVisible: false,
        dialogVideoFormVisible: false,
        chapter:{
        
          title: "",
          sort: 0
        },
        video:{
          title:"",
          sort:0,
          isFree:"",
          videoSourceId:"",
          videoOriginalName:""
        },
        fileList: [],//上传文件列表
        BASE_API: process.env.BASE_API // 接口API地址
      }
    },
  
    created() {
      console.log('chapter created')
      if(this.$route.params && this.$route.params.id){
        this.courseId = this.$route.params.id
        this.getChapterVideo()
        console.log(this.chapterVideoList)
      }
    
    },
  
    methods: {
      // 删除视频
      // 点击确认删除调用的方法
      handleVodRemove(file,fileList) {
        video.deleteAliyunVideo(this.video.videoSourceId)
          .then(response => {
            this.$message({
              type: 'success',
              message: '删除成功'
            })
            // 清空文件列表
            this.fileList= []
            //清空
            // 上传之后的文件ID
            this.video.videoSourceId = "";
            // 上传的文件名称
            this.video.videoOriginalName = "";
          })
      },
      // 点击X，调的方法
      beforeVodRemove(file,fileList) {
        return this.$confirm(`确定移除${file.name}`)
      },

      // 上传视频
      //成功回调
      handleVodUploadSuccess(response, file, fileList) {
        // 上传之后的文件ID
        this.video.videoSourceId = response.data.videoId
        // 上传的文件名称
        this.video.videoOriginalName = file.name
      },
      //视图上传多于一个视频
      handleUploadExceed(files, fileList) {
        this.$message.warning('想要重新上传视频，请先删除已上传的视频')
      },


// =============================小节操作====================
      // 初始化小节弹窗
      openVideoDialog(chapterId){
        this.dialogVideoFormVisible = true
        this.video = {}
        // 章节ID
        this.video.chapterId = chapterId
      },

      // 添加小节
      addVideoInfo(){
        // 课程ID
        this.video.courseId = this.courseId
        video.addVideo(this.video)
        .then(response => {
          this.dialogVideoFormVisible = false
          this.$message({
            type: 'success',
            message: '添加小节信息成功！'
          })
          //刷新页面
          this.getChapterVideo()
        })
      },
      //删除小节
      removeVideoById(id) {
        this.$confirm('删除小节, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          video.removeVideo(id)
            .then(response => {
            this.dialogVideoFormVisible = false
            this.$message({
              type: 'success',
              message: '删除小节信息成功！'
            })
            //刷新页面
            this.getChapterVideo()
          })
        })
      },
      //修改小节信息回显
      editVideoDialog(id) {
        alert(id);
      },

      saveOrUpdateVideo() {
        this.addVideoInfo()
      },


// =============================章节操作====================
      //编辑页回显章节信息
      editChapterDialog(chapterId) {
        chapter.getChapter(chapterId)
        .then(response => {
          this.dialogChapterFormVisible = true
          this.chapter=response.data.chapter
        })
      },
      
      // 初始化章节弹窗
      openChapterDialog() {
        this.dialogChapterFormVisible =true
        this.chapter.title = ""
        this.chapter.sort = 0
      },
      addChapter() {
        //将课程ID赋给章节实体
        this.chapter.courseId=this.courseId
        chapter.addChapter(this.chapter)
        .then(response => {
          this.dialogChapterFormVisible = false
          this.$message({
            type: 'success',
            message: '添加章节信息成功！'
          })
          //刷新页面
          this.getChapterVideo()

        })
      },
      //修改章节信息
      updateChapter(){
        chapter.updateChapter(this.chapter)
        .then(response => {
          this.dialogChapterFormVisible = false
          this.$message({
            type: 'success',
            message: '修改章节信息成功！'
          })
          //刷新页面
          this.getChapterVideo()
        })
      },
      // 删除章节信息
      removeChapterById(chapterId) {
        
        this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          chapter.deleteChapter(chapterId)
          .then(response => {
            this.dialogChapterFormVisible = false
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            //刷新页面
            this.getChapterVideo()
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      
      },
      saveOrUpdate() {
        if(!this.chapter.id){
          this.addChapter()
        }else{
          this.updateChapter()
        }
      },
      getChapterVideo(){
        chapter.getAllChapterVideoByCourseId(this.courseId)
        .then(response => {
          this.chapterVideoList = response.data.list;
        })
      },
      previous() {
        console.log('previous')
        this.$router.push({ path: '/course/info/' + this.courseId })
      },
  
      next() {
        console.log('next')
        this.$router.push({ path: '/course/publish/' + this.courseId })
      }
    }
  }
  </script>

<style scoped>
  .chanpterList{
      position: relative;
      list-style: none;
      margin: 0;
      padding: 0;
  }
  .chanpterList li{
    position: relative;
  }
  .chanpterList p{
    
    font-size: 20px;
    margin: 10px 0;
    padding: 10px;
    height: 70px;
    line-height: 50px;
    width: 100%;
    border: 1px solid #DDD;
  }
  .chanpterList .acts {
      float: right;
      font-size: 14px;
  }
  
  .videoList{
    padding-left: 50px;
  }
  .videoList p{
    
    font-size: 14px;
    margin: 10px 0;
    padding: 10px;
    height: 50px;
    line-height: 30px;
    width: 100%;
    border: 1px dotted #DDD;
  }
  
  </style>
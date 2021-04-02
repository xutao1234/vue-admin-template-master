<template>
    <div class="app-container">
        <el-form label-width="120px">
        <el-form-item label="选择Excel">
            <el-upload
                class="upload-demo"
                ref="upload"
                :action="BASE_API+'/eduservice/subject/addSubject'"
                :on-success="fileUploadSuccess"
                :on-error="fileUploadError"
                :disabled="importBtnDisabled"
                :limit="1"
                :auto-upload="false">
                <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                <el-button style="margin-left: 10px;" size="small" type="success"
                     @click="submitUpload">上传到服务器</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
        </el-form-item>
    </el-form>
    </div>
</template>
<script>
    export default {
        data() {
            return {
              BASE_API: process.env.BASE_API,
              importBtnDisabled: false,
              loanding: false  
            }
        },
        created() {

        },
        methods: {
        submitUpload() {
            this.$refs.upload.submit();
        },
        fileUploadSuccess(response) {
            if(this.response.success == ture){
                this.loanding = false
                this.$message({
                    type: 'success',
                    message: '导入成功'
                })
                //跳转到课程列表页
                this.$router.push({path:'/subject/list'})
            }
        },
        fileUploadError(response) {
                this.loanding = false
                this.$message({
                    type: 'error',
                    message: '导入失败'
                })
            }
        }
    }
    </script>
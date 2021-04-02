<template>
    <div class="app-container">
            <!--查询表单-->
    <<el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-input v-model="courseQuery.title" placeholder="课程名"/>
        </el-form-item>
  
        <el-form-item>
          <el-select v-model="courseQuery.status" clearable placeholder="课程状态">
            <el-option :value="Normal" label="已发布"/>
            <el-option :value="Draft" label="未发布"/>
          </el-select>
        </el-form-item>
  
        <!--<el-form-item label="添加时间">
          <el-date-picker
            v-model="teacherQuery.begin"
            type="datetime"
            placeholder="选择开始时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
          />
        </el-form-item>
        <el-form-item>
          <el-date-picker
            v-model="teacherQuery.end"
            type="datetime"
            placeholder="选择截止时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            default-time="00:00:00"
          />
        </el-form-item>-->
  
        <el-button type="primary" icon="el-icon-search" @click="getList()">查询</el-button>
        <el-button type="default" @click="resetData()">清空</el-button>
      </el-form>
    <!-- 表格 -->
    <el-table
    v-loading="listLoading"
    :data="list"
    element-loading-text="数据加载中"
    border
    fit
    highlight-current-row>

    <el-table-column
      label="序号"
      width="70"
      align="center">
      <template slot-scope="scope">
        {{ (page - 1) * limit + scope.$index + 1 }}
      </template>
    </el-table-column>

    <el-table-column prop="title" label="课程名称" width="80" />

    <el-table-column label="状态" width="80">
      <template slot-scope="scope">
        {{ scope.row.status==='Normal'?'已发布':'未发布' }}
      </template>
    </el-table-column>

    <el-table-column prop="lessonNum" label="课时" width="160"/>

    <el-table-column prop="gmtCreate" label="添加时间" width="560"/>

    <el-table-column prop="price" label="价格" width="60" />

    <el-table-column label="操作" width="200" align="center">
      <template slot-scope="scope">
        <router-link :to="'/teacher/edit/'+scope.row.id">
          <el-button type="primary" size="mini" icon="el-icon-edit">修改课程信息</el-button>
        </router-link>
        <router-link :to="'/teacher/edit/'+scope.row.id">
            <el-button type="primary" size="mini" icon="el-icon-edit">修改大纲信息</el-button>
          </router-link>
        <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteCourseById(scope.row.id)">删除课程信息</el-button>
      </template>
    </el-table-column>
  </el-table>
     <!-- 分页 -->
     <el-pagination
     :current-page="page" 当前页
     :page-size="limit" 每页记录数
     :total="total" 总记录数
     style="padding: 30px 0; text-align: center;"
     layout="total, prev, pager, next, jumper"
     @current-change="getList" 分页的方法
   />
    </div>
</template>
<script>
//引入调用teacher.js文件
import course from '@/api/edu/course'
export default {
    //写核心代码位置
    data() {
        return {
            list:null,//查询之后接口返回的集合
            page:1,//当前页
            limit:10,//每页记录数
            total:0,//总记录数
            courseQuery:{}//条件封装对象
        }
    },
    created() { //页面渲染之前执行，一般调用method中定义的方法
        this.getList()
    },
    methods:{ // 创建具体的方法，调用course.js定义的方法
        // 删除课程信息
        deleteCourseById(id){
          this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
              course.deleteCourseInfo(id)
              .then(response => {
                this.$message({
                    type: 'success',
                    message: '删除成功!'
                });
                this.getList()
              })
            })
        },
        //课程列表的方法
        getList(page = 1) {
            this.page = page
            course.getCourseList(this.page,this.limit,this.courseQuery)
            .then(response => {// 请求成功
                //reponse接口返回的数据
                this.list = response.data.list
                this.total = response.data.total
            })
            .catch(error => {//请求失败
                console.log(error)
            })
        },
        resetData() {
            //清空表单输入项数据
            this.courseQuery = {}
            //查询所有
            this.getList()
        }
    }
}
</script>
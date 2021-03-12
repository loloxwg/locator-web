<template>
  <div class="gh_employeeUDSI">
    <div class="gh_btnBox">
      <el-button
        class="gh_btn el-icon-setting"
        type="primary"
        plain
        size="small"
        @click="editBtnShow = !editBtnShow"
        >编辑
      </el-button>
      <el-button
        class="gh_btn el-icon-circle-plus-outline"
        type="success"
        plain
        size="small"
        @click="editEmployee(0)"
        >添加
      </el-button>
    </div>
    <el-table
      :data="emps.list"
      style="width: 100%"
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="{ textAlign: 'center' }"
    >
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="empDate" label="注册时间">
        <template slot-scope="scope">{{
          scope.row.empDate | formatDate
        }}</template>
      </el-table-column>
      <el-table-column prop="empId" label="员工号"></el-table-column>
      <el-table-column prop="empName" label="姓名"> </el-table-column>
      <el-table-column prop="empSex" label="性别"> </el-table-column>
      <el-table-column prop="empAge" label="年龄">
        <template scope="scope">
          {{ scope.row.empAge || '---' }}
        </template>
      </el-table-column>
      <el-table-column prop="empTel" label="电话">
        <template scope="scope">
          {{ scope.row.empTel || '---' }}
        </template>
      </el-table-column>
      <el-table-column prop="empJob" label="职位"
        ><template scope="scope">
          {{ scope.row.empJob || '---' }}
        </template>
      </el-table-column>
      <el-table-column prop="empHobby" label="特长" show-overflow-tooltip>
        <template scope="scope">
          {{ scope.row.empHobby || '---' }}
        </template>
      </el-table-column>
      <el-table-column prop="empMsg" label="履历" show-overflow-tooltip>
        <template scope="scope">
          {{ scope.row.empMsg || '---' }}
        </template>
      </el-table-column>
      <el-table-column v-if="editBtnShow" label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.$index, scope.row)">
            编辑
          </el-button>
          <el-popconfirm
            title="确定删除该员工吗？此操作不可逆转"
            @confirm="handleDelete(scope.$index, scope.row)"
          >
            <el-button size="mini" type="danger" slot="reference"
              >删除</el-button
            >
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      class="gh_page"
      @current-change="pageChange"
      layout="prev, pager, next"
      :total="emps.total"
    >
    </el-pagination>
    <empForm
      v-if="formShow"
      :formData="empFormData"
      @empFormShow="empFormShow"
    ></empForm>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
const empForm = () => import('@/components/empForm.vue')
export default {
  name: 'EmployeeUDSI',
  data() {
    return {
      pageNum: 1, // When you turn the page,it can save the page number,you can use it refresh the emps data when you change the data.
      emps: [], // All the employee models.
      editBtnShow: false, // If you can see the employee edit button.
      formShow: false, // If you can open the employee form.
      empFormData: null // When you click edit button,it will save your employee info which you want to edit.
    }
  },
  components: {
    empForm
  },
  filters: {
    formatDate: function(value) {
      return moment(value).format('YYYY-MM-DD')
    }
  },
  mounted() {
    // Get employee list.
    this.getEmp(1, 10)
  },
  methods: {
    // When the page is changed
    pageChange(res) {
      this.getEmp(res, 10)
      this.pageNum = res
    },
    // Get employee list.
    getEmp(page, limit) {
      var that = this
      axios
        .get(that.GLOBAL.serverUrl + 'locator_server/emp/query', {
          // 还可以直接把参数拼接在url后边
          params: {
            page: page,
            limit: limit
          }
        })
        .then(function(res) {
          that.emps = res.data
          // console.log(res.data)
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    // Edit employee form.
    handleEdit(index, row) {
      this.editEmployee(row)
    },
    // Delete the employee
    handleDelete(index, row) {
      var empId = row.empId
      var that = this
      axios
        .get(that.GLOBAL.serverUrl + 'locator_server/emp/delete?empId=' + empId)
        .then(function(res) {
          if (res.data === 1) {
            that.$message({
              message: '删除成功',
              type: 'success'
            })
          } else {
            that.$message.error('删除失败')
          }
          that.getEmp(that.pageNum, 10)
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    // Show the employee form.
    editEmployee(emp) {
      if (emp !== 0) {
        this.empFormData = { ...emp }
      }
      this.formShow = true
    },
    // Get the form close event.
    empFormShow(res) {
      this.formShow = res // res为false
      this.empFormData = null
      this.getEmp(1, 10)
    }
  }
}
</script>
<style lang="scss" scoped>
.gh_page {
  text-align: center;
}
.gh_btnBox {
  .gh_btn {
    float: right;
    margin: 0 5px;
  }
}
</style>

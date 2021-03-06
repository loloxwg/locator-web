<template>
  <div class="gh_empForm">
    <el-form
      class="gh_form"
      ref="ruleForm"
      :model="form"
      label-width="100px"
      :rules="rules"
    >
      <el-col>
        <el-form-item label="员工号:" prop="empId">
          <el-input v-model="form.empId"></el-input>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="员工姓名:" prop="empName">
          <el-input v-model="form.empName"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="性别:" prop="empSex">
          <el-radio-group v-model="form.empSex">
            <el-radio class="gh_radio" label="男"></el-radio>
            <el-radio class="gh_radio" label="女"></el-radio>
            <el-radio class="gh_radio" label="保密"></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="年龄:" prop="empAge">
          <el-input v-model.number="form.empAge"></el-input>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="员工电话:" prop="empTel">
          <el-input v-model="form.empTel"></el-input>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="员工职位:" prop="empJob">
          <el-input v-model="form.empJob"></el-input>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="员工特长:" prop="empHobby">
          <el-input v-model="form.empHobby"></el-input>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="员工履历:" prop="empMsg">
          <el-input type="textarea" v-model="form.empMsg"></el-input>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item>
          <el-button type="primary" @click="onSubmit('ruleForm')"
            >{{ edit ? '更新' : '添加' }}成员
          </el-button>
          <el-button @click="closeForm">取消</el-button>
        </el-form-item>
      </el-col>
    </el-form>
  </div>
</template>
<script>
import axios from 'axios'
import Qs from 'qs'
export default {
  props: ['formData'],
  data() {
    return {
      // The form messages.
      form: {
        empId: null,
        empName: null,
        empSex: null,
        empAge: null,
        empTel: null,
        empJob: null,
        empHobby: null,
        empMsg: null
      },
      rules: {
        empId: [
          { required: true, message: '员工号不能为空', trigger: 'change' }
        ],
        empName: [
          { required: true, message: '员工姓名不能为空', trigger: 'change' }
        ],
        empSex: [
          {
            required: true,
            message: '请选择性别',
            trigger: 'change'
          }
        ],
        empAge: [
          {
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (value !== '' && (value > 200 || value < 0)) {
                callback(new Error('年龄必须为正常人类年龄'))
              } else {
                callback()
              }
            }
          }
        ]
        /* empTel: [
          {
            trigger: 'change',
            validator: (rule, value, callback) => {
              if (value !== '' && !/^1[3456789]\d{9}$/.test(value)) {
                callback(new Error('请输入正确的手机号'))
              } else {
                callback()
              }
            }
          }
        ] */
      },
      // If you can edit the data,or you can add data.
      edit: false
    }
  },
  methods: {
    // When you submit the employee data.
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var form = this.form
          // 去掉empDate，empDate是CURRENT_TIMESTAMP自动生成的
          delete form.empDate
          // 保险起见去空值
          for (var i in form) {
            if (form[i] === null) {
              delete form[i]
            }
          }
          axios
            .post(
              this.GLOBAL.serverUrl +
                '/locator_server/emp/' +
                (this.edit ? 'update' : 'insert'),
              Qs.stringify(form)
            )
            .then(res => {
              this.$message({
                message: (this.edit ? '更新' : '插入') + '成功',
                type: 'success'
              })
              this.closeForm()
            })
            .catch(err => {
              this.$message.error('数据操作出错，打开控制台查看详细信息')
              console.log('err:', err)
            })
        } else {
          return false
        }
      })
    },
    // When you click the close butten.
    closeForm() {
      this.$emit('empFormShow', false)
    }
  },
  mounted() {
    // If you are edit,it will set the form data,or you are insert,it will change the site.
    if (this.formData) {
      this.form = this.formData
      this.edit = true
    }
  }
}
</script>
<style lang="scss" scoped>
.gh_empForm {
  // 定位
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  // 居中
  display: flex;
  justify-content: center;
  align-items: center;
  vertical-align: middle;
  background-color: #0008;
  z-index: 999;
  .gh_form {
    border-radius: 10px;
    background-color: #eee;
    padding: 50px;
    border: 1px solid #666;
    width: 500px;
    .gh_radio {
      margin-right: 6px;
    }
  }
}
</style>

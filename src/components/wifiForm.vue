<template>
  <div class="gh_wifiform">
    <el-form
      class="gh_form"
      ref="ruleForm"
      :model="wifiData"
      label-width="100px"
      :rules="rules"
    >
      <el-col :span="12">
        <el-form-item label="指纹号:" prop="wifiId">
          <el-input v-model="form.wifiId" :disabled="true"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="所处位置:" prop="wifiSiteId">
          <el-input v-model="form.wifiSiteId"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="横向位置:" prop="wifiGridX">
          <el-input v-model.number="form.wifiGridX"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="纵向位置:" prop="wifiGridY">
          <el-input v-model.number="form.wifiGridY"></el-input>
        </el-form-item>
      </el-col>
      <el-col>
        <el-form-item label="指纹信号:" prop="wifiSignal">
          <el-input v-model="form.wifiSignal"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="创建时间:">
          {{ wifiAddTime | formatDate }}
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="创建时间:">
          {{ wifiLastTime | formatDate }}
        </el-form-item>
      </el-col>
      <el-col style="text-align: center;">
        <el-button type="primary" @click="onSubmit('ruleForm')"
          >更新指纹
        </el-button>
        <el-button @click="closeForm">取消</el-button>
      </el-col>
    </el-form>
  </div>
</template>
<script>
import axios from 'axios'
import moment from 'moment'
export default {
  props: ['wifiData'],
  data() {
    return {
      form: {
        wifiId: '',
        wifiSiteId: '',
        wifiGridX: '',
        wifiGridY: '',
        wifiSignal: '',
        wifiLastTime: '',
        wifiAddTime: ''
      }, // The data in form.
      rules: {
        wifiId: [
          { required: true, message: '指纹号不能为空', trigger: 'change' }
        ],
        wifiSiteId: [
          { required: true, message: '所处位置不能为空！', trigger: 'change' }
        ],
        wifiGridX: [
          {
            type: 'number',
            required: true,
            message: '坐标为数值类型',
            trigger: 'change'
          }
        ],
        wifiGridY: [
          {
            type: 'number',
            required: true,
            message: '坐标为数值类型',
            trigger: 'change'
          }
        ]
      } // The rules of form.
    }
  },
  mounted() {
    if (this.wifiData) {
      for (var i in this.wifiData) {
        this.form[i] = this.wifiData[i]
      }
    }
  },
  filters: {
    formatDate: function(value) {
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  methods: {
    // When you click the close button.
    closeForm() {
      this.$emit('formClose', false)
    },
    // When you submit the form.
    onSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          var form = this.form
          delete form.wifiLastTime
          delete form.wifiAddTime
          for (var i in form) {
            if (form[i] === null || form[i] === '') {
              delete form[i]
            }
          }
          axios
            .get(this.GLOBAL.serverUrl + 'locator_server/wifi/update', {
              params: form
            })
            .then(res => {
              this.$message({ message: '更新成功！', type: 'success' })
              this.closeForm()
            })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.gh_wifiform {
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

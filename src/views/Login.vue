<template>
  <div class="gh_login"></div>
</template>

<script>
export default {
  mounted() {
    this.open()
  },
  methods: {
    open() {
      this.$prompt('验证信息:', '请输入验证信息', {
        confirmButtonText: '确定',
        showClose: true,
        showCancelButton: true,
        closeOnClickModal: true,
        inputPattern: /master/,
        inputErrorMessage: '验证信息不正确',
        inputPlaceholder: '请输入验证信息',
        inputType: 'password'
      }).then(({ value }) => {
        this.$message({
          type: 'success',
          message: '验证成功'
        })
        this.$router.push('/employeeinfo/employeelist/employeeudsi')
      })
    }
  }
}
</script>

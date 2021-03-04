<template>
  <div class="gh_employeeList gh_height100">
    <el-tabs
      class="gh_height100 gh_flexRow"
      :tab-position="'left'"
      @tab-click="handleClick"
      v-model="activeName"
    >
      <el-tab-pane name="employeeudsi" label="员工管理">
        <router-view name='employeeudsi'></router-view>
      </el-tab-pane>
      <el-tab-pane name="assigntask" label="发布任务">
        <router-view name='assigntask'></router-view>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeName: ''
    }
  },
  watch: {
    $route(to) {
      switch (to.matched[2].path) {
        case '/employeeinfo/employeelist/employeeudsi':
          this.activeName = 'employeeudsi'
          break
        case '/employeeinfo/employeelist/assigntask':
          this.activeName = 'assigntask'
          break
      }
    }
  },
  mounted() {
    switch (this.$route.matched[2].path) {
      case '/employeeinfo/employeelist/employeeudsi':
        this.activeName = 'employeeudsi'
        break
      case '/employeeinfo/employeelist/assigntask':
        this.activeName = 'assigntask'
        break
    }
  },
  methods: {
    handleClick(tab) {
      switch (tab.index) {
        case '0':
          this.$router.push('/employeeinfo/employeelist/employeeudsi')
          break
        case '1':
          this.$router.push('/employeeinfo/employeelist/assigntask')
          break
      }
    }
  }
}
</script>

<template>
  <div class="gh_employeeInfo gh_height100">
    <el-tabs
      class="gh_height100 gh_flexColumn"
      v-model="activeName"
      @tab-click="handleClick"
      type="border-card"
    >
      <el-tab-pane class="gh_height100" label="员工列表" name="employeelist">
        <router-view name="employeelist"></router-view>
      </el-tab-pane>
      <el-tab-pane class="gh_height100" label="员工位置" name="employeesite">
        <router-view name="employeesite"></router-view>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeName: 'employeelist'
    }
  },
  watch: {
    $route(to) {
      switch (to.matched[1].path) {
        case '/employeeinfo/employeelist':
          this.activeName = 'employeelist'
          break
        case '/employeeinfo/employeesite':
          this.activeName = 'employeesite'
          break
      }
    }
  },
  mounted() {
    switch (this.$route.matched[1].path) {
      case '/employeeinfo/employeelist':
        this.activeName = 'employeelist'
        break
      case '/employeeinfo/employeesite':
        this.activeName = 'employeesite'
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
          this.$router.push('/employeeinfo/employeesite')
          break
      }
    }
  }
}
</script>
<style lang="scss">
.el-tabs__content {
  flex: 1;
}
</style>

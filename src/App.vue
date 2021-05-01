<template>
  <div id="app">
    <el-container class="gh_height100">
      <el-header class="el-header">
        <label class="gh_title">基于Wifi指纹室内定位的外包服务人员管理系统</label>
      </el-header>
      <hr />
      <el-container>
        <el-aside width="200px">
          <el-menu :default-active="activeIndex"
                   class="gh_height100 el-menu"
                   background-color="#456"
                   text-color="#fff"
                   active-text-color="#fd5"
                   @select="handleVerticalSelect">
            <el-submenu index="1">
              <template slot="title">
                <i class="el-icon-s-custom"></i>
                <span>员工信息</span>
              </template>
              <el-menu-item-group>
                <el-submenu index="1-1">
                  <template slot="title">员工列表</template>
                  <el-menu-item index="EmployeeUDSI">员工管理</el-menu-item>
                  <el-menu-item index="AssignTask">发布任务</el-menu-item>
                </el-submenu>
                <el-menu-item index="EmployeeSite">员工位置</el-menu-item>
              </el-menu-item-group>
            </el-submenu>
            <el-menu-item index="WiFiInfo">
              <i class="el-icon-s-grid"></i>
              <span slot="title">指纹信息</span>
            </el-menu-item>
            <el-menu-item index="SiteInfo">
              <i class="el-icon-s-flag"></i>
              <span slot="title">地点信息</span>
            </el-menu-item>
          </el-menu>
        </el-aside>
        <el-container>
          <el-main class="el-main">
            <router-view name='main'></router-view>
          </el-main>
          <el-footer class=".el-footer">@guhun.nit.com</el-footer>
        </el-container>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeIndex: '0' // Which item are you select.
    }
  },
  watch: {
    $route (to) {
      switch (to.name) {
        case 'SiteInfo':
          this.activeIndex = 'SiteInfo'
          break
        case 'WiFiInfo':
          this.activeIndex = 'WiFiInfo'
          break
        case 'EmployeeSite':
          this.activeIndex = 'EmployeeSite'
          break
        case 'EmployeeUDSI':
          this.activeIndex = 'EmployeeUDSI'
          break
        case 'AssignTask':
          this.activeIndex = 'AssignTask'
          break
      }
    }
  },
  methods: {
    // When you select an item in VerticalSelect,it will change the router.
    handleVerticalSelect (key) {
      switch (key) {
        case 'EmployeeUDSI':
          this.$router.push('/employeeinfo/employeelist/employeeudsi')
          break
        case 'AssignTask':
          this.$router.push('/employeeinfo/employeelist/assigntask')
          break
        case 'EmployeeSite':
          this.$router.push('/employeeinfo/employeesite')
          break
        case 'WiFiInfo':
          this.$router.push('/wifiinfo')
          break
        case 'SiteInfo':
          this.$router.push('/siteinfo')
          break
      }
      // console.log(key, keyPath)
    }
  }
}
</script>
<style lang="scss">
* {
  font-family: "微软雅黑";
}
hr {
  padding: 0;
  margin: 0;
  color: #eee;
}
#app {
  height: 100vh;
}
body {
  margin: 0;
  padding: 0;
}
.el-tabs__content {
  overflow: auto;
}
.gh_height100 {
  height: 100%;
}
.gh_flex1 {
  flex: 1;
}
.gh_flexColumn {
  display: flex;
  flex-direction: column;
}
.gh_flexRow {
  display: flex;
  flex-direction: row;
}
</style>
<style lang="scss" scoped>
.gh_title {
  color: #eee;
  font-size: 22px;
  font-family: "微软雅黑";
}
.el-header,
.el-footer {
  background-color: #456;
  color: rgb(156, 150, 150);
  text-align: center;
  line-height: 60px;
}
.el-main {
  background-color: #eee;
  height: calc(100vh - 122px);
}
.el-menu {
  border: none;
}
</style>

<template>
  <div class="gh_employeeSite gh_height100">
    <div class="gh_map">
      <showMap @mapSend="mapSend($event)" :usersInfo="users"></showMap>
    </div>
    <div class="gh_table">
      <el-table
        :data="users"
        style="width: 100%"
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
        @row-click="rowClick"
      >
        <el-table-column type="index" :index="indexMethod"></el-table-column>
        <el-table-column prop="userId" label="用户名"></el-table-column>
        <el-table-column prop="siteName" label="所处位置">
          <template slot-scope="scope">{{scope.row.siteName || '0'}}</template>
        </el-table-column>
        <el-table-column prop="mapName" label="所处地图">
          <template slot-scope="scope">{{scope.row.mapName}}</template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="gh_page"
        @current-change="pageChange"
        layout="prev, pager, next"
        :total="users.total"
      ></el-pagination>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
const showMap = () => import('@/components/showMap.vue')
export default {
  name: 'EmployeeSite',
  components: {
    showMap
  },
  data () {
    return {
      users: [],
      pageNum: 1,
      pageSize: 10
    }
  },
  mounted () {
    this.getUsers(1, 9, 0)
  },
  methods: {
    // when the page is changed
    pageChange (res) {
      this.getUsers(res, 9)
    },
    // get users list
    getUsers (page, limit, mid) {
      var that = this
      axios
        .get(that.GLOBAL.serverUrl + 'locator_server/usersite/query', {
          // 还可以直接把参数拼接在url后边
          params: {
            page: page,
            limit: limit,
            mapId: mid
          }
        })
        .then(function (res) {
          var list = res.data.list
          // 当鼠标悬浮时地图高亮显示
          for (var item in list) {
            list[item].hover = false
          }
          that.users = list
          that.pageNum = res.data.pageNum
          that.pageSize = res.data.pageSize
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    // Count the user number which is in all users(it is not user id,because one user in the id maybe is deleted).
    indexMethod (index) {
      return index + (this.pageNum - 1) * this.pageSize + 1
    },
    // Filter the date style,bucause the vue filter can't use <br>.
    formatDate (value) {
      return moment(value).format('YYYY-MM-DD <br> HH:mm:ss')
    },
    // Get message from showMap son.
    mapSend (ev) {
      // console.log(ev)
      // 传过来map的对象
      this.getUsers(1, 9, ev.mapId)
    },
    rowClick (row) {
      var list = this.users
      for (var item in list) {
        list[item].hover = false
      }
      this.users = list
      row.hover = true
    }
  }
}
</script>
<style lang="scss" scoped>
.gh_employeeSite {
  display: flex;
  flex-direction: row;
  .gh_map {
    flex: 7;
  }
  .gh_table {
    flex: 3;
    border: solid #eee;
  }
  .gh_page {
    text-align: center;
  }
}
</style>

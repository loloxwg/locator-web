<template>
  <div class="gh_wifiInfo">
    <el-table
      :data="wifi.list"
      style="width: 100%"
      :header-cell-style="{ textAlign: 'center' }"
      :cell-style="{ textAlign: 'center' }"
    >
      <el-table-column type="index"></el-table-column>

      <el-table-column prop="wifiId" label="指纹号"> </el-table-column>
      <el-table-column prop="wifiSiteId" label="所处位置"> </el-table-column>
      <el-table-column prop="wifiGridX" label="横向位置"> </el-table-column>
      <el-table-column prop="wifiGridY" label="纵向位置"> </el-table-column>
      <el-table-column prop="wifiSignal" label="指纹信号"> </el-table-column>
      <el-table-column prop="wifiLastTime" label="更新时间">
        <template slot-scope="scope">{{
          scope.row.wifiLastTime | formatDate
        }}</template>
      </el-table-column>
      <el-table-column prop="wifiAddTime" label="创建时间">
        <template slot-scope="scope">{{
          scope.row.wifiAddTime | formatDate
        }}</template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import axios from 'axios'
import moment from 'moment'
export default {
  name: 'EmployeeUDSI',
  data() {
    return {
      wifi: []
    }
  },
  filters: {
    formatDate: function(value) {
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  mounted() {
    var that = this
    axios
      .get(that.GLOBAL.serverUrl + 'locator_server/wifi/query', {
        // 还可以直接把参数拼接在url后边
        params: {
          page: 1,
          limit: 10
        }
      })
      .then(function(res) {
        that.wifi = res.data
        // console.log(res.data)
      })
      .catch(function(error) {
        console.log(error)
      })
  }
}
</script>

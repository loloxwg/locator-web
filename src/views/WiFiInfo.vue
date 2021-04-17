<template>
  <div class="gh_wifiInfo">
    <el-table :data="wifi.list"
              style="width: 100%"
              :header-cell-style="{ textAlign: 'center' }"
              :cell-style="{ textAlign: 'center' }">
      <el-table-column type="index"></el-table-column>

      <el-table-column prop="wifiId"
                       label="指纹号"> </el-table-column>
      <el-table-column prop="wifiSiteId"
                       label="所处位置"> </el-table-column>
      <el-table-column prop="wifiGridX"
                       label="横向位置"> </el-table-column>
      <el-table-column prop="wifiGridY"
                       label="纵向位置"> </el-table-column>
      <el-table-column prop="wifiSignal"
                       label="指纹信号">
        <template slot-scope="scope">
          <el-popover placement="right-start"
                      @show="getSignalList(scope.row.wifiId)"
                      trigger="click">
            <label v-if="signalList.length>0 && signalList[0]==0">加载中...</label>
            <el-table :data="signalList"
                      size="mini"
                      v-else-if="signalList.length>0">
              <el-table-column width="60"
                               property="signalId"
                               label="ID"></el-table-column>
              <el-table-column width="150"
                               property="signalMac"
                               label="Mac"></el-table-column>
              <el-table-column width="100"
                               property="signalName"
                               show-overflow-tooltip
                               label="Name"></el-table-column>
              <el-table-column width="80"
                               property="signalPower"
                               label="Power"></el-table-column>
            </el-table>
            <label v-else>暂无信息</label>
            <el-button type="primary"
                       slot="reference"
                       size="mini"
                       plain>详细信息</el-button>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="wifiLastTime"
                       label="更新时间">
        <template slot-scope="scope">{{
          scope.row.wifiLastTime | formatDate
        }}</template>
      </el-table-column>
      <el-table-column prop="wifiAddTime"
                       label="创建时间">
        <template slot-scope="scope">{{
          scope.row.wifiAddTime | formatDate
        }}</template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini"
                     @click="handleEdit(scope.$index, scope.row)">
            编辑
          </el-button>
          <el-popconfirm title="确定删除该指纹吗？此操作不可逆转"
                         @confirm="handleDelete(scope.$index, scope.row)">
            <el-button size="mini"
                       type="danger"
                       slot="reference">删除</el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="gh_page"
                   @current-change="pageChange"
                   layout="prev, pager, next"
                   :total="wifi.total">
    </el-pagination>
    <wifiForm :wifiData="formData"
              v-if="wifiFormShow"
              @formClose="formClose"></wifiForm>
  </div>
</template>
<script>
import axios from 'axios'
import moment from 'moment'
const wifiForm = () => import('@/components/wifiForm.vue')
export default {
  data () {
    return {
      wifi: {}, // It is the data of wifi table.
      formData: {}, // It is the data of form.
      wifiFormShow: false, // If you can see the wifi form.
      pageNum: 1, // The page now.
      signalList: [] // The data of signal in detail.
    }
  },
  components: {
    wifiForm
  },
  filters: {
    formatDate: function (value) {
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  methods: {
    // Edit wifi signal form.
    handleEdit (index, row) {
      this.editWifiSignal(row)
    },
    // Delete the wifi signal.
    handleDelete (index, row) {
      var wifiId = row.wifiId
      axios
        .get(
          this.GLOBAL.serverUrl + 'locator_server/wifi/delete?wifiId=' + wifiId
        )
        .then(function (res) {
          console.log(res.data)
          if (res.data === 1) {
            this.$message({
              message: '删除成功',
              type: 'success'
            })
          } else {
            this.$message.error('删除失败')
          }
          this.getEmp(this.pageNum, 10)
        })
        .catch(function (error) {
          this.$message.error('删除失败')
          console.log(error)
        })
    },
    // Show the wifi signal form.
    editWifiSignal (wifi) {
      this.formData = { ...wifi }
      this.wifiFormShow = true
    },
    // When you close the form.
    formClose (res) {
      this.wifiFormShow = res
      this.showList(this.pageNum, 10)
      this.formData = {}
    },
    // Get the page wifi info.
    showList (page, limit) {
      var that = this
      axios
        .get(this.GLOBAL.serverUrl + 'locator_server/wifi/query', {
          // 还可以直接把参数拼接在url后边
          params: {
            page: page,
            limit: limit
          }
        })
        .then(function (res) {
          that.wifi = res.data
          // console.log(res.data)
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    // When the page is changed
    pageChange (res) {
      this.showList(res, 10)
      this.pageNum = res
    },
    // Get signal by wifiId
    getSignalList (wifiId) {
      var that = this
      that.signalList = [0]
      axios.get(this.GLOBAL.serverUrl + 'locator_server/signal/signalbywifiid?wifiId=' + wifiId)
        .then(function (res) {
          if (res.data) {
            that.signalList = res.data
          } else {
            that.signalList = []
          }
        })
    }
  },
  mounted () {
    this.showList(1, 10)
  }
}
</script>
<style lang="scss" scoped>
.gh_page {
  text-align: center;
  background-color: #fff;
}
</style>

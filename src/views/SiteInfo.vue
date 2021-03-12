<template>
  <div class="gh_siteInfo gh_height100">
    <div class="gh_flexLeft">
      <router-view name="siteinfo" @getMapId="getMapId"></router-view>
    </div>
    <div class="gh_flexRight">
      <el-table
        class="gh_table gh_height100"
        :data="sites.list"
        style="width: 100%"
        :header-cell-style="{ textAlign: 'center' }"
        :cell-style="{ textAlign: 'center' }"
      >
        <el-table-column type="index"></el-table-column>
        <el-table-column prop="siteId" width="50" label="SID">
        </el-table-column>
        <el-table-column prop="siteName" label="地点名称" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="siteLocate"
          label="地理位置"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column prop="siteMapId" width="50" label="所处地图">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              :content="scope.row.siteMapName"
              placement="top-start"
            >
              <el-tag :type="scope.row.siteMapId | tagColor">
                {{ scope.row.siteMapId }}
              </el-tag>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="siteAttribute"
          label="工作内容"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column prop="siteDate" label="创建时间" show-overflow-tooltip>
          <template slot-scope="scope">{{
            scope.row.empDate | formatDate
          }}</template>
        </el-table-column>
        <el-table-column width="50">
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              effect="dark"
              content="编辑"
              placement="top"
              :enterable="false"
              :hide-after="500"
            >
              <el-button
                icon="el-icon-edit"
                circle
                size="mini"
                @click="handleEdit(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        class="gh_page"
        @current-change="pageChange"
        layout="prev, pager, next"
        :total="sites.total"
      >
      </el-pagination>
      <el-dialog
        title="地点编辑"
        :visible.sync="dialogFormVisible"
        width="30%"
        :close-on-click-modal="false"
      >
        <el-form :model="formInfo" label-suffix="：" label-width="100px">
          <el-form-item label="SID">
            <el-input v-model="formInfo.siteId" :disabled="true"></el-input>
          </el-form-item>
          <el-form-item label="地点名称">
            <el-input v-model="formInfo.siteName"></el-input>
          </el-form-item>
          <el-form-item label="地理位置">
            <el-input v-model="formInfo.siteLocate"></el-input>
          </el-form-item>
          <el-form-item label="所处地图">
            <el-select
              class="gh_select"
              v-model="formInfo.siteMapId"
              placeholder="选择地图"
            >
              <el-option
                v-for="item in maps.list"
                :value="'' + item.mapId"
                :key="item.mapId"
                :label="item.mapName + '(' + 'id:' + item.mapId + ')'"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="工作内容">
            <el-input v-model="formInfo.siteAttribute"></el-input>
          </el-form-item>
          <el-form-item label="创建时间">
            {{ formInfo.siteDate | formatDate }}
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-popover
            placement="top"
            width="160"
            v-model="confirmVisible"
            style="float: left;"
          >
            <p>此操作不可逆，确定删除吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="confirmVisible = false"
                >取消</el-button
              >
              <el-button
                type="primary"
                size="mini"
                @click="siteDelete(formInfo.siteId), (confirmVisible = false)"
                >确定</el-button
              >
            </div>
            <el-button slot="reference" type="danger" plain>删除地点</el-button>
          </el-popover>
          <el-button @click="formClose">取 消</el-button>
          <el-button type="primary" @click="formSubmit">确 定 </el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import moment from 'moment'
export default {
  data() {
    return {
      sites: [], // It is all the site model list that it will show in the site table.
      dialogFormVisible: false, // If you can use the form.
      formInfo: {}, // The site info mounted form.
      sitePage: 1, // The site info page now.
      confirmVisible: false, // When you delete,it will pop.
      maps: [] // All map model list,you can use it to select an map.
    }
  },
  filters: {
    // turn the date to YYYY-MM-DD style
    formatDate: function(value) {
      return moment(value).format('YYYY-MM-DD')
    },
    tagColor: id => {
      switch (id % 5) {
        case 1:
          return ''
        case 2:
          return 'success'
        case 3:
          return 'info'
        case 4:
          return 'danger'
        case 0:
          return 'warning'
      }
    }
  },
  mounted() {
    // You must set it in mounted.
    this.getSiteList(1, 0)
  },
  watch: {
    $route(to) {
      // When you go to siteinfo first,it will not trigger SiteCard,so you must set it in mounted.
      if (to.name === 'SiteCard') {
        this.getSiteList(1, 0)
      }
    }
  },
  methods: {
    // get the site list of the map which you selected or all the maps
    getSiteList(page, res) {
      var mapId = res === 0 ? null : res
      var that = this
      axios
        .get(
          that.GLOBAL.serverUrl +
            (mapId
              ? 'locator_server/site/select?siteMapId=' + mapId
              : 'locator_server/site/query'),
          {
            // 还可以直接把参数拼接在url后边
            params: {
              page: page,
              limit: 9
            }
          }
        )
        .then(function(res) {
          that.sites = res.data
          // console.log(res.data)
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    // get MapId from child and update the site list
    getMapId(res) {
      // console.log(res)
      this.getSiteList(1, res)
    },
    // The site edit event.
    handleEdit(row) {
      this.dialogFormVisible = true
      this.formInfo = { ...row }
      this.getMapList()
    },
    // When you close the form.
    formClose() {
      this.dialogFormVisible = false
      this.formInfo = {}
    },
    // When you submit the form.
    formSubmit() {
      var info = { ...this.formInfo }
      delete info.siteDate
      delete info.siteMapName
      axios
        .get(this.GLOBAL.serverUrl + 'locator_server/site/update', {
          params: info
        })
        .then(res => {
          if (res.data === 1) {
            this.$message({ message: '更新成功！', type: 'success' })
            this.getSiteList(this.sitePage)
            this.dialogFormVisible = false
          } else {
            this.$message.error('更新失败！')
          }
        })
    },
    // When the page is changed
    pageChange(res) {
      this.getSiteList(res)
      this.sitePage = res
    },
    // Delete the site by siteId.
    siteDelete(id) {
      axios
        .get(this.GLOBAL.serverUrl + 'locator_server/site/delete', {
          params: { siteId: id }
        })
        .then(res => {
          if (res === 1) {
            this.$message({ $message: '删除成功！', type: 'success' })
            this.getSiteList(this.sitePage, 9)
            this.dialogFormVisible = false
          } else {
            this.$message.error('删除失败！')
          }
        })
    },
    // get map list
    getMapList() {
      var that = this
      axios
        .get(this.GLOBAL.serverUrl + 'locator_server/map/query', {
          // 还可以直接把参数拼接在url后边
          params: {
            page: 1,
            limit: 0
          }
        })
        .then(function(res) {
          that.maps = res.data
          // console.log(res.data)
        })
        .catch(function(error) {
          console.log(error)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.gh_siteInfo {
  display: flex;
  flex-direction: row;
  .gh_flexLeft {
    flex: 5;
    overflow: auto;
  }
  .gh_flexRight {
    flex: 3;
    overflow: auto;
    .gh_table {
      height: calc(100% - 34px);
    }
    .gh_page {
      text-align: center;
      background-color: #fff;
    }
  }
}
</style>

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
      </el-table>
      <el-pagination
        class="gh_page"
        @current-change="pageChange"
        layout="prev, pager, next"
        :total="sites.total"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import moment from 'moment'
export default {
  data() {
    return {
      sites: [] // It is all the site model list that it will show in the site table.
    }
  },
  filters: {
    // turn the date to YYYY-MM-DD style
    formatDate: function(value) {
      return moment(value).format('YYYY-MM-DD')
    }
  },
  mounted() {
    // You must set it in mounted.
    this.getSiteList(0)
  },
  watch: {
    $route(to) {
      // When you go to siteinfo first,it will not trigger SiteCard,so you must set it in mounted.
      if (to.name === 'SiteCard') {
        this.getSiteList(0)
      }
    }
  },
  methods: {
    // get the site list of the map which you selected or all the maps
    getSiteList(res) {
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
              page: 1,
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
      this.getSiteList(res)
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

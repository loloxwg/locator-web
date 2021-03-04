<template>
  <div class="gh_siteCard">
    <el-card :body-style="{ padding: '0px' }" class="gh_card" shadow="hover">
      <div class="gh_add">
        <div class="addicon el-icon-circle-plus-outline"></div>
        <br />
        <span>添加地图</span>
      </div>
      <botton @click="showForm" class="gh_cover" style="bottom:0"></botton>
    </el-card>
    <el-card
      :body-style="{ padding: '0px' }"
      class="gh_card"
      v-for="item in maps.list"
      :key="'map' + item.mapId"
      shadow="hover"
    >
      <div class="gh_imgbox">
        <el-image
          class="image"
          :src="GLOBAL.showMapImg + item.mapUrl"
          fit="contain"
        >
        </el-image>
      </div>
      <div class="gh_cover">
        <div class="gh_btn">
          <span
            @mouseover="btnHover('search')"
            @mouseout=";(btnTip = ''), (tipColor = '')"
            @click="mapDetail(item)"
          >
            <i class="el-icon-search"></i>
          </span>
          <span
            @mouseover="btnHover('setting')"
            @mouseout=";(btnTip = ''), (tipColor = '')"
            @click="mapSet(item)"
          >
            <i class="el-icon-setting"></i>
          </span>
          <span
            @mouseover="btnHover('delete')"
            @mouseout=";(btnTip = ''), (tipColor = '')"
            @click="mapDelete(item)"
          >
            <i class="el-icon-delete"></i>
          </span>
        </div>
        <div class="gh_tip">
          <label :style="'background-color:' + tipColor">{{ btnTip }}</label>
        </div>
      </div>
      <div class="gh_textbox">
        <el-tooltip
          class="item top"
          effect="dark"
          :content="item.mapName + '(' + item.mapX + '×' + item.mapY + ')'"
          placement="top"
        >
          <span :ref="'refname' + item.mapId">
            {{ item.mapName }}({{ item.mapX }}×{{ item.mapY }})
          </span>
        </el-tooltip>
        <div class="bottom">
          <time class="time">{{ item.mapDate | formatDate }}</time>
        </div>
      </div>
    </el-card>
    <mapForm
      v-if="formvisitable"
      @listenFormShow="listenFormShow"
      style="z-index: 999;"
      :mapValue="mapValue"
    ></mapForm>
  </div>
</template>
<script>
import axios from 'axios'
import moment from 'moment'
const mapForm = () => import('@/components/mapForm.vue')
export default {
  data() {
    return {
      formvisitable: false, // If you can see the form or not.
      maps: { list: [111] }, // You will show the map cards by this.
      btnTip: '', // What's the button to do.
      tipColor: '', // What's the button color
      mapValue: {} // It save all the form map values.
    }
  },
  mounted() {
    this.getMapsList()
  },
  components: {
    mapForm
  },
  filters: {
    // turn the date to YYYY-MM-DD style
    formatDate: function(value) {
      return moment(value).format('YYYY-MM-DD')
    }
  },
  methods: {
    // add map form
    showForm() {
      this.formvisitable = true
      this.mapValue = null
    },
    // listen to form close action.
    listenFormShow(res) {
      this.formvisitable = res
      this.getMapsList()
    },
    // get the maps list
    getMapsList() {
      var that = this
      axios
        .get(that.GLOBAL.serverUrl + 'locator_server/map/query', {
          // 还可以直接把参数拼接在url后边
          params: {
            page: 1,
            limit: 10
          }
        })
        .then(function(res) {
          that.maps = res.data
          // console.log(res.data)
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    // update the parent's site list and change router to sitemap
    mapDetail(res) {
      this.$router.push({ name: 'SiteMap', params: { map: res } })
    },
    // update the map
    mapSet(res) {
      this.formvisitable = true
      this.mapValue = res
    },
    // delete the map
    mapDelete(res) {
      var that = this
      this.$confirm(
        '此操作将永久删除地图' +
          res.mapName +
          '(id:' +
          res.mapId +
          '), 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          axios
            .get(
              that.GLOBAL.serverUrl +
                'locator_server/map/delete?mapId=' +
                res.mapId
            )
            .then(() => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              that.getMapsList()
            })
            .catch(err => {
              this.$message({
                type: 'info',
                message: '删除失败:' + err
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    // set the btnTip message and color
    btnHover(res) {
      switch (res) {
        case 'search':
          this.btnTip = '详情'
          this.tipColor = '#66b1ff'
          break
        case 'setting':
          this.btnTip = '更新'
          this.tipColor = '#85CE61'
          break
        case 'delete':
          this.btnTip = '删除'
          this.tipColor = '#f56c6c'
          break
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.gh_card {
  width: 200px;
  height: 274px;
  margin: 12px;
  float: left;
  position: relative;
  &:hover {
    .gh_cover {
      background-color: #0001;
      visibility: visible;
    }
  }
  .gh_cover {
    visibility: hidden;
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    display: flex;
    flex-direction: column;
    padding: 80px 30px 40px 30px;
    .gh_tip {
      flex: 1;
      align-self: center;
      align-items: center;
      display: inherit;
      color: #eee;
      label {
        font-size: 20px;
        padding: 10px 20px;
        border-radius: 14px;
      }
    }
    .gh_btn {
      display: flex;
      flex-direction: row;
      flex: 1;
      span {
        font-size: 20px;
        flex: 1;
        align-self: center;
        text-align: center;
        i {
          padding: 8px;
          background-color: #fffd;
          border-radius: 50%;
        }
        &:hover {
          i {
            color: #eee;
            cursor: pointer;
            padding: 12px;
          }
          .el-icon-search {
            background-color: #66b1ff;
          }
          .el-icon-setting {
            background-color: #85ce61;
          }
          .el-icon-delete {
            background-color: #f56c6c;
          }
        }
      }
    }
  }
  .gh_add {
    margin-top: 80px;
    text-align: center;
    .addicon {
      font-size: 80px;
      color: #666;
    }
    span {
      font-size: 24px;
      line-height: 40px;
    }
  }
  .gh_imgbox {
    width: 200px;
    height: 200px;
    .image {
      display: inline;
    }
  }
  .gh_textbox {
    overflow: hidden;
    padding: 16px;
    height: 42px;
    position: absolute;
    .top {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .bottom {
      float: right;
      color: #999;
    }
  }
}
</style>

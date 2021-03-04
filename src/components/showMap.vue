<template>
  <div class="gh_map">
    <div class="gh_flow">
      <div class="gh_padding">
        <div
          class="gh_img"
          :style="
            'background-image:url(' +
              mapSelected.mapUrl +
              ');width: ' +
              blockValue * mapSelected.mapX +
              'px;height: ' +
              blockValue * mapSelected.mapY +
              'px;'
          "
        >
          <canvas width="0" height="0" v-show="gridShow" id="grid"></canvas>
        </div>
      </div>
    </div>
    <div class="gh_ctrlBar">
      <div class="gh_block">
        <span class="gh_span">缩放：{{ blockValue }}%</span>
        <el-slider
          class="gh_slider"
          :label="111"
          :min="10"
          :max="200"
          :step="10"
          v-model="blockValue"
          :disabled="blockUse"
        >
        </el-slider>
      </div>
      <el-select
        class="gh_select"
        v-model="mapValue"
        @change="mapSend"
        placeholder="选择地图"
      >
        <el-option
          v-for="item in maps.list"
          :key="item.mapName + '(id:' + item.mapId + ')'"
          :label="
            item.mapName +
              '(' +
              'id:' +
              item.mapId +
              ',' +
              item.mapX +
              '×' +
              item.mapY +
              ')'
          "
          :value="item"
        >
        </el-option>
      </el-select>
      <div class="gh_gridSwitch">
        <label>{{ (gridShow ? '显示' : '隐藏') + '方格：' }}</label>
        <el-tooltip
          class="gh_switch"
          :content="'方格: ' + (gridShow ? '显示' : '隐藏')"
          placement="top"
        >
          <el-switch
            v-model="gridShow"
            active-color="#13ce66"
            inactive-color="#aaa"
          >
          </el-switch>
        </el-tooltip>
      </div>
      <div class="gh_site">
        <label>坐标：X={{gridSite.x}}，Y={{gridSite.y}}</label>
      </div>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return {
      maps: [], // All map model list,you can use it to select an map.
      blockValue: 100, // How to enlarged or reduce the picture
      blockUse: true, // If block can't use or not
      mapValue: '', // Which map model do you select,it's only a key on option.
      mapSelected: [], // An using map model now.
      gridShow: true, // If the grid can be visit.
      gridSite: { x: 0, y: 0 } // Get mouse site.
    }
  },
  mounted() {
    var that = this
    // find router porps
    if (this.$route.params.map) {
      this.mapSend(this.$route.params.map)
    }
    // get map list
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
  methods: {
    // send the map message to parent and change the select
    mapSend(item) {
      this.$emit('mapSend', item)
      this.mapValue = item.mapName + '(id:' + item.mapId + ')'
      this.blockUse = false
      this.mapSelected = item
      // Draw grid in the canvas.
      this.drawGrid()
    },
    // Draw grid in the canvas.
    drawGrid() {
      var grid = document.getElementById('grid')
      var draw = grid.getContext('2d')
      var mapX = this.mapSelected.mapX
      var mapY = this.mapSelected.mapY
      var value = 100 // 默认和blockValue相同
      var i
      // 重置画布,特别注意，canvas的宽高和style的不同
      grid.width = value * mapX
      grid.height = value * mapY
      draw.lineWidth = 1
      draw.strokeStyle = '#f00'
      for (i = 0; i <= mapX; i++) {
        draw.moveTo(i * value, 0)
        draw.lineTo(i * value, value * mapY)
      }
      for (i = 0; i <= mapY; i++) {
        draw.moveTo(0, i * value)
        draw.lineTo(value * mapX, i * value)
      }
      draw.stroke()
      draw.font = '20px Arial'
      draw.textAlign = 'center'
      draw.fillStyle = '#000' // 填充色
      draw.shadowColor = '#fff' // 阴影
      draw.strokeStyle = '#fff' // 笔触色
      draw.shadowBlur = 4
      for (i = 0; i <= mapX; i++) {
        draw.strokeText(i, i * value - 50, 18)
        draw.fillText(i, i * value - 50, 18)
      }
      for (i = 0; i <= mapY; i++) {
        draw.strokeText(i, 10, i * value - 40)
        draw.fillText(i, 10, i * value - 40)
      }
      this.mouseSite(grid)
    },
    // Get mouse site.
    mouseSite(grid) {
      grid.addEventListener(
        'mousemove',
        e => {
          var value = this.blockValue
          this.gridSite.x = Math.ceil(e.offsetX / value)
          this.gridSite.y = Math.ceil(e.offsetY / value)
        },
        false
      )
    }
  }
}
</script>
<style lang="scss" scoped>
.gh_map {
  border: 3px solid #eee;
  height: calc(100% - 26px);
  margin: 10px;
  background-color: #ddd;
  position: relative;
}
.gh_flow {
  overflow: auto;
  width: 100%;
  height: 100%;
  position: relative;
  .gh_padding {
    position: absolute;
    border: solid 60px #ddd;
    .gh_img {
      background-size: cover;
    }
    #grid {
      width: 100%;
      height: 100%;
      background-color: #0001;
    }
  }
}
.gh_ctrlBar {
  width: 94%;
  top: 20px;
  margin-left: 3%;
  position: absolute;
  .gh_block {
    float: left;
    width: 300px;
    height: 38px;
    background-color: white;
    padding: 0 20px;
    border-radius: 18px;
    .gh_span {
      line-height: 38px;
    }
    .gh_slider {
      width: 65%;
      float: right;
    }
  }
  .gh_site{
    background-color: #fff;
    padding: 0 16px;
    border-radius: 18px;
  }
  .gh_site,
  .gh_gridSwitch {
    float: right;
    margin-right: 20px;
    label {
      line-height: 40px;
      // 文字阴影强调
      text-shadow: #eee 1px 0 0, #eee 0 1px 0, #eee -1px 0 0, #eee 0 -1px 0;
    }
    .gh_switch {
      height: 40px;
    }
  }
  .gh_select {
    float: right;
    margin-right: 20px;
  }
}
</style>

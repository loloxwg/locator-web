<template>
  <div class="gh_map">
    <el-form class="gh_form" ref="form" :model="form" label-width="80px">
      <h1>添加地图</h1>
      <el-form-item label="地图名称:">
        <el-input v-model="form.mapName"></el-input>
      </el-form-item>
      <el-form-item label="地图尺寸:">
        <el-col :span="2">X</el-col>
        <el-col :span="10"><el-input v-model="form.mapX"></el-input></el-col>
        <el-col :span="2">Y</el-col>
        <el-col :span="10"><el-input v-model="form.mapY"></el-input></el-col>
      </el-form-item>
      <el-form-item label="图片url:">
        <el-input v-model="form.mapUrl"></el-input>
      </el-form-item>
      <div class="gh_imgbox">
        <el-upload
          v-if="uploadShow"
          class="upload-demo"
          ref="upload"
          drag
          limit="1"
          action="#"
          :http-request="useCosKeyUpload"
          multiple
        >
          <i class="el-icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <div class="el-upload__tip" slot="tip">
            只能上传jpg/png文件，且不超过500kb
          </div>
        </el-upload>
        <div v-if="!uploadShow">
          <el-image class="gh_img" :src="imgUrl" fit="contain"></el-image>
          <br />
          <el-button
            type="danger"
            icon="el-icon-delete"
            plain
            size="mini"
            @click="reupLoad"
            >重新上传</el-button
          >
        </div>
      </div>
      <div class="gh_btn">
        <el-button type="primary" @click="onSubmit">{{
          btnCreate ? '立即创建' : '立即更新'
        }}</el-button>
        <el-button @click="closeForm">取消</el-button>
      </div>
    </el-form>
  </div>
</template>
<script>
import moment from 'moment'
import axios from 'axios'
const COS = () => import('cos-js-sdk-v5')

export default {
  data() {
    return {
      form: {
        mapName: '',
        mapX: 0,
        mapY: 0,
        mapUrl: '上传后显示或手动输入'
      },
      uploadShow: true,
      imgUrl: '',
      btnCreate: true
    }
  },
  props: ['mapValue'],
  mounted() {
    // When you update the map,it will set some props for form.
    if (this.mapValue !== null) {
      var map = this.mapValue
      this.form.mapName = map.mapName
      this.form.mapX = map.mapX
      this.form.mapY = map.mapY
      this.form.mapUrl = map.mapUrl.split('.com/')[1]
      this.imgUrl = map.mapUrl
      this.uploadShow = false
      this.btnCreate = false
    }
  },
  methods: {
    // send a close signal to parent
    closeForm() {
      this.$emit('listenFormShow', false)
    },
    // get an cos key to upload file,it will return an COS Object.
    getCosKey() {
      var that = this
      var cos = new COS({
        // 必选参数
        getAuthorization: function(options, callback) {
          axios
            .get(that.GLOBAL.serverUrl + '/locator_server/cossts')
            .then(function(res) {
              var data = res.data
              var credentials = data && data.credentials
              if (!data || !credentials) {
                return console.error('credentials invalid')
              }
              var cbDate = {
                TmpSecretId: credentials.tmpSecretId,
                TmpSecretKey: credentials.tmpSecretKey,
                XCosSecurityToken: credentials.sessionToken,
                StartTime: data.startTime,
                ExpiredTime: data.expiredTime
              }
              callback(cbDate)
            })
        }
      })
      return cos
    },
    // you can use this function to upload file
    useCosKeyUpload(upload) {
      var that = this
      var file = upload.file
      var cos = that.getCosKey()
      // use the now time as a file name
      var date = new Date()
      var fileDate = moment(date).format('YYYYMMDDhhmmss')
      // get the '.' after of the file name
      var fileName = file.name.lastIndexOf('.')
      var fileNameLen = file.name.length
      var fileType = file.name.substring(fileName + 1, fileNameLen)
      // it ts mapUrl and cos Key
      var mapUrl = 'img/' + fileDate + '.' + fileType
      that.form.mapUrl = mapUrl
      cos.putObject(
        {
          Bucket: 'wifimap-1304806518' /* 必须 */,
          Region: 'ap-shanghai' /* 存储桶所在地域，必须字段 */,
          Key: mapUrl /* 必须 */,
          StorageClass: 'STANDARD',
          Body: file // 上传文件对象
          // onProgress: function(progressData) {
          // console.log(JSON.stringify(progressData))
          // }
        },
        function(err, data) {
          // console.log(err || data)
          if (!err) {
            that.imgUrl = 'http://' + data.Location
            that.uploadShow = false
          } else {
            console.log(err)
          }
        }
      )
    },
    // when you click the delete button
    reupLoad() {
      this.uploadShow = true
      this.form.mapUrl = '上传后显示或手动输入'
    },
    // on form submit create or update
    onSubmit() {
      var that = this
      axios
        .get(
          that.GLOBAL.serverUrl +
            '/locator_server/map/' +
            (this.btnCreate ? 'insert' : 'update?mapId=' + this.mapValue.mapId),
          {
            params: {
              mapName: that.form.mapName,
              mapX: that.form.mapX,
              mapY: that.form.mapY,
              mapUrl: that.form.mapUrl
            }
          }
        )
        .then(() => {
          // console.log(response)
          that.closeForm()
          this.$message({
            type: 'success',
            message: (that.btnCreate ? '创建' : '更新') + '成功!'
          })
        })
        .catch(err => {
          console.log(err)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.gh_map {
  .gh_form {
    position: absolute;
    width: 500px;
    height: 580px;
    background-color: #eee;
    padding: 50px;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    border-radius: 10px;
    border: 2px solid #666;
    .gh_imgbox {
      height: 240px;
      .gh_img {
        width: 360px;
        height: 180px;
        margin: 6px;
      }
      .upload-demo {
        margin: 20px;
      }
    }
    .gh_btn {
      position: relative;
    }
  }
  position: fixed;
  background-color: #0008;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  text-align: center;
}
</style>

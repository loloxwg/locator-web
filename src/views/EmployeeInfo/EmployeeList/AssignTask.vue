<template>
  <div class="gh_assignTask">
    <el-card class="gh_card" :body-style="addNewVisible?'':'padding:0'" v-loading="loading">
      <div v-if="addNewVisible">
        <h3>标题：</h3>
        <el-input v-model="inputTask.title" placeholder="请输入标题"></el-input>
        <div>
          <span>主要内容：</span>
          <el-input v-model="inputTask.main" type="textarea" placeholder="请输入主要内容"></el-input>
        </div>
        <div>
          任务地点：
          <el-select v-model="inputTask.mapId" @change="getSiteList" placeholder="请选择地图">
            <el-option
              v-for="item in mapList"
              :key="item.value"
              :label="item.mapName"
              :value="item.mapId"
            ></el-option>
          </el-select>
          <el-select v-model="inputTask.siteId" no-data-text="所选地图无信息" placeholder="请选择位置">
            <el-option
              v-for="site in inputTask.siteList"
              :key="site.value"
              :label="site.siteName"
              :value="site.siteId"
            ></el-option>
          </el-select>
        </div>
        <div style="display:flex;margin-top:10px">
          <div style="flex:10">
            <div>发布时间：{{inputTask.time | formatDate}}</div>
          </div>
          <div style="flex:2;justify-content: flex-end;display: flex;">
            <el-button type="primary" @click="handleSubmit">提 交</el-button>
            <el-button @click="addNewVisible = false">返 回</el-button>
          </div>
        </div>
      </div>
      <el-button style="width:100%" v-else @click="handleAdd">
        <h3>+ 新建任务</h3>
      </el-button>
    </el-card>

    <el-card v-for="(item,index) in taskList" :key="index" class="gh_card">
      <h3>
        标题：
        <label v-if="item.edit">
          <el-input style="width:300px" v-model="item.job_title" placeholder="请输入标题"></el-input>
        </label>
        <label v-else>{{item.job_title}}</label>
        <el-tooltip v-if="item.edit" content="保存" placement="top">
          <el-button
            style="margin-left:10px"
            size="mini"
            type="success"
            icon="el-icon-check"
            circle
            @click="handleSave(index)"
          ></el-button>
        </el-tooltip>
        <el-tooltip v-else content="编辑" placement="top">
          <el-button
            style="margin-left:10px"
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            circle
            @click="item.edit=true,handleEdit(item)"
          ></el-button>
        </el-tooltip>
        <el-tooltip v-show="!item.edit" content="删除" placement="top">
          <el-button
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
            circle
            @click="handleDelete(item)"
          ></el-button>
        </el-tooltip>
      </h3>
      <div>
        <label style="line-height: 40px;">主要内容：</label>
        <el-input v-if="item.edit" v-model="item.job_main" type="textarea" placeholder="请输入主要内容"></el-input>
        <label v-else>{{item.job_main}}</label>
      </div>
      <div>
        任务地点：
        <div v-if="item.edit">
          <el-select
            v-model="item.map_id"
            @change="getSiteList(item.map_id,item)"
            placeholder="请选择地图"
          >
            <el-option
              v-for="item in mapList"
              :key="item.value"
              :label="item.mapName"
              :value="item.mapId"
            ></el-option>
          </el-select>
          <el-select v-model="item.site_id" no-data-text="所选地图无信息" placeholder="请选择位置">
            <el-option
              v-for="site in item.siteList"
              :key="site.value"
              :label="site.siteName"
              :value="site.siteId"
            ></el-option>
          </el-select>
        </div>
        <label v-else>{{item.site_name}}</label>
      </div>
      <div>
        <label style="line-height: 40px;">参与人员：</label>
        <el-tag
          class="gh_tag"
          closable
          :disable-transitions="false"
          v-for="(user,index) in item.users_id_name"
          @close="handleClose(user)"
          :key="item.job_id+ '-' + user.id"
          :type="index | tagType"
          v-show="user.id !== '0'"
        >{{user.id}},{{user.name || '---'}}</el-tag>
        <el-autocomplete
          style="width: 200px;"
          v-if="item.addUserInputVisible"
          v-model="userNew"
          ref="saveTagInput"
          size="small"
          :fetch-suggestions="querySearch"
          @select="handleInputConfirm(item)"
        ></el-autocomplete>
        <el-button v-else size="small" @click="handleAddUser(item)">+ 添加人员</el-button>
      </div>
      <div>发布时间：{{item.job_add_time | formatDate}}</div>
    </el-card>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
export default {
  name: 'AssignTask',
  data () {
    return {
      taskList: [],
      addNewVisible: false,
      inputTask: {
        title: '',
        main: '',
        siteId: '',
        time: new Date(),
        loading: false,
        siteList: [],
        mapId: ''
      },
      mapList: [],
      userNew: '',
      allUsers: [],
      refresh: true
    }
  },
  filters: {
    formatDate: function (value) {
      return moment(value).format('YYYY-MM-DD HH:mm:ss')
    },
    tagType: function (res) {
      switch (res % 5) {
        case 0: return ''
        case 1: return 'success'
        case 2: return 'info'
        case 3: return 'warning'
        case 4: return 'danger'
      }
    }
  },
  mounted () {
    this.reLoading()
  },
  methods: {
    // 获取任务列表
    reLoading () {
      var that = this
      axios.get(that.GLOBAL.serverUrl + 'locator_server/task/query').then(res => {
        var dataList = res.data
        for (var item in dataList) {
          dataList[item].users_id_name = JSON.parse(dataList[item].users_id_name)
          dataList[item].edit = false
          if (dataList[item].map_id === 0) {
            dataList[item].map_id = ''
            dataList[item].site_id = ''
            this.$set(dataList[item], 'addUserInputVisible', false)
          }
        }
        this.$set(that, 'taskList', dataList)
      })
    },
    // 任务中移除用户
    handleClose (tag) {
      axios.get(this.GLOBAL.serverUrl + 'locator_server/task/deletebytaskid?taskId=' + tag.task_id).then(res => {
        if (res.data === 1) {
          this.$message.success('移除人员成功！')
        } else {
          this.$message.error('移除人员失败！')
        }
        this.reLoading()
      })
    },
    // 提交任务信息
    handleSubmit () {
      if (this.inputTask.title === '') {
        this.$message.warning('标题不能为空')
        return
      }
      if (this.inputTask.main === '') {
        this.$message.warning('主要内容不能为空')
        return
      }
      if (this.inputTask.siteId === '') {
        this.$message.warning('地点不能为空')
        return
      }
      var that = this
      this.loading = true
      axios.get(that.GLOBAL.serverUrl + 'locator_server/task/addjob', {
        params: {
          job_title: that.inputTask.title,
          job_main: that.inputTask.main,
          job_site_id: that.inputTask.siteId
        }
      }).then(res => {
        if (res.data === 1) {
          this.$message.success('添加成功！')
          that.addNewVisible = false
          this.reLoading()
        } else {
          this.$message.error('添加失败！')
        }
        this.loading = false
      })
    },
    // 添加任务条目
    handleAdd () {
      this.inputTask = {
        title: '',
        main: '',
        site: '',
        users: [],
        time: new Date()
      }
      axios.get(this.GLOBAL.serverUrl + 'locator_server/map/query', {
        params: {
          limit: 0
        }
      }).then(res => {
        this.mapList = res.data.list
      })
      this.addNewVisible = true
    },
    // 添加任务成员
    handleAddUser (item) {
      // this.$message('暂时无法添加人员！')
      for (var task in this.taskList) {
        this.$set(this.taskList[task], 'addUserInputVisible', false)
      }
      this.userNew = ''
      this.$set(item, 'addUserInputVisible', true)
      this.$nextTick(_ => {
        // 由于不止一个input，ref得到的是数组
        this.$refs.saveTagInput[0].$refs.input.focus()
      })
      if (this.allUsers.length === 0) {
        axios.get(this.GLOBAL.serverUrl + 'locator_server/user/query?limit=0').then(res => {
          this.$set(this, 'allUsers', res.data.list.map((terminal) => {
            // 格式化用户信息为value的格式
            return {
              value: terminal.userId
            }
          }))
        })
      }
    },
    querySearch (queryString, cb) {
      var restaurants = this.allUsers
      var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
      // 调用 callback 返回建议列表的数据
      cb(results)
    },
    createFilter (queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
      }
    },
    // 保存输入信息
    handleInputConfirm (item) {
      var inputValue = this.userNew
      if (inputValue) {
        // 保存信息
        axios.get(this.GLOBAL.serverUrl + 'locator_server/task/addtask', {
          params: {
            job_id: item.job_id,
            user_id: inputValue
          }
        }).then(res => {
          if (res.data === 1) {
            this.$message.success('用户插入成功!')
          } else {
            this.$message.error('用户插入失败!')
          }
          this.reLoading()
        }).catch(_ => {
          this.$message.error('用户插入失败!')
        })
      }
      item.addUserInputVisible = false
      this.userNew = ''
    },
    // 进行编辑
    handleEdit (item) {
      axios.get(this.GLOBAL.serverUrl + 'locator_server/map/query', {
        params: {
          limit: 0
        }
      }).then(res => {
        this.mapList = res.data.list
      })
      axios.get(this.GLOBAL.serverUrl + 'locator_server/site/select', {
        params: {
          limit: 0,
          siteMapId: item.map_id
        }
      }).then(res => {
        this.$set(item, 'siteList', res.data.list)
      })
    },
    // 保存更改信息
    handleSave (index) {
      axios.get(this.GLOBAL.serverUrl + 'locator_server/task/update', {
        params: {
          job_id: this.taskList[index].job_id,
          job_title: this.taskList[index].job_title,
          job_main: this.taskList[index].job_main,
          job_site_id: this.taskList[index].site_id
        }
      }).then(res => {
        if (res.data === 1) {
          this.$message.success('任务保存成功！')
          this.taskList[index].edit = false
        } else {
          this.$message.error('任务保存失败！')
        }
      })
    },
    // 删除任务
    handleDelete (item) {
      // this.$message('暂时无法删除任务！')
      // console.log(item.job_id)
      axios.get(this.GLOBAL.serverUrl + 'locator_server/site/select', {
        params: {
          jobId: item.job_id
        }
      }).then(res => {
        // console.log(res.data)
        this.$message.error('任务删除成功！')
      })
    },
    // 获取位置列表
    getSiteList (mapId, item) {
      if (item) {
        item.site_id = ''
      } else {
        this.$set(this.inputTask, 'siteId', '')
      }
      axios.get(this.GLOBAL.serverUrl + 'locator_server/site/select', {
        params: {
          limit: 0,
          siteMapId: mapId
        }
      }).then(res => {
        if (item) {
          this.$set(item, 'siteList', res.data.list)
        } else {
          this.$set(this.inputTask, 'siteList', res.data.list)
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.gh_card {
  margin: 10px;
  h3 {
    line-height: 0;
  }
  .gh_tag {
    margin: 2px;
  }
}
</style>

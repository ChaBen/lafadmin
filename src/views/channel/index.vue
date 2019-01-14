<template>
  <div class="app-container">
    <div class="filter-container tar">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleCreate">Add</el-button>
    </div>

    <div class="video-box">
      <el-row :gutter="10">
        <el-col v-for="o in videos" :key="o.id" :span="12">
          <el-card :body-style="{ padding: '0px' }" shadow="hover">
            <div style="padding: 14px;">
              <div class="video">
                <iframe :src="`https://www.youtube.com/embed/${o.src}`" style="height: 30vh;" width="100%" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>&nbsp</iframe>
              </div>
              <div class="bottom clearfix">
                <div class="button">
                  <el-button type="primary" icon="el-icon-edit" @click="handleUpdate(o)">수정</el-button>
                  <el-button type="danger" icon="el-icon-delete" @click="deleteDate(o)">삭제</el-button>
                </div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="80%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: calc(100% - 70px); margin-left:50px;">
        <el-form-item label="Url" prop="url">
          <el-input v-model="temp.url" :autofocus="true" />
        </el-form-item>
        <div v-if="temp.src !== ''" class="video">
          <iframe :src="`https://www.youtube.com/embed/${temp.src}`" style="height: 400px;" width="100%" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen>&nbsp</iframe>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">cancel</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">Create</el-button>
        <el-button v-else type="primary" @click="updateData">Update</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      videos: {},
      videoLoading: true,
      dialogStatus: '',
      dialogFormVisible: false,
      temp: {
        id: '',
        url: '',
        src: ''
      },
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        url: [{ required: true, message: 'url is required', trigger: 'blur' }]
      }
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree2.filter(val)
    }
  },
  created() {
    this.getData()
  },
  methods: {
    ...mapActions('channel', ['find', 'create', 'update', 'remove']),
    async getData() {
      this.listLoading = true
      const param = { lang: 'ko' }
      this.videos = (await this.find(param)).data
      console.log(this.videos)
      this.listLoading = false
    },
    filterNode(value, data) {
      if (!value) return true
      return data.label.indexOf(value) !== -1
    },
    embedId(url) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
      const match = url.match(regExp)
      if (match && match[2].length === 11) {
        return match[2]
      } else {
        return false
      }
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        url: '',
        src: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      row.url = `http://www.youtube.com/watch?v=${row.src}`
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.src = this.embedId(this.temp.url)
          if (!this.temp.src) {
            this.$notify.error({
              title: '애러',
              message: '동영상 Url 다시확인하세요.'
            })
            return
          }
          this.create(this.temp).then(res => {
            this.videos.push(res)
            this.$notify({
              title: '성공',
              message: '추가성공',
              type: 'success',
              duration: 2000
            })
            this.dialogFormVisible = false
          }).catch(this.error)
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.src = this.embedId(this.temp.url)
          if (!this.temp.src) {
            this.$notify.error({
              title: '애러',
              message: '동영상 Url 다시확인하세요.'
            })
            return
          }
          const data = this.temp
          this.update([data.id, data, {}]).then(() => {
            this.dialogFormVisible = false
            this.$notify({
              title: '수정',
              message: '수정성공',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    deleteDate(row) {
      this.$confirm('정말로 삭제하시겠습니까?', 'Press', {
        confirmButtonText: '삭제',
        cancelButtonText: '취소'
      }).then(() => {
        this.remove(row.id).then(() => {
          this.$notify({
            title: '삭제',
            message: '삭제성공',
            type: 'success',
            duration: 2000
          })
          const index = this.videos.indexOf(row)
          this.videos.splice(index, 1)
        }).catch(this.error)
      })
    },
    error(err) {
      this.$notify.error({
        title: 'Error',
        message: err.message
      })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
.filter-container {
  margin-bottom: 10px;
  &.tar {
    text-align: right;
  }
}
.video-box {
  .el-col {
    margin-bottom: 20px;
  }
  .video {
    margin-bottom: 10px;
  }
  .bottom {
    margin-top: 5px;
    .time {
      margin-top: 5px;
    }
    .button {
      margin-top: 5px;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
    }
  }
}
</style>

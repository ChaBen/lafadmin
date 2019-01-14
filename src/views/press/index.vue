<template>
  <div class="app-container">
    <div class="filter-container tar">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleCreate">추가</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row>
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">
          {{ scope.$index + 1 }}
        </template>
      </el-table-column>
      <el-table-column label="타이틀">
        <template slot-scope="scope">
          <a href="javascript:void(0)" @click="handleUpdate(scope.row)">{{ scope.row.title }}</a>
        </template>
      </el-table-column>
      <el-table-column label="텍스트" width="250" align="center">
        <template slot-scope="scope">
          {{ scope.row.subtitle }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Actions" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="handleUpdate(scope.row)">수정</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteDate(scope.row)">삭제</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="80%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: calc(100% - 70px); margin-left:50px;">
        <el-form-item label="타이틀" prop="title">
          <el-input v-model="temp.title" :autofocus="true"/>
        </el-form-item>
        <el-form-item label="링크" prop="link">
          <el-input v-model="temp.link"/>
        </el-form-item>
        <el-form-item label="텍스트" prop="subtitle">
          <el-input v-model="temp.subtitle"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">cancel</el-button>
        <el-button v-if="dialogStatus=='추가'" type="primary" @click="createData">추가</el-button>
        <el-button v-else type="primary" @click="updateData">수정</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      dialogStatus: '',
      dialogFormVisible: false,
      temp: {
        id: null,
        title: null,
        link: null,
        subtitle: null
      },
      rules: {
        title: [{ required: true, message: 'title is required', trigger: 'blur' }],
        link: [{ required: true, message: 'link is required', trigger: 'blur' }],
        subtitle: [{ required: true, message: 'subtitle is required', trigger: 'blur' }]
      },
      textMap: {
        update: '수정',
        create: 'Create'
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    ...mapActions('press', ['find', 'create', 'update', 'remove']),
    async getData() {
      this.listLoading = true
      const param = { lang: this.lang }
      this.list = (await this.find(param)).data
      this.listLoading = false
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        title: '',
        link: '',
        subtitle: ''
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
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate(async(valid) => {
        if (valid) {
          this.create(this.temp).then(res => {
            this.dialogFormVisible = false
            this.list.unshift(res)
            this.$notify({
              title: '성공',
              message: '추가성공',
              type: 'success',
              duration: 2000
            })
          }).catch(this.error)
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const data = this.temp
          this.update([data.id, data, {}]).then(() => {
            this.$notify({
              title: '수정',
              message: '수정성공',
              type: 'success',
              duration: 2000
            })
            this.dialogFormVisible = false
          }).catch(this.error)
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
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        })
      }).catch(this.error)
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
</style>

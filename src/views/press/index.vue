<template>
  <div class="app-container">
    <div class="filter-container tar">
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" @click="handleCreate">Add</el-button>
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
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="Title">
        <template slot-scope="scope">
          <a href="javascript:void(0)" @click="handleUpdate(scope.row)">{{ scope.row.title }}</a>
        </template>
      </el-table-column>
      <el-table-column label="Text" width="250" align="center">
        <template slot-scope="scope">
          {{ scope.row.text }}
        </template>
      </el-table-column>
      <el-table-column align="center" label="Actions" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="small" icon="el-icon-edit" @click="handleUpdate(scope.row)">Edit</el-button>
          <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteDate(scope.row)">Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="80%">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: calc(100% - 70px); margin-left:50px;">
        <el-form-item label="Title" prop="title">
          <el-input v-model="temp.title" :autofocus="true"/>
        </el-form-item>
        <el-form-item label="Link" prop="link">
          <el-input v-model="temp.link"/>
        </el-form-item>
        <el-form-item label="Text" prop="text">
          <el-input v-model="temp.text"/>
        </el-form-item>
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
import { getList, createArticle, updateArticle, deleteArticle } from '@/api/press'

export default {
  data() {
    return {
      list: null,
      listLoading: true,
      dialogStatus: '',
      dialogFormVisible: false,
      temp: {
        id: '',
        title: '',
        link: '',
        text: ''
      },
      rules: {
        title: [{ required: true, message: 'title is required', trigger: 'blur' }],
        link: [{ required: true, message: 'link is required', trigger: 'blur' }],
        text: [{ required: true, message: 'text is required', trigger: 'blur' }]
      },
      textMap: {
        update: 'Edit',
        create: 'Create'
      }
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList('ko').then(response => {
        this.list = response.data.items
        this.listLoading = false
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        title: '',
        link: '',
        text: ''
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
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createArticle(this.temp).then((res) => {
            this.list.unshift(res.data)
            this.dialogFormVisible = false
            this.$notify({
              title: '성공',
              message: '추가성공',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateArticle(this.temp).then((res) => {
            if (res.data) {
              for (const v of this.list) {
                if (v.id === this.temp.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, this.temp)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify({
                title: '수정',
                message: '수정성공',
                type: 'success',
                duration: 2000
              })
            }
          })
        }
      })
    },
    deleteDate(row) {
      this.$confirm('정말로 삭제하시겠습니까?', 'Press', {
        confirmButtonText: '삭제',
        cancelButtonText: '취소'
      }).then(() => {
        deleteArticle(row.id).then(() => {
          this.$notify({
            title: '삭제',
            message: '삭제성공',
            type: 'success',
            duration: 2000
          })
          const index = this.list.indexOf(row)
          this.list.splice(index, 1)
        })
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

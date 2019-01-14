<template>
  <div class="app-container">
    <div class="filter-container tar">
      <el-button class="filter-item" type="primary" @click="dialogFormVisible = true">Add</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="ID" width="95">
        <template slot-scope="scope">{{ scope.$index }}</template>
      </el-table-column>
      <el-table-column label="Title">
        <template slot-scope="scope">
          <a href="javascript:void(0)" @click="handleUpdate(scope.row)">{{ scope.row.title }}</a>
        </template>
      </el-table-column>
      <el-table-column label="Text" width="250" align="center">
        <template slot-scope="scope">{{ scope.row.text }}</template>
      </el-table-column>
      <el-table-column align="center" label="Actions" width="200">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
          >Edit</el-button>
          <el-button
            type="danger"
            size="small"
            icon="el-icon-delete"
            @click="deleteDate(scope.row)"
          >Delete</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="80%">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="width: calc(100% - 70px); margin-left:50px;"
      >
        <el-form-item label="Title" prop="title">
          <el-date-picker
            v-model="temp.date"
            type="date"
            format="yyyy-MM-dd"
            placeholder="Pick a day"
          />
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
import { getList } from '@/api/calendar'

export default {
  data() {
    return {
      listLoading: false,
      dialogFormVisible: false,
      dialogStatus: '',
      temp: {
        date: ''
      },
      list: [],
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        date: [{ required: true, message: 'date is required', trigger: 'blur' }]
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
    createData() {},
    updateData() {}
  }
}
</script>


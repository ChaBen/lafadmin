<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <div class="createPost-main-container">
        <div class="createPost-btns">
          <el-button type="primary" @click="handleCreate">추가</el-button>
          <el-button type="primary" @click="handleUpdate">수정</el-button>
        </div>
        <el-tabs v-model="activeName" style="margin-top:15px;" type="border-card">
          <el-tab-pane v-for="item in tabMapOptions" :label="item.label" :key="item.key" :name="item.key">
            <keep-alive>
              <el-row>
                <el-col :span="24">
                  <el-form-item prop="subtitle">
                    <MDinput v-model="postForm[item.key].subtitle" required>SubTitle</MDinput>
                  </el-form-item>
                  <el-form-item prop="title">
                    <MDinput v-model="postForm[item.key].title" required>Title</MDinput>
                  </el-form-item>
                  <Tinymce :height="1200" v-model="postForm[item.key].tickets" :item="item.key" />
                </el-col>
              </el-row>
            </keep-alive>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-form>
    <el-dialog :visible.sync="dialogFormVisible" title="티켓 추가" width="80%">
      <el-form ref="dataForm" :rules="dialogRules" :model="temp" label-position="left" label-width="70px">
        <el-form-item label="언어">
          <el-select v-model="temp.lang">
            <el-option v-for="item in tabMapOptions" :key="item.key" :label="item.label" :value="item.key"/>
          </el-select>
        </el-form-item>
        <el-form-item label="Title" prop="title">
          <el-input v-model="temp.title" :autofocus="true"/>
        </el-form-item>
        <el-form-item label="Subtitle" prop="subtitle">
          <el-input v-model="temp.subtitle"/>
        </el-form-item>
        <Tinymce :height="500" v-model="temp.tickets" />
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">cancel</el-button>
        <el-button type="primary" @click="createData">Create</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import Tinymce from '@/components/Tinymce'
import MDinput from '@/components/MDinput'
export default {
  components: {
    Tinymce,
    MDinput
  },
  data() {
    return {
      postForm: {
        ko: {},
        cn: {},
        en: {},
        jp: {}
      },
      rules: {
        title: [{ required: true, message: 'title is required', trigger: 'blur' }],
        subtitle: [{ required: true, message: 'subtitle is required', trigger: 'blur' }],
        tickets: [{ required: true, message: 'tickets is required', trigger: 'blur' }]
      },
      tabMapOptions: [
        { label: 'Korea', key: 'ko' },
        { label: 'China', key: 'cn' },
        { label: 'USA', key: 'en' },
        { label: 'Japan', key: 'jp' }
      ],
      activeName: 'ko',
      createdTimes: 0,
      temp: {
        lang: 'ko',
        title: '',
        subtitle: '',
        tickets: ''
      },
      dialogRules: {
        title: [{ required: true, message: 'title is required', trigger: 'blur' }],
        subtitle: [{ required: true, message: 'subtitle is required', trigger: 'blur' }],
        tickets: [{ required: true, message: 'tickets is required', trigger: 'blur' }]
      },
      dialogStatus: '',
      dialogFormVisible: false
    }
  },
  created() {
    this.getData()
    // getList().then((res) => {
    //   console.log(res)
    //   const items = res.data.items
    //   items.map(val => {
    //     Object.keys(this.postForm).map(v => {
    //       if (val.lang === v) {
    //         this.postForm[v] = {
    //           title: val.title,
    //           subtitle: val.subtitle,
    //           content: val.content,
    //           id: val.id
    //         }
    //       }
    //     })
    //   })
    // })
  },
  methods: {
    ...mapActions('tickets', ['find', 'create', 'update']),
    async getData() {
      const data = (await this.find()).data
      data.map(val => {
        Object.keys(this.postForm).map(v => {
          if (val.lang === v) {
            this.postForm[v] = {
              lang: val.lang,
              title: val.title,
              subtitle: val.subtitle,
              tickets: val.tickets,
              id: val.id
            }
          }
        })
      })
    },
    handleUpdate() {
      const data = this.postForm[this.activeName]
      this.update([data.id, data, {}]).then(() => {
        this.$notify({
          title: '수정',
          message: '수정성공',
          type: 'success',
          duration: 2000
        })
      }).catch(this.error)
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
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
            this.postForm[this.temp.lang] = res
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
    resetTemp() {
      this.temp = {
        lang: 'ko',
        title: '',
        subtitle: '',
        tickets: ''
      }
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

<style rel="stylesheet/scss" lang="scss" scoped>
@import "src/styles/mixin.scss";
.createPost-container {
  position: relative;
  .createPost-main-container {
    padding: 40px 45px 20px 50px;
    .createPost-btns {
      text-align: right;
      margin-bottom: 10px;
    }
    .postInfo-container {
      position: relative;
      @include clearfix;
      margin-bottom: 10px;
      .postInfo-container-item {
        float: left;
      }
    }
    .editor-container {
      min-height: 500px;
      margin: 0 0 30px;
      .editor-upload-btn-container {
        text-align: right;
        margin-right: 10px;
        .editor-upload-btn {
          display: inline-block;
        }
      }
    }
  }
  .word-counter {
    width: 40px;
    position: absolute;
    right: -10px;
    top: 0px;
  }
}
</style>

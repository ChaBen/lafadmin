<template>
  <div class="createPost-container">
    <el-form ref="postForm" :model="postForm" :rules="rules" class="form-container">
      <div class="createPost-main-container">
        <div class="createPost-btns">
          <el-button type="primary" @click="submitForm">저장</el-button>
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
                  <Tinymce :height="1200" v-model="postForm[item.key].content" :item="item.key" />
                </el-col>
              </el-row>
            </keep-alive>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-form>
  </div>
</template>

<script>
import { getList, updateArticle } from '@/api/tickets'
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
      rules: {},
      tabMapOptions: [
        { label: 'Korea', key: 'ko' },
        { label: 'China', key: 'cn' },
        { label: 'USA', key: 'en' },
        { label: 'Japan', key: 'jp' }
      ],
      activeName: 'ko',
      createdTimes: 0
    }
  },
  created() {
    getList().then((res) => {
      const items = res.data.items
      items.map(val => {
        Object.keys(this.postForm).map(v => {
          if (val.lang === v) {
            this.postForm[v] = {
              title: val.title,
              subtitle: val.subtitle,
              content: val.content,
              id: val.id
            }
          }
        })
      })
    })
  },
  methods: {
    submitForm() {
      const data = this.postForm[this.activeName]
      updateArticle(data).then(res => {
        if (res.data) {
          this.$notify({
            title: '수정',
            message: '수정성공',
            type: 'success',
            duration: 2000
          })
        }
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

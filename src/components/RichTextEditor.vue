<template>
  <div class="rich-text-editor">
    <div ref="editor" class="editor-container"></div>
  </div>
</template>

<script>
import wangEditor from 'wangeditor'
import { uploadApi } from '@/api/content'

export default {
  name: 'RichTextEditor',
  props: {
    value: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      editor: null
    }
  },
  mounted() {
    this.initEditor()
  },
  beforeDestroy() {
    if (this.editor) {
      this.editor.destroy()
    }
  },
  watch: {
    value(newVal) {
      if (this.editor && newVal !== this.editor.txt.html()) {
        this.editor.txt.html(newVal)
      }
    },
    disabled(newVal) {
      if (this.editor) {
        if (newVal) {
          this.editor.disable()
        } else {
          this.editor.enable()
        }
      }
    }
  },
  methods: {
    // 初始化编辑器
    initEditor() {
      this.editor = new wangEditor(this.$refs.editor)
      
      // 设置编辑器高度
      this.editor.config.height = this.height
      
      // 配置工具栏
      this.editor.config.menus = [
        'head', // 标题
        'bold', // 粗体
        'fontSize', // 字号
        'fontName', // 字体
        'italic', // 斜体
        'underline', // 下划线
        'strikeThrough', // 删除线
        'foreColor', // 文字颜色
        'backColor', // 背景颜色
        'link', // 插入链接
        'list', // 列表
        'justify', // 对齐方式
        'quote', // 引用
        'emoticon', // 表情
        'image', // 插入图片
        'table', // 表格
        'video', // 插入视频
        'code', // 插入代码
        'undo', // 撤销
        'redo' // 重复
      ]
      
      // 配置上传图片
      this.editor.config.uploadImgServer = '/api/upload/image'
      this.editor.config.uploadFileName = 'file'
      this.editor.config.uploadImgMaxSize = 2 * 1024 * 1024 // 2MB
      this.editor.config.uploadImgAccept = ['jpg', 'jpeg', 'png', 'gif']
      this.editor.config.uploadImgMaxLength = 10 // 最多上传10张图片
      
      // 配置图片上传成功回调
      this.editor.config.uploadImgHooks = {
        before: () => {
          // 上传之前触发
          // 可以对 files 进行检查，然后返回 false 停止上传
        },
        success: () => {
          // 上传成功触发
          // result 是服务器返回的结果
        },
        fail: () => {
          // 上传失败触发
        },
        error: () => {
          // 请求错误触发
          this.$message.error('图片上传失败，请检查网络连接')
        },
        timeout: () => {
          // 上传超时触发
          this.$message.error('图片上传超时，请重试')
        }
      }
      
      // 配置服务器返回的图片格式
      this.editor.config.customUploadImg = (files, insert) => {
        // 自定义上传图片
        uploadApi.uploadImage(files[0]).then(response => {
          if (response && response.url) {
            insert(response.url)
          } else {
            this.$message.error('图片上传失败，返回数据格式错误')
          }
        }).catch(error => {
          console.error('图片上传失败:', error)
          this.$message.error('图片上传失败，请重试')
        })
      }
      
      // 配置编辑器内容变化事件
      this.editor.config.onchange = (newHtml) => {
        this.$emit('input', newHtml)
        this.$emit('change', newHtml)
      }
      
      // 创建编辑器
      this.editor.create()
      
      // 设置初始内容
      if (this.value) {
        this.editor.txt.html(this.value)
      }
      
      // 设置禁用状态
      if (this.disabled) {
        this.editor.disable()
      }
    },
    
    // 获取编辑器内容
    getContent() {
      return this.editor ? this.editor.txt.html() : ''
    },
    
    // 设置编辑器内容
    setContent(html) {
      if (this.editor) {
        this.editor.txt.html(html)
      }
    },
    
    // 清空编辑器内容
    clearContent() {
      if (this.editor) {
        this.editor.txt.html('')
      }
    },
    
    // 聚焦编辑器
    focus() {
      if (this.editor) {
        this.editor.txt.focus()
      }
    }
  }
}
</script>

<style scoped>
.rich-text-editor {
  width: 100%;
}

.editor-container {
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  overflow: hidden;
}
</style>
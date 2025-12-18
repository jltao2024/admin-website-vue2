<template>
  <div class="markdown-container">
    <el-card class="markdown-card">
      <div class="card-header">
        <h2>Markdown编辑器</h2>
        <div class="header-buttons">
          <el-button type="primary" @click="handleOpenFile">
            <i class="el-icon-folder-opened"></i> 打开文件
          </el-button>
          <el-button type="success" @click="handleSaveFile">
            <i class="el-icon-document"></i> 保存文件
          </el-button>
          <el-button type="warning" @click="handleClearContent">
            <i class="el-icon-delete"></i> 清空内容
          </el-button>
          <el-dropdown @command="handleDropdownCommand">
            <el-button>
              <i class="el-icon-more"></i> 更多操作<i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="fullscreen">全屏编辑</el-dropdown-item>
              <el-dropdown-item command="copy">复制内容</el-dropdown-item>
              <el-dropdown-item command="paste">粘贴内容</el-dropdown-item>
              <el-dropdown-item command="shortcuts">快捷键提示</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown @command="handleThemeChange">
            <el-button>
              <i v-if="theme === 'light'" class="el-icon-moon"></i>
              <i v-else class="el-icon-sunrise"></i>
              {{ theme === 'light' ? '夜间模式' : '日间模式' }}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="light">日间模式</el-dropdown-item>
              <el-dropdown-item command="dark">夜间模式</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
      <div class="card-body">
        <div class="body-header">
          <el-radio-group v-model="viewMode" class="view-mode-selector">
            <el-radio-button label="edit">仅编辑</el-radio-button>
            <el-radio-button label="preview">仅预览</el-radio-button>
            <el-radio-button label="split">分屏显示</el-radio-button>
          </el-radio-group>
          <el-button type="info" size="small" @click="toggleOutline" class="outline-toggle">
            <i class="el-icon-menu"></i> {{ showOutline ? '隐藏大纲' : '显示大纲' }}
          </el-button>
        </div>
        
        <!-- Markdown语法工具栏 -->
        <div class="markdown-toolbar">
          <div class="toolbar-group">
            <span class="group-title">标题</span>
            <el-dropdown @command="insertHeader">
              <el-tooltip content="插入标题" placement="bottom">
                <el-button size="small" type="primary" plain>
                  <i class="el-icon-edit-outline"></i> 标题
                </el-button>
              </el-tooltip>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="h1">H1</el-dropdown-item>
                <el-dropdown-item command="h2">H2</el-dropdown-item>
                <el-dropdown-item command="h3">H3</el-dropdown-item>
                <el-dropdown-item command="h4">H4</el-dropdown-item>
                <el-dropdown-item command="h5">H5</el-dropdown-item>
                <el-dropdown-item command="h6">H6</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          
          <div class="toolbar-group">
            <span class="group-title">文本</span>
            <el-tooltip content="插入粗体 (Ctrl+B)" placement="bottom">
              <el-button size="small" @click="insertFormat('bold')" type="primary" plain>
                <i class="el-icon-bold"></i> 粗体
              </el-button>
            </el-tooltip>
            <el-tooltip content="插入斜体 (Ctrl+I)" placement="bottom">
              <el-button size="small" @click="insertFormat('italic')" type="primary" plain>
                <i class="el-icon-italic"></i> 斜体
              </el-button>
            </el-tooltip>
            <el-tooltip content="插入删除线" placement="bottom">
              <el-button size="small" @click="insertFormat('strikethrough')" type="primary" plain>
                <i class="el-icon-delete-outline"></i> 删除线
              </el-button>
            </el-tooltip>
          </div>
          
          <div class="toolbar-group">
            <span class="group-title">列表</span>
            <el-tooltip content="插入无序列表" placement="bottom">
              <el-button size="small" @click="insertFormat('unordered-list')" type="primary" plain>
                <i class="el-icon-list"></i> 无序列表
              </el-button>
            </el-tooltip>
            <el-tooltip content="插入有序列表" placement="bottom">
              <el-button size="small" @click="insertFormat('ordered-list')" type="primary" plain>
                <i class="el-icon-s-order"></i> 有序列表
              </el-button>
            </el-tooltip>
          </div>
          
          <div class="toolbar-group">
            <span class="group-title">链接</span>
            <el-tooltip content="插入链接" placement="bottom">
              <el-button size="small" @click="insertFormat('link')" type="primary" plain>
                <i class="el-icon-link"></i> 链接
              </el-button>
            </el-tooltip>
            <el-tooltip content="插入图片" placement="bottom">
              <el-button size="small" @click="insertFormat('image')" type="primary" plain>
                <i class="el-icon-picture-outline"></i> 图片
              </el-button>
            </el-tooltip>
          </div>
          
          <div class="toolbar-group">
            <span class="group-title">代码</span>
            <el-tooltip content="插入行内代码" placement="bottom">
              <el-button size="small" @click="insertFormat('code')" type="primary" plain>
                <i class="el-icon-document-copy"></i> 行内代码
              </el-button>
            </el-tooltip>
            <el-tooltip content="插入代码块" placement="bottom">
              <el-button size="small" @click="insertFormat('code-block')" type="primary" plain>
                <i class="el-icon-document"></i> 代码块
              </el-button>
            </el-tooltip>
          </div>
          
          <div class="toolbar-group">
            <span class="group-title">其他</span>
            <el-tooltip content="插入引用" placement="bottom">
              <el-button size="small" @click="insertFormat('quote')" type="primary" plain>
                <i class="el-icon-chat-dot-square"></i> 引用
              </el-button>
            </el-tooltip>
            <el-tooltip content="插入表格" placement="bottom">
              <el-button size="small" @click="insertFormat('table')" type="primary" plain>
                <i class="el-icon-s-grid"></i> 表格
              </el-button>
            </el-tooltip>
            <el-tooltip content="插入水平线" placement="bottom">
              <el-button size="small" @click="insertFormat('hr')" type="primary" plain>
                <i class="el-icon-minus"></i> 水平线
              </el-button>
            </el-tooltip>
          </div>
        </div>
        
        <!-- 大纲导航 -->
        <div class="outline-container" v-if="showOutline && parsedOutline.length > 0">
          <div class="outline-title">大纲导航</div>
          <div class="outline-content">
            <outline-item 
              v-for="(item, index) in parsedOutline" 
              :key="index"
              :item="item"
              @click="navigateToHeader(item.id, item.lineIndex)"
            ></outline-item>
          </div>
        </div>
        
        <!-- 仅编辑模式 -->
        <div class="edit-only" v-if="viewMode === 'edit'">
          <el-input
            v-model="markdownContent"
            type="textarea"
            :rows="30"
            placeholder="请输入Markdown内容..."
            class="markdown-editor"
            @keyup.ctrl.enter="handleSaveFile"
            @keyup.ctrl.1="viewMode = 'edit'"
            @keyup.ctrl.2="viewMode = 'preview'"
            @keyup.ctrl.3="viewMode = 'split'"
          ></el-input>
        </div>
        
        <!-- 仅预览模式 -->
        <div class="preview-only" v-if="viewMode === 'preview'">
          <div class="markdown-preview" v-html="compiledMarkdown"></div>
        </div>
        
        <!-- 分屏显示模式 -->
        <div class="split-view" v-if="viewMode === 'split'">
          <div class="editor-section">
            <div class="section-title">编辑区</div>
            <el-input
              v-model="markdownContent"
              type="textarea"
              :rows="30"
              placeholder="请输入Markdown内容..."
              class="markdown-editor"
              @keyup.ctrl.enter="handleSaveFile"
              @keyup.ctrl.1="viewMode = 'edit'"
              @keyup.ctrl.2="viewMode = 'preview'"
              @keyup.ctrl.3="viewMode = 'split'"
            ></el-input>
          </div>
          <div class="preview-section">
            <div class="section-title">预览区</div>
            <div class="markdown-preview" v-html="compiledMarkdown"></div>
          </div>
        </div>

        <!-- 字数统计信息 -->
        <div class="word-count-info">
          <el-tag size="small" effect="plain">字符数: {{ wordCount.characters }}</el-tag>
          <el-tag size="small" effect="plain">字符数(不含空格): {{ wordCount.charactersNoSpaces }}</el-tag>
          <el-tag size="small" effect="plain">单词数: {{ wordCount.words }}</el-tag>
          <el-tag size="small" effect="plain">行数: {{ wordCount.lines }}</el-tag>
          <el-tag size="small" effect="plain">段落数: {{ wordCount.paragraphs }}</el-tag>
          <el-tag size="small" effect="plain">阅读时间: {{ wordCount.readingTime }} 分钟</el-tag>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { marked } from 'marked'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

// 大纲项递归组件
const OutlineItem = {
  name: 'outline-item',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  template: `
    <div class="outline-item">
      <div 
        class="outline-link level-{{ item.level }}"
        @click="$emit('click', item.id, item.lineIndex)"
      >
        {{ item.text }}
      </div>
      <div 
        v-if="item.children && item.children.length > 0" 
        class="outline-children"
      >
        <outline-item 
          v-for="(child, index) in item.children" 
          :key="index"
          :item="child"
          @click="$emit('click', ...arguments)"
        ></outline-item>
      </div>
    </div>
  `
}

export default {
  name: 'Markdown',
  components: {
    OutlineItem
  },
  data() {
    return {
      viewMode: 'split', // edit, preview, split
      markdownContent: '',
      autoSaveTimer: null,
      autoSaveInterval: 5000, // 5秒自动保存一次
      fileName: 'document.md',
      outline: [], // 存储大纲数据
      showOutline: true, // 控制大纲显示/隐藏
      theme: 'light', // light, dark
      lastSavedTime: null, // 最后保存时间
      isSaving: false, // 是否正在保存
      lastSavedContent: '' // 存储上次保存的内容，用于检测内容变化
    }
  },
  computed: {
    compiledMarkdown() {
      if (!this.markdownContent) return '<div class="empty-content">暂无内容</div>'
      
      // 使用marked库进行Markdown解析
      return marked(this.markdownContent)
    },
    
    // 解析大纲结构
    parsedOutline() {
      const lines = this.markdownContent.split('\n')
      const headers = []
      const outline = []
      const headerStack = []
      
      // 提取所有标题
      lines.forEach((line, index) => {
        const match = line.match(/^(#{1,6})\s+(.+)$/)
        if (match) {
          const level = match[1].length
          const text = match[2].trim()
          // 创建唯一ID
          const id = 'header-' + text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
          
          headers.push({
            level,
            text,
            id,
            lineIndex: index
          })
        }
      })
      
      // 构建嵌套大纲
      headers.forEach(header => {
        const { level, text, id, lineIndex } = header
        const item = { text, id, level, lineIndex, children: [] }
        
        while (headerStack.length > 0 && headerStack[headerStack.length - 1].level >= level) {
          headerStack.pop()
        }
        
        if (headerStack.length === 0) {
          outline.push(item)
        } else {
          headerStack[headerStack.length - 1].children.push(item)
        }
        
        headerStack.push(item)
      })
      
      return outline
    },
    
    // 字数统计
    wordCount() {
      if (!this.markdownContent) {
        return {
          characters: 0,
          charactersNoSpaces: 0,
          words: 0,
          lines: 0,
          paragraphs: 0,
          readingTime: 0
        }
      }
      
      const characters = this.markdownContent.length
      const charactersNoSpaces = this.markdownContent.replace(/\s/g, '').length
      
      // 统计单词数（中文按字符，英文按空格分隔）
      const chineseWords = this.markdownContent.match(/[\u4e00-\u9fa5]/g) || []
      const englishWords = this.markdownContent.match(/[a-zA-Z]+/g) || []
      const words = chineseWords.length + englishWords.length
      
      const lines = this.markdownContent.split('\n').length
      const paragraphs = this.markdownContent.split(/\n\s*\n/).filter(p => p.trim()).length
      
      // 阅读时间（平均每分钟阅读300字）
      const readingTime = Math.ceil(words / 300) || 1
      
      return {
        characters,
        charactersNoSpaces,
        words,
        lines,
        paragraphs,
        readingTime
      }
    }
  },
  mounted() {
    // 从localStorage加载内容
    this.loadContentFromStorage()
    // 从localStorage加载主题设置
    this.loadThemeFromStorage()
    
    // 自定义标题渲染器，确保id与大纲解析一致
    const renderer = new marked.Renderer()
    renderer.heading = function(text, level) {
      const id = 'header-' + text.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      return `<h${level} id="${id}">${text}</h${level}>`
    }
    
    // 初始化marked配置
    marked.setOptions({
      renderer: renderer,
      highlight: function(code, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(code, { language: lang }).value
          } catch (__) {
            // 忽略语法高亮错误，使用自动高亮
          }
        }
        return hljs.highlightAuto(code).value
      },
      langPrefix: 'hljs language-',
      breaks: true,
      gfm: true,
      headerIds: true,
      mangle: false,
      sanitize: false
    })
    
    // 启动自动保存定时器
    this.startAutoSave()
    
    // 初始化拖拽上传功能
    this.initDragAndDrop()
    
    // 初始化键盘快捷键
    this.initKeyboardShortcuts()
  },
  beforeDestroy() {
    // 停止自动保存定时器
    this.stopAutoSave()
    // 保存当前内容
    this.saveContentToStorage()
    // 保存当前主题设置
    this.saveThemeToStorage()
  },
  methods: {
    // 从localStorage加载主题设置
    loadThemeFromStorage() {
      const savedTheme = localStorage.getItem('markdownTheme')
      if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
        this.theme = savedTheme
        this.applyTheme()
      }
    },
    
    // 保存主题设置到localStorage
    saveThemeToStorage() {
      localStorage.setItem('markdownTheme', this.theme)
    },
    
    // 处理主题切换
    handleThemeChange(command) {
      this.theme = command
      this.saveThemeToStorage()
      this.applyTheme()
    },
    
    // 应用主题到UI
    applyTheme() {
      const container = document.querySelector('.markdown-container')
      if (!container) return
      
      // 移除旧主题类
      container.classList.remove('light-theme', 'dark-theme')
      // 添加新主题类
      container.classList.add(`${this.theme}-theme`)
      
      // 切换代码高亮样式
      const highlightStyle = document.getElementById('highlight-style')
      if (highlightStyle) {
        highlightStyle.remove()
      }
      
      // 添加新的高亮样式
      const link = document.createElement('link')
      link.id = 'highlight-style'
      link.rel = 'stylesheet'
      link.href = this.theme === 'light' 
        ? 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/github.min.css'
        : 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.5.1/styles/github-dark.min.css'
      document.head.appendChild(link)
    },
    // 打开本地Markdown文件
    handleOpenFile() {
      const input = document.createElement('input')
      input.type = 'file'
      input.accept = '.md,.markdown,.txt'
      
      input.onchange = (e) => {
        const file = e.target.files[0]
        if (!file) return
        
        const reader = new FileReader()
        reader.onload = (event) => {
          this.markdownContent = event.target.result
          this.fileName = file.name
          this.$message.success(`已打开文件: ${file.name}`)
        }
        reader.onerror = () => {
          this.$message.error('文件读取失败')
        }
        reader.readAsText(file, 'utf-8')
      }
      
      input.click()
    },
    
    // 初始化拖拽上传功能
    initDragAndDrop() {
      const container = document.querySelector('.markdown-container')
      if (!container) return
      
      // 拖拽进入
      container.addEventListener('dragover', (e) => {
        e.preventDefault()
        e.stopPropagation()
        container.style.border = '2px dashed #409eff'
        container.style.backgroundColor = 'rgba(64, 158, 255, 0.1)'
      })
      
      // 拖拽离开
      container.addEventListener('dragleave', (e) => {
        e.preventDefault()
        e.stopPropagation()
        container.style.border = 'none'
        container.style.backgroundColor = ''
      })
      
      // 拖拽释放
      container.addEventListener('drop', (e) => {
        e.preventDefault()
        e.stopPropagation()
        container.style.border = 'none'
        container.style.backgroundColor = ''
        
        const files = e.dataTransfer.files
        if (files.length > 0) {
          const file = files[0]
          // 检查是否为图片文件
          if (file.type.startsWith('image/')) {
            this.handleImageUpload(file)
          }
        }
      })
    },
    
    // 处理图片上传
    handleImageUpload(file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        const imageDataUrl = event.target.result
        const imageMarkdown = `![${file.name}](${imageDataUrl})\n`
        this.insertText(imageMarkdown)
        this.$message.success('图片已插入')
      }
      reader.onerror = () => {
        this.$message.error('图片读取失败')
      }
      reader.readAsDataURL(file)
    },
    
    // 保存到本地文件
    handleSaveFile() {
      try {
        const blob = new Blob([this.markdownContent], { type: 'text/markdown;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = this.fileName
        a.click()
        URL.revokeObjectURL(url)
        
        this.$message.success('文件保存成功')
      } catch (error) {
        this.$message.error('文件保存失败: ' + error.message)
      }
    },
    
    // 从localStorage加载内容
    loadContentFromStorage() {
      const savedContent = localStorage.getItem('markdownContent')
      if (savedContent) {
        this.markdownContent = savedContent
        this.lastSavedContent = savedContent // 同步上次保存的内容
        this.$message.info('已加载上次编辑的内容')
      } else {
        // 设置默认内容
        this.markdownContent = '# Markdown编辑器\n\n这是一个功能完善的Markdown编辑器。\n\n## 功能特点\n\n- ✅ 支持完整的Markdown语法\n- ✅ 实时预览（分屏显示）\n- ✅ 多种视图模式切换\n- ✅ 快捷键支持\n- ✅ 本地文件打开/保存\n- ✅ 自动保存功能\n- ✅ 代码高亮\n- ✅ 大纲导航\n- ✅ 字数统计\n- ✅ 拖拽上传图片\n- ✅ 主题切换\n- ✅ 快捷键提示\n\n## 快捷键\n\n- **Ctrl + Enter**: 保存文件\n- **Ctrl + 1**: 仅编辑模式\n- **Ctrl + 2**: 仅预览模式\n- **Ctrl + 3**: 分屏显示模式\n- **Ctrl + B**: 粗体\n- **Ctrl + I**: 斜体\n\n## 支持的Markdown语法\n\n### 标题\n\n# 一级标题\n## 二级标题\n### 三级标题\n\n### 列表\n\n- 无序列表项1\n- 无序列表项2\n  - 嵌套列表项\n\n1. 有序列表项1\n2. 有序列表项2\n\n### 代码\n\n行内代码：`console.log("Hello World")`\n\n代码块：\n```javascript\nfunction hello() {\n  console.log("Hello World");\n}\n```\n\n### 表格\n\n| 列1 | 列2 | 列3 |\n|-----|-----|-----|\n| 内容1 | 内容2 | 内容3 |\n| 内容4 | 内容5 | 内容6 |\n\n### 引用\n\n> 这是一段引用文字\n\n### 图片\n\n![图片描述](https://via.placeholder.com/150)\n\n### 链接\n\n[访问百度](https://www.baidu.com)\n'
        this.lastSavedContent = this.markdownContent // 同步上次保存的内容
      }
    },
    
    // 保存内容到localStorage
    saveContentToStorage() {
      // 只有当内容不为空且与上次保存的内容不同时才保存
      if (this.markdownContent.trim() && this.markdownContent !== this.lastSavedContent) {
        this.isSaving = true
        localStorage.setItem('markdownContent', this.markdownContent)
        this.lastSavedTime = new Date()
        this.lastSavedContent = this.markdownContent
        setTimeout(() => {
          this.isSaving = false
        }, 500)
      }
    },
    
    // 启动自动保存
    startAutoSave() {
      this.stopAutoSave() // 先停止之前的定时器
      this.autoSaveTimer = setInterval(() => {
        this.saveContentToStorage()
      }, this.autoSaveInterval)
    },
    
    // 初始化键盘快捷键
    initKeyboardShortcuts() {
      window.addEventListener('keydown', (e) => {
        // 检查是否在编辑器中按下快捷键
        const isInEditor = document.activeElement && document.activeElement.classList.contains('markdown-editor')
        if (!isInEditor) return
        
        // Ctrl+B 粗体
        if (e.ctrlKey && e.key === 'b') {
          e.preventDefault()
          this.insertFormat('bold')
        }
        
        // Ctrl+I 斜体
        if (e.ctrlKey && e.key === 'i') {
          e.preventDefault()
          this.insertFormat('italic')
        }
      })
    },
    
    // 停止自动保存
    stopAutoSave() {
      if (this.autoSaveTimer) {
        clearInterval(this.autoSaveTimer)
        this.autoSaveTimer = null
      }
    },
    
    // 清空内容
    handleClearContent() {
      this.$confirm('确定要清空所有内容吗？此操作不可恢复。', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.markdownContent = ''
        this.$message.success('内容已清空')
      }).catch(() => {
        // 取消清空操作
      })
    },
    
    // 下拉菜单命令处理
    handleDropdownCommand(command) {
      switch (command) {
        case 'fullscreen':
          this.handleFullscreen()
          break
        case 'copy':
          this.handleCopyContent()
          break
        case 'paste':
          this.handlePasteContent()
          break
        case 'shortcuts':
          this.showShortcuts()
          break
        default:
          break
      }
    },
    
    // 显示快捷键提示
    showShortcuts() {
      this.$alert(`
        <div class="shortcuts-content">
          <h3 style="margin-top: 0;">快捷键说明</h3>
          <div class="shortcuts-list">
            <div class="shortcut-item">
              <span class="shortcut-key">Ctrl + Enter</span>
              <span class="shortcut-desc">保存文件</span>
            </div>
            <div class="shortcut-item">
              <span class="shortcut-key">Ctrl + 1</span>
              <span class="shortcut-desc">仅编辑模式</span>
            </div>
            <div class="shortcut-item">
              <span class="shortcut-key">Ctrl + 2</span>
              <span class="shortcut-desc">仅预览模式</span>
            </div>
            <div class="shortcut-item">
              <span class="shortcut-key">Ctrl + 3</span>
              <span class="shortcut-desc">分屏显示模式</span>
            </div>
            <div class="shortcut-item">
              <span class="shortcut-key">Ctrl + B</span>
              <span class="shortcut-desc">粗体</span>
            </div>
            <div class="shortcut-item">
              <span class="shortcut-key">Ctrl + I</span>
              <span class="shortcut-desc">斜体</span>
            </div>
          </div>
        </div>
      `, '快捷键提示', {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '知道了',
        customClass: 'shortcuts-dialog'
      })
    },
    
    // 复制内容
    handleCopyContent() {
      if (!this.markdownContent) {
        this.$message.warning('没有内容可以复制')
        return
      }
      
      navigator.clipboard.writeText(this.markdownContent).then(() => {
        this.$message.success('内容已复制到剪贴板')
      }).catch(() => {
        // 降级方案
        const textArea = document.createElement('textarea')
        textArea.value = this.markdownContent
        document.body.appendChild(textArea)
        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
        this.$message.success('内容已复制到剪贴板')
      })
    },
    
    // 粘贴内容
    handlePasteContent() {
      navigator.clipboard.readText().then(text => {
        if (text) {
          this.markdownContent += text
          this.$message.success('内容已粘贴')
        } else {
          this.$message.warning('剪贴板为空')
        }
      }).catch(() => {
        this.$message.error('无法读取剪贴板内容')
      })
    },
    
    // 全屏编辑
    handleFullscreen() {
      const container = document.querySelector('.markdown-card')
      if (!container) return
      
      if (!document.fullscreenElement) {
        container.requestFullscreen().then(() => {
          this.$message.success('已进入全屏模式')
        }).catch(() => {
          this.$message.error('无法进入全屏模式')
        })
      } else {
        document.exitFullscreen().then(() => {
          this.$message.success('已退出全屏模式')
        })
      }
    },
    
    // 导航到指定标题
    navigateToHeader(id, lineIndex) {
      // 在编辑模式下，将光标定位到对应行
      const textareas = document.querySelectorAll('.markdown-editor')
      if (textareas.length > 0) {
        const textarea = textareas[0]
        const lines = this.markdownContent.split('\n')
        let position = 0
        
        for (let i = 0; i < lineIndex; i++) {
          position += lines[i].length + 1 // +1 表示换行符
        }
        
        textarea.focus()
        textarea.setSelectionRange(position, position)
      }
      
      // 在预览模式下，滚动到对应ID
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    },
    
    // 切换大纲显示/隐藏
    toggleOutline() {
      this.showOutline = !this.showOutline
    },
    
    // 插入标题
    insertHeader(type) {
      const level = parseInt(type.substring(1))
      const prefix = '#'.repeat(level) + ' '
      this.insertText(prefix)
    },
    
    // 插入Markdown格式
    insertFormat(type) {
      switch (type) {
        case 'bold':
          this.insertText('**', '**')
          break
        case 'italic':
          this.insertText('*', '*')
          break
        case 'strikethrough':
          this.insertText('~~', '~~')
          break
        case 'unordered-list':
          this.insertText('- ')
          break
        case 'ordered-list':
          this.insertText('1. ')
          break
        case 'link':
          this.insertText('[链接文本](https://example.com)')
          break
        case 'image':
          this.insertText('![图片描述](https://via.placeholder.com/150)')
          break
        case 'code':
          this.insertText('`', '`')
          break
        case 'code-block':
          this.insertText('```\n\n```')
          break
        case 'quote':
          this.insertText('> ')
          break
        case 'table':
          this.insertText('| 列1 | 列2 | 列3 |\n|-----|-----|-----|\n| 内容1 | 内容2 | 内容3 |\n| 内容4 | 内容5 | 内容6 |')
          break
        case 'hr':
          this.insertText('\n---\n')
          break
        default:
          break
      }
    },
    
    // 插入文本的通用方法
    insertText(prefix, suffix = '') {
      // 获取编辑器元素
      const textareas = document.querySelectorAll('.markdown-editor')
      if (textareas.length === 0) return
      
      const textarea = textareas[0]
      const startPos = textarea.selectionStart
      const endPos = textarea.selectionEnd
      const selectedText = this.markdownContent.substring(startPos, endPos)
      
      // 构建新内容
      const newText = prefix + (selectedText || '') + suffix
      const newContent = 
        this.markdownContent.substring(0, startPos) +
        newText +
        this.markdownContent.substring(endPos)
      
      // 更新内容
      this.markdownContent = newContent
      
      // 设置光标位置
      this.$nextTick(() => {
        const newCursorPos = startPos + prefix.length + (selectedText ? selectedText.length : 0)
        textarea.focus()
        textarea.setSelectionRange(newCursorPos, newCursorPos)
      })
    },
  }
}
</script>

<style scoped>
.markdown-container {
  width: 100%;
  height: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.markdown-card {
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border: none;
  height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.card-header h2 {
  font-size: 20px;
  font-weight: 600;
  color: #303133;
  margin: 0;
}

.header-buttons .el-button {
  margin-left: 10px;
}

.card-body {
  margin-top: 20px;
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
}

/* 视图模式选择器 */
.view-mode-selector {
  margin-bottom: 20px;
  align-self: flex-start;
}

/* Body Header */
.body-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

/* 大纲切换按钮 */
.outline-toggle {
  margin-left: 10px;
}

/* Markdown语法工具栏样式 */
.markdown-toolbar {
  background-color: #f5f7fa;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 10px 15px;
  margin-bottom: 20px;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  align-items: center;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.group-title {
  font-size: 12px;
  font-weight: 600;
  color: #606266;
  padding: 2px 5px;
  background-color: #e8e8e8;
  border-radius: 3px;
  white-space: nowrap;
}

.markdown-toolbar .el-button {
  margin: 0;
  font-size: 12px;
  padding: 8px 12px;
}

/* 大纲容器 */
.outline-container {
  background-color: #f5f7fa;
  border: 1px solid #ebeef5;
  border-radius: 4px;
  padding: 15px;
  margin-bottom: 20px;
  max-height: 300px;
  overflow-y: auto;
}

.outline-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #ebeef5;
}

.outline-content {
  font-size: 13px;
}

.outline-item {
  margin-bottom: 5px;
}

.outline-link {
  padding: 4px 8px;
  border-radius: 3px;
  cursor: pointer;
  color: #606266;
  transition: all 0.2s;
  display: inline-block;
  width: 100%;
  box-sizing: border-box;
}

.outline-link:hover {
  background-color: #ecf5ff;
  color: #409eff;
}

/* 大纲级别样式 */
.level-1 {
  font-weight: 600;
}

.level-2 {
  padding-left: 20px !important;
}

.level-3 {
  padding-left: 40px !important;
}

.level-4 {
  padding-left: 60px !important;
  font-size: 12px;
}

.level-5 {
  padding-left: 80px !important;
  font-size: 12px;
}

.level-6 {
  padding-left: 100px !important;
  font-size: 12px;
}

.outline-children {
  margin-top: 5px;
  margin-left: 5px;
}

/* 编辑器样式 */
.markdown-editor {
  width: 100%;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.6;
  border-radius: 4px;
  resize: none;
}

.markdown-editor:focus {
  border-color: #409eff;
  box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
}

/* 预览区域样式 */
.markdown-preview {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 4px;
  min-height: 500px;
  overflow-y: auto;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', Arial, sans-serif;
}

/* 空内容状态 */
.empty-content {
  text-align: center;
  color: #909399;
  padding: 100px 20px;
  font-size: 16px;
}

/* 分屏显示模式 */
.split-view {
  display: flex;
  flex: 1;
  gap: 20px;
  overflow: hidden;
}

.editor-section, .preview-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.section-title {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px solid #ebeef5;
}

/* 仅编辑模式 */
.edit-only {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

/* 仅预览模式 */
.preview-only {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow: hidden;
}

/* 字数统计信息样式 */
.word-count-info {
  margin-top: 20px;
  padding: 10px 15px;
  background-color: #f5f7fa;
  border-radius: 4px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  border: 1px solid #ebeef5;
}

.word-count-info .el-tag {
  margin-right: 0;
}

/* Markdown预览内容样式增强 */
.markdown-preview h1 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 24px;
  color: #303133;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 10px;
}

.markdown-preview h2 {
  font-size: 24px;
  font-weight: 600;
  margin: 24px 0 16px;
  color: #303133;
  border-bottom: 1px solid #ebeef5;
  padding-bottom: 8px;
}

.markdown-preview h3 {
  font-size: 18px;
  font-weight: 600;
  margin: 20px 0 12px;
  color: #303133;
}

.markdown-preview h4 {
  font-size: 16px;
  font-weight: 600;
  margin: 16px 0 8px;
  color: #303133;
}

.markdown-preview h5 {
  font-size: 14px;
  font-weight: 600;
  margin: 12px 0 6px;
  color: #303133;
}

.markdown-preview h6 {
  font-size: 12px;
  font-weight: 600;
  margin: 8px 0 4px;
  color: #909399;
}

.markdown-preview p {
  margin-bottom: 16px;
  line-height: 1.8;
  color: #606266;
}

.markdown-preview strong {
  font-weight: 600;
  color: #303133;
}

.markdown-preview em {
  font-style: italic;
  color: #606266;
}

.markdown-preview a {
  color: #409eff;
  text-decoration: none;
  transition: color 0.3s;
}

.markdown-preview a:hover {
  color: #66b1ff;
  text-decoration: underline;
}

/* 暗色主题样式 */
.dark-theme .markdown-card {
  background-color: #1e1e1e;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.5);
}

.dark-theme .card-header {
  border-bottom-color: #333;
}

.dark-theme .card-header h2 {
  color: #eee;
}

.dark-theme .body-header {
  border-bottom-color: #333;
}

.dark-theme .markdown-editor {
  background-color: #2d2d2d;
  border-color: #444;
  color: #eee;
}

.dark-theme .markdown-editor:focus {
  border-color: #66b1ff;
  box-shadow: 0 0 0 2px rgba(102, 177, 255, 0.3);
}

.dark-theme .markdown-preview {
  background-color: #2d2d2d;
  color: #eee;
}

.dark-theme .markdown-preview h1,
.dark-theme .markdown-preview h2,
.dark-theme .markdown-preview h3,
.dark-theme .markdown-preview h4,
.dark-theme .markdown-preview h5,
.dark-theme .markdown-preview h6 {
  color: #eee;
  border-bottom-color: #333;
}

.dark-theme .markdown-preview p,
.dark-theme .markdown-preview ul,
.dark-theme .markdown-preview ol,
.dark-theme .markdown-preview table {
  color: #ccc;
}

.dark-theme .markdown-preview a {
  color: #66b1ff;
}

.dark-theme .markdown-preview a:hover {
  color: #99c8ff;
}

.dark-theme .outline-container {
  background-color: #2d2d2d;
  border-color: #444;
}

.dark-theme .outline-title {
  color: #eee;
  border-bottom-color: #444;
}

.dark-theme .outline-link {
  color: #ccc;
}

.dark-theme .outline-link:hover {
  background-color: #3a3a3a;
  color: #66b1ff;
}

.dark-theme .markdown-toolbar {
  background-color: #2d2d2d;
  border-color: #444;
}

.dark-theme .group-title {
  background-color: #444;
  color: #ccc;
}

.dark-theme .word-count-info {
  background-color: #2d2d2d;
  border-color: #444;
}

.dark-theme .word-count-info .el-tag {
  background-color: #444;
  color: #ccc;
  border-color: #555;
}

.dark-theme .empty-content {
  color: #999;
}

.markdown-preview ul, .markdown-preview ol {
  padding-left: 28px;
  margin-bottom: 16px;
}

.markdown-preview li {
  margin-bottom: 8px;
  color: #606266;
  line-height: 1.6;
}

.markdown-preview ul li::marker {
  color: #409eff;
}

/* 代码块样式 */
.markdown-preview pre {
  background-color: #282c34;
  color: #abb2bf;
  padding: 16px;
  border-radius: 4px;
  overflow-x: auto;
  margin-bottom: 16px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.5;
}

.markdown-preview code {
  background-color: #f2f6fc;
  color: #e96900;
  padding: 2px 6px;
  border-radius: 3px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
}

.markdown-preview pre code {
  background-color: transparent;
  color: inherit;
  padding: 0;
  border-radius: 0;
}

/* 表格样式 */
.markdown-preview table {
  border-collapse: collapse;
  width: 100%;
  margin-bottom: 16px;
  font-size: 14px;
}

/* 移动端响应式样式 */
@media (max-width: 768px) {
  .markdown-container {
    padding: 10px;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-buttons {
    margin-top: 10px;
  }
  
  .header-buttons .el-button {
    margin-left: 0;
    margin-right: 10px;
    margin-bottom: 10px;
  }
  
  .body-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .markdown-toolbar {
    gap: 10px;
    padding: 10px;
  }
  
  .toolbar-group {
    gap: 5px;
  }
  
  .group-title {
    display: none;
  }
  
  .markdown-toolbar .el-button {
    padding: 6px 10px;
    font-size: 12px;
  }
  
  .split-view {
    flex-direction: column;
    gap: 15px;
  }
  
  .markdown-editor {
    height: 300px !important;
  }
  
  .markdown-preview {
    padding: 15px;
    min-height: 300px;
  }
  
  .outline-container {
    max-height: 200px;
  }
  
  .level-2 {
    padding-left: 10px !important;
  }
  
  .level-3 {
    padding-left: 20px !important;
  }
  
  .level-4 {
    padding-left: 30px !important;
  }
  
  .level-5 {
    padding-left: 40px !important;
  }
  
  .level-6 {
    padding-left: 50px !important;
  }
  
  .word-count-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}

.markdown-preview th, .markdown-preview td {
  border: 1px solid #ebeef5;
  padding: 10px 14px;
  text-align: left;
}

.markdown-preview th {
  background-color: #f5f7fa;
  font-weight: 600;
  color: #303133;
}

.markdown-preview tr:nth-child(even) {
  background-color: #fafafa;
}

/* 引用样式 */
.markdown-preview blockquote {
  margin: 0 0 16px;
  padding: 0 0 0 15px;
  border-left: 4px solid #409eff;
  color: #606266;
  font-style: italic;
}

/* 图片样式 */
.markdown-preview img {
  max-width: 100%;
  height: auto;
  border-radius: 4px;
  margin: 10px 0;
}

/* 分割线样式 */
.markdown-preview hr {
  border: none;
  border-top: 1px solid #ebeef5;
  margin: 20px 0;
}

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .markdown-container {
    padding: 10px;
  }
  
  .markdown-card {
    height: calc(100vh - 40px);
  }
  
  .card-header {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .card-header h2 {
    font-size: 18px;
  }
  
  .header-buttons {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .header-buttons .el-button {
    margin-left: 0;
    flex: 1;
    min-width: 100px;
    font-size: 12px;
  }
  
  .body-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .view-mode-selector {
    width: 100%;
  }
  
  .markdown-toolbar {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .toolbar-group {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 5px;
  }
  
  .toolbar-group .el-button {
    font-size: 11px;
    padding: 6px 10px;
  }
  
  .split-view {
    flex-direction: column;
    gap: 15px;
  }
  
  .editor-section, .preview-section {
    flex: none;
    height: 50%;
  }
  
  .markdown-editor {
    height: 300px !important;
  }
  
  .markdown-preview {
    height: 300px;
    overflow-y: auto;
  }
  
  .outline-container {
    max-height: 200px;
  }
  
  .outline-content {
    font-size: 12px;
  }
  
  .level-2 {
    padding-left: 10px !important;
  }
  
  .level-3 {
    padding-left: 20px !important;
  }
  
  .level-4, .level-5, .level-6 {
    padding-left: 30px !important;
  }
  
  .word-count-info {
    gap: 5px;
  }
  
  .word-count-info .el-tag {
    font-size: 11px;
    padding: 2px 6px;
  }
}

/* 全屏模式样式 */
:fullscreen .markdown-card {
  height: 100vh;
  width: 100vw;
  border-radius: 0;
  box-shadow: none;
}

:fullscreen .card-body {
  padding: 20px;
}

/* 快捷键提示对话框样式 */
.shortcuts-content {
  font-size: 14px;
  line-height: 1.6;
}

.shortcuts-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 15px;
}

.shortcut-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.shortcut-item:hover {
  background-color: #ecf5ff;
}

.shortcut-key {
  font-family: 'Consolas', 'Monaco', monospace;
  font-weight: 600;
  background-color: #e8e8e8;
  padding: 4px 8px;
  border-radius: 3px;
  color: #303133;
}

.shortcut-desc {
  color: #606266;
}

.dark-theme .shortcut-item {
  background-color: #2d2d2d;
}

.dark-theme .shortcut-item:hover {
  background-color: #3a3a3a;
}

.dark-theme .shortcut-key {
  background-color: #444;
  color: #eee;
}

.dark-theme .shortcut-desc {
  color: #ccc;
}
</style>
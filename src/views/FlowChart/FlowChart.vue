<template>
  <div class="flow-chart-container">
    <div class="flow-chart-toolbar">
      <el-button-group>
        <el-button type="primary" @click="addNode('rectangle')">矩形</el-button>
        <el-button @click="addNode('ellipse')">椭圆</el-button>
        <el-button @click="addNode('diamond')">菱形</el-button>
        <el-button @click="addNode('triangle')">三角形</el-button>
      </el-button-group>
      <el-button-group>
        <el-button @click="deleteSelected">删除</el-button>
        <el-button @click="undo">撤销</el-button>
        <el-button @click="redo">重做</el-button>
      </el-button-group>
      <el-button-group>
        <el-button type="success" @click="exportToPDF">导出PDF</el-button>
        <el-button type="warning" @click="clearGraph">清空</el-button>
      </el-button-group>
    </div>
    <div class="flow-chart-main">
      <div id="flow-chart-container"></div>
    </div>
  </div>
</template>

<script>
import mxgraph from 'mxgraph'
import jsPDF from 'jspdf'

export default {
  name: 'FlowChart',
  data() {
    return {
      graph: null,
      container: null,
      mx: null,
      undoManager: null,
      changeListener: null
    }
  },
  mounted() {
    this.initFlowChart()
  },
  beforeDestroy() {
    if (this.container) {
      this.container.innerHTML = ''
    }
    
    // 移除事件监听器
    if (this.graph && this.changeListener) {
      this.mx.mxEvent.removeListener(this.graph.getModel(), 'change', this.changeListener)
    }
    
    // 清理资源
    this.graph = null
    this.container = null
    this.undoManager = null
    this.changeListener = null
  },
  methods: {
    initFlowChart() {
      // 初始化mxGraph
      this.mx = mxgraph({
        mxImageBasePath: 'mxgraph/images',
        mxBasePath: 'mxgraph'
      })
      
      // 获取mxGraph核心组件
      const { mxClient, mxGraph, mxRubberband, mxEvent, mxConstants, mxUtils, mxUndoManager } = this.mx
      
      // 检查浏览器兼容性
      if (!mxClient.isBrowserSupported()) {
        mxUtils.error('Browser is not supported!', 200, false)
        return
      }
      
      // 禁用右键菜单
      mxEvent.disableContextMenu(document.getElementById('flow-chart-container'))
      
      // 创建容器
      this.container = document.getElementById('flow-chart-container')
      
      // 创建图形
      this.graph = new mxGraph(this.container)
      
      // 启用橡皮框选择
      new mxRubberband(this.graph)
      
      // 配置图形交互
      this.graph.setConnectable(true) // 允许拖拽创建连接线
      this.graph.setMultigraph(false) // 不允许同一对节点之间有多条边
      this.graph.setAllowDanglingEdges(false) // 不允许悬空边
      this.graph.setDropEnabled(true) // 允许拖放
      
      // 配置图形选择
      this.graph.setCellsSelectable(true) // 允许单元格被选择
      this.graph.setCellsMovable(true) // 允许单元格移动
      this.graph.setCellsResizable(true) // 允许单元格调整大小
      this.graph.setCellsEditable(true) // 允许编辑单元格标签
      
      // 配置连接线
      this.graph.setEdgeLabelsMovable(true) // 允许移动边标签
      this.graph.setEdgeLabelsResizable(true) // 允许调整边标签大小
      this.graph.setEdgeStyleEnabled(true) // 启用边样式
      this.graph.setOrthogonal(false) // 不强制使用正交边
      this.graph.setUseBends(true) // 允许使用拐点
      this.graph.setBendableEdges(true) // 允许调整拐点
      this.graph.setLabelsVisible(true) // 显示标签
      
      // 配置图形网格
      this.graph.gridSize = 20
      this.graph.setGridEnabled(true) // 启用网格
      this.graph.snapToGrid = true // 吸附到网格
      
      // 获取样式表
      const styleSheet = this.graph.getStylesheet()
      
      // 配置默认顶点样式
      const defaultVertexStyle = styleSheet.getDefaultVertexStyle()
      defaultVertexStyle[mxConstants.STYLE_ROUNDED] = true
      defaultVertexStyle[mxConstants.STYLE_SHADOW] = true
      defaultVertexStyle[mxConstants.STYLE_FONTSIZE] = 12
      defaultVertexStyle[mxConstants.STYLE_FONTCOLOR] = '#333'
      defaultVertexStyle[mxConstants.STYLE_STROKECOLOR] = '#666'
      defaultVertexStyle[mxConstants.STYLE_FILLCOLOR] = '#f0f0f0'
      defaultVertexStyle[mxConstants.STYLE_STROKEWIDTH] = 2
      
      // 配置默认边样式
      const defaultEdgeStyle = styleSheet.getDefaultEdgeStyle()
      defaultEdgeStyle[mxConstants.STYLE_ROUNDED] = true
      defaultEdgeStyle[mxConstants.STYLE_SHADOW] = true
      defaultEdgeStyle[mxConstants.STYLE_STROKECOLOR] = '#666'
      defaultEdgeStyle[mxConstants.STYLE_STROKEWIDTH] = 2
      defaultEdgeStyle[mxConstants.STYLE_EDGE] = mxConstants.EDGESTYLE_ELBOW
      
      // 初始化撤销/重做管理器
      this.undoManager = new mxUndoManager()
      
      // 配置撤销/重做管理器
      this.undoManager.maxHistorySize = 100 // 设置最大历史记录数
      
      // 监听模型变化事件
      this.changeListener = (sender, evt) => {
        const edit = evt.getProperty('edit')
        if (edit) {
          this.undoManager.undoableEditHappened(edit)
        }
      }
      
      // 添加事件监听器
      this.mx.mxEvent.addListener(this.graph.getModel(), 'change', this.changeListener)
      
      // 连线样式已在上方配置完成
      
      // 设置容器大小
      this.container.style.width = '100%'
      this.container.style.height = '600px'
      
      // 获取默认父级单元格
      const parent = this.graph.getDefaultParent()
      
      // 开始事务
      this.graph.getModel().beginUpdate()
      try {
        // 绘制一个示例流程图
        const v1 = this.graph.insertVertex(parent, null, '开始', 200, 50, 80, 40)
        const v2 = this.graph.insertVertex(parent, null, '处理', 200, 150, 80, 40)
        const v3 = this.graph.insertVertex(parent, null, '判断', 200, 250, 80, 40, `shape=${mxConstants.SHAPE_RHOMBUS};fillColor=#f0f0f0;strokeColor=#666;strokeWidth=2;fontSize=12;fontColor=#333`)
        const v4 = this.graph.insertVertex(parent, null, '结束', 200, 350, 80, 40, `shape=${mxConstants.SHAPE_ELLIPSE};fillColor=#f0f0f0;strokeColor=#666;strokeWidth=2;fontSize=12;fontColor=#333`)
        
        this.graph.insertEdge(parent, null, '', v1, v2)
        this.graph.insertEdge(parent, null, '', v2, v3)
        this.graph.insertEdge(parent, null, '是', v3, v4)
        
        const v5 = this.graph.insertVertex(parent, null, '重试', 350, 250, 80, 40)
        this.graph.insertEdge(parent, null, '否', v3, v5)
        this.graph.insertEdge(parent, null, '', v5, v2)
      } finally {
        // 结束事务
        this.graph.getModel().endUpdate()
      }
    },
    addNode(shapeType) {
      const { mxConstants } = this.mx
      const parent = this.graph.getDefaultParent()
      const x = 100 + Math.random() * 400
      const y = 100 + Math.random() * 300
      const width = 80
      const height = 40
      
      // 创建不同形状的样式字符串
      let styleStr = ''
      switch (shapeType) {
        case 'rectangle':
          styleStr = `shape=${mxConstants.SHAPE_RECTANGLE};fillColor=#f0f0f0;strokeColor=#666;strokeWidth=2;fontSize=12;fontColor=#333`
          break
        case 'ellipse':
          styleStr = `shape=${mxConstants.SHAPE_ELLIPSE};fillColor=#f0f0f0;strokeColor=#666;strokeWidth=2;fontSize=12;fontColor=#333`
          break
        case 'diamond':
          styleStr = `shape=${mxConstants.SHAPE_RHOMBUS};fillColor=#f0f0f0;strokeColor=#666;strokeWidth=2;fontSize=12;fontColor=#333`
          break
        case 'triangle':
          styleStr = `shape=${mxConstants.SHAPE_TRIANGLE};fillColor=#f0f0f0;strokeColor=#666;strokeWidth=2;fontSize=12;fontColor=#333`
          break
      }
      
      this.graph.getModel().beginUpdate()
      try {
        this.graph.insertVertex(parent, null, '新节点', x, y, width, height, styleStr)
      } finally {
        this.graph.getModel().endUpdate()
      }
    },
    deleteSelected() {
      const cells = this.graph.getSelectionCells()
      if (cells && cells.length > 0) {
        this.graph.getModel().beginUpdate()
        try {
          this.graph.removeCells(cells)
        } finally {
          this.graph.getModel().endUpdate()
        }
      }
    },
    undo() {
      if (this.undoManager && this.undoManager.canUndo()) {
        this.undoManager.undo()
      }
    },
    redo() {
      if (this.undoManager && this.undoManager.canRedo()) {
        this.undoManager.redo()
      }
    },
    exportToPDF() {
      try {
        // 检查是否有图形元素
        const parent = this.graph.getDefaultParent()
        const cells = this.graph.getChildCells(parent)
        if (cells.length === 0) {
          this.$message.warning('图形中没有元素，无法导出PDF')
          return
        }
        
        const { mxImageExport, mxXmlCanvas2D } = this.mx
        
        // 创建一个临时的SVG画布
        const canvas = new mxXmlCanvas2D({
          createAbsoluteUrl: (url) => url
        })
        
        // 创建图像导出对象
        const imgExport = new mxImageExport()
        
        // 获取图形的边界框
        const bounds = this.graph.getGraphBounds()
        
        // 导出图形到画布
        imgExport.exportGraph(this.graph, canvas, bounds)
        
        // 将SVG转换为XML字符串
        const xml = canvas.root.outerHTML
        
        // 创建一个SVG元素
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        svg.setAttribute('width', bounds.width)
        svg.setAttribute('height', bounds.height)
        svg.innerHTML = xml
        
        // 创建一个canvas元素
        const canvasElement = document.createElement('canvas')
        canvasElement.width = bounds.width
        canvasElement.height = bounds.height
        const ctx = canvasElement.getContext('2d')
        
        // 绘制白色背景
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0, 0, bounds.width, bounds.height)
        
        // 将SVG转换为图像
        const svgData = new XMLSerializer().serializeToString(svg)
        const img = new Image()
        img.onload = () => {
          // 在canvas上绘制图像
          ctx.drawImage(img, 0, 0)
          
          // 创建PDF文档
          const imgData = canvasElement.toDataURL('image/png')
          const pdf = new jsPDF({
            orientation: bounds.width > bounds.height ? 'landscape' : 'portrait',
            unit: 'mm',
            format: 'a4'
          })
          
          // 计算图像在PDF中的位置和大小
          const pdfWidth = pdf.internal.pageSize.getWidth()
          const pdfHeight = pdf.internal.pageSize.getHeight()
          const ratio = Math.min(pdfWidth / bounds.width, pdfHeight / bounds.height)
          const scaledWidth = bounds.width * ratio
          const scaledHeight = bounds.height * ratio
          const x = (pdfWidth - scaledWidth) / 2
          const y = (pdfHeight - scaledHeight) / 2
          
          // 添加图像到PDF
          pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight)
          
          // 保存PDF文件
          pdf.save('flowchart.pdf')
          
          this.$message.success('PDF导出成功')
        }
        
        // 设置图像源
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)))
      } catch (error) {
        console.error('PDF导出失败:', error)
        this.$message.error('PDF导出失败，请检查控制台输出')
      }
    },
    exportToPDFAlternative() {
      try {
        // 备选方案：使用window.print()功能
        const printContent = this.graph.container.cloneNode(true)
        const printWindow = window.open('', '', 'width=800,height=600')
        
        if (printWindow) {
          printWindow.document.write('<html><head><title>FlowChart</title></head><body>')
          printWindow.document.write(printContent.outerHTML)
          printWindow.document.write('</body></html>')
          printWindow.document.close()
          printWindow.print()
          this.$message.success('请在打印对话框中选择"另存为PDF"')
        }
      } catch (error) {
        console.error('PDF导出备选方案失败:', error)
        this.$message.error('PDF导出失败，请使用浏览器的打印功能手动导出')
      }
    },
    clearGraph() {
      this.$confirm('确定要清空所有内容吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const parent = this.graph.getDefaultParent()
        const cells = this.graph.getChildCells(parent)
        
        this.graph.getModel().beginUpdate()
        try {
          this.graph.removeCells(cells)
        } finally {
          this.graph.getModel().endUpdate()
        }
      }).catch(() => {
        // 取消清空
      })
    }
  }
}
</script>

<style scoped>
.flow-chart-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  padding: 16px;
}

.flow-chart-toolbar {
  display: flex;
  gap: 16px;
  padding: 12px;
  background-color: #f5f7fa;
  border-radius: 4px;
  margin-bottom: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.flow-chart-main {
  flex: 1;
  background-color: #ffffff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: auto;
}

#flow-chart-container {
  width: 100%;
  height: 100%;
  min-height: 600px;
  background-color: #ffffff;
  background-image: 
    linear-gradient(#e8e8e8 1px, transparent 1px),
    linear-gradient(90deg, #e8e8e8 1px, transparent 1px);
  background-size: 20px 20px;
}
</style>

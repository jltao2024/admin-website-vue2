<template>
  <div class="dashboard-container">
    <el-card class="welcome-card">
      <div class="welcome-header">
        <h1>欢迎回来，{{ userName }}</h1>
        <p>{{ currentDate }}</p>
      </div>
      <div class="stats-container">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card class="stat-card" shadow="hover">
              <div class="stat-content">
                <div class="stat-icon blue">
                  <i class="el-icon-user-solid"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-number">1,234</div>
                  <div class="stat-label">用户总数</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="stat-card" shadow="hover">
              <div class="stat-content">
                <div class="stat-icon green">
                  <i class="el-icon-shopping-cart-full"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-number">567</div>
                  <div class="stat-label">今日订单</div>
                </div>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card class="stat-card" shadow="hover">
              <div class="stat-content">
                <div class="stat-icon purple">
                  <i class="el-icon-money"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-number">¥89,012</div>
                  <div class="stat-label">今日营收</div>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
      
      <!-- 图表区域 -->
      <div class="charts-container">
        <el-row :gutter="20" style="margin-top: 20px;">
          <!-- 折线图：用户增长趋势 -->
          <el-col :span="12">
            <el-card class="chart-card" shadow="hover">
              <div slot="header" class="chart-header">
                <span>用户增长趋势</span>
              </div>
              <div class="chart-wrapper">
                <v-chart :option="lineChartOption" autoresize />
              </div>
            </el-card>
          </el-col>
          
          <!-- 柱状图：销售数据 -->
          <el-col :span="12">
            <el-card class="chart-card" shadow="hover">
              <div slot="header" class="chart-header">
                <span>销售数据统计</span>
              </div>
              <div class="chart-wrapper">
                <v-chart :option="barChartOption" autoresize />
              </div>
            </el-card>
          </el-col>
        </el-row>
        
        <!-- 饼图：用户来源分布 -->
        <el-row :gutter="20" style="margin-top: 20px;">
          <el-col :span="12">
            <el-card class="chart-card" shadow="hover">
              <div slot="header" class="chart-header">
                <span>用户来源分布</span>
              </div>
              <div class="chart-wrapper">
                <v-chart :option="pieChartOption" autoresize />
              </div>
            </el-card>
          </el-col>
          
          <!-- 折线图：访问量统计 -->
          <el-col :span="12">
            <el-card class="chart-card" shadow="hover">
              <div slot="header" class="chart-header">
                <span>网站访问量统计</span>
              </div>
              <div class="chart-wrapper">
                <v-chart :option="trafficChartOption" autoresize />
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  DataZoomComponent
} from 'echarts/components'
import VChart from 'vue-echarts'

// 注册所需的组件
use([
  CanvasRenderer,
  LineChart, BarChart, PieChart,
  GridComponent, TooltipComponent, LegendComponent, TitleComponent, ToolboxComponent, DataZoomComponent
])

export default {
  name: 'Dashboard',
  components: {
    VChart
  },
  data() {
    return {
      userName: '',
      // 折线图选项 - 用户增长趋势
      lineChartOption: {
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#e0e0e0',
          borderWidth: 1,
          textStyle: {
            color: '#333'
          }
        },
        legend: {
          data: ['新增用户', '活跃用户'],
          top: 0
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          axisLine: {
            lineStyle: {
              color: '#e0e0e0'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#e0e0e0'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#f5f5f5'
            }
          }
        },
        series: [
          {
            name: '新增用户',
            type: 'line',
            stack: '总量',
            data: [120, 132, 101, 134, 90, 230, 210, 280, 360, 420, 480, 550],
            smooth: true,
            lineStyle: {
              color: '#667eea'
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(102, 126, 234, 0.3)'
                }, {
                  offset: 1, color: 'rgba(102, 126, 234, 0.05)'
                }]
              }
            }
          },
          {
            name: '活跃用户',
            type: 'line',
            stack: '总量',
            data: [220, 182, 191, 234, 290, 330, 310, 420, 450, 530, 610, 690],
            smooth: true,
            lineStyle: {
              color: '#52c41a'
            },
            areaStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: 'rgba(82, 196, 26, 0.3)'
                }, {
                  offset: 1, color: 'rgba(82, 196, 26, 0.05)'
                }]
              }
            }
          }
        ]
      },
      
      // 柱状图选项 - 销售数据
      barChartOption: {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#e0e0e0',
          borderWidth: 1,
          textStyle: {
            color: '#333'
          }
        },
        legend: {
          data: ['销售额', '订单量'],
          top: 0
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
          axisLine: {
            lineStyle: {
              color: '#e0e0e0'
            }
          }
        },
        yAxis: [
          {
            type: 'value',
            name: '销售额(万元)',
            axisLine: {
              lineStyle: {
                color: '#667eea'
              }
            },
            splitLine: {
              lineStyle: {
                color: '#f5f5f5'
              }
            }
          },
          {
            type: 'value',
            name: '订单量',
            axisLine: {
              lineStyle: {
                color: '#52c41a'
              }
            },
            splitLine: {
              show: false
            }
          }
        ],
        series: [
          {
            name: '销售额',
            type: 'bar',
            data: [23, 45, 32, 56, 78, 65, 89, 92, 105, 123, 145, 167],
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#667eea'
                }, {
                  offset: 1, color: '#764ba2'
                }]
              }
            },
            barWidth: '30%'
          },
          {
            name: '订单量',
            type: 'bar',
            yAxisIndex: 1,
            data: [1200, 2100, 1800, 2900, 3500, 3100, 4200, 4500, 5100, 6200, 7300, 8400],
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#52c41a'
                }, {
                  offset: 1, color: '#389e0d'
                }]
              }
            },
            barWidth: '30%'
          }
        ]
      },
      
      // 饼图选项 - 用户来源分布
      pieChartOption: {
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#e0e0e0',
          borderWidth: 1,
          textStyle: {
            color: '#333'
          }
        },
        legend: {
          orient: 'vertical',
          left: 10,
          top: 'center',
          textStyle: {
            fontSize: 12
          }
        },
        series: [
          {
            name: '用户来源',
            type: 'pie',
            radius: ['40%', '70%'],
            center: ['60%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 18,
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: [
              { value: 335, name: '直接访问', itemStyle: { color: '#667eea' } },
              { value: 310, name: '搜索引擎', itemStyle: { color: '#52c41a' } },
              { value: 234, name: '社交媒体', itemStyle: { color: '#f56c6c' } },
              { value: 135, name: '广告推广', itemStyle: { color: '#faad14' } },
              { value: 1548, name: '其他来源', itemStyle: { color: '#909399' } }
            ]
          }
        ]
      },
      
      // 折线图选项 - 网站访问量
      trafficChartOption: {
        tooltip: {
          trigger: 'axis',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          borderColor: '#e0e0e0',
          borderWidth: 1,
          textStyle: {
            color: '#333'
          }
        },
        legend: {
          data: ['PV', 'UV'],
          top: 0
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '15%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
          axisLine: {
            lineStyle: {
              color: '#e0e0e0'
            }
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#e0e0e0'
            }
          },
          splitLine: {
            lineStyle: {
              color: '#f5f5f5'
            }
          }
        },
        series: [
          {
            name: 'PV',
            type: 'line',
            data: [2600, 3200, 4100, 3500, 4800, 6500, 7200],
            lineStyle: {
              color: '#667eea',
              width: 3
            },
            itemStyle: {
              color: '#667eea',
              borderWidth: 2,
              borderColor: '#fff'
            },
            symbolSize: 8
          },
          {
            name: 'UV',
            type: 'line',
            data: [800, 1200, 1500, 1300, 1800, 2600, 2900],
            lineStyle: {
              color: '#f56c6c',
              width: 3
            },
            itemStyle: {
              color: '#f56c6c',
              borderWidth: 2,
              borderColor: '#fff'
            },
            symbolSize: 8
          }
        ]
      }
    }
  },
  mounted() {
    this.getUserInfo()
  },
  computed: {
    currentDate() {
      const date = new Date()
      const year = date.getFullYear()
      const month = (date.getMonth() + 1).toString().padStart(2, '0')
      const day = date.getDate().toString().padStart(2, '0')
      const week = ['日', '一', '二', '三', '四', '五', '六'][date.getDay()]
      return `${year}年${month}月${day}日 星期${week}`
    }
  },
  methods: {
    getUserInfo() {
      const user = this.$store.state.auth.user
      if (user) {
        this.userName = user.name
      } else {
        this.userName = '管理员'
      }
    }
  }
}
</script>

<style scoped>
.dashboard-container {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
}

.welcome-card {
  height: 100%;
  border-radius: 8px;
}

.welcome-header {
  margin-bottom: 30px;
}

.welcome-header h1 {
  font-size: 32px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 10px 0;
}

.welcome-header p {
  font-size: 16px;
  color: #909399;
  margin: 0;
}

.stats-container {
  margin-top: 20px;
}

.stat-card {
  border-radius: 8px;
  transition: all 0.3s ease;
  border: none;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.15);
}

.stat-content {
  display: flex;
  align-items: center;
  padding: 20px;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-right: 20px;
}

.stat-icon.blue {
  background-color: rgba(102, 126, 234, 0.1);
  color: #667eea;
}

.stat-icon.green {
  background-color: rgba(82, 196, 26, 0.1);
  color: #52c41a;
}

.stat-icon.purple {
  background-color: rgba(194, 123, 252, 0.1);
  color: #c27bfc;
}

.stat-info {
  flex: 1;
}

.stat-number {
  font-size: 28px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

/* 图表样式 */
.charts-container {
  margin-top: 30px;
}

.chart-card {
  border-radius: 8px;
  transition: all 0.3s ease;
  border: none;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.chart-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 4px 16px 0 rgba(0, 0, 0, 0.15);
}

.chart-header {
  font-weight: 600;
  color: #303133;
  font-size: 14px;
}

.chart-wrapper {
  height: 300px;
  width: 100%;
}
</style>
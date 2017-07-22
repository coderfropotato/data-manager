<template>
    <div class="calc_area">
        <label for="formula" class="desc">请输入计算表达式：</label>
        <el-input id="formula" v-model="input" placeholder="1 + 2.0 * 3.1 / (4 ^ 5.6)"></el-input>
        <div class="result-area">
            <span class="result-desc">结果：</span>
            <div id="result"></div>
        </div>
    </div>
</template>

<script>
  const zerorpc = require('zerorpc')
  let client = new zerorpc.Client()

  // 导出
  export default {
    name: 'Index',
    data () {
      return {
        input: '1 + 2.0 * 3.1 / (4 ^ 5.6)'
      }
    },
    mounted () {
      // 连接后台服务器
      this.connectServer()
      // 初始计算
      this.calculate()
    },
    watch: {
      // 观察输入框数据变化
      input () {
        // 计算表达式
        this.calculate()
      }
    },
    methods: {
      connectServer () {
        client.connect('tcp://127.0.0.1:4242')

        client.invoke('echo', 'server ready', (error, res) => {
          if (error || res !== 'server ready') {
            console.error(error)
          } else {
            console.log('server is ready')
          }
        })
      },
      calculate () {
        let formula = this.input
        let result = document.getElementById('result')

        client.invoke('calc', formula, (error, res) => {
          if (error) {
            console.error(error)
          } else {
            result.textContent = res
          }
        })
      }
    }
  }
</script>

<style lang="scss">
    .calc_area{
        width: 50%;
        margin: 60px auto;
        .desc,
        .result-desc{
            display: inline-block;
            float: left;
            margin: 20px 0;
        }
        #result{
            float: left;
            margin: 20px 10px;
            text-decoration: underline;
        }
    }
</style>

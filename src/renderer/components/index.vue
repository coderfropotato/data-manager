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
  import zmq from 'zeromq'
  // 请求与响应模式
  // let PyUrl = 'tcp://10.139.17.101:4242'
  // const NodeUrl = 'tcp://127.0.0.1'
  let sock = zmq.socket('req')
  function calculate (msg) {
    let result = document.getElementById('result')
    result.textContent = msg
  }

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
      // this.calculate()
    },
    watch: {
      // 观察输入框数据变化
      input () {
        // 计算表达式
        // this.calculate()
      }
    },
    methods: {
      connectServer () {
        sock.connect('tcp://10.139.17.101:4242')
        console.log('Worker connected to port 3000')
        let obj = {
          name: 'test',
          value: '1'
        }
        var jsonText = JSON.stringify(obj)
        // 发送JSON数据
        for (let i = 0; i < 10; i++) {
          sock.send(jsonText)
        }
        // 监听消息响应
        sock.on('message', function (msg) {
          console.log(msg.toString())
          calculate(msg.toString())
        })
      }
    }
  }
</script>

<style lang="scss">
    .calc_area {
        width: 50%;
        margin: 60px auto;
        .desc,
        .result-desc {
            display: inline-block;
            float: left;
            margin: 20px 0;
        }
        #result {
            float: left;
            margin: 20px 10px;
            text-decoration: underline;
        }
    }
</style>

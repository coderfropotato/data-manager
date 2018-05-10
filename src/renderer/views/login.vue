<template>
    <div class="login">
      <div class="frame">
        <div class="drag"></div>
        <i class="fa fa-minus" @click="hide"></i>
        <i class="fa fa-times" @click="close"></i>
      </div>
        <!-- login -->
      <div v-if="type==1" class="box login">
          <div class="wrap">
            <p><img src="../assets/images/computer.png" alt=""> | <span>数据管理系统</span></p>
            <div class="form-line">
              <i class="fa fa-user"></i><input type="text" placeholder="请输入用户名">
            </div>
            <div class="form-line">
              <i class="fa fa-unlock-alt"></i><input type="password" placeholder="请输入密码">
            </div>
            <div class="form-options">
               <el-checkbox v-model="checked">&emsp;记住密码</el-checkbox>
               <a href="javascript:;">忘记密码</a>
            </div>
            <el-button type="primary" @click="jump">登陆</el-button>
          </div>
      </div>
      <!-- forget password -->
      <div v-if="type==2" class="box login">
          <div class="wrap">
            <p><img src="../assets/images/computer.png" alt=""> | <span>数据管理系统</span></p>
            <div class="form-line">
              <i class="fa fa-user"></i><input type="text" placeholder="请输入用户名">
            </div>
            <div class="form-line">
              <i class="fa fa-unlock-alt"></i><input type="password" placeholder="请输入密码">
            </div>
            <div class="form-options">
               <el-checkbox v-model="checked">&emsp;记住密码</el-checkbox>
               <a href="javascript:;">忘记密码</a>
            </div>
            <el-button type="primary" @click="jump">登陆</el-button>
          </div>
      </div>
      <!-- modify password -->
      <div v-if="type==3" class="box login">
          <div class="wrap">
            <p><img src="../assets/images/computer.png" alt=""> | <span>数据管理系统</span></p>
            <div class="form-line">
              <i class="fa fa-user"></i><input type="text" placeholder="请输入用户名">
            </div>
            <div class="form-line">
              <i class="fa fa-unlock-alt"></i><input type="password" placeholder="请输入密码">
            </div>
            <div class="form-options">
               <el-checkbox v-model="checked">&emsp;记住密码</el-checkbox>
               <a href="javascript:;">忘记密码</a>
            </div>
            <el-button type="primary" @click="jump">登陆</el-button>
          </div>
      </div>
    </div>
</template>

<script>
export default {
  data() {
    return {
      checked: false,
      type: 1
    };
  },
  methods: {
    jump() {
      // this.$electron.shell.openExternal('http://www.baidu.com');return;
      this.$router.push("/files?type=file");
      this.$store.dispatch("setGlobalIsLogin", true);
    },
    hide() {
      this.$electron.ipcRenderer.send("hide-window");
    },
    close() {
      this.$electron.ipcRenderer.send("window-all-closed");
    }
  }
};
</script>

<style lang="scss" scoped>
.frame {
  height: 24px;
  background-color: #fff;
  display: flex;
  .drag {
    height: 24px;
    -webkit-app-region: drag;
    flex:1;
  }
  i {
    box-sizing: border-box;
    width: 30px;
    height: 24px;
    text-align: center;
    line-height: 24px;
    cursor: pointer;
    opacity: .6;
    transition: .2s all ease-in-out;
    &:last-child{
      margin-right: 12px;
    }
    &:hover{
      opacity: 1.0;
      transform: rotate(360deg);
      background-color: #eee;
    }
  }
  
}
.login {
  width: 100%;
  height: 100%;
  background: url("../assets/images/loginbg.png") no-repeat center;
  background-size: cover;
  position: relative;
}
.box {
  padding: 25px 70px;
  box-sizing: border-box;
  position: absolute;
  width: 36%;
  height: 32%;
  background-color: #fff;
  margin-left: -17.5%;
  margin-top: -14%;
  top: 50%;
  left: 50%;
  background: #ffffff;
  box-shadow: 0 5px 20px 0 rgba(60, 39, 209, 0.5);
  border-radius: 16px;
}
.wrap {
  & > p {
    text-align: center;
    margin-bottom: 12px;
  }
  img {
    width: 68px;
    height: 32px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 12px;
  }
  span {
    margin-left: 12px;
    font-size: 18px;
    color: #5378f8;
    font-weight: bold;
    letter-spacing: 0.9px;
    line-height: 18px;
  }
  .form-line {
    display: flex;
    padding: 4px;
    padding-top: 14px;
    border-bottom: 1px solid #1a1a1a;
    i {
      width: 16px;
      font-size: 14px;
      line-height: 20px;
    }
    input {
      flex: 1;
      border: none;
      outline: none;
      padding-left: 8px;
      font-size: 14px;
    }
  }

  .form-options {
    padding-top: 32px;
    &:after {
      content: "";
      display: block;
      clear: both;
    }
    .el-checkbox {
      float: left;
    }
    a {
      float: right;
    }
  }
  & > button {
    width: 100%;
    background: #5378f8;
    border-radius: 100px;
    margin-top: 12px;
  }
}
</style>



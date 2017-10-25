<template>  
    <div class="report">
        <input @click="loadPage('1')" v-model="database" type="button" name="" id="" >
        <input @click="loadPage('2')" v-model="qtlname" type="button" name="" id="" >
    </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
  name: "report-window",
  data() {
    return {
      database: "大豆数据库",
      qtlname: "QTL",
      isShow: false
    };
  },
  mounted(){
    this.$store.dispatch('removeRightView',true)
  },
  beforeDestroy(){
    this.$store.dispatch('removeRightView',false)
  },
  methods: {
    loadPage(num) {
      if (this.isShow) return;
      let _this = this;
      if (!this.isShow) {
        let reportWin = null;
        const BrowserWindow = this.$electron.remote.BrowserWindow;
        reportWin = new BrowserWindow({
          width: 1300,
          height: 800,
          show: false,
          webPreferences: {
            nodeIntegration: false
          }
        });
        const INDEX = "http://www.gooalgene.com:90/search/index";
        const content = reportWin.webContents;
        const MenuObj = this.$electron.remote.Menu;
        const menuItem = MenuObj.buildFromTemplate([
          {
            label: "index",
            click: function() {
              content.goToIndex(0);
            }
          },
          {
            label: "back",
            click: function() {
              content.goBack();
            }
          }
        ]);
        reportWin.setMenu(menuItem);
        reportWin.loadURL(INDEX);
        //ready to show 只会触发一次   dom-ready did-finish-load
        reportWin.on("ready-to-show", () => {
          reportWin.show();
          _this.isShow = true;
        });
        content.on("did-get-response-details", () => {
          content.executeJavaScript(
            `
            if(document){
              try{
                document.querySelector("header").style.display="none";
                document.querySelector("footer").style.display="none";
              }catch(e){}
            }
          `
          );
        });
        content.on("dom-ready", () => {
          content.executeJavaScript(
              `	var next = document.createElement('div');
                next.style.width='120px';
                next.style.height="120px";
                next.style.backgroundColor="#f60";
                next.style.position="fixed";
                next.style.left=0;
                next.style.top=0;
                next.addEventListener('click',function(){
                  
                },false)
                document.body.appendChild(next);
          `);
        });
        //关闭
        reportWin.on("closed", () => {
          reportWin = null;
          _this.isShow = false;
        });
      }
    }
  }
};
</script>
<style>

</style>

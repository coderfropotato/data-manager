<template>  
    <div class="report">
        <input @click="loadPage('1')" v-model="database" type="button" name="" id="" >
        <input @click="loadPage('2')" v-model="qtlname" type="button" name="" id="" >
    </div>
</template>

<script>
export default {
  name: "report-window",
  data() {
    return {
      database: "大豆数据库",
      qtlname: "QTL",
      isShow: false
    };
  },
  methods: {
    loadPage(num) {
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
				try{
					document.querySelector("header").style.display="none";
					document.querySelector("footer").style.display="none";
				}catch(e){}
			`
          );
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

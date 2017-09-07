<template>
  <div id="file-status-info-root" v-if="showFileStatusAside">
    <!-- 当点击文件/文件夹，显示对应信息 -->
    <div class="side-content" v-if="showMode">
      <!--组件标题-->
      <div class="header">
        <h1>文件详情</h1>
      </div>
      <!--基本信息-->
      <div class="basic-info">
        <h2>基本信息
          <el-button type="primary" v-if="showBasicInfo" @click="showBasicInfo = !showBasicInfo">收起
          </el-button>
          <el-button type="primary" v-if="!showBasicInfo" @click="showBasicInfo = !showBasicInfo">展开
          </el-button>
        </h2>
        <ul class="basic-info" v-if="showBasicInfo">
          <li>文件名: {{ basicInfo.filename }}</li>
          <!--文件夹不显示文件大小-->
          <li v-if="basicInfo.size">文件大小：{{ basicInfo.size | formatSize}}</li>
          <li>创建时间：{{ basicInfo.ctime | formatDate}}</li>
        </ul>
      </div>
      <!-- 来源信息 -->
      <div class="source-info">
        <h2>来源信息
          <el-button type="primary" v-if="showSourceInfo" @click="showSourceInfo = !showSourceInfo">收起
          </el-button>
          <el-button type="primary" v-if="!showSourceInfo" @click="showSourceInfo = !showSourceInfo">展开
          </el-button>
        </h2>
        <ul v-if="showSourceInfo">
          <li>类别:
            <el-select v-model="currentSourceInfo.type" filterable placeholder="选择来源">
              <el-option v-for="option in sourceTypeOptions" :key="option.value" :label="option.label"
                         :value="option.value">
              </el-option>
            </el-select>
          </li>
          <!-- 若是私有数据，显示如下内容  -->
          <div class="private-source" v-if="currentSourceInfo.type === 'private'">
            <li>项目名：
              <el-input v-model="currentSourceInfo.project" placeholder="请输入项目名"></el-input>
            </li>
            <li>项目负责人：
              <el-input v-model="currentSourceInfo.principle" placeholder="请输入项目负责人"></el-input>
            </li>
          </div>
          <!-- 若是公有数据，显示如下内容 -->
          <div class="public-source" v-if="currentSourceInfo.type === 'public'">
            <li>数据来源网址：
              <el-input v-model="currentSourceInfo.websites" placeholder="请输入数据来源网址"></el-input>
            </li>
          </div>
        </ul>
      </div>
      <!-- 文件属性 -->
      <div class="file-info" v-if="!isDir">
        <h2>文件属性
          <el-button type="primary" v-if="showFileInfo" @click="showFileInfo = !showFileInfo">收起</el-button>
          <el-button type="primary" v-if="!showFileInfo" @click="showFileInfo = !showFileInfo">展开</el-button>
        </h2>
        <div class="fileattr" v-if="showFileInfo">
          <ul>
            <li>文件类型：
              <!--这个地方要抽离出来currentFiletype，不能直接用currentFileattr.filetype,否则会死循环到怀疑人生-->
              <el-select v-model="currentFiletype" @change="getTemplate"
                         placeholder="请选择文件类型">
                <el-option
                  v-for="item in filetypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </li>
            <!-- 根据不同文件类型，自动显示不同的属性 -->
            <div class="root-attributes" v-for="(rootAttribute, key) in currentFileattr"
                 v-if="key != 'filetype'">
              <h3>{{ getChineseName(key) }}</h3>
              <div class="child-attributes" v-for="(childAttribute, key) in rootAttribute">
                {{ getChineseName(key) }}
                <!--这个地方只能用rootAttribute[key]，不能用childAttribute，who tm knows-->
                <el-input v-model="rootAttribute[key]" placeholder="请输入内容"></el-input>
              </div>
            </div>
          </ul>
        </div>
      </div>
      <!-- 底部按钮 -->
      <div class="footer">
        <el-button type="primary" size="small" @click="addNewTaggedFile">更改属性</el-button>
        <el-button size="small">自动识别</el-button>
        <el-button size="small" @click="ignoreThis">忽略此文件</el-button>
        <el-button size="small" @click="ignoreNewAttribute">放弃修改</el-button>
      </div>
    </div>
    <!-- 当勾选要提交的文件时，显示对应信息 -->
    <div class="side-content" v-if="!showMode">
      您选中了{{ selectedFilesNum }}个文件
    </div>
  </div>

</template>

<script>
  import { mapGetters, mapActions } from 'vuex'

  export default {
    name: 'FileStatusAside',

    data () {
      return {
        // 控制是否显示
        showBasicInfo: true,    // 是否展示基本信息
        showSourceInfo: true,   // 是否展示来源信息
        showFileInfo: true,     // 是否展示文件属性

        // 来源类型下拉框选项
        sourceTypeOptions: [
          {
            value: 'public',
            label: '公有数据'
          },
          {
            value: 'private',
            label: '私有数据'
          }
        ],

        filetypeOptions: [
          {
            value: 'fastq',
            label: 'fastq'
          },
          {
            value: 'wtf',
            label: 'wtf'
          }
        ],

        // 前端临时保存的数据
        // 来源信息下拉框的值
        currentSourceInfo: {},

        // 当前准备填写的文件类型
        currentFiletype: '',

        // 文件属性的值
        currentFileattr: {},

        // 英文key与中文翻译对应表
        nameMap: {
          'sample': '样本',
          'library': '图书馆',
          'fastq': '法斯特球',
          'attr1': '哎呦',
          'attr2': '不错哟',
          'id': '样本编号',
          'name': '样本名',
          'organism': '物种',
          'strain': '品种',
          'tissue': '组织',
          'sex': '性别',
          'age': '年龄',
          'development_stage': '发育阶段',
          'breeding_history': '育种史',
          'biomaterial_provider': '材料提供者',
          'geographic_location': '地理位置',
          'treatment': '处理方式',
          'replicate': '生物学重复',
          'generation': '世代',
          'instrument': '测序平台',
          'strategy': '建库策略',
          'read_length': '读长',
          'source': '组学分类',
          'selection': '模版类型',
          'layout': '单/双端',
          'sequence_counts': '序列数',
          'qualities_options': '质量信息编码方式',
          'some': '你丫',
          'thing': '还',
          'oh': '真是个',
          'interesting': '人才'
        },

        fastqTemplate: {
          'filetype': 'fastq',
          'sample': {
            'id': '',
            'name': '',
            'organism': '',
            'strain': '',
            'tissue': '',
            'sex': '',
            'age': '',
            'development_stage': '',
            'breeding_history': '',
            'biomaterial_provider': '',
            'geographic_location': '',
            'treatment': '',
            'replicate': '',
            'generation': ''
          },
          'library': {
            'instrument': '',
            'strategy': '',
            'read_length': '',
            'source': '',
            'selection': '',
            'layout': ''
          },
          'fastq': {
            'sequence_counts': '',
            'qualities_options': ''
          }
        },

        wtfTemplate: {
          'filetype': 'wtf',
          'attr1': {
            'some': '',
            'thing': ''
          },
          'attr2': {
            'oh': '',
            'interesting': ''
          }
        }
      }
    },

    watch: {
      // 展示信息用
      // 观察basicInfo来判断是否点击了不同的文件/文件夹 不要观察nodeData 因为有可能nodeData改变了但是文件属性还没获取到
      // 当用户点击了中间某个文件/文件夹时需要获取一定的属性
      basicInfo () {
        // step1 二话不说，我觉得你根本就没有信息
        // 文件属性部分
        this.currentFileattr = {}
        this.currentFiletype = ''
        // 文件来源部分
        this.currentSourceInfo = {
          type: '',
          project: '',
          principle: '',
          websites: ''
        }
        // step2 如果文件已打好标签，直接获取显示
        if (this.taggedModifiedFiles.get(this.nodeData.path)) {
          let infos = this.taggedModifiedFiles.get(this.nodeData.path)
          // 文件才有下面的属性
          if (!this.isDir) {  // 只有文件夹有fileattr属性
            // 填充文件属性部分
            this.currentFileattr = infos.fileattr
            this.currentFiletype = infos.fileattr.filetype
          }
          // 填充文件来源部分,因为是在taggedModifiedFiles中获取的信息，所以有的字段可能没有，要先判断一下
          this.currentSourceInfo.type = infos.source.type ? infos.source.type : ''
          this.currentSourceInfo.project = infos.source.project ? infos.source.project : ''
          this.currentSourceInfo.principle = infos.source.principle ? infos.source.principle : ''
          this.currentSourceInfo.websites = infos.source.websites ? infos.source.websites : ''
        } else if (this.sourceInfo.type || (!this.isDir && this.fileAttr.filetype)) {    // step3 如果后台存在数据，说明该文件存在过，要把原来的信息展示出来，此时把后台存有的数据存到this.currentFileattr中
          // 填充文件属性部分
          if (!this.isDir && this.fileAttr.filetype) {
            this.currentFileattr = this.fileAttr
            this.currentFiletype = this.currentFileattr.filetype
          }
          // 填充文件来源部分
          if (this.sourceInfo.type) {
            this.currentSourceInfo.type = this.sourceInfo.type ? this.sourceInfo.type : ''
            this.currentSourceInfo.project = this.sourceInfo.project ? this.sourceInfo.project : ''
            this.currentSourceInfo.principle = this.sourceInfo.principle ? this.sourceInfo.principle : ''
            this.currentSourceInfo.websites = this.sourceInfo.websites ? this.sourceInfo.websites : ''
          }
        }
      }
    },

    computed: {
      ...mapGetters([
        'isDir', // 当前展示的文件是否是文件夹
        'selectedFilesNum', // 中间选中的文件数目
        'showMode', // 是否是展示文件信息，true时展示文件/文件夹属性，false展示选中了多少文件等属性
        'showFileStatusAside',    // 是否展示右侧文件详情栏
        'basicInfo',  // 文件基本信息
        'sourceInfo', // 文件来源信息
        'fileAttr',  // 文件详细信息
        'fileType',   // 即fileattr.filetype 文件类型
        'taggedModifiedFiles',   // 已打好标签的文件列表
        'serialNumber',     // 点选文件/文件夹的磁盘序列号
        // modifiedFilesTree: state => state.modified.modifiedFilesTree,   // 变更文件的文件树，直接从后台获取
        'nodeData' // 当前点选的文件/文件夹对应的Tree组件中的Node对象
      ])
    },

    methods: {
      ...mapActions([
        'ignoreFiles',  // 忽略文件
        'setNodeData', // 设置当前节点信息
        'renewNodeData',    // 更新当前节点数据
        'removeTaggedFile', // 放弃修改文件/文件夹的属性
        'addTaggedModifiedFile' // 增加该打好标签的文件
      ]),

      // 根据属性json里的英文key，获得对应中文翻译
      getChineseName (eng) {
        return this.nameMap[eng]
      },

      // 更改信息用
      // 用户选择不同的文件类型时，下面展示不同的属性编辑框
      getTemplate (data) {
        console.log('getTemplate with choice ', data)
        // 先生成模板呗
        switch (data) {
          case 'fastq':
            // 高能预警 要复制一份对象 否则你会哭的
            this.currentFileattr = JSON.parse(JSON.stringify(this.fastqTemplate))
            break
          case 'wtf' :
            // 高能预警 要复制一份对象 否则你会哭的
            this.currentFileattr = JSON.parse(JSON.stringify(this.wtfTemplate))
            break
          default:
            this.currentFileattr = {}
        }

        // 判断之前是否缓存过
        let oldAttribute = this.taggedModifiedFiles.get(this.nodeData.path)
        console.log('oldAttribute', oldAttribute)
        if (oldAttribute) { // 已缓存
          if (Object.keys(oldAttribute.fileattr).length > 0) { // 如果有文件详细属性，复制过去
            this.currentFileattr = JSON.parse(JSON.stringify(oldAttribute.fileattr))
            this.currentFiletype = oldAttribute.fileattr.filetype
          }
          if (Object.keys(oldAttribute.source).length > 0) {  // 如果有文件来源信息
            this.currentSourceInfo = JSON.parse(JSON.stringify(oldAttribute.source))
          }
        }
        // TODO:从服务器拉数据
      },

      // 添加打好标签的选中文件/文件夹
      addNewTaggedFile () {
//        console.log('before', this.currentSourceInfo)
//        console.log('this.currentSourceInfo.type ', this.currentSourceInfo.type)
        // 满足后端惨无人道的需求
        if (this.currentFiletype === '') {
          this.currentFileattr = {}
        }
        if (this.currentSourceInfo.type === 'public') {
          // 删除多余属性
          delete this.currentSourceInfo.principle
          delete this.currentSourceInfo.project
        } else if (this.currentSourceInfo.type === 'private') {
          // 删除多余属性
          delete this.currentSourceInfo.websites
        }
        if (this.currentSourceInfo.type === '') {
          this.currentSourceInfo = {}
        }

        // 添加打好标签的文件
        let newAttributes = {fileattr: this.currentFileattr, source: this.currentSourceInfo}

        // 为文件夹打标签的话不会有fileattr属性
        if (this.isDir) {
          delete newAttributes.fileattr
        }
        // 更改中间的状态提示
        this.renewNodeData({newAttributes: newAttributes, onlySourceInfo: this.isDir})
        console.log(this.taggedModifiedFiles)
      },

      // 放弃当前点选文件/文件夹的修改
      ignoreNewAttribute () {
        // store中删除
        this.removeTaggedFile()

        // 不显示信息
        // 重置文件属性
        this.currentFileattr = {}
        this.currentFiletype = ''

        // 重置文件来源
        this.currentSourceInfo = {
          type: '',
          project: '',
          principle: '',
          websites: ''
        }
      },

      // 忽略当前的文件
      ignoreThis () {
        let filePath = this.serialNumber + this.basicInfo.path
        this.ignoreFiles([filePath])
      }
    },
    filters: {
      // 格式化文件大小
      formatSize (size) {
        if (size <= 0) {
          return '0 bytes'
        }
        const abbreviations = ['bytes', 'kB', 'MB', 'GB']
        const index = Math.floor(Math.log(size) / Math.log(1024))
        return `${+(size / Math.pow(1024, index)).toPrecision(3)} ${abbreviations[index]}`
      },
      // 格式化时间，将秒转化成 XXXX/XX/XX 形式
      formatDate (date) {
        let d = new Date(date * 1000)
        let month = '' + (d.getMonth() + 1)
        let day = '' + d.getDate()
        let year = d.getFullYear()
        if (month.length < 2) month = '0' + month
        if (day.length < 2) day = '0' + day
        return [year, month, day].join('/')
      }
    }
  }
</script>

<style lang="scss" scoped>
  #file-status-info-root {
    overflow-y: scroll;
    width: 100%;
  }
</style>

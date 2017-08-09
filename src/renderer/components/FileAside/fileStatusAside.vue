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
                    <li v-if="basicInfo.size">文件大小：{{ basicInfo.size }}</li>
                    <li>创建时间：{{ basicInfo.ctime }}</li>
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
            <div class="file-info">
                <h2>文件属性
                    <el-button type="primary" v-if="showFileInfo" @click="showFileInfo = !showFileInfo">收起</el-button>
                    <el-button type="primary" v-if="!showFileInfo" @click="showFileInfo = !showFileInfo">展开</el-button>
                </h2>
                <div class="fileattr" v-if="showFileInfo">
                    <ul>
                        <li>文件类型：
                            <!--这个地方要抽离出来currentFiletype，不能直接用currentFileattr.filetype,否则会死循环到怀疑人生-->
                            <el-select v-model="currentFiletype" @change="getTemplate" placeholder="请选择文件类型">
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
                <el-button size="small">忽略此文件</el-button>
                <el-button size="small">放弃修改</el-button>
            </div>
        </div>
        <!-- 当勾选要提交的文件时，显示对应信息 -->
        <div class="side-content" v-if="!showMode">
            您选中了个文件
        </div>
    </div>

</template>

<script>
  import { mapState, mapActions } from 'vuex'

  export default {
    name: 'FileStatusAside',

    data () {
      return {
        // 控制是否显示
        showMode: true, // 是否是展示文件信息，true时展示文件/文件夹属性，false展示选中了多少文件等属性

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
        currentSourceInfo: {
          type: '',
          project: '',
          principle: '',
          websites: ''
        },

        // 当前准备填写的文件类型
        currentFiletype: '',

        // 文件属性的值
        currentFileattr: {
          filetype: '',
          attr1: {
            some: 'hehe',
            thing: 'quni'
          },
          attr2: {
            oh: 'daye',
            interesting: 'de'
          }
        },

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
      nodeData () {
        // step1 二话不说，我觉得你根本就没有信息
        // 文件属性部分
        this.currentFileattr = {
          filetype: ''
        }
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
          // 填充文件属性部分
          this.currentFileattr = infos.fileattr
          this.currentFiletype = infos.fileattr.filetype

          // 填充文件来源部分
          this.currentSourceInfo = infos.source
        } else if (this.fileAttr.filetype || this.sourceInfo.type) {    // step3 如果后台存在数据，说明该文件存在过，要把原来的信息展示出来，此时把后台存有的数据存到this.currentFileattr中
          // 填充文件属性部分
          if (this.fileAttr.filetype) {
            this.currentFileattr = this.fileAttr
            this.currentFiletype = this.currentFileattr.filetype
          }
          // 填充文件来源部分
          if (this.sourceInfo.type) {
            this.currentSourceInfo = this.sourceInfo
          }
        }
      }
    },

    computed: {
      ...mapState({
        showFileStatusAside: state => state.modified.showFileStatusAside,    // 是否展示右侧文件详情栏
        basicInfo: state => state.fileInfo.basicInfo,  // 文件基本信息
        sourceInfo: state => state.fileInfo.sourceInfo, // 文件来源信息
        fileAttr: state => state.fileInfo.fileAttr,  // 文件详细信息
        filetype: state => state.fileInfo.fileAttr.filetype,   // 即fileattr.filetype 文件类型
        taggedModifiedFiles: state => state.modified.taggedModifiedFiles,   // 已打好标签的文件列表
        serialNumber: state => state.fileInfo.serialNumber,     // 点选文件/文件夹的磁盘序列号
        modifiedFilesTree: state => state.modified.modifiedFilesTree,   // 变更文件的文件树，直接从后台获取
        nodeData: state => state.modified.nodeData  // 当前点选的文件/文件夹对应的Tree组件中的Node对象
      })
    },

    methods: {
      ...mapActions([
        'setNodeData', // 设置当前节点信息
        'renewNodeData',    // 更新当前节点数据
        'removeTaggedFile', // 放弃修改文件/文件夹的属性
        'addTaggedModifiedFile' // 增加该打好标签的文件
      ]),

      // 根据属性json里的英文key，获得对应中文翻译
      getChineseName (eng) {
        return this.nameMap[eng]
      },

      // 用户选择不同的文件类型时，下面展示不同的属性编辑框
      getTemplate (data) {
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
            this.currentFileattr = {
              filetype: ''
            }
        }
      },

      // 添加打好标签的选中文件/文件夹
      addNewTaggedFile () {
        // 添加打好标签的文件
        let newAttributes = {fileattr: this.currentFileattr, source: this.currentSourceInfo}
        // 更改中间的状态提示
        this.renewNodeData(newAttributes)
        console.log(this.taggedModifiedFiles)
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>

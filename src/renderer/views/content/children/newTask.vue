<template>
    <div id="newTask">
        <!--header-->
        <div class="header">
            <div class="tip-icon">
                <img src="../../../assets/images/u5.png" alt="u5">
            </div>
            <div class="headerRight">
                <div class="bell">
                    <img src="../../../assets/images/smallSearch.png" alt="u12">
                </div>
                <div class="setIcon">
                    <img src="../../../assets/images/bell.png" alt="u64">
                </div>
                <div class="computedServer">
                    <p class="avatar">
                        <!--<img src="" alt="">-->
                    </p>
                    <span class="server">{{user}}</span>
                </div>
            </div>
        </div>
        <hr>
        <div class="desc">
            <span>数据分析</span>
            <span>／</span>
            <span>新建任务</span>
        </div>
        <h3 style="margin:10px 0 10px 40px;">创建分析任务</h3>

        <p style="margin:10px 0 10px 40px;">表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。</p>
        <div class="selectarear">
            <div class="taskName">
                <div class="taskNameLeft">
                    <p class="nameDesc">任务名称:</p>
                    <el-input v-model="input" placeholder="请输入任务名称"></el-input>
                </div>
                <div class="taskNameRight">
                    <p class="nameDesc">分析流程:</p>
                    <el-select v-model="process" placeholder="请选择">
                        <el-option
                                v-for="item in processList"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </div>
                <div class="output">
                    <p class="nameDesc">输出路径:</p>
                    <el-input v-model="output" placeholder="C:\Users\Administrator\Desktop"></el-input>

                </div>
            </div>
            <div class="taskDesc">
                <p class="pull-left" style="margin-top:10px;margin-right:10px;">任务描述:</p>
                <el-input
                        type="textarea"
                        autosize
                        placeholder="请输入任务介绍"
                        v-model="textarea">
                </el-input>
            </div>


        </div>
        <!--目录结构和参数配置-->
        <div class="paramSet">
            <div class="dirTree">
                <el-input
                        placeholder="请输入"
                          icon="search"
                          :on-icon-click="handleIconClick"
                        v-model="searchInput">
                </el-input>
                <div class="dirList">
                    <el-tree default-expand-all :data="data"  :props="defaultProps" :highlight-current=false @node-click="handleNodeClick" @current-change="currentChange"></el-tree>
                </div>
                <div class="fileUpload">
                    <el-upload
                            ref="upload"
                            action="http://localhost:8080"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :auto-upload="true"
                            accept="file"
                            >
                        <el-button slot="trigger" size="small">上传文件</el-button>
                    </el-upload>
                </div>
            </div>
            <div class="setParams">
                    <div class="geneGroup">
                        <p class="title">
                            <!--<img src="" alt="">-->
                            参考基因组设置
                        </p>
                        <div class="geneFile">
                            <p class="pull-left marginTop">基因组文件:</p>
                            <el-button size="small" @click="autoImport" class="pull-left">自动导入</el-button>
                        </div>
                        <div class="fasta">
                            <p class="pull-left marginTop">1.基因组序列文件:</p>
                            <el-input size="small" class="pull-left" v-model="fastaFile" placeholder="请将基因组fasta格式文件拖拽至此处"></el-input>
                            <el-button size="small" @click="deleteFa" class="pull-left">清空</el-button>
                        </div>
                        <div class="gff">
                            <p class="pull-left marginTop">1.基因组序列文件:</p>
                            <el-input size="small" class="pull-left" v-model="gff" placeholder="请将基因组gff格式文件拖拽至此处"></el-input>
                            <el-button size="small" @click="deleteGff" class="pull-left">清空</el-button>
                        </div>
                    </div>
                    <div class="originalSet">
                        <p class="title">
                            <!--<img src="" alt="">-->
                            原始数据设置
                        </p>
                        <div class="autoSet">
                            <el-button size="small" @click="autoImportO" class="pull-left">自动导入</el-button>
                            <el-button size="small" @click="deleteList" class="pull-left">清空列表</el-button>
                        </div>
                        <div class="dataList">
                            <el-input size="small" class="pull-left" v-model="sampleName" placeholder="T1"></el-input>
                            <el-input size="small" class="pull-left" v-model="fa1" ></el-input>
                            <el-input size="small" class="pull-left" v-model="fa2" ></el-input>


                        </div>
                    </div>
            </div>

        </div>
    </div>
</template>

<script>
    export default {
        name: "new-task",
        data(){
            return {
                input:"",
                user:"jarrr",
                process:"",
                output:"",
                textarea:"",
                searchInput:"",
                processList:[{
                    value: '选项1',
                    label: 'Gwas 分析'
                }, {
                    value: '选项2',
                    label: 'Mrna 分析'
                }, {
                    value: '选项3',
                    label: '变异分析'
                }],
                data: [
                    {
                        id:1,
                        label: 'A层级目录1',
                        children: [
                            {
                                label: 'B层级目录1',
                                children: [{
                                    label: 'C层级文件1',
                                    label: 'C层级文件2'
                                }]
                            },
                            {
                                label: 'B层级目录2',
                                children: [
                                    {
                                        label: 'C层级文件1',
                                        label: 'C层级文件2'
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        id:2,
                        label: 'A层级目录1',
                        children: [
                                {
                                    label: 'B层级目录1',
                                    children: [{
                                        label: 'C层级文件1'
                                    }]
                                },
                                {
                                    label: 'B层级目录2',
                                    children: [{
                                        label: 'C层级文件2'
                                    }]
                                }
                        ]
                    }
                ],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                }
            }
        },
        methods:{
            handleIconClick(ev){
                alert(this.searchInput);
            },

            handleNodeClick(data) {
                // alert("current node ")
                console.log(data);
            },
            // 递归获取tree所有节点数据
            currentChange(data){
                console.warn(data);
            },
            autoImport(){
                alert("auto import");
            },
            deleteFa(){
                alert("delete fasta")
            },
            deleteGff(){
                alert("delete Gff")
            },
            autoImportO(){
                alert("原始数据自动导入")
            },
            deleteList(){
                alert("原始数据清空列表")
            }


            // handleRemove(file){
            //     console.log(file)
            //     alert("handleRemove")
            // },
            // handlePreview(file){
            //     console.log(file)
            //     alert("handlePreview")
            // }
        }
    }
</script>

<style lang="scss" scoped>
    $topDistance:30px;
    $leftDistance:40px;
    $rightDistance:20px;
    $bottomDistance:20px;
    .marginTop{
        margin-top:4px;
        margin-right:10px;
    }

    #newTask{
        height:100%;
        overflow:scroll;
        .header{
            overflow:hidden;
            .tip-icon{
                margin:20px 20px 20px 40px;
                float:left;
                img{
                    width:20px;
                    height:20px;
                }
            }
            .headerRight{
                margin:20px 20px 20px 40px;
                float:right;
                overflow:hidden;
                &>div{
                    float:left;
                    margin-right:16px;

                }
                img{
                    width:20px;
                    height:20px;
                }
                .setIcon img{
                    width:20px;
                    height:20px;
                }
                .computedServer {
                    overflow:hidden;
                    .avatar{
                        float:left;
                        width:20px;
                        height:20px;
                        margin-right:5px;
                        background:#00ff00;
                        -webkit-border-radius: 50%;
                        -moz-border-radius: 50%;
                        border-radius: 50%;
                    }
                    img {
                        width: 20px;
                        height: 26px;
                    }
                    .server{
                        float:left;
                    }
                }
            }

        }
        .desc{
            margin:15px 0px 15px 40px;
        }
        .selectarear{
            margin:0 auto;
            width:90%;
            /*margin:10px 20px;*/
            .taskName{
                margin-top:20px;
                overflow:hidden;
                .taskNameLeft,.taskNameRight,.output{
                    width:33%;
                    float:left;
                    overflow:hidden;
                    /*margin-right:3px;*/
                    &>div{
                        width:70%;
                    }
                }
                .el-input,el-select{
                    width:200px;
                    float:left;
                }
                .nameDesc{
                    float:left;
                    margin-top:10px;
                    margin-right:10px;
                }

            }
            .taskDesc{
                margin-top:$topDistance;
                &>div{
                    width:400px;
                    min-heigh:200px;
                }
            }
        }
        .paramSet{
            overflow:hidden;
            margin-top: $topDistance;
            margin-left: $leftDistance;
            // 目录树
            .dirTree{
                float:left;
                width:25%;
                .dirList{
                    margin-top:10px;
                }
                .el-tree{
                    height:260px;
                    overflow:scroll;
                    width:100%;
                }
                .fileUpload{
                    text-align:center;
                    margin-top:10px;
                }

            }

            // 参数设置
            .setParams{

                float:left;
                margin-left:10px;
                width:73%;
                border:1px solid #9A9A9A;
                height:400px;
                overflow-y:scroll;
                padding-top: 14px;
                &>div{
                    margin-left:20px;
                }
                .geneGroup,.fasta,.gff{
                    .title{
                        font-size:20px;
                        font-weight: bold;
                    }
                    margin-top:10px;

                    .el-input{
                        width:40%;
                    }
                    .pull-left{
                        margin-right:$rightDistance;
                    }
                    overflow:hidden;
                    .geneFile{
                        margin-top:$topDistance;
                        margin-left:$leftDistance;
                        overflow:hidden;
                    }
                }
                .originalSet{
                    margin-top:$topDistance;
                    &>p.title{
                        margin-top: $topDistance;
                    }

                    .autoSet{
                        margin-top:20px;
                    }
                }
            }
        }
    }

</style>
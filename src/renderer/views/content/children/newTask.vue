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
                <el-input style="width:200px;"
                        placeholder="请输入"
                          icon="search"
                          :on-icon-click="handleIconClick"
                        v-model="searchInput">
                </el-input>
            </div>
            <div class="setParams">

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
            }
        },
        methods:{
            handleIconClick(ev){
                alert(this.searchInput);
            }
        }
    }
</script>

<style lang="scss" scoped>
    $topDIstance:30px;
    $leftDistance:40px;
    $rightDistance:20px;
    $bottomDistance:20px;


    #newTask{
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
                margin-top:$topDIstance;
                &>div{
                    width:400px;
                    min-heigh:200px;
                }
            }
        }
        .paramSet{
            margin-top: $topDIstance;
            margin-left: $leftDistance;
            // 目录树
            .dirTree{


            }
            // 参数设置
            .setParams{

            }
        }
    }

</style>
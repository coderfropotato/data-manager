<template>
    <div id="bottom" v-if="bottom.bottomShow">
        <p>
            <span>{{totalCount}}个项目&emsp;选中{{selectedCount}}个项目&emsp;文件大小：{{selectedSize | reverseSize}}</span>
            <em v-if="JSON.stringify(fileInfo)!=='{}'">文件路径：<span>{{fileInfo.basic.path}}</span></em>
        </p>
    </div>
</template>

<script>
import {mapState,mapGetters} from 'vuex'
export default {
    data(){
        return {

        }
    },
    computed:{
        ...mapState(['bottom']),
        ...mapGetters(['totalCount','selectedCount','selectedSize','fileInfo'])
    }
}
</script>

<style lang="scss" scoped>
#bottom{
    // border-top: 1px solid #ccc;
    height: 40px;
    font-size: 12px;
    line-height: 40px;
    padding-left: 22px;
    padding-right: 22px;
    cursor: default;
    p{
        display: flex;
        justify-content: space-around;
        span{
            flex:1;
            padding-right: 40px;
        }
        em{
            flex:1;
            text-align: right;
            font-style: normal;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            span{
                cursor: text;
                user-select: all;
                // color: #386cca;
                padding:0!important;
            }
        }
    }
}
</style>

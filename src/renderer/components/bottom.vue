<template>
    <div id="bottom" v-if="bottom.bottomShow">
        <p>10个项目&emsp;选中1个项目&emsp;文件大小：900M</p>
    </div>
</template>

<script>
import {mapState} from 'vuex'
export default {
    data(){
        return {

        }
    },
    computed:{
        ...mapState(['bottom'])
    }
}
</script>

<style lang="scss" scoped>
#bottom{
    border-top: 1px solid #ccc;
    height: 40px;
    font-size: 12px;
    line-height: 40px;
    padding-left: 22px;
    padding-left: 22px;
}
</style>

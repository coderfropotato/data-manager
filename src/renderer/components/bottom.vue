<template>
    <div id="bottom" v-if="bottom.bottomShow">
        <p>{{totalCount}}个项目&emsp;选中{{selectedCount}}个项目&emsp;文件大小：{{selectedSize | reverseSize}}</p>
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
        ...mapGetters(['totalCount','selectedCount','selectedSize'])
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

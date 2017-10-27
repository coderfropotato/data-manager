<template>
    <div id="bottom" v-if="bottom.bottomShow">
        {{bottom.bottomShow}}
        <p>bottom file status area</p>
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
    font-size: 14px;
    line-height: 40px;
    padding-left: 22px;
}
</style>

<template>
    <div id="rootDetail">rootDetail</div>
</template>

<script>
export default {
    data(){
        return {

        }
    },
    activated(){
        this.$store.dispatch("removeRightView", true);
    },
    deactivated(){
        this.$store.dispatch("removeRightView", false);
    }
}
</script>

<style>

</style>

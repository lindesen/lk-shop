<template>
    <div class="wrapper">
        <div class="itemWrapper" v-for="(nav) in nav_List" :key="nav.cid">
            <div class="imageWrapper">
                <img class="image" :src="nav.icon_url" :alt="nav.name">
            </div>
            <div class="titleWrapper">
                <span class="title">{{nav.name}}</span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    props:{
        nav_List:Array
    }
}
</script>
<style scoped>
.wrapper {
            padding-top: 0.9375rem;
            background: #FFF;
            padding-bottom: 0.9375rem;
        }

        .itemWrapper {
            display: inline-block;
            padding-top: 0.3125rem;
            width: 20%; }

        .imageWrapper {
            padding-bottom: 58.823%;
            height: 0;
            overflow: hidden;
            text-align: center; }

        .image {
            width: 58.823%;
            height: auto;
            display: inline-block; }

        .titleWrapper {
            padding: 0.4375rem 0.3125rem 0.375rem 0.3125rem;
            text-align: center;
            
             }
            


        .title {

            font-size: 0.70rem;
            color: #555555;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
</style>
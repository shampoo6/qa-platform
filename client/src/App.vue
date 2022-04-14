<script setup>
import {ref} from 'vue';
import zhCN from 'ant-design-vue/lib/locale/zh_CN.js'

const locale = ref(zhCN)
</script>

<template>
  <a-config-provider :locale="locale">
    <router-view/>
  </a-config-provider>
</template>

<style>
</style>

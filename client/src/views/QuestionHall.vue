<script setup>
import {onMounted, reactive, ref} from 'vue';
import hallApi from '@/api/hall.js';
import qtAnswerApi from '@/api/qtAnswer.js';
import {useRouter} from 'vue-router';
import {message} from 'ant-design-vue';

const router = useRouter();

const dataList = ref(reactive([]));
const loading = ref(false);

onMounted(() => {
  list();
});


async function list() {
  loading.value = true;
  let r = await hallApi.list();
  dataList.value = r;
  loading.value = false;
}

function start(pqId) {
  qtAnswerApi.start(pqId).then(r => {
    console.log(r);
    router.push({name: 'qaPage', params: {id: r}}).then(() => {
      message.info('开始答题')
    });
  });
}
</script>

<template>
  <a-card>
    <template #title>
      <a-button :loading="loading" @click="list">刷新</a-button>
    </template>

    <a-list
        item-layout="horizontal"
        :data-source="dataList"
        :loading="loading"
    >
      <template #renderItem="{ item }">
        <a-list-item>
          <template #actions>
            <a-button @click="start(item._id)">开始答题</a-button>
          </template>
          <a-list-item-meta
              description=""
          >
            <template #title>
              {{ '问卷名: ' + item.name }}
            </template>
          </a-list-item-meta>
          <div>{{ '出题人: ' + item.nickname }}</div>
        </a-list-item>
      </template>
    </a-list>
  </a-card>
</template>

<style scoped>

</style>
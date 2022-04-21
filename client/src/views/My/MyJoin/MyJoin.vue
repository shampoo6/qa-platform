<script setup>
import {reactive, ref} from 'vue';
import qtAnswerApi from '@/api/qtAnswer.js';

// 工具栏相关
const name = ref('');

// 表格数据
const tableData = ref(reactive([]));
const pager = reactive({
  position: ['bottomCenter'], // 位置
  current: 1, // 当前页
  defaultPageSize: 5, // 默认每页显示多少条数据
  pageSize: 5, // 当前每页显示多少条数据1
  pageSizeOptions: ['5', '10', '20', '50'], // 每页显示数据量的选项
  showQuickJumper: true, // 是否显示快捷跳转框
  showSizeChanger: true, // 是否显示每页显示数量的选项框
  total: 0, // 总数据量
  showTotal: (total, range) => {
    return `共 ${total} 条`; // 返回的内容将显示到分页上
  }
});
const columns = [
  {
    title: '序号',
    dataIndex: '_id',
    key: '_id',
  },
  {
    title: '问卷名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '是否交卷',
    dataIndex: 'done',
    key: 'done'
  },
  {
    title: '分数',
    dataIndex: 'score',
    key: 'score'
  },
  {
    title: '操作',
    key: 'op',
  }
];
const loading = ref(false);

async function page() {
  loading.value = true;
  try {
    let r = await qtAnswerApi.page(pager.current, pager.pageSize, name.value);
    tableData.value = r.list;
    pager.total = r.total;
  } finally {
    loading.value = false;
  }
}

page();
</script>

<template>
  <a-row>
    <a-col :span="24">
      <a-card>
        <a-form layout="inline">
          <a-form-item label="问卷名称">
            <a-input v-model:value="name" :maxlength="50"></a-input>
          </a-form-item>
          <a-form-item>
            <a-button @click="page" :loading="loading">查询</a-button>
          </a-form-item>
        </a-form>
      </a-card>
    </a-col>
    <a-col :span="24">
      <a-card>
        <a-table :loading="loading" :dataSource="tableData" :columns="columns" row-key="_id"
                 :pagination="pager">
          <template #bodyCell="{column, record}">
            <template v-if="column.key === 'done'">
              <a-tag v-if="record.done" color="green">已交卷</a-tag>
              <a-tag v-else color="red">未交卷</a-tag>
            </template>
            <template v-if="column.key === 'op'">
              <a-button type="primary" @click="$router.push({name: 'qaPage', params: {id: record._id}})">查看</a-button>
            </template>
          </template>
        </a-table>
      </a-card>
    </a-col>
  </a-row>
</template>

<style scoped>

</style>
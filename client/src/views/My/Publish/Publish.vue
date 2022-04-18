<script setup>
import {onMounted, reactive, ref} from 'vue';
import questionTemplateApi from '@/api/questionTemplate.js';
import publishQuestionApi from '@/api/publishQuestion.js';
import qtAnswerApi from '@/api/qtAnswer.js';
import {message} from 'ant-design-vue';

const activeKey = ref('1');
const name = ref('');
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
    title: '操作',
    key: 'op',
  }
];
const dataList = ref(reactive([]));
const visible = ref(false);
const partyList = ref(reactive([])); // 答题者列表


onMounted(() => {
  page();
});


// 分页查询问卷表
async function page() {
  const result = await questionTemplateApi.page(pager.current, pager.pageSize, name.value);
  tableData.value = result.list;
  pager.total = result.total;
}

// 查询已发布列表
async function list() {
  dataList.value = await publishQuestionApi.list();
}

function tableChange(pagination) {
  pager.current = pagination.current;
  pager.pageSize = pagination.pageSize;
  page();
}

function publish(id) {
  publishQuestionApi.publish(id).then(() => {
    message.success('发布成功');
  });
}

function tabChange(activeKey) {
  if (activeKey === '1') page();
  else list();
}

function closeQt(id) {
  publishQuestionApi.close(id).then(() => {
    message.success('关闭成功');
    list();
  });
}

async function view(qtId) {
  visible.value = true;
  partyList.value = await qtAnswerApi.listByQtId(qtId);
}

async function view2(pqId) {
  visible.value = true;
  partyList.value = await qtAnswerApi.listByPqId(pqId);
}

</script>

<template>
  <a-card>
    <a-tabs @change="tabChange" v-model:activeKey="activeKey">
      <a-tab-pane key="1" tab="我的问卷">
        <a-row>
          <a-col :span="24">
            <a-card>
              <a-form layout="inline">
                <a-form-item label="问卷名称">
                  <a-input v-model:value="name" :maxlength="50"></a-input>
                </a-form-item>
                <a-form-item>
                  <a-button @click="page">查询</a-button>
                </a-form-item>
              </a-form>
            </a-card>
          </a-col>
          <a-col :span="24">
            <a-card>
              <a-table :dataSource="tableData" :columns="columns" row-key="_id"
                       :pagination="pager" @change="tableChange">
                <template #bodyCell="{column, record}">

                  <template v-if="column.key === 'op'">
                    <a-space>
                      <a-button @click="publish(record._id)">发布</a-button>
                      <a-button type="primary" @click="view(record._id)">查看</a-button>
                    </a-space>
                  </template>
                </template>
              </a-table>
            </a-card>
          </a-col>
        </a-row>
      </a-tab-pane>
      <a-tab-pane key="2" tab="已发布的">

        <a-list
            item-layout="horizontal"
            :data-source="dataList"
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <template #actions>
                <a-button danger @click="closeQt(item._id)">关闭</a-button>
                <a-button type="primary" @click="view2(item._id)">查看</a-button>
              </template>
              <a-list-item-meta
                  description=""
              >
                <template #title>
                  问卷名
                </template>
              </a-list-item-meta>
              <div>{{ item.name }}</div>
            </a-list-item>
          </template>
        </a-list>

      </a-tab-pane>
    </a-tabs>

    <a-modal v-model:visible="visible" title="答题人列表">
      <a-list
          item-layout="horizontal"
          :data-source="partyList"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <template #actions>
              <a-button type="primary" @click="$router.push({name: 'qaPage', params: {id: item._id}})">查看</a-button>
            </template>
            <a-list-item-meta
                description=""
            >
              <template #title>
                答题人: {{ item.nickname }}
              </template>
            </a-list-item-meta>
            <div v-if="item.done">分数: {{ item.score }}</div>
            <div v-else>
              <a-tag color="red">未交卷</a-tag>
            </div>
          </a-list-item>
        </template>
      </a-list>

      <template #footer>
        <a-button @click="visible = false">关闭</a-button>
      </template>
    </a-modal>
  </a-card>
</template>

<style scoped>

</style>
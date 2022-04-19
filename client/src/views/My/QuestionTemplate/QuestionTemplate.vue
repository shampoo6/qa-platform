<script setup>
import {ref, reactive, onMounted} from 'vue';
import questionTemplateApi from '@/api/questionTemplate.js';
import {message} from 'ant-design-vue';

// 表格相关数据
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
const tableData = ref(reactive([]));
const visible = ref(false);
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
const selections = ref([]);
const rowSelection = {
  onChange(selectedKeys) {
    selections.value = selectedKeys;
  }
};

// 工具栏相关
const name = ref('');
const removeButtonLoading = ref(false);

// 表单相关
const addTitle = '添加问卷';
const editTitle = '编辑问卷';
const form = ref(null);
const formData = reactive({
  _id: null,
  name: ''
});
const rules = {
  name: [
    {
      required: true,
      trigger: 'blur',
      message: '请输入问卷名称'
    },
    {
      min: 2,
      max: 50,
      trigger: 'blur',
      message: '请输入2~50字的问卷名称'
    }
  ]
};
const confirmLoading = ref(false);

onMounted(() => {
  page();
});

function tableChange(pagination) {
  console.log(pagination);
  pager.current = pagination.current;
  pager.pageSize = pagination.pageSize;
  page();
}

// 分页查询
async function page() {
  const result = await questionTemplateApi.page(pager.current, pager.pageSize, name.value);
  tableData.value = result.list;
  pager.total = result.total;
}

function add() {
  visible.value = true;
}

function handleOk() {

  form.value.validate().then(() => {
    console.log('pass');
    confirmLoading.value = true;

    // 判断添加还是修改
    let p;
    if (formData._id) {
      p = questionTemplateApi.update(formData._id, formData.name);
    } else {
      p = questionTemplateApi.add(formData.name);
    }

    p.then(() => {
      message.success('操作成功');
      page();
    }).finally(() => {
      confirmLoading.value = false;
      // 关闭模态
      visible.value = false;
    });
  });
}

function afterModalClose() {
  form.value.resetFields();
}

function remove(ids) {
  if (ids.length === 0) return;
  removeButtonLoading.value = true;
  questionTemplateApi.remove(ids).then(() => {
    message.success('删除成功');
    page();
  }).finally(() => {
    removeButtonLoading.value = false;
  });
}

function edit(id) {
  formData._id = id;
  // 回显数据
  let row = tableData.value.find(row => row._id === id);
  formData.name = row.name;
  visible.value = true;
}
</script>

<template>
  <div>
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
            <a-form-item>
              <a-button type="primary" @click="add">添加问卷</a-button>
            </a-form-item>
            <a-form-item>
              <a-popconfirm
                  title="你真的要删除吗?"
                  ok-text="确定"
                  cancel-text="取消"
                  @confirm="remove(selections)"
              >
                <a-button :loading="removeButtonLoading" type="primary" danger @click="">批量删除</a-button>
              </a-popconfirm>
            </a-form-item>
          </a-form>
        </a-card>
      </a-col>
      <a-col :span="24">
        <a-card>
          <a-table :row-selection="rowSelection" :dataSource="tableData" :columns="columns" row-key="_id"
                   :pagination="pager" @change="tableChange">
            <template #bodyCell="{column, record}">

              <template v-if="column.key === 'op'">
                <a-space>
                  <a-button type="primary" @click="$router.push({name: 'question', params: {id: record._id}})">编辑问题</a-button>
                  <a-button @click="edit(record._id)">编辑</a-button>
                  <a-popconfirm
                      title="你真的要删除吗?"
                      ok-text="确定"
                      cancel-text="取消"
                      @confirm="remove([record._id])"
                  >
                    <a-button :loading="removeButtonLoading" danger @click="">删除</a-button>
                  </a-popconfirm>
                </a-space>
              </template>
            </template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>


    <!-- 表单模态 -->
    <a-modal :afterClose="afterModalClose" v-model:visible="visible"
             :title="formData._id? editTitle: addTitle" @ok="handleOk"
             cancel-text="取消"
             ok-text="确定"
             :confirm-loading="confirmLoading"
    >
      <a-form :label-col="{span: 4}" ref="form" :model="formData" :rules="rules">
        <a-form-item v-show="formData._id" label="id" name="_id">
          <a-input type="text" readonly v-model:value="formData._id"></a-input>
        </a-form-item>
        <a-form-item label="问卷名称" name="name">
          <a-input type="text" v-model:value="formData.name" :maxlength="50"></a-input>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<style scoped>

</style>
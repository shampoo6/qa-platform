<script setup>
import {useRoute, useRouter} from 'vue-router';
import {onMounted, reactive, ref} from 'vue';
import questionTemplateApi from '@/api/questionTemplate.js';

const route = useRoute();
const router = useRouter();


const loading = ref(true);
const saveLoading = ref(false);
const questionTemplate = reactive({
  id: route.params.id,
  name: '',
  questions: []
});


onMounted(() => {
  query();
});


// 查询问卷
async function query() {
  const qt = await questionTemplateApi.getById(questionTemplate.id);
  questionTemplate.name = qt.name;
  questionTemplate.questions = qt.questions;
  loading.value = false;
}

function addQuestion() {
  questionTemplate.questions.push({
    question: '',
    score: 0,
    type: 'single',
    options: [],
    rights: [], // 多选的答案
    right: '' // 单选的答案
  });
}

function removeQuestion(index) {
  questionTemplate.questions.splice(index, 1);
}

function addOption(index) {
  questionTemplate.questions[index].options.push('');
}

function removeOption(questionIndex, optionIndex) {
  questionTemplate.questions[questionIndex].options.splice(optionIndex, 1);
}

function save() {
  saveLoading.value = true;
  questionTemplateApi.update(questionTemplate.id, questionTemplate.name, questionTemplate.questions)
      .then(() => {
        router.back();
      })
      .finally(() => {
        saveLoading.value = false;
      });
}

</script>

<template>
  <div class="h-100 d-flex flex-column">
    <a-card class="flex-shrink-0">
      <a-descriptions title="编辑问题">
        <a-descriptions-item label="id">{{ questionTemplate.id }}</a-descriptions-item>
        <a-descriptions-item :label="loading? '': '问卷名称'">
          <a-skeleton-input v-if="loading" style="width: 200px" :active="loading" size="small"/>
          {{ questionTemplate.name }}
        </a-descriptions-item>
        <a-descriptions-item label="操作">
          <a-space>
            <a-button size="small" type="primary" @click="addQuestion">添加题目</a-button>
            <a-button size="small" @click="$router.back()">取消</a-button>
            <a-button size="small" type="primary" @click="save" :loading="saveLoading">保存</a-button>
          </a-space>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
    <div class="flex-grow-1 overflow-auto">
      <a-card v-show="questionTemplate.questions.length > 0">
        <a-row :gutter="[0, 24]">
          <a-col v-for="(q, i) in questionTemplate.questions" :key="i" :span="24">
            <p>题目: {{ i }}
              <a-button type="primary" danger @click="removeQuestion(i)">删除</a-button>
            </p>
            <a-form :label-col="{span: 4}" :model="q">
              <a-form-item label="题目" name="question">
                <a-input type="text" v-model:value="q.question"></a-input>
              </a-form-item>
              <a-form-item label="分数" name="score">
                <a-input type="number" v-model:value.number="q.score"></a-input>
              </a-form-item>
              <a-form-item label="类型" name="type">
                <a-radio-group v-model:value="q.type">
                  <a-radio value="single">单选题</a-radio>
                  <a-radio value="multiple">多选题</a-radio>
                </a-radio-group>
              </a-form-item>
              <a-form-item label="选项" name="options">
                <a-space direction="vertical">
                  <a-button type="primary" @click="addOption(i)">添加选项</a-button>
                  <a-form layout="inline" v-for="(o,i2) in q.options" :key="i2">
                    <a-form-item :label="'选项'+i2">
                      <a-input type="text" v-model:value="q.options[i2]"></a-input>
                    </a-form-item>
                    <a-form-item>
                      <a-button type="primary" danger @click="removeOption(i, i2)">删除</a-button>
                    </a-form-item>
                  </a-form>
                </a-space>
              </a-form-item>
              <a-form-item label="答案" name="rights">
                <template v-if="q.type === 'single'">
                  <a-radio-group v-model:value="q.right">
                    <a-radio v-for="(o, i2) in q.options" :key="i2" :value="i2">{{ o }}</a-radio>
                  </a-radio-group>
                </template>
                <template v-else>
                  <a-checkbox-group v-model:value="q.rights">
                    <a-checkbox v-for="(o, i2) in q.options" :key="i2" :value="i2">{{ o }}</a-checkbox>
                  </a-checkbox-group>
                </template>
              </a-form-item>
            </a-form>
          </a-col>
        </a-row>
      </a-card>
    </div>
  </div>
</template>

<style scoped>

</style>
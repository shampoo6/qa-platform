<script setup>
import {useRouter, useRoute} from 'vue-router';
import qtAnswerApi from '@/api/qtAnswer.js';
import {onMounted, reactive, ref} from 'vue';
import {message} from 'ant-design-vue';

const router = useRouter();
const route = useRoute();

const id = route.params.id;
const qtAnswer = ref(reactive({done: true}));
const total = ref(0);
const answers = ref(reactive([]));
const loading = ref(false);

onMounted(() => {
  query();
});

function query() {
  qtAnswerApi.getById(id).then(r => {
    qtAnswer.value = r;
    total.value = r.questions.map(question => question.score).reduce((p, n) => p + n);
    // 初始化答案
    if (!qtAnswer.value.done) {
      qtAnswer.value.questions.forEach((question, i) => {
        answers.value[i] = question.type === 'single' ? '' : [];
      });
    } else {
      answers.value = qtAnswer.value.answers;
    }
  });
}

function submit() {
  loading.value = true;
  qtAnswerApi.submit(id, answers.value).then(() => {
    message.success('提交完成');
    query();
  }).finally(() => {
    loading.value = false;
  });
}
</script>

<template>
  <div>
    <a-card>
      <a-descriptions :title="'问卷名: ' + qtAnswer.name">
        <a-descriptions-item label="答题人">{{ qtAnswer.nickname }}</a-descriptions-item>
        <a-descriptions-item label="总分">{{ total }}</a-descriptions-item>
        <a-descriptions-item label="是否已交卷">{{ qtAnswer.done ? '已交卷' : '未交卷' }}</a-descriptions-item>
        <a-descriptions-item label="得分">{{ qtAnswer.score }}</a-descriptions-item>
        <a-descriptions-item label="操作">
          <a-space>
            <a-button type="primary" size="small" :disabled="qtAnswer.done" @click="submit" :loading="loading">交卷
            </a-button>
            <a-button size="small" @click="$router.push({name: 'myJoin'})">返回</a-button>
          </a-space>
        </a-descriptions-item>
      </a-descriptions>
    </a-card>
    <a-card id="qaPageQuestions" v-show="qtAnswer && Array.isArray(qtAnswer.questions) && qtAnswer.questions.length > 0">
      <a-form layout="vertical" :model="answers">
        <a-form-item v-for="(question, i) in qtAnswer.questions" :key="i">
          <template #label>
            <span :style="{color: question.wrong? '#f00': '#000'}">{{
                `${i}.${question.type === 'single' ? '单选题' : '多选题'} ${question.question} (${question.score}分)`
              }}</span>
          </template>
          <template v-if="question.type === 'single'">
            <a-radio-group v-model:value="answers[i]">
              <a-radio v-for="(option, i) in question.options" :key="i" :value="i">{{ option }}</a-radio>
            </a-radio-group>
          </template>
          <template v-else>
            <a-checkbox-group v-model:value="answers[i]">
              <a-checkbox v-for="(option, i) in question.options" :key="i" :value="i">{{ option }}</a-checkbox>
            </a-checkbox-group>
          </template>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<style>
#qaPageQuestions .ant-form-item-label > label {
  font-weight: bolder !important;
}
</style>
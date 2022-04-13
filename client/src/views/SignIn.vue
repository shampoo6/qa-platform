<script setup>
import {reactive, ref} from 'vue';
import {useRouter} from 'vue-router';
import accountsApi from '@/api/accounts.js';
import {message} from 'ant-design-vue';

const router = useRouter();

const formData = reactive({
  account: '',
  pwd: ''
});

const form = ref(null);

const regex = /^[\w]*$/;

function inputChecker(_rules, value) {
  if (regex.test(value)) return Promise.resolve();
  return Promise.reject();
}

const rules = {
  account: [
    {
      required: true,
      message: '请输入账号',
      trigger: 'blur'
    },
    {
      min: 6,
      max: 20,
      message: '请输入6~20位的账号',
      trigger: 'blur'
    },
    {
      validator: inputChecker,
      message: '账号只能由下划线字母和数字构成',
      trigger: 'blur'
    }
  ],
  pwd: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    },
    {
      min: 10,
      max: 20,
      message: '请输入10~20位的密码',
      trigger: 'blur'
    },
    {
      validator: inputChecker,
      message: '密码只能由下划线字母和数字构成',
      trigger: 'blur'
    }
  ]
};


function signIn() {
  form.value.validate().then(async () => {
    console.log('pass');
    await accountsApi.signIn(formData.account, formData.pwd);
    // 跳转首页
    router.push('/home').then(() => {
      message.success('登录成功');
    });
  });
}
</script>

<template>
  <div class="d-flex flex-column vh-100">
    <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        title="登录"
        sub-title="欢迎登录问答平台"
        class="flex-shrink-0"
    />
    <a-layout class="flex-grow-1">
      <a-layout-content class="h-100 pt-5 d-flex justify-content-center">
        <a-card title="登录" style="width: 400px" class="align-self-start">
          <template #extra><a href="#">忘记密码?</a></template>
          <a-form ref="form" layout="vertical" :model="formData" :rules="rules">
            <a-form-item label="账号" name="account">
              <a-input :maxlength="20" type="text" placeholder="请输入账号" v-model:value="formData.account"></a-input>
            </a-form-item>
            <a-form-item label="密码" name="pwd">
              <a-input :maxlength="20" type="password" placeholder="请输入密码" v-model:value="formData.pwd"></a-input>
            </a-form-item>
            <a-row :gutter="[0, 24]">
              <a-col :span="24">
                <a-button class="w-100" type="primary" @click="signIn">登录</a-button>
              </a-col>
              <a-col :span="24">
                <a-button class="w-100" @click="router.push({name: 'signUp'})">注册</a-button>
              </a-col>
            </a-row>
          </a-form>
        </a-card>
      </a-layout-content>
    </a-layout>
  </div>
</template>

<style scoped>

</style>
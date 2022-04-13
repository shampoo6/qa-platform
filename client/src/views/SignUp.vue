<script setup>
import {reactive, ref} from 'vue';
import {useRouter} from 'vue-router';
import accountsApi from '@/api/accounts.js';
import {message} from 'ant-design-vue';

const router = useRouter();

const formData = reactive({
  account: '',
  pwd: '',
  twice: '', // 二次验证
  nickname: ''
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
  ],
  twice: [
    {
      required: true,
      message: '请再次输入密码',
      trigger: 'blur'
    },
    {
      validator: (_, value) => {
        if (formData.pwd !== value) return Promise.reject();
        return Promise.resolve();
      },
      message: '两次输入密码不一致',
      trigger: 'blur'
    }
  ],
  nickname: [
    {
      required: true,
      message: '请输入昵称',
      trigger: 'blur'
    },
    {
      min: 2,
      max: 10,
      message: '请输入2~10位的昵称',
      trigger: 'blur'
    }
  ]
};

async function signUp() {
  form.value.validate().then(async () => {
    console.log('pass');
    const pk = await accountsApi.getPk();
    await accountsApi.signUp(formData.account, formData.pwd, formData.nickname, pk);
    router.push('/signIn').then(() => {
      message.success('注册成功');
    });
  });
}
</script>

<template>
  <div class="d-flex flex-column vh-100">
    <a-page-header
        style="border: 1px solid rgb(235, 237, 240)"
        title="注册"
        sub-title="欢迎在本平台注册"
        class="flex-shrink-0"
        @back="router.back()"
    />
    <a-layout class="flex-grow-1">
      <a-layout-content class="h-100 pt-5 d-flex justify-content-center">
        <a-card title="登录" style="width: 400px" class="align-self-start">
          <template #extra><a href="#" @click="router.push('/signIn')">已有账号?</a></template>
          <a-form ref="form" layout="vertical" :model="formData" :rules="rules">
            <a-form-item label="账号" name="account">
              <a-input :maxlength="20" type="text" placeholder="请输入账号" v-model:value="formData.account"></a-input>
            </a-form-item>
            <a-form-item label="密码" name="pwd">
              <a-input :maxlength="20" type="password" placeholder="请输入密码" v-model:value="formData.pwd"></a-input>
            </a-form-item>
            <a-form-item label="再次输入密码" name="twice">
              <a-input :maxlength="20" type="password" placeholder="请再次输入密码" v-model:value="formData.twice"></a-input>
            </a-form-item>
            <a-form-item label="昵称" name="nickname">
              <a-input :maxlength="10" type="text" placeholder="请输入昵称" v-model:value="formData.nickname"></a-input>
            </a-form-item>
            <a-row :gutter="[0, 24]">
              <a-col :span="24">
                <a-button class="w-100" type="primary" @click="signUp">注册</a-button>
              </a-col>
              <a-col :span="24">
                <a-button class="w-100" @click="router.push({name: 'signIn'})">登录</a-button>
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
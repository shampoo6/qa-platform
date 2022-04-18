<script setup>
// 菜单设计
// 我的问卷 'my'
//    问卷管理 'questionTemplate' （主表，包括问卷题目和答案的管理）
//        题目管理 'question'
//            答案管理 'answer'
//    发布管理 'publish' （业务表，选择一个问卷进行发布，发布的问卷，可以在问卷大厅中被其他人看到并作答）
//        答题人列表 'parties' （查看某一问卷的答题人有哪些）
//            答题情况 'answer' （具体的正确多少题，错误多少，分数情况等）
// 问卷大厅 'hall' （所有人发布的问卷）


import {onMounted, computed, ref} from 'vue';
import {
  LogoutOutlined,
  DownOutlined,
  MailOutlined,
  QqOutlined,
  AppstoreOutlined,
  SettingOutlined
} from '@ant-design/icons-vue';
import {useRouter, useRoute} from 'vue-router';
import {useStore} from 'vuex';
import accountsApi from '@/api/accounts.js';
import {message} from 'ant-design-vue';
import home from '@/router/home.js';

const router = useRouter();
const route = useRoute();
const store = useStore();

// 菜单和面包削
const menus = filterMenu(home);
const breadcrumbs = computed(() => {
  let arr = getBreadcrumbs(route.path);
  if (route.meta.subtitle !== undefined) {
    arr.push({
      path: route.path,
      title: route.meta.subtitle
    });
  }
  return arr;
});

const openKeys = ref([]);
const selectedKeys = ref([]);

const nickname = computed(() => store.state.account.userInfo.nickname);

let selectedRegex = /\/([^\/]+)$/;
let openRegex = /^\/[^\/]+\/([^\/]+)/;
onMounted(() => {
  // 查找当前选择的菜单
  let r = route.path.match(selectedRegex);
  if (r && r.length > 0)
    selectedKeys.value[0] = r[1];
  // 查找当前打开的菜单
  r = route.path.match(openRegex);
  if (r && r.length > 0)
    openKeys.value[0] = r[1];
});

function getBreadcrumbs(path) {
  let result = [];

  let regex = /^(\/[^\/]+\/)(.+)/;
  let r = path.match(regex);
  if (!Array.isArray(r) || r.length < 3) return [];
  // 获取子路由字符串
  let str = r[2];
  const splits = str.split('\/');
  let temp = ''; // 用于存储零时路径
  // 判断 path 在 home 路由中是否存在
  getPathOptions(home, 0);

  function getPathOptions(routes, currentIndex) {
    temp += splits[currentIndex] + '/';
    let route = routes.find(route => route.path === splits[currentIndex]);
    if (route) {
      result.push({
        path: r[1] + temp,
        title: route.meta.title
      });
      if (Array.isArray(route.children) && route.children.length > 0) {
        getPathOptions(route.children, ++currentIndex);
      }
    }
  }

  return result;
}

function filterMenu(routes) {
  return routes.filter(route => {
    if (Array.isArray(route.children) && route.children.length > 0)
      route.children = filterMenu(route.children);
    return typeof route.meta.title !== 'undefined';
  });
}

// 菜单点击事件
function handleClick({/*item, key, */keyPath}) {
  let path = '/home/' + keyPath.join('/');
  router.push(path);
}

// 右上菜单点击事件
function handleMenuClick(obj) {
  console.log(obj);
  // 退出
  accountsApi.signOut()
      .then(() => router.push('/signIn'))
      .then(() => {
        message.success('登出成功');
      });
}
</script>

<template>
  <a-layout class="vh-100 d-flex">
    <a-layout-header class="text-light flex-shrink-0">
      <div class="d-flex flex-row justify-content-between">
        <div class="fs-2">
          问答平台
        </div>
        <div>
          <a-dropdown :trigger="['click']">
            <template #overlay>
              <a-menu @click="handleMenuClick">
                <a-menu-item key="1">
                  <logout-outlined/>
                  退出
                </a-menu-item>
              </a-menu>
            </template>
            <a-button>
              欢迎, {{ nickname }}
              <DownOutlined/>
            </a-button>
          </a-dropdown>
        </div>
      </div>
    </a-layout-header>
    <a-layout-content class="flex-grow-1">
      <a-layout class="h-100">
        <a-layout-sider>
          <a-menu
              v-model:openKeys="openKeys"
              v-model:selectedKeys="selectedKeys"
              class="w-100"
              mode="inline"
              @click="handleClick"
              theme="light"
          >
            <template v-for="menu in menus" :key="menu.meta.key">
              <a-sub-menu v-if="menu.children&&menu.children.length>0" :key="menu.meta.key">
                <template #icon>
                  <MailOutlined/>
                </template>
                <template #title>{{ menu.meta.title }}</template>

                <template v-if="menu.children&&menu.children.length>0">
                  <a-menu-item v-for="subMenu in menu.children" :key="subMenu.meta.key">{{
                      subMenu.meta.title
                    }}
                  </a-menu-item>
                </template>
              </a-sub-menu>

              <a-menu-item v-else :key="menu.meta.key">
                {{ menu.meta.title }}
                <template #icon>
                  <MailOutlined/>
                </template>
              </a-menu-item>
            </template>
          </a-menu>
        </a-layout-sider>
        <a-layout-content class="h-100">
          <a-layout class="h-100 d-flex flex-column">
            <a-layout-content class="flex-grow-1 d-flex flex-column">
              <a-card class="flex-shrink-0">
                <a-breadcrumb>
                  <a-breadcrumb-item><a href="javascript:" @click="$router.push('/home')">首页</a></a-breadcrumb-item>
                  <a-breadcrumb-item v-for="item in breadcrumbs" :key="item.path">
                    <a href="javascript:" @click="$router.push(item.path)">{{ item.title }}</a>
                  </a-breadcrumb-item>
                </a-breadcrumb>
              </a-card>
              <div class="flex-grow-1 overflow-auto">
                <router-view class="h-100"></router-view>
              </div>
            </a-layout-content>
            <a-layout-footer class="bg-light flex-shrink-0 text-end">&copy; 2022 shampoo6@163.com 技术支持</a-layout-footer>
          </a-layout>
        </a-layout-content>
      </a-layout>
    </a-layout-content>
  </a-layout>
</template>

<style scoped>

</style>
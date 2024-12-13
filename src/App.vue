<template>
  <div class="app">
    <el-container>
      <el-header v-if="$route.path !== '/login'">
        <el-menu
          :router="true"
          mode="horizontal"
          :default-active="$route.path"
          background-color="#ffffff"
          text-color="#303133"
          active-text-color="#409EFF"
        >
          <el-menu-item style="margin-left: 10%;" index="/">首页</el-menu-item>
          <el-menu-item index="/goods">商品</el-menu-item>
          <el-menu-item index="/carts">我的购物车</el-menu-item>
          <el-menu-item index="/orders">我的订单</el-menu-item>
          <el-menu-item class="login-item">
            <el-dropdown id="dropdown" v-if="userId" trigger="click" @command="handleCommand">
              <span class="el-dropdown-link">
                <i class="el-icon-user"></i>
                {{ username }}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button v-else type="text" @click="$router.push('/login')">
              <i class="el-icon-user"></i>登录
            </el-button>
          </el-menu-item>
        </el-menu>
      </el-header>
      <el-main>
        <transition name="fade" mode="out-in">
          <router-view></router-view>
        </transition>
      </el-main>
      <el-footer>© 2024 Web Shop Work. All rights reserved.</el-footer>
    </el-container>
    <!-- 登录弹窗 -->
    <el-dialog
      title="登录提示"
      :visible.sync="showLoginDialog"
      width="30%"
      :before-close="handleClose"
      :show-close="false"
    >
      <span>您需要登录才能访问此页面。</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="$router.push('/')">返回首页</el-button>
        <el-button type="primary" @click=" $router.push('/login') ">去登录</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      userId: null,
      username: null,
      showLoginDialog: false
    };
  },
  mounted() {
    this.userId = localStorage.getItem("userId");
    this.username = localStorage.getItem("username");
    this.checkLoginStatus(this.$route);

  },
  watch: {
    $route(to, from) {
      this.userId = localStorage.getItem("userId");
      this.username = localStorage.getItem("username");
      this.checkLoginStatus(to);
    }
  },

  methods: {
    handleCommand(command) {
      if (command === "logout") {
        this.logout();
      }
    },
    checkLoginStatus(route) {
      const isAuthenticated = localStorage.getItem("userId") !== null;
      const protectedRoutes = ["/carts", "/orders"];
      this.showLoginDialog =
        protectedRoutes.includes(route.path) && !isAuthenticated;
    },
    logout() {
      localStorage.removeItem("userId");
      localStorage.removeItem("username");

      this.$router.push("/login");
    },
   
    handleClose(done) {
      return;
    }
  }
};
</script>

<style>
body {
  margin: 0;
  padding: 0;
  height: 100%;
  background-color: #f5f5f7;
  font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB",
    "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  width: 100%;

}

.el-container {
  width: 100%;
}

.el-header {
  padding: 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.el-menu {
  display: flex;
  justify-content: center;
}

.el-menu-item {
  font-size: 16px;
  transition: all 0.3s ease;
}

.el-menu-item:hover {
  background-color: #f5f7fa !important;
}

.el-menu-item.is-active {
  font-weight: bold;
}

.login-item {
  margin-left: auto;
}

.el-main {
  padding: 0;
  /* max-width: 1200px; */
  margin: 0 auto;
  width: 100%;
  overflow: visible;

}

.el-footer {
  text-align: center;
  color: #909399;
  padding: 20px 0;
  font-size: 14px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .el-menu {
    flex-wrap: wrap;
  }

  .el-menu-item {
    flex-basis: 50%;
    text-align: center;
  }

  .login-item {
    flex-basis: 100%;
    margin-left: 0;
  }
}
</style>
<template>
  <div id="body">
    <div style="display: flex; justify-content: center">
      <div class="wrapper">
        <div class="card-switch">
          <label class="switch" id="switch">
            <input type="checkbox" class="toggle" />
            <span class="slider"></span>
            <span class="card-side"></span>

            <div class="flip-card__inner">
              <!-- Log in form -->
              <div class="flip-card__front">
                <div class="title">Log in</div>
                <form @submit.prevent="handleLogin" class="flip-card__form">
                  <input
                    v-model="loginData.username"
                    class="flip-card__input"
                    name="username"
                    placeholder="Username"
                  />
                  <span v-if="usernameError" class="error-message">{{ usernameError }}</span>
                  <input
                    v-model="loginData.password"
                    class="flip-card__input"
                    name="password"
                    type="password"
                    placeholder="Password"
                  />
                  <span v-if="passwordError" class="error-message">{{ passwordError }}</span>
                  <button class="flip-card__btn" type="submit">登录</button>
                </form>
              </div>

              <!-- Sign up form -->
              <div class="flip-card__back">
                <div class="title">Sign up</div>
                <form @submit.prevent="handleSignUp" class="flip-card__form">
                  <input
                    v-model="signUpData.name"
                    class="flip-card__input"
                    name="name"
                    placeholder="Your name"
                  />
                  <input
                    v-model="signUpData.username"
                    class="flip-card__input"
                    name="username"
                    placeholder="Username"
                  />
                  <input
                    v-model="signUpData.password"
                    class="flip-card__input"
                    name="password"
                    type="password"
                    placeholder="Password"
                  />
                  <button class="flip-card__btn" type="submit">注册</button>
                </form>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script>
import "@/assets/loginPage.css";
import axios from "axios";
const ins = axios.create({
  baseURL: "/api",
  timeout: 5000,
});
export default {
  data() {
    return {
      isLogin: true, // true for login, false for sign up
      usernameError:'',
      passwordError:'',
      loginData: {
        username: "",
        password: "",
      },
      signUpData: {
        name: "",
        username: "",
        password: "",
      },
    };
  },
  methods: {
    handleLogin() {

      if(!this.validateForm()) return;
      try {
        const sdkOptions = {
          needFeedBack: false,
          enableDarkMode: false,
          loading: true,
          ready: function (size) {
            console.log("ready size:", JSON.stringify(size));
          },
        };
        const captcha = new window.TencentCaptcha(
          "199999861",
          this.globalCallback,
          sdkOptions
        );
        captcha.show();
      } catch (error) {
        this.errorCallback();
      }
    },
    handleSignUp() {
      ins
        .post("/user/register", null, {
          params: {
            name: this.loginData.username,
            password: this.loginData.password,
          },
        })
        .then((res) => {
          alert(res.data);
          this.loginData.username = this.signUpData.username;
          this.loginData.password = this.signUpData.password;
          var switchLabel = document.getElementById("switch");
          switchLabel.click(); // 触发 click 事件，切换开关状态
        });
    },
    validateForm() {
      let valid = true;
      this.usernameError = '';
      this.passwordError = '';

      if (!this.loginData.username ) {
        this.usernameError = '用户名不能为空';
        valid = false;
      }

      if (!this.loginData.password ) {
        this.passwordError = '密码不能为空';
        valid = false;
      }

      return valid;
    },
    globalCallback(res) {
      console.log(res);
      if (res.ret != 0) return;
      ins
        .post("/user/login", null, {
          params: {
            name: this.loginData.username,
            password: this.loginData.password,
          },
        })
        .then((res) => {
          // alert(res.data);
          console.log(res);
          this.$router.push("/hw");
        });
    },
    errorCallback() {
      this.globalCallback({
        ret: -1,
        randstr: "@" + Math.random().toString(36).substr(2),
        ticket: "",
        errorCode: 1001,
        errorMessage: "jsload_error",
      });
    },
  },
};
</script>

  <style scoped>
#body {
  background-image: url("@/assets/background.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.error-message {
  color: red;
  font-size: 12px;
  display: block;
  margin-top: 5px;
} 
</style>
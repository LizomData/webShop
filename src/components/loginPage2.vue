<template>
  <div class="login-container">
    <vue-particles
      color="#7e7e7e"
      :particleOpacity="0.7"
      :particlesNumber="60"
      shapeType="circle"
      :particleSize="4"
      linesColor="#7e7e7e"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="2"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
    >
    </vue-particles>

    <div class="login-content" :class="{ rotate: isRotating }">
      <!-- 登录表单 -->
      <div class="login-form">
        <div class="logo">
          <img
            src="https://www.guet.edu.cn/_upload/tpl/01/39/313/template313/images/logo.svg"
          />
          <!-- <span class="title">登 录</span> -->
        </div>

        <div class="login-tabs">
          <div
            v-for="tab in tabs"
            :key="tab.id"
            :class="[
              'tab',
              { regist: tab.id === 'regist' },
              { active: currentTab === tab.id },
            ]"
            @click="handleSwitchTab(tab.id)"
          >
            {{ tab.name }}
          </div>
          <!-- <div  :class="['register-link',{active:currentTab === 'regist'}]" @click="currentTab = 'regist'">注册</div> -->
        </div>

        <form @submit.prevent="handleLogin">
          <div class="input-group">
            <People theme="filled" class="input-icon" />
            <input
              v-model="loginData.username"
              type="text"
              placeholder="请输入账号"
              :class="[
                'input-field',
                {
                  'has-error': loginData.usernameError || loginData.loginError,
                },
              ]"
              @focus="loginData.loginError = ''"
            />
            <div v-if="loginData.usernameError" class="error-message">
              {{ loginData.usernameError }}
            </div>
          </div>

          <div class="input-group">
            <div class="password-input">
              <Lock theme="filled" class="input-icon" />
              <input
                v-model="loginData.password"
                :type="loginData.showPassword ? 'text' : 'password'"
                placeholder="请输入密码"
                :class="[
                  'input-field',
                  {
                    'has-error':
                      loginData.passwordError || loginData.loginError,
                  },
                ]"
                @focus="loginData.loginError = ''"
              />

              <button
                type="button"
                class="password-toggle"
                @click="loginData.showPassword = !loginData.showPassword"
              >
                <mdi-eye v-if="loginData.showPassword" class="icon" />
                <mdi-eye-off v-else class="icon" />
              </button>
            </div>
            <div v-if="loginData.passwordError" class="error-message">
              {{ loginData.passwordError }}
            </div>
            <div v-if="loginData.loginError" class="error-message">
              {{ loginData.loginError }}
            </div>
          </div>
          <div class="remember-password">
            <label class="checkbox-container">
              <input
                type="checkbox"
                v-model="isRemembered"
                @click="rememberedUserHandle()"
              />
              <span class="checkmark"></span>
              记住密码
            </label>
          </div>
          <button type="submit" class="login-button">登 录</button>

          <div class="form-links">
            <a href="/hw" class="forgot-password">忘记密码</a>
          </div>

          <div class="help-text">
            如登录、注册遇到问题，请
            <a href="#" class="contact-link">联系客服</a>
          </div>
        </form>
      </div>

      <!-- 注册表单 -->
      <div class="regist-form">
        <div class="logo">
          <img
            src="https://www.guet.edu.cn/_upload/tpl/01/39/313/template313/images/logo.svg"
          />
          <!-- <span class="title">注 册</span> -->
        </div>

        <div class="login-tabs">
          <div
            v-for="tab in tabs"
            :key="tab.id"
            :class="[
              'tab',
              { regist: tab.id === 'regist' },
              { active: currentTab === tab.id },
            ]"
            @click="handleSwitchTab(tab.id)"
          >
            {{ tab.name }}
          </div>
          <!-- <div  :class="['register-link',{active:currentTab === 'regist'}]" @click="currentTab = 'regist'">注册</div> -->
        </div>

        <form @submit.prevent="handleRegigt">
          <div class="input-group">
            <People theme="filled" class="input-icon" />
            <input
              v-model="registData.username"
              type="text"
              placeholder="请输入账号"
              :class="[
                'input-field',
                {
                  'has-error':
                    registData.usernameError || registData.regitsError,
                },
                {
                  'has-success': registData.registSuccess,
                },
              ]"
              @focus="
                registData.regitsError = '';
                registData.registSuccess = '';
              "
            />
            <div v-if="registData.usernameError" class="error-message">
              {{ registData.usernameError }}
            </div>
          </div>

          <div class="input-group">
            <div class="password-input">
              <Lock theme="filled" class="input-icon" />
              <input
                v-model="registData.password"
                :type="registData.showPassword ? 'text' : 'password'"
                placeholder="请输入密码"
                :class="[
                  'input-field',
                  {
                    'has-error':
                      registData.passwordError || registData.regitsError,
                  },
                  {
                    'has-success': registData.registSuccess,
                  },
                ]"
                @focus="
                  registData.regitsError = '';
                  registData.registSuccess = '';
                "
              />

              <button
                type="button"
                class="password-toggle"
                @click="registData.showPassword = !registData.showPassword"
              >
                <mdi-eye v-if="registData.showPassword" class="icon" />
                <mdi-eye-off v-else class="icon" />
              </button>
            </div>
            <div v-if="registData.passwordError" class="error-message">
              {{ registData.passwordError }}
            </div>
            <div v-if="registData.regitsError" class="error-message">
              {{ registData.regitsError }}
            </div>
            <div v-if="registData.registSuccess" class="success-message">
              {{ registData.registSuccess }}
            </div>
          </div>

          <button type="submit" class="login-button">注册</button>

          <div class="help-text">
            如登录、注册遇到问题，请
            <a href="#" class="contact-link">联系客服</a>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import MdiEye from "vue-material-design-icons/Eye.vue";
import MdiEyeOff from "vue-material-design-icons/EyeOff.vue";
import axios from "axios";
import { People, Lock } from "@icon-park/vue";

const ins = axios.create({
  baseURL: "/api",
  timeout: 2000,
});

export default {
  name: "loginPage",
  components: {
    MdiEye,
    MdiEyeOff,
    People,
    Lock,
  },
  mounted() {
    var saveUser = localStorage.getItem("rememberedUsername");
    var savePassword = localStorage.getItem("rememberedPassword");
    if (saveUser && savePassword) {
      this.loginData.username = saveUser;
      this.loginData.password = savePassword;
      this.isRemembered = true;
    } else {
      this.isRemembered = false;
    }
  },
  data() {
    return {
      isRotating: false,
      isRemembered: true,
      currentTab: "pwdLogin",
      loginData: {
        username: "",
        password: "",
        showPassword: false,
        usernameError: "",
        passwordError: "",
        loginError: "",
      },
      registData: {
        username: "",
        password: "",
        showPassword: false,
        usernameError: "",
        passwordError: "",
        regitsError: "",
        registSuccess: "",
      },

      tabs: [
        { id: "pwdLogin", name: "账号登录" },

        { id: "regist", name: "注册" },
      ],
    };
  },
  methods: {
    rememberedUserHandle() {
      if (this.isRemembered) {
        localStorage.removeItem("rememberedUsername");
        localStorage.removeItem("rememberedPassword");
      }
    },
    handleSwitchTab(tabID) {
      if (this.currentTab == "regist" && tabID != "regist") this.rotate();
      if (this.currentTab != "regist" && tabID == "regist") this.rotate();
      this.currentTab = tabID;
    },
    handleLogin() {
      if (!this.vailForm(this.loginData)) return;
      try {
        const sdkOptions = {
          needFeedBack: true,
          enableDarkMode: false,
          loading: true,
          ready: function (size) {
            console.log("ready size:", JSON.stringify(size));
          },
        };
        const captcha = new window.TencentCaptcha(
          "199999861",
          (res) => {
            console.log(res);
            console.log(ins);
            if (res.ret != 0) return;
            ins
              .post("/user/login", null, {
                params: {
                  name: this.loginData.username,
                  password: this.loginData.password,
                },
              })
              .then((res) => {
                if (res.data == "invalid") {
                  this.loginData.loginError = "账号或密码错误!";
                  return;
                }
                if (this.isRemembered) {
                  localStorage.setItem(
                    "rememberedUsername",
                    this.loginData.username
                  );
                  localStorage.setItem(
                    "rememberedPassword",
                    this.loginData.password
                  );
                }
                this.$message.success(`登录成功:${res.data}`);
                this.$router.push("/hw");
              });
          },
          sdkOptions
        );
        captcha.show();
      } catch (error) {
        this.errorCallback();
      }
    },
    globalCallback(res) {
      console.log(res);
      console.log(ins);
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
          this.$message.success("登录成功");
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
    rotate() {
      this.isRotating = !this.isRotating;
    },
    vailForm(data) {
      data.usernameError = "";
      data.passwordError = "";

      var vail = true;
      if (!data.username) {
        data.usernameError = "请输入账号";
        vail = false;
      }
      if (!data.password) {
        data.passwordError = "请输入密码";
        vail = false;
      }
      return vail;
    },

    handleRegigt() {
      this.registData.registSuccess = "";
      if (!this.vailForm(this.registData)) return;
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
          (res) => {
            console.log(res);
            if (res.ret != 0) return;
            ins
              .post("/user/register", null, {
                params: {
                  name: this.registData.username,
                  password: this.registData.password,
                },
              })
              .then((res) => {
                // alert(res.data);
                console.log(res);
                if (res.data == "isexist") {
                  this.registData.regitsError = "注册失败：用户已存在!";
                  return;
                }
                if (res.data != "OK") {
                  this.registData.regitsError = "注册失败：未知错误!";
                  return;
                }

                this.registData.registSuccess = "注册成功！";
                this.loginData.username = this.registData.username;
                this.loginData.password = this.registData.password;
              });
          },
          sdkOptions
        );
        captcha.show();
      } catch (error) {
        this.errorCallback();
      }
    },
  },
};
</script>

<style scoped>
.input-icon {
  /* color: #999;  */
  position: absolute;
  /* margin-left: 12px;  */
  transform: translateY(50%);
  margin-left: 10px;
  color: #999;
  size: "16";
}
input[type="password"]::-ms-reveal,
input[type="password"]::-ms-clear {
  display: none;
}
#particles-js {
  width: 100%;
  height: calc(100% - 100px);
  position: absolute;
  color: #7e7e7e;
}
.rotate {
  transform: rotateY(180deg);
}
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  /* background-color: #f5f7fa; */
  background-color: #ffffff;
}
.title {
  margin-top: 25px;
  margin-bottom: -20px;
  font-size: 25px;
  font-weight: 900;
  text-align: center;
  color: var(--main-color);
}

.login-content {
  transform-style: preserve-3d; /* 保持3D效果 */
  transition: transform 0.7s ease-in-out; /* 动画过渡效果 */
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  box-shadow: 0 0 10px 5px rgba(220, 220, 220, 0.5);
}

.login-form,
.regist-form {
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  position: absolute;
  background: white;
  padding: 30px;
  width: 400px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}
.regist-form {
  transform: rotateY(180deg);
  width: 400px;
}

.logo {
  display: flex;
  text-align: center;
  margin-bottom: 30px;
  flex-direction: column;
}

.logo img {
  height: 40px;
}

.login-tabs {
  display: flex;
  border-bottom: 1px solid #e4e7ed;
  margin-bottom: 24px;
  position: relative;
}

.tab {
  padding: 12px 24px;
  cursor: pointer;
  color: #606266;
  position: relative;
  transition: color 0.3s;
}
.tab.regist {
  margin-left: auto;
  padding: 12px 24px;
  cursor: pointer;
  color: #606266;
  position: relative;
  transition: color 0.3s;
}

.tab.active {
  color: #4e6ef2;
}

.tab.active::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #4e6ef2;
}

.register-link {
  margin-left: auto;
  padding: 12px 0;
  color: #606266;
  cursor: pointer;
}
.register-link.active {
  color: #4e6ef2;
}

.register-link.active::after {
  content: "";
  position: absolute;
  bottom: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #4e6ef2;
}

.input-group {
  margin-bottom: 20px;
}

.input-field {
  width: calc(100% - 35px - 15px);
  padding: 12px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  transition: all 0.3s;
  font-size: 14px;
  padding-left: 35px;
  background: transparent;
  background-color: #f5f5f5;
  transition: all 0.3s ease;
}

.input-field:focus {
  border-color: #4e6ef2;
  outline: none;
  background-color: #fff;
}

.input-field.has-error {
  border-color: #f56c6c;
}
.input-field.has-success {
  border-color: #42be31;
}

.password-input {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  cursor: pointer;
  color: #909399;
  padding: 0;
}

.error-message {
  color: #f56c6c;
  font-size: 14px;
  margin-top: 4px;
}
.success-message {
  color: #1f9b44;
  font-size: 14px;
  margin-top: 4px;
}

.login-button {
  margin-top: 20px;
  width: 100%;
  padding: 12px;
  background-color: #4e6ef2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #4058d9;
}

.form-links {
  margin-top: 12px;
  text-align: right;
}

.forgot-password {
  color: #606266;
  text-decoration: none;
  font-size: 14px;
}

.other-login {
  margin-top: 24px;
  text-align: center;
}

.divider {
  position: relative;
  text-align: center;
  margin: 20px 0;
}

.divider::before,
.divider::after {
  content: "";
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background-color: #e4e7ed;
}

.divider::before {
  left: 0;
}

.divider::after {
  right: 0;
}

.divider span {
  background: white;
  padding: 0 12px;
  color: #909399;
  font-size: 14px;
}

.login-icons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.icon-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 8px;
  color: #606266;
}

.icon {
  width: 20px;
  height: 20px;
}

.help-text {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: #909399;
}

.contact-link {
  color: #4e6ef2;
  text-decoration: none;
}

.qr-code {
  text-align: center;
}

.qr-wrapper {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
}

.qr-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: #606266;
  font-size: 14px;
  margin-bottom: 8px;
}

.wechat-icon {
  width: 20px;
  height: 20px;
}

.platform-name {
  color: #606266;
  font-size: 14px;
}

.quick-login {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 12px;
}

.quick-login-btn {
  padding: 6px 16px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  background: white;
  color: #606266;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s;
}

.quick-login-btn:hover {
  background-color: #f5f7fa;
}

.remember-password {
  display: flex;
  align-items: center;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #333;
}

.checkbox-container input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
}

.checkmark {
  height: 18px;
  width: 18px;
  background-color: #eee;
  border-radius: 4px;
  margin-right: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox-container:hover input ~ .checkmark {
  background-color: #ccc;
}

.checkbox-container input:checked ~ .checkmark {
  background-color: #4e6ef2;
}

.checkmark:after {
  content: "";
  margin-bottom: 2px;
  display: none;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-container input:checked ~ .checkmark:after {
  display: block;
}
</style>
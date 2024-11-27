<template>
    <div>
      <div id="captcha"></div>
      <button
        @click="verifyCaptcha"
        style="position: fixed; bottom: 20px; right: 20px; padding: 10px 20px; font-size: 16px; background-color: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer; z-index: 9999"
      >
        模拟点击指定元素
      </button>
    </div>
    
  </template>
  
  <script>
  export default {
    name:'captchaPage',
    data() {
      return {
        captchaIns: null,
      };
    },
    mounted() {
       // 脚本加载后直接调用全局函数
       if (window.initNECaptcha) {
      window.initNECaptcha({
        element: "#captcha", // 验证码容器
        captchaId: "4da3050565514a35a50541b0e1f54538",
        mode: "popup",
        width: "320px",
        closeEnable: true,
        apiVersion: 2,
        popupStyles: {
          position: "fixed",
          top: "20%",
        },
        onClose: () => {},
        onVerify: (err, data) => {
          if (!err) {
            // 验证成功后关闭弹窗
            this.captchaIns.close();
            console.log(data.validate);
          }
        },
        onReady: (ins) => {
          console.log(ins)
        }
      },(instance)=>{ this.captchaIns = instance
        instance.verify()},(err)=>{console.log(err)});
    } else {
      console.error("initNECaptcha function is not available");
    }
  
    },
    methods: {
      // 验证验证码
      verifyCaptcha() {
        let imgUrl = "";
        let extra = "";
  
        const imgElement = document.querySelector(".yidun_bg-img");
        if (imgElement) {
          imgUrl = imgElement.src;
          console.log("验证码图片的 URL: ", imgUrl);
        } else {
          console.log("未找到对应的图片元素");
        }
  
        const extElement = document.querySelector(".yidun-fallback__tip");
        if (extElement) {
          extra = extElement.innerHTML;
          console.log("验证码描述的 ext: ", extra);
        } else {
          console.log("未找到对应的描述元素");
        }
  
        
      },
  
      // 模拟点击
      clickCaptcha(pos) {
        const targetElement = document.querySelector(".yidun_bgimg");
  
        if (targetElement) {
          const rect = targetElement.getBoundingClientRect();
          const x = rect.left + ~~pos["x"];
          const y = rect.top + ~~pos["y"];
  
          // 创建鼠标点击事件
          const event = new MouseEvent("click", {
            clientX: x,
            clientY: y,
            bubbles: true,
            cancelable: true,
          });
  
          // 触发事件
          targetElement.dispatchEvent(event);
          console.log(`已模拟点击元素: .yidun_bgimg, 坐标: (${x}, ${y})`);
        } else {
          console.log("未找到元素 .yidun_bgimg");
        }
      },
    },
  };
  </script>
  
  <style scoped>
  /* 你可以根据需要添加自定义样式 */
  </style>
  
<template>
  <div id="app">
    <button @click="rotate" :class="{'rotate': isRotating}" class="rotate-button">
      点击我旋转
    </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isRotating: false, // 用来控制是否进行旋转
    };
  },
  methods: {
    rotate() {
      this.isRotating = true;
      // 旋转动画完成后，重置状态，准备下一次旋转
      setTimeout(() => {
        this.isRotating = false;
      }, 1000); // 这里 1000 毫秒是动画的持续时间
    },
  },
};
</script>

<style scoped>
.rotate-button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: transform 1s ease-in-out; /* 动画过渡效果 */
}

/* 当按钮被点击时，添加 rotate 类来触发旋转 */
.rotate {
  transform: rotate(360deg); /* 旋转 360 度 */
}
</style>

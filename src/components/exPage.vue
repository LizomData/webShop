
// 准备一个容器
<template>
  <div>
    <p>{{ msg }}</p>
    <div>
      <button @click="change">sdf</button>
    </div>
    <div id="chart" style="width: 100%; height: 400px"></div>
  </div>
</template>

// 在 Vue 组件中使用 Echarts
<script>

import * as echarts from "echarts";

export default {
  name: "exPage",
  data() {
    return {
      chart: null,
      msg:'6666'
    };
  },
  mounted() {
      this.chart = echarts.init(document.getElementById("chart"));
    const option = {
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        axisTick: {
          alignWithLabel: true,
        },
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130],
          type: "bar",
        },
      ],
    };
    this.chart.setOption(option);
  },
  methods: {
    change() {
this.msg='77777'
    },
  },
};
</script>

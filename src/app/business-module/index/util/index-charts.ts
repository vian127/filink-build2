// tslint:disable-next-line:class-name
export class indexChart {
  /**
   * 环形图配置
   * param data
   * param name
   */
  public static setRingChartOption(data, title) {
    const option =  {
      tooltip: {
        trigger: 'item',
        confine: true,
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: '222'
      },
      grid: {
        containLabel: false
      },
      series: [
        {
          minAngle: 20,
          name: title,
          type: 'pie',
          radius: ['40%', '60%'],
          center: ['50%', '55%'],      // 位置距离
          avoidLabelOverlap: true,
          label: {
            normal: {
              formatter: '{b} \n {d}%',
            },
          },
          labelLine: {
            normal: {
              show: true
            }
          },
          data: data
        }
      ]
    };
    return option;
  }


  /**
   * 饼状图配置
   * param data
   * param name
   */
  public static setBarChartOption(data, title) {
    const option =  {
      tooltip: {
        trigger: 'item',
        confine: true, // 超出当前范围
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        x: 'left',
        data: '222'
      },
      grid: {
        containLabel: false
      },
      series: [
        {
          name: title,
          type: 'pie',
          radius: ['0%', '60%'],
          center: ['50%', '55%'],      // 位置距离
          avoidLabelOverlap: true,
          minAngle: 5,
          hoverAnimation: false,　　  // 是否开启 hover 在扇区上的放大动画效果。
          label: {
            normal: {
              formatter: '{b} \n {d}%',
            },
          },
          labelLine: {
            normal: {
              show: true
            }
          },
          data: data
        }
      ]
    };
    return option;
  }

  /**
   * 柱状图配置
   * param data
   * param name
   */
  public static setHistogramChartOption(data, name) {
    const option = {
      color: ['#009edf', '#fb7356', '#959595', '#35aace', '#36d1c9', '#f8c032'],
      xAxis: {
        type: 'category',
        data: name,
        axisLabel: {
          color: '#333',
          fontSize: 12,
          interval: 0,
          rotate: 45,
          formatter: function(params) {
            if (params.length > 4) {
              return params.slice(0, 4) + '...';
            }
            return params;
          }
        },
        axisLine: {
          lineStyle: {
            color: '#009edf'
          }
        }
      },
      grid: {
        left: '13px',
        right: '4%',
        bottom: '5px',
        top: '10px',
        containLabel: true
      },
      tooltip : {
        trigger: 'axis',
        confine: true,
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        axisLabel: {
          color: '#333',
        },
        axisLine: {
          lineStyle: {
            color: '#009edf'
          }
        },
        splitLine: {
          lineStyle: {
            // 使用深浅的间隔色
            color: ['#aaa'],
            type: 'dotted',
            width: 0.5
          }
        }
      },
      series: [{
        data: data,
        type: 'bar',
        avoidLabelOverlap: true,
        barWidth: 20
      }]
    };
    return option;
  }

  /**
   * 折线图图配置
   * param data
   * param name
   */
  public static setLineChartOption(data, name) {
    const option = {
      color: ['#009edf', '#fb7356', '#959595', '#35aace', '#36d1c9', '#f8c032'],
      xAxis: {
        type: 'category',
        data: name,
        axisLabel: {
          color: '#333',
          interval: 0,
          rotate: 45,
          fontSize: 12,
          formatter: function(params) {
           if (params.length > 6) {
             return params.slice(5);
           }
          }
        },
        axisLine: {
          lineStyle: {
            color: '#009edf'
          }
        }
      },
      grid: {
        left: '13px',
        right: '4%',
        bottom: '5px',
        top: '10px',
        containLabel: true
      },
      tooltip : {
        trigger: 'axis',
        confine: true
      },
      legend : {
        show: false
      },
      yAxis: {
        type: 'value',
        minInterval: 1,
        axisLabel: {
          color: '#333',
        },
        axisLine: {
          lineStyle: {
            color: '#009edf'
          }
        },
        splitLine: {
          lineStyle: {
            // 使用深浅的间隔色
            color: ['#aaa'],
            type: 'dotted',
            width: 0.5
          }
        }
      },
      series: data
    };
    return option;
  }
}

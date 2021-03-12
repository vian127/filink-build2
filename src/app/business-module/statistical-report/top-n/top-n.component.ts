import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {TreeSelectorConfigModel} from '../../../shared-module/model/tree-selector-config.model';
import {PageModel} from '../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../shared-module/model/table-config.model';
import {PageCondition, QueryConditionModel} from '../../../shared-module/model/query-condition.model';
import {NzI18nService} from 'ng-zorro-antd';
import {ActivatedRoute, Router} from '@angular/router';
import {ChartUtil} from '../../../shared-module/util/chart-util';
import {SessionUtil} from '../../../shared-module/util/session-util';
import {CommonUtil} from '../../../shared-module/util/common-util';
import {FiLinkModalService} from '../../../shared-module/service/filink-modal/filink-modal.service';
import {differenceInCalendarDays} from 'date-fns';
import {StatisticalLanguageInterface} from '../../../../assets/i18n/statistical/statistical-language.interface';
import {TimeFormatEnum} from '../../../shared-module/enum/time-format.enum';
import {AlarmForCommonService} from '../../../core-module/api-service';
import {TopNService} from '../share/service/top-n.service';
import {FacilityForCommonUtil} from '../../../core-module/business-util/facility/facility-for-common.util';
import {FacilityForCommonService} from '../../../core-module/api-service/facility';
import {ResultModel} from '../../../shared-module/model/result.model';
import {StatisticalUtil} from '../share/util/statistical.util';
import {DeployStatusEnum, sensorValueEnum} from '../../../core-module/enum/facility/facility.enum';
import {RouterConst} from '../share/enum/top-n-router.enum';
import {TopDeviceModel} from '../share/model/top/top-device.model';
import {TopNAlarmModel} from '../share/model/top/top-n-alarm.model';
import {AlarmTopResultModel} from '../share/model/top/alarm-top-result.model';
import {ResultCodeEnum} from '../../../shared-module/enum/result-code.enum';
import {LanguageEnum} from '../../../shared-module/enum/language.enum';
import {AlarmLanguageInterface} from '../../../../assets/i18n/alarm/alarm-language.interface';
import {AlarmNameListModel} from '../../../core-module/model/alarm/alarm-name-list.model';

// import {alarmNameStatisticalEnum} from '../share/enum/alarm-name.enum';

/**
 * top统计
 */
@Component({
  selector: 'app-top-n',
  templateUrl: './top-n.component.html',
  styleUrls: ['./top-n.component.scss']
})
export class TopNComponent implements OnInit {
  // 选择的告警名称数据集合
  public selectAlarmData = {
    // 选择的告警代码数组
    selectAlarmCodes: [],
    // 选择的告警id数组
    ids: [],
    // 选择的告警名称数组
    alarmNames: []
  };
  // 告警名称选择框
  public alarmNameSelectVisible = false;
  // 表格默认值，提供前端筛选用
  public defaultTableValue = [];
  // eChart的title
  public chartTitle = {};
  // 选择的区域名称
  public areaName;
  // 树配置
  public treeSelectorConfig: TreeSelectorConfigModel;
  // 区域树数据
  public treeNodes;
  // 区域选择器的显示隐藏
  public isVisible = false;
  // 选择的区域信息集合
  private selectAreaList = [];
  // 选择的区域Id信息集合
  private selectAreaIDList = [];
  // 单选框的值
  public radioValue;
  // 单选框传感值
  public radioSensor;
  // 单选下拉框数据
  public radioSelectInfo;
  // 传感值单选框数据
  public radioSensorSelectInfo;
  // 页面类型
  public pageTypeTitle;
  // 下拉框数据
  public selectInfo = [];
  // 告警下拉框数据
  public alarmList = [];
  // 时间选择
  public rangDateValue = [];
  // 统计数量
  public statisticalNumber = '10';
  // 柱状图实例
  private barChartInstance;
  // eChart显示隐藏
  public hide = false;
  // 最大值
  private topMaxData;
  // 最小值
  private topMinData;
  // 控制最大最小值开关
  public switchValue = true;
  // 表格数据
  public _dataset = [];
  // 表格分页配置
  public pageBean: PageModel = new PageModel(5, 1, 1);
  // 表格配置
  public tableConfig: TableConfigModel;
  // 为传感值统计时的数据
  private maxAndMinData;
  // 是否显示loading状态
  public showLoading = true;
  // 是否有统计数据
  public hasData = false;
  // 选择的设施
  public deviceList = [];
  // 统计国际化
  public statisticalLanguage: StatisticalLanguageInterface;
  public language: AlarmLanguageInterface;
  // 枚举值
  public ConstValue = RouterConst;
  // 统计率判断
  portChange = false;
  // 进度条
  public ProgressShow = false;
  // 下拉框高度最小显示
  public firstSelect = true;
  // 告警名称
  public alarmName: string = '';
  // 按告警名称选中的告警数据
  public selectAlarms: AlarmNameListModel[] = [];
  // 单选框
  @ViewChild('radioTemp') radioTemp: TemplateRef<any>;
  @ViewChild('deviceTemp') deviceTemp: TemplateRef<any>;

  constructor(private $NZi18: NzI18nService,
              private $activatedRoute: ActivatedRoute,
              private $modal: FiLinkModalService,
              // private $facilityService: FacilityService,
              private $facilityCommonService: FacilityForCommonService,
              private $alarmService: AlarmForCommonService,
              private $topNService: TopNService,
              private $router: Router
  ) {
  }

 public ngOnInit(): void {
    this.statisticalLanguage = this.$NZi18.getLocaleData(LanguageEnum.statistical);
   this.language = this.$NZi18.getLocaleData(LanguageEnum.alarm);
    this.$facilityCommonService.queryAreaList().subscribe((result: ResultModel<any>) => {
      const data = result.data || [];
      // 递归设置区域的选择情况
      FacilityForCommonUtil.setAreaNodesStatus(data, null, null);
      this.treeNodes = data;
      this.addAreaId(this.treeNodes);
    });
    this.treeSelectorConfig = StatisticalUtil.initTreeSelectorConfig(this.statisticalLanguage, this.treeNodes);
    // this.initTreeSelectorConfigs();
    this.getUserCanLookDeviceType();
    this.getPageType();
    this.initTableConfig();
  }

  /**
   * 给区域添加iD属性，
   * param data
   */
  public addAreaId(data): void {
    data.forEach(item => {
      item['id'] = item.areaId;
      item['areaLevel'] = item.level;
      if (item.children) {
        this.addAreaId(item.children);
      }
    });
  }

  /**
   * 表格翻页事件
   */
  public pageChange(event): void {
    this.pageBean.pageIndex = event.pageIndex;
    this.pageBean.pageSize = event.pageSize;
    this.showData();
  }

  /**
   * 获取页面标题
   */
  private getPageType(): void {
    // this.pageTitleType = this.$activatedRoute.params.
    if (this.$activatedRoute.snapshot.url[0].path === RouterConst.TopLock) {
      // 开锁次数统计
      this.pageTypeTitle = RouterConst.TopLock;
      // this.getUserCanLookDeviceType();
      this.setRadioSelectInfo();
    } else if (this.$activatedRoute.snapshot.url[0].path === RouterConst.TopAlarm) {
      // 告警次数统计
      this.pageTypeTitle = RouterConst.TopAlarm;
      // this.getUserCanLookDeviceType();
      this.refAlarmList();
    } else if (this.$activatedRoute.snapshot.url[0].path === RouterConst.TopWorkOrder) {
      // 销障工单统计
      this.pageTypeTitle = RouterConst.TopWorkOrder;
      // this.getUserCanLookDeviceType();
    } else if (this.$activatedRoute.snapshot.url[0].path === RouterConst.TopSensor) {
      // 传感数值统计
      this.pageTypeTitle = RouterConst.TopSensor;
      // this.getUserCanLookDeviceType();
      // this.setRadioSelectInfo();
      this.radioSensorSelectInfo = CommonUtil.codeTranslate(sensorValueEnum, this.$NZi18);
      this.radioSensorSelectInfo = this.radioSensorSelectInfo.filter(item => {
        if (item.code === sensorValueEnum.humidity || item.code === sensorValueEnum.temperature) {
          return item;
        }
      });
      this.setRadioSelectInfo();
    } else {
      // 端口资源使用率统计
      this.pageTypeTitle = RouterConst.TopPort;
      this.selectInfo = FacilityForCommonUtil.translateDeviceType(this.$NZi18) as any[];
      this.selectInfo = this.selectInfo.filter(item => {
        if (item.code === RouterConst.Optical_Box
          || item.code === RouterConst.OUTDOOR_CABINET || item.code === RouterConst.Distribution_Frame) {
          const list = SessionUtil.getUserInfo().role.roleDevicetypeList.filter(el => el.deviceTypeId === item.code);
          list.length > 0 ? item.isDisable = false : item.isDisable = true;
          item.value = item.code;
          return item;
        }
      });
    }
  }

  /**
   * 设置单选框数据
   */
 public setRadioSelectInfo(): void {
    this.radioSelectInfo = this.radioSelectInfo.filter(item => {
      if (item.code === RouterConst.Optical_Box || item.code === RouterConst.Well || item.code === RouterConst.OUTDOOR_CABINET) {
        return item;
      }
    });
  }

  /**
   * 打开区域选择器
   */
  public showAreaSelect(): void {
    this.treeSelectorConfig.treeNodes = this.treeNodes;
    this.isVisible = true;
  }

  /**
   * 初始化区域树配置
   */
  private initTreeSelectorConfig(): void {
    const treeSetting = {
      check: {
        enable: true,
        chkStyle: 'checkbox',
        chkboxType: {'Y': '', 'N': ''},
      },
      data: {
        simpleData: {
          enable: false,
          idKey: 'areaId',
        },
        key: {
          name: 'areaName',
          children: 'children'
        },
      },
      view: {
        showIcon: false,
        showLine: false
      }
    };
    this.treeSelectorConfig = {
      title: this.statisticalLanguage.selectArea,
      width: '1000px',
      height: '300px',
      treeNodes: this.treeNodes,
      treeSetting: treeSetting,
      onlyLeaves: false,
      selectedColumn: [
        {
          title: this.statisticalLanguage.areaName, key: 'areaName', width: 100,
        },
        {
          title: this.statisticalLanguage.areaLevel, key: 'areaLevel', width: 100,
        }
      ]
    };
  }

  /**
   * 选择区域
   * param event
   */
  public selectDataChange(event): void {
    this.selectAreaList = event;
    const areaNameList = [];
    if (event.length > 0) {
      this.selectAreaIDList = event.map(item => {
        areaNameList.push(item.areaName);
        return item.areaId;
      });
      this.areaName = areaNameList.join();
    } else {
      this.areaName = '';
      this.selectAreaIDList = [];
    }
    FacilityForCommonUtil.setAreaNodesMultiStatus(this.treeNodes, this.selectAreaIDList);
  }

  /**
   * 获取当前用户能看到的设施类型
   */
  private getUserCanLookDeviceType(): void {
    /**
    this.radioSelectInfo = FacilityForCommonUtil.translateDeviceType(this.$NZi18);
    const list = [];
    this.radioSelectInfo.forEach(item => {
      if (SessionUtil.getUserInfo().role.roleDevicetypeList.filter(_item => _item.deviceTypeId === item.code).length > 0) {
        list.push(item);
      }
      // const list = SessionUtil.getUserInfo().role.roleDevicetypeList.filter(el => el.deviceTypeId === item.code);
    });
    this.radioSelectInfo = list;
    */
    this.radioSelectInfo = FacilityForCommonUtil.getRoleFacility(this.$NZi18);
    this.radioSelectInfo.map(item => {
      item.value = item.code;
    });
  }

  /**
   * 获取关联告警下拉框数据
   */
  public refAlarmList(): void {
    const alarmQueryCondition = new QueryConditionModel();
    alarmQueryCondition.pageCondition = new PageCondition(1, 20);
    this.$alarmService.queryAlarmCurrentSetList(alarmQueryCondition).subscribe((result: ResultModel<any>) => {
      const data = result.data;
      const arr = [];
      data.forEach(item => {
        if (item.alarmCode !== 'orderOutOfTime') {
          arr.push({value: item.alarmCode, label: item.alarmName});
          // arr.push({value: item.alarmCode, label: CommonUtil.codeTranslate(alarmNameStatisticalEnum, this.$NZi18, item.alarmCode)});
        }
      });
      this.selectInfo = arr;
    });
  }

  /**
   * 时间控件值改变监听事件
   * param event
   */
  public rangValueChange(event): void {
  }

  /**
   * 打开时间选择控件
   * param event
   */
  public onOpenChange(event): void {
    if (! event && this.rangDateValue.length) {
      // 这里深拷贝一个对象
      const temp = [new Date(this.rangDateValue[0].getTime()), new Date(this.rangDateValue[1].getTime())];
      if (this.rangDateValue.length === 2 && this.rangDateValue[0].getTime() > this.rangDateValue[1].getTime()) {
        // 当选时间的时候ui组件判断错误，赋值为开始的那个
        this.rangDateValue = [];
      } else {
        this.rangDateValue = [];
        this.rangDateValue = temp;
      }
    }
  }

  /**
   * 获取eChart实例
   * param event eChart实例
   */
  public getBarChartInstance(event): void {
    this.barChartInstance = event;
  }

  /**
   * 统计
   */
  public statistical(): void {
    this.firstSelect = false;
    this.ProgressShow = true;
    this.showLoading = false;
    const statisticalData = {};
    statisticalData['topCount'] = Number(this.statisticalNumber);
    statisticalData['topTotal'] = Number(this.statisticalNumber);
    statisticalData['areaIdList'] = this.selectAreaIDList;
    statisticalData['deviceType'] = this.radioValue;
    // 传感数值统计
    if (this.pageTypeTitle === RouterConst.TopSensor) {
      this.querySensorStatistical(statisticalData);
      // 销障工单统计
    } else if (this.pageTypeTitle === RouterConst.TopWorkOrder) {
      this.queryWorkOrder(statisticalData);
      // 告警次数统计
    } else if (this.pageTypeTitle === RouterConst.TopAlarm) {
      this.queryAlarmStatistical(statisticalData);
      // 端口资源使用率统计
    } else if (this.pageTypeTitle === RouterConst.TopPort) {
      this.queryOdnDeviceStatistical(statisticalData);
      // 开锁次数统计
    } else {
      this.queryLockStatistical(statisticalData);
    }
  }

  /**
   * 页面为传感器值TopN时，显示最高或最低的开关
   * param event 开关的true 为最高
   */
  public clickSwitch(event): void {
    if (event) {
      const deviceIds = [];
      if (this.topMaxData.length > 0) {
        this.topMaxData.forEach(item => deviceIds.push(item.deviceId));
        deviceIds.reverse();
        this.queryDeviceIds(deviceIds, this.topMaxData);
        // setTimeout(() => this.barChartInstance.setOption(ChartUtil.setBarsChartOption(this.topMaxData)), 500);
      } else {
        this.hide = true;
        this.showLoading = true;
        this.hasData = false;
      }
    } else {
      if (this.topMinData.length > 0) {
        const deviceIds = [];
        this.topMinData.forEach(item => deviceIds.push(item.deviceId));
        deviceIds.reverse();
        this.queryDeviceIds(deviceIds, this.topMinData);
        // setTimeout(() => this.barChartInstance.setOption(ChartUtil.setBarsChartOption(this.topMinData)), 500);
      } else {
        this.hide = true;
        this.showLoading = true;
        this.hasData = false;
      }
    }
  }

  /**
   * 展示数据
   */
  private showData(): void {
    this.pageBean.Total = this._dataset.length;
    const startIndex = this.pageBean.pageSize * (this.pageBean.pageIndex - 1);
    const endIndex = startIndex + this.pageBean.pageSize - 1;
    this._dataset = this._dataset.filter((item, index) => {
      return index >= startIndex && index <= endIndex;
    });
  }

  /**
   * 初始化表格配置
   */
  private initTableConfig(): void {
    this.tableConfig = {
      noIndex: true,
      notShowPrint: true,
      showSearchExport: true,
      isDraggable: false,
      noExportHtml: true,
      scroll: {x: '538px', y: '600px'},
      columnConfig: [
        {
          // 排名
          type: 'serial-number', width: 50, title: this.statisticalLanguage.ranking
        },
        {
          // 设施名称
          title: this.statisticalLanguage.deviceName, width: 90, key: 'deviceName', searchable: true, searchConfig: {
            type: 'input'
          },
          type: 'render', renderTemplate: this.deviceTemp
        },
        {
          title: this.statisticalLanguage.ownAreaName, width: 95, key: 'areaName', searchable: true, searchConfig: {
            type: 'input'
          }
        },
        {
          title: this.statisticalLanguage.address, width: 95, key: 'address', searchable: true, searchConfig: {
            type: 'input'
          }
        },
        {
          title: this.statisticalLanguage.accountabilityUnitName,
          width: 95,
          key: 'accountabilityUnitName',
          searchable: true,
          searchConfig: {
            type: 'input'
          }
        },
        {
          title: this.statisticalLanguage.deployStatus, key: 'status', searchable: true, searchConfig: {
            type: 'input'
          }
        }
      ],
      handleExport: (event) => {
        this.setExport(event);
      },
      handleSearch: (event) => {
        if (event && event.length) {
          // 有筛选数据时进入
          event.forEach(item => {
            this._dataset = this._dataset.filter(items => {
              return items[item.filterField] + '' === item.filterValue;
            });
          });
        } else {
          // 重置表格
          this._dataset = this.defaultTableValue;
        }
      }
    };
  }

  private setExport(data): void {
    data.columnInfoList.unshift({propertyName: 'ranking', columnName: this.statisticalLanguage.ranking});
    data.queryCondition = {
      filterConditions: [],
      pageCondition: {},
      sortCondition: {},
      bizCondition: {}
    };
    data['objectList'] = CommonUtil.deepClone(this._dataset);
    data.objectList.forEach((item, index) => {
      item.ranking = index + 1;
    });
    if (this.pageTypeTitle === RouterConst.TopWorkOrder) {
      this.$topNService.procClearTopListStatisticalExport(data).subscribe((result: ResultModel<any>) => {
        this.$modal.success(result.msg);
      });
    } else if (this.pageTypeTitle === RouterConst.TopLock) {
      this.$topNService.exportUnlockingTopNum(data).subscribe((result: ResultModel<any>) => {
        this.$modal.success(result.msg);
      });
    } else if (this.pageTypeTitle === RouterConst.TopSensor) {
      this.$topNService.exportDeviceSensorTopNum(data).subscribe((result: ResultModel<any>) => {
        this.$modal.success(result.msg);
      });
    } else if (this.pageTypeTitle === RouterConst.TopPort) {
      this.$topNService.exportPortTopNumber(data).subscribe((result: ResultModel<any>) => {
        this.$modal.success(result.msg);
      });
    } else {
      this.$topNService.exportDeviceTop(data).subscribe((result: ResultModel<any>) => {
        this.$modal.success(result.msg);
      });
    }
  }

  /**
   * 根据Id查询设施详情
   * param data 设施IdList
   */
  private queryDeviceIds(data, chartData, type?): void {
    this.$topNService.getDeviceByIds(data).subscribe((result: ResultModel<TopDeviceModel[]>) => {
      const _dataset = [];
      data.forEach(item => {
        result.data.forEach(_item => {
          if (item === _item.deviceId) {
            if (_item.areaInfo) {
              _item.areaName = _item.areaInfo.areaName;
              _item.accountabilityUnitName = _item.areaInfo.accountabilityUnitName;
            }
            // _item.status = getDeployStatus(this.$NZi18, _item.deployStatus);
            _item.status = CommonUtil.codeTranslate(DeployStatusEnum, this.$NZi18, _item.deployStatus, LanguageEnum.facility);
            _dataset.push(_item);
          }
        });
      });
      this._dataset = _dataset;
      this.defaultTableValue = CommonUtil.deepClone(this._dataset);
      this._dataset.forEach(item => {
        item.accountabilityUnitName = item.areaInfo.accountabilityUnitName;
        this.topMaxData.forEach(_item => {
          if (_item.alarmSource === item.deviceId || _item.deviceId === item.deviceId) {
            _item['deviceName'] = item.deviceName;
          }
        });
      });
      setTimeout(() => this.barChartInstance.setOption(ChartUtil.setBarsChartOption(chartData, this.chartTitle, this.portChange)), 500);
    });
  }

  // 统计按钮的启用禁用状态
  public isDisable(): boolean {
    if (this.areaName) {
      if (this.pageTypeTitle === RouterConst.TopAlarm
        || this.pageTypeTitle === RouterConst.TopLock || this.pageTypeTitle === RouterConst.TopWorkOrder) {
        if (this.radioValue && this.rangDateValue.length > 0) {
          if (this.pageTypeTitle === RouterConst.TopAlarm) {
            if (this.selectAlarmData.selectAlarmCodes.length > 0) {
              return false;
            } else {
              return true;
            }
          }
        } else {
          return true;
        }
      } else if (this.pageTypeTitle === RouterConst.TopSensor) {
        if (this.radioValue) {
          if (this.radioSensor) {
            return false;
          } else {
            return true;
          }
        } else {
          return true;
        }
      } else {
        if (this.deviceList.length > 0) {
          return false;
        } else {
          return true;
        }
      }
    } else {
      return true;
    }
  }

  /**
   * 为告警TopN时统计请求
   */
  private queryAlarmStatistical(statisticalData): void {
    const reqObj = new TopNAlarmModel();
    this.chartTitle = {
      text: `${this.statisticalLanguage.alarmTop}${this.statisticalNumber}`,
      subtext: this.statisticalLanguage.alarmStatisticsForEachFacility,
    };
    this.hide = false;
    statisticalData['deviceIds'] = [this.radioValue];
    statisticalData['areaList'] = this.selectAreaIDList;
    delete statisticalData['areaIdList'];
    statisticalData['beginTime'] = + new Date(CommonUtil.dateFmt(TimeFormatEnum.startTime, new Date(this.rangDateValue[0])));
    statisticalData['endTime'] = + new Date(CommonUtil.dateFmt(TimeFormatEnum.endTime, new Date(this.rangDateValue[1])));
    statisticalData['alarmCodes'] = this.selectAlarmData.selectAlarmCodes;
    reqObj.bizCondition = statisticalData;
    this.$topNService.queryAlarmTop(reqObj).subscribe((result: ResultModel<AlarmTopResultModel[]>) => {
      if (result.code === 0 || result.code === ResultCodeEnum.success) {
        // if (result.data.length > 0) {
        this.hide = true;
        this.topMaxData = result.data;
        this.topMaxData.map(item => item.sensorValue = item.count);
        this.topMaxData = this.topMaxData.sort((min, max) => {
          return min.sensorValue - max.sensorValue;
        });
        const deviceIds = [];
        this.topMaxData.forEach(item => deviceIds.push(item.alarmSource));
        deviceIds.reverse();
        this.queryDeviceIds(deviceIds, this.topMaxData);
        this.showLoading = true;
        this.hasData = true;
      } else {
        this.$modal.error(result.msg);
      }
      this.ProgressShow = false;
    }, () => this.ProgressShow = false);
  }

  /**
   * 工单TopN统计相关
   */
  private queryWorkOrder(statisticalData): void {
    this.chartTitle = {
      text: `${this.statisticalLanguage.workOrderNumberTop}${this.statisticalNumber}`,
      subtext: this.statisticalLanguage.WorkStatisticsForEachFacility,
    };
    this.hide = false;
    statisticalData['deviceTypeList'] = [this.radioValue];
    statisticalData['procType'] = 'clear_failure';
    delete statisticalData['deviceType'];
    delete statisticalData['topTotal'];
    const params = new QueryConditionModel();
    params.bizCondition = statisticalData;
    params.filterConditions = [
      {
        'filterValue': statisticalData['deviceTypeList'],
        'filterField': 'deviceType',
        'operator': 'in'
      },
      {
        'filterValue': statisticalData['areaIdList'],
        'filterField': 'deviceAreaId',
        'operator': 'in'
      },
      {filterValue: + new Date(CommonUtil.dateFmt(TimeFormatEnum.startTime,
          new Date(this.rangDateValue[0]))), filterField: 'createTime', operator: 'gte', extra: 'LT_AND_GT'},
      {
        filterValue: + (new Date(CommonUtil.dateFmt(TimeFormatEnum.startTime, new Date(this.rangDateValue[1])))) + 86399000,
        filterField: 'createTime',
        operator: 'lte', extra: 'LT_AND_GT'
      }
    ];
    this.$topNService.queryTopListDeviceCountGroupByDevice(params).subscribe((result: ResultModel<any>) => {
      if (result.code === 0 || result.code === ResultCodeEnum.success) {
        this.hide = true;
        this.topMaxData = result.data;
        this.topMaxData.map(item => item.sensorValue = item.deviceCount);
        this.topMaxData = this.topMaxData.sort((min, max) => {
          return min.sensorValue - max.sensorValue;
        });
        const deviceIds = [];
        this.topMaxData.forEach(item => deviceIds.push(item.deviceId));
        deviceIds.reverse();
        this.queryDeviceIds(deviceIds, this.topMaxData);
        this.showLoading = true;
        this.hasData = true;
      } else {
        this.$modal.error(result.msg);
      }
      this.ProgressShow = false;
    }, () => this.ProgressShow = false);
  }

  /**
   * 传感值TopN统计
   */
  private querySensorStatistical(statisticalData): void {
    this.chartTitle = {
      text: `${this.statisticalLanguage.sensorTop}${this.statisticalNumber}`,
      subtext: this.statisticalLanguage.sensorStatisticsForEachFacility,
    };
    this.hide = false;
    statisticalData['sensorType'] = this.radioSensor;
    this.$topNService.queryDeviceSensorTopNum(statisticalData).subscribe((result: ResultModel<any>) => {
      if (result.code === 0 || result.code === ResultCodeEnum.success) {
        this.hide = true;
        this.maxAndMinData = result.data;
        this.topMinData = this.maxAndMinData.bottom.sort((min, max) => {
          return max.sensorValue - min.sensorValue;
        });
        this.topMaxData = this.maxAndMinData.top.sort((min, max) => {
          return min.sensorValue - max.sensorValue;
        });
        const deviceIds = [];
        this.topMaxData.forEach(item => deviceIds.push(item.deviceId));
        deviceIds.reverse();
        this.queryDeviceIds(deviceIds, this.topMaxData);
        // if (this.topMaxData.length > 0) {
        // setTimeout(() => this.barChartInstance.setOption(ChartUtil.setBarsChartOption(this.topMaxData)), 500);
        this.showLoading = true;
        this.hasData = true;
      } else {
        this.$modal.error(result.msg);
      }
      this.ProgressShow = false;
    }, () => this.ProgressShow = false);
  }

  /**
   * 开锁次数TopN统计
   */
  private queryLockStatistical(statisticalData): void {
    this.chartTitle = {
      text: `${this.statisticalLanguage.lockTop}${this.statisticalNumber}`,
      subtext: this.statisticalLanguage.lockStatisticsForEachFacility,
    };
    this.hide = false;
    delete statisticalData.topCount;
    delete statisticalData.sensorType;
    // statisticalData['startDate'] = this.setTime(this.rangDateValue)[0];
    // statisticalData['endDate'] = this.setTime(this.rangDateValue)[1];
    statisticalData['startDate'] = + new Date(CommonUtil.dateFmt(TimeFormatEnum.startTime, new Date(this.rangDateValue[0])));
    statisticalData['endDate'] = + new Date(CommonUtil.dateFmt(TimeFormatEnum.endTime, new Date(this.rangDateValue[1])));
    this.$topNService.queryUnlockingTopNum(statisticalData).subscribe((result: ResultModel<any>) => {
      if (result.code === 0 || result.code === ResultCodeEnum.success) {
        // if (result.data.length > 0) {
        this.hide = true;
        this.topMaxData = result.data;
        this.topMaxData.map(item => item.sensorValue = item.countValue);
        this.topMaxData = this.topMaxData.sort((min, max) => {
          return min.sensorValue - max.sensorValue;
        });
        const deviceIds = [];
        this.topMaxData.forEach(item => deviceIds.push(item.deviceId));
        deviceIds.reverse();
        this.queryDeviceIds(deviceIds, this.topMaxData);
        this.showLoading = true;
        this.hasData = true;
      } else {
        this.$modal.error(result.msg);
      }
      this.ProgressShow = false;
    }, () => this.ProgressShow = false);
  }

  /**
   * 端口使用率TopN统计
   */
  private queryOdnDeviceStatistical(statisticalData): void {
    this.hide = false;
    // eCharts标题
    this.chartTitle = {
      text: `${this.statisticalLanguage.portUseTop}${this.statisticalNumber}`,
      subtext: this.statisticalLanguage.portUseStatisticsForEachFacility,
    };
    statisticalData['areaIds'] = statisticalData.areaIdList;
    statisticalData['deviceTypes'] = this.deviceList.map(item => item.value);
    statisticalData['topN'] = statisticalData.topCount;
    delete statisticalData.areaIdList;
    delete statisticalData.deviceType;
    delete statisticalData.topCount;
    delete statisticalData.topTotal;
    this.$topNService.queryPortTopN(statisticalData).subscribe((result: ResultModel<any>) => {
      if (result.code === 0 || result.code === ResultCodeEnum.success) {
        this.hide = true;
        this.topMaxData = result.data;
        this.topMaxData.map(item => item.sensorValue = item.utilizationRate);
        this.topMaxData = this.topMaxData.sort((min, max) => {
          return min.sensorValue - max.sensorValue;
        });
        const deviceIds = [];
        this.topMaxData.forEach(item => deviceIds.push(item.deviceId));
        this.portChange = true;
        deviceIds.reverse();
        this.queryDeviceIds(deviceIds, this.topMaxData, this.portChange);
        this.showLoading = true;
        this.hasData = true;
      } else {
        this.$modal.error(result.msg);
      }
      this.ProgressShow = false;
    }, () => this.ProgressShow = false);
  }

  /**
   * 对时间进行处理
   */
  private setTime(data: any[]): any[] {
    const timeData = [];
    data.forEach(item => {
      timeData.push(CommonUtil.dateFmt('yyyyMMdd', item));
    });
    return timeData;
  }

  /**
   * 禁用时间
   * param {Date} current
   * returns {boolean}
   */
  public disabledEndDate = (current: Date): boolean => {
    const nowTime = new Date();
    return differenceInCalendarDays(current, nowTime) > - 1;
  }

  public goDevice(data): void {
    this.$router.navigate(['/business/facility/facility-detail-view'], {
      queryParams: {
        id: data.deviceId,
        deviceType: data.deviceType
      }
    }).then();
  }

  /**
   * 打开告警名称选择弹窗
   */
  public showAlarmNameSelect(): void {
    this.alarmNameSelectVisible = true;
  }

  /**
   * 选择告警名称
   * @param event 选择的告警数据
   */
  public onSelectAlarmName(event: AlarmNameListModel[]): void {
    const obj = {
      selectAlarmCodes: [],
      ids: [],
      alarmNames: []
    };
    event.forEach((item: AlarmNameListModel) => {
      obj.selectAlarmCodes.push(item.alarmCode);
      obj.ids.push(item.id);
      obj.alarmNames.push(item.alarmName);
    });
    this.selectAlarmData = Object.assign(this.selectAlarmData, obj);
    this.selectAlarms = event;
    this.alarmName = this.selectAlarmData.alarmNames.toString();
  }
}

import {NzI18nService} from 'ng-zorro-antd';
import {FiLinkModalService} from '../../../shared-module/service/filink-modal/filink-modal.service';
import {FacilityLanguageInterface} from '../../../../assets/i18n/facility/facility.language.interface';
import {WorkOrderLanguageInterface} from '../../../../assets/i18n/work-order/work-order.language.interface';
import {PageModel} from '../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../shared-module/model/table-config.model';
import {QueryConditionModel} from '../../../shared-module/model/query-condition.model';
import {TreeSelectorConfigModel} from '../../../shared-module/model/tree-selector-config.model';
import {ResultModel} from '../../../shared-module/model/result.model';
import {FacilityForCommonUtil} from '../../../core-module/business-util/facility/facility-for-common.util';
import {FacilityForCommonService} from '../../../core-module/api-service/facility';
import {differenceInCalendarDays} from 'date-fns';
import {CommonUtil} from '../../../shared-module/util/common-util';
import {TimeFormatEnum} from '../../../shared-module/enum/time-format.enum';
import {UserForCommonService} from '../../../core-module/api-service/user';
import {IndexWorkOrderStateEnum} from '../../../core-module/enum/work-order/work-order.enum';
import {LanguageEnum} from '../../../shared-module/enum/language.enum';
import {ChartUtil} from '../../../shared-module/util/chart-util';
import {SessionUtil} from '../../../shared-module/util/session-util';
import {DeviceTypeEnum} from '../../../core-module/enum/facility/facility.enum';

export class TemplateWorkOrder {
  public ringName = [];
  public ringData = [];
  public barName = [];
  public barData = [];
  // 表格分页配置
  public pageBean: PageModel = new PageModel(10, 1, 1);
  // 表格配置
  public tableConfig: TableConfigModel;
  // 筛选条件
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // 树配置
  public treeSelectorConfig: TreeSelectorConfigModel;
  // 页面是否显示时间选择器
  public dateRangeShow = false;
  // 页面是否选择单选框
  public radioSelectShow = false;
  // 页面是否选择单位选择器
  public selectUnitShow = false;
  // 页面是否选择区域选择器
  public selectAreaShow = false;
  // 页面是否选择多选框
  public checkBoxSelectShow = false;
  // 单位选择器显示
  public isUnitVisible = false;
  // 区域选择器显示
  public isAreaVisible = false;
  // 多选选择的设施集合
  public selectDeviceTypeList = [];
  // 多选框选择的设施列表
  public deviceTypeList = [];
  // 是否显示tab栏
  public showTab = false;
  // 是否第一次统计
  public hide = true;
  public lineChart;
  // 选择的单位名称
  public selectUnitName = '';
  // 选择的区域名称
  public areaName = '';
  // 设施国际化
  public language: FacilityLanguageInterface;
  // 工单国际化
  public wLanguage: WorkOrderLanguageInterface;
  // 单选框选择的值
  public deviceTypeData: string = null;
  // 多选框选择的idList
  public checkBoxDeviceTypeData = [];
  // 多选框的List
  public selectInfo = [];
  // 单选框的值集合
  public selectAudioInfo = [];
  // 时间选择器的值
  public dateRange = [];
  // 表格数据
  public _dataSet = [];
  // 处理表格过滤的数据
  public _dataSetMain = [];
  // tabs当前选择的tab
  public deviceActive;
  // 树节点
  public treeNodes;
  public selectAreaData = [];
  public areaData = [];
  // 开始时间
  public startTime;
  // 结束时间
  public endTime;
  // 选择的单选idList
  public selectUnitIdData = [];
  public exportData = [];
  // 饼图实例
  barChartInstance;
  // 柱状图实例
  public ringChartInstance;
  // 柱状图实例
  public lineChartInstance;
  // 是否显示进度条
  public ProgressShow = false;

  constructor(public $nzI18n: NzI18nService,
              public $message: FiLinkModalService,
              public $facilityCommonService?: FacilityForCommonService,
              public $userService?: UserForCommonService
  ) {

  }

  /**
   * 初始化区域选择器
   */
  public initPublicConfig(): void {
    this.language = this.$nzI18n.getLocaleData('facility');
    this.wLanguage = this.$nzI18n.getLocaleData('workOrder');
    this.$facilityCommonService.queryAreaList().subscribe((result: ResultModel<any>) => {
      const data = result.data || [];
      // 递归设置区域的选择情况
      FacilityForCommonUtil.setAreaNodesStatus(data, null, null);
      this.treeNodes = data;
      this.isCheckData(this.treeNodes);
    });
    this.initTreeSelectorConfig();
  }

  /**
   * 给选择设施的列表附加id属性，防止在表格中勾选时树表不作出相应的变化
   * param data
   */
  public isCheckData(data): void {
    data.forEach(item => {
      item.id = item.areaId;
      item.areaLevel = item.level;
      if (item.children) {
        this.isCheckData(item.children);
      }
    });
  }

  /**
   * 显示区域选择器
   */
  public showAreaSelector(): void {
    this.treeSelectorConfig.treeNodes = this.treeNodes;
    this.isAreaVisible = true;
  }

  /**
   * 显示单位选择器
   */
  public showUnitSelector(): void {
    this.treeSelectorConfig.treeNodes = this.treeNodes;
    this.isUnitVisible = true;
  }

  /**
   * 时间选择变化
   * param timeResults 时间区间
   */
  public onChange(timeResults): void {
    if (timeResults.length > 0) {
      this.startTime = new Date(CommonUtil.dateFmt(TimeFormatEnum.startTime, timeResults[0])).getTime();
      this.endTime = new Date(CommonUtil.dateFmt(TimeFormatEnum.endTime, timeResults[1])).getTime();
    } else {
      this.startTime = null;
      this.endTime = null;
    }
  }

  /**
   * 请求接口
   */
  public refreshData(e?): void {
  }

  /**
   * 处理tab切换
   * param data
   */
  public getDeviceType(data): void {
    this.queryCondition.filterConditions = [{
      'filterValue': data.code,
      'filterField': 'deviceType',
      'operator': 'eq'
    }];
    this.refreshData(true);
  }

  /**
   * 初始化区域选择属配置
   */
  public initTreeSelectorConfig(): void {
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
      title: `${this.language.select}${this.language.area}`,
      width: '1000px',
      height: '300px',
      treeNodes: this.treeNodes,
      treeSetting: treeSetting,
      onlyLeaves: false,
      selectedColumn: [
        {
          title: this.language.areaName, key: 'areaName', width: 100,
        },
        {
          title: this.language.level, key: 'areaLevel', width: 100,
        }
      ]
    };
  }

  /**
   * 处理表格分页
   * param event
   */
  public pageChange(event): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
  }

  /**
   * 区域选择变化
   * param event 选择的数据
   */
  public selectDataChange(event): void {
    this.selectAreaData = event;
    let selectArr = [];
    const areaNameList = [];
    if (event.length > 0) {
      selectArr = event.map(item => {
        areaNameList.push(item.areaName);
        return item.areaId;
      });
      this.areaName = areaNameList.join();
    } else {
      this.areaName = '';
    }
    this.areaData = selectArr;
    FacilityForCommonUtil.setAreaNodesMultiStatus(this.treeNodes, selectArr);
  }

  /**
   * 单位选择变化
   * param event 选择的数据
   */
  public selectUnitDataChange(event): void {
    this.selectUnitName = '';
    const selectArr = event.map(item => {
      this.selectUnitName += `${item.deptName},`;
      return item.deptCode;
    });
    const ids = event.map(item => item.id);
    this.selectUnitIdData = selectArr;
    this.selectUnitName = this.selectUnitName.substring(0, this.selectUnitName.length - 1);
    FacilityForCommonUtil.setTreeNodesStatus(this.treeNodes, ids);
  }

  /**
   * 禁用时间
   * param {Date} current
   * returns {boolean}
   */
  public disabledEndDate = (current: Date): boolean => {
    const nowTime = new Date();
    return differenceInCalendarDays(current, nowTime) > 0;
  }

  /**
   * 处理单位选择树配置
   */
  public initTreeUnitSelectorConfig(): void {
    const treeSetting = {
      check: {
        enable: true,
        chkStyle: 'checkbox',
        chkboxType: {'Y': '', 'N': ''},
      },
      data: {
        simpleData: {
          enable: true,
          idKey: 'id',
          pIdKey: 'deptFatherId',
          rootPid: null
        },
        key: {
          name: 'deptName',
          children: 'childDepartmentList'
        },
      },
      view: {
        showIcon: false,
        showLine: false
      }
    };
    this.treeSelectorConfig = {
      title: `${this.language.selectUnit}`,
      width: '1000px',
      height: '300px',
      treeNodes: this.treeNodes,
      treeSetting: treeSetting,
      onlyLeaves: false,
      selectedColumn: [
        {
          title: `${this.language.deptName}`, key: 'deptName', width: 100,
        },
        {
          title: `${this.language.deptLevel}`, key: 'deptLevel', width: 100,
        },
        {
          title: `${this.language.parentDept}`, key: 'parentDepartmentName', width: 100,
        }
      ]
    };
  }

  /**
   * 初始化单位选择的通用配置
   */
  public initUnitPublicConfig(): void {
    console.log(this.selectUnitShow);
    this.language = this.$nzI18n.getLocaleData('facility');
    this.wLanguage = this.$nzI18n.getLocaleData('workOrder');
    this.$userService.queryAllDepartment().subscribe((result: ResultModel<any>) => {
      this.treeNodes = result.data || [];
    });
    this.initTreeUnitSelectorConfig();
  }

  /**
   * 处理工单状态统计接口返回数据
   * param res
   */
  public workOrderStatus(res): void {
    this.tableConfig.isLoading = false;
    this._dataSet = CommonUtil.deepClone(res.data);
    this._dataSet.forEach(item => {
      this.selectAreaData.forEach(_item => {
        if (item.deviceAreaId === _item.areaId) {
          item.areaName = _item.areaName;
        }
      });
      this._dataSetMain = this._dataSet;
    }, () => {
      this.tableConfig.isLoading = false;
    });
    this.hide = false;
    this.setWorkStatusChartData(res.data);
    this.exportData = CommonUtil.deepClone(this._dataSet);
    this.ProgressShow = false;
  }

  /**
   * 获取饼图实例
   */
  public getRingChartInstance(event): void {
    this.ringChartInstance = event;
  }

  /**
   * 获取柱状图实例
   */
  public getBarChartInstance(event): void {
    this.barChartInstance = event;
  }

  /**
   * 获取折线图实例
   */
  public getLineChartInstance(event): void {
    this.lineChartInstance = event;
  }

  /**
   * 设置工单状态统计图表数据
   */
  public setWorkStatusChartData(data): void {
    const dataMap = this.setFirstChartData(data);
    Object.keys(dataMap).forEach(key => {
      if (key !== 'deviceAreaId') {
        dataMap[key] = dataMap[key].reduce((a, b) => Number(a) + Number(b));
        this.ringData.push({
          value: dataMap[key],
          name: <string>CommonUtil.codeTranslate(IndexWorkOrderStateEnum, this.$nzI18n, key, LanguageEnum.workOrder)
        });
        this.ringName.push(<string>CommonUtil.codeTranslate(IndexWorkOrderStateEnum, this.$nzI18n, key, LanguageEnum.workOrder));
        this.barData.push(dataMap[key]);
        this.barName.push(<string>CommonUtil.codeTranslate(IndexWorkOrderStateEnum, this.$nzI18n, key, LanguageEnum.workOrder));
      }
    });
    setTimeout(() => this.ringChartInstance.setOption(ChartUtil.setRingChartOption(this.ringData, this.ringName)));
    setTimeout(() => this.barChartInstance.setOption(ChartUtil.setBarChartOption(this.barData, this.barName)));
  }

  /**
   * 获取用户能看到的单选设施列表
   */
  public getUserCanLookDeviceType(): void {
    // 更换公共方法 TODO
    /*this.selectInfo = CommonUtil.codeTranslate(DeviceTypeEnum, this.$nzI18n) as [];
    const list = [];
    this.selectInfo.forEach(item => {
      item.value = item.code;
      if (SessionUtil.getUserInfo().role.roleDevicetypeList.filter(_item => _item.deviceTypeId === item.code).length > 0) {
        list.push(item);
      }
    });*/
    this.selectInfo = FacilityForCommonUtil.getRoleFacility(this.$nzI18n);
    this.selectInfo.forEach(item => {
      item.value = item.code;
    });
  }

  public setFirstChartData(data): any {
    const dataMap = {};
    data.forEach(item => {
      Object.keys(item).forEach(_item => {
        if (_item !== 'deviceAreaId') {
          if (!dataMap[_item]) {
            dataMap[_item] = [];
          }
          dataMap[_item].push(item[_item]);
        }
      });
    });
    this.ringName = [];
    this.ringData = [];
    this.barName = [];
    this.barData = [];
    return dataMap;
  }
}

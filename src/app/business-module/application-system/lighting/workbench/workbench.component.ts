import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {ChartsConfig} from '../../share/config/charts-config';
import {ApplicationFinalConst, RouterJumpConst, StrategyListConst} from '../../share/const/application-system.const';
import {ApplicationService} from '../../share/service/application.service';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {ElectricityFmtModel, EquipmentCountListModel} from '../../share/model/lighting.model';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {ApplicationInterface} from '../../../../../assets/i18n/appliction/application.interface';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {OnlineLanguageInterface} from '../../../../../assets/i18n/online/online-language.interface';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {ExecTypeEnum, PolicyEnum, StrategyStatusEnum} from '../../share/enum/policy.enum';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {SelectDataConfig} from '../../share/config/select.data.config';
import {GroupListModel} from '../../share/model/equipment.model';
import {PolicyControlModel, StrategyListModel} from '../../share/model/policy.control.model';
import {SliderValueConst} from '../../share/const/slider.const';
import {LoopModel} from '../../share/model/loop.model';
import {PageModel} from '../../../../shared-module/model/page.model';
import {OperationButtonEnum, PageOperationEnum} from '../../share/enum/operation-button.enum';
import {execType} from '../../share/util/application.util';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';
import {DeviceTypeCountModel} from '../../../../core-module/model/facility/device-type-count.model';
import {EquipmentListModel} from '../../../../core-module/model/equipment/equipment-list.model';
import {listFmt} from '../../share/util/tool.util';
import {FilterValueConst} from '../../share/const/filter.const';
import * as _ from 'lodash';
import {CurrencyEnum} from '../../../../core-module/enum/operator-enable-disable.enum';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {LightPolicyEnum, LightTableEnum} from '../../share/enum/auth.code.enum';
import {EquipmentStatisticsModel} from '../../../../core-module/model/equipment/equipment-statistics.model';
import {CalculationFileSizeConst} from '../../share/const/program.const';
import {VideoControlEnum} from '../../../../shared-module/enum/video-control.enum';
import {ControlInstructEnum} from '../../../../core-module/enum/instruct/control-instruct.enum';
import {EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {ApplicationSystemForCommonService} from '../../../../core-module/api-service/application-system';
import {WorkOrderIncreaseModel} from '../../../../core-module/model/application-system/work-order-increase.model';
import {getISOWeek} from 'date-fns';
import {DateTypeEnum, StatisticalDimensionEnum} from '../../share/enum/report-analysis.enum';

@Component({
  selector: 'app-workbench',
  templateUrl: './workbench.component.html',
  styleUrls: ['./workbench.component.scss']
})

export class WorkbenchComponent implements OnInit {
  // ?????????
  public pageNum: number = PageOperationEnum.pageNum;
  // ?????????
  public totalPage: number = 0;
  // ???????????????????????????
  public isConvenient: boolean = true;
  // ??????????????????????????????????????????
  public isAvailable: boolean = false;
  // ????????????????????????????????????
  public isLightingRate: boolean = false;
  // ????????????????????????????????????
  public isWorkOrder: boolean = false;
  // ?????????????????????????????????
  public isElectricity: boolean = false;
  // ????????????????????????????????????
  public isEquipmentStatus: boolean = false;
  // ?????????????????????????????????
  public isAlarmStatistics: boolean = false;
  // ???????????????????????????????????????????????????
  public isAlarmStatisticsRole: boolean = SessionUtil.checkHasRole('02-1');
  // ????????????????????????
  public isWorkOrderRole: boolean = SessionUtil.checkHasRole('07-3');
  // ???????????????????????????loading
  public isEnableStrategy: boolean = false;
  // ????????????
  public pageBean: PageModel = new PageModel();
  // ??????????????????
  public equipmentPageBean: PageModel = new PageModel(5, 1, 0);
  // ??????????????????
  public groupPageBean: PageModel = new PageModel(5, 1, 0);
  // ??????????????????
  public loopPageBean: PageModel = new PageModel(5, 1, 0);
  // ????????????
  public convenientVal: number = 0;
  // ??????????????????
  public sliderValue = SliderValueConst;
  // ??????????????????
  public StrategyStatusEnum = StrategyStatusEnum;
  // ??????????????????
  public OperationButtonEnum = OperationButtonEnum;
  // ??????????????????
  public equipmentStatusData: object;
  // ???????????????????????????
  public equipmentCountList: EquipmentCountListModel = new EquipmentCountListModel({});
  // ???????????????
  public multiFunctionPoleCount: number = 0;
  // ???????????????
  public language: OnlineLanguageInterface;
  // ?????????????????????
  public languageTable: ApplicationInterface;
  // ?????????????????????
  public equipmentTableConfig: TableConfigModel;
  // ????????????
  public equipmentData: EquipmentListModel[] = [];
  // ?????????????????????
  public groupTableConfig: TableConfigModel;
  // ????????????
  public groupData: GroupListModel[] = [];
  // ?????????????????????
  public loopTableConfig: TableConfigModel;
  // ????????????
  public loopData: LoopModel[] = [];
  // ??????????????????
  public dataSet: PolicyControlModel[] = [];
  // ???????????????
  public lightingRateData: object;
  // ??????????????????
  public convenientData: PolicyControlModel = new PolicyControlModel({});
  // ????????????
  public emergencyData: object;
  // ??????????????????
  public workOrderData: object;
  // ???????????????
  public electricity: object;
  // ????????????????????????
  public dateRange: Array<Date>;
  // ????????????????????????
  public electricityDate;
  // ?????????
  public lightRateList;
  // ????????????
  public workOrderList;
  // ??????????????????????????????
  public lightingRateNumber: number = 3;
  // ???????????????????????????????????????
  public workOrderQueryType: number = 3;
  // ????????????????????????????????????
  public electricityNumber: number = 8;
  // ?????????????????????
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // ??????id??????
  public groupIds: Array<string> = [];
  // ?????????????????????
  public equipmentQueryCondition: QueryConditionModel = new QueryConditionModel();
  // ?????????????????????
  public groupQueryCondition: QueryConditionModel = new QueryConditionModel();
  // ?????????????????????
  public loopQueryCondition: QueryConditionModel = new QueryConditionModel();
  /** ???????????????*/
  public radioValue: boolean;
  /** ??????????????????????????????*/
  public lightPolicyEnum = LightPolicyEnum;
  /** ??????????????????????????????*/
  public lightTableEnum = LightTableEnum;
  public openRole: boolean = false;
  public closeRole: boolean = false;
  public sliderRole: boolean = false;
  //
  public videoControlEnum = VideoControlEnum;
  /**
   * switch????????????
   */
  buttonDebounce = _.debounce((strategyStatus: boolean, strategyId: string) => {
    const params = {
      strategyType: StrategyListConst.lighting,
      operation: strategyStatus ? CurrencyEnum.enable : CurrencyEnum.disabled,
      strategyId: strategyId
    };
    this.$applicationService.enableOrDisableStrategy([params]).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.isConvenient = false;
        this.initWorkbenchList();
      } else {
        this.$message.error(result.msg);
      }
    });
  }, 500, {leading: false, trailing: true});
  // ??????id??????
  private equipmentIds: Array<string> = [];
  // ??????id??????
  private loopIds: Array<string> = [];
  private areaIds: string[] = [];

  constructor(
    // ??????
    private $router: Router,
    // ??????
    private $message: FiLinkModalService,
    // ????????????
    private $facilityService: FacilityForCommonService,
    // ???????????????
    private $nzI18n: NzI18nService,
    // ????????????
    private $applicationService: ApplicationService,
    private $applicationSystemForCommonService: ApplicationSystemForCommonService,
    // ??????????????????
    private $facilityCommonService: FacilityForCommonService,
  ) {
    // ?????????
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.online);
    // ?????????????????????
    this.languageTable = this.$nzI18n.getLocaleData(LanguageEnum.application);
  }

  /**
   * ?????????
   */
  public ngOnInit(): void {
    // ??????????????????
    this.defaultQuery();
    // ???????????????
    this.initWorkbenchList();
    // ???????????????
    this.initCharts();
    // ?????????????????????
    this.getControlEquipmentCount();
    // ???????????????
    this.queryDeviceFunctionPole();
    // ?????????????????????
    this.initTableConfig();
    // ?????????????????????
    this.initLoopTableConfig();
    // ?????????????????????
    this.initGroupTableConfig();
    this.openRole = !SessionUtil.checkHasRole(this.lightTableEnum.primaryOpenKey);
    this.closeRole = !SessionUtil.checkHasRole(this.lightTableEnum.primaryShutKey);
    this.sliderRole = !SessionUtil.checkHasRole(this.lightTableEnum.primaryLightKey);
  }

  /**
   * ????????????
   */
  public defaultQuery(): void {
    // ??????????????????????????????
    this.electricityDate = SelectDataConfig.selectData(this.languageTable);
    // ???????????????????????????
    this.lightRateList = SelectDataConfig.lightingRateData(this.languageTable);
    // ????????????????????????
    this.workOrderList = SelectDataConfig.workOrderData(this.languageTable);
    // ????????????6?????????
    this.queryCondition.pageCondition.pageSize = PageOperationEnum.pageSize;
    // ????????????5?????????
    this.equipmentQueryCondition.pageCondition.pageSize = PageOperationEnum.tablePageSize;
    // // ????????????5?????????
    this.groupQueryCondition.pageCondition.pageSize = PageOperationEnum.tablePageSize;
    // // ????????????5?????????
    this.loopQueryCondition.pageCondition.pageSize = PageOperationEnum.tablePageSize;
  }

  /**
   * ??????????????????
   * @ param event
   */
  public equipmentPageChange(event: PageModel): void {
    this.equipmentQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.equipmentQueryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * ??????????????????
   * @ param event
   */
  public groupPageChange(event: PageModel): void {
    this.groupQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.groupQueryCondition.pageCondition.pageSize = event.pageSize;
    this.refGroupList();
  }

  /**
   * ??????????????????
   * @ param event
   */
  public loopPageChange(event: PageModel): void {
    this.loopQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.loopQueryCondition.pageCondition.pageSize = event.pageSize;
    this.refLoopList();
  }

  /**
   * ????????????
   * @ param event
   */
  public handlePage(type: string): void {
    const pageNum = this.pageBean.pageIndex;
    // ?????????
    if (type === VideoControlEnum.prev) {
      if (pageNum > PageOperationEnum.pageNum) {
        this.queryCondition.pageCondition.pageNum = pageNum - 1;
      } else {
        return;
      }
    } else { // ?????????
      if (this.totalPage > pageNum) {
        this.queryCondition.pageCondition.pageNum = pageNum + 1;
      } else {
        return;
      }
    }
    this.initWorkbenchList();
  }

  /**
   * ???????????????
   */
  public switchChange(strategyStatus: boolean, strategyId: string, i: number): void {
    if (!SessionUtil.checkHasRole(this.lightPolicyEnum.primaryEnableKey)) {
      this.$message.warning(this.languageTable.frequentlyUsed.notPermission);
      this.dataSet[i].strategyStatus = true;
      return;
    }
    if (event) {
      event.stopPropagation();
    }
    this.dataSet[i].strategyStatus = !strategyStatus;
    this.buttonDebounce(this.dataSet[i].strategyStatus, strategyId);
  }

  /**
   * ????????????
   * @ param data
   */
  public handleConvenientChange(data: PolicyControlModel): void {
    if (!SessionUtil.checkHasRole(this.lightTableEnum.primaryLightKey)) {
      this.$message.warning(this.languageTable.frequentlyUsed.notPermission);
      this.convenientVal = 0;
      return;
    }
    const params = {
      strategyId: data.strategyId,
      commandId: ControlInstructEnum.dimming,
      param: {
        lightnessNum: this.convenientVal
      }
    };
    this.$applicationService.strategyInstructDistribute(params).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        this.$message.success(`${this.languageTable.contentList.distribution}!`);
      } else {
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * ???????????????
   */
  public onEnableStrategyDetail(): void {
    if (this.radioValue) {
      if (!SessionUtil.checkHasRole(this.lightTableEnum.primaryOpenKey)) {
        this.$message.warning(this.languageTable.frequentlyUsed.notPermission);
        this.radioValue = null;
        return;
      }
    } else {
      if (!SessionUtil.checkHasRole(this.lightTableEnum.primaryShutKey)) {
        this.$message.warning(this.languageTable.frequentlyUsed.notPermission);
        this.radioValue = null;
        return;
      }
    }
    const parameter = {
      strategyId: this.convenientData.strategyId,
      commandId: this.radioValue ? ControlInstructEnum.turnOn : ControlInstructEnum.turnOff,
      param: {}
    };
    this.isEnableStrategy = true;
    this.$applicationService.strategyInstructDistribute(parameter).subscribe((res: ResultModel<string>) => {
      if (res.code === ResultCodeEnum.success) {
        this.$message.success(this.languageTable.frequentlyUsed.commandSuccessful);
      } else {
        this.$message.error(this.languageTable.frequentlyUsed.failedCommand);
      }
      this.isEnableStrategy = false;
    });
  }

  /**
   * ???????????????
   *
   */
  public handleChange(event): void {
    this.lightingRateNumber = event;
    if (this.areaIds.length > 0) {
      this.getLightingRateStatisticsData(event);
    } else {
      // ???????????????
      this.getAllArea().then(() => {
        this.getLightingRateStatisticsData(this.lightingRateNumber);
      });
    }
  }

  /**
   * ???????????????????????????/30???/7???
   *
   */
  public handleChangeWorkOrder(event): void {
    this.workOrderQueryType = event;
    this.findApplyStatisticsByCondition(event);
  }

  /**
   * ???????????????????????????
   */
  public getControlEquipmentCount(): void {
    this.$facilityService.equipmentCount().subscribe((result: ResultModel<EquipmentStatisticsModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        result.data.forEach(item => {
          if (item.equipmentType === EquipmentTypeEnum.singleLightController) {
            this.equipmentCountList.singleControllerCount = item.equipmentNum;
          }
          if (item.equipmentType === EquipmentTypeEnum.centralController) {
            this.equipmentCountList.centralControllerCount = item.equipmentNum;
          }
        });
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * ???????????????
   */
  public queryDeviceFunctionPole(): void {
    this.$facilityService.queryDeviceTypeCount().subscribe((result: ResultModel<Array<DeviceTypeCountModel>>) => {
      if (result.code === ResultCodeEnum.success) {
        const temp = result.data.find(item => item.deviceType === DeviceTypeEnum.wisdom);
        if (temp) {
          this.multiFunctionPoleCount = temp.deviceNum;
        }
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * ????????????
   */
  public getStatisticsAlarmLevel(): void {
    const filterConditions = new FilterCondition(PolicyEnum.alarmSourceTypeId, OperatorEnum.in, FilterValueConst.lightingFilter);
    const params = {
      statisticsType: StrategyStatusEnum.centralizedControl,
      filterConditions: [filterConditions]
    };
    this.$applicationService.getStatisticsEquipmentAlarmLevel(params).subscribe((result: ResultModel<Object>) => {
      if (result.code === 0) {
        if (result.data && Object.keys(result.data).length) {
          this.isAlarmStatistics = false;
          this.emergencyData = ChartsConfig.emergency(result.data, this.$nzI18n);
        } else {
          this.isAlarmStatistics = true;
        }
      } else {
        this.isAlarmStatistics = true;
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * ????????????
   */
  public initWorkbenchList(): void {
    const strategyStatus = new FilterCondition(PolicyEnum.strategyStatus, OperatorEnum.like, StrategyStatusEnum.lighting);
    const strategyType = new FilterCondition(PolicyEnum.strategyType, OperatorEnum.like, StrategyStatusEnum.lighting);
    this.queryCondition.filterConditions = this.queryCondition.filterConditions.concat([strategyStatus, strategyType]);
    this.$applicationService.getLightingPolicyList(this.queryCondition).subscribe((result: ResultModel<PolicyControlModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        const {totalCount, pageNum, data, size, totalPage} = result;
        this.dataSet = data;
        this.pageBean.Total = totalCount;
        this.totalPage = totalPage;
        this.pageBean.pageIndex = pageNum;
        this.pageBean.pageSize = size;
        if (this.dataSet.length) {
          this.dataSet.forEach(item => {
            item.execType = execType(this.$nzI18n, item.execType) as ExecTypeEnum;
            item.startEndTime = `${CommonUtil.dateFmt(ApplicationFinalConst.dateTypeDay, new Date(item.effectivePeriodStart))}
        ~${CommonUtil.dateFmt(ApplicationFinalConst.dateTypeDay, new Date(item.effectivePeriodEnd))}`;
            item.strategyStatus = item.strategyStatus === CurrencyEnum.enable;
          });
        } else {
          this.isAvailable = true;
        }
      } else {
        this.$message.error(result.msg);
      }

    });
  }

  /**
   * ???????????????????????????
   */
  public initCharts(): void {
    // ???????????????
    this.getAllArea().then((resolve) => {
      this.getLightingRateStatisticsData(this.lightingRateNumber);
    });
    // ???????????????
    this.getElectConsStatisticsData();
    // ??????????????????
    if (this.isWorkOrderRole) {
      this.findApplyStatisticsByCondition(this.workOrderQueryType);
    }
    // ????????????
    if (this.isAlarmStatisticsRole) {
      this.getStatisticsAlarmLevel();
    }
    // ??????????????????
    this.queryEquipmentStatus();
  }

  /**
   * ???????????????
   */
  public getElectConsStatisticsData(): void {
    let startTime, endTime;
    if (this.dateRange && this.dateRange.length) {
      startTime = new Date(this.dateRange[0]).getTime();
      endTime = new Date(this.dateRange[1]).getTime();
    } else {
      // ???????????????????????????
      startTime = new Date().getTime() - CalculationFileSizeConst.week_time;
      endTime = new Date().getTime();
    }
    const params = {
      dimension: this.electricityNumber,
      startTime: startTime,
      endTime: endTime
    };
    this.$applicationService.getElectConsStatisticsData(params).subscribe((result: ResultModel<ElectricityFmtModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        const {data} = result;
        if (data && data.length) {
          this.isElectricity = false;
          this.electricity = ChartsConfig.electricity(data, this.electricityNumber, this.language);
        } else {
          this.isElectricity = true;
        }
      } else {
        this.isElectricity = true;
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * ????????????????????????????????????
   */
  public handleElectricityChange(event): void {
    this.electricityNumber = event;
    this.getElectConsStatisticsData();
  }

  /**
   * ??????????????????
   * @ param event
   */
  public onDateChange(event: Array<Date>): void {
    this.dateRange = event;
    this.getElectConsStatisticsData();
  }

  /**
   * ???????????????
   * @ param type ?????????
   */
  public getLightingRateStatisticsData(type): void {
    const date = new Date();
    let timeType;
    const time = {
      day: null,
      week: null,
      month: null,
      year: date.getFullYear()
    };
    switch (type) {
      case 1:
        // ??????
        time.week = getISOWeek(date);
        timeType = DateTypeEnum.week;
        break;
      case 2:
        // ??????
        time.month = date.getMonth() + 1;
        timeType = DateTypeEnum.month;
        break;
      case 3:
        // ??????
        timeType = DateTypeEnum.year;
        break;
      default:
        break;
    }
    const params = {
      statisticsType: 'lightingRate',
      equipmentType: EquipmentTypeEnum.singleLightController,
      statisticsScope: StatisticalDimensionEnum.area,
      filterConditions: [new FilterCondition('areaId', OperatorEnum.in, this.areaIds)],
      timeType: timeType,
      time: time
    };
    this.$applicationService.queryReportAnalysisData(params).subscribe((res: ResultModel<any>) => {
      if (res.code === ResultCodeEnum.success) {
        this.isLightingRate = false;
        if (res.data[0].result.length > 0) {
          this.lightingRateData = ChartsConfig.lightingRate(res.data[0].result, type, this.language);
        }
      } else {
        this.isLightingRate = true;
        this.$message.error(res.msg);
      }
    });
  }

  /**
   * ???????????? ??????????????????????????????
   */
  public getAllArea(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.$facilityCommonService.queryAreaList().subscribe((res) => {
        if (res.code === ResultCodeEnum.success) {
          this.areaIds = this.handleAreaData(res.data);
          resolve();
        }
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * ??????????????????id
   * @param data ????????????
   */
  public handleAreaData(data) {
    const areaIds = [];
    data.forEach(item => {
      areaIds.push(item.areaId);
      if (item.children && item.children.length) {
        this.handleAreaData(item.children);
      }
    });
    return areaIds;
  }

  /**
   * ??????????????????
   */
  public queryEquipmentStatus(): void {
    const parameter = {
      equipmentTypes: ['E002', 'E003']
    };
    this.$applicationService.queryEquipmentStatus(parameter).subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        if (result.data && result.data.length) {
          this.isEquipmentStatus = false;
          this.equipmentStatusData = ChartsConfig.equipmentStatus(result.data, this.$nzI18n);
        } else {
          this.isEquipmentStatus = true;
        }
      } else {
        this.isEquipmentStatus = true;
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * ??????????????????
   */
  public findApplyStatisticsByCondition(type: number): void {
    const params = {
      statisticalType: type.toString()
    };
    this.$applicationSystemForCommonService.findApplyStatisticsByCondition(params).subscribe((result: ResultModel<WorkOrderIncreaseModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        if (result.data && result.data.length) {
          this.isWorkOrder = false;
          if (type === 3) {
            result.data.forEach(item => {
              item.formatDate = `${parseInt(item.formatDate, 10)}${this.languageTable.electricityDate.month}`;
            });
          }
          this.workOrderData = ChartsConfig.workOrder(result.data, this.language);
        } else {
          this.isWorkOrder = true;
        }
      } else {
        this.isWorkOrder = true;
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * ???????????????????????????
   */
  public handStrategyDetails(item: PolicyControlModel): void {
    this.$router.navigate([`${RouterJumpConst.lightingDetails}/${item.strategyId}`]).then();
  }

  /**
   * ???????????????????????????
   */
  public handGoPage(): void {
    this.$router.navigate([RouterJumpConst.lightingPolicyControlAdd], {}).then();
  }

  /**
   * ?????????????????????
   */
  public handPolicyPage(): void {
    this.$router.navigate([RouterJumpConst.lightingPolicyControl], {}).then();
  }

  /**
   * ??????????????????
   */
  public handShowConvenient(event: MouseEvent, item: PolicyControlModel, index: number): void {
    if (event) {
      event.stopPropagation();
    }
    this.convenientData = item;
    if (this.dataSet[index].state) {
      this.dataSet[index].state = false;
      this.isConvenient = false;
      return;
    }
    // ?????????  ??????  ?????????????????????
    this.equipmentData = [];
    this.groupData = [];
    this.loopData = [];
    // ???????????????????????????????????????
    this.dataSet.forEach(it => it.state = false);
    this.equipmentQueryCondition.pageCondition.pageNum = 1;
    this.groupQueryCondition.pageCondition.pageNum = 1;
    this.loopQueryCondition.pageCondition.pageNum = 1;
    this.isConvenient = true;
    this.dataSet[index].state = true;
    this.radioValue = null;
    this.$applicationService.getLightingPolicyDetails(item.strategyId).subscribe((result: ResultModel<StrategyListModel>) => {
      if (result.code === ResultCodeEnum.success) {
        this.queryStrategy(result.data);
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * ????????????table?????????????????????????????????id????????????
   * @ param queryCondition ????????????
   * @ param type ????????????????????????
   * @ param ids ?????????id??????
   */
  public defaultTableQuery(queryCondition, type, ids): void {
    const flag = queryCondition.filterConditions.some(item => item.filterField === type);
    if (!flag) {
      const equipmentId = new FilterCondition(type, OperatorEnum.in, ids);
      queryCondition.filterConditions.push(equipmentId);
    } else {
      const equipmentId = new FilterCondition(type, OperatorEnum.in, ids);
      queryCondition.filterConditions.forEach((item, index) => {
        if (item.filterField === type) {
          queryCondition.filterConditions.splice(index, 1, equipmentId);
        }
      });
    }
  }

  /**
   * ??????????????????????????????????????????
   */
  private queryStrategy(data: StrategyListModel): void {
    this.equipmentIds = [];
    this.groupIds = [];
    this.loopIds = [];
    const strategyRefList = listFmt(data.strategyRefList);
    this.equipmentIds = strategyRefList.equipment.map(equipmentItem => equipmentItem.refId);
    this.groupIds = strategyRefList.group.map(groupItem => groupItem.refId);
    this.loopIds = strategyRefList.loop.map(loopItem => loopItem.refId);
    if (this.equipmentIds.length) {
      // ????????????
      this.refreshData();
    } else {
      this.equipmentTableConfig.isLoading = false;
      this.equipmentData = [];
      this.equipmentPageBean = new PageModel(5, 1, 0);
    }
    if (this.groupIds.length) {
      // ????????????
      this.refGroupList();
    } else {
      this.groupTableConfig.isLoading = false;
      this.groupData = [];
      this.groupPageBean = new PageModel(5, 1, 0);
    }
    if (this.loopIds.length) {
      // ????????????
      this.refLoopList();
    } else {
      this.loopTableConfig.isLoading = false;
      this.loopData = [];
      this.loopPageBean = new PageModel(5, 1, 0);
    }
  }

  /**
   * ??????????????????
   */
  private initTableConfig(): void {
    this.equipmentTableConfig = {
      isDraggable: true,
      isLoading: false,
      scroll: {x: '280px', y: '200px'},
      outHeight: 100,
      noAutoHeight: true,
      simplePage: true,
      simplePageTotalShow: true,
      topButtons: [],
      noIndex: true,
      columnConfig: [
        {
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber
        },
        // ????????????
        {
          title: this.languageTable.equipmentTable.equipment,
          key: 'equipmentName',
          width: 300,
          isShowSort: true
        },
      ],
      showSearchExport: false,
      showPagination: true,
      bordered: false,
      showSearch: false,
      operation: [],
      // ??????
      sort: (event: SortCondition) => {
        if (this.equipmentIds.length) {
          this.equipmentQueryCondition.sortCondition.sortField = event.sortField;
          this.equipmentQueryCondition.sortCondition.sortRule = event.sortRule;
          this.refreshData();
        }
      },
    };
  }

  /**
   * ??????????????????
   */
  private refreshData(): void {
    this.equipmentTableConfig.isLoading = true;
    // ?????????????????????id??????
    this.defaultTableQuery(this.equipmentQueryCondition, PolicyEnum.equipmentId, this.equipmentIds);
    this.$applicationService.equipmentListByPage(this.equipmentQueryCondition).subscribe((res: ResultModel<EquipmentListModel[]>) => {
      if (res.code === ResultCodeEnum.success) {
        this.equipmentTableConfig.isLoading = false;
        const {data, totalCount, pageNum, size} = res;
        this.equipmentPageBean.Total = totalCount;
        this.equipmentPageBean.pageIndex = pageNum;
        this.equipmentPageBean.pageSize = size;
        this.equipmentData = data;
      } else {
        this.$message.error(res.msg);
      }

    }, () => {
      this.equipmentTableConfig.isLoading = false;
    });
  }

  /**
   * ??????????????????
   */
  private initGroupTableConfig(): void {
    this.groupTableConfig = {
      primaryKey: '03-1',
      isDraggable: true,
      isLoading: true,
      scroll: {x: '280px', y: '200px'},
      outHeight: 100,
      noIndex: true,
      simplePage: true,
      simplePageTotalShow: true,
      showSearchExport: false,
      columnConfig: [
        {
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber
        },
        // ????????????
        {
          title: this.languageTable.equipmentTable.group,
          key: 'groupName',
          width: 300,
          isShowSort: true
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      leftBottomButtons: [],
      operation: [],
      // ??????
      sort: (event: SortCondition) => {
        if (this.groupIds.length) {
          this.groupQueryCondition.sortCondition.sortField = event.sortField;
          this.groupQueryCondition.sortCondition.sortRule = event.sortRule;
          this.refGroupList();
        }
      },
    };
  }

  /**
   * ??????????????????
   */
  private refGroupList(): void {
    this.groupTableConfig.isLoading = true;
    // ?????????????????????id??????
    this.defaultTableQuery(this.groupQueryCondition, PolicyEnum.groupId, this.groupIds);
    this.$applicationService.queryGroupInfoList(this.groupQueryCondition).subscribe((res: ResultModel<GroupListModel[]>) => {
      if (res.code === ResultCodeEnum.success) {
        this.groupTableConfig.isLoading = false;
        const {data, totalCount, pageNum, size} = res;
        this.groupPageBean.Total = totalCount;
        this.groupPageBean.pageIndex = pageNum;
        this.groupPageBean.pageSize = size;
        this.groupData = data;
      } else {
        this.$message.error(res.msg);
      }

    }, () => {
      this.groupTableConfig.isLoading = false;
    });
  }

  /**
   * ??????????????????
   */
  private initLoopTableConfig(): void {
    this.loopTableConfig = {
      primaryKey: '03-1',
      isDraggable: true,
      isLoading: true,
      simplePage: true,
      simplePageTotalShow: true,
      scroll: {x: '280px', y: '200px'},
      outHeight: 100,
      noIndex: true,
      showSearchExport: false,
      columnConfig: [
        {
          type: 'serial-number',
          width: 62,
          title: this.language.serialNumber
        },
        // ????????????
        {
          title: this.languageTable.equipmentTable.loop,
          key: 'loopName',
          width: 300,
          isShowSort: true
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      leftBottomButtons: [],
      operation: [],
      // ??????
      sort: (event: SortCondition) => {
        if (this.loopIds.length) {
          this.loopQueryCondition.sortCondition.sortField = event.sortField;
          this.loopQueryCondition.sortCondition.sortRule = event.sortRule;
          this.refLoopList();
        }
      },
    };
  }

  /**
   * ??????????????????
   */
  private refLoopList(): void {
    this.loopTableConfig.isLoading = true;
    // ?????????????????????id??????
    this.defaultTableQuery(this.loopQueryCondition, PolicyEnum.loopIds, this.loopIds);
    this.$applicationService.loopListByPage(this.loopQueryCondition).subscribe((res: ResultModel<LoopModel[]>) => {
      if (res.code === ResultCodeEnum.success) {
        this.loopTableConfig.isLoading = false;
        const {data, totalCount, pageNum, size} = res;
        this.loopPageBean.Total = totalCount;
        this.loopPageBean.pageIndex = pageNum;
        this.loopPageBean.pageSize = size;
        this.loopData = data;
      } else {
        this.$message.error(res.msg);
      }

    }, () => {
      this.groupTableConfig.isLoading = false;
    });
  }
}

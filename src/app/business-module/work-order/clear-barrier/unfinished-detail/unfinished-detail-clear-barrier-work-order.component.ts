import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {ActivatedRoute} from '@angular/router';
import {ClearBarrierWorkOrderService} from '../../share/service/clear-barrier';
import {InspectionLanguageInterface} from '../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ClearBarrierWorkOrderModel} from '../../../../core-module/model/work-order/clear-barrier-work-order.model';
import {AlarmLanguageInterface} from '../../../../../assets/i18n/alarm/alarm-language.interface';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {WorkOrderPageTypeEnum} from '../../share/enum/work-order-page-type.enum';
import {WorkOrderDeviceModel} from '../../../../core-module/model/work-order/work-order-device.model';
import {WorkOrderBusinessCommonUtil} from '../../share/util/work-order-business-common.util';
import {FacilitiesTypeEnum, WorkOrderNodeEnum, WorkOrderNodeShineEnum} from '../../share/enum/refAlarm-faultt.enum';
import {InspectionEquipmentInfoModel} from '../../../../core-module/model/work-order/inspection-equipment-info.model';
import {HandleStatusClassEnum, WorkOrderAlarmLevelColor} from '../../../../core-module/enum/trouble/trouble-common.enum';
import {TroubleUtil} from '../../../../core-module/business-util/trouble/trouble-util';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {TroubleModel} from '../../../../core-module/model/trouble/trouble.model';
import {TroubleForCommonService} from '../../../../core-module/api-service/trouble';
import {WorkOrderLanguageInterface} from '../../../../../assets/i18n/work-order/work-order.language.interface';
import {WorkOrderStatusUtil} from '../../../../core-module/business-util/work-order/work-order-for-common.util';
import {AlarmForCommonService} from '../../../../core-module/api-service/alarm';
import {AlarmForCommonUtil} from '../../../../core-module/business-util/alarm/alarm-for-common.util';
import {SiteHandleDataModel} from '../../share/model/clear-barrier-model/site-handle-data.model';
import {AlarmConfirmStatusEnum} from '../../../../core-module/enum/alarm/alarm-confirm-status.enum';
import {AlarmCleanStatusEnum} from '../../../../core-module/enum/alarm/alarm-clean-status.enum';
import {AlarmListModel} from '../../../../core-module/model/alarm/alarm-list.model';
declare const $: any;

/**
 * ????????????????????????
 */
@Component({
  selector: 'app-unfinished-detail',
  templateUrl: './unfinished-detail-clear-barrier-work-order.component.html',
  styleUrls: ['./unfinished-detail-clear-barrier-work-order.component.scss']
})
export class UnfinishedDetailClearBarrierWorkOrderComponent implements OnInit {
  // ????????????-????????????
  @ViewChild('deviceEquipmentTemp') deviceEquipmentTemp: TemplateRef<any>;
  // ?????????
  public inspectionLanguage: InspectionLanguageInterface;
  public alarmLanguage: AlarmLanguageInterface;
  // ?????????????????????
  public  workOrderLanguage: WorkOrderLanguageInterface;
  // ??????title
  public pageTitle: string;
  // ????????????
  public progressSpeed: number = 0;
  // ????????????????????????
  public resultClearBarrierData: ClearBarrierWorkOrderModel = new ClearBarrierWorkOrderModel();
  // ??????????????????
  public resultAlarmData: AlarmListModel = new AlarmListModel();
  // ????????????
  public isShowCount: boolean = false;
  // ??????????????????
  public resultTroubleData: TroubleModel = new TroubleModel();
  // ????????????
  public isFinished: boolean = false;
  // ??????????????????
  public alarmLevelStatus: string;
  // ???????????????????????????
  public alarmLevelColor: string;
  // ??????????????????
  public alarmConfirmStatus: string;
  // ???????????????????????????
  public alarmConfirmColor: string;
  // ??????????????????
  public alarmCleanStatus: string;
  // ???????????????????????????
  public alarmCleanColor: string;
  // ??????????????????????????????
  public isAlarm: boolean = false;
  // ????????????
  public troubleStatus: string;
  // ????????????
  public handleTableConfig: TableConfigModel;
  // ??????????????????
  public siteDataSet: SiteHandleDataModel[] = [];
  // ??????list
  public refEquipmentList: WorkOrderDeviceModel[] = [];
  // ??????
  public refDeviceObject: WorkOrderDeviceModel;
  // ??????????????????
  public isDeviceOrEquip = FacilitiesTypeEnum;
  // ??????id
  private procId: string;
  // ????????????
  private pageType: WorkOrderPageTypeEnum;
  // ??????????????????????????????
  private isShowEvaluate: boolean = true;

  constructor(
    private $nzI18n: NzI18nService,
    private $modelService: NzModalService,
    private $message: FiLinkModalService,
    private $clearBarrierWorkOrderService: ClearBarrierWorkOrderService,
    private $activatedRoute: ActivatedRoute,
    private $alarmService: AlarmForCommonService,
    private $troubleService: TroubleForCommonService,
  ) {}

  /**
   * ???????????????
   */
  public ngOnInit(): void {
    this.inspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.alarmLanguage = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.workOrderLanguage = this.$nzI18n.getLocaleData(LanguageEnum.workOrder);
    this.getPageTitle();
  }

  /**
   * ??????title?????????
   */
  private getPageTitle(): void {
    this.pageTitle = this.workOrderLanguage.orderDetail;
    this.$activatedRoute.queryParams.subscribe(params => {
      this.pageType = params.type;
      // ?????????????????????
      this.procId = params.id;
      if (params.id && this.pageType === WorkOrderPageTypeEnum.unfinished) {
        this.getFromData(params.id);
        this.isFinished = false;
      } else if (this.pageType === WorkOrderPageTypeEnum.finished) {  // ?????????????????????
        this.getFinishedData(params.id);
        this.initSiteTable();
        this.isFinished = true;
      }
    });
  }

  /**
   * ??????
   */
  public goBack(): void {
    window.history.back();
  }

  /**
   * ????????????????????????
   */
  private getFinishedData(id: string): void {
    this.$clearBarrierWorkOrderService.getClearFailureByIdForComplete(id).subscribe((result: ResultModel<ClearBarrierWorkOrderModel>) => {
      if (result.code === ResultCodeEnum.success) {
        this.getDeviceAndEquipmentInfo(result.data);
        this.getEvaluateInfo(result.data);
        this.resultClearBarrierData = result.data;
        this.progressSpeed = this.resultClearBarrierData.progressSpeed;
        // ????????????
        if (result.data.troubleId) {
          this.isAlarm = false;
          this.getTroubleData(this.resultClearBarrierData.troubleId);
        }
        // ????????????
        if (result.data.refAlarm) {
          this.isAlarm = true;
          this.getCurrentAlarmData(this.resultClearBarrierData.refAlarm);
        }
        this.getHandleList();
      }
    });
  }

  /**
   * ???????????????????????????
   */
  private getFromData(id: string): void {
    this.$clearBarrierWorkOrderService.getClearFailureByIdForProcess(id).subscribe((result: ResultModel<ClearBarrierWorkOrderModel>) => {
      if (result.code === ResultCodeEnum.success) {
        this.getDeviceAndEquipmentInfo(result.data);
        this.resultClearBarrierData = result.data;
        // ????????????
        if (result.data.troubleId) {
          this.isAlarm = false;
          this.getTroubleData(this.resultClearBarrierData.troubleId);
        }
        // ????????????
        if (result.data.refAlarm) {
          this.isAlarm = true;
          this.getCurrentAlarmData(this.resultClearBarrierData.refAlarm);
        }
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * ????????????????????????
   */
  private getCurrentAlarmData(id: string): void {
    this.$alarmService.queryCurrentAlarmInfoById(id).subscribe((result: ResultModel<AlarmListModel>) => {
      if (result.code === 0 && result.data) {
        this.getAlarmDeviceAndEquipmentInfo(result.data);
        // ??????????????????
        result.data.alarmContinuedTimeString = CommonUtil.setAlarmContinousTime(result.data.alarmBeginTime, result.data.alarmCleanTime,
          {month: this.alarmLanguage.month, day: this.alarmLanguage.day, hour: this.alarmLanguage.hour});
        this.resultAlarmData = result.data;
        if (this.resultAlarmData.alarmHappenCount) {
          this.resultAlarmData.fontSize = AlarmForCommonUtil.setFontSize(this.resultAlarmData.alarmHappenCount);
        }
        this.isShowCount = true;
        this.initAlarmStatus();
      } else {
        this.getHistoryAlarmData(id);
      }
    });
  }

  /**
   * ????????????????????????
   */
  private getHistoryAlarmData(id: string): void {
    this.$alarmService.queryAlarmHistoryInfo(id).subscribe((result: ResultModel<AlarmListModel>) => {
      if (result.code === 0) {
        this.getAlarmDeviceAndEquipmentInfo(result.data);
        this.resultAlarmData = result.data;
        if (this.resultAlarmData.alarmHappenCount) {
          this.resultAlarmData.fontSize = AlarmForCommonUtil.setFontSize(this.resultAlarmData.alarmHappenCount);
        }
        this.initAlarmStatus();
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * ????????????????????????
   */
  private getTroubleData(id: string): void {
    this.$troubleService.queryTroubleDetail(id).subscribe((result: ResultModel<TroubleModel>) => {
      if (result.code === ResultCodeEnum.success) {
        if (result.data) {
          result.data.equipmentList = this.getTroubleEquipmentObject(result.data.equipment);
          result.data.deviceObject = this.getDeviceObject(result.data.deviceType, true, result.data.deviceName);
          result.data.troubleSource = WorkOrderBusinessCommonUtil.getOrderTroubleSource(this.$nzI18n, result.data.troubleSource);
          this.resultTroubleData = result.data;
          if (!result.data.handleTime || Number(result.data.handleTime) === 0) {
            result.data.handleTime = null;
          }
          this.troubleStatus = HandleStatusClassEnum[this.resultTroubleData.handleStatus];
          this.getAlarmOrTroubleLevel();
        }
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * ??????????????????-???????????????????????????
   */
  private getDeviceAndEquipmentInfo(data: ClearBarrierWorkOrderModel): void {
    data.equipmentList = data.equipment ? this.getEquipmentName(data.equipment) : [];
    data.deviceObject = this.getDeviceObject(data.deviceType, false);
  }

  /**
   * ????????????-???????????????????????????
   */
  private getAlarmDeviceAndEquipmentInfo(data: AlarmListModel): void {
    this.refEquipmentList = data.alarmSourceTypeId ? this.getEquipmentObject([data.alarmSourceTypeId]) : [];
    this.refDeviceObject = this.getDeviceObject(data.alarmDeviceTypeId, false);
  }

  /**
   * ??????????????????-????????????
   */
  private getEvaluateInfo(data: ClearBarrierWorkOrderModel): void {
    if (data.evaluateInfo && data.evaluateInfo.length > 0) {
      data.evaluatePoint = data.evaluateInfo[0].evaluatePoint;
      data.evaluateDetailInfo = data.evaluateInfo[0].evaluateInfo;
      this.isShowEvaluate = true;
    } else {
      data.evaluatePoint = '';
      data.evaluateDetailInfo = '';
      this.isShowEvaluate = false;
    }
  }

  /**
   * ??????????????????
   */
  private getEquipmentObject(list: string[]): WorkOrderDeviceModel[] {
    const equipmentList = [];
    list.forEach((equipmentType) => {
      const equipmentModel = new WorkOrderDeviceModel();
      equipmentModel.name = WorkOrderBusinessCommonUtil.equipTypeNames(this.$nzI18n, equipmentType);
      equipmentModel.picture = CommonUtil.getEquipmentIconClassName(equipmentType);
      equipmentModel.typeName = WorkOrderBusinessCommonUtil.equipTypeNames(this.$nzI18n, equipmentType);
      equipmentList.push(equipmentModel);
    });
    return equipmentList;
  }

  /**
   * ????????????????????????
   */
  private getTroubleEquipmentObject(list: InspectionEquipmentInfoModel[]): WorkOrderDeviceModel[] {
    list = list || [];
    const equipmentList = [];
    list.forEach((equipment) => {
      const equipmentModel = new WorkOrderDeviceModel();
      equipmentModel.name = equipment.equipmentName;
      equipmentModel.picture = CommonUtil.getEquipmentIconClassName(equipment.equipmentType);
      equipmentModel.typeName = WorkOrderBusinessCommonUtil.equipTypeNames(this.$nzI18n, equipment.equipmentType);
      equipmentList.push(equipmentModel);
    });
    return equipmentList;
  }

  /**
   * ??????????????????
   */
  private getEquipmentName(list: InspectionEquipmentInfoModel[]): WorkOrderDeviceModel[] {
    const equipmentList = [];
    list.forEach((equipment) => {
      const equipmentModel = new WorkOrderDeviceModel();
      equipmentModel.name = equipment.equipmentName ;
      equipmentModel.picture = CommonUtil.getEquipmentIconClassName(equipment.equipmentType);
      equipmentModel.typeName = WorkOrderBusinessCommonUtil.equipTypeNames(this.$nzI18n, equipment.equipmentType);
      if (equipmentModel.name && equipmentModel.name.length > 0) {
        equipmentList.push(equipmentModel);
      }
    });
    return equipmentList;
  }

  /**
   * ??????????????????
   */
  private getDeviceObject(code: string, isDevice: boolean, deviceName?: string): WorkOrderDeviceModel {
    const deviceModel = new WorkOrderDeviceModel();
    deviceModel.name = isDevice ?  deviceName : WorkOrderBusinessCommonUtil.deviceTypeNames(this.$nzI18n, code);
    if (!deviceModel.name || deviceModel.name.length === 0) {
      deviceModel.picture = '';
    } else {
      deviceModel.picture = CommonUtil.getFacilityIconClassName(code);
      deviceModel.typeName = WorkOrderBusinessCommonUtil.deviceTypeNames(this.$nzI18n, code);
    }
    return deviceModel;
  }

  /**
   * ???????????????????????????
   */
  private initAlarmStatus(): void {
    // ????????????
    this.getAlarmOrTroubleLevel();
    // ??????????????????
    this.getAlarmCleanStatus();
    // ??????????????????
    this.getAlarmConfirmStatus();
  }

  /**
   * ????????????/??????????????????
   */
  public judgeAlarmOrTroubleType(): string {
    return  this.resultClearBarrierData.refAlarm ? this.workOrderLanguage.refAlarm : this.workOrderLanguage.relevancyFault;
  }

  /**
   * ????????????/??????????????????
   */
  public judgeAlarmOrTroubleName(): string {
    return  this.resultClearBarrierData.refAlarm ? this.resultClearBarrierData.refAlarmName : this.resultClearBarrierData.troubleName;
  }

  /**
   * ?????????????????????????????????????????????
   */
  public getEvaluatePicture(): string {
    const star =  Math.floor(Number(this.resultClearBarrierData.evaluatePoint) / 20);
    return WorkOrderBusinessCommonUtil.getAlarmEvaluate(star.toString());
  }

  /**
   * ????????????????????????????????????:
   * 1.??????????????????1???3?????????
   * 2.??????????????????1???3?????????
   * 3.??????????????????3?????????
   */
  public getRemainDaysPicture(): string {
    if (this.resultClearBarrierData.lastDays < 1) {
      return  WorkOrderBusinessCommonUtil.getAlarmRemainDays('1');
    } else if (this.resultClearBarrierData.lastDays > 1 && this.resultClearBarrierData.lastDays < 3) {
      return  WorkOrderBusinessCommonUtil.getAlarmRemainDays('2');
    } else {
      return  WorkOrderBusinessCommonUtil.getAlarmRemainDays('3');
    }
  }

  /**
   * ??????/????????????
   */
  private getAlarmOrTroubleLevel(): void {
    this.alarmLevelStatus = this.alarmLanguage[TroubleUtil.getColorName(this.isAlarm ? this.resultAlarmData.alarmFixedLevel : this.resultTroubleData.troubleLevel, WorkOrderAlarmLevelColor)];
    this.alarmLevelColor = TroubleUtil.getColorName(this.isAlarm ? this.resultAlarmData.alarmFixedLevel : this.resultTroubleData.troubleLevel, WorkOrderAlarmLevelColor);
  }

  /**
   * ??????????????????
   */
  private getAlarmCleanStatus(): void {
    this.alarmCleanStatus = this.alarmLanguage[TroubleUtil.getColorName(this.resultAlarmData.alarmCleanStatus, AlarmCleanStatusEnum)];
    this.alarmCleanColor = TroubleUtil.getColorName(this.resultAlarmData.alarmCleanStatus, AlarmCleanStatusEnum);
  }

  /**
   * ??????????????????
   */
  private getAlarmConfirmStatus(): void {
    this.alarmConfirmStatus = this.alarmLanguage[TroubleUtil.getColorName(this.resultAlarmData.alarmConfirmStatus, AlarmConfirmStatusEnum)];
    this.alarmConfirmColor = TroubleUtil.getColorName(this.resultAlarmData.alarmConfirmStatus, AlarmConfirmStatusEnum);
  }

  /**
   *  ??????????????????
   */
  public getWorkOrderStatus(): string {
    return WorkOrderStatusUtil.getWorkOrderIconClassName(this.resultClearBarrierData.status);
  }

  /**
   *  ????????????????????????
   *  done:????????? undone??????????????????????????????????????????
   */
  public getTroubleNode(nodeId: string): string {
    if (this.resultTroubleData.handleStatus === 'done' || this.resultTroubleData.handleStatus === 'undone') {
      return this.inspectionLanguage[this.resultTroubleData.handleStatus];
    }
    for (const key in WorkOrderNodeEnum) {
        if (key && WorkOrderNodeEnum[key] === nodeId) {
            return WorkOrderNodeShineEnum[key];
        }
    }
  }

  /**
   * ????????????/????????????/????????????Text
   */
  public getClearBarrierReasonText(row: number): string {
    // ????????????/????????????
    if (row === 1) {
      return this.isFinished ? this.inspectionLanguage.feeInformation : this.inspectionLanguage.retreatSingleReason;
    } else {          // ????????????/????????????
      return this.isFinished ? this.inspectionLanguage.retreatSingleReason : this.inspectionLanguage.reasonsForTransfer;
    }
  }

  /**
   *  ????????????/????????????/????????????Content
   */
  public getClearBarrierReasonContent(row: number): string {
    // ????????????/????????????
    if (row === 1) {
      return this.isFinished ? this.resultClearBarrierData.cost : this.resultClearBarrierData.concatSingleBackReason;
    } else {        // ????????????/????????????
      return this.isFinished ? this.resultClearBarrierData.concatSingleBackReason : this.resultClearBarrierData.turnReason;
    }
  }

  /**
   * ????????????????????????
   */
  private getHandleList(): void {
    this.$clearBarrierWorkOrderService.getSiteList(this.procId).subscribe((result: ResultModel<SiteHandleDataModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        const list = result.data || [];
        list.forEach(item => {
          if (item.type === FacilitiesTypeEnum.idDevice && item.typeName) {
            // ??????
            item.deviceTypeName = WorkOrderBusinessCommonUtil.deviceTypeNames(this.$nzI18n, item.typeName);
            if (item.deviceTypeName) {
              item.deviceClass = CommonUtil.getFacilityIconClassName(item.typeName);
            } else {
              item.deviceClass = '';
            }
          } else if (item.type === FacilitiesTypeEnum.isEquip && item.typeName) {
            // ??????
            item.equipmentTypeList = [];
            item.equipmentTypeName = '';
            const names = [];
            const arr = item.typeName.split(',');
            for (let k = 0; k < arr.length; k++) {
              const name = WorkOrderBusinessCommonUtil.equipTypeNames(this.$nzI18n, arr[k]);
              if (name && name.length > 0) {
                item.equipmentTypeList.push({
                  key: CommonUtil.getEquipmentIconClassName(arr[k]),
                  label: name
                });
                names.push(name);
              }
            }
            item.equipmentTypeName = names.join(',');
          }
        });
        this.siteDataSet = result.data;
      }
    });
  }
  /**
   * ??????
   */
  private initSiteTable(): void {
    const width = ($('.work-order-detail').width() - 100) / 4;
    this.handleTableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: false,
      showRowSelection: false,
      showSizeChanger: false,
      showSearchExport: false,
      notShowPrint: false,
      simplePage: false,
      scroll: {x: '1600px', y: '305px'},
      columnConfig: [
        {// ????????????
          title: this.workOrderLanguage.objectName,
          key: 'objectName', width: width,
        },
        {// ??????/????????????
          title: this.workOrderLanguage.deviceEquip,
          key: 'deviceEquip', width: width,
          type: 'render',
          renderTemplate: this.deviceEquipmentTemp,
        },
        {// ????????????
          title: this.workOrderLanguage.errorReason,
          key: 'troubleReason', width: width,
        },
        {// ????????????
          title: this.workOrderLanguage.processingScheme,
          key: 'processingScheme', width: width,
        },
      ],
      showPagination: false,
      bordered: false,
      showSearch: false,
      topButtons: [],
      operation: [],
      sort: (event) => {},
      openTableSearch: (event) => {},
      handleSearch: (event) => {}
    };
  }

}

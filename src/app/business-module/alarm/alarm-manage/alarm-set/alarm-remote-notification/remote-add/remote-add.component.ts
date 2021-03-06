import {Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import {FormItem} from '../../../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../../../shared-module/component/form/form-operate.service';
import {NzI18nService} from 'ng-zorro-antd';
import {AlarmLanguageInterface} from '../../../../../../../assets/i18n/alarm/alarm-language.interface';
import {FacilityLanguageInterface} from '../../../../../../../assets/i18n/facility/facility.language.interface';
import {ActivatedRoute, Router} from '@angular/router';
import {PageModel} from '../../../../../../shared-module/model/page.model';
import {FiLinkModalService} from '../../../../../../shared-module/service/filink-modal/filink-modal.service';
import {FilterCondition, QueryConditionModel} from '../../../../../../shared-module/model/query-condition.model';
import {AlarmService} from '../../../../share/service/alarm.service';
import {TableComponent} from '../../../../../../shared-module/component/table/table.component';
import {TableConfigModel} from '../../../../../../shared-module/model/table-config.model';
import {RuleUtil} from '../../../../../../shared-module/util/rule-util';
import {
  AlarmSelectorConfigModel,
  AlarmSelectorInitialValueModel,
} from '../../../../../../shared-module/model/alarm-selector-config.model';
import {CommonUtil} from '../../../../../../shared-module/util/common-util';
import {ResultCodeEnum} from '../../../../../../shared-module/enum/result-code.enum';
import {ResultModel} from '../../../../../../shared-module/model/result.model';
import {EquipmentListModel} from '../../../../../../core-module/model/equipment/equipment-list.model';
import {LanguageEnum} from '../../../../../../shared-module/enum/language.enum';
import {CommonLanguageInterface} from '../../../../../../../assets/i18n/common/common.language.interface';
import {AlarmEnableStatusEnum, LinkageEnum} from '../../../../share/enum/alarm.enum';
import * as RemoteAddUtil from '../../../../share/util/remote-add-util';
import {
  BusinessStatusEnum,
  EquipmentStatusEnum,
  EquipmentTypeEnum,
} from '../../../../../../core-module/enum/equipment/equipment.enum';
import {OperateTypeEnum} from '../../../../../../shared-module/enum/page-operate-type.enum';
import {FacilityForCommonUtil} from '../../../../../../core-module/business-util/facility/facility-for-common.util';
import {AlarmForCommonUtil} from '../../../../../../core-module/business-util/alarm/alarm-for-common.util';
import {FacilityListModel} from '../../../../../../core-module/model/facility/facility-list.model';
import {DeviceStatusEnum, DeviceTypeEnum} from '../../../../../../core-module/enum/facility/facility.enum';
import {OperatorEnum} from '../../../../../../shared-module/enum/operator.enum';
import {SelectModel} from '../../../../../../shared-module/model/select.model';
import {AlarmRemoteModel} from '../../../../share/model/alarm-remote.model';
import {AlarmRemoteAreaModel} from '../../../../share/model/alarm-remote-area.model';
import {AlarmSelectorConfigTypeEnum} from '../../../../../../shared-module/enum/alarm-selector-config-type.enum';
import {AlarmNotifierRequestModel} from '../../../../../../core-module/model/alarm/alarm-notifier-request.model';
import {AlarmEquipmentTypeModel} from '../../../../share/model/alarm-equipment-type.model';
import {AlarmUtil} from '../../../../share/util/alarm.util';
import {AreaModel} from '../../../../../../core-module/model/facility/area.model';

/**
 * ????????????-?????????????????? ?????????????????????
 */
@Component({
  selector: 'app-remote-add',
  templateUrl: './remote-add.component.html',
  styleUrls: ['./remote-add.component.scss'],
})
export class RemoteAddComponent implements OnInit {
  // ??????????????????
  @ViewChild('isNoStartUsing') private isNoStartUsing;
  // ?????????
  @ViewChild('notifierTemp') notifierTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('alarmFixedLevelListTemp') alarmFixedLevelListTemp: TemplateRef<any>;
  // ??????
  @ViewChild('areaSelector') private areaSelector;
  // ??????????????????
  @ViewChild('deviceTypeTemp') private deviceTypeTemp;
  // ????????????
  @ViewChild('deviceEquipmentTemp') private deviceEquipmentTemp;
  // ????????????
  @ViewChild('deviceComponent') private deviceComponent: TableComponent;
  // ????????????
  @ViewChild('equipmentComponent') private equipmentComponent: TableComponent;
  // ??????????????????
  @ViewChild('equipmentTypeTemp') private equipmentTypeTemp: TemplateRef<any>;
  // ????????????????????????
  @ViewChild('deviceType') private deviceType: TemplateRef<any>;
  // ????????????
  @ViewChild('deviceStatus') private deviceStatus: TemplateRef<any>;
  // ????????????????????????
  @ViewChild('equipmentType') private equipmentType: TemplateRef<any>;
  // ????????????
  @ViewChild('equipmentStatus') private equipmentStatus: TemplateRef<any>;
  // ????????????
  @ViewChild('businessStatusTemplate') private businessStatusTemplate: TemplateRef<any>;
  // ???????????????????????????
  public formColumn: FormItem[] = [];
  // ???????????????????????????
  public formStatus: FormOperate;
  // ????????????
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // ???????????????
  public language: AlarmLanguageInterface;
  // ???????????????
  public facilityLanguage: FacilityLanguageInterface;
  // ???????????????
  public commonLanguage: CommonLanguageInterface;
  // ???????????? ?????? ??????
  public isNoStartData: boolean = true;
  // ?????????????????????
  public isLoading: boolean = false;
  // ????????????
  public areaConfig: AlarmSelectorConfigModel;
  // ????????????
  public display = {
    deviceTypeDisplay: true,
    notifierDis: true,
    equipmentTypeDisplay: true,
    deviceAndEquipmentDis: true,
  };
  // ??????
  public title: string = '';
  // ???????????? ?????????
  public alarmFixedLevelListValue: string[] = [];
  // ???????????? 1 ??????  2 ?????? 3 ?????? 4 ??????
  public alarmFixedLevelList: SelectModel[] = [];
  // ???????????? ?????????
  public deviceTypeListValue: string[] = [];
  // ??????????????????
  public deviceTypeList: SelectModel[] = [];
  // ????????????????????????
  public authorizeDeviceTypeList: SelectModel[] = [];
  // ??????????????????
  public allDeviceTypeList: SelectModel[] = [];
  // ???????????????
  public alarmUserConfig: AlarmSelectorConfigModel;
  // ??????????????????
  public allEquipmentTypeList: SelectModel[] = [];
  // ??????????????????????????????
  public equipmentTypeList: SelectModel[] = [];
  // ????????????????????????????????????
  public authorizeEquipmentTypeList: SelectModel[] = [];
  // ??????????????????
  public equipmentTypeListValue: string[] = [];
  // ?????????????????????
  public languageEnum = LanguageEnum;
  // ??????????????????
  public equipmentStatusEnum = EquipmentStatusEnum;
  // ??????????????????
  public equipmentTypeEnum = EquipmentTypeEnum;
  // ??????????????????
  public deviceStatusEnum = DeviceStatusEnum;
  // ??????????????????
  public deviceTypeEnum = DeviceTypeEnum;
  // ????????????
  public selectedDeviceData: FacilityListModel[] = [];
  // ????????????
  public selectedEquipmentData: EquipmentListModel[] = [];
  /**
   *  ??????????????????
   *  1 deptList ??????
   *  2 deviceTypes ???????????????
   *  */
  public alarmNotifierInitialValue: AlarmNotifierRequestModel = new AlarmNotifierRequestModel();
  // ??????????????????
  public isVisible: boolean = false;
  // ??????????????????
  public deviceEquipmentName: string = '';
  // ????????????
  public deviceData: FacilityListModel[] = [];
  // ????????????
  public devicePageBean: PageModel = new PageModel();
  // ??????????????????
  public deviceTableConfig: TableConfigModel;
  // ????????????
  public deviceQueryCondition: QueryConditionModel = new QueryConditionModel();
  // ????????????
  public equipmentData: EquipmentListModel[] = [];
  // ????????????
  public equipmentPageBean: PageModel = new PageModel();
  // ??????????????????
  public equipmentTableConfig: TableConfigModel;
  // ??????????????????
  public equipmentQueryCondition: QueryConditionModel = new QueryConditionModel();
  // ??????????????????
  public businessStatusEnum = BusinessStatusEnum;
  // ??????
  public ifSpin: boolean = false;
  // ??????????????????
  public isSubmit: boolean;
  // ????????????
  public isShowTable: boolean = true;
  // ????????????
  private pageType: OperateTypeEnum = OperateTypeEnum.add;
  // ??????????????????
  private checkAlarmNotifier: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // ??????id
  private updateParamsId: string;
  // ??????
  private areaList: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // ?????????????????????
  private checkDeviceData: FacilityListModel[] = [];
  // ?????????????????????
  private checkEquipmentData: EquipmentListModel[] = [];
  // ??????????????????
  private alarmRemoteData: AlarmRemoteModel;

  constructor(
    public $nzI18n: NzI18nService,
    public $message: FiLinkModalService,
    public $active: ActivatedRoute,
    public $router: Router,
    public $alarmService: AlarmService,
    private $ruleUtil: RuleUtil,
  ) {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.facilityLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    // ??????????????????
    this.allDeviceTypeList = FacilityForCommonUtil.translateDeviceType(this.$nzI18n);
    // ??????????????????
    this.allEquipmentTypeList = FacilityForCommonUtil.translateEquipmentType(this.$nzI18n);
    // ????????????
    this.alarmFixedLevelList = AlarmForCommonUtil.translateAlarmLevel(this.$nzI18n, null);
  }

  public ngOnInit(): void {
    this.initForm();
    this.pageType = this.$active.snapshot.params.type;
    if (this.pageType === OperateTypeEnum.add) {
      // ??????
      this.title = this.language.remoteNotificationAdd;
      // ??????
      this.initAreaConfig();
      // ?????????
      this.initAlarmUserConfig();
    } else {
      this.ifSpin = true;
      // ??????
      this.title = this.language.remoteNotificationUpdate;
      this.$active.queryParams.subscribe(params => {
        this.updateParamsId = params.id;
        this.getAlarmData(params.id);
      });
    }
    /*// ?????????????????????
    RemoteAddUtil.deviceInitTableConfig(this);
    // ?????????????????????
    RemoteAddUtil.equipmentInitTableConfig(this);*/
  }

  /**
   *  ????????????
   */
  public initAreaConfig(): void {
    const clear = !this.areaList.ids.length;
    this.areaConfig = {
      clear: clear,
      type: AlarmSelectorConfigTypeEnum.form,
      initialValue: this.areaList,
      handledCheckedFun: (event: AlarmSelectorInitialValueModel) => {
        this.areaList = event;
        this.areaGtUnit();
        const areaData = this.areaList.ids.map((item, i) => {
          return {'areaId': item, 'areaCode': this.areaList.areaCode[i]};
        });
        this.formStatus.resetControlData('alarmForwardRuleAreaList', areaData);
        if (this.areaList && this.areaList.ids && this.areaList.ids.length) {
          // ??????????????????
          this.clearLinkage(LinkageEnum.area);
        } else {
          // ?????????????????? ???????????? ???????????? ???
          this.empty();
        }
      },
    };
  }

  /**
   *  ????????????
   */
  public empty(): void {
    this.clearLinkage(LinkageEnum.area);
  }

  /**
   * ??????????????????????????????
   */
  public getDeviceType(): void {
    AlarmUtil.getAreaIdDeviceType(this.$alarmService, this.areaList.ids, this.allDeviceTypeList).then((result: SelectModel[]) => {
      this.authorizeDeviceTypeList = result;
      this.deviceTypeList = this.allDeviceTypeList;
    });
  }

  /**
   * ??????????????????????????????
   */
  public getEquipmentType(): void {
    const body: AlarmEquipmentTypeModel = new AlarmEquipmentTypeModel(this.areaList.areaCode, this.deviceTypeListValue);
    AlarmUtil.getAreaCodeEquipmentType(this.$alarmService, body, this.allEquipmentTypeList).then((result: SelectModel[]) => {
      this.authorizeEquipmentTypeList = result;
      this.equipmentTypeList = this.allEquipmentTypeList;
    });
  }

  /**
   * ??????????????????
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    this.formStatus.group.statusChanges.subscribe(() => {
      this.isSubmit = this.formStatus.getValid();
    });
  }

  /**
   * ????????????
   */
  public onChangeLevel(): void {
    setTimeout(() => {
      if (this.alarmFixedLevelListValue && !this.alarmFixedLevelListValue.length) {
        this.formStatus.resetControlData('alarmForwardRuleLevels', []);
      }
    }, 0);
  }

  /**
   * ????????????????????????????????????
   */
  public changeLevel(): void {
    this.formStatus.resetControlData('alarmForwardRuleLevels', this.alarmFixedLevelListValue.map(item => {
      return {'alarmLevelId': item};
    }));
  }

  /**
   * ????????????
   */
  public onSearchDeviceType(): void {
    setTimeout(() => {
      if (this.deviceTypeListValue && !this.deviceTypeListValue.length) {
        this.formStatus.resetControlData('alarmForwardRuleDeviceTypeList', null);
        this.display.notifierDis = true;
        // ????????????????????????
        this.checkAlarmNotifier = new AlarmSelectorInitialValueModel();
        this.formStatus.resetControlData('alarmForwardRuleUserList', this.checkAlarmNotifier.ids);
        this.initAlarmUserConfig();
      }
      this.display.equipmentTypeDisplay = !(this.deviceTypeListValue && this.deviceTypeListValue.length > 0);
      // ??????????????????
      this.clearLinkage(LinkageEnum.deviceType);
    }, 0);
  }

  /**
   * ????????????
   */
  public changeDeviceType(): void {
    // ??????????????? ?????????
    this.alarmNotifierInitialValue = new AlarmNotifierRequestModel(this.alarmNotifierInitialValue.deptList, this.deviceTypeListValue);
    setTimeout(() => {
      // ????????????????????? ???????????????
      if (this.deviceTypeListValue && this.deviceTypeListValue.length) {
        this.display.notifierDis = false;
        this.formStatus.resetControlData('alarmForwardRuleDeviceTypeList',
          this.deviceTypeListValue.map(deviceTypeId => {
            return {'deviceTypeId': deviceTypeId};
          }));
      } else {
        this.formStatus.resetControlData('alarmForwardRuleDeviceTypeList', null);
        this.display.notifierDis = true;
        // ????????????????????????
        this.checkAlarmNotifier = new AlarmSelectorInitialValueModel();
      }
      this.initAlarmUserConfig();
    }, 0);
  }

  /**
   * ????????????
   */
  public onSearchEquipmentType(): void {
    setTimeout(() => {
      if (this.equipmentTypeListValue && !this.equipmentTypeListValue.length) {
        this.formStatus.resetControlData('alarmForwardRuleEquipmentTypeList', null);
      }
      if (this.equipmentTypeListValue && this.equipmentTypeListValue.length > 0) {
        this.display.deviceAndEquipmentDis = false;
      } else {
        this.display.deviceAndEquipmentDis = true;
      }
      // ??????????????????
      this.clearLinkage();
    }, 0);
  }

  /**
   * ????????????
   */
  public changeEquipmentType(): void {
    setTimeout(() => {
      if (this.equipmentTypeListValue && this.equipmentTypeListValue.length) {
        this.formStatus.resetControlData('alarmForwardRuleEquipmentTypeList',
          this.equipmentTypeListValue.map(equipmentTypeId => {
            return {'equipmentType': equipmentTypeId};
          }));
      } else {
        this.formStatus.resetControlData('alarmForwardRuleEquipmentTypeList', null);
      }
    }, 0);
  }

  /**
   *????????????
   */
  public submit(): void {
    this.isLoading = true;
    const alarmObj: AlarmRemoteModel = this.formStatus.getData();
    alarmObj.ruleName = alarmObj.ruleName.trim();
    alarmObj.remark = alarmObj.remark && alarmObj.remark.trim();
    // ??????????????? ??????????????????
    alarmObj.status = this.isNoStartData ? AlarmEnableStatusEnum.enable : AlarmEnableStatusEnum.disable;
    // ????????????
    alarmObj.alarmForwardRuleDeviceTypeList = this.deviceTypeListValue.map(deviceTypeId => {
      return {'deviceTypeId': deviceTypeId};
    });
    // ????????????
    alarmObj.alarmForwardRuleLevels = this.alarmFixedLevelListValue.map(item => {
      return {'alarmLevelId': item};
    });
    // ????????????
    alarmObj.alarmForwardRuleDeviceList = this.checkDeviceData;
    alarmObj.alarmForwardRuleEquipmentList = this.checkEquipmentData;
    if (alarmObj.alarmForwardRuleDeviceList.length < 1) {
      this.$message.info(this.language.noDevice);
      this.isLoading = false;
      return;
    }
    if (alarmObj.alarmForwardRuleEquipmentList.length < 1) {
      this.$message.info(this.language.noEquipment);
      this.isLoading = false;
      return;
    }
    let requestPath: string = '';
    if (this.pageType === OperateTypeEnum.add) {
      // ??????
      requestPath = 'addAlarmRemote';
    } else {
      // ??????
      alarmObj.id = this.updateParamsId;
      requestPath = 'updateAlarmRemarkList';
    }
    this.$alarmService[requestPath](alarmObj).subscribe((res: ResultModel<string>) => {
      this.isLoading = false;
      if (res && res.code === 0) {
        this.$message.success(res.msg);
        this.$router.navigate(['business/alarm/alarm-remote-notification']).then();
      }
    }, err => {
      this.isLoading = false;
    });
  }

  /**
   * ????????????????????????
   */
  public cancel(): void {
    this.$router.navigate(['business/alarm/alarm-remote-notification']).then();
  }

  /**
   * ????????????
   */
  public showDeviceEquipmentTemp(): void {
    this.isVisible = true;
    this.deviceQueryCondition = new QueryConditionModel();
    this.equipmentQueryCondition = new QueryConditionModel();
    this.isShowTable = false;
    setTimeout(() => {
      this.isShowTable = true;
      // ?????????????????????
      RemoteAddUtil.deviceInitTableConfig(this);
      // ?????????????????????
      RemoteAddUtil.equipmentInitTableConfig(this);
      this.getDeviceData();
      this.getEquipmentData();
    }, 5);
  }

  /**
   * ????????????????????????
   */
  public close(): void {
    this.isVisible = false;
  }

  /**
   * ??????????????????
   */
  public devicePageChange(event: PageModel): void {
    this.deviceQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.deviceQueryCondition.pageCondition.pageSize = event.pageSize;
    this.getDeviceData();
  }

  /**
   * ??????????????????
   */
  public equipmentPageChange(event: PageModel): void {
    this.equipmentQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.equipmentQueryCondition.pageCondition.pageSize = event.pageSize;
    this.getEquipmentData();
  }

  /**
   * ??????????????????
   */
  public sureClick(): void {
    const deviceData = this.checkDeviceData;
    const equipmentData = this.checkEquipmentData;
    const resultData = [];
    if (deviceData && deviceData.length > 0) {
      deviceData.forEach(item => {
        resultData.push(item.deviceName);
      });
    }
    if (equipmentData && equipmentData.length > 0) {
      equipmentData.forEach(item => {
        resultData.push(item.equipmentName);
      });
    }
    // ????????????
    this.deviceEquipmentName = resultData.join(',');
    this.isVisible = false;
    this.formStatus.resetControlData('deviceEquipment', this.deviceEquipmentName);
  }

  /**
   * ??????????????????
   */
  public cancelModal(): void {
    this.deviceQueryCondition.filterConditions = [];
    this.isVisible = false;
  }

  /**
   * ??????????????????
   */
  public clearSelectData(): void {
    this.checkDeviceData = [];
    this.checkEquipmentData = [];
    this.selectedDeviceData = [];
    this.selectedEquipmentData = [];
    this.deviceEquipmentName = '';
    this.formStatus.resetControlData('deviceEquipment', '');
    this.isShowTable = false;
    setTimeout(() => {
      this.isShowTable = true;
      // ?????????????????????
      RemoteAddUtil.deviceInitTableConfig(this);
      // ?????????????????????
      RemoteAddUtil.equipmentInitTableConfig(this);
      this.getDeviceData();
      this.getEquipmentData();
    }, 5);
  }

  /**
   * ?????????????????????
   */
  public showAuthorizeDevices(): void {
    this.deviceTypeList = this.authorizeDeviceTypeList;
  }

  /**
   * ?????????????????????
   */
  public showAuthorizeEquipment(): void {
    this.equipmentTypeList = this.authorizeEquipmentTypeList;
  }

  /**
   * ??????
   */
  private initForm(): void {
    this.formColumn = [
      {
        label: this.language.name,
        key: 'ruleName',
        type: 'input',
        require: true,
        rule: [
          {required: true},
          {maxLength: 32},
          RuleUtil.getNamePatternRule(this.commonLanguage.namePattenMsg),
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
      {
        // ??????
        label: this.language.area,
        key: 'alarmForwardRuleAreaList', type: 'custom',
        template: this.areaSelector,
        require: true,
        rule: [{required: true}], asyncRules: [],
      },
      {
        // ????????????
        label: this.language.alarmSourceType, key: 'alarmForwardRuleDeviceTypeList',
        type: 'custom',
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        template: this.deviceTypeTemp,
      },
      {
        // ????????????
        label: this.language.equipmentType, key: 'alarmForwardRuleEquipmentTypeList',
        type: 'custom',
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        template: this.equipmentTypeTemp,
      },
      {
        // ????????????
        label: this.language.deviceEquipment,
        key: 'deviceEquipment',
        type: 'custom',
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        template: this.deviceEquipmentTemp,
      },
      {
        // ?????????
        label: this.language.notifier,
        key: 'alarmForwardRuleUserList',
        type: 'custom',
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        template: this.notifierTemp,
      },
      {
        // ????????????
        label: this.language.alarmFixedLevel,
        key: 'alarmForwardRuleLevels',
        type: 'custom',
        require: true,
        rule: [{required: true}], asyncRules: [],
        template: this.alarmFixedLevelListTemp,
      },
      {
        // ????????????
        label: this.language.openStatus,
        key: 'status',
        type: 'custom',
        template: this.isNoStartUsing,
        initialValue: this.isNoStartData,
        require: true,
        rule: [{required: true}],
        asyncRules: [],
        radioInfo: {
          type: 'select', selectInfo: [
            {label: this.language.disable, value: AlarmEnableStatusEnum.disable},
            {label: this.language.enable, value: AlarmEnableStatusEnum.enable},
          ],
        },
      },
      {
        label: this.language.remark,
        key: 'remark',
        type: 'input',
        rule: [
          this.$ruleUtil.getRemarkMaxLengthRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      },
    ];
  }

  /**
   * ??????????????????
   */
  private getDeviceData(): void {
    this.deviceTableConfig.isLoading = true;
    // ????????????????????????
    const filterData = new FilterCondition('deviceType', OperatorEnum.in, this.deviceTypeListValue);
    // ??????????????????
    const areaFilterData = new FilterCondition('areaId', OperatorEnum.in, this.areaList.ids);
    // ?????????????????????????????????
    const obj = this.deviceQueryCondition.filterConditions.find(v => {
      return v.filterField === 'deviceType';
    });
    if (!obj) {
      this.deviceQueryCondition.filterConditions.push(filterData);
    }
    this.deviceQueryCondition.filterConditions.push(areaFilterData);
    // ??????????????????
    this.$alarmService.queryDevice(this.deviceQueryCondition).subscribe((res: ResultModel<FacilityListModel[]>) => {
      if (res.code === ResultCodeEnum.success) {
        this.devicePageBean.Total = res.totalCount;
        this.devicePageBean.pageIndex = res.pageNum;
        this.devicePageBean.pageSize = res.size;
        this.deviceData = res.data || [];
        this.deviceTableConfig.isLoading = false;
        this.deviceData.forEach(item => {
          item.iconClass = CommonUtil.getFacilityIconClassName(item.deviceType);
          item.deviceStatusIconClass = CommonUtil.getDeviceStatusIconClass(item.deviceStatus).iconClass;
          item.deviceStatusColorClass = CommonUtil.getDeviceStatusIconClass(item.deviceStatus).colorClass;
        });
      }
    }, () => {
      this.deviceTableConfig.isLoading = false;
    });
  }

  /**
   * ??????????????????
   */
  private getEquipmentData(): void {
    this.equipmentTableConfig.isLoading = true;
    // ????????????????????????
    const filterData = new FilterCondition('equipmentType', OperatorEnum.in, this.equipmentTypeListValue);
    // ??????????????????
    const areaFilterData = new FilterCondition('areaId', OperatorEnum.in, this.areaList.ids);
    // ??????????????????????????????
    const obj = this.equipmentQueryCondition.filterConditions.find(v => {
      return v.filterField === 'equipmentType';
    });
    if (!obj) {
      this.equipmentQueryCondition.filterConditions.push(filterData);
    }
    this.equipmentQueryCondition.filterConditions.push(areaFilterData);
    this.$alarmService.queryEquipment(this.equipmentQueryCondition).subscribe((res: ResultModel<EquipmentListModel[]>) => {
      if (res.code === ResultCodeEnum.success) {
        this.equipmentPageBean.Total = res.totalCount;
        this.equipmentPageBean.pageIndex = res.pageNum;
        this.equipmentPageBean.pageSize = res.size;
        this.equipmentData = res.data || [];
        this.equipmentData.forEach(item => {
          item.iconClass = CommonUtil.getEquipmentIconClassName(item.equipmentType);
          item.areaName = item.areaInfo ? item.areaInfo.areaName : '';
          // ??????????????????
          const iconStyle = CommonUtil.getEquipmentStatusIconClass(item.equipmentStatus, 'list');
          item.statusIconClass = iconStyle.iconClass;
          item.statusColorClass = iconStyle.colorClass;
          item.deviceName = item.deviceInfo ? item.deviceInfo.deviceName : '';
        });
        this.equipmentTableConfig.isLoading = false;
      }
    }, () => {
      this.equipmentTableConfig.isLoading = false;
    });
  }

  /**
   *  ???????????????
   */
  private initAlarmUserConfig(): void {
    const clear = !this.checkAlarmNotifier.ids.length;
    this.alarmUserConfig = {
      type: AlarmSelectorConfigTypeEnum.form,
      clear: clear,
      disabled: this.display.notifierDis,
      condition: this.alarmNotifierInitialValue,
      initialValue: this.checkAlarmNotifier,
      handledCheckedFun: (event) => {
        this.checkAlarmNotifier = event;
        this.formStatus.resetControlData('alarmForwardRuleUserList', this.checkAlarmNotifier.ids);
      },
    };
  }

  /**
   * ??????????????????????????????
   */
  private getAlarmData(id: string): void {
    this.ifSpin = true;
    this.$alarmService.queryAlarmRemoteById(id).subscribe((res: ResultModel<AlarmRemoteModel>) => {
      if (res.code === 0) {
        const resultData = [];
        const areaIds = [];
        const alarmData = res.data[0];
        this.selectedDeviceData = alarmData.alarmForwardRuleDeviceList;
        this.selectedEquipmentData = alarmData.alarmForwardRuleEquipmentList;
        this.display = {
          deviceTypeDisplay: false,
          notifierDis: false,
          equipmentTypeDisplay: false,
          deviceAndEquipmentDis: false,
        };
        // ??????
        if (alarmData.alarmForwardRuleAreaList && alarmData.alarmForwardRuleAreaList.length) {
          this.areaList = {
            ids: alarmData.alarmForwardRuleAreaList.map(area => area.areaId),
            name: '',
            areaCode: alarmData.alarmForwardRuleAreaList.map(area => area.areaCode),
          };
          // ????????????????????????
          this.areaGtUnit();
          // ??????????????????????????????
          this.getDeviceType();
        }
        // ?????????????????????id
        alarmData.alarmForwardRuleAreaList.forEach(item => {
          if (areaIds.indexOf(item.areaId) === -1) {
            areaIds.push(item.areaId);
          }
        });
        alarmData.alarmForwardRuleAreaName = [];
        // ??????AreaID??????AreaName
        AlarmUtil.getAreaName(this.$alarmService, areaIds).then((result: AreaModel[]) => {
          AlarmUtil.joinAlarmForwardRuleAreaName([this.alarmRemoteData], result);
          this.areaList.name = this.alarmRemoteData.areaName;
        });
        // ??????
        this.initAreaConfig();
        setTimeout(() => {
          // ????????????
          if (alarmData.alarmForwardRuleDeviceTypeList && alarmData.alarmForwardRuleDeviceTypeList.length) {
            this.deviceTypeListValue = alarmData.alarmForwardRuleDeviceTypeList.map(deviceType => deviceType.deviceTypeId);
            this.changeDeviceType();
          }
        }, 0);
        setTimeout(() => {
          // ??????????????????
          if (alarmData.alarmForwardRuleUserList && alarmData.alarmForwardRuleUserList.length
            && alarmData.alarmForwardRuleUserName && alarmData.alarmForwardRuleUserName.length
            && this.alarmNotifierInitialValue.deptList.length && this.alarmNotifierInitialValue.deviceTypes.length) {
            this.checkAlarmNotifier = {
              name: alarmData.alarmForwardRuleUserName.join(','),
              ids: alarmData.alarmForwardRuleUserList,
            };
            // ?????????
            this.initAlarmUserConfig();
          }
        }, 1000);
        // ????????????
        if (alarmData.alarmForwardRuleLevels && alarmData.alarmForwardRuleLevels.length) {
          this.alarmFixedLevelListValue = alarmData.alarmForwardRuleLevels.map(level => level.alarmLevelId);
          alarmData.alarmForwardRuleLevels = this.alarmFixedLevelListValue;
        }
        // ?????? ????????????
        if (alarmData.status) {
          this.isNoStartData = alarmData.status === AlarmEnableStatusEnum.enable;
        }
        // ????????????
        this.checkDeviceData = alarmData.alarmForwardRuleDeviceList;
        this.checkEquipmentData = alarmData.alarmForwardRuleEquipmentList;
        if (alarmData.alarmForwardRuleDeviceList && alarmData.alarmForwardRuleDeviceList.length > 0) {
          alarmData.alarmForwardRuleDeviceList.forEach(item => {
            resultData.push(item.deviceName);
          });
        }
        if (alarmData.alarmForwardRuleEquipmentList && alarmData.alarmForwardRuleEquipmentList.length > 0) {
          alarmData.alarmForwardRuleEquipmentList.forEach(item => {
            resultData.push(item.equipmentName);
          });
        }
        this.deviceEquipmentName = resultData.join(',');
        // ????????????
        setTimeout(() => {
          if (alarmData.alarmForwardRuleEquipmentTypeList && alarmData.alarmForwardRuleEquipmentTypeList.length) {
            this.equipmentTypeListValue = alarmData.alarmForwardRuleEquipmentTypeList.map(equipmentType => equipmentType.equipmentType);
            this.changeEquipmentType();
            this.getEquipmentType();
          }
        }, 0);
        // ????????????
        this.alarmRemoteData = alarmData;
        this.formStatus.resetData(alarmData);
        this.formStatus.resetControlData('deviceEquipment', this.deviceEquipmentName);
        /*// ?????????????????????
        RemoteAddUtil.deviceInitTableConfig(this);
        // ?????????????????????
        RemoteAddUtil.equipmentInitTableConfig(this);*/
        this.ifSpin = false;
      }
    }, () => {
      this.ifSpin = false;
    });
  }

  /**
   * ??????????????????
   */
  private clearLinkage(type?: LinkageEnum): void {
    // ??????????????????
    if (type === LinkageEnum.area) {
      this.display.deviceTypeDisplay = false;
      this.display.equipmentTypeDisplay = true;
      this.display.deviceAndEquipmentDis = true;
      // ??????????????????????????????
      this.getDeviceType();
      // ??????????????????
      this.checkAlarmNotifier = new AlarmSelectorInitialValueModel();
      this.display.notifierDis = true;
      this.formStatus.resetControlData('alarmForwardRuleUserList', this.checkAlarmNotifier.ids);
      this.initAlarmUserConfig();
      // ????????????????????????, ?????????????????? ????????????
      this.deviceTypeListValue = [];
      this.equipmentTypeListValue = [];
      this.formStatus.resetControlData('alarmForwardRuleDeviceTypeList', this.deviceTypeListValue);
      this.formStatus.resetControlData('alarmForwardRuleEquipmentTypeList', this.equipmentTypeListValue);
    } else if (type === LinkageEnum.deviceType) {
      // ????????????????????????
      this.equipmentTypeListValue = [];
      this.formStatus.resetControlData('alarmForwardRuleEquipmentTypeList', '');
      this.getEquipmentType();
      // ????????????????????????
      this.display.deviceAndEquipmentDis = true;
    }
    // ??????????????????????????????
    this.checkDeviceData = [];
    this.checkEquipmentData = [];
    // ????????????????????????
    this.deviceEquipmentName = '';
    this.formStatus.resetControlData('deviceEquipment', '');
    /*// ?????????????????????
    RemoteAddUtil.deviceInitTableConfig(this);
    // ?????????????????????
    RemoteAddUtil.equipmentInitTableConfig(this); */
  }

  /**
   * ????????????????????? ????????????
   */
  private areaGtUnit(): void {
    this.$alarmService.areaGtUnit(this.areaList.ids).subscribe((data: ResultModel<AlarmRemoteAreaModel[]>) => {
      if (data.code === ResultCodeEnum.success) {
        if (data.data && data.data.length) {
          this.alarmNotifierInitialValue.deptList = data.data.map(item => item.deptId);
        } else {
          setTimeout(() => {
            this.areaList = new AlarmSelectorInitialValueModel();
            this.initAreaConfig();
            this.display.deviceTypeDisplay = true;
            this.display.equipmentTypeDisplay = true;
            this.deviceTypeListValue = [];
            this.equipmentTypeListValue = [];
            // ??????????????????
            this.checkAlarmNotifier = new AlarmSelectorInitialValueModel();
            this.display.notifierDis = true;
            this.initAlarmUserConfig();
          }, 0);
          this.$message.info(this.language.noResponsibleEntityIsAssociatedWithTheSelectedArea);
        }
      }
    });
  }
}

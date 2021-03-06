import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {WorkOrderInitTreeUtil} from '../../share/util/work-order-init-tree.util';
import {FormOperate} from '../../../../shared-module/component/form/form-operate.service';
import {FormItem} from '../../../../shared-module/component/form/form-config';
import {NzI18nService, NzTreeNode } from 'ng-zorro-antd';
import {ActivatedRoute, Router} from '@angular/router';
import {InspectionTaskDetailUtil} from './inspection-task-detail.util';
import {InspectionLanguageInterface} from '../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {InspectionWorkOrderService} from '../../share/service/inspection';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {TreeSelectorConfigModel} from '../../../../shared-module/model/tree-selector-config.model';
import {MapSelectorConfigModel} from '../../../../shared-module/model/map-selector-config.model';
import {AreaModel} from '../../../../core-module/model/facility/area.model';
import {RuleUtil} from '../../../../shared-module/util/rule-util';
import {differenceInCalendarDays} from 'date-fns';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {InspectionTaskModel} from '../../share/model/inspection-model/inspection-task.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {WorkOrderPageTypeEnum} from '../../share/enum/work-order-page-type.enum';
import {SelectTemplateModel} from '../../share/model/template/select-template.model';
import {TemplateModalModel} from '../../share/model/template/template-modal.model';
import {DeviceFormModel} from '../../../../core-module/model/work-order/device-form.model';
import {DepartmentUnitModel} from '../../../../core-module/model/work-order/department-unit.model';
import {EquipmentFormModel} from '../../../../core-module/model/work-order/equipment-form.model';
import {AreaDeviceParamModel} from '../../../../core-module/model/work-order/area-device-param.model';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';
import {UserForCommonService} from '../../../../core-module/api-service/user';
import {EnableStatusEnum, IsSelectAllEnum} from '../../share/enum/clear-barrier-work-order.enum';
import {WorkOrderMapTypeEnum} from '../../share/enum/work-order-map-type.enum';
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {EquipmentTypeEnum} from '../../../../core-module/enum/equipment/equipment.enum';

/**
 * ??????????????????/????????????
 */
@Component({
  selector: 'app-inspection-task-detail',
  templateUrl: './inspection-task-detail.component.html',
  styleUrls: ['./inspection-task-detail.component.scss'],
})
export class InspectionTaskDetailComponent implements OnInit {
  // ??????????????????
  @ViewChild('taskStartTime') taskStartTimeTemp: TemplateRef<any>;
  // ??????????????????
  @ViewChild('taskEndTime') taskEndTimeTemp: TemplateRef<any>;
  // ??????
  @ViewChild('areaSelector') areaSelectorTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('departmentSelector') departmentSelectorTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('inspectionFacilitiesSelector') inspectionFacilitiesSelectorTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('inspectionTemplate') inspectionTemplate: TemplateRef<any>;
  // ??????????????????
  @ViewChild('selectInspectionTemp') selectInspectionTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('equipmentListTemp') equipmentListTemp: TemplateRef<any>;
  // ?????????????????????
  public language: InspectionLanguageInterface;
  // ?????????????????????
  public InspectionLanguage: InspectionLanguageInterface;
  // ????????????
  public areaSelectorConfig: any = new TreeSelectorConfigModel();
  // ??????map??????
  public mapSelectorConfig: MapSelectorConfigModel;
  // ?????????????????????
  public treeSelectorConfig: any = new TreeSelectorConfigModel();
  // ?????????
  public formColumn: FormItem[] = [];
  // ????????????
  public isLoading: boolean = false;
  // ????????????????????????
  public opened: string;
  // ??????????????????
  public selectUnitName: string = '';
  // ????????????
  public selectDeviceName: string = '';
  // ?????????????????????
  public pageType: string;
  // ????????????
  public pageTitle: string;
  // ??????id
  public deviceId: string;
  // ????????????id
  public deptId: string;
  // ???????????????????????????
  public defaultStatus: string = '1';
  // ????????????
  public areaName: string = '';
  // ????????????
  public areaSelectVisible: boolean = false;
  // ????????????
  public tempSelectVisible: boolean = false;
  // ?????????????????????button????????????
  public departmentSelectorDisabled: boolean;
  // ?????????????????????????????????
  public mapVisible: boolean = false;
  // ??????????????????
  public selectDeviceNumber: string = null;
  // ??????????????????
  public departmentSelectorName: string = '';
  // ???????????? ????????????
  public inspectionFacilitiesSelectorName: string = '';
  // ??????id
  public areaId: string = null;
  // ????????????id
  public deviceAreaId: string = null;
  // ??????????????????Value???
  public dateStart: Date;
  // ??????????????????Value???
  public dateEnd: Date;
  // ??????????????????button????????????
  public inspectionFacilitiesSelectorDisabled = true;
  // ????????????????????????
  public areaDisabled: boolean = true;
  // ????????????
  public isSelectAll: string = null;
  // ??????????????????
  public deviceSet: string[] = [];
  // ?????????????????????????????????
  public deviceData: DeviceFormModel[] = [];
  // ????????????????????????
  public isShowConfirmBtn: boolean = true;
  // ???????????????
  public isView: boolean = false;
  // ????????????
  public tempName: string = '';
  public deviceType: string[] = [];
  // ??????
  public modalData: TemplateModalModel;
  // ??????????????????
  public equipmentName: string;
  // ????????????
  public equipList: EquipmentFormModel[] = [];
  // ??????????????????
  public isUnitVisible: boolean = false;
  // ??????????????????
  public equipmentSelectList: {label: string, code: any}[] = [];
  // ??????????????????
  public equipmentListValue: string[] = [];
  // ????????????????????????
  public equipDisabled: boolean = true;
  // ????????????????????????????????????
  public selectMapType: string = '';
  // ??????id??????
  public deviceIdList: string[];
  // ????????????
  public equipmentTypes: string[];
  // ????????????
  public isFormDisabled: boolean;
  // ??????????????????id??????
  private deptList: DepartmentUnitModel[] = [];
  // ??????????????????
  private deviceTypesList: string[] = [];
  // ????????????????????????
  private isChooseAll: boolean = false;
  // ??????/????????????
  private addOrEdit: string;
  // ????????????
  private formStatus: FormOperate;
  // ?????????????????????
  private today = new Date();
  // ??????????????????
  private taskStartTime: string;
  // ??????????????????
  private taskEndTime: string;
  // ????????????ID
  private inspectionTaskId: string;
  // ??????id??????????????????id??????
  private deviceList: DeviceFormModel[] = [];
  // ????????????id
  private accountabilityDept: string = '';
  // ????????????Id
  private inspectionAreaId: string;
  // ??????code
  private inspectionAreaCode: string;
  // ???????????????????????????
  private initAreaName: string = '';
  // ??????????????????
  private areaNodes: NzTreeNode[] = [];
  // ????????????????????????
  private deptNodes: DepartmentUnitModel[] = [];
  // ???????????????
  private updateStatus: boolean;
  // ??????????????????Value???
  private inspectionTaskName: string;
  // ???????????????
  private isMultipleOrder: string = null;
  // ?????????????????????
  private selectTemplateData: SelectTemplateModel;
  // ??????????????????
  private selectEquipmentName: string;
  constructor(public $activatedRoute: ActivatedRoute,
              public $nzI18n: NzI18nService,
              public $active: ActivatedRoute,
              public $modalService: FiLinkModalService,
              public $ruleUtil: RuleUtil,
              public $router: Router,
              private $userService: UserForCommonService,
              private $inspectionWorkOrderService: InspectionWorkOrderService,
              private $facilityForCommonService: FacilityForCommonService,
              ) {}
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.InspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.equipmentSelectList = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n);
    // ???????????????
    InspectionTaskDetailUtil.initTaskFormColumn(this);
    this.judgePageJump();
    // ???????????????????????????
    WorkOrderInitTreeUtil.initMapSelectorConfig(this);
  }

  /**
   * ???????????? ??????/??????
   */
  private judgePageJump(): void {
    this.$activatedRoute.queryParams.subscribe(params => {
      this.pageType = params.status;
      if (params.inspectionTaskId && this.pageType === WorkOrderPageTypeEnum.update) {
        this.inspectionTaskId = params.inspectionTaskId;
        this.opened = params.opened;
        this.queryDeptList().then((deptData: DepartmentUnitModel[]) => {
          this.deptNodes = deptData;
          WorkOrderInitTreeUtil.initTreeSelectorConfig(this, deptData);
        });
        this.getUpdateInspectionTask(this.inspectionTaskId);
      } else {
        this.isSelectAll = IsSelectAllEnum.right;
        // ????????????
        this.queryDeptList().then((deptData: DepartmentUnitModel[]) => {
          this.deptNodes = deptData;
          WorkOrderInitTreeUtil.initTreeSelectorConfig(this, deptData);
        });
        /*this.equipmentListValue = this.equipmentSelectList.map(v => {
          return v.code;
        });*/
      }
      this.pageTitle = this.getPageTitle(this.pageType);
    });
  }
  /**
   * ????????????????????????
   * @param type ??????????????????
   * returns {string}
   */
  public getPageTitle(type: string): string {
    let title;
    switch (type) {
      case WorkOrderPageTypeEnum.add:
        title = `${this.language.addArea} ${this.language.inspectionTask}`;
        break;
      case WorkOrderPageTypeEnum.update:
        title = `${this.language.edit} ${this.language.inspectionTask}`;
        break;
      case WorkOrderPageTypeEnum.view:
        this.isShowConfirmBtn = false;
        this.isView = true;
        this.areaDisabled = false;
        this.departmentSelectorDisabled = false;
        this.inspectionFacilitiesSelectorDisabled = false;
        title = `${this.language.viewDetail} ${this.language.inspectionTask}`;
        break;
    }
    return title;
  }
  /**
   * ?????????????????????????????????
   */
  public showInspectionFacilitiesSelectorModal(): void {
    this.isSelectAll = this.formStatus.getData().isSelectAll;
    this.selectMapType = WorkOrderMapTypeEnum.device;
    this.deviceType = [...new Set(this.deviceTypesList)];
    if (this.areaName === '') {
      this.$modalService.error(this.language.pleaseSelectTheAreaInformationFirstTip);
    }
    if (this.areaName !== '' && this.isSelectAll === IsSelectAllEnum.deny) {
      this.mapVisible = true;
    } else {
      this.mapVisible = false;
    }
  }
  public formInstance(event: {instance: FormOperate}): void {
    this.formStatus = event.instance;
    this.formStatus.group.valueChanges.subscribe((param) => {
      if ( param.inspectionTaskName && param.taskPeriod && param.taskPeriod < 37 &&
        param.procPlanDate && param.procPlanDate < 366 && param.taskStartTime && this.areaName && this.departmentSelectorName
        && this.tempName.length > 0
      ) {
        // ??????????????????
        if (param.isSelectAll === IsSelectAllEnum.deny && param.deviceName === '') {
          this.isFormDisabled = false;
        } else {
          this.isFormDisabled = true;
        }
        // ??????
        if (param.taskEndTime && param.taskStartTime > param.taskEndTime) {
          this.isFormDisabled = false;
        } else {
          this.isFormDisabled = true;
        }
      } else {
        this.isFormDisabled = false;
      }
    });
  }
  /**
   * mapSelect????????????
   * param event
   */
  public mapSelectDataChange(event: DeviceFormModel[]): void {
    if (this.isSelectAll === IsSelectAllEnum.deny) {
      this.deviceIdList = [];
      this.deviceSet = [];
      this.selectDeviceName = '';
      const name = [];
      event.forEach(item => {
        name.push(item.deviceName);
      });
      this.selectDeviceName = name.join(',');
      this.inspectionFacilitiesSelectorName = this.selectDeviceName;
      this.formStatus.resetControlData('deviceName', this.selectDeviceName);
      this.deviceList = event;
      const types = [];
      const deviceId = [];
      for (let i = 0; i < event.length; i++) {
        deviceId.push(event[i].deviceId);
        types.push(event[i].deviceType);
        this.deviceId = event[i].deviceId;
        this.deviceAreaId = event[i].areaId;
      }
      if (deviceId.length > 0) {
        this.formStatus.resetControlData('inspectionDeviceCount', deviceId.length + '');
        this.deviceIdList = deviceId;
        this.deviceSet = deviceId;
        this.queryEquipmentList();
        this.filterDeviceAndEquipment([...new Set(types)]);
      } else {
        this.$modalService.info(this.language.selectDeviceTip);
      }
    }
  }
  /**
   * ????????????
   */
  public goBack(): void {
    window.history.go(-1);
  }

  /**
   * ???????????????????????????
   */
  public inspectionTaskDetail(): void {
    const newDate = new Date();
    if (this.dateEnd !== null && this.dateEnd < newDate) {
      this.$modalService.info(`${this.language.endTimeIsGreaterThanCurrentTime}`);
    } else {
      this.isLoading = true;
      const data = this.formStatus.group.getRawValue();
      data.inspectionTaskName = CommonUtil.trim(data.inspectionTaskName);
      data.inspectionAreaId = this.inspectionAreaId;
      data.inspectionAreaCode = this.inspectionAreaCode;
      data.deviceList = this.deviceList;
      // ??????
      data.template = {
        templateId: this.selectTemplateData.templateId,
        templateName: this.selectTemplateData.templateName,
        inspectionItemList: []
      };
      data.deviceName = this.inspectionFacilitiesSelectorName;
      data.inspectionDeviceCount = this.selectDeviceNumber;
      data.inspectionAreaName = this.areaName;
      data.selectAll = this.isSelectAll;
      data.departmentList = this.deptList;
      this.selectTemplateData.inspectionItemList.forEach((v, i) => {
        if (v.checked && CommonUtil.trim(v.templateItemName) !== '') {
          data.template.inspectionItemList.push({
            templateItemId: v.templateItemId,
            templateItemName: v.templateItemName,
            sort: i + 1,
            remark: v.remark
          });
        }
      });
      data.equipmentType = this.equipmentListValue.toString();
      // ??????
      if (data.equipmentType.length > 0) {
        data.equipmentList = this.equipList;
      } else {
        data.equipmentList = [];
      }
      // ?????????????????? ??????????????????
      if (this.pageType === WorkOrderPageTypeEnum.add) {
        // ??????
        data.opened = EnableStatusEnum.enable;
        data.taskStartDate = new Date(data.taskStartTime).getTime();
        if (data.taskEndTime) {
          data.taskEndDate = new Date(data.taskEndTime).getTime();
        } else {
          data.taskEndDate = null;
        }
        data.taskStartTime = CommonUtil.sendBackEndTime(data.taskStartDate);
        data.taskEndTime = CommonUtil.sendBackEndTime(data.taskEndDate);
        this.$inspectionWorkOrderService.insertWorkOrder(data).subscribe((result: ResultModel<string>) => {
          this.isLoading = false;
          if (result.code === ResultCodeEnum.success) {
            this.$router.navigate(['/business/work-order/inspection/task-list']).then();
            this.$modalService.success(this.InspectionLanguage.operateMsg.addSuccess);
          } else {
            this.$modalService.error(result.msg);
          }
        }, () => {
          this.isLoading = false;
        });
      } else if (this.pageType === WorkOrderPageTypeEnum.update) {
        // ??????
        this.inspectionFacilitiesSelectorName = data.deviceName;
        data.inspectionTaskId = this.inspectionTaskId;
        // ????????????
        if (data.taskEndTime === null) {
          data.taskEndDate = null;
        } else if (data.taskEndTime === this.taskEndTime) {
          data.taskEndDate = new Date(this.taskEndTime).getTime();
        } else {
          data.taskEndDate = new Date(data.taskEndTime).getTime();
        }
        // ????????????
        if (data.taskStartTime === this.taskStartTime) {
          data.taskStartDate = new Date(this.taskStartTime).getTime();
        } else {
          data.taskStartDate = new Date(data.taskStartTime).getTime();
        }
        data.taskEndTime = CommonUtil.sendBackEndTime(data.taskEndDate);
        data.taskStartTime = CommonUtil.sendBackEndTime(data.taskStartDate);
        data.opened = this.opened;
        this.$inspectionWorkOrderService.updateInspectionTask(data).subscribe((result: ResultModel<string>) => {
          this.isLoading = false;
          if (result.code === ResultCodeEnum.success) {
            this.addOrEdit = WorkOrderPageTypeEnum.update;
            this.$router.navigate(['/business/work-order/inspection/task-list']).then();
            this.$modalService.success(this.InspectionLanguage.operateMsg.editSuccess);
          } else {
            this.$modalService.error(result.msg);
          }
        }, () => {
          this.isLoading = false;
        });
      }
    }
  }
  /**
   * ?????????????????????
   */
  public showAreaSelectorModal(): void {
    if (this.departmentSelectorName === '') {
      this.areaSelectVisible = false;
      this.treeSelectorConfig.treeNodes = this.areaNodes;
      this.$modalService.info(`${this.language.pleaseSelectDepartInfo}`);
    } else {
      if (this.areaNodes && this.areaNodes.length > 0) {
        this.areaSelectorConfig.treeNodes = this.areaNodes;
        this.areaSelectVisible = true;
      }
    }
  }
  /**
   *????????????????????????
   */
  public showDepartmentSelectorModal(): void {
    this.treeSelectorConfig.treeNodes = this.deptNodes;
    this.isUnitVisible = true;
  }
  /**
   * ??????????????????
   * param event
   */
  public areaSelectChange(event: AreaModel): void {
    this.inspectionFacilitiesSelectorName = '';
    this.equipList = [];
    this.deviceList = [];
    if (event[0]) {
      this.areaName = event[0].areaName;
      this.inspectionAreaId = event[0].areaId;
      this.areaId = event[0].areaId;
      this.inspectionAreaCode = event[0].areaCode;
      FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, event[0].areaId, null);
      //  ????????????id????????????????????????
      this.queryDeviceByArea(event[0].areaCode);
    } else {
      FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, null, null);
      this.areaName = '';
    }
  }

  /**
   * ????????????????????????
   * @param event ????????????????????????
   */
  public selectDataChange(event: DepartmentUnitModel[]): void {
    if (event && event[0]) {
      FacilityForCommonUtil.setTreeNodesStatus(this.deptNodes, [event[0].id]);
      this.selectUnitName = event[0].deptName;
      this.deptList = [{
        accountabilityDept: event[0].deptCode,
        accountabilityDeptName: event[0].deptName
      }];
      this.departmentSelectorName = this.selectUnitName;
      this.deptId = event[0].id;
      // ????????????
      this.formStatus.resetControlData('departmentList', this.deptList);
      // ????????????
      this.queryAreasByCode(event[0].deptCode).then((areaData: NzTreeNode[]) => {
        this.areaNodes = areaData;
        WorkOrderInitTreeUtil.initAreaSelectorConfig(this, this.areaNodes);
        FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, null);
        this.areaName = '';
      });
    } else {
      FacilityForCommonUtil.setTreeNodesStatus(this.deptNodes, []);
      this.selectUnitName = '';
      this.departmentSelectorName = this.selectUnitName;
      this.formStatus.resetControlData('departmentList', null);
    }
  }
  /**
   * ??????????????????code????????????
   */
  private queryAreasByCode(code: string): Promise<NzTreeNode[]> {
    return new Promise((resolve, reject) => {
      this.$facilityForCommonService.queryAreaByDeptCode(code).subscribe((result: ResultModel<NzTreeNode[]>) => {
        if (result.code === ResultCodeEnum.success) {
          const areaData = result.data || [];
          this.areaNodes = areaData;
          if (areaData.length > 0) {
            this.areaDisabled = false;
          }
          resolve(areaData);
        }
      });
    });
  }
  /**
   * ????????????
   */
  private queryDeptList(): Promise<DepartmentUnitModel[]> {
    return new Promise((resolve, reject) => {
        this.$userService.queryAllDepartment().subscribe((result: ResultModel<DepartmentUnitModel[]>) => {
          if (result.code === ResultCodeEnum.success) {
            this.deptNodes = result.data || [];
            resolve(this.deptNodes);
          }
        });
    });
  }
  /**
   * ??????id??????????????????
   * @param id ??????id
   */
  private getUpdateInspectionTask(id: string): void {
    this.$inspectionWorkOrderService.inquireInspectionTask(id).subscribe((result: ResultModel<InspectionTaskModel>) => {
      let inspectionInfo;
      if (result.code === ResultCodeEnum.success) {
        this.updateStatus = true;
        inspectionInfo = result.data;
        // ????????????/??????id
        this.areaName = result.data.inspectionAreaName;
        this.initAreaName = result.data.inspectionAreaName;
        this.inspectionAreaId = result.data.inspectionAreaId;
        this.inspectionAreaCode = result.data.inspectionAreaCode;
        this.areaDisabled = false;
        // ??????????????????
        this.isSelectAll = result.data.selectAll;
        result.data.isSelectAll = this.isSelectAll;
        this.inspectionFacilitiesSelectorName = result.data.deviceName;
        this.departmentSelectorName = result.data.accountabilityDeptName;
        // ????????????
        this.taskStartTime = result.data.taskStartTime;
        this.taskEndTime = result.data.taskEndTime;
        this.selectDeviceNumber = result.data.inspectionDeviceCount.toString();
        this.formStatus.resetData(inspectionInfo);
        // ???????????????
        if (result.data.equipmentType) {
          this.equipmentListValue = [];
          const arr = result.data.equipmentType.split(',');
          arr.forEach(v => {
            this.equipmentListValue.push(v);
          });
        }
        this.equipDisabled = false;
        this.formStatus.resetControlData('inspectionDeviceCount', result.data.inspectionDeviceCount.toString());
        if (inspectionInfo.taskStartTime) {
          this.formStatus.resetControlData('taskStartTime',
            new Date(CommonUtil.convertTime(new Date(inspectionInfo.taskStartTime).getTime())));
        }
        if (inspectionInfo.taskEndTime) {
          this.formStatus.resetControlData('taskEndTime',
            new Date(CommonUtil.convertTime(new Date(inspectionInfo.taskEndTime).getTime())));
        }
        // ?????????
        if (result.data.deviceList.length > 0 && this.isSelectAll === IsSelectAllEnum.deny) {
          this.areaId = result.data.inspectionAreaId;
        }
        // ?????????
        this.equipList = result.data.equipmentList || [];
        const equipName = [];
        this.equipList.forEach(v => {
          equipName.push(v.equipmentName);
        });
        this.equipmentName = equipName.join(',');
        this.selectEquipmentName = this.equipmentName;
      }
      const deptList = result.data.deptList;
      this.areaId = result.data.inspectionAreaId;
      this.deptId = result.data.deptList[0].accountabilityDept;
      if (deptList && deptList.length > 0) {
        this.deptList = deptList;
      }
      // ????????????
      this.queryDeptList().then((deptData: DepartmentUnitModel[]) => {
        this.deptNodes = deptData;
        FacilityForCommonUtil.setTreeNodesStatus(this.deptNodes, [deptList[0].accountabilityDept]);
      });
      // ????????????
      this.queryAreasByCode(deptList[0].accountabilityDept).then((data: NzTreeNode[]) => {
        this.areaNodes = data;
        WorkOrderInitTreeUtil.initAreaSelectorConfig(this, this.areaNodes);
        FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, result.data.inspectionAreaId);
      });
      // ???????????????
      if (result.data.template) {
        this.selectTemplateData = result.data.template;
        const tempList = this.selectTemplateData.inspectionItemList ? this.selectTemplateData.inspectionItemList : [];
        if (tempList.length > 0) {
          tempList.forEach(v => {
            v.checked = true;
          });
          this.selectTemplateData.inspectionItemList = tempList;
          this.tempName = result.data.template.templateName;
          this.formStatus.resetControlData('deviceName', this.tempName);
        }
      }
      // ????????????????????????id
      this.deviceSet = [];
      if (result.data.deviceList && result.data.deviceList.length > 0) {
        this.deviceList = result.data.deviceList;
        const deviceName = [];
        const types = [];
        result.data.deviceList.forEach(v => {
          deviceName.push(v.deviceName);
          if (types.indexOf(v.deviceType) < 0) {
            types.push(v.deviceType);
          }
          if (this.isSelectAll === IsSelectAllEnum.deny) {
            this.deviceSet.push(v.deviceId);
          }
        });
        this.inspectionFacilitiesSelectorName = deviceName.join(',');
        this.formStatus.resetControlData('deviceName', deviceName.join(','));
      }
    });
  }

  /**
   * ??????????????????????????????
   */
  public disabledEndDate = (current: Date): boolean => {
    if (this.dateStart !== null) {
      return differenceInCalendarDays(current, this.dateStart) < 0 || CommonUtil.checkTimeOver(current);
    } else {
      this.today = new Date();
      return differenceInCalendarDays(current, this.today) < 0 || CommonUtil.checkTimeOver(current);
    }
  }
  /**
   * ??????????????????????????????????????????
   */
  public disabledStartDate = (current: Date): boolean => {
    this.today = new Date();
    return differenceInCalendarDays(current, this.today) < 0 || CommonUtil.checkTimeOver(current);
  }
  /**
   * ?????????????????????
   */
  private queryDeviceByArea(areaCode: string): void {
    const isAll = this.formStatus.getData().isSelectAll;
    const data = new AreaDeviceParamModel();
    data.areaCode = areaCode;
    data.deviceTypes = [];
    // ??????????????????
    this.deviceList = [];
    this.deviceSet = [];
    // ???????????????????????????
    this.equipList = [];
    // ??????????????????
    this.selectDeviceName = '';
    if (isAll === '0') {
      return;
    }
    this.$facilityForCommonService.queryDeviceDataList(data).subscribe((result: ResultModel<DeviceFormModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        const dataList = result.data || [];
        this.deviceData = dataList;
        const deviceId = [];
        const name = [];
        const types = [];
        if (this.isSelectAll === IsSelectAllEnum.right) {
          // ????????????
          this.selectDeviceNumber = dataList.length + '';
          this.formStatus.resetControlData('inspectionDeviceCount', this.selectDeviceNumber);
          this.deviceList = dataList;
          for (let i = 0; i < dataList.length; i++) {
            deviceId.push(dataList[i].deviceId);
            name.push(dataList[i].deviceName);
            types.push(dataList[i].deviceType);
          }
          // ????????????
          this.selectDeviceName = name.join(',');
          this.inspectionFacilitiesSelectorName = this.selectDeviceName;
          this.formStatus.resetControlData('deviceName', this.selectDeviceName);
        }
        this.deviceIdList = deviceId;
        if (types.length > 0) {
          this.equipDisabled = false;
        }
        this.filterDeviceAndEquipment([...new Set(types)]);
        if (this.deviceIdList.length > 0) {
          this.queryEquipmentList();
        }
      }
    });
  }

  /**
   * ?????????????????????
   */
  private filterDeviceAndEquipment(list: string[]) {
    this.equipmentSelectList = [];
    this.equipmentListValue = [];
    // ??????????????????????????????
    const typeList = FacilityForCommonUtil.getRoleFacility(this.$nzI18n);
    const equipList = FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n);
    // ????????????????????????????????????
    const newType = [];
    list.forEach(item => {
      const flag = typeList.find(v => {
        return item === v.code;
      });
      if (flag) {
        newType.push(item);
      }
    });
    // ????????????????????????????????????
    const typeA = [DeviceTypeEnum.wisdom, DeviceTypeEnum.distributionPanel];
    const typeB = [DeviceTypeEnum.opticalBox, DeviceTypeEnum.well, DeviceTypeEnum.outdoorCabinet, DeviceTypeEnum.distributionFrame, DeviceTypeEnum.junctionBox];
    let flagA: boolean = false;
    let flagB: boolean = false;
    typeA.forEach(item => {
      if (newType.includes(item)) {
        flagA = true;
      }
    });
    typeB.forEach(item => {
      if (newType.includes(item)) {
        flagB = true;
      }
    });
    // 1????????????????????????
    if (flagA && flagB) {
      this.equipmentSelectList = equipList;
      equipList.forEach(item => {
        this.equipmentListValue.push(item.code.toString());
      });
    } else {
      // 2??????????????????????????????????????????????????????????????????????????????
      if (flagA) {
        equipList.forEach(item => {
          if (item.code !== EquipmentTypeEnum.intelligentEntranceGuardLock) {
            this.equipmentSelectList.push(item);
            this.equipmentListValue.push(item.code.toString());
          }
        });
      }
      // 3???????????????????????????????????????
      if (flagB) {
        equipList.forEach(item => {
          if (item.code === EquipmentTypeEnum.intelligentEntranceGuardLock) {
            this.equipmentSelectList.push(item);
            this.equipmentListValue.push(item.code.toString());
          }
        });
      }
    }
  }
  /**
   * ????????????????????????
   */
  public showTemplate(): void {
    this.modalData = {
      pageType: this.pageType,
      selectTemplateData: this.selectTemplateData
    };
    this.tempSelectVisible = true;
  }
  /**
   * ??????????????????
   * @param event ????????????
   */
   public selectTemplate(event: SelectTemplateModel): void {
    this.tempName = event.templateName;
    this.formStatus.resetControlData('inspectionTemplate', event.templateName);
    this.selectTemplateData = event;
    this.tempSelectVisible = false;
  }
  /**
   * ??????????????????????????????
   */
  private queryEquipmentList(): void {
    const data = new AreaDeviceParamModel();
    data.areaCode = this.inspectionAreaCode;
    data.deviceIds = this.deviceIdList;
    data.equipmentTypes = [];
    this.equipmentListValue.forEach(v => {
      data.equipmentTypes.push(v);
    });
    this.equipList = [];
    this.equipmentName = '';
    this.$facilityForCommonService.listEquipmentBaseInfoByAreaCode(data).subscribe((result: ResultModel<EquipmentFormModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        const equipData = result.data || [];
        const name = [];
        // ???????????????????????????????????????
        equipData.forEach(v => {
          this.equipList.push({
            equipmentCode: v.equipmentCode,
            equipmentId: v.equipmentId,
            deviceId: v.deviceId,
            deviceType: v.deviceInfo ? v.deviceInfo.deviceType : v.deviceType,
            equipmentIdType: v.equipmentType,
            equipmentType: v.equipmentType,
            equipmentName: v.equipmentName
          });
          name.push(v.equipmentName);
        });
        this.equipmentName = name.join(',');
        this.selectEquipmentName = this.equipmentName;
      }
    });
  }
  /**
   * ????????????
   */
  public onChangeEquip(): void {
    const timer = setTimeout( () => {
      if (this.equipmentListValue.length > 0) {
        this.queryEquipmentList();
      } else {
        this.equipList = [];
        this.formStatus.resetControlData('equipmentType', []);
      }
      clearTimeout(timer);
    }, 10);
  }
  /**
   * ??????????????????
   */
  public changeEquip(): void {
    this.formStatus.resetControlData('equipmentType', this.equipmentListValue.map(item => {
      return {'value': item };
    }));
  }
}

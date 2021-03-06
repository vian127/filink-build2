import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {PageModel} from '../../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../../shared-module/model/table-config.model';
import {ActivatedRoute, Router} from '@angular/router';
import * as _ from 'lodash';
import {DateHelperService, NzI18nService, NzModalService} from 'ng-zorro-antd';
import {AlarmService} from '../../../share/service/alarm.service';
import {AlarmLanguageInterface} from '../../../../../../assets/i18n/alarm/alarm-language.interface';
import {
  FilterCondition,
  QueryConditionModel,
  SortCondition,
} from '../../../../../shared-module/model/query-condition.model';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {AlarmStoreService} from '../../../../../core-module/store/alarm.store.service';
import {
  AlarmSelectorConfigModel,
  AlarmSelectorInitialValueModel,
} from '../../../../../shared-module/model/alarm-selector-config.model';
import {InspectionLanguageInterface} from '../../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {TreeSelectorConfigModel} from '../../../../../shared-module/model/tree-selector-config.model';
import {FacilityLanguageInterface} from '../../../../../../assets/i18n/facility/facility.language.interface';
import {SelectModel} from '../../../../../shared-module/model/select.model';
import {UserForCommonService} from '../../../../../core-module/api-service/user/user-for-common.service';
import {AlarmEnableStatusEnum, AlarmTriggerTypeEnum, AlarmWorkOrderTypeEnum} from '../../../share/enum/alarm.enum';
import {FacilityForCommonUtil} from '../../../../../core-module/business-util/facility/facility-for-common.util';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {AlarmOrderModel} from '../../../share/model/alarm-order.model';
import {OperatorEnum} from '../../../../../shared-module/enum/operator.enum';
import {AlarmUtil} from '../../../share/util/alarm.util';
import {DepartmentUnitModel} from '../../../../../core-module/model/work-order/department-unit.model';
import {AreaModel} from '../../../../../core-module/model/facility/area.model';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';

/**
 * ????????????-???????????????
 */
@Component({
  selector: 'app-alarm-work-order',
  templateUrl: './alarm-work-order.component.html',
  styleUrls: ['./alarm-work-order.component.scss']
})

export class AlarmWorkOrderComponent implements OnInit {
  // ????????????????????????
  @ViewChild('isNoStartTemp') isNoStartTemp: TemplateRef<any>;
  // ??????????????????
  @ViewChild('expectTimeTemp') expectTimeTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('deviceTypeTemp') deviceTypeTemp: TemplateRef<any>;
  // ??????
  @ViewChild('areaSelector') private areaSelectorTemp;
  // ????????????
  @ViewChild('alarmName') private alarmName;
  // ????????????
  @ViewChild('unitNameSearch') unitNameSearch: TemplateRef<any>;
  // ????????????
  @ViewChild('equipmentTypeTemp') equipmentTypeTemp: TemplateRef<any>;
  // ???????????????
  public dataSet: AlarmOrderModel[] = [];
  // ????????????
  public pageBean: PageModel = new PageModel();
  // ????????????
  public tableConfig: TableConfigModel;
  // ???????????????
  public language: AlarmLanguageInterface;
  // ???????????????
  public inspectionLanguage: InspectionLanguageInterface;
  // ???????????????
  public facilityLanguage: FacilityLanguageInterface;
  // ?????????????????????????????????
  public responsibleUnitIsVisible: boolean = false;
  // ???????????????????????????
  public selectUnitName: string;
  // ?????????????????????
  public treeSelectorConfig: TreeSelectorConfigModel;
  private filterValue: FilterCondition;
  // ????????????
  public filterEvent: AlarmOrderModel;
  // ????????????
  public areaConfig: AlarmSelectorConfigModel;
  // ??????????????????
  public alarmNameConfig: AlarmSelectorConfigModel;
  // ???????????????????????????
  private deviceRoleTypes: SelectModel[];
  // ????????????????????????
  private defaultFilterCondition: string[] = [];
  // ???????????????
  public isStatus = AlarmEnableStatusEnum;
  // ?????????
  public languageEnum = LanguageEnum;
  // ????????????
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // ??????????????????
  private treeNodes: DepartmentUnitModel[] = [];
  // ??????
  private areaList: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // ????????????
  private unitList: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // ??????????????????
  private unitConfig: AlarmSelectorConfigModel;
  // ?????????????????????
  private checkDisableEnableData: AlarmOrderModel[] = [];
  // ?????????????????????
  private checkAlarmName: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();

  constructor(public $router: Router,
              public $nzI18n: NzI18nService,
              public $alarmService: AlarmService,
              public $message: FiLinkModalService,
              public $active: ActivatedRoute,
              public $alarmStoreService: AlarmStoreService,
              private $dateHelper: DateHelperService,
              private $userService: UserForCommonService,
              private modalService: NzModalService) {
  }
  public ngOnInit(): void {
    // ???????????????
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    this.inspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.facilityLanguage = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    // ????????????
    this.deviceRoleTypes = FacilityForCommonUtil.getRoleFacility(this.$nzI18n);
    // ????????????????????????
    this.getDefaultFilterCondition();
    // ???????????????
    this.initTableConfig();
    this.refreshData();
    // ??????
    this.initAreaConfig();
    // ????????????
    this.initUnitConfig();
    // ????????????
    this.initAlarmName();
    // ??????????????????????????????
    this.initTreeSelectorConfig();
  }

  /**
   *  ??????????????? ?????????
   *  param data
   */
  public clickSwitch(data: AlarmOrderModel) {
    if (data && data.id) {
      let statusValue;
      this.dataSet = this.dataSet.map(item => {
        if (data.id === item.id) {
          item.status = data.status === AlarmEnableStatusEnum.enable ? AlarmEnableStatusEnum.disable : AlarmEnableStatusEnum.enable;
          this.switchStatusRole(item);
          statusValue = item.status;
          return item;
        } else {
          return item;
        }
      });
      this.$alarmService.updateWorkStatus(statusValue, [data.id])
        .subscribe((res: ResultModel<string>) => {
         if (res.code === 0) {
           this.$message.success(this.language.editAlarmTurnOrderEnableStatus);
         } else {
           this.$message.error( res.msg);
         }
        });
    }
  }
  /**
   * ???????????????????????????
   */
  public showModal(filterValue: FilterCondition): void {
    if (this.treeNodes.length === 0) {
      this.queryAllDeptList().then((bool) => {
        if (bool) {
          this.filterValue = filterValue;
          if (!this.filterValue.filterValue) {
            this.filterValue.filterValue = [];
          }
          this.treeSelectorConfig.treeNodes = this.treeNodes;
          this.responsibleUnitIsVisible = true;
        }
      });
    } else {
      this.responsibleUnitIsVisible = true;
    }
  }

  /**
   * ??????????????????
   * param event
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }
  /**
   * ????????????????????????
   */
  public departmentSelectDataChange(event: DepartmentUnitModel[]): void {
    let selectArr = [];
    this.selectUnitName = '';
    if (event.length > 0) {
      selectArr = event.map(item => {
        this.selectUnitName += `${item.deptName},`;
        return item.id;
      });
    }
    this.selectUnitName = this.selectUnitName.substring(0, this.selectUnitName.length - 1);
    if (selectArr.length === 0) {
      this.filterValue.filterValue = null;
    } else {
      this.filterValue.filterValue = selectArr;
      this.filterValue.filterName = this.selectUnitName;
    }
    FacilityForCommonUtil.setTreeNodesStatus(this.treeNodes, selectArr);
  }

  /**
   * ?????????????????????
   */
  private queryAllDeptList(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.$userService.queryAllDepartment().subscribe((result: ResultModel<DepartmentUnitModel[]>) => {
        this.treeNodes = result.data || [];
        resolve(true);
      }, (error) => {
        reject(error);
      });
    });
  }
  /**
   * ????????????
   * param ids
   */
  private delTemplate(ids: string[]): void {
    this.$alarmService.deleteAlarmWork(ids).subscribe((result: ResultModel<string>) => {
      if (result.code === 0) {
        this.$message.success(result.msg);
        this.queryCondition.pageCondition.pageNum = 1;
        this.refreshData(this.filterEvent);
      } else {
        this.$message.error(result.msg);
      }
    });
  }
  /**
   * ????????????????????????
   */
  private refreshData(filterEvent?: AlarmOrderModel): void {
    this.tableConfig.isLoading = true;
    let resultData = new AlarmOrderModel();
    if (filterEvent) {
      if (!filterEvent.hasOwnProperty('deviceTypeId')) {
        filterEvent.deviceTypeId = this.defaultFilterCondition;
      }
      resultData = filterEvent;
    } else {
      resultData.deviceTypeId = this.defaultFilterCondition;
    }
    const data = {'bizCondition': resultData};
    this.queryCondition.bizCondition = {
      ...data.bizCondition,
      'sortProperties': this.queryCondition.sortCondition.sortField,
      'sort': this.queryCondition.sortCondition.sortRule
    };
    this.$alarmService.queryAlarmWorkOrder(this.queryCondition).subscribe((res: ResultModel<AlarmOrderModel[]>) => {
      if (res.code === ResultCodeEnum.success) {
        const areaIds = [];
        this.tableConfig.isLoading = false;
        this.pageBean.Total = res.totalCount;
        this.pageBean.pageIndex = res.pageNum;
        this.pageBean.pageSize = res.size;
        this.dataSet = res.data.map(item => {
          // ????????????
          item.orderTypeName = AlarmUtil.translateOrderType(this.$nzI18n, item.orderType) as string;
          // ????????????
          item.triggerTypeName = AlarmUtil.translateTriggerType(this.$nzI18n, item.triggerType) as string;
          // ????????????????????????
          this.switchStatusRole(item);
          // ????????????
          if (item.alarmOrderRuleNames && item.alarmOrderRuleNames.length) {
            item.alarmName = item.alarmOrderRuleNames.join();
          }

          item.alarmOrderRuleArea.forEach(areaId => {
            if (areaIds.indexOf(areaId) === -1) {
              areaIds.push(areaId);
            }
          });
          item.alarmOrderRuleAreaName = [];
          // ????????????
          if (item.alarmOrderRuleDeviceTypeList && item.alarmOrderRuleDeviceTypeList[0]
            && item.alarmOrderRuleDeviceTypeList[0].deviceTypeId) {
            const resultDeviceData = AlarmUtil.setDeviceTypeList(item.alarmOrderRuleDeviceTypeList, this.$nzI18n);
            item.deviceTypeArr = resultDeviceData.resultInfo;
            item.deviceTypeNames = resultDeviceData.resultNames.join(',');
          }
          // ????????????
          if (item.alarmOrderRuleEquipmentTypeList && item.alarmOrderRuleEquipmentTypeList[0]
            && item.alarmOrderRuleEquipmentTypeList[0].equipmentTypeId) {
            const resultDeviceData = AlarmUtil.setEquipmentTypeList(item.alarmOrderRuleEquipmentTypeList, 'equipmentTypeId', this.$nzI18n);
            item.equipmentTypeArr = resultDeviceData.resultInfo;
            item.equipmentTypeNames = resultDeviceData.resultNames.join(',');
          }
          // ??????
          if (item.alarmOrderRuleAreaName && item.alarmOrderRuleAreaName.length) {
            item.areaName = item.alarmOrderRuleAreaName.join(',');
          }
          return item;
        });
        // ????????????id??????????????????
        if (areaIds && areaIds.length > 0) {
          AlarmUtil.getAreaName(this.$alarmService, areaIds).then((result: AreaModel[]) => {
            AlarmUtil.joinAlarmWorkOrderForwardRuleAreaName(this.dataSet, result);
          });
        }
      } else {
        // ????????????
        this.$message.error(res.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }
  /**
   * ???????????? ??????
   */
  private enablePopUpConfirm(): void {
    this.modalService.confirm({
      nzTitle: this.language.prompt,
      nzContent: this.language.isNoAllEnable,
      nzOkText: this.language.cancelText,
      nzOkType: 'danger',
      nzMaskClosable: false,
      nzOnOk: () => {
      },
      nzCancelText: this.language.okText,
      nzOnCancel: () => {
        this.checkDisableEnable(AlarmEnableStatusEnum.enable);
      },
    });
  }
  /**
   * ????????????
   */
  private disablePopUpConfirm(): void {
    this.modalService.confirm({
      nzTitle: this.language.prompt,
      nzContent: this.language.isNoAllDisable,
      nzOkText: this.language.cancelText,
      nzOkType: 'danger',
      nzMaskClosable: false,
      nzOnOk: () => {
      },
      nzCancelText: this.language.okText,
      nzOnCancel: () => {
        this.checkDisableEnable(AlarmEnableStatusEnum.disable);
      },
    });
  }
  /**
   * ?????????????????????
   * param {any | any} type
   */
  private checkDisableEnable(type: AlarmEnableStatusEnum) {
    const ids = this.checkDisableEnableData.map(item => item.id);
    this.$alarmService.updateWorkStatus(type, ids)
      .subscribe((res: ResultModel<string>) => {
        if (res.code === 0) {
          this.$message.success(this.language.editAlarmTurnOrderEnableStatus);
          this.refreshData(this.filterEvent);
        } else {
          this.$message.error(res.msg);
        }
      }, err => {
        this.$message.error(err.msg);
      });
  }
  /**
   *  ????????????
   */
  private initAreaConfig(): void {
    const clear = !this.areaList.ids.length;
    this.areaConfig = {
      clear: clear,
      handledCheckedFun: (event: AlarmSelectorInitialValueModel) => {
        this.areaList = event;
      }
    };
  }

  /**
   *  ??????????????????
   */
  private initUnitConfig(): void {
    const clear = !this.unitList.ids.length;
    this.unitConfig = {
      clear: clear,
      handledCheckedFun: (event: AlarmSelectorInitialValueModel) => {
        this.unitList = event;
      }
    };
  }

  /**
   *  ??????????????????
   */
  private initAlarmName(): void {
    const clear = !this.checkAlarmName.ids.length;
    this.alarmNameConfig = {
      clear: clear,
      handledCheckedFun: (event: AlarmSelectorInitialValueModel) => {
        this.checkAlarmName = event;
      }
    };
  }
  /**
   * ????????????
   * param item
   */
  private switchStatusRole(item: AlarmOrderModel): void {
    // ???/????????????
    item.appAccessPermission = item.status === AlarmEnableStatusEnum.disable ? '02-3-5-2' : '02-3-5-3';
  }

  /**
   * ??????????????????????????????
   */
  private initTreeSelectorConfig(): void {
    this.treeSelectorConfig = {
      title: this.facilityLanguage.accountabilityUnit,
      width: '1000px',
      height: '300px',
      treeNodes: this.treeNodes,
      treeSetting: {
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
      },
      onlyLeaves: false,
      selectedColumn: [
        {
          title: this.facilityLanguage.deptName, key: 'deptName', width: 100,
        },
        {
          title: this.facilityLanguage.deptLevel, key: 'deptLevel', width: 100,
        },
        {
          title: this.facilityLanguage.parentDept, key: 'parentDepartmentName', width: 100,
        }
      ]
    };
  }
  /**
   * ????????????????????????
   */
  private getDefaultFilterCondition(): void {
    if (!_.isEmpty(this.deviceRoleTypes)) {
      const labelValue = [];
      this.deviceRoleTypes.forEach(item => {
        labelValue.push(item.code);
      });
      this.defaultFilterCondition = labelValue;
    }
  }
  /**
   * ?????????????????????
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      showSearchSwitch: true,
      primaryKey: '02-3-5',
      showSizeChanger: true,
      noIndex: true,
      notShowPrint: true,
      scroll: {x: '1200px', y: '600px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          type: 'serial-number', width: 62, title: this.language.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        {
          // ??????
          title: this.language.name, key: 'orderName',
          width: 150,
          searchable: true,
          searchConfig: {type: 'input'},
          fixedStyle: {fixedLeft: true, style: {left: '124px'}}
        },
        {
          // ????????????
          title: this.language.alarmName, key: 'alarmName', searchKey: 'alarmOrderRuleNameList',
          width: 200,
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'render',
            selectInfo: this.areaList.ids,
            renderTemplate: this.alarmName
          }
        },
        {
          // ????????????
          title: this.language.workOrderType, key: 'orderTypeName',
          searchKey: 'orderTypeList',
          width: 200,
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: [
              // 1 ??????????????? 2 ???????????????
              {label: this.language.eliminateWork, value: AlarmWorkOrderTypeEnum.eliminateWork},
            ]
          },
        },
        {
          // ??????
          title: this.language.area,
          key: 'areaName',
          width: 200,
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'render',
            selectInfo: this.areaList.ids,
            renderTemplate: this.areaSelectorTemp
          },
        },
        {
          // ????????????
          title: this.language.alarmSourceType, key: 'alarmOrderRuleDeviceTypeList', width: 230, isShowSort: true,
          type: 'render',
          searchKey: 'deviceTypeId',
          configurable: true,
          renderTemplate: this.deviceTypeTemp,
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: this.deviceRoleTypes, label: 'label', value: 'code'
          }
        },
        {
          // ????????????
          title: this.language.equipmentType, key: 'alarmOrderRuleEquipmentTypeList', width: 230, isShowSort: true,
          configurable: true,
          searchKey: 'equipmentTypeId',
          searchable: true,
          type: 'render',
          renderTemplate: this.equipmentTypeTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n), label: 'label', value: 'code'
          }
        },
        {
          // ????????????
          title: this.language.triggerCondition, key: 'triggerTypeName', isShowSort: true,
          searchKey: 'triggerTypeArray',
          width: 180,
          configurable: true,
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: [
              // 0 ???????????????????????? 1 ????????????????????????
              {label: this.language.alarmHappenedTrigger, value: AlarmTriggerTypeEnum.alarmHappenedTrigger},
            ]
          },
        },
        {
          // ????????????
          title: this.language.createTime, key: 'createTime',
          width: 200, isShowSort: true,
          configurable: true,
          searchable: true,
          pipe: 'date',
          searchConfig: {type: 'dateRang'}
        },
        {
          // ??????????????????(???)
          title: this.language.expectAccomplishTime, key: 'completionTime', isShowSort: true,
          width: 140,
          configurable: true,
          searchable: true,
          searchConfig: {type: 'render', renderTemplate: this.expectTimeTemp},
        },
        {
          // ????????????
          title: this.language.responsibleUnit,
          key: 'departmentName',
          width: 200,
          configurable: true,
          searchable: true,
          searchKey: 'departmentIdList',
          searchConfig: {
            type: 'render',
            selectInfo: this.unitList.ids,
            renderTemplate: this.unitNameSearch
          },
        },
        {
          // ?????? ??? ??????
          title: this.language.openStatus, key: 'status', width: 120, isShowSort: true,
          searchKey: 'statusArray',
          searchable: true,
          configurable: true,
          type: 'render',
          renderTemplate: this.isNoStartTemp,
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: [
              // 1 ????????? 2 ?????????
              {label: this.language.disable, value: AlarmEnableStatusEnum.disable},
              {label: this.language.enable, value: AlarmEnableStatusEnum.enable}
            ]
          },
          handleFilter: ($event) => {
          },
        },
        {
          title: this.language.remark, key: 'remark', width: 200, isShowSort: true,
          searchable: true,
          configurable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: this.language.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '',
          width: 120, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      searchReturnType: 'Array',
      operation: [
        {
          // ??????
          text: this.language.update,
          className: 'fiLink-edit',
          permissionCode: '02-3-5-4',
          handle: (currentIndex: AlarmOrderModel) => {
            this.$router.navigate(['business/alarm/alarm-work-order/update'], {
              queryParams: {id: currentIndex.id}
            }).then();
          }
        },
        {
          // ??????
          text: this.language.deleteHandle,
          permissionCode: '02-3-5-5',
          needConfirm: true,
          className: 'fiLink-delete red-icon',
          handle: (data: AlarmOrderModel) => {
            if (data.status === AlarmEnableStatusEnum.enable) {
              this.$message.warning(this.language.openStateDisableDelect);
            } else {
              const ids = data.id;
              if (ids) {
                this.delTemplate([ids]);
              }
            }
          }
        }
      ],
      topButtons: [
        {
          // ??????
          text: this.language.add,
          iconClassName: 'fiLink-add-no-circle',
          permissionCode: '02-3-5-1',
          handle: () => {
            this.$router.navigate(['business/alarm/alarm-work-order/add']).then();
          }
        }, {
          // ????????????
          text: this.language.delete,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          needConfirm: true,
          canDisabled: true,
          permissionCode: '02-3-5-5',
          handle: (data: AlarmOrderModel[]) => {
            if (data.find(item => item.status === AlarmEnableStatusEnum.enable)) {
              this.$message.warning(this.language.openStateDisableDelect);
            } else {
              const ids = data.map(item => item.id);
              if (ids) {
                this.delTemplate(ids);
              }
            }
          }
        }
      ],
      moreButtons: [
        {
          text: this.language.enable,
          iconClassName: 'fiLink-enable',
          permissionCode: '02-3-5-2',
          canDisabled: true,
          handle: (e: AlarmOrderModel[]) => {
            if (e && e.length) {
              this.checkDisableEnableData = e;
              this.enablePopUpConfirm();
            } else {
              this.$message.info(this.language.pleaseCheckThe);
            }
          }
        },
        {
          text: this.language.disable,
          iconClassName: 'fiLink-disable-o',
          permissionCode: '02-3-5-3',
          canDisabled: true,
          handle: (e: AlarmOrderModel[]) => {
            if (e && e.length) {
              this.checkDisableEnableData = e;
              this.disablePopUpConfirm();
            } else {
              this.$message.info(this.language.pleaseCheckThe);
            }
          }
        }
      ],
      leftBottomButtons: [],
      sort: (event: SortCondition) => {
        if (event.sortField === 'alarmOrderRuleDeviceTypeList') {
          this.queryCondition.sortCondition.sortField = 'deviceTypeId';
        } else {
          this.queryCondition.sortCondition.sortField = event.sortField;
        }
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData(this.filterEvent);
      },
      handleSearch: (event: FilterCondition[]) => {
        // ??????????????????
        if (!event.length) {
          this.filterEvent = null;
          // ???????????????????????????
          this.checkAlarmName = new AlarmSelectorInitialValueModel();
          this.initAlarmName();
          this.areaList = new AlarmSelectorInitialValueModel();
          // ??????
          this.initAreaConfig();
          this.unitList = new AlarmSelectorInitialValueModel();
          this.selectUnitName = '';
          this.initUnitConfig();
          this.queryCondition.pageCondition = {pageSize: this.pageBean.pageSize, pageNum: 1};
          this.refreshData();
        } else {
          const filterEvent = new AlarmOrderModel();
          event.forEach((item, index) => {
            filterEvent[item.filterField] = item.filterValue;
            if (item.filterField === 'createTime') {
              //  ????????????
              event.forEach(itemTime => {
                if (itemTime.operator === OperatorEnum.gte) {
                  filterEvent.createTime = itemTime.filterValue;
                }
                if (itemTime.operator === OperatorEnum.lte) {
                  filterEvent.createTimeEnd = itemTime.filterValue;
                }
              });
            }
            // ??????????????????
            if (item.filterField === 'completionTime') {
              filterEvent.completionTime = Number(item.filterValue) ? Number(item.filterValue) : 0;
              filterEvent.completionTimeOperate = OperatorEnum.lte;
            }
          });
          // ????????????
          if (this.areaList && this.areaList.ids && this.areaList.ids.length) {
            // ??????
            filterEvent.alarmOrderRuleArea = this.areaList.ids;
          }
          if (this.checkAlarmName && this.checkAlarmName.ids && this.checkAlarmName.ids.length) {
            // ????????????
            filterEvent.alarmOrderRuleNameList = this.checkAlarmName.ids;
          }
          this.filterEvent = filterEvent;
          this.refreshData(filterEvent);
        }
      }
    };
  }
}

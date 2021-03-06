import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {InspectionOrderDetailUtil} from './inspection-order-detail.util';
import {ActivatedRoute} from '@angular/router';
import {InspectionLanguageInterface} from '../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {NzFormatEmitEvent, NzI18nService} from 'ng-zorro-antd';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {PageModel} from '../../../../shared-module/model/page.model';
import {FilterCondition, QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {InspectionWorkOrderService} from '../../share/service/inspection';
import {InspectionTaskModel} from '../../share/model/inspection-model/inspection-task.model';
import {TreeSelectorConfigModel} from '../../../../shared-module/model/tree-selector-config.model';
import {InspectionWorkOrderDetailModel} from '../../share/model/inspection-model/inspection-work-order-detail.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {WorkOrderPageTypeEnum} from '../../share/enum/work-order-page-type.enum';
import {ScrollPageConst} from '../../share/const/work-order.const';
import {RoleUnitModel} from '../../../../core-module/model/work-order/role-unit.model';
import {
  EnableStatusEnum,
  InspectionTaskStatusEnum,
  IsSelectAllEnum,
  ItemIsPassEnum,
  LastDaysIconClassEnum,
  MultiWorkOrder,
  TaskStatusIconEnum,
  WorkOrderNormalAndAbnormalEnum
} from '../../share/enum/clear-barrier-work-order.enum';
import {InspectionReportModel} from '../../share/model/inspection-report.model';
import {FilterValueModel} from '../../../../core-module/model/work-order/filter-value.model';
import {DepartmentUnitModel} from '../../../../core-module/model/work-order/department-unit.model';
import {EquipmentFormModel} from '../../../../core-module/model/work-order/equipment-form.model';
import {WorkOrderBusinessCommonUtil} from '../../share/util/work-order-business-common.util';
import {OrderUserModel} from '../../../../core-module/model/work-order/order-user.model';
import {InspectionReportParamModel} from '../../share/model/inspection-report-param.model';
import {WorkOrderCommonServiceUtil} from '../../share/util/work-order-common-service.util';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {WorkOrderStatusUtil} from '../../../../core-module/business-util/work-order/work-order-for-common.util';
import {UserForCommonService} from '../../../../core-module/api-service/user';
import {WorkOrderStatusEnum} from '../../../../core-module/enum/work-order/work-order-status.enum';
import {WorkOrderStatusClassEnum} from '../../../../core-module/enum/work-order/work-order-status-class.enum';
import {WorkOrderClearInspectUtil} from '../../share/util/work-order-clear-inspect.util';
import {InspectionReportEquipmentModel} from '../../share/model/inspection-model/inspection-report-equipment.model';
import {InspectionReportDeviceModel} from '../../share/model/inspection-model/inspection-report-device.model';
import {InspectionReportItemModel} from '../../share/model/inspection-model/inspection-report-item.model';
import {UserRoleModel} from '../../../../core-module/model/user/user-role.model';

declare const $: any;

/**
 * ??????????????????/??????????????????/????????????
 */
@Component({
  selector: 'app-unfinished-detail',
  templateUrl: './unfinished-detail-inspection-work-order.component.html',
  styleUrls: ['./unfinished-detail-inspection-work-order.component.scss']
})
export class UnfinishedDetailInspectionWorkOrderComponent implements OnInit, OnDestroy {
  // ??????
  @ViewChild('schedule') schedule: TemplateRef<any>;
  // ????????????
  @ViewChild('statusTemp') statusTemp: TemplateRef<any>;
  // ??????????????????
  @ViewChild('UnitNameSearch') UnitNameSearch: TemplateRef<any>;
  // ?????????
  @ViewChild('roleTemp') roleTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('resultTemp') resultTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('equipTemp') equipTemp: TemplateRef<any>;
  @ViewChild('equipTaskTemp') equipTaskTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('deviceTypeTemp') deviceTypeTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('userSearchTemp') public userSearchTemp: TemplateRef<any>;
  // ?????????
  public InspectionLanguage: InspectionLanguageInterface;
  // ??????title
  public pageTitle: string;
  // ?????????
  public resultData: InspectionWorkOrderDetailModel = new InspectionWorkOrderDetailModel();
  // ???????????????
  public device_dataSet: InspectionTaskModel[] = [];
  // ????????????????????????
  public deviceTableConfig: TableConfigModel;
  // ??????????????????
  public devicePageBean: PageModel = new PageModel();
  // ????????????
  public order_dataSet: InspectionTaskModel[] = [];
  // ??????????????????
  public orderTableConfig: TableConfigModel;
  // ??????????????????
  public orderPageBean: PageModel = new PageModel();
  // ????????????
  public pageType: string;
  // ?????????
  public unitTreeConfig: TreeSelectorConfigModel;
  // ?????????????????????
  public responsibleUnitIsVisible: boolean = false;
  // ????????????
  public selectUnitName: string;
  // ????????????
  public orderTable: boolean = false;
  // ????????????
  public inspectTable: boolean = false;
  // ????????????
  public showReport: boolean = false;
  // ????????????
  public searchValue: string = '';
  // loading
  public isSpinning: boolean = true;
  // ????????????
  public resultOptions: InspectionReportDeviceModel[] = [];
  // ???????????????
  public reportNodes: InspectionReportDeviceModel[] = [];
  // ????????????
  public reportTableConfig: TableConfigModel;
  public reportDataSet: InspectionReportItemModel[] = [];
  public reportPageBean: PageModel = new PageModel();
  // ??????title
  public tableTitle: string = '';
  // ??????????????????
  public deviceVisible: boolean = false;
  // ??????????????????
  public inspectDeviceDataSet: InspectionReportItemModel[] = [];
  // ??????????????????
  public inspectDevicePageBean: PageModel = new PageModel();
  // ??????????????????
  public inspectDeviceTableConfig: TableConfigModel;
  // ??????????????????
  public equipVisible: boolean = false;
  // ??????????????????
  public equipDataSet: EquipmentFormModel[] = [];
  // ??????????????????
  public equipTableConfig: TableConfigModel;
  // ??????????????????
  public equipHeight: string = '';
  // ?????????????????????????????????
  public modalHeight = {
    timeHeight: '110px',
    remarkHeight: '140px'
  };
  // ??????????????????
  public isExpand: boolean = false;
  // ??????????????????
  public pageTypeDetail = WorkOrderPageTypeEnum;
  // ????????????
  public checkUserObject: FilterValueModel = new FilterValueModel();
  // ??????????????????
  public selectUserList: UserRoleModel[] = [];
  // ??????????????????
  public isShowUserTemp: boolean = false;
  // ????????????
  private userFilterValue: FilterCondition;
  // ????????????
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // ??????id
  private inspectionTaskId: string;
  // ????????????
  private clickNum: number = 0;
  // ????????????
  private btnName: string;
  // ?????????
  private unitsTreeNodes: DepartmentUnitModel[] = [];
  // ????????????
  private filterValue: FilterValueModel;
  // ?????????????????????
  private roleArray: RoleUnitModel[] = [];
  // ??????????????????
  private scrollIndex: number = ScrollPageConst.index;
  // ????????????????????????
  private scrollSize: number = ScrollPageConst.size;
  // ????????????
  private deviceQueryCondition: QueryConditionModel = new QueryConditionModel();
  constructor(
    private $activatedRoute: ActivatedRoute,
    private $nzI18n: NzI18nService,
    private $message: FiLinkModalService,
    private $userForCommonService: UserForCommonService,
    private $workOrderCommonUtil: WorkOrderCommonServiceUtil,
    private $inspectionWorkOrderService: InspectionWorkOrderService,
  ) { }

  public ngOnInit(): void {
    this.InspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.btnName = this.InspectionLanguage.handleCancel;
    // ?????????????????????
    InspectionOrderDetailUtil.initInspectDeviceTable(this);
    // ?????????????????????
    InspectionOrderDetailUtil.initEquipmentTable(this);
    this.judgePageJump();
    this.treeSelectConfigLoad();
  }
  public ngOnDestroy(): void {
    // ????????????????????????
    $('#tree-warp').off('scroll');
  }
  /**
   * ??????????????????
   */
  public openUserSelector(filterValue: FilterCondition): void {
    this.isShowUserTemp = true;
    this.userFilterValue = filterValue;
  }

  /**
   * ????????????
   */
  public onSelectUser(event: UserRoleModel[]): void {
    this.selectUserList = event;
    WorkOrderClearInspectUtil.selectUser(event, this);
  }
  /**
   * ??????????????????
   */
  private judgePageJump(): void {
    this.$activatedRoute.queryParams.subscribe(params => {
      this.pageType = params.status;
      this.inspectionTaskId = params.inspectionTaskId;
      if (this.pageType === WorkOrderPageTypeEnum.taskView) {
        // ????????????
        this.inspectTable = true;
        this.pageTitle = this.InspectionLanguage.inspectionInfo;
        this.tableTitle = this.InspectionLanguage.patrolInspectionSheet;
        // ???????????????????????????
        InspectionOrderDetailUtil.initTaskOrderTable(this);
        this.getTaskFormData(params.inspectionTaskId);
        this.refreshData();
      } else if (this.pageType === WorkOrderPageTypeEnum.unfinishedView) {
        // ?????????????????????
        this.inspectionTaskId = params.procId;
        this.equipHeight = '118px';
        this.orderTable = true;
        this.modalHeight = { timeHeight: '110px', remarkHeight: '140px' };
        this.pageTitle = `${this.InspectionLanguage.inspection}${this.InspectionLanguage.inspectionDetail}`;
        this.tableTitle = this.InspectionLanguage.completeInspectionInformation;
        // ???????????????
        InspectionOrderDetailUtil.initOrderTable(this);
        this.getUnfinishedData(params.procId);
        this.refreshOrderData();
      } else if (this.pageType === WorkOrderPageTypeEnum.finished) {
        // ?????????????????????
        this.equipHeight = '82px';
        this.orderTable = true;
        this.modalHeight = { timeHeight: '140px', remarkHeight: '110px' };
        this.inspectionTaskId = params.procId;
        this.pageTitle = `${this.InspectionLanguage.inspection}${this.InspectionLanguage.inspectionDetail}`;
        this.tableTitle = this.InspectionLanguage.completeInspectionInformation;
        // ???????????????
        InspectionOrderDetailUtil.initOrderTable(this);
        this.getFinishedOrderData(params.procId);
        this.refreshOrderData();
      } else if (this.pageType === WorkOrderPageTypeEnum.checkList) {
        // ????????????
        this.showReport = true;
        this.inspectionTaskId = params.procId;
        this.pageTitle = this.InspectionLanguage.inspectReport;
        InspectionOrderDetailUtil.initReportTable(this);
        this.getReportDeviceList();
      }
    });
  }

  /**
   * ??????????????????????????????
   */
  private getTaskFormData(id: string): void {
    this.$inspectionWorkOrderService.getInspectionDetail(id).subscribe((result: ResultModel<InspectionWorkOrderDetailModel>) => {
      if (result.code === ResultCodeEnum.success) {
        const data = result.data;
        // ??????/??????
        data.openStatus = this.InspectionLanguage[WorkOrderBusinessCommonUtil.getEnumKey(data.opened, EnableStatusEnum)];
        data.createTime = WorkOrderBusinessCommonUtil.formatterDate(data.createDate);
        data.taskStartTime = WorkOrderBusinessCommonUtil.formatterDate(data.startTime);
        data.taskEndTime = WorkOrderBusinessCommonUtil.formatterDate(data.endTime);
        data.assignName = '';
        // ?????????
        data.multiWorkOrder = this.InspectionLanguage[WorkOrderBusinessCommonUtil.getEnumKey(data.isMultipleOrder, IsSelectAllEnum)];
        data.multiClass = MultiWorkOrder[WorkOrderBusinessCommonUtil.getEnumKey(data.isMultipleOrder, IsSelectAllEnum)];
        data.lastDays = Math.floor(data.procPlanDate ? data.procPlanDate : 0);
        this.checkLastDay(data);
        for (const k in InspectionTaskStatusEnum) {
          if (k && InspectionTaskStatusEnum[k] === data.inspectionTaskStatus) {
            data.statusName = this.InspectionLanguage[k];
            data.statusClass = TaskStatusIconEnum[k];
            break;
          }
        }
        data.title = data.inspectionTaskName;
        data.inspectionTaskType = this.InspectionLanguage.routineInspection;
        this.resultData = data;
        if (data.equipmentList && data.equipmentList.length > 0) {
          const list = [];
          const equipList = [];
          data.equipmentList.forEach(v => {
            if (list.indexOf(v.equipmentType) === -1) {
              list.push(v.equipmentType);
              equipList.push({
                equipmentTypeName: WorkOrderBusinessCommonUtil.equipTypeNames(this.$nzI18n, v.equipmentType),
                equipIcon: CommonUtil.getEquipmentIconClassName(v.equipmentType)
              });
            }
          });
          this.equipDataSet = equipList;
        }
      }
    });
  }

  /**
   * ???????????????????????????????????????
   */
  private getUnfinishedData(id: string): void {
    this.$inspectionWorkOrderService.getUnfinishedDetail(id).subscribe((result: ResultModel<InspectionWorkOrderDetailModel>) => {
      if (result.code === ResultCodeEnum.success) {
        const data = result.data;
        data.createTime = WorkOrderBusinessCommonUtil.formatterDate(data.createTime);
        data.orderStartTime = WorkOrderBusinessCommonUtil.formatterDate(data.inspectionStartTime);
        data.orderEndTime = WorkOrderBusinessCommonUtil.formatterDate(data.expectedCompletedTime);
        data.statusName = this.InspectionLanguage[WorkOrderStatusEnum[data.status]];
        data.statusClass = WorkOrderStatusClassEnum[data.status];
        if (data.lastDays || data.lastDays === 0) {
          data.lastDays = Number(data.lastDays ? data.lastDays : 0);
        } else {
          data.lastDays = 0;
        }
        this.checkLastDay(data);
        data.equipmentDetailList = [];
        if (data.equipmentType) {
          const list = data.equipmentType.split(',');
          for (let i = 0; i < list.length; i++) {
            const item = {
              name: WorkOrderBusinessCommonUtil.equipTypeNames(this.$nzI18n, list[i]),
              iconClass: CommonUtil.getEquipmentIconClassName(list[i]),
            };
            data.equipmentDetailList.push(item);
          }
        }
        if (data.deviceType) {
          data.deviceName = WorkOrderBusinessCommonUtil.deviceTypeNames(this.$nzI18n, data.deviceType);
          data.deviceIcon = CommonUtil.getFacilityIconClassName(data.deviceType);
        }
        this.resultData = result.data;
      }
    });
  }

  /**
   * ???????????????
   */
  private getFinishedOrderData(id: string): void {
    this.$inspectionWorkOrderService.getFinishedDetail(id).subscribe((result: ResultModel<InspectionWorkOrderDetailModel>) => {
      if (result.code === ResultCodeEnum.success) {
        const data = result.data;
        data.createTime = WorkOrderBusinessCommonUtil.formatterDate(data.createTime);
        data.orderStartTime = WorkOrderBusinessCommonUtil.formatterDate(data.inspectionStartTime);
        data.orderEndTime = WorkOrderBusinessCommonUtil.formatterDate(data.expectedCompletedTime);
        data.realityCompletedTime = WorkOrderBusinessCommonUtil.formatterDate(data.realityCompletedTime);
        data.statusClass = WorkOrderStatusClassEnum[data.status];
        data.statusName = this.InspectionLanguage[WorkOrderStatusEnum[data.status]];
        data.equipmentDetailList = [];
        if (data.equipmentType) {
          const equip = WorkOrderClearInspectUtil.handleMultiEquipment(data.equipmentType, this.$nzI18n);
          data.equipmentDetailList = equip.equipList;
        }
        if (data.deviceType) {
          data.deviceName = WorkOrderBusinessCommonUtil.deviceTypeNames(this.$nzI18n, data.deviceType);
          data.deviceIcon = CommonUtil.getFacilityIconClassName(data.deviceType);
        }
        this.resultData = result.data;
      }
    });
  }

  /**
   * ??????????????????
   * @param data ?????????
   */
  private checkLastDay(data: InspectionWorkOrderDetailModel): void {
    if (data.lastDays >= 1 && data.lastDays <= 3) {
      data.latsDayClass = LastDaysIconClassEnum.lastDay_1;
    } else if (data.lastDays > 3) {
      data.latsDayClass = LastDaysIconClassEnum.lastDay_2;
    } else {
      data.latsDayClass = LastDaysIconClassEnum.lastDay_3;
    }
  }
  /**
   * ??????
   */
  public goBack(): void {
    window.history.back();
  }

  /***
   *  ????????????
   *  @param event ????????????
   */
  public devicePageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * ????????????????????????????????????????????????
   */
  private refreshData(): void {
    this.deviceTableConfig.isLoading = true;
    this.filterRequestParam();
    this.$inspectionWorkOrderService.getDetailList(this.queryCondition).subscribe((result: ResultModel<InspectionTaskModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        const data = result.data || [];
        this.devicePageBean.Total = result.totalCount;
        this.devicePageBean.pageIndex = result.pageNum;
        this.devicePageBean.pageSize = result.size;
        this.deviceTableConfig.isLoading = false;
        data.forEach(item => {
          // ????????????
          if (item.deviceType) {
            item.deviceTypeName = WorkOrderBusinessCommonUtil.deviceTypeNames(this.$nzI18n, item.deviceType);
            if (item.deviceTypeName) {
              item.deviceIcon = CommonUtil.getFacilityIconClassName(item.deviceType);
            } else {
              item.deviceIcon = '';
            }
          }
          item.statusName = WorkOrderStatusUtil.getWorkOrderStatus(this.$nzI18n, item.status);
          item.statusClass = WorkOrderStatusUtil.getWorkOrderIconClassName(item.status);
          // ????????????
          item.equipmentTypeList = [];
          item.equipmentTypeName = '';
          if (item.equipmentType) {
            const equip = WorkOrderClearInspectUtil.handleMultiEquipment(item.equipmentType, this.$nzI18n);
            item.equipmentTypeList = equip.equipList;
            item.equipmentTypeName = equip.names.join(',');
          }
        });
        this.device_dataSet = data;
      }
    }, () => {
      this.deviceTableConfig.isLoading = false;
    });
  }

  /**
   * ????????????
   */
  private filterRequestParam(): void {
    const arr = this.queryCondition.filterConditions.find(item => {
      return item.filterField === 'inspectionTaskId';
    });
    this.queryCondition.filterConditions.forEach(v => {
      if (v.filterField === 'progressSpeed') {
        v.operator = OperatorEnum.lte;
      }
      if (v.filterField === 'assign') {
        v.operator = OperatorEnum.in;
      }
      if (v.filterField === 'equipmentType') {
        v.operator = OperatorEnum.all;
        v.filterField = 'procRelatedEquipment.equipmentType';
      }
      if (v.filterField === 'deviceType') {
        v.operator = OperatorEnum.in;
        v.filterField = 'procRelatedDevices.deviceType';
      }
    });
    if (!arr) {
      this.queryCondition.filterConditions.push({
        filterValue: this.inspectionTaskId,
        filterField: 'inspectionTaskId',
        operator: OperatorEnum.eq,
      });
    } else {
      this.queryCondition.filterConditions.forEach(v => {
        if (v.filterField === 'inspectionTaskId') {
          v.filterValue = this.inspectionTaskId;
        }
      });
    }
  }


  /**
  * ??????????????????
  * @param procId ??????id
   * ???????????????????????????????????????????????????
  */
  private getPicUrlByAlarmIdAndDeviceId(data: InspectionTaskModel): void {
    this.$workOrderCommonUtil.queryImageForView(data.deviceId, data.procId);
  }

  /**
   * ??????????????????
   */
  private refreshOrderData(): void {
    this.orderTableConfig.isLoading = true;
    const arr = this.queryCondition.filterConditions.find(v => {
      return v.filterField === 'procId';
    });
    if (!arr) {
      this.queryCondition.filterConditions.push({
        filterField: 'procId',
        operator: OperatorEnum.eq,
        filterValue: this.inspectionTaskId
      });
    }
    this.queryCondition.filterConditions.forEach(v => {
      if (v.filterField === 'procRelatedDevices.assign') {
        v.operator = OperatorEnum.in;
      }
    });
    this.$inspectionWorkOrderService.getUnfinishedCompleteList(this.queryCondition).subscribe((result: ResultModel<InspectionTaskModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        this.orderPageBean.Total = result.totalCount;
        this.orderPageBean.pageSize = result.size;
        this.orderPageBean.pageIndex = result.pageNum;
        result.data.forEach(item => {
          if (item.result === IsSelectAllEnum.deny) {
            item.result = this.InspectionLanguage[WorkOrderNormalAndAbnormalEnum.normal];
          } else if (item.result === IsSelectAllEnum.right) {
            item.result = this.InspectionLanguage[WorkOrderNormalAndAbnormalEnum.abnormal];
          }
        });
        this.order_dataSet = result.data;
        this.orderTableConfig.isLoading = false;
      }
    }, () => {
      this.orderTableConfig.isLoading = false;
    });
  }

  /**
   * ??????????????????
   * @param event ????????????
   */
  public orderPageChange(event: PageModel) {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshOrderData();
  }

  /**
   * ???????????????????????????
   */
  public showModal(filterValue: FilterValueModel): void {
    if (this.unitsTreeNodes.length === 0) {
      this.$userForCommonService.queryAllDepartment().subscribe((result: ResultModel<DepartmentUnitModel[]>) => {
        if (result.code === ResultCodeEnum.success) {
          this.unitsTreeNodes = result.data || [];
          this.filterValue = filterValue;
          if (!this.filterValue['filterValue']) {
            this.filterValue['filterValue'] = [];
          }
          this.unitTreeConfig.treeNodes = result.data;
          this.responsibleUnitIsVisible = true;
        }
      });
    } else {
      this.responsibleUnitIsVisible = true;
    }
  }
  /**
   * ??????????????????????????????
   */
  private treeSelectConfigLoad(): void {
    this.unitTreeConfig = {
      title: '',
      width: '400px',
      height: '300px',
      treeNodes: this.unitsTreeNodes,
      treeSetting: {
        check: { enable: true, chkStyle: 'radio', radioType: 'all' },
        data: {
          simpleData: { enable: true, idKey: 'id', pIdKey: 'deptFatherId', rootPid: null },
          key: { name: 'deptName', children: 'childDepartmentList' },
        },
        view: { showIcon: false, showLine: false }
      },
      onlyLeaves: false,
      selectedColumn: []
    };
  }
  /**
   * ????????????????????????
   * @param event ???????????????
   */
  public departmentSelectDataChange(event: DepartmentUnitModel[]): void {
    this.selectUnitName = '';
    if (event && event.length > 0) {
      this.selectUnitName = event[0].deptName;
      this.filterValue.filterValue = event[0].deptCode;
      this.filterValue.areaName = event[0].deptName;
      this.filterValue.areaId = event[0].deptCode;
      FacilityForCommonUtil.setTreeNodesStatus(this.unitsTreeNodes, [event[0].id]);
    }
  }
  /**
   * ????????????????????????
   * ??????????????????????????????????????????????????????
   */
  private getAllUnitUser(): void {
    this.$inspectionWorkOrderService.getDepartUserList().subscribe((result: ResultModel<OrderUserModel[]>) => {
      const roleArr = result.data;
      if (roleArr) {
        roleArr.forEach(item => {
          this.roleArray.push({'label': item.userName, 'value': item.id});
        });
      }
    });
  }

  /**
   * ????????????
   */
  public onInputValue(event: string): void {
    const value = CommonUtil.trim(event);
    if (value) {
      this.resultOptions = [];
      this.reportNodes.forEach(v => {
        if (v.title.indexOf(value) > -1) {
          this.resultOptions.push(v);
        }
        if (v.children) {
          v.children.forEach(item => {
            if (item.title.indexOf(value) > -1) {
              this.resultOptions.push(item);
            }
          });
        }
      });
    } else {
      return;
    }
  }

  /**
   * ????????????
   * @param data ?????????
   */
  public changeResult(data: InspectionReportEquipmentModel): void {
    this.searchValue = data.title;
    // ????????????????????????
    const param = new InspectionReportParamModel();
    param.procId = this.inspectionTaskId;
    param.deviceId = data.deviceId;
    param.equipmentId = data.equipmentId;
    this.refreshReportData(param);
  }
  /**
   * ??????checklist
   */
  private getReportDeviceList(): void {
    const param = new InspectionReportParamModel();
    param.procId = this.inspectionTaskId;
    param.deviceName = this.searchValue;
    param.pageNum = this.scrollIndex;
    param.pageSize = this.scrollSize;
    this.$inspectionWorkOrderService.getDeviceList(param).subscribe((result: ResultModel<InspectionReportModel>) => {
      if (result.code === ResultCodeEnum.success) {
        const res = result.data.procRelatedDevices;
        // ???????????????????????????
        if (res && res.length === 0 && this.scrollIndex > 1) {
          this.scrollIndex--;
        }
        const list = res || [];
        list.forEach((v, i) => {
          v.key = v.deviceId;
          v.title = v.deviceName;
          if (v.equipment && v.equipment.length > 0) {
            v.equipment.forEach((item, j) => {
              item.key = item.equipmentId;
              item.title = item.equipmentName;
              item.deviceId = v.deviceId;
              item.isLeaf = true;
            });
          }
          v.children = v.equipment;
        });
        this.reportNodes = this.reportNodes.concat(list);
        // ???????????????????????????????????????????????????
        /*if (this.scrollIndex === 1) {
          this.initScrollLoad();
        }*/
        this.initScrollLoad();
        this.isSpinning = false;
      }
    }, error => {
      this.isSpinning = false;
    });
    $('.ant-table-scroll').height(410);
  }
  /**
   * ?????????????????????
   */
  private initScrollLoad(): void {
    const that = this;
    let flag = true;
    $('#tree-warp').off('scroll').on('scroll', function(e) {
      const timer = setTimeout(function() {
        const event = e;
        const domHeight = $(event.target)[0].clientHeight;
        const topHeight = event.target.scrollTop;
        const scrollHeight = event.target.scrollHeight;
        // ????????????????????????+1??????????????????????????????????????????????????????????????????????????????????????????????????????
        if (flag && scrollHeight > domHeight && (topHeight + domHeight === scrollHeight)) {
          flag = false;
          that.scrollIndex++;
          that.getReportDeviceList();
        }
        clearTimeout(timer);
      }, 1000);
    });
  }
  /**
   * ????????????
   */
  public clickNodes(event: NzFormatEmitEvent): void {
    const data = event.node.origin;
    this.searchValue = '';
    this.resultOptions = [];
    if (this.clickNum === 0) {
      this.clickNum = 1;
    } else {
      this.isExpand = true;
    }
    if (data) {
      if (data.equipmentId) {
        const param = new InspectionReportParamModel();
        param.procId = this.inspectionTaskId;
        param.deviceId = data.deviceId;
        param.equipmentId = data.equipmentId;
        this.refreshReportData(param);
      } else {
        const param = new InspectionReportParamModel();
        param.procId = this.inspectionTaskId;
        param.deviceId = data.deviceId;
        this.refreshReportData(param);
      }
    }
  }
  /**
   * ??????????????????
   * @param event ????????????
   */
  public reportPageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshReportData();
  }

  /**
   * ????????????????????????
   */
  private refreshReportData(data?: InspectionReportParamModel): void {
    this.reportTableConfig.isLoading = true;
    this.$inspectionWorkOrderService.getEquipmentList(data).subscribe((result: ResultModel<InspectionReportItemModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        const list = result.data || [];
        list.forEach(v => {
          if (v.inspectionValue === ItemIsPassEnum.pass) {
            v.statusName = this.InspectionLanguage.passed;
            v.statusClass = 'iconfont icon-fiLink fiLink-success';
          } else if (v.inspectionValue === ItemIsPassEnum.unPass) {
            v.statusName = this.InspectionLanguage.notPass;
            v.statusClass = 'iconfont icon-fiLink fiLink-fail';
          } else {
            v.statusName = '';
            v.statusClass = '';
          }
        });
        this.reportDataSet = list;
        this.reportTableConfig.isLoading = false;
      }
    }, () => {
      this.reportTableConfig.isLoading = false;
    });
  }

  /**
   * ????????????????????????
   */
  public showDeviceTable(): void {
    this.deviceVisible = true;
    this.getDeviceTabListData();
  }

  /**
   * ????????????????????????
   */
  private getDeviceTabListData(): void {
    this.inspectDeviceDataSet = [];
    this.inspectDeviceTableConfig.isLoading = true;
    const obj = this.deviceQueryCondition.filterConditions.find(v => {
        return v.filterField === 'inspectionTaskId';
    });
    if (!obj) {
      this.deviceQueryCondition.filterConditions.push({
        filterField: 'inspectionTaskId',
        operator: OperatorEnum.eq,
        filterValue: this.inspectionTaskId
      });
    }
    this.$inspectionWorkOrderService.queryInspectionDeviceList(this.deviceQueryCondition).subscribe((result: ResultModel<InspectionReportItemModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        this.inspectDevicePageBean.Total = result.totalCount;
        this.inspectDevicePageBean.pageIndex = result.pageNum;
        this.inspectDevicePageBean.pageSize = result.size;
        const list = result.data || [];
        this.inspectDeviceDataSet = list;
        this.inspectDeviceTableConfig.isLoading = false;
      }
    }, () => {
      this.inspectDeviceTableConfig.isLoading = false;
    });
  }
  /**
   * ????????????
   */
  public handleCancel(type: number): void {
    if (type === 1) {
      this.deviceVisible = false;
    } else if (type === 2) {
      this.equipVisible = false;
    }
  }

  /**
   * ????????????
   * @param event ????????????
   */
  public inspectDevicePageChange(event: PageModel): void {
    this.deviceQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.deviceQueryCondition.pageCondition.pageSize = event.pageSize;
    this.getDeviceTabListData();
  }
  /**
   * ????????????????????????
   */
  public showEquipmentTable(): void {
    this.equipVisible = true;
  }
}

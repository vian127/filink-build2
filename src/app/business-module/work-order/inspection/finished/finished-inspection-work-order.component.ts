import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {WorkOrderInitTreeUtil} from '../../share/util/work-order-init-tree.util';
import {NzI18nService} from 'ng-zorro-antd';
import {PageModel} from '../../../../shared-module/model/page.model';
import {ActivatedRoute, Router} from '@angular/router';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {InspectionLanguageInterface} from '../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {InspectionWorkOrderService} from '../../share/service/inspection';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {TreeSelectorConfigModel} from '../../../../shared-module/model/tree-selector-config.model';
import {TableComponent} from '../../../../shared-module/component/table/table.component';
import {WorkOrderLanguageInterface} from '../../../../../assets/i18n/work-order/work-order.language.interface';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {FilterValueModel} from '../../../../core-module/model/work-order/filter-value.model';
import {WorkOrderPageTypeEnum} from '../../share/enum/work-order-page-type.enum';
import {DepartmentUnitModel} from '../../../../core-module/model/work-order/department-unit.model';
import {AreaFormModel} from '../../share/model/area-form.model';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {RoleUnitModel} from '../../../../core-module/model/work-order/role-unit.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {InspectionWorkOrderModel} from '../../../../core-module/model/work-order/inspection-work-order.model';
import {ChartUtil} from '../../../../shared-module/util/chart-util';
import {OrderUserModel} from '../../../../core-module/model/work-order/order-user.model';
import {ChartTypeEnum, ClearBarrierOrInspectEnum, IsSelectAllEnum} from '../../share/enum/clear-barrier-work-order.enum';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {WorkOrderCommonServiceUtil} from '../../share/util/work-order-common-service.util';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {UserForCommonService} from '../../../../core-module/api-service/user';
import {WorkOrderStatusEnum} from '../../../../core-module/enum/work-order/work-order-status.enum';
import {WorkOrderStatusUtil} from '../../../../core-module/business-util/work-order/work-order-for-common.util';
import {WorkOrderBusinessCommonUtil} from '../../share/util/work-order-business-common.util';
import {ExportRequestModel} from '../../../../shared-module/model/export-request.model';
import {InspectionTaskModel} from '../../share/model/inspection-model/inspection-task.model';
import {WorkOrderStatisticalModel} from '../../share/model/clear-barrier-model/work-order-statistical.model';
import {WorkOrderClearInspectUtil} from '../../share/util/work-order-clear-inspect.util';
import {WorkOrderChartColor} from '../../share/const/work-order-chart-color';
import {ChartTypeModel} from '../../share/model/clear-barrier-model/chart-type.model';
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {UserRoleModel} from '../../../../core-module/model/user/user-role.model';

/**
 * ??????????????????
 */
@Component({
  selector: 'app-finished-inspection-work-order',
  templateUrl: './finished-inspection-work-order.component.html',
  styleUrls: ['./finished-inspection-work-order.component.scss']
})
export class FinishedInspectionWorkOrderComponent implements OnInit {
  // ????????????
  @ViewChild('orderTableComponent') orderTableComponent: TableComponent;
  // ????????????
  @ViewChild('statusTemp') statusTemp: TemplateRef<any>;
  // ??????????????????
  @ViewChild('UnitNameSearch') UnitNameSearch: TemplateRef<any>;
  // ??????????????????
  @ViewChild('roleTemp') roleTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('AreaSearch') areaSearch: TemplateRef<any>;
  // ????????????
  @ViewChild('deviceTemps') deviceTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('equipmentTemp') equipmentTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('userSearchTemp') userSearchTemp: TemplateRef<any>;
  // ????????????????????????
  @ViewChild('refUserSearchTemp') refUserSearchTemp: TemplateRef<any>;
  // ???????????????????????????
  public isCompleteVisible: boolean = false;
  // ????????????
  public responsibleUnitIsVisible = false;
  // title?????????????????????
  public title: string;
  // ??????????????????????????????
  public tableDataSet: InspectionWorkOrderModel[] = [];
  // ???????????????????????????
  public seeDataSet: InspectionTaskModel[] = [];
  // ??????
  public pageBean: PageModel = new PageModel(); // ??????
  public seePageBean: PageModel = new PageModel(); // ??????
  // ??????????????????
  public tableConfig: TableConfigModel;
  // ???????????????
  public seeTableConfig: TableConfigModel;
  // ?????????????????????ID
  public completedWorkOrderID: string;
  // ?????????
  public InspectionLanguage: InspectionLanguageInterface;
  // ?????????
  public treeSelectorConfig: TreeSelectorConfigModel;
  // ????????????
  public departFilterValue: FilterCondition = {
    filterField: '',
    operator: '',
    filterValue: '',
    filterName: ''
  };
  // ????????????
  public selectUnitName: string;
  // ????????????input???
  public deviceCountSelectValue = OperatorEnum.eq;
  // ?????????????????????
  public areaSelectorConfig: TreeSelectorConfigModel = new TreeSelectorConfigModel();
  // ????????????
  public areaFilterValue: FilterCondition = {
    filterField: '',
    operator: '',
    filterValue: '',
    filterName: ''
  };
  // ????????????????????????
  public areaSelectVisible: boolean = false;
  // ??????????????????
  public filterObj: FilterValueModel = {
    areaName: '',
    areaId: '',
  };
  // ?????????????????????
  public  workOrderLanguage: WorkOrderLanguageInterface;
  // ???????????????????????????????????????  chart ??????   text ??????
  public deviceTypeStatisticsChartType;
  // ???????????????????????????????????????  chart ??????   text ??????
  public statusChartType: string;
  // ???????????????
  public chartType: ChartTypeModel;
  // ???????????????
  public barChartOption;
  // ????????????
  public canvasLength: number;
  // ????????????????????????
  public inspectCompletedPercent: string;
  // ????????????????????????
  public inspectSingleBackPercent: string;
  // ????????????
  public checkUserObject: FilterValueModel = new FilterValueModel();
  public refCheckUserObject: FilterValueModel = new FilterValueModel();
  // ??????????????????
  public selectUserList: UserRoleModel[] = [];
  public selectRefUserList: UserRoleModel[] = [];
  // ??????????????????
  public isShowUserTemp: boolean = false;
  public isShowRefUserTemp: boolean = false;
  // ????????????
  private userFilterValue: FilterCondition;
  private refUserFilterValue: FilterCondition;
  // ????????????
  private isReset: boolean = false;
  // ?????????
  private deduplication: boolean = false;
  // ??????????????????
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  private scheduleQueryCondition: QueryConditionModel = new QueryConditionModel();
  // ??????
  private exportParams: ExportRequestModel = new ExportRequestModel();
  // ?????????????????????
  private roleArray: RoleUnitModel[] = [];
  // ??????????????????id
  private orderId: string;
  // ????????????input???
  private deviceCountInputValue: string;
  // ??????code
  private areaCode: string;
  // ???????????????
  private unitTreeNodes: DepartmentUnitModel[] = [];
  // ????????????code
  private selectAreaCode: string;
  // ??????????????????
  private filterValue: FilterCondition;
  // ???????????????
  private areaNodes: AreaFormModel[] = [];
  // ??????????????????
  private canvasRadius: number;

  constructor(private $nzI18n: NzI18nService,
              private $router: Router,
              public $message: FiLinkModalService,
              private $activatedRoute: ActivatedRoute,
              private $userService: UserForCommonService,
              private $workOrderCommonUtil: WorkOrderCommonServiceUtil,
              private $inspectionWorkOrderService: InspectionWorkOrderService,
  ) {}

  public ngOnInit(): void {
    this.InspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.workOrderLanguage = this.$nzI18n.getLocaleData(LanguageEnum.workOrder);
    this.canvasRadius = 60;
    this.canvasLength = this.canvasRadius * 2;
    this.chartType = ChartTypeEnum;
    this.initTableConfig();
    this.refreshData();
    this.seeInitTableConfig();
    // ??????????????????
    WorkOrderInitTreeUtil.initTreeSelectorConfig(this);
    // ??????????????????
    WorkOrderInitTreeUtil.initAreaSelectorConfig(this);
    this.getDeviceTypeStatistics();
    this.getStatusStatistics();
    // id??????
    this.$activatedRoute.queryParams.subscribe(param => {
      if (param.id) {
        const arr = this.queryCondition.filterConditions.find(item => {
          return item.filterField === '_id';
        });
        this.orderId = param.id;
        if (!arr) {
          this.queryCondition.filterConditions.push({
            filterField: '_id',
            filterValue: param.id,
            operator: OperatorEnum.eq
          });
        }
        this.isCompleteVisible = false;
        this.queryCondition.pageCondition.pageNum = 1;
        this.refreshData();
      }
    });
  }

  /**
   * ??????????????????
   */
  public openUserSelector(filterValue: FilterCondition,  flag?: boolean): void {
    if (flag) {
      this.isShowRefUserTemp = true;
      this.refUserFilterValue = filterValue;
    } else {
      this.isShowUserTemp = true;
      this.userFilterValue = filterValue;
    }
  }

  /**
   * ????????????
   */
  public onSelectUser(event: UserRoleModel[], flag?: boolean): void {
    if (flag) {
      this.selectRefUserList = event;
      this.refCheckUserObject = {
        userIds: event.map(v => v.id) || [],
        userName: event.map(v => v.userName).join(',') || '',
      };
      this.deduplication = true;
      this.refUserFilterValue.filterValue = this.refCheckUserObject.userIds.length > 0 ? this.refCheckUserObject.userIds : null;
      this.refUserFilterValue.filterName = this.refCheckUserObject.userName;
    } else {
      this.selectUserList = event;
      WorkOrderClearInspectUtil.selectUser(event, this);
    }
  }
  /**
   * ????????????????????????????????????
   */
  private refreshData(): void {
    // ????????????????????????????????????
    this.tableConfig.isLoading = true;
    this.queryCondition.filterConditions.forEach(v => {
      if (v.filterField === 'accountabilityDept' || v.filterField === 'assign') {
        v.operator = OperatorEnum.in;
      }
      this.deduplication = true;
      if (v.filterField === 'equipmentType') {
        v.filterField = 'procRelatedEquipment.equipmentType';
        v.operator = OperatorEnum.all;
      }
      if (v.filterField === 'deviceType') {
        v.operator = OperatorEnum.in;
        v.filterField = 'procRelatedDevices.deviceType';
      }
    });
    // ????????????
    if (!this.isReset) {
      // ???????????????????????? ??????id
      const id = this.$activatedRoute.snapshot.queryParams.id;
      if (id) {
        const arr = this.queryCondition.filterConditions.find(item => {
          return item.filterField === '_id';
        });
        if (!arr) {
          this.queryCondition.filterConditions.push({
            filterField: '_id',
            filterValue: id,
            operator: OperatorEnum.eq
          });
        }
      }
    }
    this.$inspectionWorkOrderService.getFinishedList(this.queryCondition).subscribe((result: ResultModel<InspectionWorkOrderModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        this.pageBean.Total = result.totalPage * result.size;
        this.pageBean.pageIndex = result.pageNum;
        this.pageBean.pageSize = result.size;
        const data = result.data;
        data.forEach(item => {
          if (item.status === WorkOrderStatusEnum.singleBack) {
            item.isShowTurnBackConfirmIcon = true;
          }
          // ?????????????????????class
          if (item.deviceType) {
            item.deviceTypeName = WorkOrderBusinessCommonUtil.deviceTypeNames(this.$nzI18n, item.deviceType);
            if (item.deviceTypeName) {
              item.deviceClass = CommonUtil.getFacilityIconClassName(item.deviceType);
            } else {
              item.deviceClass = '';
            }
          }
          // ????????????
          item.statusClass = WorkOrderStatusUtil.getWorkOrderIconClassName(item.status);
          item.statusName = WorkOrderStatusUtil.getWorkOrderStatus(this.$nzI18n, item.status);
          item.equipmentTypeList = [];
          item.equipmentTypeName = '';
          // ?????????????????????????????????class
          if (item.equipmentType) {
            const equip = WorkOrderClearInspectUtil.handleMultiEquipment(item.equipmentType, this.$nzI18n);
            item.equipmentTypeList = equip.equipList;
            item.equipmentTypeName = equip.names.join(',');
          }
        });
        this.tableDataSet = result.data;
      }
      this.tableConfig.isLoading = false;
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * ?????????????????????????????????
   */
  public refreshCompleteData(id?: string): void {
    this.seeTableConfig.isLoading = true;
    this.scheduleQueryCondition.sortCondition = new SortCondition();
    const param = this.scheduleQueryCondition.filterConditions.find(item => {
      return item.filterField === 'procId';
    });
    if (!param) {
      this.scheduleQueryCondition.filterConditions.push({
        filterField: 'procId',
        filterValue: id,
        operator: OperatorEnum.eq
      });
    } else {
      this.scheduleQueryCondition.filterConditions.forEach(v => {
        if (v.filterField === 'procId') {
          v.filterValue = id;
        }
      });
    }
    this.scheduleQueryCondition.filterConditions.forEach(v => {
      if (v.filterField === 'procRelatedDevices.assign') {
        v.operator = OperatorEnum.in;
      }
    });
    this.$inspectionWorkOrderService.getUnfinishedCompleteList(this.scheduleQueryCondition).subscribe((result: ResultModel<InspectionTaskModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        const list = result.data || [];
        list.forEach(v => {
          if (v.result === IsSelectAllEnum.deny) {
            v.result = this.InspectionLanguage.normal;
          } else if (v.result === IsSelectAllEnum.right) {
            v.result = this.InspectionLanguage.abnormal;
          }
        });
        this.seePageBean.Total = result.totalCount;
        this.seePageBean.pageIndex = result.pageNum;
        this.seePageBean.pageSize = result.size;
        this.seeTableConfig.isLoading = false;
        this.seeDataSet = list;
      }
    }, () => {
      this.seeTableConfig.isLoading = false;
    });
  }

  /**
   * ?????????????????????
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      primaryKey: '06-1-3',
      showSearchSwitch: true,
      showRowSelection: false,
      showSizeChanger: true,
      showSearchExport: true,
      scroll: {x: '1600px', y: '600px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {// ????????????
          title: this.InspectionLanguage.workOrderName, key: 'title', width: 150,
          fixedStyle: {fixedLeft: true, style: {left: '124px'}},
          configurable: false,
          isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {// ????????????
          title: this.InspectionLanguage.workOrderStatus, key: 'status', width: 150,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchKey: 'status',
          searchConfig: {
            type: 'select', selectType: 'multiple', selectInfo: [
              {label: this.InspectionLanguage.completed, value: WorkOrderStatusEnum.completed},
              {label: this.InspectionLanguage.singleBack, value: WorkOrderStatusEnum.singleBack},
            ]
          },
          type: 'render',
          renderTemplate: this.statusTemp,
        },
        {// ??????????????????
          title: this.InspectionLanguage.actualTime, key: 'realityCompletedTime', width: 180,
          pipe: 'date',
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchKey: 'realityCompletedTime',
          searchConfig: {type: 'dateRang'}
        },
        {// ????????????
          title: this.InspectionLanguage.inspectionArea, key: 'inspectionAreaName', width: 150,
          configurable: true,
          isShowSort: true,
          searchable: true,
          searchKey: 'deviceAreaCode',
          searchConfig: {type: 'render', renderTemplate: this.areaSearch},
        },
        {// ????????????
          title: this.InspectionLanguage.facilityType, key: 'deviceType', width: 150,
          configurable: true,
          searchable: true, isShowSort: true,
          searchKey: 'deviceType',
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleFacility(this.$nzI18n),
            label: 'label', value: 'code'
          },
          type: 'render',
          renderTemplate: this.deviceTemp,
        },
        {// ????????????
          title: this.InspectionLanguage.equipmentType, key: 'equipmentType', width: 150,
          configurable: true,
          searchable: true, isShowSort: true,
          searchKey: 'equipmentType',
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n),
            label: 'label', value: 'code'
          },
          type: 'render',
          renderTemplate: this.equipmentTemp,
        },
        {// ????????????
          title: this.InspectionLanguage.responsibleUnit, key: 'accountabilityDeptName', width: 150,
          configurable: true,
          searchable: true, isShowSort: true,
          searchKey: 'accountabilityDept',
          searchConfig: {type: 'render', renderTemplate: this.UnitNameSearch}
        },
        {// ?????????
          title: this.InspectionLanguage.responsible, key: 'assignName', width: 190,
          configurable: true,
          searchable: true, isShowSort: true,
          searchKey: 'assign',
          searchConfig: {type: 'render', renderTemplate: this.userSearchTemp},
        },
        {// ??????
          title: this.InspectionLanguage.operate, searchable: true, configurable: false,
          searchConfig: {type: 'operate'}, key: '', width: 180, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: false,
      showEsPagination: true,
      bordered: false,
      showSearch: false,
      operation: [
        {
          // ?????????????????????
          text: this.InspectionLanguage.viewDetail,
          permissionCode: '06-1-3-2',
          className: 'fiLink-ref-order bold-icon',
          handle: (currentIndex: InspectionWorkOrderModel) => {
            this.title = this.InspectionLanguage.completeInspectionInformation;
            this.completedWorkOrderID = currentIndex.procId;
            const id = currentIndex.procId;
            this.isCompleteVisible = true;
            this.refreshCompleteData(id);
          }
        },
        { // ??????????????????
          text: this.InspectionLanguage.inspectReport,
          permissionCode: '06-1-3-1',
          className: 'fiLink-reports bold-icon',
          handle: (currentIndex: InspectionWorkOrderModel) => {
            const id = currentIndex.procId;
            this.$router.navigate([`/business/work-order/inspection/finished-detail/finished-inspectReport`],
              {queryParams: {procId: id, status: WorkOrderPageTypeEnum.checkList}}).then();
          }
        },
        { // ??????
          text: this.InspectionLanguage.inspectionDetail,
          permissionCode: '06-1-3-3',
          className: 'fiLink-view-detail bold-icon',
          handle: (currentIndex: InspectionWorkOrderModel) => {
            const id = currentIndex.procId;
            this.$router.navigate([`/business/work-order/inspection/unfinished-detail/finishedView`],
              {queryParams: {procId: id, status: WorkOrderPageTypeEnum.finished}});
          }
        },
        { // ????????????
          text: this.InspectionLanguage.regenerate,
          permissionCode: '06-1-3-4',
          className: 'fiLink-rebuild-order bold-icon',
          key: 'isShowTurnBackConfirmIcon',
          confirmContent: this.InspectionLanguage.isItRegenerated,
          handle: (currentIndex: InspectionWorkOrderModel) => {
            const id = currentIndex.procId;
            this.$workOrderCommonUtil.queryDataRole(currentIndex.procId, ClearBarrierOrInspectEnum.inspection).then(flag => {
              if (flag) {
                this.$router.navigate([`/business/work-order/inspection/unfinished-detail/restUpdate`],
                  {queryParams: {procId: id, type: WorkOrderPageTypeEnum.restUpdate, status: WorkOrderStatusEnum.assigned, route: WorkOrderPageTypeEnum.finished}}).then();
              }
            });
          }
        }
      ],
      sort: (event: SortCondition) => {
        if (event.sortField === 'equipmentType') {
          event.sortField = 'procRelatedEquipment.equipmentType';
        }
        if (event.sortField === 'deviceType') {
          event.sortField = 'procRelatedDevices.deviceType';
        }
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      handleSearch: (event: FilterCondition[]) => {
        if (event && event.length === 0) {
          this.isReset = true;
          this.filterObj.areaName = '';
          FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes || [], null);
          this.selectUnitName = '';
          FacilityForCommonUtil.setTreeNodesStatus(this.unitTreeNodes, []);
          this.deviceCountInputValue = '';
          this.deviceCountSelectValue = OperatorEnum.eq;
          this.selectUserList = [];
        }
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      },
      handleExport: (event) => {
        this.exportParams.columnInfoList = event.columnInfoList;
        this.exportParams.columnInfoList.forEach(item => {
          if (item.propertyName === 'status' || item.propertyName === 'realityCompletedTime' || item.propertyName === 'deviceType' || item.propertyName === 'equipmentType') {
            item.isTranslation = 1;
          }
        });
        // ??????????????????
        this.exportParams.queryCondition = this.queryCondition;
        this.exportParams.excelType = event.excelType;
        // ??????????????????
        this.$inspectionWorkOrderService.completionRecordExport(this.exportParams).subscribe((result: ResultModel<string>) => {
          if (result.code === ResultCodeEnum.success) {
            this.$message.success(result.msg);
          } else {
            this.$message.error(result.msg);
          }
        });
      }
    };
  }

  /**
   * ??????????????????????????????????????????
   */
  private seeInitTableConfig(): void {
    this.seeTableConfig = {
      isDraggable: false,
      primaryKey: '06-1-3-1',
      isLoading: false,
      showSearchSwitch: true,
      showRowSelection: false,
      showSizeChanger: true,
      showSearchExport: false,
      notShowPrint: true,
      scroll: {x: '1600px', y: '600px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {// ????????????
          title: this.InspectionLanguage.inspectionFacility, key: 'deviceName', width: 200,
          isShowSort: true, configurable: true, searchable: true,
          searchKey: 'procRelatedDevices.deviceName',
          searchConfig: {type: 'input'}
        },
        {// ????????????
          title: this.InspectionLanguage.inspectionResults, key: 'result', width: 200,
          searchable: true, configurable: true, isShowSort: true,
          searchKey: 'procRelatedDevices.result',
          searchConfig: {
            type: 'select',
            selectInfo: [
              {label: this.InspectionLanguage.normal, value: IsSelectAllEnum.deny},  // ??????
              {label: this.InspectionLanguage.abnormal, value: IsSelectAllEnum.right},   // ??????
            ]
          },
        },
        {// ????????????
          title: this.InspectionLanguage.exceptionallyDetailed, key: 'remark', width: 200,
          searchable: true, configurable: true, isShowSort: true,
          searchKey: 'procRelatedDevices.remark',
          searchConfig: {type: 'input'}
        },
        {// ????????????
          title: this.InspectionLanguage.inspectionTime, key: 'inspectionTime', width: 200,
          pipe: 'date',
          searchable: true, configurable: true, isShowSort: true,
          searchKey: 'procRelatedDevices.inspectionTime',
          searchConfig: {type: 'dateRang'}
        },
        {// ?????????
          title: this.InspectionLanguage.responsible, key: 'assignName', width: 200,
          configurable: true, searchable: true,
          searchKey: 'procRelatedDevices.assign',
          searchConfig: {type: 'render', renderTemplate: this.refUserSearchTemp},
        },
        {// ??????????????????
          title: this.InspectionLanguage.matchingOfResources, key: 'resourceMatching', width: 200,
          searchable: true, configurable: true,
          searchConfig: {type: 'input'}
        },
        {// ????????????
          title: this.InspectionLanguage.relatedPictures, searchable: true,
          searchConfig: {type: 'operate'}, width: 200, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      operation: [
        {
          text: this.InspectionLanguage.viewDetail,
          className: 'fiLink-view-photo',
          handle: (currentIndex) => {
            this.$workOrderCommonUtil.queryImageForView(currentIndex.deviceId, currentIndex.procId);
          }
        },
      ],
      sort: (event: SortCondition) => {
        if (event.sortField !== 'resourceMatching') {
          this.scheduleQueryCondition.sortCondition.sortField = `procRelatedDevices.${event.sortField}`;
        } else {
          this.scheduleQueryCondition.sortCondition.sortField = event.sortField;
        }
        this.scheduleQueryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshCompleteData(this.completedWorkOrderID);
      },
      handleSearch: (event: FilterCondition[]) => {
        this.scheduleQueryCondition.pageCondition.pageNum = 1;
        this.scheduleQueryCondition.filterConditions = event;
        if (event.length === 0) {
          this.selectRefUserList = [];
        }
        this.refreshCompleteData(this.completedWorkOrderID);
      },
    };
  }

  /**
   * ??????????????????
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }

  /**
   * ???????????????
   */
  public seePageChange(event: PageModel): void {
    this.scheduleQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.scheduleQueryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshCompleteData(this.completedWorkOrderID);
  }

  /**
   * ????????????
   */
  public closeModal(): void {
    this.isCompleteVisible = false;
    this.seePageBean = new PageModel();
    this.scheduleQueryCondition = new QueryConditionModel();
    this.orderTableComponent.handleRest();
    this.seeDataSet = [];
    this.seeTableConfig.showSearch = false;
    this.selectRefUserList = [];
  }

  /**
   * ???????????????????????????
   */
  public showModal(filterValue: FilterCondition): void {
    this.departFilterValue = filterValue;
    if (this.unitTreeNodes.length === 0) {
      this.queryDeptList().then((bool) => {
        if (bool) {
          this.filterValue = filterValue;
          if (!this.filterValue.filterValue) {
            this.filterValue.filterValue = null;
          }
          this.treeSelectorConfig.treeNodes = this.unitTreeNodes;
          this.responsibleUnitIsVisible = true;
        }
      });
    } else {
      this.responsibleUnitIsVisible = true;
    }
  }

  /**
   * ????????????????????????
   * param event
   */
  public selectDataChange(event: DepartmentUnitModel[]): void {
    this.selectUnitName = '';
    if (event && event.length > 0) {
      this.selectUnitName = event[0].deptName;
      this.filterValue.filterValue = [event[0].deptCode];
      this.departFilterValue.filterName = this.selectUnitName;
      FacilityForCommonUtil.setTreeNodesStatus(this.unitTreeNodes, [event[0].id]);
    }
  }

  /**
   * ????????????
   */
  private queryDeptList(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.$userService.queryAllDepartment().subscribe((result: ResultModel<DepartmentUnitModel[]>) => {
        this.unitTreeNodes = result.data || [];
        resolve(true);
      }, (error) => {
        reject(error);
      });
    });
  }

  /**
   * ????????????????????????
   */
  public getAllUser(event: boolean): void {
    if (!event || this.roleArray.length > 0) {
      return;
    }
    this.$inspectionWorkOrderService.getDepartUserList().subscribe((result: ResultModel<OrderUserModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        const list = result.data || [];
        list.forEach(item => {
          this.roleArray.push({'label': item.userName, 'value': item.id});
        });
      }
    });
  }


  /**
   * ??????????????????
   */
  public showArea(filterValue: FilterCondition): void {
    this.areaFilterValue = filterValue;
    // ?????????????????????????????????
    if (this.areaNodes.length > 0) {
      this.areaSelectorConfig.treeNodes = this.areaNodes;
      this.areaSelectVisible = true;
    } else {
      // ??????????????????
      this.$workOrderCommonUtil.getRoleAreaList().then((data: any[]) => {
        this.areaNodes = data;
        this.areaCode = '';
        this.areaSelectorConfig.treeNodes = this.areaNodes;
        FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, null);
        this.areaSelectVisible = true;
      });
    }
  }

  /**
   * ??????????????????
   * param item
   */
  public areaSelectChange(item: AreaFormModel): void {
    if (item && item[0]) {
      this.areaFilterValue.filterValue = item[0].areaCode;
      this.selectAreaCode = item[0].areaCode;
      this.areaFilterValue.filterName = item[0].areaName;
      FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, item[0].areaId, item[0].areaId);
    } else {
      this.areaFilterValue.filterValue = null;
      this.areaFilterValue.filterName = '';
    }
  }

  /**
   * ????????????
   */
  private getDeviceTypeStatistics(): void {
    this.$inspectionWorkOrderService.inspectDeviceTypes({}).subscribe((result: ResultModel<WorkOrderStatisticalModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        if (result.data.length === 0) {
          this.deviceTypeStatisticsChartType = ChartTypeEnum.text;
        } else {
          this.deviceTypeStatisticsChartType = ChartTypeEnum.chart;
          const name = [], data = [];
          const list = FacilityForCommonUtil.getRoleFacility(this.$nzI18n);
          // ??????????????????????????????????????????
          result.data.forEach(item => {
            for (let i = 0; i < list.length; i++) {
              if (list[i].code === item.deviceType) {
                data.push({
                  value: item.count,
                  itemStyle: {color: WorkOrderChartColor[WorkOrderBusinessCommonUtil.getEnumKey(item.deviceType, DeviceTypeEnum)]}
                });
                name.push(list[i].label);
                break;
              }
            }
          });
          this.barChartOption = ChartUtil.setWorkBarChartOption(data, name);
        }
      } else {
        this.$message.error(result.msg);
        this.deviceTypeStatisticsChartType = ChartTypeEnum.text;
      }
    });
  }

  /**
   * ????????????????????????
   */
  private getStatusStatistics(): void {
    this.$inspectionWorkOrderService.inspectStatusStatistic({}).subscribe((result: ResultModel<WorkOrderStatisticalModel[]>) => {
      let completedCount: number;
      let singleBackCount: number;
      let totalCount = 0;
      let statusList = [];
      if (result.code === ResultCodeEnum.success) {
        if (!result.data || result.data.length === 0) {
          this.statusChartType = ChartTypeEnum.text;
        } else {
          this.statusChartType = ChartTypeEnum.chart;
          // ????????????
          result.data.forEach(item => {
            if (item.orderStatus === WorkOrderStatusEnum.completed) {
              completedCount = item.percentage;
            } else if (item.orderStatus === WorkOrderStatusEnum.singleBack) {
              singleBackCount = item.percentage;
            }
          });
          if (result.data.length) {
            statusList = result.data;
            totalCount = statusList.reduce((a, b) => a.percentage + b.percentage);
          }
        }
      } else {
        const list = [ { 'orderStatus': WorkOrderStatusEnum.completed, 'percentage': 0 }, { 'orderStatus': WorkOrderStatusEnum.singleBack, 'percentage': 0 } ];
        this.statusChartType = ChartTypeEnum.chart;
        list.forEach(res => {
          if (res.orderStatus === WorkOrderStatusEnum.completed) {
            completedCount = res.percentage;
          } else if (res.orderStatus === WorkOrderStatusEnum.singleBack) {
            singleBackCount = res.percentage;
          }
        });
      }
      setTimeout(() => {
        this.getPercent('canvas_completed', '#ffa145', completedCount, totalCount);
        this.getPercent('canvas_singleBack', '#ff7474', singleBackCount, totalCount);
        this.inspectCompletedPercent = `${completedCount}%`;
        this.inspectSingleBackPercent = `${singleBackCount}%`;
      }, 10);
    });
  }

  /**
   * ??????????????????
   */
  private getPercent(id: string, color: string, num: number, total: number): void {
    const endingAngle = (-0.5 + (num / total) * 2) * Math.PI;
    // ??????
    try {
      const cvs = document.getElementById(id);
      const mains = cvs['getContext']('2d');
      const ctX = this.canvasRadius;
      const ctY = this.canvasRadius;
      const startingAngle = -0.5 * Math.PI;
      mains.beginPath();
      mains.strokeStyle = '#eff0f4';
      mains.lineWidth = 8;
      // ????????????,??????????????????????????????
      const radiusNum = this.canvasRadius - mains.lineWidth / 2;
      // ???????????????
      mains.arc(ctX, ctY, radiusNum, 0, 2 * Math.PI);
      mains.stroke();
      mains.beginPath();
      // ???????????????
      mains.strokeStyle = color;
      mains.arc(ctX, ctY, radiusNum, startingAngle, endingAngle);
      mains.stroke();
    } catch (e) {}
  }
}

import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {WorkOrderInitTreeUtil} from '../../share/util/work-order-init-tree.util';
import {PageModel} from '../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {ActivatedRoute, Router} from '@angular/router';
import {NzI18nService} from 'ng-zorro-antd';
import {InspectionLanguageInterface} from '../../../../../assets/i18n/inspection-task/inspection.language.interface';
import {InspectionTaskOrder} from './inspection-ref-order-table.util';
import {InspectionWorkOrderService} from '../../share/service/inspection';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {TreeSelectorConfigModel} from '../../../../shared-module/model/tree-selector-config.model';
import {TableComponent} from '../../../../shared-module/component/table/table.component';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {InspectionTaskModel} from '../../share/model/inspection-model/inspection-task.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {DeleteInspectionTaskModel} from '../../share/model/inspection-model/delete-inspection-task.model';
import {DepartmentUnitModel} from '../../../../core-module/model/work-order/department-unit.model';
import {FilterValueModel} from '../../../../core-module/model/work-order/filter-value.model';
import {AreaFormModel} from '../../share/model/area-form.model';
import {RoleUnitModel} from '../../../../core-module/model/work-order/role-unit.model';
import {OrderUserModel} from '../../../../core-module/model/work-order/order-user.model';
import {WorkOrderCommonServiceUtil} from '../../share/util/work-order-common-service.util';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {WorkOrderBusinessCommonUtil} from '../../share/util/work-order-business-common.util';
import {EnablePermissionEnum, EnableStatusEnum, InspectionTaskStatusEnum} from '../../share/enum/clear-barrier-work-order.enum';
import {WorkOrderStatusUtil} from '../../../../core-module/business-util/work-order/work-order-for-common.util';
import {UserForCommonService} from '../../../../core-module/api-service/user';
import {ExportRequestModel} from '../../../../shared-module/model/export-request.model';
import {DeviceFormModel} from '../../../../core-module/model/work-order/device-form.model';
import {WorkOrderClearInspectUtil} from '../../share/util/work-order-clear-inspect.util';
import {ListExportModel} from '../../../../core-module/model/list-export.model';
import {UserRoleModel} from '../../../../core-module/model/user/user-role.model';

/**
 * ????????????????????????
 */
@Component({
  selector: 'app-inspection-task',
  templateUrl: './inspection-task.component.html',
  styleUrls: ['./inspection-task.component.scss'],
})

export class InspectionTaskComponent implements OnInit, OnDestroy {
  // ????????????
  @ViewChild('areaSearch') areaSearch: TemplateRef<any>;
  // ????????????
  @ViewChild('tableComponent') tableComponent: TableComponent;
  // ????????????
  @ViewChild('templateStatus') templateStatusTemp: TemplateRef<any>;
  // ??????????????????????????????
  @ViewChild('statusTemp') statusTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('unitNameSearch') unitNameSearch: TemplateRef<any>;
  // orderUnitNameSearch
  @ViewChild('orderUnitNameSearch') orderUnitNameSearch: TemplateRef<any>;
  // ??????
  @ViewChild('schedule') schedule: TemplateRef<any>;
  // ?????????
  @ViewChild('roleTemp') roleTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('taskPeriodPeTemp') taskPeriodPeTemp: TemplateRef<any>;
  // ??????????????????
  @ViewChild('procPlanDateTemp') procPlanDateTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('deviceCountTemp') deviceCountTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('equipTemp') equipTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('deviceTypeTemp') deviceTypeTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('userSearchTemp') public userSearchTemp: TemplateRef<any>;
  // ???????????????????????????
  public language: InspectionLanguageInterface;
  // ?????????????????????
  public InspectionLanguage: InspectionLanguageInterface;
  // ????????????
  public areaSelectorConfig: TreeSelectorConfigModel;
  // ????????????
  public areaFilterValue: FilterCondition = {
    filterField: '',
    operator: '',
    filterValue: '',
    filterName: ''
  };
  // ???????????????????????????id
  public treeSelectorConfig: TreeSelectorConfigModel;
  // ????????????
  public departFilterValue: FilterCondition = {
    filterField: '',
    operator: '',
    filterValue: '',
    filterName: ''
  };
  // ????????????????????????
  public tableConfig: TableConfigModel;
  // ????????????????????????
  public pageBean: PageModel = new PageModel(10, 1, 1);
  // ??????????????????????????????
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // ????????????????????????
  public associatedWorkOrderTableConfig: TableConfigModel;
  // ????????????????????????
  public associatedWorkOrderPageBean: PageModel = new PageModel(10, 1, 1);
  // ????????????
  public exportParams: ExportRequestModel = new ExportRequestModel();
  // ????????????????????????
  public tsakDataList: InspectionTaskModel[] = [];
  // ????????????
  public areaName: string = '';
  // ????????????
  public areaSelectVisible: boolean = false;
  public filterValue: FilterCondition;
  // ???????????????????????????
  public hasData;
  // ??????????????????????????????
  public isAssociatedWorkOrderVisible: boolean = false;
  // ??????????????????
  public inspectionTaskTitle: string;
  // ????????????????????????
  public associatedWorkOrder_dataSet: InspectionTaskModel[] = [];
  // ??????????????????
  public orderFilterValue: FilterValueModel;
  public selectOrderUnitName: string = '';
  // ?????????????????????????????????id
  public id: string;
  // ????????????id
  public procId: string;
  // ???????????????????????????
  public isVisible: boolean = false;
  public isOrderVisible: boolean = false;
  // ????????????????????????
  public selectUnitName: string = '';
  // title?????????????????????
  public title: string;
  // ?????????????????????
  public roleArray: RoleUnitModel[] = [];
  // ??????
  public areaList: FilterValueModel = {
    ids: [],
    name: ''
  };
  // ????????????
  public Status;
  // ??????code??????
  public Permission;
  // ???????????????????????????
  public inspectionObjectVisible: boolean = false;
  // ??????????????????id
  public inspectObjectId: string = '';
  // ??????????????????
  public filterObj: FilterValueModel = {
    areaName: '',
    areaId: '',
  };
  // ??????????????????
  public isShowSwitch: boolean = false;
  // ????????????
  public checkUserObject: FilterValueModel = new FilterValueModel();
  // ??????????????????
  public selectUserList: UserRoleModel[] = [];
  // ??????????????????
  public isShowUserTemp: boolean = false;
  // ????????????
  private userFilterValue: FilterCondition;
  // ????????????
  private disabledOrEnable: string;
  // ????????????code
  private selectUnitCode: string;
  // ??????????????????
  private areaNodes: AreaFormModel[] = [];
  // ????????????????????????
  private associatedWorkOrderQueryCondition: QueryConditionModel = new QueryConditionModel();
  // ????????????
  private unitTreeNodes: DepartmentUnitModel[] = [];
  // ???????????????????????????
  private taskPeriodInputValue: number;
  // ??????????????????????????????
  private taskPeriodSelectedValue = OperatorEnum.lte;
  // ?????????????????????????????????
  private procPlanDateInputValue: number;
  // ????????????????????????????????????
  private procPlanDateSelectedValue = OperatorEnum.lte;
  // ???????????????????????????
  private deviceCountInputValue: number;
  // ??????????????????????????????
  private deviceCountSelectedValue = OperatorEnum.lte;
  constructor(public $nzI18n: NzI18nService,
              private $activatedRoute: ActivatedRoute,
              private $router: Router,
              private $message: FiLinkModalService,
              private $userService: UserForCommonService,
              private $workOrderCommonUtil: WorkOrderCommonServiceUtil,
              private $inspectionWorkOrderService: InspectionWorkOrderService,
  ) { }

  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    this.InspectionLanguage = this.$nzI18n.getLocaleData(LanguageEnum.inspection);
    // ?????????????????????
    InspectionTaskOrder.initTableConfig(this);
    // ???????????????????????????
    InspectionTaskOrder.initTableConfigAssociatedWorkOrder(this);
    this.Status = EnableStatusEnum;
    this.Permission = EnablePermissionEnum;
    this.refreshData();
    // ??????????????????
    WorkOrderInitTreeUtil.initTreeSelectorConfig(this);
    // ??????????????????
    WorkOrderInitTreeUtil.initAreaSelectorConfig(this);
  }
  public ngOnDestroy(): void {
    this.tableComponent = null;
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
   *????????????????????????
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    // ????????????????????????id??????
    if ('id' in this.$activatedRoute.snapshot.queryParams) {
      if (!this.queryCondition.filterConditions.some(item => item.filterField === 'optObjId')) {
        this.queryCondition.bizCondition.inspectionTaskIds = [this.$activatedRoute.snapshot.queryParams.id];
      }
    } else {
      this.queryCondition.filterConditions = this.queryCondition.filterConditions.filter(item => item.filterField !== 'optObjId');
    }
    this.$inspectionWorkOrderService.getWorkOrderList(this.queryCondition).subscribe((result: ResultModel<InspectionTaskModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        this.pageBean.Total = result.totalCount;
        this.pageBean.pageIndex = result.pageNum;
        this.pageBean.pageSize = result.size;
        this.tableConfig.isLoading = false;
        const data = result.data ? result.data : [];
        data.forEach(item => {
          item.inspectionTaskStatus = WorkOrderBusinessCommonUtil.taskStatus(this.$nzI18n, item.inspectionTaskStatus);
          item.inspectionTaskType = WorkOrderBusinessCommonUtil.taskType(this.$nzI18n, item.inspectionTaskType);
          item.isShowEditIcon = item.inspectionTaskStatus !== InspectionTaskStatusEnum.completed;
        });
        this.tsakDataList = result.data;
      } else {
        this.tableConfig.isLoading = false;
        this.$message.error(result.msg);
      }
    }, () => {
      this.tableConfig.isLoading = false;
    });
  }
  /**
   *??????????????????
   * @param event ????????????
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshData();
  }
  /**
   * ????????????????????????
   * ????????????????????????????????????????????????
   */
  private handleSearch(event: InspectionTaskModel): void {
    this.queryCondition.bizCondition = this.setBizCondition(event);
    // ??????
    if (this.taskPeriodInputValue || this.taskPeriodSelectedValue) {
      this.queryCondition.bizCondition.taskPeriod = this.taskPeriodInputValue;
      this.queryCondition.bizCondition.taskPeriodOperate = this.taskPeriodSelectedValue;
    }
    // ????????????
    if (this.procPlanDateInputValue || this.procPlanDateSelectedValue) {
      this.queryCondition.bizCondition.procPlanDate = this.procPlanDateInputValue;
      this.queryCondition.bizCondition.procPlanDateOperate = this.procPlanDateSelectedValue;
    }
    // ????????????
    if (this.deviceCountInputValue || this.deviceCountSelectedValue) {
      this.queryCondition.bizCondition.inspectionDeviceCount = this.deviceCountInputValue;
      this.queryCondition.bizCondition.inspectionDeviceCountOperate = this.deviceCountSelectedValue;
    }
    this.queryCondition.pageCondition.pageNum = 1;
  }

  /**
   * ??????????????????????????????
   */
  private setBizCondition(event: InspectionTaskModel): InspectionTaskModel {
    const _bizCondition = CommonUtil.deepClone(event);
    if (_bizCondition.inspectionTaskStatus) {
      _bizCondition.inspectionTaskStatusList = CommonUtil.deepClone(_bizCondition.inspectionTaskStatus);
      delete _bizCondition.inspectionTaskStatus;
    }
    if (_bizCondition.startTime) {
      _bizCondition.startTimes = CommonUtil.deepClone(_bizCondition.startTime).map(item => {
        return CommonUtil.getSeconds(item);
      });
      delete _bizCondition.startTime;
    }
    if (_bizCondition.endTime) {
      _bizCondition.endTimes = CommonUtil.deepClone(_bizCondition.endTime).map(item => {
        return CommonUtil.getSeconds(item);
      });
      delete _bizCondition.endTime;
    }
    if (_bizCondition.inspectionTaskType) {
      _bizCondition.inspectionTaskTypes = CommonUtil.deepClone(_bizCondition.inspectionTaskType);
      delete _bizCondition.inspectionTaskType;
    }
    return _bizCondition;
  }
  /**
   * ??????????????????
   */
  public clickSwitch(data: InspectionTaskModel): void {
    this.isShowSwitch = true;
    const id = [];
    id.push(data.inspectionTaskId);
    this.checkData(id).then((bool) => {
      if (bool === true) {
        const inspectionTaskId = {
          inspectionTaskIds: [data.inspectionTaskId]
        };
        data.clicked = false;
        data.opened === '0' ? this.enableStatus(inspectionTaskId) : this.disableStatus(inspectionTaskId);
        data.clicked = true;
      } else {
        this.$message.error(`${this.language.theInspectionTaskNoLongerExistsTip}`);
        this.refreshData();
      }
    });
  }
  /**
   * ????????????????????????
   */
  private enableStatus(id: {inspectionTaskIds: string[]}): void {
    this.$inspectionWorkOrderService.enableInspectionTask(id).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.disabledOrEnable = EnableStatusEnum.enable;
        this.$message.success(this.language.operateMsg.successful);
        this.isShowSwitch = false;
        this.refreshData();
      } else {
        this.isShowSwitch = false;
        this.$message.error(result.msg);
        this.refreshData();
      }
    }, error => {
      this.isShowSwitch = false;
    });
  }
  /**
   * ????????????????????????
   */
  private disableStatus(id: {inspectionTaskIds: string[]}): void {
    this.$inspectionWorkOrderService.disableInspectionTask(id).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.language.operateMsg.successful);
        this.isShowSwitch = false;
        this.refreshData();
      } else {
        this.isShowSwitch = false;
        this.$message.error(result.msg);
        this.refreshData();
      }
    }, error => {
      this.isShowSwitch = false;
    });
  }
  /**
   * ????????????????????????
   * ????????????????????????????????????????????????
   */
  private deleteTemplate(inspectionTask: DeleteInspectionTaskModel): void {
    this.$inspectionWorkOrderService.deleteWorkOrderByIds(inspectionTask).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.language.operateMsg.deleteSuccess);
        // ??????????????????????????????
        this.queryCondition.pageCondition.pageNum = 1;
        this.refreshData();
      } else {
        this.$message.error(result.msg);
      }
    });
  }
  /**
   *???????????? ?????????????????????
   * ????????????????????????????????????????????????
   */
  private inspectionTaskDetail(type: string, inspectionTaskId?: string, opened?: string, status?: string) {
    return this.$router.navigate([`/business/work-order/inspection/task-detail/${type}`],
      {queryParams: {inspectionTaskId: inspectionTaskId, opened: opened, status: status}});
  }

  /**
   * ????????????????????????
   * ????????????????????????????????????????????????
   */
  private handleSort(event: SortCondition): void {
    this.queryCondition.sortCondition.sortField = event.sortField;
    this.queryCondition.sortCondition.sortRule = event.sortRule;
  }

  /**
   * ????????????????????????
   * ????????????????????????????????????????????????
   */
  private handleExport(event: ListExportModel<InspectionTaskModel[]>): void {
    // ????????????????????????
    this.exportParams.queryCondition = this.queryCondition;
    if (event.selectItem.length > 0) {
      this.exportParams.queryCondition.bizCondition.inspectionTaskIds = event.selectItem.map(item => item.inspectionTaskId);
    }
    this.exportParams.excelType = event.excelType;
    // ??????????????????
    this.$inspectionWorkOrderService.exportInspectionTask(this.exportParams).subscribe((result: ResultModel<string>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.language.operateMsg.exportSuccess);
      } else {
        this.$message.error(result.msg);
      }
    });
  }
  /**
   *??????????????????
   */
  public pageChangeAssociatedWorkOrder(event: PageModel) {
    this.associatedWorkOrderQueryCondition.pageCondition.pageNum = event.pageIndex;
    this.associatedWorkOrderQueryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshAssociatedWorkOrderData();
  }

  /**
   * ??????????????????????????????
   */
  private refreshAssociatedWorkOrderData(): void {
    this.associatedWorkOrderTableConfig.isLoading = true;
    const arr = this.associatedWorkOrderQueryCondition.filterConditions.find(v => {
      return v.filterField === 'inspectionTaskId';
    });
    // ?????????????????????????????????????????????id
    if (!arr) {
      // ?????????????????????id
      this.associatedWorkOrderQueryCondition.filterConditions.push({
        filterValue: this.id,
        filterField: 'inspectionTaskId',
        operator: OperatorEnum.eq,
      });
    } else {
      // ????????????id???????????????id
      this.associatedWorkOrderQueryCondition.filterConditions.forEach(v => {
        if (v.filterField === 'inspectionTaskId') {
          v.filterValue = this.id;
        }
      });
    }
    // ??????????????????????????????????????????filterField??????
    this.associatedWorkOrderQueryCondition.filterConditions.forEach(v => {
      if (v.filterField === 'equipmentType') {
        v.operator = OperatorEnum.all;
        v.filterField = 'procRelatedEquipment.equipmentType';
      }
      if (v.filterField === 'deviceType') {
        v.operator = OperatorEnum.in;
        v.filterField = 'procRelatedDevices.deviceType';
      }
      if (v.filterField === 'assign') {
        v.operator = OperatorEnum.in;
      }
    });
    const param = this.associatedWorkOrderQueryCondition;
    this.$inspectionWorkOrderService.getDetailList(param).subscribe((result: ResultModel<InspectionTaskModel[]>) => {
      this.associatedWorkOrderTableConfig.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.associatedWorkOrderPageBean.Total = result.totalCount;
        this.associatedWorkOrderPageBean.pageIndex = result.pageNum;
        this.associatedWorkOrderPageBean.pageSize = result.size;
        this.associatedWorkOrderTableConfig.isLoading = false;
        const data = result.data || [];
        data.forEach(item => {
          item.equipmentTypeList = [];
          item.equipmentTypeName = '';
          // ????????????
          item.statusName = WorkOrderStatusUtil.getWorkOrderStatus(this.$nzI18n, item.status);
          item.statusClass = WorkOrderStatusUtil.getWorkOrderIconClassName(item.status);
          // ???????????????class
          if (item.deviceType) {
            item.deviceTypeName = WorkOrderBusinessCommonUtil.deviceTypeNames(this.$nzI18n, item.deviceType);
            item.deviceIcon = CommonUtil.getFacilityIconClassName(item.deviceType);
          }
          // ?????????????????????class
          if (item.equipmentType) {
            const equip = WorkOrderClearInspectUtil.handleMultiEquipment(item.equipmentType, this.$nzI18n);
            item.equipmentTypeList = equip.equipList;
            item.equipmentTypeName = equip.names.join(',');
          }
        });
        this.associatedWorkOrder_dataSet = result.data;
      }
    }, () => {
      this.associatedWorkOrderTableConfig.isLoading = false;
    });
  }

  /**
   * ????????????????????????
   */
  public close(): void {
    this.isAssociatedWorkOrderVisible = false;
    this.associatedWorkOrderPageBean = new PageModel(10, 1, 1);
    this.tableComponent.handleRest();
    this.associatedWorkOrder_dataSet = [];
    this.selectOrderUnitName = '';
    this.associatedWorkOrderTableConfig.showSearch = false;
    this.selectUserList = [];
  }
  /**
   * ??????????????????
   */
  public areaSelectChange(event: AreaFormModel[]): void {
    if (event && event.length > 0) {
      FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, event[0].areaId);
      this.areaName = event[0].areaName;
      this.areaFilterValue.filterValue = [event[0].areaId];
      this.areaFilterValue.filterName = event[0].areaName;
    } else {
      FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, null);
      this.areaName = '';
      this.areaFilterValue.filterValue = null;
      this.areaFilterValue.filterName = '';
    }
  }
  /**
   * ????????????????????????
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
        this.areaNodes = [];
        this.areaNodes = data;
        this.areaSelectorConfig.treeNodes = data;
        FacilityForCommonUtil.setAreaNodesStatus(this.areaNodes, null);
        this.areaSelectVisible = true;
      });
    }
  }
  /**
   * ????????????????????????
   */
  private checkData(id: string[]): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.$inspectionWorkOrderService.getWorkOrderList(this.queryCondition).subscribe((result: ResultModel<any>) => {
        for (let j = 0; j < id.length; j++) {
          for (let i = 0; i < result.data.length; i++) {
            if (id[j] === result.data[i].inspectionTaskId) {
              this.hasData = true;
              break;
            } else {
              this.hasData = false;
            }
          }
        }
        resolve(this.hasData);
      }, (error) => {
        reject(error);
      });
    });
  }
  /**
   * ?????????????????????
   */
  public showAreaSelectorModal(filterValue: FilterCondition): void {
    this.areaFilterValue = filterValue;
    if (!this.filterValue.filterValue) {
      this.filterValue.filterValue = [];
    }
    this.treeSelectorConfig.treeNodes = this.areaNodes;
    this.areaSelectVisible = true;
  }
  /**
   * ???????????????????????????
   */
  public showModal(filterValue: FilterCondition): void {
    this.departFilterValue = filterValue;
    if (this.unitTreeNodes.length === 0) {
      this.queryDeptList().then(bool => {
        if (bool) {
          this.filterValue = filterValue;
          if (!this.filterValue.filterValue) {
            this.filterValue.filterValue = [];
          }
          this.treeSelectorConfig.treeNodes = this.unitTreeNodes;
          this.isVisible = true;
        }
      });
    } else {
      this.isVisible = true;
    }
  }
  /**
   * ????????????????????????
   */
  public showOrderModal(filterValue: FilterValueModel): void {
    if (this.unitTreeNodes.length > 0) {
      this.isOrderVisible = true;
      this.orderFilterValue = filterValue;
    } else {
      this.queryDeptList().then(bool => {
        if (bool) {
          this.orderFilterValue = filterValue;
          this.treeSelectorConfig.treeNodes = this.unitTreeNodes;
          this.isOrderVisible = true;
        }
      });
    }
  }
  /**
   * ????????????????????????
   * @param event ????????????
   */
  public selectDataChange(event: DepartmentUnitModel[]): void {
    this.selectUnitName = '';
    if (event && event.length > 0) {
      this.selectUnitName = event[0].deptName;
      this.departFilterValue.filterValue = [event[0].deptCode];
      this.selectUnitCode = event[0].deptCode;
      this.departFilterValue.filterName = this.selectUnitName;
      FacilityForCommonUtil.setTreeNodesStatus(this.unitTreeNodes, [event[0].id]);
    }
  }
  /**
   * ????????????????????????
   */
  public selectOrderDataChange(event: DepartmentUnitModel[]): void {
    if (event && event.length > 0) {
      this.orderFilterValue.filterValue = event[0].deptCode;
      this.selectOrderUnitName = event[0].deptName;
      FacilityForCommonUtil.setTreeNodesStatus(this.unitTreeNodes, [event[0].id]);
    }
  }
  /**
   * ???????????????????????????
   */
  public queryDeptList(): Promise<boolean> {
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
   * (?????????????????????????????????????????????)
   */
  private getAllUser(): void {
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
   * (?????????????????????????????????????????????)
   */
  private checkDataRole(id: string): Promise<boolean> {
    const taskIdData = new DeviceFormModel();
    taskIdData.inspectionTaskId = id;
    return new Promise((resolve, reject) => {
      this.$inspectionWorkOrderService.checkTaskData(taskIdData).subscribe((result: ResultModel<string>) => {
        if (result.code === ResultCodeEnum.success) {
          resolve(true);
        } else {
          this.$message.error(result.msg);
          resolve(false);
        }
      }, error => {
        reject(error);
      });
    });
  }
}

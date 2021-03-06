import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/index';
import {Injectable} from '@angular/core';
import {InspectionWorkOrderApiInterface} from './inspection-work-order-api.interface';
import {WorkOrderRequestUrl} from '../work-order-request-url.const';
import {SelectTemplateModel} from '../../model/template/select-template.model';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {InspectionTemplateModel} from '../../model/template/inspection-template.model';
import {QueryConditionModel} from '../../../../../shared-module/model/query-condition.model';
import {InspectionTaskModel} from '../../model/inspection-model/inspection-task.model';
import {DeleteInspectionTaskModel} from '../../model/inspection-model/delete-inspection-task.model';
import {InspectionWorkOrderDetailModel} from '../../model/inspection-model/inspection-work-order-detail.model';
import {AreaDeviceParamModel} from '../../../../../core-module/model/work-order/area-device-param.model';
import {InspectionWorkOrderModel} from '../../../../../core-module/model/work-order/inspection-work-order.model';
import {AssignDepartmentModel} from '../../model/assign-department.model';
import {OrderUserModel} from '../../../../../core-module/model/work-order/order-user.model';
import {InspectionReportParamModel} from '../../model/inspection-report-param.model';
import {InspectionReportModel} from '../../model/inspection-report.model';
import {InspectionObjectInfoModel} from '../../../../../core-module/model/work-order/inspection-object-info.model';
import {InspectionObjectListModel} from '../../../../../core-module/model/work-order/inspection-object-list.model';
import {TransferOrderParamModel} from '../../model/clear-barrier-model/transfer-order-param.model';
import {ExportRequestModel} from '../../../../../shared-module/model/export-request.model';
import {RoleUnitModel} from '../../../../../core-module/model/work-order/role-unit.model';
import {WorkOrderStatisticalModel} from '../../model/clear-barrier-model/work-order-statistical.model';
import {RepairOrderStatusCountModel} from '../../model/clear-barrier-model/repair-order-status-count.model';
import {InspectionDeviceListModel} from '../../model/inspection-model/inspection-device-list.model';
import {InspectionTemplateConfigModel} from '../../model/template/inspection-template-config.model';
import {WorkOrderEmptyModel} from '../../model/work-order-empty.model';
import {ClearBarrierWorkOrderModel} from '../../../../../core-module/model/work-order/clear-barrier-work-order.model';
import {DeviceFormModel} from '../../../../../core-module/model/work-order/device-form.model';
import {InspectionReportItemModel} from '../../model/inspection-model/inspection-report-item.model';

@Injectable()
export class InspectionWorkOrderService implements InspectionWorkOrderApiInterface {
  constructor(
    private $http: HttpClient
  ) {}
  // ??????????????????????????????
  getDepartUserList(): Observable<ResultModel<OrderUserModel[]>> {
    return this.$http.post<ResultModel<OrderUserModel[]>>(`${WorkOrderRequestUrl.getUserListDepart}`, {});
  }
  // ??????????????????
  queryInspectionTemplateList(body: QueryConditionModel): Observable<ResultModel<InspectionTemplateModel[]>> {
    return this.$http.post<ResultModel<InspectionTemplateModel[]>>(`${WorkOrderRequestUrl.getInspectTemplate}`, body);
  }
  // ???????????????
  getInspectionTotal(id: string): Observable<ResultModel<InspectionTemplateConfigModel>> {
    return this.$http.get<ResultModel<InspectionTemplateConfigModel>>(`${WorkOrderRequestUrl.getInspectTotal}/${id}`);
  }
  // ??????????????????
  addInspectionTemplate(body: SelectTemplateModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.addInspectTemplate}`, body);
  }
  // ??????????????????
  getTemplateInfo(id: string): Observable<ResultModel<InspectionTemplateModel>> {
    return this.$http.get<ResultModel<InspectionTemplateModel>>(`${WorkOrderRequestUrl.getTemplateInfo}/${id}`);
  }
  // ????????????
  updateTemplate(body: SelectTemplateModel): Observable<ResultModel<string>> {
    return this.$http.put<ResultModel<string>>(`${WorkOrderRequestUrl.editInspectTemplate}`, body);
  }
  // ???????????????????????????
  checkTemplateName(name: string, id: string): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.checkInspectTemplate}`, {templateName: name, templateId: id});
  }
  // ????????????
  deleteTemplate(body: {inspectionTemplateIdList: string[]}): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.deleteInspectTemplate}`, body);
  }
  // ??????????????????
  selectTemplate(body: WorkOrderEmptyModel): Observable<ResultModel<SelectTemplateModel[]>> {
    return this.$http.post<ResultModel<SelectTemplateModel[]>>(`${WorkOrderRequestUrl.selectInspectTemplate}`, body);
  }
  // ??????????????????
  exportInspectTemplate(body: ExportRequestModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.exportInspectionTemplate}`, body);
  }
  // ??????????????????
  getWorkOrderList(body: QueryConditionModel): Observable<ResultModel<InspectionTaskModel[]>> {
    return this.$http.post<ResultModel<InspectionTaskModel[]>>(`${WorkOrderRequestUrl.getInspectionWorkOrderListAll}`, body);
  }

  // ????????????????????????
  insertWorkOrder(body: InspectionWorkOrderDetailModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.addInspectionWorkOrder}`, body);
  }

  // ??????????????????
  deleteWorkOrderByIds(body: DeleteInspectionTaskModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.deleteInspectionWorkOrder}`, body);
  }

  // ??????????????????
  updateInspectionTask(body: InspectionWorkOrderDetailModel): Observable<ResultModel<string>> {
    return this.$http.put<ResultModel<string>>(`${WorkOrderRequestUrl.updateInspectionWorkOrder}`, body);
  }

  // ????????????????????????
  inquireInspectionTask(id: string): Observable<ResultModel<InspectionTaskModel>> {
    return this.$http.get<ResultModel<InspectionTaskModel>>(`${WorkOrderRequestUrl.inquireInspectionWorkOrder}/${id}`);
  }

  // ??????????????????
  enableInspectionTask(body: {inspectionTaskIds: string[]}): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.enableInspectionTasks}`, body);
  }

  // ??????????????????
  disableInspectionTask(body: {inspectionTaskIds: string[]}): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.disableInspectionTasks}`, body);
  }

  // ????????????????????????
  checkName(name: string, id: string): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.queryInspectionTaskIsExists}`,
      {inspectionTaskName: name, inspectionTaskId: id});
  }

  // ??????????????????
  exportInspectionTask(body: ExportRequestModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.exportInspectionTask}`, body);
  }

  // ???????????????????????????
  getUnfinishedList(body: QueryConditionModel): Observable<ResultModel<InspectionWorkOrderModel[]>> {
    return this.$http.post<ResultModel<InspectionWorkOrderModel[]>>(`${WorkOrderRequestUrl.getInspectionWorkUnfinishedListAll}`, body);
  }

  // ??????????????????
  addWorkUnfinished(body: InspectionWorkOrderDetailModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.addInspectionWorkUnfinished}`, body);
  }

  // ??????????????????
  updateWorkUnfinished(body: InspectionWorkOrderDetailModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.updateInspectionWorkUnfinished}`, body);
  }

  // ????????????????????????????????????
  getUpdateWorkUnfinished(id: string): Observable<ResultModel<InspectionWorkOrderDetailModel>> {
    return this.$http.get<ResultModel<InspectionWorkOrderDetailModel>>(`${WorkOrderRequestUrl.getUpdateInspectionWorkUnfinishedList}/${id}`);
  }

  // ???????????????????????????
  deleteUnfinishedOrderByIds(body: AreaDeviceParamModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.deleteInspectionWorkUnfinished}`, body);
  }

  // ???????????????????????????
  getUnfinishedCompleteList(body: QueryConditionModel): Observable<ResultModel<InspectionTaskModel[]>> {
    return this.$http.post<ResultModel<InspectionTaskModel[]>>(`${WorkOrderRequestUrl.getInspectionCompleteUnfinishedList}`, body);
  }

  // ????????????????????????
  getFinishedList(queryCondition: QueryConditionModel): Observable<ResultModel<InspectionWorkOrderModel[]>> {
    return this.$http.post<ResultModel<InspectionWorkOrderModel[]>>(`${WorkOrderRequestUrl.getInspectionWorkFinishedListAll}`, queryCondition);
  }

  // ????????????
  singleBackToConfirm(id: string): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.singleBackToConfirmUnfinished}`, {procId: id});
  }

  // ??????
  assignedUnfinished(body: AssignDepartmentModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.assignedUnfinished}`, body);
  }

  // ????????????
  inspectionRegenerate(body: InspectionWorkOrderDetailModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.inspectionWorkUnfinishedRegenerate}`, body);
  }

  // ?????????????????????
  unfinishedWorkOrderWithdrawal(body: ClearBarrierWorkOrderModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.unfinishedWorkOrderWithdrawal}`, body);
  }

  // ???????????????
  unfinishedExport(body: ExportRequestModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.unfinishedExport}`, body);
  }

  // ????????????????????????
  completionRecordExport(exportParams: ExportRequestModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.completionRecordExport}`, exportParams);
  }

  // ??????????????????
  queryAllUser(body: null): Observable<ResultModel<OrderUserModel[]>> {
    return this.$http.post<ResultModel<OrderUserModel[]>>(`${WorkOrderRequestUrl.queryAllUserInfo}`, body);
  }
  // ?????????????????????????????????
  getDetailList(body: QueryConditionModel): Observable<ResultModel<InspectionTaskModel[]>> {
    return this.$http.post<ResultModel<InspectionTaskModel[]>>(`${WorkOrderRequestUrl.getTableList}`, body);
  }
  // ???????????????
  getFinishedDetail(id: string): Observable<ResultModel<InspectionWorkOrderDetailModel>> {
    return this.$http.get<ResultModel<InspectionWorkOrderDetailModel>>(`${WorkOrderRequestUrl.getFinishedDetail}/${id}`);
  }
  // checklist ????????????
  getDeviceList(device: InspectionReportParamModel): Observable<ResultModel<InspectionReportModel>> {
    return this.$http.post<ResultModel<InspectionReportModel>>(`${WorkOrderRequestUrl.queryDeviceList}`, device);
  }
  // checklist ????????????
  getEquipmentList(body: InspectionReportParamModel): Observable<ResultModel<InspectionReportItemModel[]>> {
    return this.$http.post<ResultModel<InspectionReportItemModel[]>>(`${WorkOrderRequestUrl.queryEquipmentList}`, body);
  }
  // ???????????????
  getUnfinishedDetail(id: string): Observable<ResultModel<InspectionWorkOrderDetailModel>> {
    return this.$http.get<ResultModel<InspectionWorkOrderDetailModel>>(`${WorkOrderRequestUrl.getUnfinishedDetail}/${id}`);
  }
  // ??????????????????
  getInspectionDetail(id: string): Observable<ResultModel<InspectionWorkOrderDetailModel>> {
    return this.$http.get<ResultModel<InspectionWorkOrderDetailModel>>(`${WorkOrderRequestUrl.getInspectDetailDetail}/${id}`);
  }
  // ?????????????????????????????????
  checkInspectionOrderName(name: string, id: string): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.checkInspectionOrderName}`, {title: name, procId: id});
  }
  // ??????????????????????????????
  queryInspectionDeviceList(body: QueryConditionModel): Observable<ResultModel<InspectionReportItemModel[]>> {
    return this.$http.post<ResultModel<InspectionReportItemModel[]>>(`${WorkOrderRequestUrl.inspectionDeviceList}`, body);
  }
  // ????????????????????????/????????????
  getInspectionDeviceList(id: string): Observable<ResultModel<InspectionDeviceListModel>> {
    return this.$http.get<ResultModel<InspectionDeviceListModel>>(`${WorkOrderRequestUrl.inspectionDeviceObjectList}/${id}`);
  }
  // ??????????????????????????????
  queryInspectionObjectList(inspectionObjectInfoModel: InspectionObjectInfoModel): Observable<ResultModel<InspectionObjectListModel>> {
    return this.$http.post<ResultModel<InspectionObjectListModel>>(`${WorkOrderRequestUrl.inspectionObjectInfo}`, inspectionObjectInfoModel);
  }
  // ??????????????????
  inspectTodayAdd(body: WorkOrderEmptyModel): Observable<ResultModel<number>> {
    return this.$http.post<ResultModel<number>>(`${WorkOrderRequestUrl.inspectToday}`, body);
  }
  // ????????????????????????
  inspectCardStatistic(body: WorkOrderEmptyModel): Observable<ResultModel<RepairOrderStatusCountModel[]>> {
    return this.$http.post<ResultModel<RepairOrderStatusCountModel[]>>(`${WorkOrderRequestUrl.inspectStatusTotal}`, body);
  }
  // ??????????????????????????????
  inspectDeviceTypes(body: WorkOrderEmptyModel): Observable<ResultModel<WorkOrderStatisticalModel[]>> {
    return this.$http.post<ResultModel<WorkOrderStatisticalModel[]>>(`${WorkOrderRequestUrl.inspectDeviceType}`, body);
  }
  // ???????????????????????????
  inspectStatusStatistic(body: WorkOrderEmptyModel): Observable<ResultModel<WorkOrderStatisticalModel[]>> {
    return this.$http.post<ResultModel<WorkOrderStatisticalModel[]>>(`${WorkOrderRequestUrl.inspectStatusStatistics}`, body);
  }
  // ??????????????????????????????
  getInspectUser(body: TransferOrderParamModel): Observable<ResultModel<RoleUnitModel[]>> {
    return this.$http.post<ResultModel<RoleUnitModel[]>>(`${WorkOrderRequestUrl.getInspectUserList}`, body);
  }
  // ??????????????????
  transInspectOrder(body: TransferOrderParamModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.getInspectTrans}`, body);
  }
  // ??????????????????
  checkTaskData(body: DeviceFormModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${WorkOrderRequestUrl.checkTaskDataRoles}`, body);
  }
}

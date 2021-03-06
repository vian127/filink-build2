import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
  ADD_ALARM_FILTRATION,
  ADD_ALARM_REMOTE,
  ADD_ALARM_TEMPLATE,
  ADD_ALARM_WORK,
  ALARM_QUERY_TEMPLATE,
  APDATE_ALARM_FILTRATION,
  APDATE_ALARM_WORK,
  AREA_GET_UNIT,
  DELETE_ALARM_FILTRATION,
  DELETE_ALARM_REMOTE,
  DELETE_ALARM_TEMPLATE_LIST,
  DELETE_ALARM_WORK,
  EXAMINE_PICTURE,
  QUERY_ALARM_HISTORY_TEMPLATE,
  DELETE_ALARM_HISTORY_TEMPLATE_LIST,
  ADD_ALARM_HISTORY_TEMPLATE,
  UPDATE_ALARM_HISTORY_TEMPLATE,
  QUERY_ALARM_HISTORY_TEMPLATE_BY_ID,
  ALARMM_HISTORY_QUERY_TEMPLATE,
  EXPORT_ALARM_LIST,
  EXPORT_HISTORY_ALARM_LIST,
  INSERR_ALARM_CURRENTSET,
  QUERY_ALARM_CURRENT_LIST,
  QUERY_ALARM_DELAY,
  QUERY_ALARM_FILTRATION,
  QUERY_ALARM_HISTORY_LIST,
  QUERY_ALARM_INFO_BY_ID,
  QUERY_ALARM_LEVEL,
  QUERY_ALARM_LEVEL_BY_ID,
  QUERY_ALARM_LEVEL_SET_BY_ID,
  QUERY_ALARM_REMOTE,
  QUERY_ALARM_REMOTE_BY_ID,
  QUERY_ALARM_TEMPLATE_BY_ID,
  QUERY_ALARM_WORK,
  QUERY_ALARM_WORK_BY_ID,
  QUERY_DEPARTMENT_ID,
  QUERY_DEVICE_TYPE_BY_AREAIDS,
  QUERY_TEMPLATE,
  UPDATE_ALARM_CONFIRM_STATUS,
  UPDATE_ALARM_CURRENTSET,
  UPDATE_ALARM_DELAY,
  UPDATE_ALARM_FILTRATION,
  UPDATE_ALARM_FILTRATION_REMOTE_STORED,
  UPDATE_ALARM_FILTRATION_STORED,
  UPDATE_ALARM_FILTRATION_WORK_STORED,
  UPDATE_ALARM_LEVEL,
  UPDATE_ALARM_REMOTE,
  UPDATE_ALARM_TEMPLATE,
  GET_DIAGNOSTIC_DATA,
  DIAGNOSTIC_UPDATE,
  ALARM_TO_TROUBLE,
  ALARM_MIS_JUDGMENT,
  ALARM_PROCESSED,
  ELIMINATE_WORK,
  DELETE_ALARM_SET,
  ALARM_NAME_EXIST,
  ALARM_CODE_EXIST,
  QUERY_DEVICE_LIST,
  QUERY_EQUIPMENT_LIST,
  GET_ALARM_PIC,
  GET_EQUIPMENT_TYPE_LIST,
  GET_ALARM_COUNT,
  QUERY_TROUBLE_LIST,
  ELIMINATE_ALARM_WORK,
  QUERY_AREANAME_LIST,
  STATIC_RELEVANCE_RULE_LIST,
  QUERY_EQUIPMENTNAME_BY_EQUIPMENTID,
  ADD_DYNAMIC_RULE,
  QUERY_DYNAMIC_RULE_LIST,
  GET_RULES_BY_ID,
  EDIT_RULES,
  DISABLED_AND_ENABLE,
  DELETE_DYNAMIC_RULES,
  CHECK_DYNAMIC_RULE_NAME,
  RESULT_RULES_LIST,
  WARNING_LIST,
  ADD_ALARM_WARN,
  EDIT_ALARM_WARN, DELETE_ALARM_WARN, BATCH_ALARM_STATUS, GET_WARN_DETAIL, EXECUTE_RULES, CHECK_WARN_NAME, CHECK_WARN_CODE,
  DELETE_STATIC_RELEVANCE_RULES,
  STATIC_ENABLE_AND_DISABLE,
  STATIC_ALL_ENABLE_AND_DISABLE, ADD_STATIC_RULE, EDIT_STATIC_RULE, STATIC_RULE_CONDITION,
  STATIC_RELEVANCE_RULE_DETAIL, RESULT_DETAIL_LIST, SAVE_DETAIL_RULES, QUERY_ALARM_RELEVANCE_LIST, DATA_IMMEDIATELY, CHECK_TEMP_NAME, CHECK_STATIC_RULE_NAME,
} from '../const/alarm-url.const';
import {QUERY_ALARM_LEVEL_LIST} from '../../../../core-module/api-service/alarm/alarm-request-url';
import {DiagnosticModel} from '../model/diagnostic.model';
import {ClearBarrierWorkOrderModel} from '../../../../core-module/model/work-order/clear-barrier-work-order.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {EquipmentModel} from '../../../../core-module/model/equipment/equipment.model';
import {AlarmLevelModel} from '../../../../core-module/model/alarm/alarm-level.model';
import {AlarmFiltrationModel} from '../model/alarm-filtration.model';
import {QueryRecentlyPicModel} from '../../../../core-module/model/picture/query-recently-pic.model';
import {FacilityListModel} from '../../../../core-module/model/facility/facility-list.model';
import {AlarmListModel} from '../../../../core-module/model/alarm/alarm-list.model';
import {AlarmRemoteModel} from '../model/alarm-remote.model';
import {EquipmentListModel} from '../../../../core-module/model/equipment/equipment-list.model';
import {AlarmRemoteAreaModel} from '../model/alarm-remote-area.model';
import {QueryCardParamsModel} from '../model/query-card-params.model';
import {AlarmOrderModel} from '../model/alarm-order.model';
import {AlarmHistorySetModel} from '../model/alarm-history-set.model';
import {AlarmNameListModel} from '../../../../core-module/model/alarm/alarm-name-list.model';
import {PictureListModel} from '../../../../core-module/model/picture/picture-list.model';
import {ExportRequestModel} from '../../../../shared-module/model/export-request.model';
import {DeviceTypeCountModel} from '../../../../core-module/model/facility/device-type-count.model';
import {AlarmEquipmentTypeModel} from '../model/alarm-equipment-type.model';
import {RealPictureModel} from '../../../../core-module/model/picture/real-picture.model';
import {TroubleModel} from '../../../../core-module/model/trouble/trouble.model';
import {AlarmTemplateModel} from '../model/alarm-template.model';
import {AreaModel} from '../../../../core-module/model/facility/area.model';
import {EquipmentAddInfoModel} from '../../../../core-module/model/equipment/equipment-add-info.model';
import {AlarmEquipmentNameModel} from '../model/alarm-equipment-name.model';
import {AlarmTemplateDataModel} from '../model/alarm-template-data.model';
import {AnalysisCorrelationRuleModel} from '../model/analysis-correlation-rule.model';
import {DynamicCorrelationRuleModel} from '../model/dynamic-correlation-rule.model';
import {DynamicViewResultModel} from '../model/dynamic-view-result.model';
import {AlarmWarningModel} from '../model/alarm-warning.model';
import {AlarmOperationModel} from '../model/alarm-operation.model';
import {StaticRuleEnableModel} from '../model/static-rule-enable.model';
import {AlarmDisableStatusEnum} from '../enum/alarm.enum';
import {CorrelationAnalysisModel} from '../model/correlation-analysis.model';
import {AlarmResultDetailListModel} from '../model/alarm-result-detail-list.model';
import {RuleConditionModel} from '../model/rule-condition.model';
import {RequestParamModel} from '../model/request-param.model';
import {AlarmClearAffirmModel} from '../model/alarm-clear-affirm.model';

@Injectable()
export class AlarmService {

  constructor(private $http: HttpClient) {
  }

  /**
   * ??????????????????????????????
   * param queryCondition
   */
  queryCurrentAlarmList(queryCondition: QueryConditionModel): Observable<ResultModel<AlarmListModel[]>> {
    return this.$http.post<ResultModel<AlarmListModel[]>>(`${QUERY_ALARM_CURRENT_LIST}`, queryCondition);
  }

  /**
   * ???????????????????????????????????????
   * param body
   */
  updateAlarmConfirmStatus(body: AlarmClearAffirmModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${UPDATE_ALARM_CONFIRM_STATUS}`, body);
  }

  /**
   * ??????????????????????????????
   */
  queryAlarmHistoryList(queryCondition: QueryConditionModel): Observable<ResultModel<AlarmListModel[]>> {
    return this.$http.post<ResultModel<AlarmListModel[]>>(`${QUERY_ALARM_HISTORY_LIST}`, queryCondition);
  }

  /**
   * ??????????????????????????????
   * param body
   */
  queryAlarmLevelList(body: QueryConditionModel): Observable<ResultModel<AlarmLevelModel[]>> {
    return this.$http.post<ResultModel<AlarmLevelModel[]>>(`${QUERY_ALARM_LEVEL_LIST}`, body);
  }

  /**
   * ??????????????????
   * param body
   */
  updateAlarmLevel(body: AlarmLevelModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${UPDATE_ALARM_LEVEL}`, body);
  }

  /**
   * ????????????????????????
   * param body
   */
  insertAlarmCurrentSet(body: AlarmNameListModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${INSERR_ALARM_CURRENTSET}`, body);
  }

  /**
   * ????????????????????????
   * param body
   */
  updateAlarmCurrentSet(body: AlarmNameListModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${UPDATE_ALARM_CURRENTSET}`, body);
  }

  /**
   * ????????????????????????
   * param id
   */
  queryAlarmLevelSetById(id: string): Observable<ResultModel<AlarmNameListModel>> {
    return this.$http.post<ResultModel<AlarmNameListModel>>(`${QUERY_ALARM_LEVEL_SET_BY_ID}`, [id]);
  }

  /**
   * ??????????????????
   * param id
   */
  queryAlarmLevelById(id: string): Observable<ResultModel<AlarmLevelModel>> {
    return this.$http.post<ResultModel<AlarmLevelModel>>(`${QUERY_ALARM_LEVEL_BY_ID}` + `${id}`, null);
  }

  /**
   * ????????????????????????
   * param body
   */
  queryAlarmDelay(): Observable<ResultModel<AlarmHistorySetModel>> {
    return this.$http.post<ResultModel<AlarmHistorySetModel>>(`${QUERY_ALARM_DELAY}`, null);
  }
  /**
   * ????????????????????????
   * param body
   */
  updateAlarmDelay(body: AlarmHistorySetModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${UPDATE_ALARM_DELAY}`, body);
  }

  /**
   * ??????????????????
   */
  queryAlarmLevel(): Observable<ResultModel<AlarmLevelModel[]>> {
    return this.$http.post<ResultModel<AlarmLevelModel[]>>(`${QUERY_ALARM_LEVEL}`, {});
  }

  /**
   * ????????????????????????
   */
  queryDepartmentId(selectedAlarmIdList: string[]): Observable<ResultModel<any>> {
    return this.$http.post<ResultModel<any>>(`${QUERY_DEPARTMENT_ID}`, selectedAlarmIdList);
  }

  /**
   * ??????????????????
   * param body
   */
  queryAlarmFiltration(body: QueryConditionModel): Observable<ResultModel<AlarmFiltrationModel[]>> {
    return this.$http.post<ResultModel<AlarmFiltrationModel[]>>(`${QUERY_ALARM_FILTRATION}`, body);
  }

  /**
   * ????????????????????????
   * param body
   */
  queryAlarmRemote(body: { bizCondition: any }): Observable<ResultModel<AlarmRemoteModel[]>> {
    return this.$http.post<ResultModel<AlarmRemoteModel[]>>(`${QUERY_ALARM_REMOTE}`, body);
  }

  /**
   * ?????????????????????????????????
   * param body
   */
  queryAlarmWorkOrder(body: QueryConditionModel): Observable<ResultModel<AlarmOrderModel[]>> {
    return this.$http.post<ResultModel<AlarmOrderModel[]>>(`${QUERY_ALARM_WORK}`, body);
  }

  /**
   * ????????????????????????
   * param ids ??????id??????
   */
  deleteAlarmFiltration(ids: string[]): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${DELETE_ALARM_FILTRATION}`, ids);
  }

  /**
   * ??????????????????????????????
   * param id ??????id??????
   */
  deleteAlarmRemote(ids: string[]): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${DELETE_ALARM_REMOTE}`, ids);
  }

  /**
   * ???????????????????????????
   * param ids ??????id??????
   */
  deleteAlarmWork(ids: string[]): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${DELETE_ALARM_WORK}`, ids);
  }

  /**
   * ?????????????????????
   * param status
   * param idArray
   */
  updateStatus(status: number, idArray: string[]): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${UPDATE_ALARM_FILTRATION}?status=${status}&idArray=${idArray}`, {});
  }

  /**
   * ???????????????????????????????????????
   * param status
   * param idArray
   */
  updateRemoteStatus(status: number, idArray: string[]): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${UPDATE_ALARM_FILTRATION_REMOTE_STORED}?status=${status}&idArray=${idArray}`, {});
  }

  /**
   * ??????????????? ??????????????????
   * param status ??????
   * param idArray id??????
   */
  updateWorkStatus(status: number, idArray: string[]): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${UPDATE_ALARM_FILTRATION_WORK_STORED}?status=${status}&idArray=${idArray}`, {});
  }
  /**
   * ????????????????????????
   * param body
   */
  updateAlarmStorage(storage: number, idArray: string[]): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${UPDATE_ALARM_FILTRATION_STORED}?stored=${storage}&idArray=${idArray}`, {});
  }

  /**
   * ??????????????????
   * param body
   */
  addAlarmFiltration(body: AlarmFiltrationModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${ADD_ALARM_FILTRATION}`, body);
  }

  /**
   * ????????????????????????
   * param body
   */
  updateAlarmFiltration(body: AlarmFiltrationModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${APDATE_ALARM_FILTRATION}`, body);
  }

  /**
   * ??????id????????????????????????
   * param id
   */
  queryAlarmById(id: string): Observable<ResultModel<AlarmFiltrationModel>> {
    return this.$http.get<ResultModel<AlarmFiltrationModel>>(`${QUERY_ALARM_INFO_BY_ID}/${id}`);
  }

  /**
   * ??????????????? ??????
   * param body
   */
  addAlarmWork(body: AlarmOrderModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${ADD_ALARM_WORK}`, body);
  }


  /**
   * ??????????????? ??????
   * param body
   */
  updateAlarmWork(body: AlarmOrderModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${APDATE_ALARM_WORK}`, body);
  }

  /**
   * ??????????????? ??????id??????????????????
   * param id
   */
  queryAlarmWorkById(id: string): Observable<ResultModel<AlarmOrderModel>> {
    return this.$http.get<ResultModel<AlarmOrderModel>>(`${QUERY_ALARM_WORK_BY_ID}/${id}`);
  }

  /**
   * ?????????????????? ??????
   * param body
   */
  addAlarmRemote(body: AlarmRemoteModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${ADD_ALARM_REMOTE}`, body);
  }

  /**
   * ?????????????????? ??????
   * param body
   */
  updateAlarmRemarkList(body: AlarmRemoteModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${UPDATE_ALARM_REMOTE}`, body);
  }

  /**
   * ?????????????????? ??????id??????????????????
   * param id
   */
  queryAlarmRemoteById(id: string): Observable<ResultModel<AlarmRemoteModel>> {
    return this.$http.get<ResultModel<AlarmRemoteModel>>(`${QUERY_ALARM_REMOTE_BY_ID}/${id}`);
  }

  /**
   * ???????????? ????????????????????????
   * param body
   */
  queryAlarmTemplateList(body: QueryConditionModel): Observable<ResultModel<AlarmTemplateModel[]>> {
    return this.$http.post<ResultModel<AlarmTemplateModel[]>>(`${QUERY_TEMPLATE}`, body);
  }

  /**
   * ???????????? ???????????? ????????????
   * param id
   */
  deleteAlarmTemplateList(id: string[]): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${DELETE_ALARM_TEMPLATE_LIST}`, id);
  }

  /**
   *  ?????????????????? ????????????????????????
   * param body
   */
  areaGtUnit(body: string[]): Observable<ResultModel<AlarmRemoteAreaModel[]>> {
    return this.$http.post<ResultModel<AlarmRemoteAreaModel[]>>(`${AREA_GET_UNIT}`, body);
  }

  /**
   * ?????????????????? ??????????????????????????????
   * param body
   */
  getDeviceType(body: string[]): Observable<ResultModel<string[]>> {
    return this.$http.post<ResultModel<string[]>>(`${QUERY_DEVICE_TYPE_BY_AREAIDS}`, body);
  }

  /**
   * ???????????? ??????
   * param body
   */
  exportAlarmList(body: ExportRequestModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${EXPORT_ALARM_LIST}`, body);
  }

  /**
   * ???????????? ??????
   * param body
   */
  exportHistoryAlarmList(body: ExportRequestModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${EXPORT_HISTORY_ALARM_LIST}`, body);
  }

  /**
   * ???????????? ????????????
   * param body
   */
  examinePicture(body: QueryRecentlyPicModel[]): Observable<ResultModel<PictureListModel[]>> {
    return this.$http.post<ResultModel<PictureListModel[]>>(`${EXAMINE_PICTURE}`, body);
  }

  /**
   * ???????????? ????????????
   * param id
   * param pageCondition
   */
  alarmQueryTemplateById(id: string, pageCondition: AlarmTemplateDataModel): Observable<ResultModel<AlarmListModel[]>> {
    return this.$http.post<ResultModel<AlarmListModel[]>>(`${ALARM_QUERY_TEMPLATE}` + `/${id}`, pageCondition);
  }

  /**
   * ???????????? ????????????
   * param body
   */
  addAlarmTemplate(body: AlarmTemplateModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${ADD_ALARM_TEMPLATE}`, body);
  }

  /**
   * ???????????? ????????????
   * param body
   */
  updateAlarmTemplate(body: AlarmTemplateModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${UPDATE_ALARM_TEMPLATE}`, body);
  }

  /**
   * ???????????? ???????????? ??????ID????????????
   * param id
   */
  queryAlarmTemplateById(id: string[]): Observable<ResultModel<AlarmTemplateModel>> {
    return this.$http.post<ResultModel<AlarmTemplateModel>>(`${QUERY_ALARM_TEMPLATE_BY_ID}` + `/${id}`, null);
  }

  /**
   * ???????????? ????????????????????????
   * param body
   */
  queryHistoryAlarmTemplateList(body: QueryConditionModel): Observable<ResultModel<AlarmTemplateModel[]>> {
    return this.$http.post<ResultModel<AlarmTemplateModel[]>>(`${QUERY_ALARM_HISTORY_TEMPLATE}`, body);
  }

  /**
   * ???????????? ???????????? ????????????
   * param id
   */
  deleteHistoryAlarmTemplateList(id: string[]): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${DELETE_ALARM_HISTORY_TEMPLATE_LIST}`, id);
  }

  /**
   * ???????????? ????????????
   * param body
   */
  addHistoryAlarmTemplate(body: AlarmTemplateModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${ADD_ALARM_HISTORY_TEMPLATE}`, body);
  }

  /**
   * ???????????? ????????????
   * param body
   */
  updateHistoryAlarmTemplate(body: AlarmTemplateModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${UPDATE_ALARM_HISTORY_TEMPLATE}`, body);
  }

  /**
   * ???????????? ???????????? ??????ID????????????
   * param id
   */
  queryHistoryAlarmTemplateById(id: string[]): Observable<ResultModel<AlarmTemplateModel>> {
    return this.$http.post<ResultModel<AlarmTemplateModel>>(`${QUERY_ALARM_HISTORY_TEMPLATE_BY_ID}` + `/${id}`, null);
  }

  /**
   * ???????????? ????????????
   * param id
   * param pageCondition
   */
  alarmHistoryQueryTemplateById(id: string, pageCondition: AlarmTemplateDataModel): Observable<ResultModel<AlarmListModel[]>> {
    return this.$http.post<ResultModel<AlarmListModel[]>>(`${ALARMM_HISTORY_QUERY_TEMPLATE}/${id}`, pageCondition);
  }

  /**
   * ????????????????????????
   */
  getDiagnosticData(): Observable<ResultModel<DiagnosticModel>> {
    return this.$http.get<ResultModel<DiagnosticModel>>(`${GET_DIAGNOSTIC_DATA}`);
  }

  /**
   * ????????????
   * param body
   */
  diagnosticUpdate(body: DiagnosticModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${DIAGNOSTIC_UPDATE}`, body);
  }

  /**
   * ???????????????
   * param id
   */
  alarmToTrouble(id: string[]): Observable<ResultModel<string>> {
    return this.$http.get<ResultModel<string>>(`${ALARM_TO_TROUBLE}/${id}`);
  }

  /**
   * ??????
    * param id
   * param remark
   */
  alarmMisJudgment(id: string, remark: string): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${ALARM_MIS_JUDGMENT}?alarmId=${id}&remark=${remark}`, null);
  }

  /**
   * ?????????
   * param id
   * param remark
   */
  alarmProcessed(id: string, remark: string): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${ALARM_PROCESSED}?alarmId=${id}&remark=${remark}`, null);
  }

  /**
   * ????????????
   * param id
   */
  eliminateWork(id: string): Observable<ResultModel<ClearBarrierWorkOrderModel[]>> {
    return this.$http.get<ResultModel<ClearBarrierWorkOrderModel[]>>(`${ELIMINATE_WORK}/${id}`);
  }

  /**
   * ????????????
   * param id
   */
  eliminateAlarmWork(id: string): Observable<ResultModel<ClearBarrierWorkOrderModel[]>> {
    return this.$http.get<ResultModel<ClearBarrierWorkOrderModel[]>>(`${ELIMINATE_ALARM_WORK}/${id}`);
  }
  /**
   * ??????????????????
   * param body
   */
  deleteAlarmSet(body: string[]): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${DELETE_ALARM_SET}`, body);
  }

  /**
   * ?????????????????????
   * param body
   */
  queryAlarmNameExist(body: string): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${ALARM_NAME_EXIST}`, body);
  }

  /**
   * ?????????????????????
   * param body
   */
  queryAlarmCodeExist(body: string): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${ALARM_CODE_EXIST}`, body);
  }

  /**
   * ????????????
   * param body
   */
  queryDevice(body: QueryConditionModel): Observable<ResultModel<FacilityListModel[]>> {
    return this.$http.post<ResultModel<FacilityListModel[]>>(`${QUERY_DEVICE_LIST}`, body);
  }

  /**
   * ????????????
   * param body
   */
  queryEquipment(body: QueryConditionModel): Observable<ResultModel<EquipmentModel[]>> {
    return this.$http.post<ResultModel<EquipmentModel[]>>(`${QUERY_EQUIPMENT_LIST}`, body);
  }

  /**
   * ????????????
   * param body
   */
  queryAlarmPic(body: QueryRecentlyPicModel): Observable<ResultModel<RealPictureModel[]>> {
    return this.$http.post<ResultModel<RealPictureModel[]>>(`${GET_ALARM_PIC}`, body);
  }

  /**
   * ?????????????????????????????????????????????
   * param body
   */
  getEquipmentTypeList(body: AlarmEquipmentTypeModel): Observable<ResultModel<EquipmentListModel[]>> {
    return this.$http.post<ResultModel<EquipmentListModel[]>>(`${GET_EQUIPMENT_TYPE_LIST}`, body);
  }

  /**
   * ??????????????????????????????????????????
   * param body
   */
  getAlarmCount(body: QueryCardParamsModel): Observable<ResultModel<DeviceTypeCountModel[]>> {
    return this.$http.post<ResultModel<DeviceTypeCountModel[]>>(`${GET_ALARM_COUNT}`, body);
  }

  /**
   * ????????????????????????
   * param id
   */
  getTroubleList(id: string): Observable<ResultModel<TroubleModel[]>> {
    return this.$http.get<ResultModel<TroubleModel[]>>(`${QUERY_TROUBLE_LIST}/${id}`);
  }

  /**
   * ????????????id??????????????????
   * param body
   */
  getAreaNameFromAreaIds(body: string[]): Observable<ResultModel<AreaModel[]>> {
    return this.$http.post<ResultModel<AreaModel[]>>(`${QUERY_AREANAME_LIST}`, body);
  }

  /**
   * ????????????id????????????????????????
   */
  getAlarmFilterEquipmentList (body: AlarmEquipmentNameModel): Observable<ResultModel<EquipmentAddInfoModel[]>>  {
    return this.$http.post<ResultModel<EquipmentAddInfoModel[]>>(`${QUERY_EQUIPMENTNAME_BY_EQUIPMENTID}`, body);
  }

  /**
   * ???????????????????????????
   */
  staticRelevanceRuleList (queryCondition: QueryConditionModel): Observable<ResultModel<AnalysisCorrelationRuleModel[]>> {
    return this.$http.post<ResultModel<AnalysisCorrelationRuleModel[]>>(`${STATIC_RELEVANCE_RULE_LIST}`, queryCondition);
  }
  /**
   * ???????????????????????????
   */
  deleteStaticRelevanceRule(ids: string[]): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${DELETE_STATIC_RELEVANCE_RULES}`, ids);
  }
  /**
   * ?????????
   */
  staticEnableAndDisable(body: StaticRuleEnableModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${STATIC_ENABLE_AND_DISABLE}`, body);
  }
  /**
   * ???????????????
   */
  AllStaticEnableAndDisable(type: AlarmDisableStatusEnum): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${STATIC_ALL_ENABLE_AND_DISABLE}`, type);
  }
  /**
   * ???????????????????????????
   */
  addStaticRule(body: CorrelationAnalysisModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${ADD_STATIC_RULE}`, body);
  }
  /**
   * ???????????????????????????
   */
  editStaticRule(body: CorrelationAnalysisModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${EDIT_STATIC_RULE}`, body);
  }

  /**
   * ?????????????????????????????????
   */
  staticRelevanceRuleDetail(id: string): Observable<ResultModel<CorrelationAnalysisModel>> {
    return this.$http.post<ResultModel<CorrelationAnalysisModel>>(`${STATIC_RELEVANCE_RULE_DETAIL}`, id);
  }
  /**
   * ????????????????????????
   */
  queryStaticRuleCondition(id: string): Observable<ResultModel<RuleConditionModel[]>> {
    return this.$http.post<ResultModel<RuleConditionModel[]>>(`${STATIC_RULE_CONDITION}`, id);
  }
  /**
   * ????????????????????????????????????????????????
   */
  queryAlarmRelevanceList(id: string): Observable<ResultModel<AlarmListModel[]>> {
    return this.$http.post<ResultModel<AlarmListModel[]>>(`${QUERY_ALARM_RELEVANCE_LIST}`, id);
  }
  /**
   * ??????????????????
   */
  queryDynamicList (body: QueryConditionModel): Observable<ResultModel<DynamicCorrelationRuleModel[]>> {
    return  this.$http.post<ResultModel<DynamicCorrelationRuleModel[]>>(QUERY_DYNAMIC_RULE_LIST, body);
  }

  /**
   * ??????????????????
   */
  addDynamicRules (body: DynamicCorrelationRuleModel): Observable<ResultModel<RequestParamModel>> {
    return  this.$http.post<ResultModel<RequestParamModel>>(ADD_DYNAMIC_RULE, body);
  }

  /**
   *  ??????id??????????????????
   */
  getRulesDetailById(id: string): Observable<ResultModel<DynamicCorrelationRuleModel>> {
    return this.$http.get<ResultModel<DynamicCorrelationRuleModel>>(`${GET_RULES_BY_ID}/${id}`);
  }

  /**
   * ??????????????????
   */
  editDynamicRules (body: DynamicCorrelationRuleModel): Observable<ResultModel<RequestParamModel>> {
    return  this.$http.post<ResultModel<RequestParamModel>>(EDIT_RULES, body);
  }

  /**
   *  ??????-??????
   */
  changeStatus(body: AlarmOperationModel): Observable<ResultModel<string>> {
    return  this.$http.post<ResultModel<string>>(DISABLED_AND_ENABLE, body);
  }

  /**
   * ????????????
   */
  executeRule(ids: string[]): Observable<ResultModel<string>> {
    return  this.$http.post<ResultModel<string>>(EXECUTE_RULES, ids);
  }
  /**
   * ????????????????????????
   */
  executeRuleImmediately(body: DynamicCorrelationRuleModel): Observable<ResultModel<string>> {
    return  this.$http.post<ResultModel<string>>(DATA_IMMEDIATELY, body);
  }

  /**
   * ??????????????????
   */
  deleteDynamicRules(ids: string[]): Observable<ResultModel<string>> {
    return  this.$http.post<ResultModel<string>>(DELETE_DYNAMIC_RULES, ids);
  }

  /**
   * ?????????????????????????????????
   */
  checkDynamicName(name: string, id: string): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(CHECK_DYNAMIC_RULE_NAME, {taskName: name, id: id});
  }

  /**
   * ??????????????????
   */
  viewResultList(body: QueryConditionModel): Observable<ResultModel<DynamicViewResultModel[]>> {
    return  this.$http.post<ResultModel<DynamicViewResultModel[]>>(RESULT_RULES_LIST, body);
  }

  /**
   * ??????????????????
   */
  viewDetailList(body: QueryConditionModel): Observable<ResultModel<AlarmResultDetailListModel[]>> {
    return  this.$http.post<ResultModel<AlarmResultDetailListModel[]>>(RESULT_DETAIL_LIST, body);
  }

  /**
   * ????????????
   */
  detailSaveRule(body): Observable<ResultModel<string>> {
    return  this.$http.post<ResultModel<string>>(SAVE_DETAIL_RULES, body);
  }

  /**
   * ??????????????????
   */
  queryWaringList(body: QueryConditionModel): Observable<ResultModel<AlarmWarningModel[]>> {
    return  this.$http.post<ResultModel<AlarmWarningModel[]>>(WARNING_LIST, body);
  }

  /**
   * ????????????
   */
  addWarning(body: AlarmWarningModel): Observable<ResultModel<string>> {
    return  this.$http.post<ResultModel<string>>(ADD_ALARM_WARN, body);
  }
  /**
   * ????????????
   */
  editWarning(body: AlarmWarningModel): Observable<ResultModel<string>> {
    return  this.$http.post<ResultModel<string>>(EDIT_ALARM_WARN, body);
  }
  /**
   * ????????????
   */
  deleteWarning(ids: string[]): Observable<ResultModel<string>> {
    return  this.$http.post<ResultModel<string>>(DELETE_ALARM_WARN, ids);
  }
  /**
   * ??????-????????????
   */
  batchWarning(body: AlarmOperationModel): Observable<ResultModel<string>> {
    return  this.$http.post<ResultModel<string>>(BATCH_ALARM_STATUS, body);
  }

  /**
   * ??????????????????
   */
  getWarnDetail(id: string): Observable<ResultModel<AlarmWarningModel>> {
    return this.$http.get<ResultModel<AlarmWarningModel>>(`${GET_WARN_DETAIL}/${id}`);
  }

  /**
   * ???????????????????????????
   */
  checkWarnName(name: string): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(CHECK_WARN_NAME, name);
  }

  /**
   * ???????????????????????????
   */
  checkWarnCode(code: string): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(CHECK_WARN_CODE, code);
  }

  /***
   * ?????????????????????????????????
   */
  checkTempName(name: string, id: string): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(CHECK_TEMP_NAME, {templateName: name, id: id});
  }
  /***
   * ?????????????????????????????????
   */
  checkStaticRuleName(name: string, id: string): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(CHECK_STATIC_RULE_NAME, {staticRelevanceRuleName: name, id: id});
  }
}

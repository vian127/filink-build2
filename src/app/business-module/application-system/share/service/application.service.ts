import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {
  ADD_SECURITY_STRATEGY,
  ADJUST_VOLUME_AND_BRIGHTNESS,
  ALARM_LEVEL_LIST,
  CAMERA_LOGOUT,
  CHECK_STRATEGY_NAME_EXIST,
  CHECK_USERS,
  CLOUD_CONTROL,
  DELETE_CHANNEL,
  CONTROL_EQUIPMENT_COUNT,
  DELETE_INFO_STRATEGY,
  DELETE_LINKAGE_STRATEGY,
  DISTRIBUTE_LIGHT,
  DISTRIBUTE_LINKAGE,
  DISTRIBUTE_RELEASE,
  ELECT_CONS_STATISTICS,
  EQUIPMENT_LIST_PAGE,
  EQUIPMENT_STATUS,
  GROUP_CONTROL,
  GROUP_LIST_PAGE,
  GROUP_EQUIPMENT_LIST_PAGE,
  INSTRUCT_DISTRIBUTE,
  LIGHTING_ENABLE_DISABLE,
  LIGHTING_MODIFY_STRATEGY,
  LIGHTING_POLICY_ADD,
  LIGHTING_POLICY_EDIT,
  LIGHTING_POLICY_LIST,
  LIGHTING_RATE_STATISTICS,
  LINKAGE_ADD,
  LINKAGE_DETAILS,
  LINKAGE_EDIT,
  LOOP_LIST_PAGE,
  PRESET_LIST_GET,
  PROGRAM_NAME_REPEAT,
  PROGRAM_STATUS,
  QUERY_CHANNEL_LIST_BY_ID,
  RELEASE_CONTENT_LIST_DELETE,
  RELEASE_CONTENT_LIST_GET,
  RELEASE_CONTENT_STATE_UPDATE,
  RELEASE_POLICY_ADD,
  RELEASE_POLICY_DETAILS,
  RELEASE_POLICY_EDIT,
  RELEASE_PROGRAM_ADD,
  RELEASE_PROGRAM_EDIT,
  RELEASE_PROGRAM_LOOK,
  RELEASE_PROGRAM_LOOKS,
  RELEASE_PROGRAMME_WORK_LIST_GET,
  RELEASE_WORK_ORDER,
  RELEASE_WORK_ORDER_DETAIL,
  RELEASE_WORK_PROGRAM_ADD,
  SECURITY_CONFIGURATION_GET,
  SECURITY_CONFIGURATION_SAVE,
  SECURITY_CONNECTION_CAMERA_GET,
  SECURITY_PASSAGEWAY_LIST_GET,
  SECURITY_POLICY_DETAILS,
  STATISTICS_ALARM_LEVEL,
  STATISTICS_ALARM_LEVEL_TYPE,
  STATISTICS_OF_DEVICE_PLAYBACK_TIME,
  STATISTICS_OF_NUMBER_OF_EQUIPMENT_PROGRAMS_LAUNCHED,
  STATISTICS_OF_WORK_ORDER_INCREMENT,
  STRATEGY_INSTRUCT_DISTRIBUTE,
  UPLOAD_SSL_FILE,
  UPDATE_CHANNEL_STATUS,
  QUERY_EQUIPMENT_DATA_LIST,
  SAVE_CHANNEL,
  EXPORT_PROGRAM_DATA,
  EXPORT_WORK_ORDER_DATA,
  UPDATE_CHANNEL,
  DELETE_FILE,
  EXPORT_STRATEGY_LIST,
  ALARM_LEVEL_LIST_NAME,
  LIST_EQUIPMENT_INFO_FOR_MAP,
  STATISTICS_ALARM_LEVEL_EQUIPMENT,
  EQUIPMENT_OPERATION,
  DELETE_STRATEGY,
  CURRENT_PLAY_PROGRAM,
  LIST_SAME_POSITION_EQUIPMENT_INFO_FOR_MAP,
  QUERY_LIGHT_NUMBER_BY_ID,
  QUERY_EQUIPMENT_STRATEGY,
  QUERY_EQUIPMENT_LOCKLIST,
  QUERY_EQUIPMENT_LOCKOFLIST,
  ADD_UNIFY_AUTH,
  AUDING_TEMP_AUTH_BY_ID,
  AUDING_TEMP_AUTH_BY_IDS,
  BATCH_MODIFY_UNIFY_AUTH_STATUS,
  DELETE_TEMP_AUTH_BY_ID,
  DELETE_TEMP_AUTH_BY_IDS,
  DELETE_UNIFY_AUTH_BY_ID,
  DELETE_UNIFY_AUTH_BY_IDS,
  GET_DEVICE_BY_IDS,
  MODIFY_UNIFY_AUTH,
  QUERY_AUTH_BY_NAME,
  QUERY_TEMP_AUTH_BY_ID,
  QUERY_TEMP_AUTH_LIST,
  QUERY_UNIFY_AUTH_BY_ID,
  QUERY_UNIFY_AUTH_LIST, ENABLED_POLICY, CHECK_EQUIPMENT_POLICY,
  ADD_COLLECT_EQUIPMENTS,
  ADD_COLLECT_DEVICES,
  QUERY_REPORT_ANALYSIS, EXPORT_REPORT_ANALYSIS,
  NEW_EQUIPMENT_LIST_PAGE,
  EQUIPMENT_MAP_LIST_BY_STRATEGY,
  EQUIPMENT_LIST_BY_STRATEGY
} from '../const/application-url.const';
import {ApplicationInterface} from './application.interface';
import {DistributeModel} from '../model/distribute.model';
import {EnableOrDisableModel, PolicyControlModel, ProgramListModel, StrategyListModel} from '../model/policy.control.model';
import {GroupListModel} from '../model/equipment.model';
import {QueryConditionModel} from '../../../../shared-module/model/query-condition.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ContentEnableModel, ContentListModel} from '../model/content.list.model';
import {ContentExamineModel} from '../model/content.examine.model';
import {EquipmentCountListModel} from '../model/lighting.model';
import {PassagewayModel} from '../model/passageway.model';
import {LoopListModel} from '../../../../core-module/model/loop/loop-list.model';
import {EquipmentListModel} from '../../../../core-module/model/equipment/equipment-list.model';
import {EquipmentFormModel} from '../../../../core-module/model/work-order/equipment-form.model';
import {EquipmentIdsMapRequestModel} from '../model/equipment-ids-map-request.model';
import {ExportRequestModel} from '../../../../shared-module/model/export-request.model';
import {AlarmListModel} from '../../../../core-module/model/alarm/alarm-list.model';
import {FacilityListModel} from '../../../../core-module/model/facility/facility-list.model';
import {AuditingModal, AuthorityModel} from '../model/authority.model';
import {CheckEquipmentParamModel} from '../../../../core-module/model/application-system/check-equipment-param.model';

@Injectable()
export class ApplicationService implements ApplicationInterface {
  constructor(
    private $http: HttpClient
  ) {
  }

  /**
   * ????????????????????????
   * @ param body
   */
  getLightingPolicyList(queryCondition: QueryConditionModel): Observable<ResultModel<PolicyControlModel[]>> {
    return this.$http.post <ResultModel<PolicyControlModel[]>>(`${LIGHTING_POLICY_LIST}`, queryCondition);
  }

  /**
   * ????????????
   * @ param body
   */
  getAlarmLevelList(queryCondition: QueryConditionModel): Observable<ResultModel<AlarmListModel[]>> {
    return this.$http.post<ResultModel<AlarmListModel[]>>(`${ALARM_LEVEL_LIST}`, queryCondition);
  }

  /**
   * ????????????
   * @ param body
   */
  queryAlarmNamePage(queryCondition: QueryConditionModel): Observable<ResultModel<AlarmListModel[]>> {
    return this.$http.post<ResultModel<AlarmListModel[]>>(`${ALARM_LEVEL_LIST_NAME}`, queryCondition);
  }

  /**
   * ????????????ID ???????????????????????????????????????
   * @ param id
   */
  queryEquipmentCurrentPlayProgram(id: string): Observable<Object> {
    return this.$http.get(`${CURRENT_PLAY_PROGRAM}/${id}`);
  }

  /**
   * ????????????
   * @ param body
   */
  getStatisticsAlarmLevel(): Observable<Object> {
    return this.$http.get(`${STATISTICS_ALARM_LEVEL}`);
  }

  /**
   * ??????????????????
   * @ param body
   */
  getStatisticsEquipmentAlarmLevel(body): Observable<Object> {
    return this.$http.post(`${STATISTICS_ALARM_LEVEL_EQUIPMENT}`, body);
  }

  /**
   * ????????????
   * @ param body
   */
  modifyLightStrategy(params: StrategyListModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${LIGHTING_MODIFY_STRATEGY}`, params);
  }

  /**
   * ????????????????????????
   * @ param body
   */
  modifyReleaseStrategy(params: StrategyListModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${RELEASE_POLICY_EDIT}`, params);
  }

  /**
   * ????????????
   */
  equipmentListByPage(queryCondition: QueryConditionModel): Observable<ResultModel<EquipmentListModel[]>> {
    return this.$http.post<ResultModel<EquipmentListModel[]>>(`${EQUIPMENT_LIST_PAGE}`, queryCondition);
  }

  /**
   * new????????????
   */
  newEquipmentListByPage(queryCondition: QueryConditionModel): Observable<ResultModel<EquipmentListModel[]>> {
    return this.$http.post<ResultModel<EquipmentListModel[]>>(`${NEW_EQUIPMENT_LIST_PAGE}`, queryCondition);
  }
  /**
   * ????????????id??????????????????
   */
  equipmentListByStrategy(queryCondition: QueryConditionModel): Observable<ResultModel<EquipmentListModel[]>> {
    return this.$http.post<ResultModel<EquipmentListModel[]>>(`${EQUIPMENT_LIST_BY_STRATEGY}`, queryCondition);
  }

  /**
   * ????????????
   */
  instructDistribute(body: DistributeModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${INSTRUCT_DISTRIBUTE}`, body);
  }

  /**
   * ?????????????????????????????????
   * @ param body
   */
  getOperation(body): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${EQUIPMENT_OPERATION}`, body);
  }

  /**
   * ?????????????????????
   */
  strategyInstructDistribute(body: DistributeModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${STRATEGY_INSTRUCT_DISTRIBUTE}`, body);
  }

  /**
   * ????????????
   */
  groupControl(body: DistributeModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${GROUP_CONTROL}`, body);
  }

  /**
   * ??????????????????
   * @ param body
   */
  queryEquipmentStatus(body) {
    return this.$http.post(`${EQUIPMENT_STATUS}`, body);
  }

  /**
   * ????????????
   * @ param body
   */
  queryGroupInfoList(queryCondition: QueryConditionModel): Observable<ResultModel<GroupListModel[]>> {
    return this.$http.post<ResultModel<GroupListModel[]>>(`${GROUP_LIST_PAGE}`, queryCondition);
  }

  /**
   *  ??????????????????
   * @ param queryCondition
   */
  queryEquipmentGroupInfoList(queryCondition: QueryConditionModel): Observable<ResultModel<GroupListModel[]>> {
    return this.$http.post<ResultModel<GroupListModel[]>>(`${GROUP_EQUIPMENT_LIST_PAGE}`, queryCondition);
  }


  /**
   * ????????????
   * @ param body
   */
  loopListByPage(queryCondition: QueryConditionModel): Observable<ResultModel<LoopListModel[]>> {
    return this.$http.post<ResultModel<LoopListModel[]>>(`${LOOP_LIST_PAGE}`, queryCondition);
  }

  /**
   * ??????????????????
   * @ param body
   */
  distributeLightStrategy(body: Array<{ strategyId: string, strategyType: string | object[] }>): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${DISTRIBUTE_LIGHT}`, body);
  }

  /**
   * ????????????????????????
   * @ param body
   */
  distributeInfoStrategy(body: Array<{ strategyId: string, strategyType: string | object[] }>): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${DISTRIBUTE_RELEASE}`, body);
  }

  /**
   * ??????????????????
   * @ param body
   */
  distributeLinkageStrategy(body: { strategyId: string, strategyType: string | object[] }): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${DISTRIBUTE_LINKAGE}`, body);
  }

  /**
   * ????????????
   * @ param body
   */
  exportStrategyList(body): Observable<Object> {
    return this.$http.post(`${EXPORT_STRATEGY_LIST}`, body);
  }

  /**
   * ??????????????????
   * @ param body
   */
  addLinkageStrategy(params: StrategyListModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${LINKAGE_ADD}`, params);
  }

  /**
   * ??????????????????
   * @ param body
   */
  modifyLinkageStrategy(params: StrategyListModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${LINKAGE_EDIT}`, params);
  }

  /**
   * ??????????????????????????????
   * @ param body
   */
  getReleaseContentList(queryCondition: QueryConditionModel): Observable<ResultModel<ProgramListModel[]>> {
    return this.$http.post<ResultModel<ProgramListModel[]>>(`${RELEASE_CONTENT_LIST_GET}`, queryCondition);
  }

  /**
   * ???????????????
   * @ param body
   */
  getLightingRateStatisticsData(body): Observable<Object> {
    return this.$http.post(`${LIGHTING_RATE_STATISTICS}`, body);
  }

  /**
   * ???????????????
   * @ param body
   */
  getElectConsStatisticsData(body): Observable<Object> {
    return this.$http.post(`${ELECT_CONS_STATISTICS}`, body);
  }


  /**
   * ????????????????????????
   * @ param body
   */
  deleteReleaseContentList(body: { programIdList: Array<string> }): Observable<ResultModel<ContentListModel[]>> {
    return this.$http.post<ResultModel<ContentListModel[]>>(`${RELEASE_CONTENT_LIST_DELETE}`, body);
  }

  /**
   * ??????????????????
   * @ param body
   */
  enableOrDisableStrategy(body: EnableOrDisableModel[]): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${LIGHTING_ENABLE_DISABLE}`, body);
  }

  /**
   * ??????????????????????????????
   * @ param body
   */
  updateReleaseContentState(body: ContentEnableModel[]): Observable<ResultModel<ContentListModel[]>> {
    return this.$http.post<ResultModel<ContentListModel[]>>(`${RELEASE_CONTENT_STATE_UPDATE}`, body);
  }

  /**
   * ????????????
   * @ param id
   */
  getLightingPolicyDetails(id: string): Observable<ResultModel<StrategyListModel>> {
    return this.$http.get<ResultModel<StrategyListModel>>(`${LIGHTING_POLICY_EDIT}/${id}`);
  }

  /**
   * ????????????
   * @ param id
   */
  checkStrategyNameExist(body: { strategyId: string, strategyName: string }): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${CHECK_STRATEGY_NAME_EXIST}`, body);
  }

  /**
   * ????????????
   * @ param id
   */
  getLinkageDetails(id: string): Observable<ResultModel<StrategyListModel>> {
    return this.$http.get<ResultModel<StrategyListModel>>(`${LINKAGE_DETAILS}/${id}`);
  }

  /**
   * ??????????????????
   * @ param id
   */
  getSecurityPolicyDetails(id: string): Observable<ResultModel<StrategyListModel>> {
    return this.$http.get<ResultModel<StrategyListModel>>(`${SECURITY_POLICY_DETAILS}/${id}`);
  }

  /**
   * ????????????
   * @ param id
   */
  getReleasePolicyDetails(id: string): Observable<ResultModel<StrategyListModel>> {
    return this.$http.get<ResultModel<StrategyListModel>>(`${RELEASE_POLICY_DETAILS}/${id}`);
  }

  /**
   * ??????????????????
   * @ param body
   */
  securityPolicyAdd(params: StrategyListModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${ADD_SECURITY_STRATEGY}`, params);
  }

  /**
   * ??????????????????
   * @ param body
   */
  releasePolicyAdd(params: StrategyListModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${RELEASE_POLICY_ADD}`, params);
  }

  /**
   * ??????????????????????????????
   * @ param body
   */
  editReleaseProgram(body): Observable<Object> {
    return this.$http.post(`${RELEASE_PROGRAM_EDIT}`, body);
  }

  /**
   * ??????????????????????????????????????????
   * @ param body
   */
  lookReleaseProgram(id: string): Observable<ResultModel<ContentListModel>> {
    return this.$http.get <ResultModel<ContentListModel>>(`${RELEASE_PROGRAM_LOOK}/${id}`);
  }

  /**
   * ??????????????????
   * @ param body
   */
  lookReleaseProgramIds(body: Array<string>): Observable<ResultModel<ProgramListModel[]>> {
    return this.$http.post<ResultModel<ProgramListModel[]>>(`${RELEASE_PROGRAM_LOOKS}`, body);
  }

  /**
   * ????????????????????????
   * @ param body
   */
  addReleaseProgram(body): Observable<Object> {
    return this.$http.post(`${RELEASE_PROGRAM_ADD}`, body);
  }

  /**
   * ??????????????????(????????????)
   * @ param body
   */
  addReleaseWorkProgram(body): Observable<Object> {
    return this.$http.post(`${RELEASE_WORK_PROGRAM_ADD}`, body);
  }

  /**
   * ????????????????????????????????????
   * @ param body
   */
  getReleaseProgramWorkList(queryCondition: QueryConditionModel): Observable<ResultModel<ContentExamineModel[]>> {
    return this.$http.post<ResultModel<ContentExamineModel[]>>(`${RELEASE_PROGRAMME_WORK_LIST_GET}`, queryCondition);
  }

  /**
   * ??????????????????????????????
   * @ param body
   */
  releaseWorkOrder(body): Observable<Object> {
    return this.$http.post(`${RELEASE_WORK_ORDER}`, body);
  }

  /**
   * ????????????
   * @ param body
   */
  lightingPolicyAdd(body: StrategyListModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${LIGHTING_POLICY_ADD}`, body);
  }

  /**
   * ????????????
   * @ param body
   */
  deleteStrategy(body: Array<string>): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${DELETE_STRATEGY}`, body);
  }

  /**
   * ??????????????????
   * @ param body
   */
  deleteLinkageStrategy(body: Array<string>): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${DELETE_LINKAGE_STRATEGY}`, body);
  }

  /**
   * ???????????????????????????
   * @ param body
   */
  getControlEquipmentCount(body): Observable<ResultModel<EquipmentCountListModel>> {
    return this.$http.post<ResultModel<EquipmentCountListModel>>(`${CONTROL_EQUIPMENT_COUNT}`, body);
  }

  /**
   * ????????????????????????
   * @ param body
   */
  deleteInfoStrategy(body: Array<string>): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(`${DELETE_INFO_STRATEGY}`, body);
  }

  /**
   * ??????????????????????????????????????????
   * @ param body
   */
  lookReleaseWorkOrder(id): Observable<Object> {
    return this.$http.get(`${RELEASE_WORK_ORDER_DETAIL}/${id}`);
  }

  /**
   * ????????????????????????
   * @ param body
   */
  getSecurityPassagewayList(body): Observable<Object> {
    return this.$http.post(`${SECURITY_PASSAGEWAY_LIST_GET}`, body);
  }

  /**
   * ??????????????????
   * @ param body
   */
  getSecurityConfiguration(id: string): Observable<Object> {
    return this.$http.get(`${SECURITY_CONFIGURATION_GET}/${id}`);
  }

  /**
   * ????????????????????????
   * @ param body
   */
  getSecurityCamera(body): Observable<Object> {
    return this.$http.post(`${SECURITY_CONNECTION_CAMERA_GET}`, body);
  }

  /**
   * ??????/??????????????????
   * @ param body
   */
  saveSecurityConfiguration(body): Observable<Object> {
    return this.$http.post(`${SECURITY_CONFIGURATION_SAVE}`, body);
  }

  /**
   * ??????????????????
   * @ param body
   */
  saveChannel(body): Observable<Object> {
    return this.$http.post(`${SAVE_CHANNEL}`, body);
  }

  /**
   * ??????????????????
   * @ param body
   */
  updateChannel(body): Observable<Object> {
    return this.$http.post(`${UPDATE_CHANNEL}`, body);
  }

  /**
   * ??????????????????????????????????????????
   * @ param body
   */
  uploadSslFile(body): Observable<Object> {
    return this.$http.post(`${UPLOAD_SSL_FILE}`, body);
  }

  /**
   * ????????????
   * @ param body
   */
  deleteSslFile(body): Observable<Object> {
    return this.$http.post(`${DELETE_FILE}`, body);
  }

  /**
   * ?????????????????????
   * @ param body
   */
  cloudControl(body): Observable<Object> {
    return this.$http.post(`${CLOUD_CONTROL}`, body);
  }

  /**
   * ?????????????????????
   * @ param body
   */
  getPresetList(id): Observable<Object> {
    return this.$http.get(`${PRESET_LIST_GET}/${id}`);
  }

  /**
   * ??????????????????
   * @ param body
   */
  cameraLogout(body): Observable<Object> {
    return this.$http.post(`${CAMERA_LOGOUT}`, body);
  }

  /**
   * ??????????????????
   * @ param body
   */
  programStatus(body): Observable<Object> {
    return this.$http.post(`${PROGRAM_STATUS}`, body);
  }


  /**
   * ??????????????????????????????
   * @ param body
   */
  launchQuantityStatistics(body): Observable<Object> {
    return this.$http.post(`${STATISTICS_OF_NUMBER_OF_EQUIPMENT_PROGRAMS_LAUNCHED}`, body);
  }

  /**
   * ????????????????????????
   * @ param body
   */
  durationStatistics(body): Observable<Object> {
    return this.$http.post(`${STATISTICS_OF_DEVICE_PLAYBACK_TIME}`, body);
  }

  /**
   * ??????????????????
   * @ param body
   */
  workOrderIncrementStatistics(body): Observable<Object> {
    return this.$http.post(`${STATISTICS_OF_WORK_ORDER_INCREMENT}`, body);
  }

  /**
   * ????????????/??????
   * @ param body
   */
  adjustVolumeBrightness(body): Observable<Object> {
    return this.$http.post(`${ADJUST_VOLUME_AND_BRIGHTNESS}`, body);
  }

  /**
   * ?????????????????????
   * ???????????????
   */
  getCheckUsers(): Observable<Object> {
    return this.$http.get(`${CHECK_USERS}`);
  }

  /**
   * ??????????????????
   * @ param body
   */
  statisticsAlarmLevelType(body): Observable<Object> {
    return this.$http.post(`${STATISTICS_ALARM_LEVEL_TYPE}`, body);
  }

  /**
   * ??????????????????
   * @ param body
   */
  deleteChannel(body): Observable<Object> {
    return this.$http.post(`${DELETE_CHANNEL}`, body);
  }

  /**
   * ????????????ID??????????????????
   * @ param body
   */
  getChannelData(id: string): Observable<ResultModel<PassagewayModel>> {
    return this.$http.get<ResultModel<PassagewayModel>>(`${QUERY_CHANNEL_LIST_BY_ID}/${id}`);
  }

  /**
   * ????????????????????????
   * @ param body
   */
  programNameRepeat(body): Observable<ResultModel<boolean>> {
    return this.$http.post<ResultModel<boolean>>(`${PROGRAM_NAME_REPEAT}`, body);
  }

  /**
   * ????????????????????????
   * @ param body
   */
  updateChannelStatus(body): Observable<Object> {
    return this.$http.post(`${UPDATE_CHANNEL_STATUS}`, body);
  }

  /**
   * ????????????????????????
   * @ param body
   */
  queryEquipmentDataList(body): Observable<ResultModel<EquipmentFormModel[]>> {
    return this.$http.post<ResultModel<EquipmentFormModel[]>>(`${QUERY_EQUIPMENT_DATA_LIST}`, body);
  }

  /**
   * ??????????????????
   */
  public exportProgramData(body: ExportRequestModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(EXPORT_PROGRAM_DATA, body);
  }

  /**
   * ??????????????????
   */
  public exportWorkOrderData(body: ExportRequestModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(EXPORT_WORK_ORDER_DATA, body);
  }

  /**
   * ????????????id ??????id ??????id ????????????????????????????????????
   * param body
   */
  queryListEquipmentInfoForMap(body: EquipmentIdsMapRequestModel): Observable<ResultModel<EquipmentListModel[]>> {
    return this.$http.post<ResultModel<EquipmentListModel[]>>(`${LIST_EQUIPMENT_INFO_FOR_MAP}`, body);
  }
  /**
   * ????????????id ??????id ??????id ????????????????????????????????????
   * param body
   */
  equipmentMapListByStrategy(strategyId: string): Observable<ResultModel<EquipmentListModel[]>> {
    return this.$http.get<ResultModel<EquipmentListModel[]>>(`${EQUIPMENT_MAP_LIST_BY_STRATEGY}/${strategyId}`);
  }
  /**
   * ????????????id ??????id ??????id ????????????????????????????????????(???????????????????????????????????????)
   * @param body ??????
   */
  queryListSamePositionEquipmentInfoForMap(body: EquipmentIdsMapRequestModel): Observable<ResultModel<Array<EquipmentListModel[]>>> {
    return this.$http.post<ResultModel<Array<EquipmentListModel[]>>>(`${LIST_SAME_POSITION_EQUIPMENT_INFO_FOR_MAP}`, body);
  }

  /**
   * ????????????id ????????????
   * param body
   */
  queryLightNumberByGroupId(body) {
    return this.$http.post(`${QUERY_LIGHT_NUMBER_BY_ID}`, body);
  }

  /**
   * ????????????
   * ????????????????????????
   * * @param body
   */
  public queryUnifyAuthList(body: QueryConditionModel): Observable<ResultModel<{ data: AuthorityModel[] }>> {
    return this.$http.post<ResultModel<{ data: AuthorityModel[] }>>(`${QUERY_UNIFY_AUTH_LIST}`, body);
  }

  /**
   * ??????????????????
   * * @param body
   */
  public addUnifyAuth(body: AuthorityModel): Observable<ResultModel<object>> {
    return this.$http.post<ResultModel<object>>(`${ADD_UNIFY_AUTH}`, body);
  }

  /**
   * ??????id??????????????????
   * @param body ??????id
   */
  public queryUnifyAuthById(body: string): Observable<ResultModel<AuthorityModel>> {
    return this.$http.get<ResultModel<AuthorityModel>>(`${QUERY_UNIFY_AUTH_BY_ID}/${body}`);
  }


  /**
   * ??????????????????
   * @param body ??????????????????
   */
  public modifyUnifyAuth(body: AuthorityModel): Observable<ResultModel<object>> {
    return this.$http.post<ResultModel<object>>(`${MODIFY_UNIFY_AUTH}`, body);
  }

  /**
   * ????????????
   * @param body ??????????????????id
   */
  public deleteUnifyAuthById(body: string): Observable<ResultModel<object>> {
    return this.$http.post<ResultModel<object>>(`${DELETE_UNIFY_AUTH_BY_ID}/${body}`, null);
  }

  /**
   * ??????????????????
   * @param body ??????id??????
   */
  public deleteUnifyAuthByIds(body: string[]): Observable<Object> {
    return this.$http.post(`${DELETE_UNIFY_AUTH_BY_IDS}`, body);
  }

  /**
   * ??????/??????
   * @param body ??????
   */
  public batchModifyUnifyAuthStatus(body): Observable<Object> {
    return this.$http.post(`${BATCH_MODIFY_UNIFY_AUTH_STATUS}`, body);
  }


  /**
   * ????????????
   * ????????????????????????
   * @param body ????????????
   */
  public queryTempAuthList(body: QueryConditionModel): Observable<ResultModel<{ data: AuthorityModel[] }>> {
    return this.$http.post<ResultModel<{ data: AuthorityModel[] }>>(`${QUERY_TEMP_AUTH_LIST}`, body);
  }

  /**
   * ????????????id??????????????????
   * @param id ??????id
   */
  public queryTempAuthById(id: string): Observable<ResultModel<AuthorityModel>> {
    return this.$http.get<ResultModel<AuthorityModel>>(`${QUERY_TEMP_AUTH_BY_ID}/${id}`);
  }

  /**
   * ????????????
   * @param body ??????id
   */
  public audingTempAuthById(body: AuditingModal): Observable<ResultModel<object>> {
    return this.$http.post<ResultModel<object>>(`${AUDING_TEMP_AUTH_BY_ID}`, body);
  }

  /**
   * ????????????
   * @param body ??????id
   */
  public audingTempAuthByIds(body: AuditingModal): Observable<ResultModel<object>> {
    return this.$http.post<ResultModel<object>>(`${AUDING_TEMP_AUTH_BY_IDS}`, body);
  }

  /**
   * ??????????????????
   * @param id ??????id
   */
  public deleteTempAuthById(id: string): Observable<Object> {
    return this.$http.get(`${DELETE_TEMP_AUTH_BY_ID}/${id}`);
  }

  /**
   * ????????????
   * @param body ??????id
   */
  public deleteTempAuthByIds(body): Observable<Object> {
    return this.$http.post(`${DELETE_TEMP_AUTH_BY_IDS}`, body);
  }

  /**
   * ????????????ids??????????????????
   * @param body ??????ids
   */
  getDeviceByIds(body: string[]): Observable<Object> {
    return this.$http.post(`${GET_DEVICE_BY_IDS}`, body);
  }

  /**
   * ????????????????????????
   * @param body ??????????????????
   */
  public queryAuthByName(body): Observable<Object> {
    return this.$http.post(`${QUERY_AUTH_BY_NAME}`, body);
  }
  /**
   * ???????????????????????????????????????
   * @param equipmentId ??????id
   */
  queryEquipmentCurrentPlayStrategy(equipmentId): Observable<Object> {
    return this.$http.get(`${QUERY_EQUIPMENT_STRATEGY}/${equipmentId}`);
  }

  /**
   * ?????????????????????
   */
  public deviceListOfLockByPage(body: QueryConditionModel): Observable<ResultModel<FacilityListModel[]>> {
    return this.$http.post<ResultModel<FacilityListModel[]>>(QUERY_EQUIPMENT_LOCKLIST, body);
  }

  /**
   * ??????????????????
   */
  public deviceListByPage(queryCondition: QueryConditionModel): Observable<ResultModel<FacilityListModel[]>> {
    return this.$http.post<ResultModel<FacilityListModel[]>>(`${QUERY_EQUIPMENT_LOCKOFLIST}`, queryCondition);
  }

  /**
   * ?????????????????????
   */
  checkEnable(body: CheckEquipmentParamModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(ENABLED_POLICY, body);
  }

  /**
   * ??????????????????????????????????????????
   */
  checkEquipmentOnAdd(body: CheckEquipmentParamModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(CHECK_EQUIPMENT_POLICY, body);
  }
  addCollectingEquipmentByIds(body: string[]): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(ADD_COLLECT_EQUIPMENTS, body);
  }
  addCollectingDeviceByIds(body: string[]): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(ADD_COLLECT_DEVICES, body);
  }

  /**
   * ????????????????????????????????????
   * @param body ????????????
   */
  queryReportAnalysisData(body) {
    return this.$http.post(QUERY_REPORT_ANALYSIS, body);
  }
  // ????????????
  reportAnalysisExport(body: ExportRequestModel): Observable<ResultModel<string>> {
    return this.$http.post<ResultModel<string>>(EXPORT_REPORT_ANALYSIS, body);
  }
}

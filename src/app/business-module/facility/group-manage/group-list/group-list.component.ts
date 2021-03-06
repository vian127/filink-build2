import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import * as _ from 'lodash';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {GroupApiService} from '../../share/service/group/group-api.service';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {AssetManagementLanguageInterface} from '../../../../../assets/i18n/asset-manage/asset-management.language.interface';
import {CommonLanguageInterface} from '../../../../../assets/i18n/common/common.language.interface';
import {PageModel} from '../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../shared-module/model/query-condition.model';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {ProgramListModel} from '../../../../core-module/model/group/program-list.model';
import {InstructSendParamModel} from '../../../../core-module/model/group/instruct-send-param.model';
import {InstructSendRequestModel} from '../../../../core-module/model/group/instruct-send-request.model';
import {GroupListModel} from '../../../../core-module/model/group/group-list.model';
import {ControlInstructEnum} from '../../../../core-module/enum/instruct/control-instruct.enum';
import {ApplicationSystemForCommonService} from '../../../../core-module/api-service/application-system';
import {GroupTypeEnum} from '../../../../core-module/enum/group/group.enum';
import {MapEventModel} from '../../../../core-module/model/map-event.model';
import {FilinkMapEnum, MapEventTypeEnum, MapIconSizeEnum, MapTypeEnum} from '../../../../shared-module/enum/filinkMap.enum';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import {SelectGroupService} from '../../../../shared-module/service/index/select-group.service';
import {MAP_DEFAULT_HEIGHT_CONST, MAX_HEIGHT_EDGE_CONST, MIN_HEIGHT_CONST} from '../../../../core-module/const/facility/facility.const';
import {MapConfig} from '../../../../shared-module/component/map/map.config';
import {LoopApiService} from '../../share/service/loop/loop-api.service';
import {FacilityShowService} from '../../../../shared-module/service/index/facility-show.service';
import {MapDataModel} from '../../../../core-module/model/index/map-data-model';
import {FacilityForCommonUtil} from '../../../../core-module/business-util/facility/facility-for-common.util';
import {MapStoreService} from '../../../../core-module/store/map.store.service';
import {MapCoverageService} from '../../../../shared-module/service/index/map-coverage.service';
import {DeviceAreaModel} from '../../../index/shared/model/device-area.model';
import {EquipmentAreaModel} from '../../../../core-module/model/index/equipment-area.model';
import {AlarmAreaModel} from '../../../index/shared/model/alarm-area.model';
import {IndexApiService} from '../../../index/service/index/index-api.service';
import {SessionUtil} from '../../../../shared-module/util/session-util';
import {mapIconConfig} from '../../../../shared-module/service/map-service/map.config';
import {ConfigModel} from '../../../index/shared/model/config-model';
import {OperationService} from '../../../../shared-module/service/index/operation.service';
import {MapGroupCommonComponent} from '../../../../shared-module/component/map/map-group-common.component';
import {MapService} from '../../../../core-module/api-service/index/map';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {FacilityForCommonService} from '../../../../core-module/api-service/facility';
import {MapConfig as BMapConfig} from '../../../../shared-module/component/map/b-map.config';

declare const MAP_TYPE;
declare var $: any;

/**
 * ??????????????????
 */
@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit, OnDestroy {
  // ??????
  @ViewChild('mainMap') mainMap: MapGroupCommonComponent;
  // ?????????????????????
  public dataSet: GroupListModel[] = [];
  // ????????????
  public pageBean: PageModel = new PageModel();
  // ??????????????????
  public tableConfig: TableConfigModel = new TableConfigModel();
  // ??????????????????
  public queryCondition: QueryConditionModel = new QueryConditionModel();
  // ?????????
  public language: FacilityLanguageInterface;
  // ???????????????
  public commonLanguage: CommonLanguageInterface;
  // ?????????????????????
  public assetLanguage: AssetManagementLanguageInterface;
  // ?????????????????????????????????
  public showGroupViewDetail: boolean = false;
  // ??????????????????????????????
  public showGroupControlView: boolean = false;
  // ????????????
  public program: ProgramListModel = new ProgramListModel();
  // ??????????????????
  public currentGroup: GroupListModel = new GroupListModel();
  // ??????????????????
  public controlInstructEnum = ControlInstructEnum;
  // ??????????????????
  public equipmentTypes: string[] = [];
  // ??????ids
  private groupIds: string[] = [];
  // ?????????????????????????????????
  public isShowUpIcon: boolean = true;
  // ?????????????????????????????????
  public isShowDownIcon: boolean = true;
  // ????????????
  public mapConfig: MapConfig;
  // ????????????????????????
  public data: MapDataModel[];
  // ??????????????????
  public iconSize: string;
  // ???????????????
  public centerPoint: string[];
  // ??????????????????????????????
  public areaFacilityByLoop: boolean = false;
  // ????????????
  public mapType: FilinkMapEnum;
  // ?????????????????????id??????
  public deviceIds: string[] = [];
  // ?????????????????????????????????
  public equipmentIds: string[] = [];
  // ????????????????????????????????????
  public isShowButton: boolean = false;
  // ??????????????????????????????
  public srcPositionY: number;
  // ????????????????????????
  public isShowTable: boolean = true;
  // ????????????????????????
  public maxHeight: number;
  // ??????????????????????????????
  public isVisible: boolean = false;
  // ????????????????????????
  public minHeight: number = MIN_HEIGHT_CONST;
  // ????????????
  public areaData: string[];
  // ???????????????????????????
  public isShowProgressBar: boolean = false;
  // ?????????????????????
  public percent: number;
  // ????????????????????????
  public increasePercent: number;
  // ?????????????????????
  private scheduleTime: number;
  // ??????????????????
  public facilityStoreData = [];
  // ??????????????????
  public equipmentStoreData: string[];
  // ????????????/????????????
  public mapTypeEnum = MapTypeEnum;
  // ????????????????????????
  public deviceAreaModel: DeviceAreaModel = new DeviceAreaModel;
  // ????????????????????????
  public equipmentAreaModel: EquipmentAreaModel = new EquipmentAreaModel;
  // ??????????????????????????????
  public alarmAreaModel: AlarmAreaModel = new AlarmAreaModel;
  // ????????????
  public roleAlarm: boolean = false;
  // ????????????????????????
  public facilityIconSizeValue: string;
  // ??????????????????????????????
  public facilityIconSizeConfig: ConfigModel[];
  // ?????????????????????
  public groupChangeDataSet: object[] = [];
  // ??????/????????????
  public selectMapType: MapTypeEnum = MapTypeEnum.facility;
  // ????????????????????????
  public isShowGroupChange: boolean = false;
  // ?????????????????????????????????????????????????????????
  public facilityInGroup: any;
  // ??????????????????????????????????????????????????????
  private storeMapData: any;
  public initMapDevice: boolean = false;
  // ???????????????
  private destroy$ = new Subject<void>();

  /**
   * ?????????
   */
  constructor(private $nzI18n: NzI18nService,
              private $groupApiService: GroupApiService,
              private $applicationCommonService: ApplicationSystemForCommonService,
              private $message: FiLinkModalService,
              private $modalService: NzModalService,
              private $selectGroupService: SelectGroupService,
              private $loopService: LoopApiService,
              private $facilityShowService: FacilityShowService,
              private $mapStoreService: MapStoreService,
              private $mapCoverageService: MapCoverageService,
              private $indexApiService: IndexApiService,
              private $mapService: MapService,
              private $OperationService: OperationService,
              private $router: Router,
              private $facilityForCommonService: FacilityForCommonService) {
  }

  mapShowRefresh = _.debounce(() => {
    this.queryHomeData();
  }, 200, {leading: false, trailing: true});

  /**
   * ???????????????
   */
  public ngOnInit(): void {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.assetLanguage = this.$nzI18n.getLocaleData(LanguageEnum.assets);
    this.roleAlarm = SessionUtil.checkHasRole('02');
    this.mapType = MAP_TYPE;
    this.mapConfig = new MapConfig('index-map', this.mapType, mapIconConfig.defaultIconSize, []);
    // ?????????????????????
    this.$mapStoreService.mapType = this.mapType;
    // ??????????????????
    this.facilityIconSizeConfig = mapIconConfig.iconConfig;
    // ????????????????????????
    this.iconSize = mapIconConfig.defaultIconSize;
    // ?????????????????????
    this.facilityIconSizeValue = mapIconConfig.defaultIconSize;
    // ??????????????????
    this.$mapCoverageService.showCoverage = this.mapTypeEnum.facility;
    // ???????????????????????????????????????????????????
    this.$facilityShowService.subject.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value.mapShowType) {
        // ??????????????????????????????
        if (this.mainMap.mapService.mapInstance) {
          this.mainMap.mapService.mapInstance.clearOverlays();
        }
        if (this.mainMap.mapService.markerClusterer) {
          this.mainMap.mapService.markerClusterer.clearMarkers();
        }
      }
      // ?????????????????????
      this.mapShowRefresh();
    });
    // ???????????????
    this.initGroupTableConfig();
    // ??????????????????
    this.refreshData();
    // ????????????????????????
    this.selectGroupDataInit();
    // ??????????????????
    this.handleInitData();
    // ??????????????????
    this.getAllMapConfig();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * ????????????????????????
   */
  public selectGroupDataInit(): void {
    this.$selectGroupService.eventEmit.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value.datas && value.showCoverage) {
        this.$mapCoverageService.showCoverage = value.showCoverage;
        if (value.showCoverage === MapTypeEnum.facility) { // ??????????????????
          this.groupChangeDataSet = value.datas;
          this.selectMapType = MapTypeEnum.device;
        } else { // ??????????????????
          this.selectMapType = MapTypeEnum.equipment;
          const equipmentData = [];
          value.datas.forEach(item => {
            equipmentData.push(item.equipmentList);
          });
          this.groupChangeDataSet = _.flattenDeep(equipmentData);
        }
        this.groupChangeDataSet.forEach(item => {
          item['checked'] = false;
        });
        // this.isShowGroupChange = true;
      }
    });
  }

  /**
   * ????????????????????????
   */
  getAllMapConfig() {
    // ???????????????????????????
    this.$mapService.getALLFacilityConfig().subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        // ??????????????????
        if (result.data && result.data.deviceIconSize) {
          this.facilityIconSizeValue = result.data.deviceIconSize;
          this.$mapStoreService.facilityIconSize = result.data.deviceIconSize;
          this.iconSize = result.data.deviceIconSize;
        }
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.$message.remove();
    });
  }

  /**
   * ?????????????????????
   */
  private handleInitData(): void {
    // ??????????????????
    this.mapType = FilinkMapEnum.baiDu;
    this.mapConfig = new MapConfig('group-map', this.mapType, MapIconSizeEnum.defaultIconSize, []);
    this.iconSize = MapIconSizeEnum.defaultIconSize;
    this.$selectGroupService.eventEmit.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value && !value.isShow) {
        if (!_.isEmpty(value.datas)) {
          if (this.$mapCoverageService.showCoverage === this.mapTypeEnum.facility) {
            // ??????????????????????????????
            if (!_.isEmpty(this.deviceIds)) {
              this.mainMap.selectMarkerId();
              this.deviceIds = [];
            }
            // ???????????????????????????id??????
            this.deviceIds = value.datas.map(item => item.deviceId) || [];
            value.datas.forEach(v => {
              if (this.mainMap) {
                // ???????????????
                this.mainMap.selectMarkerId(v.deviceId);
              }
            });
            this.queryCondition.filterConditions = [new FilterCondition('deviceIds', OperatorEnum.in, this.deviceIds)];
          } else {
            // ??????????????????????????????
            if (!_.isEmpty(this.equipmentIds)) {
              this.mainMap.selectMarkerId();
              this.equipmentIds = [];
            }
            // ???????????????id??????
            this.equipmentIds = value.datas.map(item => item.equipmentId) || [];
            value.datas.forEach(v => {
              if (this.mainMap) {
                // ???????????????
                this.mainMap.selectMarkerId(v.equipmentId);
              }
            });
            this.queryCondition.filterConditions = [new FilterCondition('equipmentIds', OperatorEnum.in, this.equipmentIds)];
          }
        } else {
          this.queryCondition.filterConditions = [];
        }
        this.refreshData();
      }
    });
    // this.$selectGroupService.eventEmit.emit({isShow: this.isShowButton});
  }

  /**
   *  ????????????
   */
  public pageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.refreshData();
  }

  /**
   *  ????????????
   */
  public onCommonControl(event: ControlInstructEnum): void {
    const body = new InstructSendRequestModel<{}>(event, [], {}, this.groupIds);
    this.handelSendInstruct(body, true);
  }

  /**
   *  ??????????????????
   */
  public onLightChangeValue(event: number): void {
    const body = new InstructSendRequestModel<{ lightnessNum: number }>(
      this.controlInstructEnum.dimming,
      [],
      {lightnessNum: event},
      this.groupIds,
    );
    this.handelSendInstruct(body, true);
  }

  /**
   * ??????????????????
   */
  public onSlideScreenLightChange(event: number): void {
    const body = new InstructSendRequestModel<{ lightnessNum: number }>(
      this.controlInstructEnum.dimming,
      [],
      {lightnessNum: event},
      this.groupIds
    );
    this.handelSendInstruct(body);
  }

  /**
   *  ???????????????
   */
  public onScreenVolumeChangeValue(event: number): void {
    const body = new InstructSendRequestModel<{ volumeNum: number }>(
      this.controlInstructEnum.setVolume,
      [],
      {volumeNum: event},
      this.groupIds
    );
    this.handelSendInstruct(body);
  }

  /**
   * ?????????????????? ??????
   * @param event ??????????????????????????????????????????
   */

  /**
   *  ????????????
   */
  public onScreenPlay(event: InstructSendParamModel): void {
    if (!event) {
      this.$message.info(this.language.noProgram);
      return;
    }
    const body = new InstructSendRequestModel<InstructSendParamModel>(
      this.controlInstructEnum.screenPlay,
      [],
      event,
      this.groupIds
    );
    this.handelSendInstruct(body);
  }

  /**
   * ????????????
   */
  private handelSendInstruct(body: InstructSendRequestModel<{}>, isNeedCheckMode = false): void {
    this.$applicationCommonService.groupControl(body).subscribe((result: ResultModel<string>) => {
      if (isNeedCheckMode) {
        // ?????????????????????
        this.checkEquipmentMode().then(resolve => {
          if (result.code === ResultCodeEnum.success) {
            if (resolve.code === ResultCodeEnum.success) {
              this.$message.success(this.assetLanguage.instructHasSent);
            } else {
              // ??????????????????????????????????????????????????????????????????
              this.$message.error(resolve.msg);
            }
          } else {
            this.$message.error(result.msg);
          }
        });
      } else {
        // ???????????????????????????
        if (result.code === ResultCodeEnum.success) {
          this.$message.success(this.assetLanguage.instructHasSent);
        } else {
          this.$message.error(result.msg);
        }
      }
    });
  }

  /**
   * ????????????
   */
  private routingJump(url: string, extras = {}): void {
    this.$router.navigate([url], extras).then();
  }

  /**
   * ?????????????????????
   */
  private initGroupTableConfig(): void {
    this.tableConfig = {
      primaryKey: '03-9',
      isDraggable: true,
      isLoading: true,
      showSearchSwitch: true,
      showSizeChanger: true,
      notShowPrint: true,
      scroll: {x: '1200px', y: '600px'},
      noIndex: true,
      showSearchExport: false,
      columnConfig: [
        { // ??????
          title: this.language.select,
          type: 'select',
          fixedStyle: {
            fixedLeft: true,
            style: {left: '0px'}
          },
          width: 62
        },
        {
          type: 'serial-number', title: this.language.serialNumber, width: 62,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        { // ????????????
          title: this.language.groupName,
          key: 'groupName',
          width: 430,
          configurable: false,
          searchable: true,
          isShowSort: true,
          searchConfig: {type: 'input'}
        },
        { // ??????
          title: this.language.remarks,
          key: 'remark',
          isShowSort: true,
          configurable: false,
          width: 450,
          searchable: true,
          searchConfig: {
            type: 'input'
          }
        },
        { // ??????
          title: this.commonLanguage.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 130,
          fixedStyle: {fixedRight: false, style: {right: '0px'}}
        }
      ],
      topButtons: [
        { // ??????
          text: this.language.add,
          iconClassName: 'fiLink-add-no-circle',
          permissionCode: '03-9-1',
          handle: () => {
            this.routingJump('business/facility/group-detail/add', {});
          }
        },
        { // ??????
          text: this.commonLanguage.deleteBtn,
          btnType: 'danger',
          className: 'table-top-delete-btn',
          iconClassName: 'fiLink-delete',
          permissionCode: '03-9-4',
          needConfirm: false,
          canDisabled: true,
          confirmContent: this.language.confirmDeleteData,
          handle: (data: GroupListModel[]) => {
            data = data.filter(v => v.groupType !== GroupTypeEnum.equipmentGroup);
            const ids = data.map(item => {
              return item.groupId;
            });
            if (_.isEmpty(ids)) {
              this.$message.info(this.language.pleaseSelectNotEquipmentGroup);
              this.refreshData();
              return;
            }
            this.handelDeleteGroup(ids);
          }
        },
        { // ??????
          permissionCode: '03-9-5',
          text: this.assetLanguage.groupControl,
          className: 'table-top-control-btn',
          iconClassName: 'fiLink-control',
          canDisabled: true,
          handle: (data: GroupListModel[]) => {
            this.groupIds = data.map(item => item.groupId);
            this.queryGroupRefEquipmentType();
            this.showGroupControlView = true;
          }
        }
      ],
      leftBottomButtons: [],
      showPagination: true,
      bordered: false,
      showSearch: false,
      operation: [
        { // ??????
          permissionCode: '03-9-2',
          key: 'isNotEquipmentGroup',
          text: this.commonLanguage.edit, className: 'fiLink-edit',
          handle: (data: GroupListModel) => {
            this.routingJump('business/facility/group-detail/update',
              {queryParams: {groupId: data.groupId}});
          },
        },
        { // ????????????
          permissionCode: '03-9-3',
          text: this.language.groupDetail, className: 'fiLink-view-detail',
          handle: (data: GroupListModel) => {
            this.currentGroup = data;
            this.showGroupViewDetail = true;
          },
        },
        { // ??????
          permissionCode: '03-9-5',
          text: this.language.control, className: 'fiLink-control',
          handle: (data: GroupListModel) => {
            // ??????????????????????????????????????????????????????
            // this.queryProgramList();
            this.groupIds = [data.groupId];
            this.queryGroupRefEquipmentType();
            this.showGroupControlView = true;
          },
        },
        { // ??????
          permissionCode: '03-9-4',
          key: 'isNotEquipmentGroup',
          text: this.commonLanguage.deleteBtn, className: 'fiLink-delete red-icon',
          needConfirm: false,
          handle: (data: GroupListModel) => {
            const ids = [data.groupId];
            this.handelDeleteGroup(ids);
          }
        },
      ],
      // ??????
      sort: (event: SortCondition) => {
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      // ????????????
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        this.refreshData();
      },
      handleSelect: (event) => {
        if (event.length === 0) {
          this.storeMapData = null;
          //  ????????????????????????????????????
          this.mainMap.resetAllTargetMarker();
          return;
        }
        if (this.$mapCoverageService.showCoverage === this.mapTypeEnum.facility) {
          this.getDeviceMapByGroupIds(event.map(item => item.groupId));
        } else {
          this.getEquipmentMapByGroupIds(event.map(item => item.groupId));
        }
      },
    };
  }

  /**
   *  ??????????????????
   */
  private handelDeleteGroup(groupList: string[]): void {
    this.$modalService.confirm({
      nzTitle: this.language.prompt,
      nzOkType: 'danger',
      nzOkText: this.commonLanguage.cancel,
      nzContent: `<span>${this.language.confirmDeleteData}</span>`,
      nzMaskClosable: false,
      nzOnOk: () => {
      },
      nzCancelText: this.commonLanguage.confirm,
      nzOnCancel: () => {
        this.$groupApiService.delGroupInfByIds(groupList).subscribe((res: ResultModel<string>) => {
          if (res.code === ResultCodeEnum.success) {
            this.$message.success(this.assetLanguage.deleteGroupSuccess);
            this.refreshData();
          } else {
            this.$message.error(res.msg);
          }
        });
      }
    });
  }

  /**
   *  ????????????????????????????????????????????????
   */
  private queryGroupRefEquipmentType(): void {
    this.$groupApiService.listEquipmentTypeByGroupId({groupIds: this.groupIds}).subscribe((res: ResultModel<string[]>) => {
      if (res.code === ResultCodeEnum.success) {
        this.equipmentTypes = res.data || [];
      } else {
        this.$message.error(res.msg);
      }
    });
  }


  /**
   * ?????????????????????????????????
   */
  private checkEquipmentMode(): Promise<ResultModel<any>> {
    return new Promise((resolve, reject) => {
      this.$facilityForCommonService.checkEquipmentMode({groupEquipmentIdList: this.groupIds}).subscribe((res: ResultModel<any>) => {
        resolve(res);
      });
    });
  }

  /**
   * ??????????????????
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    this.$groupApiService.queryGroupInfoList(this.queryCondition).subscribe(
      (result: ResultModel<GroupListModel[]>) => {
        this.tableConfig.isLoading = false;
        if (result.code === ResultCodeEnum.success) {
          this.dataSet = result.data;
          this.pageBean.Total = result.totalCount;
          this.pageBean.pageIndex = result.pageNum;
          this.pageBean.pageSize = result.size;
          this.dataSet.forEach(item => {
            item.isNotEquipmentGroup = !(item.groupType === GroupTypeEnum.equipmentGroup);
          });
        } else {
          this.$message.error(result.msg);
        }
      }, () => {
        this.tableConfig.isLoading = false;
      });
  }

  /**
   * ?????????????????????????????????????????????
   */
  public dragoverHandle(e): void {
    // ????????????????????????????????????????????????
    if (!this.isShowUpIcon) {
      return;
    }
    // ???????????????????????????
    this.isShowTable = true;
    // ????????????????????????
    const move_dist = e.pageY - this.srcPositionY;
    const doc = $('#drag-content');
    // ????????????????????????
    let afterAdjHeight = doc.height() + move_dist;
    afterAdjHeight = afterAdjHeight > this.minHeight ? afterAdjHeight : this.minHeight;
    // ???????????????
    $('#drag-box').height(afterAdjHeight);
    doc.height(afterAdjHeight);
    this.srcPositionY = e.pageY;
    e.preventDefault();
  }

  /**
   * ??????????????????????????????
   */
  public dropHandle(e): void {
    // ????????????????????????????????????????????????
    if (!this.isShowUpIcon) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
  }

  /**
   * ??????????????????
   */
  public mapEvent(event: MapEventModel): void {
    if (event.type === MapEventTypeEnum.selected) {
      this.deviceIds = [event.id];
      if (this.$mapCoverageService.showCoverage === MapTypeEnum.facility) {
        this.queryCondition.filterConditions = [new FilterCondition('deviceIds', OperatorEnum.in, [event.id])];
      } else {
        // ????????????????????????????????????--??????
        this.queryCondition.filterConditions = [new FilterCondition('equipmentIds', OperatorEnum.in, [event.id])];
      }
      this.refreshData();
      this.queryCondition.bizCondition = null;
      this.queryCondition.filterConditions = [];
    } else if (event.type === MapEventTypeEnum.mapBlackClick) {
      console.log(1111);
      this.mainMap.resetAllTargetMarker();
      this.queryCondition.filterConditions = [];
      this.queryCondition.bizCondition = null;
      this.groupChangeDataSet = [];
      this.refreshData();
      this.deviceIds = [];
      this.storeMapData = null;
      this.isShowButton = false;
    } else if (event.type === MapEventTypeEnum.mapDrag) {
      // ????????????
      this.facilityInGroup = _.cloneDeep(this.storeMapData);
      if (this.facilityInGroup) {
        this.facilityInGroup.positionCenter = null;
      }
    }
    // ???????????????????????????
    if (event.type === MapEventTypeEnum.areaPoint) {
      this.areaFacilityByLoop = false;
      if (this.mainMap.mapService) {
        // ????????????????????????
        this.mainMap.mapService.markerClusterer.clearMarkers();
        // ????????????????????????????????????
        this.mainMap.mapService.panTo(event.data['lng'], event.data['lat']);
        // ???????????????
        this.mainMap.getMapDeviceData([event.data.code]);
      }
    }
  }

  /**
   * ??????????????????
   */
  public mapSelectData(): void {
    // ???????????????????????????????????????
    this.$OperationService.eventEmit.emit({selectGroup: false});
    // ??????????????????????????????
    if (!_.isEmpty(this.groupChangeDataSet)) {
      this.mainMap.selectMarkerId();
      this.groupChangeDataSet = [];
    }
    this.isShowButton = !this.isShowButton;
    this.$selectGroupService.eventEmit.emit({isShow: this.isShowButton});
  }

//   /**
//    * ???????????????//????????????
//    */
//   public noneGroupOperation(): void {
//     debugger
//     // ????????????????????????
//     if (this.mainMap.mapService.getZoom() <= BMapConfig.areaZoom) {
//       return;
//     }
//     const bound = this.mainMap.mapService.mapInstance.getBounds(); // ??????????????????
//     const facilityListInWindow = [];
//     this.mainMap.mapService.getMarkerMap().forEach(value => {
//       if (bound.containsPoint(value.marker.point) === true && !value.data.code) {
//         facilityListInWindow.push(value.data);
//       }
//     });
//     if (facilityListInWindow.length === 0) {
//       return;
//     }
//     if (this.$mapCoverageService.showCoverage === this.mapTypeEnum.facility) {
//       this.queryCondition.filterConditions = [new FilterCondition('deviceType',
//         OperatorEnum.in, this.facilityStoreData), new FilterCondition('deviceIds', OperatorEnum.in, facilityListInWindow.map(item => item.deviceId))];
//       // [new FilterCondition('deviceType', OperatorEnum.in, ['D001', 'D002', 'D003', 'D004', 'D005'])];
//       this.$groupApiService.notInGroupForDeviceMap(this.queryCondition).subscribe((res: ResultModel<any>) => {
//         console.log(res);
//         if (res.code === ResultCodeEnum.success) {
//           // FacilityListModel
//           if (res.data.polymerizationData.length > 0) {
//             this.mainMap.locationByIds(res.data);
//           } else {
//             this.$message.info('????????????????????????????????????');
//           }
//         } else {
//           this.$message.error(res.msg);
//         }
//       });
//     } else {
// this.queryCondition.filterConditions = [new FilterCondition('equipmentType', OperatorEnum.in, this.equipmentStoreData)];
//       console.log(facilityListInWindow);
//       this.queryCondition.filterConditions.push(new FilterCondition('equipmentId', OperatorEnum.in, facilityListInWindow.map(item => item.equipmentId)));
//       this.$groupApiService.notInGroupForEquipmentMap(this.queryCondition).subscribe((res: ResultModel<any>) => {
//         console.log(res);
//         if (res.code === ResultCodeEnum.success) {
//           // FacilityListModel
//           if (res.data.equipmentData.length > 0) {
//             this.mainMap.locationByIds(res.data);
//           } else {
//             this.$message.info('????????????????????????????????????');
//           }
//         } else {
//           this.$message.error(res.msg);
//         }
//       });
//     }
//   }

  public noneGroupOperation() {
    const facilityListInWindow = FacilityForCommonUtil.getFacilityListInWindow(this, this.language);
    if (!facilityListInWindow) {
      return;
    }
    if (this.$mapCoverageService.showCoverage === this.mapTypeEnum.facility) {
      this.queryCondition.filterConditions = [new FilterCondition('deviceType',
        OperatorEnum.in, this.facilityStoreData), new FilterCondition('deviceIds', OperatorEnum.in, facilityListInWindow.map(item => item.deviceId))];
      // [new FilterCondition('deviceType', OperatorEnum.in, ['D001', 'D002', 'D003', 'D004', 'D005'])];
      this.$groupApiService.notInGroupForDeviceMap(this.queryCondition).subscribe((res: ResultModel<any>) => {
        if (res.code === ResultCodeEnum.success) {
          // FacilityListModel
          if (res.data.polymerizationData.length > 0) {
            if (this.mainMap) {
              this.mainMap.locationByIds(res.data);
            }
          } else {
            this.$message.info('????????????????????????????????????');
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    } else {
      // ?????????????????????????????????????????????????????????equipmentList ??????
      const equipmentIds = [];
      facilityListInWindow.forEach(item => {
        item.equipmentList.forEach( v => {
          equipmentIds.push(v.equipmentId);
        });
      });
      this.queryCondition.filterConditions = [new FilterCondition('equipmentType', OperatorEnum.in, this.equipmentStoreData)];
      this.queryCondition.filterConditions.push(new FilterCondition('equipmentId', OperatorEnum.in, equipmentIds));
      this.$facilityForCommonService.notInGroupForEquipmentMap(this.queryCondition).subscribe((res: ResultModel<any>) => {
        if (res.code === ResultCodeEnum.success) {
          // FacilityListModel
          if (res.data.equipmentData.length > 0) {
            if (this.mainMap) {
              this.mainMap.locationByIds(res.data, facilityListInWindow);
            }
          } else {
            this.$message.info('????????????????????????????????????');
          }
        } else {
          this.$message.error(res.msg);
        }
      });
    }
  }

  /**
   * ??????????????????
   */
  public groupChange(): void {
    if (_.isEmpty(this.groupChangeDataSet)) {
      if (this.$mapCoverageService.showCoverage === this.mapTypeEnum.facility) {
        this.$message.info(this.assetLanguage.pleaseSelectDevice);
      } else {
        this.$message.info(this.assetLanguage.pleaseSelectEquipment);
      }
      return;
    }
    this.isShowButton = false;
    this.isShowGroupChange = true;
    this.$selectGroupService.eventEmit.emit({isShow: this.isShowButton});
  }

  /**
   * ??????????????????????????????
   */
  public dragstartHandle(e): void {
    // ???????????????
    this.srcPositionY = e.pageY;
  }

  /**
   * ???????????????
   */
  public mapMinHeightChange(): void {
    // ????????????
    this.isShowTable = true;
    this.isShowDownIcon = true;
    if ($('#drag-box').height() > (window.innerHeight / 2)) {
      $('#drag-content').height(MAP_DEFAULT_HEIGHT_CONST);
      $('#drag-box').height(MAP_DEFAULT_HEIGHT_CONST);
    } else {
      // ??????????????????????????????
      $('#drag-content').height(0);
      $('#drag-box').height(0);
      $('#drag-content').hide();
      //  ???????????????????????????
      this.isShowUpIcon = false;
    }
    // ??????????????????
    // this.refreshData();
  }

  /**
   * ???????????????
   */
  public mapBigHeightChange(): void {
    // ??????????????????????????????
    this.isShowUpIcon = true;
    if ($('#drag-content').height() === 0) {
      // ??????????????????
      $('#drag-content').height(MAP_DEFAULT_HEIGHT_CONST);
      $('#drag-box').height(MAP_DEFAULT_HEIGHT_CONST);
      $('#drag-content').show();
      // this.initMapData();
    } else {
      // ?????????????????? = ??????????????? - ????????????
      this.maxHeight = window.innerHeight - MAX_HEIGHT_EDGE_CONST;
      // ????????????????????????
      $('#drag-content').height(this.maxHeight);
      $('#drag-box').height(this.maxHeight);
      $('#drag-content').show();
      // ??????
      this.isShowTable = false;
      this.isShowDownIcon = false;
    }
    if (this.mainMap.mapService.getZoom() > BMapConfig.areaZoom) {
      // ??????????????????????????????????????????????????????
      setTimeout(() => {
        if (this.mainMap) {
          this.mainMap.selectedFacility(this.storeMapData);
        }
      }, 100);
    }

  }

  /**
   * ?????????????????????
   */
  public showProgressBar(): void {
    this.percent = 0;
    this.increasePercent = 5;
    this.isShowProgressBar = true;
    this.scheduleTime = window.setInterval(() => {
      if (this.percent >= 100) {
        clearInterval(this.scheduleTime);
      } else {
        this.percent += this.increasePercent;
        if (this.percent === 50) {
          this.increasePercent = 2;
        } else if (this.percent === 80) {
          this.increasePercent = 1;
        } else if (this.percent === 99) {
          this.increasePercent = 0;
        }
      }
    }, 500);
  }

  /**
   * ?????????????????????
   */
  public hideProgressBar(): void {
    this.percent = 100;
    setTimeout(() => {
      this.isShowProgressBar = false;
    }, 1000);
  }

  facilityLayeredChange() {
    this.isShowButton = false;
    // this.$OperationService.eventEmit.emit({facility: false});
  }

  /**
   * ??????????????????
   */
  public queryHomeDeviceArea() {
    // ????????????????????????????????????
    const areaStoreData = this.$mapStoreService.areaSelectedResults || [];
    // ??????????????????????????????????????????
    if (this.$mapStoreService.facilityTypeSelectedResults.length) {
      this.facilityStoreData = [];
      this.$mapStoreService.facilityTypeSelectedResults.forEach(item => {
        this.$mapStoreService.showFacilityTypeSelectedResults.forEach(_item => {
          if (item === _item) {
            this.facilityStoreData.push(item);
          }
        });
      });
      if (!this.facilityStoreData.length && this.initMapDevice && this.$mapStoreService.showFacilityTypeSelectedResults &&
        this.$mapStoreService.showFacilityTypeSelectedResults && this.$mapStoreService.showFacilityTypeSelectedResults.length) {
        this.facilityStoreData = ['noData'];
      }
    } else {
      this.facilityStoreData = this.$mapStoreService.showFacilityTypeSelectedResults;
    }
    // ??????????????????????????????????????????
    if (this.$mapStoreService.equipmentTypeSelectedResults.length) {
      this.equipmentStoreData = [];
      this.$mapStoreService.equipmentTypeSelectedResults.forEach(item => {
        if (item === this.$mapStoreService.showEquipmentTypeSelectedResults[0]) {
          this.equipmentStoreData = [item];
        }
      });
      if (!this.equipmentStoreData.length) {
        this.equipmentStoreData = ['noData'];
      }
    } else {
      this.equipmentStoreData = this.$mapStoreService.showEquipmentTypeSelectedResults;
    }
    let requestHeader;
    if (this.$mapCoverageService.showCoverage === this.mapTypeEnum.facility) {
      // ????????????
      this.deviceAreaModel.polymerizationType = '1';
      this.deviceAreaModel.filterConditions.area = areaStoreData ? areaStoreData : [];
      this.deviceAreaModel.filterConditions.device = this.facilityStoreData ? this.facilityStoreData : [];
      const testData = this.deviceAreaModel;
      this.$mapStoreService.polymerizationConfig = testData;
      requestHeader = this.$indexApiService.queryDevicePolymerizationList(testData);
    } else {
      // ????????????
      this.equipmentAreaModel.polymerizationType = '1';
      this.equipmentAreaModel.filterConditions.area = areaStoreData ? areaStoreData : [];
      this.equipmentAreaModel.filterConditions.equipment = this.equipmentStoreData ? this.equipmentStoreData : [];
      const testData = this.equipmentAreaModel;
      this.$mapStoreService.polymerizationConfig = testData;
      requestHeader = this.$mapService.queryEquipmentPolymerizationList(testData);
    }
    return new Promise((resolve, reject) => {
      // ?????????????????????
      requestHeader.subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          if (result.data.polymerizationData && result.data.polymerizationData.length) {
            const data = result.data;
            resolve(data);
            this.hideProgressBar();
          } else {
            this.cacheData([]);
            if (this.mainMap) {
              this.mainMap.mapService.locateToUserCity();
            }
            this.hideProgressBar();
          }
        } else {
          if (this.mainMap) {
            this.mainMap.mapService.locateToUserCity();
          }
          this.hideProgressBar();
        }
      }, () => {
        if (this.mainMap) {
          this.mainMap.mapService.locateToUserCity();
        }
        this.hideProgressBar();
      });
    });
  }

  /**
   * ????????????????????????
   */
  public queryAlarmListHome(data) {
    if (!data.polymerizationData.length && this.mainMap.mapService) {
      this.mainMap.mapService.markerClusterer.clearMarkers();
      return;
    }
    this.centerPoint = data.positionCenter.split(',');
    const alarmData = new AlarmAreaModel();
    alarmData.filterConditions[0].filterField = this.$mapCoverageService.showCoverage === 'facility' ? 'alarm_device_type_id' : 'alarm_source_type_id';
    alarmData.filterConditions[0].filterValue = this.$mapCoverageService.showCoverage === 'facility' ? this.facilityStoreData : this.equipmentStoreData;
    this.$mapStoreService.alarmDataConfig = alarmData;
    this.cacheData(data.polymerizationData);
    this.hideProgressBar();
  }

  /**
   * ????????????
   * param data
   */
  public cacheData(data): void {
    // ???????????????
    data.forEach(item => {
      if (item.positionCenter) {
        const position = item.positionCenter.split(',');
        item.lng = parseFloat(position[0]);
        item.lat = parseFloat(position[1]);
        delete item.positionCenter;
        if (this.$mapStoreService) {
          this.$mapStoreService.updateMarker(item, true);
        }
      }
    });
    // ??????????????????
    this.data = data;
    this.initMapDevice = true;
  }

  /**
   * ??????????????????
   */
  public queryHomeData(): void {
    this.showProgressBar();
    // ???????????????
    if (this.$mapStoreService) {
      this.queryHomeDeviceArea().then(result => {
        this.listAreaByAreaCodeList(result).then(_result => {
          // ??????????????????
          this.queryAlarmListHome(result);
        });
      });
    } else {
      this.hideProgressBar();
    }
  }

  /**
   * ??????????????????????????????????????????
   */
  public listAreaByAreaCodeList(data) {
    return new Promise((resolve, reject) => {
      const areaList = data.polymerizationData.map(item => {
        return item.code;
      });
      this.$indexApiService.listAreaByAreaCodeList(areaList).subscribe((result: ResultModel<any>) => {
        if (result.code === ResultCodeEnum.success) {
          resolve(result.data.map((item) => {
            return item.areaCode;
          }));
        }
      });
    });
  }

// ????????????
  public reloadGroup(event: string): void {
    this.$selectGroupService.eventEmit.emit({isShow: false});
    this.queryCondition.filterConditions = [];
    this.queryCondition.bizCondition = null;
    this.mainMap.resetAllTargetMarker();
    this.groupChangeDataSet = [];
    this.isShowButton = false;
    this.refreshData();
  }

  /**
   * ????????????id?????????????????????
   * @param ids ??????id??????
   */
  public getDeviceMapByGroupIds(ids: string[]) {
    const deviceMapQueryCondition = new QueryConditionModel();
    const deviceType = this.$mapStoreService.showFacilityTypeSelectedResults;
    deviceMapQueryCondition.filterConditions.push(new FilterCondition('groupId', OperatorEnum.in, ids));
    // ???????????????????????????????????????
    deviceMapQueryCondition.filterConditions.push(new FilterCondition('deviceTypeList', OperatorEnum.in, deviceType));
    this.$groupApiService.getDeviceMapByGroupIds(deviceMapQueryCondition).subscribe((result: ResultModel<any>) => {
      if (result.data.polymerizationData.length > 0) {
        if (this.mainMap) {
          this.mainMap.targetMarkerArr = [];
        }
        this.storeMapData = result.data;
        this.mainMap.selectedFacility(result.data);
      }
    });
  }

  public getEquipmentMapByGroupIds(ids: string[]) {
    const deviceMapQueryCondition = new QueryConditionModel();
    const equipmentType = this.$mapStoreService.showEquipmentTypeSelectedResults;
    deviceMapQueryCondition.filterConditions.push(new FilterCondition('groupId', OperatorEnum.in, ids));
    // ???????????????????????????????????????
    deviceMapQueryCondition.filterConditions.push(new FilterCondition('equipmentType', OperatorEnum.in, equipmentType));
    this.$facilityForCommonService.getEquipmentMapByGroupIds(deviceMapQueryCondition).subscribe((result: ResultModel<any>) => {
      if (result.data.polymerizationData.length > 0) {
        if (this.mainMap) {
          this.mainMap.targetMarkerArr = [];
          this.storeMapData = result.data;
          this.mainMap.selectedFacility(result.data);
        }
      }
    });
  }
}

import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FilinkMapEnum} from '../../../../shared-module/enum/filinkMap.enum';
import {StrategyListModel} from '../../share/model/policy.control.model';
import {FilterValueConst} from '../../share/const/filter.const';
import {ApplicationService} from '../../share/service/application.service';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {ApplicationInterface} from '../../../../../assets/i18n/appliction/application.interface';
import {NzI18nService} from 'ng-zorro-antd';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {BMapBaseService} from '../../../../shared-module/service/map-service/b-map/b-map-base.service';
import {GMapBaseService} from '../../../../shared-module/service/map-service/g-map/g-map-base.service';
import {ObjectTypeEnum} from '../../../../core-module/enum/facility/object-type.enum';
import {ApplicationScopeTypeEnum} from '../../share/enum/policy.enum';
import {EquipmentListModel} from '../../../../core-module/model/equipment/equipment-list.model';
import {TableConfigModel} from '../../../../shared-module/model/table-config.model';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {ICON_SIZE} from '../../../../shared-module/service/map-service/map.config';
import {FilterCondition} from '../../../../shared-module/model/query-condition.model';
import {OperatorEnum} from '../../../../shared-module/enum/operator.enum';
import * as _ from 'lodash';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {Observable} from 'rxjs';
declare const BMapLib: any;

@Component({
  selector: 'app-details-map',
  templateUrl: './details-map.component.html',
  styleUrls: ['./details-map.component.scss']
})
export class DetailsMapComponent implements OnInit, AfterViewInit {
  /** ????????????????????????????????????*/
  @Input() isGroupDetail: boolean = false;

  /** ???????????????????????????*/
  @Input() set sourceDataList(valueList: StrategyListModel) {
    if (valueList && valueList.strategyRefList && valueList.strategyRefList.length) {
      this.queryPositionPointInfoForMap(valueList);
    }
  }

  /** ?????????????????????????????????*/
  @Input() public heightStyle = {height: '156px'};
  /** ????????????*/
  @Input() mapType: FilinkMapEnum = FilinkMapEnum.baiDu;
  /** ????????????*/
  public mapService: BMapBaseService | GMapBaseService;
  /** ?????????????????????*/
  public languageApplication: ApplicationInterface;
  /** ?????????????????????*/
  public languageFacility: FacilityLanguageInterface;
  /** ????????????????????????*/
  public isShowTableWindow: boolean = false;
  /** ?????????????????????*/
  public equipmentData = [];
  /** ????????????????????? ?????? ?????????????????????*/
  public equipmentDataCopy = [];
  /** ????????????????????????*/
  public equipmentTableConfig: TableConfigModel;
  /** ?????????????????????????????????*/
  public selectOption = [];
  /** ????????????????????????*/
  public equipmentListMap: Map<string, EquipmentListModel[]> = new Map();
  /** ????????????????????????????????????*/
  public currentSelectEquipmentPoint;

  constructor(
    private $nzI18n: NzI18nService,
    private $applicationService: ApplicationService,
    private $router: Router
  ) {
    this.languageApplication = this.$nzI18n.getLocaleData(LanguageEnum.application);
    this.languageFacility = this.$nzI18n.getLocaleData(LanguageEnum.facility);
  }

  ngOnInit(): void {
    this.initEquipmentTableConfig();
  }

  ngAfterViewInit() {
    // ????????????????????????
    this.mapService = this.mapType === FilinkMapEnum.baiDu ? new BMapBaseService() : new GMapBaseService();
    this.mapService.createBaseMap('equipment-for-map');
    this.mapService.enableScroll();
    this.mapService.setZoom(12);
    this.mapService.mapInstance.addEventListener('click', (e) => {
      // ??????????????????????????????????????????
      if (!e.overlay) {
        this.isShowTableWindow = false;
        this.resetTargetMarker();
      }
    });
  }

  /**
   * ?????????????????????????????????????????????
   * param data
   */
  queryPositionPointInfoForMap(data: StrategyListModel) {
    const equipmentIdList = data.strategyRefList.filter(item => item.refType === ApplicationScopeTypeEnum.equipment).map(item => item.refId);
    const groupIds = data.strategyRefList.filter(item => item.refType === ApplicationScopeTypeEnum.group).map(item => item.refId);
    const loopIds = data.strategyRefList.filter(item => item.refType === ApplicationScopeTypeEnum.loop).map(item => item.refId);
    let equipmentTypes = [];
    if (data.strategyType === this.languageApplication.policyControl.information) {
      equipmentTypes = FilterValueConst.informationFilter;
    } else if (data.strategyType === this.languageApplication.policyControl.lighting) {
      // ????????????
      equipmentTypes = FilterValueConst.lightingFilter;
    } else if (data.strategyType === this.languageApplication.policyControl.linkage) {
      // ????????????
      equipmentTypes = FilterValueConst.allFilter;
    }
    if (!this.isGroupDetail) {
      let response: Observable<ResultModel<EquipmentListModel[]>>;
      if (data.strategyId) {
        response = this.$applicationService.equipmentMapListByStrategy(data.strategyId);
      } else {
        response = this.$applicationService.queryListEquipmentInfoForMap({equipmentIdList, groupIds, loopIds, equipmentTypes});
      }
      response.subscribe(res => {
        if (res.code === ResultCodeEnum.success) {
          const devicePoints = res.data || [];
          if (this.mapService && devicePoints.length) {
            // ?????????????????????
           const markers =  devicePoints.map(item => this.addPositionPoints(item));
           this.createMarkerClusterer(markers);
          }
        }
      });
    } else {
      this.$applicationService.queryListSamePositionEquipmentInfoForMap({
        equipmentIdList,
        groupIds,
        loopIds,
        equipmentTypes
      }).subscribe(res => {
        if (res.code === ResultCodeEnum.success) {
          const devicePoints = res.data || [];
          if (this.mapService && devicePoints.length) {
            // ?????????????????????
            const markers = [];
            devicePoints.forEach(points => {
              if (points.length) {
                if (points.length > 1) {
                  // ????????????????????????????????????????????????????????????????????????????????????????????????
                  this.equipmentListMap.set(points[0].equipmentId, points);
                  markers.push(this.addPositionPoints(points[0], points.length));
                } else {
                  markers.push(this.addPositionPoints(points[0]));
                  this.mapService.setCenterAndZoom(points[0].point.lng, points[0].point.lat, 12);
                }
              }
            });
            this.createMarkerClusterer(markers);
          }
        }
      });
    }
  }

  /**
   * ?????????????????????????????????
   * ?????????????????????1400???????????????????????????????????????
   * param markers
   */
  private createMarkerClusterer(markers) {
    // tslint:disable-next-line:no-unused-expression
    const markerClusterer = new BMapLib.MarkerClusterer(this.mapService.mapInstance, {
      markers: markers,
      hiddenZoom: null,
      isOriginalLaunch: true,
      isAverageCenter: true
    });
    markerClusterer.setMinClusterSize(2);
    // ?????????????????????
    this.mapService.setCenterAndZoom(markers[0].point.lng, markers[0].point.lat, 12);
  }

  /**
   * ??????????????????????????????
   */
  private addPositionPoints(baseInfo: EquipmentListModel, showNum = 0) {
    if (baseInfo.positionBase) {
      const position = baseInfo.positionBase.split(',');
      baseInfo.point = {lng: parseFloat(position[0]), lat: parseFloat(position[1])};
      let fn;
      if (showNum) {
        fn = (event) => {
          this.pointsClickChange(event, baseInfo);
        };
      } else {
        fn = () => {
          this.jumpToIndex(baseInfo);
        };
      }
      const marker = this.mapService.createMarker(baseInfo, ObjectTypeEnum.equipment, [{
        eventName: 'click',
        eventHandler: fn
      }]);
      if (showNum) {
        marker.setLabel(this.mapService.setLabelPointNumber(showNum));
      }
      return marker;
    }
  }

  /**
   * ?????????????????????????????????????????????
   * param pointData
   */
  private jumpToIndex(pointData: EquipmentListModel) {
    const queryParams = {
      equipmentId: pointData.equipmentId,
      areaCode: pointData.areaCode,
      positionBase: pointData.positionBase,
    };
    this.$router.navigate(['/business/index'], {queryParams: queryParams}).then();
  }

  /**
   * ??????????????????????????????
   * param dataItem
   */
  private pointsClickChange(event, dataItem: EquipmentListModel) {
    this.resetTargetMarker();
    this.equipmentData = this.equipmentListMap.get(dataItem.equipmentId);
    this.equipmentDataCopy = _.cloneDeep(this.equipmentData);
    // ??????????????????id???????????????id???????????????
    this.selectOption = _.uniqBy(this.equipmentData.filter(item => item.areaName).map(item => {
      return {label: item.areaName, value: item.areaName};
    }), 'value');
    this.equipmentTableConfig.columnConfig[0].searchConfig.selectInfo = this.selectOption;
    this.isShowTableWindow = true;
    const imgUrl = CommonUtil.getEquipmentTypeIconUrl('24-32', dataItem.equipmentType);
    const icon = this.mapService.getIcon(imgUrl, this.mapService.createSize('24', '32'));
    event.target.setIcon(icon);
    event.target.setTop(true);
    this.currentSelectEquipmentPoint = {marker: event.target, dataItem};
  }


  /**
   * ????????????????????????????????????
   */
  private resetTargetMarker() {
    if (this.currentSelectEquipmentPoint) {
      const imgUrl = CommonUtil.getEquipmentTypeIconUrl(ICON_SIZE, this.currentSelectEquipmentPoint.dataItem.equipmentType, this.currentSelectEquipmentPoint.dataItem.deviceStatus);
      const icon = this.mapService.getIcon(imgUrl, this.mapService.createSize(ICON_SIZE.split('-')[0], ICON_SIZE.split('-')[1]));
      this.currentSelectEquipmentPoint.marker.setIcon(icon);
      this.currentSelectEquipmentPoint.marker.setTop(false);
      this.currentSelectEquipmentPoint = null;
    }
  }

  /**
   * ??????????????????????????????
   */
  private initEquipmentTableConfig(): void {
    this.equipmentTableConfig = {
      isDraggable: true,
      isLoading: false,
      scroll: {x: '280px', y: '85px'},
      outHeight: 250,
      noAutoHeight: true,
      topButtons: [],
      noIndex: true,
      columnConfig: [
        {
          title: this.languageFacility.areaName, key: 'areaName', width: 100,
          searchable: true,
          searchKey: 'areaName',
          searchConfig: {type: 'select', selectType: 'multiple', selectInfo: this.selectOption}
        },
        {
          title: this.languageFacility.equipmentName, key: 'equipmentName', width: 100,
          searchable: true,
          searchConfig: {type: 'input'}
        },
        {
          title: '', searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 80, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        },
      ],
      showPagination: false,
      bordered: false,
      showSearch: true,
      operation: [
        {
          // ??????
          text: this.languageFacility.location,
          className: 'fiLink-location',
          handle: (dataItem) => {
            this.jumpToIndex(dataItem);
          }
        },
      ],
      handleSearch: (event: FilterCondition[]) => {
        let filterData = this.equipmentDataCopy;
        if (event && event.length) {
          //  ????????????
          filterData = this.equipmentData.filter(item => {
            let flag = true;
            event.forEach(filter => {
              if (filter.filterValue && filter.filterType === OperatorEnum.eq && filter.filterValue !== item[filter.filterField]) {
                flag = false;
              } else if (filter.filterValue && filter.operator === OperatorEnum.like && !item[filter.filterField].includes(filter.filterValue)) {
                flag = false;
              } else if (filter.filterValue && filter.operator === OperatorEnum.in && (filter.filterValue.indexOf(item[filter.filterField]) < 0)) {
                flag = false;
              }
            });
            return flag;
          });
        }
        this.equipmentData = filterData;
      }
    };
  }
}

import {AfterViewInit, Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Router} from '@angular/router';
import {FacilityService} from '../../../../core-module/api-service/facility/facility-manage/index';
import {SmartService} from '../../../../core-module/api-service/facility/smart/smart.service';
import {ResultModel} from '../../../../shared-module/model/result.model';
import {DateHelperService, NzI18nService, NzModalService} from 'ng-zorro-antd';
import {LockService} from '../../../../core-module/api-service/lock/index';
import {FiLinkModalService} from '../../../../shared-module/service/filink-modal/filink-modal.service';
import {MapService} from '../../../../core-module/api-service/index/map/index';
import {FacilityName} from '../../util/facility-name';
import {FacilityLanguageInterface} from '../../../../../assets/i18n/facility/facility.language.interface';
import {DateFormatStringEnum} from '../../../../shared-module/enum/date-format-string.enum';
import {DeviceTypeEnum} from '../../../../core-module/enum/facility/facility.enum';
import {LockTypeEnum} from '../../../../core-module/enum/facility/Intelligent-lock/lock-type.enum';
import {ResultCodeEnum} from '../../../../shared-module/enum/result-code.enum';
import {LockModel} from '../../../../core-module/model/facility/lock.model';
import {ControlModel} from '../../../../core-module/model/facility/control.model';
import {MapTypeEnum} from '../../../../core-module/enum/index/index.enum';
import {Observable} from 'rxjs';
import {CommonInstructModel} from '../../../../core-module/model/application-system/common-instruct.model';
import {ControlInstructEnum} from '../../../../core-module/enum/instruct/control-instruct.enum';
import {LanguageEnum} from '../../../../shared-module/enum/language.enum';
import {CommonUtil} from '../../../../shared-module/util/common-util';
import {ModuleTypeEnum} from '../../../../core-module/enum/facility/Intelligent-lock/module-type.enum';
import {ModuleTypeNameEnum} from '../../../../core-module/enum/facility/Intelligent-lock/module-type-name.enum';
import {DoorInfoModel} from '../../shared/model/door-info.model';
import {HostTypeEnum} from '../../../../core-module/enum/facility/Intelligent-lock/host-type.enum';

/**
 * ??????????????????
 */
@Component({
  selector: 'lock-detail-panel',
  templateUrl: './lock-detail-panel.component.html',
  styleUrls: ['./lock-detail-panel.component.scss']
})
export class LockDetailPanelComponent extends FacilityName implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  // ??????id
  @Input() facilityId: string;
  // ????????????
  @Input() indexType: string;
  // ?????????
  public lockType = LockTypeEnum;
  // ????????????
  public dvType = DeviceTypeEnum;
  // ??????????????????
  public monitorInfoList = [];
  // ??????????????????
  public doorAndLockList = [];
  // ?????????
  public serialNum: string;
  // ????????????
  public heartbeatTime: string;
  // ?????????????????????   ?????????????????????????????????
  public isShowSelect = false;
  // ????????????
  public controlInfoObj: DoorInfoModel[] = [];
  // ????????????
  public controlOption: { value: string, label: string }[] = [];
  // ???????????????id
  public selectedControlId: string;
  // ????????????
  public hostType = '1';
  // ????????????
  public sourceType: string;
  // ????????????
  public isEquipment: boolean = false;
  // ?????????
  public language: FacilityLanguageInterface;
  // ??????
  public timer: any;
  // ????????????
  public hostTypeEnum = HostTypeEnum;

  constructor(public $nzI18n: NzI18nService,
              private $facilityService: FacilityService,
              private $lockService: LockService,
              private $router: Router,
              private $mapService: MapService,
              private $smartService: SmartService,
              private $modal: NzModalService,
              private $message: FiLinkModalService,
              private $dateHelper: DateHelperService,
  ) {
    super($nzI18n);
  }

  ngOnInit() {
    this.language = this.$nzI18n.getLocaleData(LanguageEnum.facility);
    // ?????????????????????????????????
    this.isEquipment = this.indexType === MapTypeEnum.equipment;
    // ???????????????
    this.getAllData(this);
  }

  ngAfterViewInit() {
    const that = this;
    this.timer = setInterval(function () {
      that.getAllData(that);
    }, 300000);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes && changes.facilityId && changes.facilityId.previousValue) {
      // ?????????id???????????????????????????????????????
      if (this.timer) {
        clearInterval(this.timer);
      }
      // ????????????id??????
      if (!this.facilityId) {
        return;
      }
      this.getAllData(this);
    }
  }

  ngOnDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }

  /**
   * ??????????????????
   * param id
   */
  getLockControlInfo(id: string) {
    let response: Observable<ResultModel<ControlModel[]>>;
    if (this.isEquipment) {
      response = this.$lockService.getLockControlInfoForEquipment(id);
    } else {
      response = this.$lockService.getLockControlInfo(id);
    }
    response.subscribe((result: ResultModel<Array<ControlModel>>) => {
      if (result.code === ResultCodeEnum.success) {
        if (result.data) {
          if (result.data.length === 0) {
            return;
          } else {
            this.hostType = result.data[0].equipmentModelType;
            this.sourceType = result.data[0].sourceType;
            this.controlOption = [];
            result.data.forEach(item => {
              const arr = [];
              let data;
              if (item.actualValue) {
                data = JSON.parse(item.actualValue);
              } else {
                data = {};
              }
              Object.keys(data).forEach(key => {
                const info = this.setMonitorInfo(key, data[key]);
                if (info) {
                  arr.push(info);
                }
              });
              this.controlInfoObj[item.equipmentId] = arr;
              this.controlOption.push({
                value: item.equipmentId,
                label: item.equipmentName
              });
            });
            if (this.controlOption[0]) {
              this.selectedControlId = this.controlOption[0]['value'];
            }
            this.monitorInfoList = this.controlInfoObj[this.selectedControlId];
            this.isShowSelect = true;
          }
        } else {
          this.isShowSelect = false;
        }
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * ??????????????????
   */
  changeControl() {
    this.monitorInfoList = this.controlInfoObj[this.selectedControlId];
  }

  /**
   * ???????????????
   * param id
   */
  getLockInfo(id: string) {
    let response: Observable<ResultModel<LockModel[]>>;
    if (this.isEquipment) {
      response = this.$lockService.getLockInfoForEquipment(id);
    } else {
      response = this.$lockService.getLockInfo(id);
    }
    response.subscribe((result: ResultModel<Array<LockModel>>) => {
      if (result.code === ResultCodeEnum.success) {
        const that = this;
        this.doorAndLockList = result.data.map(item => {
          item.lockStatusClassName = item.lockStatus === that.lockType.unusual ? 'icon-lock-opening' :
            item.lockStatus === that.lockType.normal ? 'icon-lock-normal' : 'icon-lock-invalid';
          item.doorStatusClassName = item.doorStatus === that.lockType.unusual ? 'icon-door-opening' : 'icon-door-normal';
          return item;
        });
      } else {
        this.$message.error(result.msg);
      }
    }, err => {
    });
  }

  /**
   * ??????????????????????????????
   * param key
   * param info
   * returns {{key: any; text: string; value: string; iconClass: string}}
   */
  setMonitorInfo(key, info) {

    const value = info.data || '';
    const className = info.alarmFlag === '2' ? 'icon-tilt' : 'icon-fiLink';
    if (key === 'moduleType') {  // ????????????
      const downloadLanguage = this.$nzI18n.getLocaleData(LanguageEnum.download);
      const moduleValue = CommonUtil.enumMappingTransform(value, ModuleTypeEnum, ModuleTypeNameEnum) + downloadLanguage.module;
      return {
        key: key,
        text: this.indexLanguage.communicationModel,
        value: moduleValue,
        iconClass: 'iconfont icon-communication-model fiLink-communication-model'
      };
    } else if (key === 'lean') {  //  ??????
      return {
        key: key,
        text: this.indexLanguage.tilt,
        value: value + '??',
        iconClass: `iconfont fiLink-tilt ${className}`
      };
    } else if (key === 'temperature') {  // ??????
      return {
        key: key,
        text: this.indexLanguage.temperature,
        value: value + '???',
        iconClass: `iconfont fiLink-temperature ${className}`
      };
    } else if (key === 'humidity') {  // ??????
      return {
        key: key,
        text: this.indexLanguage.humidity,
        value: value + '%',
        iconClass: `iconfont fiLink-humidity ${className}`
      };
    } else if (key === 'electricity') {  // ??????
      // ????????????????????????????????????100%
      const elect = this.sourceType === '0' ? 100 : value;
      return {
        key: key,
        text: this.indexLanguage.electricQuantity,
        value: elect + '%',
        iconClass: this.getElectricQuantityIconClass(elect)
      };
    } else if (key === 'leach') {  // ??????  (??????)
      return {
        key: key,
        text: this.indexLanguage.waterImmersion,
        value: '',  // value,
        iconClass: `iconfont fiLink-water-immersion ${className}`
      };
    } else if (key === 'wirelessModuleSignal') {  // ????????????
      return {
        key: key,
        text: this.indexLanguage.signalIntensity,
        value: value + 'dB',
        iconClass: this.getSignalIntensityIconClass(value)
      };
    } else if (key === 'solarPanel') {  // ????????????
      return {
        key: key,
        text: this.indexLanguage.solarPanel,
        value: value,
        iconClass: 'icon-discharge'
      };
    } else {

    }
  }

  /**
   * ???????????????????????????????????????
   * param value
   * returns {string}
   */
  getSignalIntensityIconClass(value) {
    const _value = parseInt(value, 10);
    if (_value === 0) {
      return 'icon-signal-intensity-0';
    } else if (_value > 0 && _value <= 20) {
      return 'icon-signal-intensity-20';
    } else if (_value > 20 && _value <= 40) {
      return 'icon-signal-intensity-40';
    } else if (_value > 40 && _value <= 60) {
      return 'icon-signal-intensity-60';
    } else if (_value > 60 && _value <= 80) {
      return 'icon-signal-intensity-80';
    } else if (_value > 80 && _value <= 100) {
      return 'icon-signal-intensity-100';
    } else {
      return 'icon-signal-intensity';
    }
  }

  /**
   * ?????????????????????????????????
   * param value
   * returns {string}
   */
  getElectricQuantityIconClass(value) {
    const _value = parseInt(value, 10);
    if (_value === 0) {
      return 'icon-electric-quantity-0';
    } else if (_value > 0 && _value <= 20) {
      return 'icon-electric-quantity-20';
    } else if (_value > 20 && _value <= 40) {
      return 'icon-electric-quantity-40';
    } else if (_value > 40 && _value <= 60) {
      return 'icon-electric-quantity-60';
    } else if (_value > 60 && _value <= 80) {
      return 'icon-electric-quantity-80';
    } else if (_value > 80 && _value <= 100) {
      return 'icon-electric-quantity-100';
    } else {
      return 'icon-electric-quantity';
    }
  }

  /**
   * ?????????
   * param item
   */
  clickLock(item) {
    // 0 ??????  1??????  2??????
    if (item.lockStatus === this.lockType.normal) {
      const type = this.dvType;
      // ?????????????????????????????????????????????
      this.openPrompt(item);
    }
  }

  /**
   * ?????????????????????
   * param item
   */
  openPrompt(item) {
    this.$modal.create({
      nzTitle: this.indexLanguage.openLockTitle,
      nzContent: this.indexLanguage.openLockContent,
      nzOnOk: () => {
        this.openLock(item);
      }
    });
  }

  /**
   * ??????
   * param item
   */
  openLock(item) {
    let response: Observable<ResultModel<string>>;
    // ????????????
    if (this.isEquipment) {
      const body = new CommonInstructModel();
      body.commandId = ControlInstructEnum.unLock;
      body.equipmentIds = [this.facilityId];
      body.param = {
        params: [{slotNum: item.doorNum}],
      };
      response = this.$lockService.instructDistribute(body);
    } else {
      // ????????????
      const body = {deviceId: this.facilityId, doorNumList: [item.doorNum]};
      response = this.$lockService.openLock(body);
    }
    response.subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.language.commandIssuedSuccessfully);
      } else {
        this.$message.error(result.msg);
      }
    });
  }

  /**
   * ??????????????????
   */
  getHeartbeatTime() {
    let response;
    if (this.isEquipment) {
      response = this.$facilityService.queryEquipmentHeartbeatTime(this.facilityId);
    } else {
      response = this.$facilityService.queryHeartbeatTime(this.facilityId);
    }
    response.subscribe((result: ResultModel<any>) => {
      if (result.code === ResultCodeEnum.success) {
        if (result.data && result.data.recentLogTime) {
          this.heartbeatTime = this.$dateHelper.format(new Date(result.data.recentLogTime), DateFormatStringEnum.DATE_FORMAT_STRING);
        } else {
          this.heartbeatTime = 'NA';
        }
      }
    });
  }


  /**
   *
   * ??????????????????
   */
  private getAllData(that) {
    // ????????????id??????
    if (!that.facilityId) {
      // ?????????id???????????????????????????????????????
      if (that.timer) {
        clearInterval(that.timer);
      }
      return;
    }
    // ?????????????????????????????????????????????????????????
    that.getLockInfo(this.facilityId);
    that.getLockControlInfo(this.facilityId);
    that.getHeartbeatTime();
  }
}

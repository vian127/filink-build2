import {Component, OnDestroy, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AlarmLanguageInterface} from '../../../../../../../assets/i18n/alarm/alarm-language.interface';
import {LanguageEnum} from '../../../../../../shared-module/enum/language.enum';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {FilterCondition, QueryConditionModel, SortCondition} from '../../../../../../shared-module/model/query-condition.model';
import {PageModel} from '../../../../../../shared-module/model/page.model';
import {TableConfigModel} from '../../../../../../shared-module/model/table-config.model';
import {WorkOrderAlarmLevelColor} from '../../../../../../core-module/enum/trouble/trouble-common.enum';
import {AlarmStoreService} from '../../../../../../core-module/store/alarm.store.service';
import {CommonUtil} from '../../../../../../shared-module/util/common-util';
import {FacilityForCommonUtil} from '../../../../../../core-module/business-util/facility/facility-for-common.util';
import {DynamicViewResultModel} from '../../../../share/model/dynamic-view-result.model';
import {TableComponent} from '../../../../../../shared-module/component/table/table.component';
import {FiLinkModalService} from '../../../../../../shared-module/service/filink-modal/filink-modal.service';
import {AlarmService} from '../../../../share/service/alarm.service';
import {ResultCodeEnum} from '../../../../../../shared-module/enum/result-code.enum';
import {ResultModel} from '../../../../../../shared-module/model/result.model';
import {AlarmLevelEnum} from '../../../../../../core-module/enum/alarm/alarm-level.enum';
import {CorrelationAlarmActionEnum, IsSavedEnum, rootAlarmActionEnum, RuleConditionEnum} from '../../../../share/enum/alarm.enum';
import {AlarmResultDetailListModel} from '../../../../share/model/alarm-result-detail-list.model';
import {CorrelationAnalysisModel} from '../../../../share/model/correlation-analysis.model';
import {RuleConditionModel} from '../../../../share/model/rule-condition.model';
import {OperatorEnum} from '../../../../../../shared-module/enum/operator.enum';
import {AlarmSelectorConfigModel, AlarmSelectorInitialValueModel} from '../../../../../../shared-module/model/alarm-selector-config.model';
import {AlarmSelectorConfigTypeEnum} from '../../../../../../shared-module/enum/alarm-selector-config-type.enum';
import {ActivatedRoute} from '@angular/router';
import {AlarmUtil} from '../../../../share/util/alarm.util';
import {numberType} from '../../../../../facility/share/const/core-end.config';

/**
 * ?????????????????????-??????????????????
 */
@Component({
  selector: 'app-dynamic-rule-view-result',
  templateUrl: './dynamic-rule-view-result.component.html',
  styleUrls: ['./dynamic-rule-view-result.component.scss']
})
export class DynamicRuleViewResultComponent implements OnInit, OnDestroy {

  // ??????/??????
  @ViewChild('alarmStatus') alarmStatus: TemplateRef<any>;
  // ????????????
  @ViewChild('alarmLevelTemp') alarmLevelTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('deviceTemp') deviceTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('equipmentTemp') equipmentTemp: TemplateRef<any>;
  // ????????????
  @ViewChild('tableTemp') tableTemp: TableComponent;
  // ????????????
  @ViewChild('rulesTable') rulesTable: TableComponent;
  // ???????????????
  @ViewChild('rootAlarmTemp') rootAlarmTemp: TemplateRef<any>;
  // ??????????????????
  @ViewChild('relativityAlarmTemp') relativityAlarmTemp: TemplateRef<any>;
  // ???????????????
  public alarmLanguage: AlarmLanguageInterface;
  // ????????????
  public resultDataSet: DynamicViewResultModel[] = [];
  // ????????????
  public pageBean: PageModel = new PageModel();
  // ????????????
  public tableConfig: TableConfigModel;
  // ???????????????
  public isViewSave: boolean = false;
  // ???????????????
  public isLoading: boolean = false;
  // ???????????????
  public selectListData: AlarmResultDetailListModel[] = [];
  // ????????????
  public showResult: boolean = false;
  // ??????????????????
  public detailDataSet: AlarmResultDetailListModel[] = [];
  // ????????????
  public detailTableConfig: TableConfigModel;
  // ??????????????????
  public detailPageBean: PageModel = new PageModel();
  // ????????????
  public viewData: DynamicViewResultModel;
  // ??????????????????
  public detailRelativityAlarmName: string;
  // ?????????????????????
  public rootAlarmNameSelectConfig: AlarmSelectorConfigModel;
  // ?????????????????????
  public relativityAlarmNameSelectConfig: AlarmSelectorConfigModel;
  // ??????????????????
  private detailQueryCondition: QueryConditionModel = new QueryConditionModel();
  // ????????????
  private queryCondition: QueryConditionModel = new QueryConditionModel();
  // ??????????????????list
  private detailRelativityAlarmNameList: string[] = [];
  // ?????????????????????
  private selectRootAlarmObj: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // ?????????????????????
  private selectRelativityRootAlarmObj: AlarmSelectorInitialValueModel = new AlarmSelectorInitialValueModel();
  // ??????id
  private dynamicRuleTaskId: string;

  constructor(
    public $nzI18n: NzI18nService,
    private $modal: NzModalService,
    private $message: FiLinkModalService,
    private $alarmStoreService: AlarmStoreService,
    private $alarmService: AlarmService,
    private $active: ActivatedRoute,
  ) { }

  public ngOnInit(): void {
    this.alarmLanguage = this.$nzI18n.getLocaleData(LanguageEnum.alarm);
    // ?????????????????????
    this.initTableConfig();
    this.initDetailTableConfig();
    // ???????????????????????????
    this.initRootAlarmWarningName();
    this.initRelativityAlarmWarningName();
    // ?????????id
    this.$active.queryParams.subscribe(param => {
      this.dynamicRuleTaskId = param.taskId;
      // ??????????????????????????????
      this.refreshData();
    });
  }

  public ngOnDestroy(): void {
    this.tableTemp = null;
    this.rulesTable = null;
    localStorage.setItem('alarmSetTabsIndex', '1');
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
  public detailPageChange(event: PageModel): void {
    this.queryCondition.pageCondition.pageNum = event.pageIndex;
    this.queryCondition.pageCondition.pageSize = event.pageSize;
    this.refreshDetailData();
  }
  /**
   * ??????????????????
   */
  public handleCancel(): void {
    this.detailDataSet = [];
    this.detailPageBean = new PageModel();
    this.detailTableConfig.showSearch = false;
    this.tableTemp.handleRest();
    this.showResult = false;
    this.isViewSave = false;
  }

  /**
   * ??????????????????
   */
  public saveRules(): void {
    this.isLoading = true;
    const data = new CorrelationAnalysisModel();
    data.analyzePeriod = Number(this.viewData.analysisCycle);
    data.relevanceAlarmAction = CorrelationAlarmActionEnum.restrain;
    data.remark = '';
    data.rootAlarmAction = rootAlarmActionEnum.nothing;
    data.rootAlarmNameId = this.detailDataSet[0].alarmNameId;
    data.dynamicCorrelationRulesId = this.viewData.id;
    const rules = new RuleConditionModel();
    rules.id = CommonUtil.getUUid();
    rules.ruleCondition = this.viewData.ruleCondition;
    rules.rootCauseAlarmAttribute = '1';
    rules.relevanceAlarmProperties = '1';
    switch (rules.ruleCondition) {
      case RuleConditionEnum.rootAlarmObj_2:
        rules.operator = RuleConditionEnum.rootAlarmObj_3;
        break;
      case RuleConditionEnum.rootAlarmObj_3:
        rules.operator = RuleConditionEnum.rootAlarmObj_4;
        break;
      default:
          rules.operator = RuleConditionEnum.rootAlarmObj_1;
    }
    data.staticRelevanceRuleConditionBeanList = [rules];
    data.relevanceAlarmNameIdList = [];
    data.staticRelevanceRuleName = `RULE${(new Date()).getTime()}`;
    this.selectListData.forEach(item => {
      if (item.alarmLevel === '2' && item.father['checked']) {
        data.relevanceAlarmNameIdList.push(item.alarmNameId);
      }
    });
    this.$alarmService.addStaticRule(data).subscribe((result: ResultModel<string>) => {
      this.isLoading = false;
      if (result.code === ResultCodeEnum.success) {
        this.$message.success(this.alarmLanguage.saveSuccess);
        this.handleCancel();
      } else {
        this.$message.error(result.msg);
      }
    }, () => {
      this.isLoading = false;
    });
  }

  /**
   * ??????????????????
   */
  private refreshData(): void {
    this.tableConfig.isLoading = true;
    this.queryCondition.filterConditions.forEach(item => {
      if (item.filterField === 'analysisCycle') {
        item.operator = OperatorEnum.lte;
      }
    });
    const arr = this.queryCondition.filterConditions.find(v =>  v.filterField === 'dynamicRuleTaskId');
    if (!arr) {
      this.queryCondition.filterConditions.push({
        filterValue: this.dynamicRuleTaskId,
        filterField: 'dynamicRuleTaskId',
        operator: OperatorEnum.eq
      });
    }
    this.$alarmService.viewResultList(this.queryCondition).subscribe((result: ResultModel<DynamicViewResultModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        const list = result.data || [];
        list.forEach(item => {
          if (item.storedStatic) {
            if (item.storedStatic === IsSavedEnum.right) {
              item.storedStaticName = this.alarmLanguage.yes;
            } else {
              item.storedStaticName = this.alarmLanguage.no;
            }
          } else {
            item.storedStaticName = '';
          }
          // ????????????
          item.ruleConditionName = '';
          if (item.ruleCondition) {
            item.ruleConditionName = AlarmUtil.translateCondition(this.$nzI18n, item.ruleCondition);
          }
        });
        this.resultDataSet = list;
        this.pageBean.Total = result.totalCount;
        this.pageBean.pageSize = result.size;
        this.pageBean.pageIndex = result.pageNum;
      } else {
        this.$message.error(result.msg);
      }
      this.tableConfig.isLoading = false;
    }, error => {
      this.tableConfig.isLoading = false;
    });
  }

  /**
   * ????????????????????????
   */
  private turnAlarmLevel(code: string): string {
    let name = '';
    for (const k in WorkOrderAlarmLevelColor) {
      if (WorkOrderAlarmLevelColor[k] === code) {
        name = this.alarmLanguage[k];
        break;
      }
    }
    return name;
  }

  /**
   * ?????????????????????????????????
   */
  private initTableConfig(): void {
    this.tableConfig = {
      isDraggable: true,
      isLoading: false,
      primaryKey: '02-3-7-1-6',
      showSearchSwitch: true,
      showSizeChanger: true,
      noIndex: true,
      notShowPrint: true,
      scroll: {x: '1000px', y: '500px'},
      columnConfig: [
        {type: 'select', fixedStyle: {fixedLeft: true, style: {left: '0px'}}, width: 62},
        {
          type: 'serial-number', width: 62, title: this.alarmLanguage.serialNumber,
          fixedStyle: {fixedLeft: true, style: {left: '62px'}}
        },
        {
          // ???????????????
          title: this.alarmLanguage.alarmReason, key: 'rootAlarmName',
          width: 130, searchable: true, isShowSort: true,
          searchKey: 'rootAlarmNameId',
          searchConfig: {
            type: 'render', selectType: 'multiple',
            renderTemplate: this.rootAlarmTemp,
          },
        },
        {
          // ????????????
          title: this.alarmLanguage.alarmCorrelation, key: 'relativityAlarmName',
          width: 150, isShowSort: true, searchable: true,
          searchKey: 'relativityAlarmNameId',
          searchConfig: {
            type: 'render', selectType: 'multiple',
            renderTemplate: this.relativityAlarmTemp,
          },
        },
        {
          // ????????????
          title: this.alarmLanguage.analysePeriod, key: 'analysisCycle',
          width: 100,
          searchable: true, isShowSort: true,
          searchConfig: {type: 'input'},
        },
        {
          // ?????????
          title: this.alarmLanguage.saved, key: 'storedStaticName', width: 120,
          searchable: true, isShowSort: true, searchKey: 'storedStatic',
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: [
              {label: this.alarmLanguage.yes, value: IsSavedEnum.right},
              {label: this.alarmLanguage.no, value: IsSavedEnum.deny}
            ]
          }
        },
        {
          // ????????????
          title: this.alarmLanguage.ruleCondition, key: 'ruleConditionName',
          width: 220, searchKey: 'ruleCondition',
          searchable: true, isShowSort: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: AlarmUtil.enumToArray(this.alarmLanguage, RuleConditionEnum)
          },
        },
        {
          // ??????
          title: this.alarmLanguage.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '',
          width: 60, fixedStyle: {fixedRight: true, style: {right: '0px'}}
        }
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      operation: [
        { // ??????
          text: this.alarmLanguage.particulars,
          permissionCode: '02-3-7-1-7',
          className: 'fiLink-view-detail',
          handle: (currentIndex: DynamicViewResultModel) => {
            // ????????????????????????????????????
            if (currentIndex.ruleCondition === RuleConditionEnum.rootAlarmObj_4) {
              this.$message.info(this.alarmLanguage.notShowDetail);
            } else {
              this.viewData = currentIndex;
              this.showResult = true;
              this.detailRelativityAlarmName = currentIndex.relativityAlarmName;
              this.refreshDetailData();
            }
          }
        }
      ],
      sort: (event: SortCondition) => {
        if (event.sortField === 'storedStaticName') {
          event.sortField = 'storedStatic';
        }
        this.queryCondition.sortCondition.sortField = event.sortField;
        this.queryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshData();
      },
      handleSearch: (event: FilterCondition[]) => {
        this.queryCondition.pageCondition.pageNum = 1;
        this.queryCondition.filterConditions = event;
        if (!event || event.length === 0) {
          this.selectRelativityRootAlarmObj = new AlarmSelectorInitialValueModel();
          this.selectRootAlarmObj = new AlarmSelectorInitialValueModel();
          this.initRootAlarmWarningName();
          this.initRelativityAlarmWarningName();
        }
        this.refreshData();
      }
    };
  }

  /**
   * ???????????????????????????
   */
  private initDetailTableConfig(): void {
    this.detailTableConfig = {
      isDraggable: true,
      isLoading: false,
      primaryKey: '02-3-3',
      showSearchSwitch: true,
      showSizeChanger: true,
      noIndex: true,
      notShowPrint: true,
      scroll: {x: '1000px', y: '500px'},
      columnConfig: [
        {
          type: 'expend', width: 30, expendDataKey: 'childList', levelKey: 'alarmLevel',
        },
        {type: 'select', width: 62},
        {
          width: 62, key: 'serialNumber', title: this.alarmLanguage.serialNumber,
        },
        {
          // ????????????
          title: this.alarmLanguage.alarmName, key: 'alarmName',
          width: 150,
          searchable: true, isShowSort: true,
          searchConfig: {type: 'input'},
        },
        {
          // ????????????
          title: this.alarmLanguage.alarmFixedLevel, key: 'alarmFixedLevel',
          width: 120, isShowSort: true,
          searchable: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo:  AlarmUtil.enumToArray(this.alarmLanguage, AlarmLevelEnum)
          },
          type: 'render',
          renderTemplate: this.alarmLevelTemp,
        },
        {
          // ????????????
          title: this.alarmLanguage.alarmobject, key: 'alarmObject',
          width: 130, isShowSort: true,
          searchable: true,
          searchConfig: {type: 'input'},
        },
        {
          // ????????????
          title: this.alarmLanguage.equipmentType, key: 'alarmSourceType',
          width: 130, searchable: true, isShowSort: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleEquipmentType(this.$nzI18n),
            label: 'label', value: 'code'
          },
          type: 'render',
          renderTemplate: this.equipmentTemp,
        },
        {
          // ????????????
          title: this.alarmLanguage.deviceName, key: 'alarmDeviceName', width: 130,
          searchable: true, isShowSort: true,
          searchConfig: {type: 'input'},
        },
        {
          // ????????????
          title: this.alarmLanguage.alarmSourceType, key: 'alarmDeviceType',
          width: 130, searchable: true, isShowSort: true,
          searchConfig: {
            type: 'select', selectType: 'multiple',
            selectInfo: FacilityForCommonUtil.getRoleFacility(this.$nzI18n),
            label: 'label', value: 'code'
          },
          type: 'render',
          renderTemplate: this.deviceTemp,
        },
        {
          // ??????
          title: this.alarmLanguage.operate, searchable: true,
          searchConfig: {type: 'operate'}, key: '', width: 80,
        }
      ],
      showPagination: true,
      bordered: false,
      showSearch: false,
      operation: [],
      sort: (event: SortCondition) => {
        this.detailQueryCondition.sortCondition.sortField = event.sortField;
        this.detailQueryCondition.sortCondition.sortRule = event.sortRule;
        this.refreshDetailData();
      },
      handleSearch: (event: FilterCondition[]) => {
        this.detailQueryCondition.filterConditions = event;
        this.detailQueryCondition.pageCondition.pageNum = 1;
        this.refreshDetailData();
      },
      handleSelect: (event: AlarmResultDetailListModel[]) => {
        this.selectListData = [];
        this.detailRelativityAlarmNameList = [];
        this.checkSelectData(event);
      }
    };
  }

  /**
   * ???????????????
   */
  private checkSelectData(list: AlarmResultDetailListModel[]): void {
    if (list && list.length > 0) {
      list.forEach(item => {
        // ????????????????????????alarmNameId????????????
        const obj = this.selectListData.find(v => v.alarmNameId === item.alarmNameId);
        // ????????????????????????alarmLevel=2?????????????????????????????????
        if (item.alarmLevel === '2' && item.father['checked'] && !obj) {
          this.detailRelativityAlarmNameList.push(item.alarmName);
          this.selectListData.push(item);
        }
      });
      // ??????????????????????????????
      if (this.selectListData.length > 0) {
        this.detailRelativityAlarmName = this.detailRelativityAlarmNameList.join(',');
        this.isViewSave = true;
      } else {
        this.detailRelativityAlarmName = '';
        this.isViewSave = false;
      }
    } else {
      this.isViewSave = false;
    }
  }

  /**
   * ??????????????????
   */
  private refreshDetailData(): void {
    this.detailTableConfig.isLoading = true;
    this.detailQueryCondition.bizCondition = {ruleId: this.viewData.id};
    this.$alarmService.viewDetailList(this.detailQueryCondition).subscribe((result: ResultModel<AlarmResultDetailListModel[]>) => {
      if (result.code === ResultCodeEnum.success) {
        if (result.data && result.data.length > 0) {
          this.detailDataSet = this.setAlarmData(result.data);
        } else {
          this.detailDataSet = [];
        }
        this.detailPageBean.Total = result.totalCount;
        this.detailPageBean.pageSize = result.size;
        this.detailPageBean.pageIndex = result.pageNum;
      } else {
        this.$message.error(result.msg);
      }
      this.detailTableConfig.isLoading = false;
    }, () => {
      this.detailTableConfig.isLoading = false;
    });
  }

  /**
   * ????????????
   */
  private setAlarmData(list: AlarmResultDetailListModel[]): AlarmResultDetailListModel[] {
    list.forEach(item => {
      if (item.alarmFixedLevel) {
        item.levelName = this.turnAlarmLevel(item.alarmFixedLevel);
        item.levelStyle = this.$alarmStoreService.getAlarmColorByLevel(item.alarmFixedLevel).backgroundColor;
      }
      // ???????????????????????????class
      if (item.alarmDeviceType) {
        item.deviceTypeName = FacilityForCommonUtil.translateDeviceType(this.$nzI18n, item.alarmDeviceType);
        if (item.deviceTypeName) {
          item.deviceClass = CommonUtil.getFacilityIconClassName(item.alarmDeviceType);
        } else {
          item.deviceClass = '';
        }
      }
      // ??????????????????class
      if (item.alarmSourceType) {
        item.equipmentTypeName = FacilityForCommonUtil.translateEquipmentType(this.$nzI18n, item.alarmSourceType);
        if (item.equipmentTypeName) {
          item.equipmentClass = CommonUtil.getEquipmentIconClassName(item.alarmSourceType);
        } else {
          item.equipmentClass = '';
        }
      }
      if (item.childList && item.childList.length > 0) {
        this.setAlarmData(item.childList);
      }
    });
    return list;
  }

  /**
   * ?????????????????????
   */
  private initRootAlarmWarningName(): void {
    this.rootAlarmNameSelectConfig = {
      type: AlarmSelectorConfigTypeEnum.table,
      clear: !this.selectRootAlarmObj.ids.length,
      handledCheckedFun: (event: AlarmSelectorInitialValueModel) => {
        this.selectRootAlarmObj = event;
      }
    };
  }

  /**
   * ????????????????????????
   */
  private initRelativityAlarmWarningName(): void {
    this.relativityAlarmNameSelectConfig = {
      type: AlarmSelectorConfigTypeEnum.table,
      clear: !this.selectRelativityRootAlarmObj.ids.length,
      handledCheckedFun: (event: AlarmSelectorInitialValueModel) => {
        this.selectRelativityRootAlarmObj = event;
      }
    };
  }
}

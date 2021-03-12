import {AfterContentInit, Component, OnInit} from '@angular/core';
import {FacilityName} from '../util/facility-name';
import {NzI18nService} from 'ng-zorro-antd';
import {indexOperationalLeftPanel} from '../shared/const/index-const';
import {SessionUtil} from '../../../shared-module/util/session-util';

/**
 * 运维数据卡片
 */
@Component({
  selector: 'app-index-operational-data',
  templateUrl: './index-operational-data.component.html',
  styleUrls: ['./index-operational-data.component.scss']
})
export class IndexOperationalDataComponent extends FacilityName implements OnInit, AfterContentInit {
  // 首页左侧面板常量
  public indexLeftPanel = indexOperationalLeftPanel;
  // 是否展开设施设备
  public isExpandFacilityList = false;
  // 是否展开我的关注
  public isExpandMyCollection = false;
  // 是否展开工单
  public isExpandWorkOrder = false;
  // 工单权限
  public roleWorkOrder: boolean = false;

  constructor(public $nzI18n: NzI18nService,
  ) {
    super($nzI18n);
  }

  public ngOnInit(): void {
  }

  public ngAfterContentInit(): void {
    this.roleWorkOrder = SessionUtil.checkHasRole('06');
  }

  /**
   * 左侧面板切换
   */
  public tabClick(index): void {
    switch (index) {
      case indexOperationalLeftPanel.facilitiesList:
        if (this.isExpandFacilityList) {
          this.isExpandFacilityList = false;
        } else {
          this.isExpandFacilityList = true;
          this.isExpandMyCollection = false;
          this.isExpandWorkOrder = false;
        }
        break;
      case indexOperationalLeftPanel.myCollection:
        if (this.isExpandMyCollection) {
          this.isExpandMyCollection = false;
        } else {
          this.isExpandMyCollection = true;
          this.isExpandFacilityList = false;
          this.isExpandWorkOrder = false;
        }
        break;
      case indexOperationalLeftPanel.workOrderList:
        if (this.isExpandWorkOrder) {
          this.isExpandWorkOrder = false;
        } else {
          this.isExpandWorkOrder = true;
          this.isExpandMyCollection = false;
          this.isExpandFacilityList = false;
        }
        break;
    }
  }


}

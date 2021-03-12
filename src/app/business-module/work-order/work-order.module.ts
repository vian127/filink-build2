import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../../shared-module/shared-module.module';
import {RouterModule} from '@angular/router';
import {ROUTER_CONFIG} from './work-order.routes';
import {WorkOrderComponent} from './work-order.component';
import {InspectionWorkOrderComponent} from './inspection/inspection-work-order.component';
import {InspectionTaskComponent} from './inspection/task/inspection-task.component';
import {InspectionWorkOrderDetailComponent} from './inspection/detail/inspection-work-order-detail.component';
import {UnfinishedInspectionWorkOrderComponent} from './inspection/unfinished/unfinished-inspection-work-order.component';
import {FinishedInspectionWorkOrderComponent} from './inspection/finished/finished-inspection-work-order.component';
import {InspectionTaskDetailComponent} from './inspection/task-detail/inspection-task-detail.component';
import {NgxEchartsModule} from 'ngx-echarts';
import {ClearBarrierWorkOrderComponent} from './clear-barrier/clear-barrier-work-order.component';
import {UnfinishedClearBarrierWorkOrderComponent} from './clear-barrier/unfinished/unfinished-clear-barrier-work-order.component';
import {HistoryClearBarrierWorkOrderComponent} from './clear-barrier/history/history-clear-barrier-work-order.component';
import {ClearBarrierWorkOrderDetailComponent} from './clear-barrier/detail/clear-barrier-work-order-detail.component';
import {UnfinishedClearBarrierWorkOrderTableComponent} from './clear-barrier/unfinished/table';
import {HistoryClearBarrierWorkOrderTableComponent} from './clear-barrier/history/table';
import {InspectionTemplateComponent} from './templates/inspection-template/inspection-template.component';
import {InspectionTemplateDetailComponent} from './templates/template-detail/inspection-template-detail.component';
import {UnfinishedDetailClearBarrierWorkOrderComponent} from './clear-barrier/unfinished-detail/unfinished-detail-clear-barrier-work-order.component';
import {UnfinishedDetailInspectionWorkOrderComponent} from './inspection/unfinished-detail/unfinished-detail-inspection-work-order.component';
import {SelectInspectionTemplateComponent} from './share/component/select-inspection-template/select-inspection-template.component';
import {TemplatesComponent} from './templates/templates.component';
import {NgxIntlTelInputModule} from 'ngx-intl-tel-input';
import {InspectionObjectComponent} from './share/component/inspection-object/inspection-object.component';
import {TransferWorkerOrderComponent} from './share/component/transfer-worker-order/transfer-worker-order.component';
import {WorkOrderCommonServiceUtil} from './share/util/work-order-common-service.util';
import {InspectionWorkOrderService} from './share/service/inspection';
import {ClearBarrierWorkOrderService} from './share/service/clear-barrier';
import { RelevanceFaultComponent } from './share/component/relevance-fault/relevance-fault.component';
import {PictureApiService} from '../facility/share/service/picture/picture-api.service';

@NgModule({
  declarations: [
    WorkOrderComponent,
    ClearBarrierWorkOrderComponent,
    UnfinishedClearBarrierWorkOrderComponent,
    HistoryClearBarrierWorkOrderComponent,
    ClearBarrierWorkOrderDetailComponent,
    InspectionWorkOrderComponent,
    InspectionTaskComponent,
    InspectionWorkOrderDetailComponent,
    UnfinishedInspectionWorkOrderComponent,
    FinishedInspectionWorkOrderComponent,
    InspectionTaskDetailComponent,
    UnfinishedClearBarrierWorkOrderTableComponent,
    HistoryClearBarrierWorkOrderTableComponent,
    InspectionTemplateComponent,
    InspectionTemplateDetailComponent,
    UnfinishedDetailClearBarrierWorkOrderComponent,
    UnfinishedDetailInspectionWorkOrderComponent,
    SelectInspectionTemplateComponent,
    TemplatesComponent,
    InspectionObjectComponent,
    TransferWorkerOrderComponent,
    RelevanceFaultComponent,
  ],
    imports: [
        CommonModule,
        RouterModule.forChild(ROUTER_CONFIG),
        SharedModule,
        NgxEchartsModule,
        NgxIntlTelInputModule,
    ],
  exports: [],
  providers: [
    WorkOrderCommonServiceUtil, ClearBarrierWorkOrderService, InspectionWorkOrderService, PictureApiService
  ]
})
export class WorkOrderModule {
}

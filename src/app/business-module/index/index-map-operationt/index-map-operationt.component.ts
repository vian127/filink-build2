import {Component, Input, OnInit} from '@angular/core';
import {OperationService} from '../../../shared-module/service/index/operation.service';

@Component({
  selector: 'app-index-map-operationt',
  templateUrl: './index-map-operationt.component.html',
  styleUrls: ['./index-map-operationt.component.scss']
})
export class IndexMapOperationtComponent implements OnInit {
  // 分组权限
  @Input() roleSelect: boolean;


  constructor(
    public $OperationService: OperationService
  ) {
  }

  public ngOnInit(): void {
  }

  public facilityLayeredChange(): void {
    this.$OperationService.eventEmit.emit({facility: false});
  }

  public selectGroupChange(): void {
    this.$OperationService.eventEmit.emit({selectGroup: false});
  }

  public adjustCoordinatesChange(): void {
    this.$OperationService.eventEmit.emit({addCoordinates: false});
  }
}

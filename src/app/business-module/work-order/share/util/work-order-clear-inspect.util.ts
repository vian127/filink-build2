import {CommonUtil} from '../../../../shared-module/util/common-util';
import {WorkOrderBusinessCommonUtil} from './work-order-business-common.util';
import {NzI18nService} from 'ng-zorro-antd';
import {UserRoleModel} from '../../../../core-module/model/user/user-role.model';

/**
 * 获取设施设备等信息
 */
export class WorkOrderClearInspectUtil {
  /**
   * 多个设备及设备图标
   */
  public static handleMultiEquipment(code: string, language: NzI18nService) {
    const data = {
      names: [],
      equipList: []
    };
    const arr = code.split(',');
    for (let k = 0; k < arr.length; k++) {
      const name = WorkOrderBusinessCommonUtil.equipTypeNames(language, arr[k]);
      if (name && name.length > 0) {
        data.equipList.push({
          iconClass: CommonUtil.getEquipmentIconClassName(arr[k]),
          name: name
        });
        data.names.push(name);
      }
    }
    return data;
  }

  /**
   * 用户选择
   */
  public static selectUser(list: UserRoleModel[], that): void {
    that.checkUserObject = {
      userIds: list.map(v => v.id) || [],
      userName: list.map(v => v.userName).join(',') || '',
    };
    that.userFilterValue.filterValue = that.checkUserObject.userIds.length > 0 ? that.checkUserObject.userIds : null;
    that.userFilterValue.filterName = that.checkUserObject.userName;
  }
}

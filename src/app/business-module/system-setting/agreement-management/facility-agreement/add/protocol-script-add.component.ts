import {Component, ElementRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {FormItem} from '../../../../../shared-module/component/form/form-config';
import {FormOperate} from '../../../../../shared-module/component/form/form-operate.service';
import {CommonLanguageInterface} from '../../../../../../assets/i18n/common/common.language.interface';
import {LanguageEnum} from '../../../../../shared-module/enum/language.enum';
import {NzI18nService, NzModalService} from 'ng-zorro-antd';
import {ColumnConfigService} from '../../../share/service/column-config.service';
import {OperateTypeEnum} from '../../../../../shared-module/enum/page-operate-type.enum';
import {ActivatedRoute, Router} from '@angular/router';
import * as _ from 'lodash';
import {RuleUtil} from '../../../../../shared-module/util/rule-util';
import {AccessModeEnum} from '../../../share/enum/system-setting.enum';
import {FiLinkModalService} from '../../../../../shared-module/service/filink-modal/filink-modal.service';
import {SystemParameterService} from '../../../share/service';
import {ResultModel} from '../../../../../shared-module/model/result.model';
import {XML_LIMIT_NAME_CONST, XML_LIMIT_SIZE_CONST} from '../../../share/const/system.const';
import {BasicConfig} from '../../../share/service/basic-config';
import {CommonUtil} from '../../../../../shared-module/util/common-util';
import {ResultCodeEnum} from '../../../../../shared-module/enum/result-code.enum';
import {FilterCondition, QueryConditionModel} from '../../../../../shared-module/model/query-condition.model';
import {ProductInfoModel} from '../../../../../core-module/model/product/product-info.model';
import {EquipmentTypeEnum} from '../../../../../core-module/enum/equipment/equipment.enum';
import {DeviceProtocolListModel} from '../../../share/mode/device-protocol-list.model';
import {ProtocolTypeEnum} from '../../../share/enum/protocol-type.enum';
import {SystemInterface} from '../../../../../../assets/i18n/system-setting/system.interface';
import {ProductForCommonService} from '../../../../../core-module/api-service/product/product-for-common.service';
import {FileLimitModel} from '../../../share/mode/file-limit.model';
import {Observable} from 'rxjs';
import {CloudPlatformTypeEnum} from 'src/app/core-module/enum/product/product.enum';

/**
 * ?????????????????? ??????/?????? ??????
 */
@Component({
  selector: 'app-protocol-script-add',
  templateUrl: './protocol-script-add.component.html',
  styleUrls: ['./protocol-script-add.component.scss']
})
export class ProtocolScriptAddComponent extends BasicConfig implements OnInit {
  // ??????????????????
  @ViewChild('uploads') private uploadsTemplate: ElementRef;
  // ??????????????????????????????
  @ViewChild('uploadFile') private uploadEquipmentFile: ElementRef;
  // ??????SSL??????
  @ViewChild('uploadCertificate') private uploadSslCertificate: ElementRef;
  // ?????????????????????
  @ViewChild('productSelector') private productSelector: TemplateRef<HTMLDocument>;
  // ???????????????
  public commonLanguage: CommonLanguageInterface;
  // ?????????????????????
  public protocolLanguage: SystemInterface;
  // ????????????
  public pageTitle: string = '';
  // ????????????
  public formColumn: FormItem[] = [];
  // ??????????????????
  public isDisabled: boolean = false;
  // ????????????
  public formStatus: FormOperate;
  // ????????????
  public isLoading: boolean = false;
  // ????????????
  public fileName: string;
  // ??????????????????
  public configFileName: string;
  // ssl????????????
  public sslFileName: string;
  // ????????????????????????????????????
  public productSelectVisible: boolean = false;
  // ???????????????id
  public selectProductId: string = '';
  // ????????????????????????
  public productFilter: FilterCondition[] = [];
  // ????????????
  public equipmentType: EquipmentTypeEnum;
  // ????????????
  public queryConditions: QueryConditionModel = new QueryConditionModel();
  // ??????id
  private protocolId: string = '';
  // ????????????
  private pageType: OperateTypeEnum = OperateTypeEnum.add;
  // xml????????????
  private limit = {
    nameLength: XML_LIMIT_NAME_CONST,
    size: XML_LIMIT_SIZE_CONST,
    nameI18n: this.language.agreement.fileNameLengthLessThan32bits,
    sizeI18n: this.language.agreement.fileSizeLessThan1M
  };
  // ???????????????
  private file: any;
  // ??????????????????
  private configFile: any;
  // ??????ssl??????
  private sslFile: any;
  // ?????????id
  private supplierId: string;
  // ????????????
  private platformType: CloudPlatformTypeEnum;
  // ?????????appId
  private productAppId: string = '';

  constructor(public $nzI18n: NzI18nService,
              private $columnConfigService: ColumnConfigService,
              private $active: ActivatedRoute,
              private $message: FiLinkModalService,
              private $systemSettingService: SystemParameterService,
              private $productForCommonService: ProductForCommonService,
              private $ruleUtil: RuleUtil,
              private $modalService: NzModalService,
              private $router: Router) {
    super($nzI18n);
  }

  /**
   * ?????????
   */
  public ngOnInit(): void {
    this.commonLanguage = this.$nzI18n.getLocaleData(LanguageEnum.common);
    this.protocolLanguage = this.$nzI18n.getLocaleData(LanguageEnum.systemSetting);
    // ?????????????????????
    this.initFormConfig();
    // ???????????????????????????
    this.initPage();
    // ??????????????????????????????
    this.queryLimit();
  }

  /**
   * ?????????????????????????????????
   */
  public submitBtnDisableStatus(): boolean {
    return !(this.isDisabled && this.fileName && this.configFileName);
  }

  /**
   * ???????????????
   */
  public initFormConfig(): void {
    this.formColumn = [
      {
        // ????????????
        label: this.protocolLanguage.protocolName,
        key: 'protocolName',
        type: 'input',
        require: true,
        col: 24,
        rule: [
          {required: true},
          RuleUtil.getNameMaxLengthRule(),
          this.$ruleUtil.getNameRule()
        ],
        customRules: [this.$ruleUtil.getNameCustomRule()],
        asyncRules: [
          this.$ruleUtil.getNameAsyncRule(value => this.$systemSettingService.checkDeviceProtocolNameRepeat(
            {protocolId: this.protocolId, protocolName: value}),
            res => res.code === 0)
        ]
      },
      {
        // ????????????
        label: this.protocolLanguage.accessMode,
        key: 'accessWay',
        type: 'select',
        col: 24,
        rule: [],
        selectInfo: {
          data: [
            {label: 'API', value: AccessModeEnum.api},
            {label: 'SDK', value: AccessModeEnum.sdk},
          ],
          value: 'value',
          label: 'label'
        },
        modelChange: (controls, $event) => {
          if ($event === AccessModeEnum.sdk) {
            this.formStatus.group.controls['sdkDescribe'].enable();
          } else {
            this.formStatus.resetControlData('sdkDescribe', '');
            this.formStatus.group.controls['sdkDescribe'].disable();
          }
        }
      },
      {
        // ????????????
        label: this.protocolLanguage.equipmentModel,
        key: 'equipmentModel',
        type: 'custom',
        col: 24,
        template: this.productSelector,
        rule: []
      },
      {
        // ?????????
        label: this.protocolLanguage.supplier,
        key: 'supplierName',
        type: 'input',
        col: 24,
        placeholder: this.protocolLanguage.automaticAcquisition,
        disabled: true,
        rule: []
      },
      {
        // ????????????
        label: this.protocolLanguage.equipmentType,
        key: 'equipmentType',
        type: 'input',
        col: 24,
        placeholder: this.protocolLanguage.automaticAcquisition,
        disabled: true,
        rule: []
      },
      {
        // ??????????????????
        label: this.language.agreement.softwareVersion,
        key: 'softwareVersion',
        type: 'input',
        col: 24,
        placeholder: this.protocolLanguage.automaticAcquisition,
        disabled: true,
        rule: []
      },
      {
        // ??????????????????
        label: this.language.agreement.hardwareVersion,
        key: 'hardwareVersion',
        type: 'input',
        col: 24,
        placeholder: this.protocolLanguage.automaticAcquisition,
        disabled: true,
        rule: []
      },
      {
        // ????????????
        label: this.protocolLanguage.equipmentSerialNumber,
        key: 'equipmentSerialNum',
        type: 'input',
        col: 24,
        rule: []
      },
      {
        // ?????????????????????
        label: this.protocolLanguage.thirdServiceAddress,
        key: 'thirdPartyServiceAddr',
        type: 'input',
        col: 24,
        rule: [{
          pattern: '^(?=^.{3,255}$)(http(s)?:\\/\\/)?(www\\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\\d+)*(\\/\\w+\\.\\w+)*$',
          msg: this.protocolLanguage.domainAndIpError
        }]
      },
      {
        // ??????????????????????????????
        label: this.protocolLanguage.thirdServiceAddressKey,
        key: 'thirdPartyServiceAddrKeyword',
        type: 'input',
        col: 24,
        rule: []
      },
      {
        // ????????????????????????
        label: this.protocolLanguage.thirdClientAddress,
        key: 'thirdPartyClientAddr',
        type: 'input',
        col: 24,
        rule: [{
          pattern: '^(?=^.{3,255}$)(http(s)?:\\/\\/)?(www\\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\\d+)*(\\/\\w+\\.\\w+)*$',
          msg: this.protocolLanguage.domainAndIpError
        }]
      },
      {
        // ?????????????????????????????????
        label: this.protocolLanguage.thirdClientAddressKey,
        key: 'thirdPartyClientAddrKeyword',
        type: 'input',
        col: 24,
        rule: []
      },
      {
        // ????????????
        label: this.protocolLanguage.communicationProtocol,
        key: 'communicationProtocol',
        type: 'select',
        col: 24,
        require: true,
        selectInfo: {
          data: CommonUtil.codeTranslate(ProtocolTypeEnum, this.$nzI18n, null, 'systemSetting.protocol'),
          value: 'code',
          label: 'label'
        },
        rule: [{required: true}],
      },
      {
        // ??????????????????
        label: this.protocolLanguage.protocolScriptFile,
        key: 'file',
        type: 'custom',
        require: true,
        template: this.uploadsTemplate,
        col: 24,
        rule: []
      },
      {
        // ??????????????????
        label: this.protocolLanguage.configScriptFile,
        key: 'file',
        type: 'custom',
        require: true,
        template: this.uploadEquipmentFile,
        col: 24,
        rule: []
      },
      {
        // SSL??????
        label: this.protocolLanguage.sslCertificate,
        key: 'file',
        type: 'custom',
        template: this.uploadSslCertificate,
        col: 24,
        rule: []
      },
      {
        // SSL????????????
        label: this.protocolLanguage.sslCertificateSecretKey,
        key: 'sslCertificateFilePassword',
        type: 'input',
        col: 24,
        disabled: true,
        rule: []
      },
      {
        // SDK??????
        label: this.protocolLanguage.sdkDescription,
        key: 'sdkDescribe',
        type: 'textarea',
        col: 24,
        disabled: true,
        rule: [this.$ruleUtil.getRemarkMaxLengthRule()]
      },
      {
        // ??????
        label: this.protocolLanguage.remark,
        key: 'remark',
        type: 'textarea',
        col: 24,
        rule: [this.$ruleUtil.getRemarkMaxLengthRule(), this.$ruleUtil.getNameRule()],
        customRules: [this.$ruleUtil.getNameCustomRule()],
      }
    ];
    this.formColumn.forEach(item => {
      item.labelWidth = 200;
    });
  }

  /**
   * ??????form????????????
   * @param event ??????
   */
  public formInstance(event: { instance: FormOperate }): void {
    this.formStatus = event.instance;
    // ????????????
    this.formStatus.group.statusChanges.subscribe(() => {
      this.isDisabled = this.formStatus.getValid();
    });
  }

  /**
   * ????????????
   */
  public onConfirm(): void {
    let funcName: Observable<ResultModel<DeviceProtocolListModel>>;
    const data = this.formStatus.group.getRawValue();
    // ??????id
    if (this.selectProductId) {
      Object.assign(data, {
        productId: this.selectProductId,
        supplier: this.supplierId,
        platformType: this.platformType,
        appId: this.productAppId,
      });
    }
    // ????????????????????????ssl??????
    if (this.platformType === CloudPlatformTypeEnum.telecomCloud) {
      if (!this.sslFile && !this.sslFileName) {
        this.$message.info(this.protocolLanguage.sslFileUploadTip);
        return;
      }
      // ?????????????????????appId???thirdPartyServiceAddr???????????????????????????????????????????????????????????????????????????
      if (!this.productAppId || !this.formStatus.getData('thirdPartyServiceAddr')) {
        this.$message.info(this.protocolLanguage.productParamConfigTip);
        return;
      }
    }
    // ????????????????????????????????????????????????????????????????????????????????????,????????????????????????
    if (data['equipmentModel'] || data['thirdPartyServiceAddr'] || data['thirdPartyClientAddr']) {
      if (this.file || this.configFile || this.sslFile) {
        const formData = new FormData();
        // ?????????????????????????????????????????????formData???
        if (this.file) {
          formData.append('file', this.file, `pro_${this.fileName}`);
        }
        if (this.configFile) {
          formData.append('file', this.configFile, `con_${this.configFileName}`);
        }
        if (this.sslFile || this.sslFileName) {
          if (this.formStatus.getData('sslCertificateFilePassword')) {
            if (this.sslFile) {
              formData.append('file', this.sslFile, `ssl_${this.sslFileName}`);
            } else {
              formData.append('sslCertificateFileName', this.sslFileName);
            }
          } else {
            this.$message.warning(this.protocolLanguage.sslCertificateFilePasswordTip);
            return;
          }
        }
        Object.keys(data).forEach(key => {
          if (data[key]) {
            // ?????????????????????????????????formData???
            if (key === 'equipmentType') {
              formData.append(key, this.equipmentType);
            } else {
              formData.append(key, data[key]);
            }
          }
        });
        if (!this.protocolId) {
          // ??????????????????
          funcName = this.$systemSettingService.queryDeviceProtocolByEquipmentModel(formData);
        } else {
          // ?????????????????????????????????
          formData.append('protocolId', this.protocolId);
          funcName = this.$systemSettingService.updateDeviceProtocol(formData);
        }
      } else {
        const params = Object.assign({}, data, {protocolId: this.protocolId, sslCertificateFileName: this.sslFileName});
        params.equipmentType = this.equipmentType;
        funcName = this.$systemSettingService.updateProtocolName(params);
      }
      this.submitLoading = true;
      funcName.subscribe((result: ResultModel<DeviceProtocolListModel>) => {
        this.submitLoading = false;
        if (result.code === ResultCodeEnum.success) {
          if (!this.protocolId) {
            // ????????????
            this.$message.success(this.protocolLanguage.addProtocolScriptSuccess);
          } else {
            // ????????????
            this.$message.success(this.protocolLanguage.updateProtocolScriptSuccess);
          }
          this.$router.navigate(['business/system/agreement/facility']).then();
        } else if (result.code === ResultCodeEnum.subscribeFailed) {
          this.$message.error(this.protocolLanguage.subscribeFailedTip);
        } else {
          this.$message.error(result.msg);
        }
      }, () => {
        this.submitLoading = false;
      });
    } else {
      this.$message.warning(this.protocolLanguage.notAllEmpty);
    }
  }

  /**
   * ????????????
   */
  public onCancel(): void {
    window.history.go(-1);
  }

  /**
   * ??????ssl?????? ??????ssl???????????????????????????
   */
  public delSslFile() {
    this.sslFile = null;
    this.sslFileName = null;
    document.getElementById('ssl-file')['value'] = '';
    this.formStatus.resetControlData('sslCertificateFilePassword', '');
    this.formStatus.group.controls['sslCertificateFilePassword'].disable();
  }

  /**
   * ????????????
   * param documentId
   */
  public uploadFileChange(documentId: string): void {
    const fileNode = document.getElementById(documentId);
    fileNode.click();
  }

  /**
   * ????????????
   */
  public fileChange($event: any, documentId: string): void {
    // ???????????????
    const fileNode = document.getElementById(documentId);
    // ???????????????????????????????????????????????????
    if (fileNode['files'].length === 0) {
      return;
    }
    const fileName = fileNode['files'][0].name;
    let fileNameIsValid = true;
    // ??????????????????????????????????????????????????????.xml, ssl????????????????????????.pkcs12
    if (documentId === 'file' && /.xml$/.test(fileName)) {
      this.file = fileNode['files'][0];
    } else if (documentId === 'config-file' && /.xml$/.test(fileName)) {
      this.configFile = fileNode['files'][0];
    } else if (documentId === 'ssl-file' && /.pkcs12$/.test(fileName)) {
      this.sslFile = fileNode['files'][0];
    } else {
      fileNameIsValid = false;
      // ????????????????????????????????????
      if (documentId === 'ssl-file') {
        if (!this.sslFile) {
          this.formStatus.group.controls['sslCertificateFilePassword'].disable();
        }
        this.$message.warning(this.protocolLanguage.sslUploadError + '!');
      } else {
        this.$message.warning(this.language.agreement.currentlyOnlyXMLFormatFilesAreSupported + '!');
      }
    }
    // ??????????????????????????? ???????????????????????????????????????
    if (fileNameIsValid) {
      if (fileName.length <= this.limit.nameLength) {
        if (fileNode['files'][0].size <= this.limit.size) {
          this.fileName = this.file ? this.file.name : this.fileName;
          this.configFileName = this.configFile ? this.configFile.name : this.configFileName;
          this.sslFileName = this.sslFile ? this.sslFile.name : this.sslFileName;
          if (documentId === 'ssl-file' && this.sslFileName) {
            this.formStatus.group.controls['sslCertificateFilePassword'].enable();
          }
        } else {
          // ??????????????????
          this.errorFile(this.limit.sizeI18n, $event, documentId);
        }
      } else {
        this.errorFile(this.limit.nameI18n, $event, documentId);
      }
    }
  }

  /**
   * ????????????
   * param $event
   */
  public selectDataChange(event: ProductInfoModel[]): void {
    if (!_.isEmpty(event)) {
      const tempData = event[0];
      if (tempData.appId) {
        // ??????appId
        this.productAppId = tempData.appId;
        this.queryServiceAddress(tempData.appId);
      } else {
        this.productAppId = '';
        this.formStatus.resetControlData('thirdPartyServiceAddr', '');
        this.formStatus.group.controls['thirdPartyServiceAddr'].enable();
      }
      // ??????????????????
      this.platformType = tempData.platformType;
      // ?????????????????????id
      this.selectProductId = tempData.productId;
      this.supplierId = tempData.supplier;
      this.formStatus.resetControlData('equipmentModel', tempData.productModel);
      this.formStatus.resetControlData('supplierName', tempData.supplierName);
      // ??????????????????????????????
      this.equipmentType = tempData.typeCode as EquipmentTypeEnum;
      this.formStatus.resetControlData('equipmentType', CommonUtil.codeTranslate(EquipmentTypeEnum, this.$nzI18n, tempData.typeCode));
      this.formStatus.resetControlData('softwareVersion', tempData.softwareVersion);
      this.formStatus.resetControlData('hardwareVersion', tempData.hardwareVersion);
    } else {
      // ????????????????????????????????????????????????????????????
      this.productAppId = '';
      this.selectProductId = '';
      this.supplierId = '';
      this.platformType = null;
      this.formStatus.group.controls['thirdPartyServiceAddr'].enable();
      ['equipmentModel', 'supplierName' , 'equipmentType', 'softwareVersion', 'hardwareVersion', 'thirdPartyServiceAddr'].forEach(key => {
        this.formStatus.resetControlData(key, '');
      });
    }
  }

  /**
   * ??????appId???????????????????????????
   * param appId
   */
  private queryServiceAddress(appId: string): void {
    this.$systemSettingService.findPlatformAppInfoByAppId(appId).subscribe(res => {
      if (res.code === ResultCodeEnum.success) {
        this.formStatus.resetControlData('thirdPartyServiceAddr', res.data.address);
        this.formStatus.group.controls['thirdPartyServiceAddr'].disable();
      }
    });
  }

  /**
   * ??????????????????
   */
  private errorFile(msg: string, event: any, documentId: string): void {
    // ????????????????????????????????????????????????????????????
    if (documentId === 'file') {
      this.fileName = null;
      this.file = null;
    } else if (documentId === 'config-file') {
      this.configFile = null;
      this.configFileName = null;
    } else {
      this.delSslFile();
    }
    event.target.value = '';
    this.$message.warning(msg + '!');
  }

  /**
   * ????????????
   */
  private confirmCover(res: ResultModel<DeviceProtocolListModel>): void {
    this.$modalService.confirm({
      nzTitle: this.language.table.prompt,
      nzContent: `<span>${res.msg}</span>`,
      nzOkText: this.language.table.cancelText,
      nzOkType: 'danger',
      nzMaskClosable: false,
      nzOnOk: () => {
        this.submitLoading = false;
      },
      nzCancelText: this.language.table.okText,
      nzOnCancel: () => {
        // ???????????????????????????????????????????????????????????????
        const request = this.protocolId ? this.$systemSettingService.updateCoverDeviceProtocol(res.data) : this.$systemSettingService.addDeviceProtocol(res.data);
        request.subscribe((result: ResultModel<string>) => {
          this.submitLoading = false;
          if (result.code === ResultCodeEnum.success) {
            this.$message.success(this.protocolId ? this.protocolLanguage.updateProtocolScriptSuccess : this.protocolLanguage.addProtocolScriptSuccess);
            this.$router.navigate(['business/system/agreement/facility']).then();
          } else {
            this.$message.error(result.msg);
          }
        }, () => {
          this.submitLoading = false;
        });
      }
    });
  }
  /**
   * ???????????????????????????
   */
  private initPage(): void {
      this.pageType = this.$active.snapshot.params.type;
      if (this.pageType === OperateTypeEnum.add) {
        this.pageTitle = this.language.agreement.addProtocolScript;
      } else if (this.pageType === OperateTypeEnum.update) {
        this.pageTitle = this.language.agreement.updateProtocolScript;
        this.$active.queryParams.subscribe(params => {
          this.protocolId = params.id;
          // ??????????????????
          this.getProtocolData();
        });
      }
  }

  /**
   * ????????????????????????
   */
  private getProtocolData(): void {
    this.$systemSettingService.queryDeviceProtocolById(this.protocolId).subscribe((res: ResultModel<DeviceProtocolListModel>) => {
      this.isLoading = false;
      if (res.code === ResultCodeEnum.success) {
        const data = res.data;
        this.formStatus.resetData(data);
        // ????????????????????????
        if (data.productId) {
          this.selectProductId = data.productId;
          this.supplierId = data.supplier;
          this.platformType = data.platformType;
          this.productAppId = data.appId;
          this.equipmentType = data.equipmentType as EquipmentTypeEnum;
          this.formStatus.resetControlData('equipmentType', CommonUtil.codeTranslate(EquipmentTypeEnum, this.$nzI18n, data.equipmentType));
        }
        // appId?????? ????????????????????????????????????????????????
        if (this.productAppId) {
          this.formStatus.group.controls['thirdPartyServiceAddr'].disable();
        }
        this.fileName = data.fileName;
        this.configFileName = data.equipmentConfigFileName;
        this.sslFileName = data.sslCertificateFileName;
        if (this.sslFileName) {
          this.formStatus.group.controls['sslCertificateFilePassword'].enable();
        } else {
          this.formStatus.group.controls['sslCertificateFilePassword'].disable();
        }
      } else {
        this.$message.error(res.msg);
      }
    }, () => {
      this.isLoading = false;
    });
  }


  /**
   * ??????????????????????????????
   */
  private queryLimit(): void {
    this.$systemSettingService.queryFileLimit().subscribe((result: ResultModel<FileLimitModel>) => {
      this.isLoading = false;
      if (result.code === 0) {
        this.limit = result.data;
      }
    }, () => {
      this.isLoading = false;
    });
  }
}


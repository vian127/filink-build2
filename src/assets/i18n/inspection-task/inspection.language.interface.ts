export interface InspectionLanguageInterface {
  operate: string;
  addArea: string;
  update: string;
  number: string;
  selected: string;
  inspectionTaskName: string;
  inspectionTaskType: string;
  inspectionCycle: string;
  taskExpectedTime: string;
  startTime: string;
  endTime: string;
  inspectionArea: string;
  equipmentName: string;
  totalInspectionFacilities: string;
  seekInspectionDevice: string;
  seekInspectionDeviceType: string;
  responsibleUnit: string;
  patrolTaskStatus: string;
  whetherCompleteWorks: string;
  inspectionFacility: string;
  inspectionEquipment: string;
  workOrderID: string;
  workOrderName: string;
  inspectionStartTime: string;
  inspectionEndTime: string;
  creationTime: string;
  actualTime: string;
  numberOfInspections: string;
  workOrderStatus: string;
  delete: string;
  remark: string;
  retreatSingleReason: string;
  enabledState: string;
  export: string;
  print: string;
  examine: string;
  right: string;
  deny: string;
  modify: string;
  inspectionTask: string;
  handleOk: string;
  handleCancel: string;
  viewDetail: string;
  checkDetail: string;
  edit: string;
  associatedWorkOrder: string;
  daysRemaining: string;
  speedOfProgress: string;
  reasonsForTransfer: string;
  typeOfWorkOrder: string;
  printing: string;
  patrolInspectionSheet: string;
  inspectionResults: string;
  exceptionallyDetailed: string;
  inspectionTime: string;
  matchingOfResources: string;
  relatedPictures: string;
  withdraw: string;
  assign: string;
  completeInspectionInformation: string;
  disable: string;
  enable: string;
  schedule: string;
  remarks: string;
  associatedInspectionWorkOrder: string;
  turnBackConfirm: string;
  warning: string;
  currentInspectionTaskCannotBeDeleted: string;
  enableTips: string;
  disableTips: string;
  assigned: string;
  pending: string;
  processing: string;
  completed: string;
  singleBack: string;
  deviceName: string;
  assetNumber: string;
  area: string;
  facilityType: string;
  address: string;
  notInspected: string;
  duringInspection: string;
  routineInspection: string;
  responsible: string;
  patchPanel: string;
  opticalBox: string;
  manWell: string;
  well: string;
  intelligentEntranceGuardLock: string;
  jointClosure: string;
  fiberBox: string;
  deviceType: string;
  setDevice: string;
  incorrectFormatTip: string;
  thisNameExistsTip: string;
  endTimeTip: string;
  startTimeTip: string;
  inRangeDigitalPromptTip: string;
  notDeleteDuringInspectionTip: string;
  enabledTip: string;
  disableTip: string;
  FalsePositives: string;
  other: string;
  pleaseSelectTheAreaInformationFirstTip: string;
  pleaseSelectDepartInfo: string;
  pleaseEnter: string;
  workOrderNameInputError: string;
  thisNameAlreadyExists: string;
  workOrderTypeIsNotAvailableByDefault: string;
  endTimeIsGreaterThanStartTime: string;
  pleaseSelectTheTypeOfInspectionFacilityFirst: string;
  automaticGenerated: string;
  pleaseCompleteTheInformationTip: string;
  deviceCode: string;
  parentId: string;
  regenerate: string;
  inspection: string;
  prompt: string;
  whetherToWithdrawTheWorkOrder: string;
  selectInspectionArea: string;
  numberOfDaysTip: string;
  completedInspection: string;
  normal: string;
  abnormal: string;
  isItRegenerated: string;
  pleaseChoose: string;
  selectDeviceTip: string;
  firstSelectEndDateTip: string;
  theInspectionTaskNoLongerExistsTip: string;
  hasDeletedInspectionTask: string;
  noPicture: string;
  thisWorkOrderHasBeenDeleted: string;
  CreateTheInspectionWorkOrderSuccessfully: string;
  thereAreDeletedWorkOrders: string;
  theWorkOrderDoesNotExist: string;
  turnProcess: string;
  pleaseClickToSelect: string;
  endTimeIsGreaterThanCurrentTime: string;
  expectedCompletionTimeMustBeGreaterThanCurrentTime: string;
  biggerThan: string;
  smallerThan: string;
  equal: string;
  [propName: string]: any;
  outDoorCabinet: string;
  singleInspectionTime: string;
  isRevertWorkOrder: string;
  doYouConfirmTheRefundOfThisWorkOrder: string;
  noPicturesYet: string;
  inspectionTemplate: string;
  templateName: string;
  inspectionItem: string;
  inspectionTotal: string;
  inspectNum: string;
  isDeleteTemplate: string;
  isCreatMultiWorkOrder: string;
  selectTemplate: string;
  viewCheckList: string;
  carInfo: string;
  materiel: string;
  materielInfo: string;
  inspectionDetail: string;
  isPass: string;
  inspectionMaxTotal: string;
  hasNullValue: string;
  existingTemplate: string;
  lastEdit: string;
  InspectionLanguage: string;
  inspectionInfo: string;
  inspectionStatus: string;
  equipmentType: string;
  deviceTotal: string;
  chooseItem: string;
  feeInformation: string;
  orderEvaluation: string;
  pleaseEnterInspectItem: string;
  inspectItemNameDuplicate: string;
  saveData: string;
  closeWin: string;
  addInspectItem: string;
  inspectReport: string;
  passed: string;
  notPass: string;
  selectEquipment: string;
  gateway: string;
  singleLightController: string;
  centralController: string;
  informationScreen: string;
  camera: string;
  broadcast: string;
  wirelessAP: string;
  environmentalMonitoring: string;
  chargingPile: string;
  alarmApparatus: string;
  baseStation5G: string;
  wisdomRod: string;
  wisdom: string;
  distributionBox: string;
  distributionPanel: string;
  selectDept: string;
  loadDepart: string;
  noData: string;
  pleaseSelectUnit: string;
  multifunctionWisdomRod: string;
  devicesName: string;
  inspectObject: string;
  creatUser: string;
  uncommit: string;
  commit: string;
  done: string;
  undone: string;
  noneDelete: string;
  transferObject: string;
  transReason: string;
  operateMsg: {
    successful: string;
    addSuccess: string,
    deleteSuccess: string,
    editSuccess: string,
    rebuildSuccess: string,
    assignSuccess: string,
    turnProgress: string,
    exportSuccess: string,
    turnBack: string,
  };
  assignDepart: string;
  pleaseSelectTheInspectionFacilityFirst: string;
  nameCodeMsg: string;
}

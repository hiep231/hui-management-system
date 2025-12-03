const MESSAGES_CODE = {
  GET_SUCCESS: 'GET_SUCCESS',
  GET_LIST_SUCCESS: 'GET_LIST_SUCCESS',
  CREATED_SUCCESS: 'CREATED_SUCCESS',
  UPDATED_SUCCESS: 'UPDATED_SUCCESS',
  DELETED_SUCCESS: 'DELETED_SUCCESS',
  COUNT_SUCCESS: 'COUNT_SUCCESS',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT_SUCCESS: 'LOGOUT_SUCCESS',
  UPLOAD_SUCCESS: 'UPLOAD_SUCCESS',
  STATS_SUCCESS: 'STATS_SUCCESS',

  GET_FAIL: 'GET_FAIL',
  GET_LIST_FAIL: 'GET_LIST_FAIL',
  CREATE_FAIL: 'CREATE_FAIL',
  UPDATE_FAIL: 'UPDATE_FAIL',
  DELETE_FAIL: 'DELETE_FAIL',
  COUNT_FAIL: 'COUNT_FAIL',
  LOGIN_FAIL: 'LOGIN_FAIL',
  LOGOUT_FAIL: 'LOGOUT_FAIL',
  EXISTS: 'EXISTS',
  UPLOAD_FAIL: 'UPLOAD_FAIL',
  STATS_FAIL: 'STATS_FAIL'
}

enum OrderStatusEnum {
  Waiting = 'Waiting',
  Confirmed = 'Confirmed',
  ShipperConfirmed = 'ShipperConfirmed',
  Prepared = 'Prepared',
  Delivering = 'Delivering',
  Delivered = 'Delivered',
  DeliveryFailed = 'DeliveryFailed',
  Canceled = 'Canceled',
  Deleted = 'Deleted'
}

enum CancelReasonEnum {
  Canceled = 'Canceled',
  NotPay = 'NotPay',
  OutOfStock = 'OutOfStock',
  HighShippingFee = 'HighShippingFee',
  BuyOutside = 'BuyOutside',
  ComeStore = 'ComeStore',
  NotContact = 'NotContact'
}

enum TransactionMethodEnum {
  COD = 'COD',
  Momo = 'Momo',
  ZaloPay = 'ZaloPay'
}

enum REQUEST_STATUS_CODE {
  SUCCESS,
  FAILED
}

export { MESSAGES_CODE, OrderStatusEnum, CancelReasonEnum, TransactionMethodEnum, REQUEST_STATUS_CODE }

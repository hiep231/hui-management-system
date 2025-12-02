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
  STATS_FAIL: 'STATS_FAIL',
};

enum OrderStatusEnum {
  Waiting = 'Waiting', // Chờ xác nhận
  Confirmed = 'Confirmed', // Đã xác nhận
  ShipperConfirmed = 'ShipperConfirmed', // Shipper đã nhận
  Prepared = 'Prepared', // Đang chuẩn bị
  Delivering = 'Delivering', // Đang giao
  Delivered = 'Delivered', // Giao Thành Công
  DeliveryFailed = 'DeliveryFailed', // Giao thất bại
  Canceled = 'Canceled', // Đã Hủy
  Deleted = 'Deleted', // Đã Xóa
}

enum CancelReasonEnum {
  Canceled = 'Canceled', // Khách hủy đơn
  NotPay = 'NotPay', // Khách không thanh toán
  OutOfStock = 'OutOfStock', // Hết hàng
  HighShippingFee = 'HighShippingFee', // Phí ship cao
  BuyOutside = 'BuyOutside', // Khách tự mua bên ngoài
  ComeStore = 'ComeStore', // Khách hẹn đến cửa hàng
  NotContact = 'NotContact', // Không liên hệ khách được
};

enum TransactionMethodEnum {
  COD = 'COD', // Thanh toán khi nhận hàng
  Momo = 'Momo', // Momo
  ZaloPay = "ZaloPay", // ZaloPay
};

enum REQUEST_STATUS_CODE {
  SUCCESS,
  FAILED,
}

export {
  MESSAGES_CODE,
  OrderStatusEnum,
  CancelReasonEnum,
  TransactionMethodEnum,
  REQUEST_STATUS_CODE,
};

/**
 * 解析url参数
 * @example ?id=12345&a=b
 * @return Object {id:12345,a:b}
 */
export function urlParse() {
  let url = window.location.search;

  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url.match(reg);

  // ['?id=12345', '&a=b']
  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substring(1).split('=');
      let key = decodeURIComponent(tempArr[0]);
      let val = decodeURIComponent(tempArr[1]);
      obj[key] = val;
    });
  }
  return obj;
};


export function formatOrderState(state) {
  //.订单状态（0：等待付款；1：等待发货；2：等待收货；3：交易成功；4：取消订单；5：交易关闭；6：退货；）
  var stateText='';
  switch (state){
    case 0:
      stateText='等待付款';
      break;
    case 1:
      stateText='买家已付款';
      break;
    case 2:
      stateText='等待买家收货';
      break;
    case 3:
      stateText="交易成功!";
      break;
    case 4:
      stateText='订单已取消';
      break;
    case 5:
      stateText='交易已关闭';
      break;
    case 6:
      stateText='订单正在退货';
      break;
    case 7:
      stateText='退款申请中';
      break;
    default:
      stateText="未知状态";
      break;
  }
  return stateText;
}

export function formatRefundState(state) {
  var text='';
  //1：待审核；2：审核失败；3：等待买家发货；4：等待商家收货；5：等待商家发货/退款中；6：商家已发货/已退款；7：完成
  switch (state){
    case 1:
      text='待审核';
      break;
    case 2:
      text='审核失败';
      break;
    case 3:
      text='等待买家发货';
      break;
    case 4:
      text='等待商家收货';
      break;
    case 5:
      text='等待商家发货/退款中';
      break;
    case 6:
      text='商家已发货/已退款';
      break;
    case 7:
      text='完成';
      break;
    default:
      text='未知状态';
      break;
  }
  return text;
}


export function matchPassWord(val) {
  var reg=/(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^.{6,20}$/;
  var result=  reg.test(val);
  return result;
}

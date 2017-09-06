import Vue from 'vue'

Vue.filter("subPhone", function (value) {
  if (value) {
    return value.substr(0, 3) + "*****" + value.substr(8, 11);
  }
  else {
    return '';
  }
});
Vue.filter("toFixed", function (value) {
  if (value) {
    return value.toFixed(2)
  }
  else {
    return '0.00';
  }
});





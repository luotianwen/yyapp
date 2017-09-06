cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/cordova-plugin-alipay/www/alipay.js",
        "id": "cordova-plugin-alipay.alipay",
        "pluginId": "cordova-plugin-alipay",
        "clobbers": [
            "alipay"
        ]
    },
    {
        "file": "plugins/cordova-plugin-wechat/www/wechat.js",
        "id": "cordova-plugin-wechat.Wechat",
        "pluginId": "cordova-plugin-wechat",
        "clobbers": [
            "Wechat"
        ]
    },
    {
        "file": "plugins/cordova-plugin-qqsdk/www/qq.js",
        "id": "cordova-plugin-qqsdk.QQSDK",
        "pluginId": "cordova-plugin-qqsdk",
        "clobbers": [
            "QQSDK"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-alipay": "0.10.0",
    "cordova-plugin-wechat": "1.4.0",
    "cordova-plugin-qqsdk": "0.8.7"
}
// BOTTOM OF METADATA
});
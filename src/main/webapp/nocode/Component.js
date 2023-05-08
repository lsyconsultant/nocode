sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel"
], function (UIComponent, JSONModel, ResourceModel) {
    "use strict";

    return UIComponent.extend("sap.ui.eland.Component", {

        metadata: {
            interfaces: ["sap.ui.core.IAsyncContentCreation"],
            manifest: "json",
        },
        init: function () {
            var oData = {};
            var oModel = new JSONModel(oData);
            this.setModel(oModel);

            // call the init function of the parent
            UIComponent.prototype.init.apply(this, arguments);

            // set i18n model
            var i18nModel = new ResourceModel({
                bundleName: "sap.ui.eland.i18n.i18n"
            });
            this.setModel(i18nModel, "i18n");

            //로그인 정보 조회
            this.getLoginStatus()

            // create the views based on the url/hash
            this.getRouter().initialize();

        }
    });

});
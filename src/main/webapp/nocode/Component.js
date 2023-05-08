sap.ui.define([
    "sap/ui/core/UIComponent",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/resource/ResourceModel"
], function (UIComponent, JSONModel, ResourceModel) {
    "use strict";

    return UIComponent.extend("sap.ui.nocode.Component", {

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
                bundleName: "sap.ui.nocode.i18n.i18n"
            });
            this.setModel(i18nModel, "i18n");

            // create the views based on the url/hash
            this.getRouter().initialize();

        }
    });

});
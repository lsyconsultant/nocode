sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
], function (Controller, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("sap.ui.nocode.controller.framework.App", {

        onInit: function () {
            // debugger;
            var oData = {
                loginStatus : this.getOwnerComponent().getModel().getProperty("/loginStatus")
            };
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel);
            console.log(this.getView().getModel().getProperty("/memberId"))
        },
        onProjectCreate(){
            var that = this;
            $.ajax({
                type: "post",
                url: "/createProject.do",
                data: {
                    projectId:this.getView().byId("projectId").getValue(),
                    projectNm:this.getView().byId("projectNm").getValue()
                },
                cache: false,
                async: false,
                dataType: "json",
                success: function (result) {
                    console.log(JSON.stringify(result));
                },
                error: function (data) {
                    console.log(data);
                }
            });
        }
    });

});

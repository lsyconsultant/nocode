sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
], function (Controller, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("sap.ui.nocode.controller.campaign.campaignCreate", {

        onInit: function () {
            var oData = {
                loginStatus: this.getOwnerComponent().getModel().getProperty("/loginStatus"),
            };
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel);
            console.log(this.getView().getModel().getProperty("/memberId"))

            this.getOwnerComponent().getRouter().attachRouteMatched(function (oEvent) {
                var routeName = oEvent.getParameter("name");
                this.getView().getModel().setProperty("/currentRoute", routeName);
                this.getView().getModel().setProperty("/currentRouteArguments", oEvent.getParameter("arguments"));

                if (routeName === "campaignCreate") {

                }

            }.bind(this));

        },
        onSave(event){
            var that = this;
            $.ajax({
                type: "post",
                url: "/campaign/campaignCreate.do",
                data: JSON.stringify({
                    campaignNm:this.getView().getModel().getProperty("/data/campaignNm")
                }),
                cache: false,
                async: false,
                headers: {
                    "Content-Type": "application/json"
                },
                success: function (result) {
                    MessageToast.show(result.resultMsg);
                    if(result.resultCd === 'S'){
                        this.getOwnerComponent().getRouter().navTo("campaignDetail", {campaignId:result.data.campaignId});
                    }
                },
                error: function (data) {
                    console.log(data);
                }
            });
        }
        

    });

});

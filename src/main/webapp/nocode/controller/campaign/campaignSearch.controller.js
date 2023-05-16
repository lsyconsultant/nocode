sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
], function (Controller, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("sap.ui.nocode.controller.campaign.campaignSearch", {

        onInit: function () {
            var oData = {
                loginStatus: this.getOwnerComponent().getModel().getProperty("/loginStatus")
            };
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel);
            console.log(this.getView().getModel().getProperty("/memberId"))

            this.getOwnerComponent().getRouter().attachRouteMatched(function (oEvent) {
                var routeName = oEvent.getParameter("name");
                this.getView().getModel().setProperty("/currentRoute", routeName);
                this.getView().getModel().setProperty("/currentRouteArguments", oEvent.getParameter("arguments"));

                if (routeName === "campaignSearch") {
                    this.getCampaignList();
                }

            }.bind(this));

        },
        onNewCampaign(event){
            this.getOwnerComponent().getRouter().navTo("campaignDetail", {campaignId:"new"});
        },
        getCampaignList(event){
            var that = this;
            $.ajax({
                type: "get",
                url: "/campaign/getCampaignList.do",
                data: {},
                cache: false,
                async: true,
                success: function (result) {
                    that.getView().getModel().setProperty("/data", result)
                },
                error: function (data) {
                    console.log(data);
                }
            });
        }


    });

});

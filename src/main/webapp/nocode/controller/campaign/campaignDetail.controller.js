sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
], function (Controller, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("sap.ui.nocode.controller.campaign.campaignSearch", {

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

                if (routeName === "campaignDetail") {
                    this.getCampaignDetail();
                }

            }.bind(this));

        },
        onCreateCampaign(event){
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
        },
        getCampaignDetail(event){
            var that = this;
            $.ajax({
                type: "get",
                url: "/campaign/getCampaignDetail.do",
                data: {
                    campaignId:this.getView().getModel().getProperty("/currentRouteArguments/campaignId")
                },
                cache: false,
                async: true,
                // headers: {
                //     "Content-Type": "application/json"
                // },
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

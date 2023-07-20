sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
], function (Controller, MessageToast, JSONModel, Fragment) {
    "use strict";

    return Controller.extend("sap.ui.nocode.controller.framework.BoDetail", {

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

                if (routeName === "BoDetail") {
                    this.getBoDetailFromId();
                }

            }.bind(this));

        },
        getBoDetailFromId() {
            debugger
            var that = this;
            $.ajax({
                type: "get",
                url: "/bo/getBoDetail.do",
                data: this.getView().getModel().getProperty("/currentRouteArguments"),
                cache: false,
                async: true,
                success: function (result) {
                    that.getView().getModel().setProperty("/bo", result);
                },
                error: function (data) {
                    console.log(data.error().responseText);
                }
            });
        },
        onGoToBoManage(event) {
            this.getOwnerComponent().getRouter().navTo("BoManage", {});
        }

    });

});


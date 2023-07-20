sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
], function (Controller, MessageToast, JSONModel, Fragment) {
    "use strict";

    return Controller.extend("sap.ui.nocode.controller.framework.BoManage", {

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

                if (routeName === "BoManage" || routeName === "home") {
                    this.getBoList();
                }

            }.bind(this));

        },
        getBoList(){
            var that = this;
            $.ajax({
                type: "get",
                url: "/bo/getBoList.do",
                cache: false,
                async: true,
                success: function (result) {
                    that.getView().getModel().setProperty("/boList",result);
                },
                error: function (data) {
                    console.log(data.error().responseText);
                }
            });
        },
        onNewBoPopup() {
            var oView = this.getView();

            // create Dialog
            if (!this._BoWizrdDialog) {
                this._BoWizrdDialog = Fragment.load({
                    id: oView.getId(),
                    name: "sap.ui.nocode.view.framework.BO.fragment.BoDialog",
                    controller: this
                }).then(function (oDialog) {
                    oDialog.attachAfterOpen(this.boWizardOnInit, this);
                    oView.addDependent(oDialog);
                    // oDialog.bindElement("/ProductCollection/0");
                    return oDialog;
                }.bind(this));

                this._BoWizrdDialog.then(function (oDialog) {
                    oDialog.open();
                }.bind(this))
            } else {
                this._BoWizrdDialog.then(function (oDialog) {
                    oDialog.destroy();
                    this.onNewBoPopup();
                }.bind(this))
                this._BoWizrdDialog = null;
            }

        },
        boWizardOnInit() {
            var data = {
                id: "",
                name: "",
                desc: "",
                attributes: [],
                buttonVisible: {
                    previous: false,
                    next: false,
                    finish: false,
                    cancel: false
                },
            }
            this.getView().getModel().setProperty("/boWizard", data);

            this.boWizardButtonVisibleHandle();
        },
        boWizardButtonVisibleHandle() {
            var boWizard = this.getView().byId("BoWizard");
            var step = boWizard.getCurrentStep().split("--")[2];

            switch (step) {
                case 'step1':
                    this.getView().getModel().setProperty("/boWizard/buttonVisible/previous", false);
                    this.getView().getModel().setProperty("/boWizard/buttonVisible/next", true);
                    this.getView().getModel().setProperty("/boWizard/buttonVisible/finish", false);
                    this.getView().getModel().setProperty("/boWizard/buttonVisible/cancel", true);
                    break;
                case 'step2':
                    this.getView().getModel().setProperty("/boWizard/buttonVisible/previous", true);
                    this.getView().getModel().setProperty("/boWizard/buttonVisible/next", false);
                    this.getView().getModel().setProperty("/boWizard/buttonVisible/finish", true);
                    this.getView().getModel().setProperty("/boWizard/buttonVisible/cancel", true);
                    break;
            }
        },
        onBoDialogNextButton(event) {
            this.getView().byId("BoWizard").nextStep();
            this.boWizardButtonVisibleHandle();
        },
        onBoDialogPreviousButton(event) {
            this.getView().byId("BoWizard").previousStep();
            this.boWizardButtonVisibleHandle();
        },
        onBoDialogFinishButton(event) {
            var data = this.getView().getModel().getProperty("/boWizard");
            delete data.buttonVisible;
            console.log(data);
            // data = JSON.parse('{"id":"campaignBO","name":"캠페인BO","desc":"캠페인 BO 생성","attributes":[{"boId":"campaignBO","id":"id","name":"캠페인ID","key":true,"type":"varchar","length":"50","point":"","desc":"캠페인ID"},{"boId":"campaignBO","id":"name","name":"캠페인명","key":false,"type":"varchar","length":"255","point":"","desc":"캠페인명"},{"boId":"campaignBO","id":"status","name":"캠페인 상태","key":false,"type":"varchar","length":"10","point":"","desc":"open, rele, stop"}]}');

            var that = this;
            $.ajax({
                type: "post",
                url: "/bo/boCreate.do",
                data: JSON.stringify(data),
                cache: false,
                async: false,
                headers: {
                    "Content-Type": "application/json"
                },
                success: function (result) {
                    MessageToast.show(result.resultMsg);
                    if (result.resultCd === 'S') {
                        that.onBoDialogCancelButton();
                    }

                },
                error: function (data) {
                    console.log(data.error().responseText);
                }
            });
        },
        onBoDialogCancelButton(event) {
            this._BoWizrdDialog.then(function (oDialog) {
                oDialog.close();
            }.bind(this))
        },
        onBoAttributeAdd() {
            var attributes = this.getView().getModel().getProperty("/boWizard/attributes");

            var newData = {
                boId: this.getView().getModel().getProperty("/boWizard/id"),
                id: "",
                name: "",
                key: false,
                type: "",
                length: "",
                point: ""
            };

            attributes.push(newData);
            this.getView().getModel().setProperty("/boWizard/attributes", attributes);

            this.BoAttributeTableVisibleRowRefresh();
        },
        BoAttributeTableVisibleRowRefresh() {
            this.getView().byId("boAttributeTable").setVisibleRowCount(
                this.getView().getModel().getProperty("/boWizard/attributes").length
            );
        },
        onGoToBoDetail(event){
            var boId = event.getSource().getBindingContext().getProperty("id");
            this.getOwnerComponent().getRouter().navTo("BoDetail", {bo:boId});
        }


    });

});


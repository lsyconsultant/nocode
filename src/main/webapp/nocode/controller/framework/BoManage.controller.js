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
        },
        onNewBoPopup() {
            var oView = this.getView();

            // create Dialog
            if (!this._BoWizrdDialog) {
                this._BoWizrdDialog = Fragment.load({
                    id: oView.getId(),
                    name: "sap.ui.nocode.view.framework.fragment.BoDialog",
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
                baseInfo: {},
                attributeList: [],
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
            var that = this;
            $.ajax({
                type: "post",
                url: "/login/login.do",
                data: {
                    id: this.getView().getModel().getProperty("/id"),
                    password: this.getView().getModel().getProperty("/password")
                },
                cache: false,
                async: false,
                dataType: "json",
                success: function (result) {

                    MessageToast.show(result.resultMsg);
                    if (result.resultCd === 'true') {
                        sap.m.URLHelper.redirect("/", false);
                    }

                },
                error: function (data) {
                    console.log(data.error().responseText);
                }
            });




            this.onBoDialogCancelButton();
        },
        onBoDialogCancelButton(event) {
            this._BoWizrdDialog.then(function (oDialog) {
                oDialog.close();
            }.bind(this))
        },
        onBoAttributeAdd() {
            var attributeList = this.getView().getModel().getProperty("/boWizard/attributeList");

            var newData = {
                id: "",
                name: "",
                key: false,
                type: "",
                length: "",
                point: ""
            };

            attributeList.push(newData);
            this.getView().getModel().setProperty("/boWizard/attributeList", attributeList);

            this.BoAttributeTableVisibleRowRefresh();
        },
        BoAttributeTableVisibleRowRefresh() {
            this.getView().byId("boAttributeTable").setVisibleRowCount(
                this.getView().getModel().getProperty("/boWizard/attributeList").length
            );
        }


    });

});


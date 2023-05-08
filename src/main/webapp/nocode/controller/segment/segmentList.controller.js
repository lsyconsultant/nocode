sap.ui.define([
    "jquery.sap.global",
    "sap/m/MessageToast",
    "sap/ui/core/format/DateFormat",
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/Dialog",
    "sap/m/Label",
    "sap/m/Text",
    "sap/m/TextArea",
    "sap/m/Button",
    "sap/m/library",
    'sap/ui/core/BusyIndicator',
    'sap/ui/core/Fragment',
    "sap/ui/Device",
], function (jQuery, MessageToast, DateFormat, Controller, JSONModel,
             Dialog, Label, Text, TextArea, Button, library,
             BusyIndicator, Fragment, Device) {
    "use strict";

    return Controller.extend("sap.ui.eland.controller.segment.segmentList", {

        onInit: function () {
            this.getOwnerComponent().getRouter().attachRouteMatched(function (oEvent) {
                var routeName = oEvent.getParameter("name");
                this.getView().getModel().setProperty("/currentRoute", routeName);

                if (routeName === "segmentList") {
                    this.getSegmentList();
                }
            }.bind(this));


            this.getView().addStyleClass("sapUiSizeCompact");
            var data = {
                segments:[]
            };

            var oModel = new JSONModel(data);
            this.getView().setModel(oModel);

            // set device model
            var oDeviceModel = new JSONModel(Device);
            oDeviceModel.setDefaultBindingMode("OneWay");
            this.getView().setModel(oDeviceModel, "device");


        },
        getSegmentList() {
            var that = this;
            $.ajax({
                type: "get",
                url: "/segment/selectSegmentList.do",
                data: {
                //    추후 조회 조건 입력
                },
                cache: false,
                async: true,
                dataType: "json",
                success: function (result) {
                    that.getView().getModel().setProperty("/segments", result)
                },
                error: function (data) {
                    console.log(data.error().responseText);
                }
            });
        },
        onStopSegment(event){
            var segId = event.getSource().getBindingContext().getProperty("id");
            if(!segId || segId === ""){
                MessageToast.show("세그먼트가 선택되지 않았습니다. \n 새로고침 후 다시 시도해주세요.");
                return;
            }

            var that = this;
            $.ajax({
                type: "post",
                url: "/segment/stopSegment.do",
                data: JSON.stringify({
                    id: segId
                }),
                cache: false,
                async: true,
                dataType: "json",
                headers: {
                    "Content-Type": "application/json"
                },
                success: function (result) {
                    MessageToast.show(result.resultMsg);
                    if(result.resultCd === "S"){
                        that.getSegmentList();
                    }
                },
                error: function (data) {
                    console.log(data.error().responseText);
                }
            });
        },
        onCreateSegment(){
            this.getOwnerComponent().getRouter().navTo("segmentCreate", {});
        },
        onExecuteSegment(event){
            var segId = event.getSource().getBindingContext().getProperty("id");
            if(!segId || segId === ""){
                MessageToast.show("세그먼트가 선택되지 않았습니다. \n 새로고침 후 다시 시도해주세요.");
                return;
            }

            var that = this;
            $.ajax({
                type: "post",
                url: "/segment/executeSegment.do",
                data: JSON.stringify({
                    id: segId
                }),
                cache: false,
                async: true,
                dataType: "json",
                headers: {
                    "Content-Type": "application/json"
                },
                success: function (result) {
                    MessageToast.show(result.resultMsg);
                    if(result.resultCd === "S"){
                        that.getSegmentList();
                    }
                },
                error: function (data) {
                    console.log(data.error().responseText);
                }
            });
        },
        onDeleteSegment(event){
            var segId = event.getSource().getBindingContext().getProperty("id");
            if(!segId || segId === ""){
                MessageToast.show("세그먼트가 선택되지 않았습니다. \n 새로고침 후 다시 시도해주세요.");
                return;
            }

            var that = this;
            $.ajax({
                type: "post",
                url: "/segment/deleteSegment.do",
                data: JSON.stringify({
                    id: segId
                }),
                cache: false,
                async: true,
                dataType: "json",
                headers: {
                    "Content-Type": "application/json"
                },
                success: function (result) {
                    MessageToast.show(result.resultMsg);
                    if(result.resultCd === "S"){
                        that.getSegmentList();
                    }
                },
                error: function (data) {
                    console.log(data.error().responseText);
                }
            });
        }

    });
});

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
    "sap/ui/core/routing/History"
], function (jQuery, MessageToast, DateFormat, Controller, JSONModel,
             Dialog, Label, Text, TextArea, Button, library,
             BusyIndicator, Fragment, Device, History) {
    "use strict";

    return Controller.extend("sap.ui.eland.controller.segment.segmentCreate", {

        onInit: function () {

            this.getOwnerComponent().getRouter().attachRouteMatched(function (oEvent) {
                var routeName = oEvent.getParameter("name");
                this.getView().getModel().setProperty("/currentRoute", routeName);

                if (routeName === "segmentCreate") {
                    this.segmentDataInit();
                    this.getView().byId("pageTitle").setText("세그먼트 생성");
                } else if(routeName === "segmentDetail") {
                    this.getView().byId("pageTitle").setText("세그먼트 상세");
                }

            }.bind(this));


            this.getView().addStyleClass("sapUiSizeCompact");
            var data = {
                currentRoute: "",
                // "member": {
                //     "mb_id": g5_mb_id,
                //     "mb_name": g5_mb_name,
                //     "mb_role": g5_user_role,
                //     "mb_company_id": g5_mb_company_id
                // }
                periodTypeDDLB: [
                    {key: '1', text: "1"}, {key: '2', text: "2"}, {key: '3', text: "3"}, {key: '', text: "4"},
                    {key: '', text: "5"}, {key: '', text: "6"}, {key: '', text: "7"}, {key: '', text: "8"},
                    {key: '', text: "9"}, {key: '', text: "10"}, {key: '', text: "11"}, {key: '', text: "12"},
                    {key: '', text: "13"}, {key: '', text: "14"}, {key: '', text: "15"}, {key: '', text: "16"},
                    {key: '', text: "17"}, {key: '', text: "18"}, {key: '', text: "19"}, {key: '', text: "20"},
                    {key: '', text: "21"}, {key: '', text: "22"}, {key: '', text: "23"}, {key: '', text: "24"},
                    {key: '', text: "25"}, {key: '', text: "26"}, {key: '', text: "27"}, {key: '', text: "28"},
                    {key: '', text: "29"}, {key: '', text: "30"}, {key: '', text: "31"}
                ],
                segRadio: "",
                AwsS3ToBrazeList: [//추후 Ajax로 변경
                    {key: '', typeDesc: "선택하세요."},
                    {
                        key: 'BrandSalesUploader',
                        typeDesc: "특정 브랜드에서 유저가 구매한 금액이 10만원이상일 경우, Attribute 전송",
                        filePath: "brz/cust_sale/cust_brand_sale000",
                        classPath: "com.eland.BatchScheduler.braze.uploader.BrandSalesUploader"
                    },
                    {
                        key: 'CouponIssueUploader',
                        typeDesc: "작업 실행 전 날 발급된 쿠폰 정보를 ‘쿠폰 Issed’ Event에 전송",
                        filePath: "brz/unused_coupon/unused_coupon000",
                        classPath: "com.eland.BatchScheduler.braze.uploader.CouponIssueUploader"
                    },
                    {
                        key: 'CouponUseUploader',
                        typeDesc: "작업 실행 전 날 사용된 쿠폰 정보를 ‘쿠폰 Used’ Event에 전송",
                        filePath: "brz/used_coupon/used_coupon000",
                        classPath: "com.eland.BatchScheduler.braze.uploader.CouponUseUploader"
                    },
                    {
                        key: 'DeliveryCompleteUploader',
                        typeDesc: "배송 완료 정보를 주문번호 기준으로 묶어서‘배송 Completed’ Event에 전송",
                        filePath: "brz/mb_onl_deli_brz_mst/mb_onl_deli_brz_mst_deli_finish000",
                        classPath: "com.eland.BatchScheduler.braze.uploader.DeliveryCompleteUploader"
                    },
                    {
                        key: 'DeliveryStartUploader',
                        typeDesc: "배송 시작 시 정보를 주문번호 기준으로 묶어서 ‘배송 Started’ Event에 전송",
                        filePath: "brz/mb_onl_deli_brz_mst/mb_onl_deli_brz_mst_ship_finish000",
                        classPath: "com.eland.BatchScheduler.braze.uploader.DeliveryStartUploader"
                    },
                    {
                        key: 'OrderCancelUploader',
                        typeDesc: "주문 취소 정보를 ‘주문 Canceled’ Event에 전송",
                        filePath: "brz/mb_onl_deli_brz_mst/mb_onl_deli_brz_mst_ord_cancel000",
                        classPath: "com.eland.BatchScheduler.braze.uploader.OrderCancelUploader"
                    },
                    {
                        key: 'OrderExchangeUploader',
                        typeDesc: "주문 상태 코드가 13번인 정보를 필터링하여 해당 주문 교환 정보를 ‘주문 Exchanged’ Event에 전송",
                        filePath: "brz/mb_onl_deli_brz_mst/mb_onl_deli_brz_mst_ord_finish000",
                        classPath: "com.eland.BatchScheduler.braze.uploader.OrderExchangeUploader"
                    },
                    {
                        key: 'OrderReturnUploader',
                        typeDesc: "주문 상태 코드가 30번인 정보를 필터링하여 해당 주문 반품 정보를 ‘주문 Returned’ Event에 전송",
                        filePath: "brz/mb_onl_deli_brz_mst/mb_onl_deli_brz_mst_ord_finish000",
                        classPath: "com.eland.BatchScheduler.braze.uploader.OrderReturnUploader"
                    },
                    {
                        key: 'PurchaseEventUploder',
                        typeDesc: "주문 상태 코드가 10번인 정보를 필터링하여 해당 구매 정보를 Purchase Event에 전송",
                        filePath: "brz/mb_onl_deli_brz_mst/mb_onl_deli_brz_mst_ord_finish000",
                        classPath: "com.eland.BatchScheduler.braze.uploader.PurchaseEventUploader"
                    },
                    {
                        key: 'ReviewAttributeUploader',
                        typeDesc: "상품평 등록 시 해당 상품의 상품평 목록을 Attribute에 전송 (현재 데이터는 정상적으로 전송하고 있지만 해당 Attribute는 block 상태임.)",
                        filePath: "brz/goods_evaluate/goods_evaluate000",
                        classPath: "com.eland.BatchScheduler.braze.uploader.ReviewAttributeUploader"
                    },
                    {
                        key: 'ReviewEventUploader',
                        typeDesc: "상품평 등록 시 해당 정보를 ‘상품평 Added’ Event에 전송",
                        filePath: "brz/goods_evaluate/goods_evaluate000",
                        classPath: "com.eland.BatchScheduler.braze.uploader.ReviewEventUploader"
                    },
                    {
                        key: 'UserDataRemover',
                        typeDesc: "S3에 해당 파일 백업 후 브레이즈에 사용자 삭제 요청 전송",
                        filePath: "brz/mb_onl_cust_brz_mst/mb_onl_cust_brz_mst_minus000",
                        classPath: "com.eland.BatchScheduler.braze.uploader.UserDataRemover"
                    },
                    {
                        key: 'UserDataUploader',
                        typeDesc: "신규회원 또는 정보가 수정된 회원 데이터, S3에 해당 파일 백업 후 브레이즈 해당 정보 전송",
                        filePath: "brz/mb_onl_cust_brz_mst/mb_onl_cust_brz_mst_diff000",
                        classPath: "com.eland.BatchScheduler.braze.uploader.UserDataUploader"
                    },
                    {
                        key: 'UserGradeUploader',
                        typeDesc: "[파일3개, 로직 점검필요] 전체 회원의 회원 등급 정보를 브레이즈에 전송 (현재 월 2회 실행) - 1일,20일 DW에서  직접 AWS 배치를 실행해줌, 실행시간은 오전중이나 봐꿀수 있음",
                        filePath: "brz/cust_grd/sl_grd_mst_full000,brz/cust_grd/sl_grd_mst_daily000, brz/cust_grd/sl_grd_mst_minus000",
                        classPath: "com.eland.BatchScheduler.braze.uploader.UserGradeUploader"
                    },
                ],
                segment:{}
            };

            var oModel = new JSONModel(data);
            this.getView().setModel(oModel);
            this.getView().bindElement("/member");


            // set device model
            var oDeviceModel = new JSONModel(Device);
            oDeviceModel.setDefaultBindingMode("OneWay");
            this.getView().setModel(oDeviceModel, "device");

            this.segmentDataInit();

        },
        segmentDataInit(){
          var initData = {
                  basicInfo: {
                      id: "",
                      name: "",
                      desc: "",
                      status: "",
                      createBy: '',
                      createDatetime: '',
                      modifyBy: '',
                      modifyDatetime: ''
                  },
                  typeInfo: {
                      type: "",
                      typeDesc: "",
                      filePath: "",
                      classPath: ""
                  },
                  batchInfo: {
                      cycleYn: "false",
                      cycleType: "daily",
                      cyclePeriod: "1",
                      cycleStartDatetime: "",
                      saveDbYn: "Y",
                      saveBrazeYn: "Y",
                  }
              }
          this.getView().getModel().setProperty("/segment", initData);
        },
        onSegTypeClick(event) {
            var id = this.byId("segRadio").getSelectedButton().sId.split("--")[2];
            this.getView().getModel().setProperty("/segment/typeInfo/type", id);
        },
        onConnectTest() {
            MessageToast.show("정상적으로 연결 되었습니다.")
        },
        onFileExistTest() {
            MessageToast.show("정상적으로 확인 되었습니다.")
        },
        onAwsS3ToBrazeListSelect(event) {
            var selectedKey = event.getSource().getProperty("selectedKey");
            if (!selectedKey) {
                MessageToast.show("파일을 선택하세요.")
                return;
            }
            var item = this.getView().getModel().getProperty("/AwsS3ToBrazeList").find(item => item.key === selectedKey);
            this.getView().getModel().setProperty("/segment/typeInfo/text", item.text);
            this.getView().getModel().setProperty("/segment/typeInfo/filePath", item.filePath);
            this.getView().getModel().setProperty("/segment/typeInfo/classPath", item.classPath);
        },
        onSegmentSave(event) {
            console.log(JSON.stringify(this.getView().getModel().getProperty("/segment")))
            var data = this.getView().getModel().getProperty("/segment");
            // data.basicInfo.startDate = moment(data.basicInfo.startDate).format('YYYY-MM-DD');
            // data.basicInfo.endDate = moment(data.basicInfo.endDate).format('YYYY-MM-DD');

            var that = this;
            $.ajax({
                type: "post",
                url: "/segment/create.do",
                data: JSON.stringify(data),
                cache: false,
                async: true,
                headers: {
                    "Content-Type": "application/json"
                },
                success: function (result) {
                    MessageToast.show(result.resultMsg);
                    if(result.resultCd === 'S'){
                        window.history.go(-1);
                    }
                },
                error: function (data) {
                    console.log(data);
                }
            });
        },
        onSegmentCreateCnacel(event) {
            MessageToast.show("세그먼트 생성이 취소 되었습니다.");
            //데이터 초기화
            window.history.go(-1);
        }

    });
});

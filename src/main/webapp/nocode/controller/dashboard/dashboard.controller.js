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
    'sap/m/ActionSheet',
], function (jQuery, MessageToast, DateFormat, Controller, JSONModel,
             Dialog, Label, Text, TextArea, Button, library,
             BusyIndicator, Fragment, Device, ActionSheet) {
    "use strict";

    return Controller.extend("sap.ui.eland.controller.dashboard.dashboard", {

        onInit: function () {
            console.log("dashboard.controller.js -> onInit")
            this.getView().addStyleClass("sapUiSizeCompact");
            var data = {
                // "member": {
                //     "mb_id": g5_mb_id,
                //     "mb_name": g5_mb_name,
                //     "mb_role": g5_user_role,
                //     "mb_company_id": g5_mb_company_id
                // }
                navigation: [
                    {key: 'campaignList', title: '캠페인 리스트', icon: 'sap-icon://combine', items: []},
                    {key: 'campaign', title: '캠페인 생성', icon: 'sap-icon://combine', items: []},
                    {key: 'segmentList', title: '세그먼트 리스트', icon: 'sap-icon://database', items: []},
                    {key: 'segmentCreate', title: '세그먼트 생성', icon: 'sap-icon://database', items: []},
                    {key: 'action', title: ' 관리', icon: 'sap-icon://database', items: []},
                    {
                        key: 'campaignReultReport',
                        title: '리포트',
                        icon: 'sap-icon://add-activity',
                        items: [
                            {key: 'campaignReultReport', title: '캠페인 결과 리포트', icon: 'sap-icon://database'}
                        ]
                    },
                ],
                campaignTypeDDLB: [
                    {key: 'test', text: "스케쥴 캠페인"},
                    {key: '', text: "유저 액션 캠페인"},
                    {key: '', text: "API 호출 기반 캠페인"},
                    {key: '', text: "Canvas 시나리오 캠페인"},
                ],
                segmentTypeDDLB: [
                    {key: 'base', text: "기준"},
                    {key: 'and', text: "And"},
                    {key: 'or', text: "Or"}
                ],
                attributeTypeDDLB: [
                    {key: 'prodId', text: "상품코드"},
                    {key: 'cartDate', text: "장바구니 담긴 일자"},
                    {key: 'customerStataus', text: "고객상태"},
                ],
                operatorTypeDDLB: [
                    {key: 'equal', text: "="},
                    {key: 'between', text: "Between"},
                    {key: 'big', text: "크다"},
                    {key: 'small', text: "작다"},
                ],
                unitTypeDDLB: [
                    {key: 'daily', text: "일단위"},
                    {key: 'weekly', text: "주단위"},
                    {key: 'monthly', text: "월단위"}
                ],
                actionTypeDDLB: [
                    {key: 'one', text: "상품 상세페이지 진입시"},
                    {key: '', text: "장바구니 추가 눌렀을시"},
                    {key: '', text: "결제 버튼 눌렀을 시"},
                    {key: '', text: "로그인 했을 때"},
                    {key: '', text: "로그아웃 버튼 클릭시"},
                ],
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
                segList: [
                    {seq: 1, type: 'base', segment: '장바구니에 담고 구매 안한 고객', filter: "2건 적용됨", count: "1,240,000명"},
                    {seq: 2, type: 'and', segment: '고객 상태가 정상인 세그먼트', filter: "1건 적용됨", count: "1,000,000명"},
                    {seq: 3, type: 'and', segment: '카카오톡 수신 동의한 고객', filter: "적용 안됨", count: "500,000명"},
                ],
                filterList: [
                    {
                        key: 1,
                        filter: [
                            {attribute: "prodId", operator: "equal", value1: "다운자켓", value2: ''},
                            {attribute: "cartDate", operator: "between", value1: "2023-02-07", value2: '2023-02-10'},
                        ]
                    },
                    {
                        key: 2,
                        filter: [
                            {attribute: "customerStatus", operator: "equal", value1: "정상", value2: ''}
                        ]
                    }
                ],
                currentfilter: [],
                respn_start_date: moment().toDate(),
                respn_end_date: moment(new Date(), "DD-MM-YYYY").add(14, 'days').toDate(),
                selectCampType: '',
                scheduleType: '',
                send_datetime: moment().format('YYYY-MM-DD HH:mm'),
                actionAttributeList: [
                    {attribute: '상품유형', value: "여성 상의"},
                    {attribute: '상품ID', value: "ZZZ1223333"}
                ],
                msgType: '',
                camlist: [
                    {
                        name: '[신규] 첫 로그인 쿠폰 미사용 안내(첫 구매 유도)',
                        status: '실행중',
                        type: '유저액션 캠페인',
                        send: '',
                        segment: '알림톡발송가능고객'
                    },
                    {
                        name: '[신규] 첫 구매 감사쿠폰 미사용 안내(재구매 유도)',
                        status: '실행중',
                        type: '유저액션 캠페인',
                        send: '',
                        segment: '알림톡발송가능고객'
                    },
                    {
                        name: '[고객유지] 이탈고객 관리 (마지막 앱 실행 30일 이상)',
                        status: '대기',
                        type: '스케쥴 캠페인',
                        send: '매주 월요일 8~9시',
                        segment: ''
                    },
                    {
                        name: '[구매전환] 장바구니 상품 구매 전환_구매전환X',
                        status: '실행중',
                        type: '유저액션 캠페인',
                        send: '',
                        segment: '푸시수신동의고객'
                    },
                    {name: '[구매전환] 최근 본 상품 구매 전환', status: '실행중', type: '유저액션 캠페인', send: '', segment: '푸시수신동의고객'},
                    {
                        name: '[고객유지] 등급 안내',
                        status: '실행중',
                        type: '스케쥴 캠페인',
                        send: '매월 1일 오전 10시',
                        segment: '등급(브론즈/실버/골드/VIP)이 있는 유저'
                    },
                    {name: '[고객유지] 생일 쿠폰 발급', status: '대기', type: '스케쥴 캠페인', send: '', segment: '당일 생일을 맞은 유저'},
                    {name: '[고객유지] 출석체크 유도', status: '중단', type: '스케쥴 캠페인', send: '매월 1일 오후1시', segment: '푸시수신동의고객'},
                    {
                        name: '[구매전환] 장바구니 상품 구매 전환_가격다운',
                        status: '실행중',
                        type: 'API 호출 기반 캠페인',
                        send: '',
                        segment: '푸시수신동의고객'
                    }
                ],
                seglist: [
                    {name: '장바구니 상품 가격 다운 대상자', status: 'RELE', type: 'S3 파일', refresh: '2023-02-07 01:00:00'},
                    {
                        name: 'Braze 고객 증분 및 변경 attribute 업로드 실행파일',
                        status: 'RELE',
                        type: 'S3 파일',
                        refresh: '2023-02-07 01:00:00'
                    },
                    {
                        name: 'Braze 유저별 브랜드 총 매출 attribute 업로드 실행파일',
                        status: 'RELE',
                        type: 'S3 파일',
                        refresh: '2023-02-07 01:00:00'
                    },
                    {
                        name: "Braze '주문 Canceled' event 업로드 실행파일",
                        status: 'RELE',
                        type: 'S3 파일',
                        refresh: '2023-02-07 01:00:00'
                    },
                    {
                        name: "Braze '쿠폰 Issued' event 업로드 실행파일",
                        status: 'RELE',
                        type: 'S3 파일',
                        refresh: '2023-02-07 01:00:00'
                    },
                    {
                        name: "Braze '배송 Completed' event 업로드 실행파일",
                        status: 'RELE',
                        type: 'S3 파일',
                        refresh: '2023-02-07 01:00:00'
                    },
                    {name: "Braze Purchase 업로드 실행파일", status: 'RELE', type: 'S3 파일', refresh: '2023-02-07 01:00:00'},
                    {
                        name: "Braze '상품평 Added' event 업로드 실행파일",
                        status: 'RELE',
                        type: 'S3 파일',
                        refresh: '2023-02-07 01:00:00'
                    },
                    {name: "", status: 'RELE', type: 'S3 파일', refresh: '2023-02-07 01:00:00'},
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

                //캠페인 생성/상세 정보 Json
                campaign: {
                    basicInfo: {
                        id: "",
                        startDate: moment(new Date(), "YYYY-MM-DD").add(1, 'days').toDate(),
                        endDate: moment(new Date(), "YYYY-MM-DD").add(14, 'days').toDate(),
                        name: "",
                        desc: "",
                        createBy: '',
                        createDatetime: '',
                        modifyBy: '',
                        modifyDatetime: ''
                    },
                    typeInfo: {
                        type: "schedule",
                        detailType: "cycle",
                        cycleType: "daily",
                        cyclePeriod: "1",
                        sendDatetime: moment(new Date()).add(1, 'days').format('YYYY-MM-DD HH:mm')
                    }

                },
                segment: {
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
                        type: "AWSS3TOBRAZE",
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


            };

            var oModel = new JSONModel(data);
            this.getView().setModel(oModel);
            this.getView().bindElement("/member");


            // set device model
            var oDeviceModel = new JSONModel(Device);
            oDeviceModel.setDefaultBindingMode("OneWay");
            this.getView().setModel(oDeviceModel, "device");

            // this.getCompanyList();
        },
        onTest(event) {
            debugger;
        },
        getCompanyList() {
            var that = this;
            $.ajax({
                type: "get",
                url: "../sql/ajax.eland.php",
                data: {
                    action: "company_list_select"
                },
                cache: false,
                async: true,
                dataType: "json",
                success: function (result) {
                    that.getView().getModel().setProperty("/companyList", result)
                },
                error: function (data) {
                    console.log(data.error().responseText);
                }
            });
        },
        onCompanyChange(event) {
            var that = this;
            $.ajax({
                type: "get",
                url: "../sql/ajax.lfpd.php",
                data: {
                    action: "company_change",
                    company: event.getSource().getBindingContext().getProperty("mb_company_id")
                },
                cache: false,
                async: true,
                dataType: "json",
                success: function (result) {
                    that.onGotoHome();
                },
                error: function (data) {
                    console.log(data.error().responseText);
                }
            });
        },
        goToPage: function (page) {
            var navCon = this.byId("navCon");
            var target = page;
            if (target === 'back') {
                navCon.back();
            } else if (target) {
                var animation = 'fade';
                navCon.to(this.byId(target), animation);
            }
        },
        goToBack: function (event) {
            sap.ui.getCore().byId("__xmlview2").byId("idIconTabBar").setSelectedKey("basicInfo")
            sap.ui.getCore().byId("__xmlview2").getController().setIniModel();
            sap.ui.getCore().byId("__xmlview1").getController().onSearchCampaign();
            this.goToPage('back');
        },
        navigate: function (event) {
            // debugger;
            // this.getView().addEventDelegate({
            //     'onBeforeShow': this.beforeShow(data)
            // });
        },
        afterNavigate: function (event) {
            // debugger;
        },
        onUserNamePress: function (oEvent) {
            var mb_id = this.getView().getModel().getProperty('/member/mb_id');
            if (mb_id === '') {
                sap.m.URLHelper.redirect('/bbs/login.php?url=' + encodeURI('/index.php'), false);
                return;
            }

            var logout = function (oEvent) {
                sap.m.URLHelper.redirect(encodeURI('/bbs/logout_lfpd.php'), false);
            };
            var oActionSheet = new ActionSheet(this.getView().createId("userMessageActionSheet"), {
                title: '',
                showCancelButton: false,
                buttons: [
                    new Button({
                        text: 'Logout',
                        type: 'Transparent',
                        press: logout
                    })
                ],
                afterClose: function () {
                    oActionSheet.destroy();
                }
            });
            oActionSheet.openBy(oEvent.getSource());
        },
        onGoToSegment: function (event) {
            sap.m.URLHelper.redirect("/eland/segment/index.php", false);
        },
        onGotoHome: function (event) {
            sap.m.URLHelper.redirect("/LFPD/admin/index.php", false);
        },
        onGoToCampaign: function (event) {
            sap.m.URLHelper.redirect("/eland/campaign/index.php", false);
        },
        onGoToAdmin: function (event) {
            sap.m.URLHelper.redirect("/eland/admin/index.php", false);
        },
        onGoToReport: function (reportId) {
            sap.m.URLHelper.redirect("/eland/report/" + reportId + "/index.php", false);
        },
        onCollapseExpandPress: function () {
            var oSideNavigation = this.byId("sideNavigation");
            var bExpanded = oSideNavigation.getExpanded();

            oSideNavigation.setExpanded(!bExpanded);
        },
        handleNav: function (target) {
            var navCon = this.byId("navCon");
            if (target) {

                this.initSelectDataByPage(target);

                var animation = "Fade";
                navCon.to(this.byId(target), animation);
            } else {
                navCon.back();
            }
        },
        onGoToGoogleStudioLL: function (reportId) {
            sap.m.URLHelper.redirect("https://datastudio.google.com/u/0/reporting/aa50a00d-d136-4658-9e48-e625bc24440b/page/p_3crw22qbuc/edit", true);
        },
        onGoToGoogleStudioRM: function (reportId) {
            sap.m.URLHelper.redirect("https://datastudio.google.com/s/nh6DFuea8I0", true);
        },
        initSelectDataByPage(target) {
            switch (target) {
                case 'navCustomKeywordManage': //사용자 지정 키워드 관리
                    break;
                case 'navSynonymManage': // 동의어 관리
                    this.getView().byId(target).getContent()[0].getController().getRepKeyword();
                    break;
                case 'navThemeManage': // 테마 관리
                    this.getView().byId(target).getContent()[0].getController().getThemeList();
                    this.getView().byId(target).getContent()[0].getController().getCustomKeyword();
                    this.getView().byId(target).getContent()[0].getController().getThemeKeyword();
                    break;
                case 'navRelKeywordCollectManage': // 연관 키워드 수집 관리
                    this.getView().byId(target).getContent()[0].getController().getRelKeyword();
                    break;
                case 'navDontUseKeywordManage': // 불용어 관리
                    this.getView().byId(target).getContent()[0].getController().getDontUseKeyword();
                    break;
            }
        },
        onDownloadManual() {
            var element = document.createElement('a');
            element.setAttribute('href', "/LFPD/manual/리복_키워드관리도구 사용자매뉴얼_이노플제공.pdf");
            element.setAttribute('download', "리복_키워드관리도구 사용자매뉴얼_이노플제공.pdf");
            element.setAttribute('target', "_blank");

            element.style.display = 'none';
            document.body.appendChild(element);

            element.click();

            document.body.removeChild(element);
        },
        onSideNavButtonPress: function () {
            var oToolPage = this.byId("app");
            oToolPage.setSideExpanded(!oToolPage.getSideExpanded());
        },
        onMenuSelect(event) {
            var navCon = this.byId("navCon");
            var target = event.getParameter("item").getBindingContext().getProperty("key");
            if (target) {
                var animation = "Fade";
                navCon.to(this.byId(target), animation);
            } else {
                navCon.back();
            }
        },
        onCampaignTypeClick(event) {
            var id = this.byId("campTypeRadio").getSelectedButton().sId.split("--")[1];
            this.getView().getModel().setProperty("/selectCampType", id);

        },
        onScheduelTypeClick(event) {
            var id = this.byId("scheduleType").getSelectedButton().sId.split("--")[1];
            this.getView().getModel().setProperty("/scheduleType", id);
        },
        onCreateFinalUrl(event) {
            this.byId("finalUrl").setValue(
                "https://minicrmdev.eland.co.kr" +
                event.getParameter("newValue")
            )
        },
        onMsgTypeClick(event) {
            var id = this.byId("msgTypeRadio").getSelectedButton().sId.split("--")[1];
            this.getView().getModel().setProperty("/msgType", id);
        },
        onCampaignClick(event) {
            debugger;
            var data = this.getModel("/");
            this.getRouter().navTo("campaignCreate", {}, true);
        },
        onSegmentClick(event) {
            var navCon = this.getView().byId("navCon");
            var target = 'segmentCreate;'
            if (target) {
                var animation = "Fade";
                navCon.to(this.getView().byId("segmentCreate"), animation);
            } else {
                navCon.back();
            }
        },
        onSegTypeClick(event) {
            var id = this.byId("segRadio").getSelectedButton().sId.split("--")[1];
            this.getView().getModel().setProperty("/segment/typeInfo/type", id);
        },
        onConnectTest() {
            MessageToast.show("정상적으로 연결 되었습니다.")
        },
        onFileExistTest() {
            MessageToast.show("정상적으로 확인 되었습니다.")
        },
        onCampaignExecute() {
            console.log(JSON.stringify(this.getView().getModel().getProperty("/campaign")))

            var data = this.getView().getModel().getProperty("/campaign");
            data.basicInfo.startDate = moment(data.basicInfo.startDate).format('YYYY-MM-DD');
            data.basicInfo.endDate = moment(data.basicInfo.endDate).format('YYYY-MM-DD');

            var that = this;
            $.ajax({
                type: "post",
                url: "/campaign/create.do",
                data: JSON.stringify(data),
                cache: false,
                async: true,
                headers: {
                    "Content-Type": "application/json"
                },
                success: function (result) {
                    console.log(result);
                    MessageToast.show(result.resultMsg);
                },
                error: function (data) {
                    console.log(data);
                }
            });
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
                    console.log(result);
                    MessageToast.show(result.resultMsg);
                },
                error: function (data) {
                    console.log(data);
                }
            });
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
        }

    });
});

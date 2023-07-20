<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html style="height: 100%; ">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="cache-control" content="no-store"/>

    <link rel="stylesheet" href="/nocode/css/style.css">
    <link rel="stylesheet" href="/nocode/css/PanelStyle.css">

    <title>nocode</title>

    <script src="/webjars/momentjs/2.29.4/min/moment.min.js"></script>

    <script>
        window["sap-ui-config"] = {
            resourceRoots: {
                // "": "/webjars/openui5/1.96.3/resources", // <-- new base URL
            }
        };
    </script>


    <script id="sap-ui-bootstrap"
            src="/webjars/openui5/1.96.3/resources/sap-ui-core.js"
            data-sap-ui-theme="sap_belize_plus"
            data-sap-ui-libs="sap.m"
            data-sap-ui-compatVersion="edge"
            data-sap-ui-async="true"
            data-sap-ui-onInit="module:sap/ui/nocode/index"
            data-sap-ui-resourceroots='{
				"sap/ui/nocode": "./nocode"
		}'>
    </script>

</head>

<body class="sapUiBody" id="content">
</body>

</html>
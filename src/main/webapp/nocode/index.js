sap.ui.define([
    "sap/ui/core/ComponentContainer"
], function(ComponentContainer) {
    "use strict";

    new ComponentContainer({
        name: "sap.ui.nocode",
        settings : {
            id : "nocode"
        },
        async: true
    }).placeAt("content");

});
var browser;

// Displays the share view window
function copyViewUrl() {
    var url = window.location;
    var w = window.open("", "", "width=800, height=400, left=200, top=200");
    w.document.write("Copy the following url<hr />");
    w.document.write("<TEXTAREA cols=80 rows=15 readonly style='border:1px solid black'>");
    w.document.write(url);
    w.document.write("</TEXTAREA>");

    var mailBody = url;
    var content = new Array()
    content[0] = "mailto:"
    content[1] = "&body="
    content[2] = encodeURIComponent(mailBody);
    content = content.join("");
    w.document.write("<p><A href='" + content + "'>Mail</A></p>&nbsp;");
}

function reloadView() {
    showProgressPanel();
    window.location.reload();
}

function navigateUrl(url) {
    showProgressPanel();
    document.location.href = url;
}

function getElement(elementId) {
    return $(parent.parent.parent.document).find('#'+elementId);
}

function hideProgressPanel() {
    getElement('progressPanel').hide();
}

function showProgressPanel() {
    getElement('progressPanel').show();
}

function hideDatePicker() {
    getElement('fromToDatePick').hide();
}

function showDatePicker() {
    getElement('fromToDatePick').show();
}

function showHideTimeFilter(show) {
    if (show) {
        getElement('fromToDatePick').show();
    }
    else {
        getElement('fromToDatePick').hide();
    }
}

// Detects browser
function detectBrowser() {
    if (navigator.userAgent.search("MSIE") >= 0) {
        browser = "IE";
    }
    else if (navigator.userAgent.search("Chrome") >= 0) {
        browser = "CHROME";
    }
    else if (navigator.userAgent.search("Firefox") >= 0) {
        browser = "FIREFOX";
    }
}

function displayMessageWindow() {
    if ($("#messageWindow").length) {
        var window = $("#messageWindow");
        window.kendoWindow({
            position: {
                top: 10,
                left: 100
            },
            width: "1000px",
            height: "400px",
            title: "Important",
            actions: ["Close"],
            iframe: true
        });

        window.data("kendoWindow").open();
    }
}

function displayWindow(url, width, height) {
    //var window = $("#dialog");
    //window.kendoWindow({
    //    position: {
    //        top: 10,
    //        left: 10
    //    },
    //    width: width,
    //    height: height,
    //    title: "Press ESC to close this window",
    //    actions: ["Close"],
    //    content: url,
    //    iframe: true
    //});

    //window.data("kendoWindow").open();
    var w = window.open(url, "", "width=" + width + ", height=" + height + ", left=10, top=10, scrollbars=yes");
}


{% autoescape true %}
var root;
var Captchalert;
root = this;
function humanFileSize(f) {
    var c, d, e, b;
    d = new Array("B", "KiB", "MiB", "GiB", "TiB", "PiB");
    b = Math.log(f) / Math.log(1024);
    e = Math.floor(b);
    c = Math.pow(1024, e);
    if (f === 0) {
        return "0 B";
    } else {
        return Math.round(f * 100 / c) / 100 + " " + d[e];
    }
};
function parseUri() {
    var b, c, g, e, d, f, a;
    b = $("add_links").value;
    g = new RegExp("(ht|f)tp(s?)://[a-zA-Z0-9-./?=_&%#]+[<| |\"|'|\r|\n|\t]{1}", "g");
    d = b.match(g);
    if (d === null) {
        return;
    }
    e = "";
    for (f = 0, a = d.length; f < a; f++) {
        c = d[f];
        if (c.indexOf(" ") !== -1) {
            e = e + c.replace(" ", " \n");
        } else {
            if (c.indexOf("\t") !== -1) {
                e = e + c.replace("\t", " \n");
            } else {
                if (c.indexOf("\r") !== -1) {
                    e = e + c.replace("\r", " \n");
                } else {
                    if (c.indexOf('"') !== -1) {
                        e = e + c.replace('"', " \n");
                    } else {
                        if (c.indexOf("<") !== -1) {
                            e = e + c.replace("<", " \n");
                        } else {
                            if (c.indexOf("'") !== -1) {
                                e = e + c.replace("'", " \n");
                            } else {
                                e = e + c.replace("\n", " \n");
                            }
                        }
                    }
                }
            }
        }
    }
    return $("add_links").value = e
};
Array.prototype.remove = function(d, c) {
    var a, b;
    a = this.slice((c || d) + 1 || this.length);
    this.length = (b = d < 0) != null ? b : this.length + {
        from: d
    };
    if (this.length === 0) {
        return [];
    }
    return this.push.apply(this, a);
};
document.addEvent("domready", function() {
    root.notify = new Purr({
        mode: "top",
        position: "center"
    });
    $("add_form").onsubmit = function() {
        if ($("add_name").value === "" && $("add_file").value === "") {
            alert('{{_("Please Enter a packagename.")}}');
            return false;
        } else {
                    formData = new FormData(document.getElementById('add_form'));
                    var request = new XMLHttpRequest();
                    request.open("POST", "/json/add_package");
                    request.send(formData);
            // ToDo not 100% okay, afterwards double click is necessary
            $$('#add_box')[0].hide();
            return false;
        }
    };
    $("action_add").addEvent("click", function() {
        $("add_form").reset();
    });
    $("action_play").addEvent("click", function() {
        return new Request({
            method: "get",
            url: "/api/unpauseServer"
        }).send();
    });
    $("action_cancel").addEvent("click", function() {
        return new Request({
            method: "get",
            url: "/api/stopAllDownloads"
        }).send();
    });
    $("action_stop").addEvent("click", function() {
        return new Request({
            method: "get",
            url: "/api/pauseServer"
        }).send();
    });
    $("cap_info").addEvent("click", function() {
        Captchalert.hidden=true;
        load_captcha("get", "");
    });
    $("cap_form").addEvent("submit", function(a) {
        submit_captcha();
        return a.stop();
    });
    $("cap_positional").addEvent("click", on_captcha_click);
    return new Request.JSON({
        url: "/json/status",
        onSuccess: LoadJsonToContent,
        secure: false,
        async: true,
        initialDelay: 0,
        delay: 4000,
        limit: 3000
    }).startTimer();
});
function LoadJsonToContent(a) {
    $("speed").set("text", humanFileSize(a.speed) + "/s");
    $("aktiv").set("text", a.active);
    $("aktiv_from").set("text", a.queue);
    $("aktiv_total").set("text", a.total);
    if (a.captcha) {
        if ($("cap_info").getStyle("display") !== "inline") {
            $("cap_info").setStyle("display", "inline");
            Captchalert=root.notify.alert('{{_("New Captcha Request")}}', {
                className: "notify"
            });
        }
    } else {
        $("cap_info").setStyle("display", "none");
    }
    if (a.download) {
        $("time").set("text", ' {{_("on")}}');
        $("time").setStyle("background-color", "#5cb85c");
    } else {
        $("time").set("text", ' {{_("off")}}');
        $("time").setStyle("background-color", "#d9534f");
    }
    if (a.reconnect) {
        $("reconnect").set("text", ' {{_("on")}}');
        $("reconnect").setStyle("background-color", "#5cb85c");
    } else {
        $("reconnect").set("text", ' {{_("off")}}');
        $("reconnect").setStyle("background-color", "#d9534f");
    }
    return null
};
function set_captcha(a) {
    $("cap_id").set("value", a.id);
    if (a.result_type === "textual") {
        $("cap_textual_img").set("src", a.src);
        $("cap_submit").setStyle("display", "inline");
        $("cap_title").set("text", '');
        $("cap_textual").setStyle("display", "block");
        return $("cap_positional").setStyle("display", "none");
    } else {
        if (a.result_type === "positional") {
            $("cap_positional_img").set("src", a.src);
            $("cap_title").set("text", '{{_("Please click on the right captcha position.")}}');
            $("cap_submit").setStyle("display", "none");
            return $("cap_textual").setStyle("display", "none");
        }
    }
};
function load_captcha(b, a) {
    return new Request.JSON({
        url: "/json/set_captcha",
        onSuccess: function(c) {
            set_captcha(c);
            return (c.captcha ? void 0 : clear_captcha());
        },
        secure: false,
        async: true,
        method: b
    }).send(a)
};

function clear_captcha() {
    $("cap_textual").setStyle("display", "none");
    $("cap_textual_img").set("src", "");
    $("cap_positional").setStyle("display", "none");
    $("cap_positional_img").set("src", "");
    $("cap_submit").setStyle("display", "none");
    $("cap_title").set("text", '{{_("No Captchas to read.")}}');
};
function submit_captcha() {
    load_captcha("post", "cap_id=" + $("cap_id").get("value") + "&cap_result=" + $("cap_result").get("value"));
    $("cap_result").set("value", "");
    return false;
};
function on_captcha_click(c) {
    var b, a, d;
    b = c.target.getPosition();
    a = (c.page.x - b.x).toFixed(0);
    d = (c.page.y - b.y).toFixed(0);
    $("cap_result").value = a + "," + d;
    return submit_captcha();
}; 
{% endautoescape %}
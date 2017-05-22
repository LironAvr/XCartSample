//! Likely 2.1.0 by Ilya Birman (ilyabirman.net)
//! Rewritten sans jQuery by Evgeny Steblinsky (volter9.github.io)
//! Supported by Ivan Akulov (iamakulov.com), Viktor Karpov (vitkarpov.com), and contributors
//! Inspired by Social Likes by Artem Sapegin (sapegin.me)

!function t(e, i, n) {
  function r(c, s) {
    if (!i[c]) {
      if (!e[c]) {
        var u = "function" == typeof require && require;
        if (!s && u)return u(c, !0);
        if (o)return o(c, !0);
        throw new Error("Cannot find module '" + c + "'")
      }
      var a = i[c] = {exports: {}};
      e[c][0].call(a.exports, function (t) {
        var i = e[c][1][t];
        return r(i ? i : t)
      }, a, a.exports, t, e, i, n)
    }
    return i[c].exports
  }

  for (var o = "function" == typeof require && require, c = 0; c < n.length; c++)r(n[c]);
  return r
}({
  1: [function (t, e, i) {
    "use strict";
    function n(t, e, i) {
      this.widget = t, this.likely = e, this.options = s.merge(i), this.init()
    }

    var r = t("./services"), o = t("./config"), c = t("./fetch"), s = t("./utils"), u = t("./dom"), a = '<span class="{className}">{content}</span>';
    n.prototype = {
      init: function () {
        this.detectService(), this.detectParams(), this.service && (this.initHtml(), setTimeout(this.initCounter.bind(this), 0))
      }, update: function (t) {
        var e = "." + o.prefix + "counter", i = u.findAll(e, this.widget);
        s.extend(this.options, s.merge({forceUpdate: !1}, t)), s.toArray(i).forEach(function (t) {
          t.parentNode.removeChild(t)
        }), this.initCounter()
      }, detectService: function () {
        var t = this.widget, e = s.getDataset(t).service;
        e || (e = Object.keys(r).filter(function (e) {
          return t.classList.contains(e)
        })[0]), e && (this.service = e, s.extend(this.options, r[e]))
      }, detectParams: function () {
        var t = this.options, e = s.getDataset(this.widget);
        if (e.counter) {
          var i = parseInt(e.counter, 10);
          isNaN(i) ? t.counterUrl = e.counter : t.counterNumber = i
        }
        t.title = e.title || t.title, t.url = e.url || t.url
      }, initHtml: function () {
        var t = this.options, e = this.widget, i = e.innerHTML;
        e.addEventListener("click", this.click.bind(this)), e.classList.remove(this.service), e.className += " " + this.className("widget");
        var n = s.template(a, {
          className: this.className("button"),
          content: i
        }), r = s.template(a, {className: this.className("icon"), content: u.wrapSVG(t.svgi)});
        e.innerHTML = r + n
      }, initCounter: function () {
        var t = this.options;
        t.counters && t.counterNumber ? this.updateCounter(t.counterNumber) : t.counterUrl && c(this.service, t.url, t)(this.updateCounter.bind(this))
      }, className: function (t) {
        var e = o.prefix + t;
        return e + " " + e + "_" + this.service
      }, updateCounter: function (t) {
        var e = parseInt(t, 10) || 0, i = u.find("." + o.name + "__counter", this.widget);
        i && i.parentNode.removeChild(i);
        var n = {className: this.className("counter"), content: e};
        e || this.options.zeroes || (n.className += " " + o.prefix + "counter_empty", n.content = ""), this.widget.appendChild(u.createNode(s.template(a, n))), this.likely.updateCounter(this.service, e)
      }, click: function () {
        var t = this.options;
        if (t.click.call(this)) {
          var e = s.makeUrl(t.popupUrl, {url: t.url, title: t.title});
          u.openPopup(this.addAdditionalParamsToUrl(e), o.prefix + this.service, t.popupWidth, t.popupHeight)
        }
        return !1
      }, addAdditionalParamsToUrl: function (t) {
        var e = s.query(s.merge(this.widget.dataset, this.options.data)), i = -1 === t.indexOf("?") ? "?" : "&";
        return "" === e ? t : t + i + e
      }
    }, e.exports = n
  }, {"./config": 2, "./dom": 3, "./fetch": 6, "./services": 11, "./utils": 18}], 2: [function (t, e, i) {
    "use strict";
    var n = "https:" === window.location.protocol;
    e.exports = {name: "likely", prefix: "likely__", secure: n, protocol: n ? "https:" : "http:"}
  }, {}], 3: [function (t, e, i) {
    "use strict";
    var n = document.createElement("div"), r = 0, o = e.exports = {
      wrapSVG: function (t) {
        return '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16"><path d="M' + t + 'z"/></svg>'
      }, createNode: function (t) {
        return n.innerHTML = t, n.children[0]
      }, getScript: function (t) {
        var e = document.createElement("script"), i = document.head;
        e.type = "text/javascript", e.src = t, i.appendChild(e), i.removeChild(e)
      }, getJSON: function (t, e) {
        var i = encodeURIComponent("random_fun_" + ++r), n = t.replace(/callback=(\?)/, "callback=" + i);
        window[i] = e, o.getScript(n)
      }, find: function (t, e) {
        return (e || document).querySelector(t)
      }, findAll: function (t, e) {
        return (e || document).querySelectorAll(t)
      }, openPopup: function (t, e, i, n) {
        var r = Math.round(screen.width / 2 - i / 2), o = 0;
        screen.height > n && (o = Math.round(screen.height / 3 - n / 2));
        var c = "left=" + r + ",top=" + o + ",width=" + i + ",height=" + n + ",personalbar=0,toolbar=0,scrollbars=1,resizable=1", s = window.open(t, e, c);
        return s ? (s.focus(), s) : (location.href = t, null)
      }
    }
  }, {}], 4: [function (t, e, i) {
    "use strict";
    e.exports = function (t) {
      var e = [];
      return function (i) {
        var n = typeof i;
        return "undefined" === n ? t : void("function" === n ? e.push(i) : (t = i, e.forEach(function (t) {
          t(i)
        })))
      }
    }
  }, {}], 5: [function (t, e, i) {
    "use strict";
    var n = t("./index.js");
    window.likely = n, window.addEventListener("load", n.initiate)
  }, {"./index.js": 7}], 6: [function (t, e, i) {
    "use strict";
    var n = t("./services"), r = t("./factory"), o = t("./utils"), c = {};
    e.exports = function (t, e, i) {
      c[t] || (c[t] = {});
      var s = c[t], u = s[e];
      if (!i.forceUpdate && u)return u;
      u = r();
      var a = o.makeUrl(i.counterUrl, {url: e});
      return n[t].counter(a, u, e), s[e] = u, u
    }
  }, {"./factory": 4, "./services": 11, "./utils": 18}], 7: [function (t, e, i) {
    "use strict";
    var n = t("./widget"), r = t("./config"), o = t("./utils"), c = t("./dom"), s = function (t, e) {
      var i = e || {}, c = t[r.name];
      return c ? c.update(i) : t[r.name] = new n(t, o.merge({}, s.defaults, i, o.bools(t))), c
    };
    s.initiate = s.initate = function () {
      var t = c.findAll("." + r.name);
      o.toArray(t).forEach(function (t) {
        s(t)
      })
    }, s.defaults = {
      counters: !0,
      timeout: 1e3,
      zeroes: !1,
      title: document.title,
      wait: 500,
      url: o.getDefaultUrl()
    }, e.exports = s
  }, {"./config": 2, "./dom": 3, "./utils": 18, "./widget": 19}], 8: [function (t, e, i) {
    "use strict";
    var n = t("./dom"), r = function (t, e) {
      var i = this;
      n.getJSON(t, function (t) {
        try {
          var n = "function" == typeof i.convertNumber ? i.convertNumber(t) : t;
          e(n)
        } catch (r) {
        }
      })
    };
    e.exports = function (t) {
      t.counter = t.counter || r, t.click = t.click || function () {
          return !0
        }
    }
  }, {"./dom": 3}], 9: [function (t, e, i) {
    "use strict";
    e.exports = {
      counterUrl: "https://graph.facebook.com/fql?q=SELECT+total_count+FROM+link_stat+WHERE+url%3D%22{url}%22&callback=?",
      convertNumber: function (t) {
        return t.data[0].total_count
      },
      popupUrl: "https://www.facebook.com/sharer/sharer.php?u={url}",
      popupWidth: 600,
      popupHeight: 500
    }
  }, {}], 10: [function (t, e, i) {
    "use strict";
    var n = {
      counterUrl: "https://share.yandex.net/counter/gpp/?url={url}&callback=?",
      gid: 0,
      promises: {},
      popupUrl: "https://plus.google.com/share?url={url}",
      popupWidth: 700,
      popupHeight: 500
    };
    e.exports = n
  }, {}], 11: [function (t, e, i) {
    "use strict";
    var n = t("../service"), r = t("../utils"), o = t("../svg.js"), c = {
      odnoklassniki: t("./odnoklassniki"),
      vkontakte: t("./vk"),
      pinterest: t("./pinterest"),
      facebook: t("./facebook"),
      twitter: t("./twitter"),
      gplus: t("./gplus"),
      telegram: t("./telegram")
    };
    r.each(c, function (t, e) {
      n(t), t.svgi = o[e], t.name = e
    }), e.exports = c
  }, {
    "../service": 8,
    "../svg.js": 17,
    "../utils": 18,
    "./facebook": 9,
    "./gplus": 10,
    "./odnoklassniki": 12,
    "./pinterest": 13,
    "./telegram": 14,
    "./twitter": 15,
    "./vk": 16
  }], 12: [function (t, e, i) {
    "use strict";
    var n = t("../config"), r = t("../utils"), o = t("../dom"), c = {
      counterUrl: n.protocol + "//connect.ok.ru/dk?st.cmd=extLike&ref={url}&uid={index}",
      counter: function (t, e) {
        this.promises.push(e), o.getScript(r.makeUrl(t, {index: this.promises.length - 1}))
      },
      promises: [],
      popupUrl: n.protocol + "//connect.ok.ru/dk?st.cmd=WidgetSharePreview&service=odnoklassniki&st.shareUrl={url}",
      popupWidth: 640,
      popupHeight: 400
    };
    r.set(window, "ODKL.updateCount", function (t, e) {
      c.promises[t](e)
    }), e.exports = c
  }, {"../config": 2, "../dom": 3, "../utils": 18}], 13: [function (t, e, i) {
    "use strict";
    var n = t("../config");
    e.exports = {
      counterUrl: n.protocol + "//api.pinterest.com/v1/urls/count.json?url={url}&callback=?",
      convertNumber: function (t) {
        return t.count
      },
      popupUrl: n.protocol + "//pinterest.com/pin/create/button/?url={url}&description={title}",
      popupWidth: 630,
      popupHeight: 270
    }
  }, {"../config": 2}], 14: [function (t, e, i) {
    "use strict";
    e.exports = {popupUrl: "https://telegram.me/share/url?url={url}", popupWidth: 600, popupHeight: 500}
  }, {}], 15: [function (t, e, i) {
    "use strict";
    e.exports = {
      popupUrl: "https://twitter.com/intent/tweet?url={url}&text={title}",
      popupWidth: 600,
      popupHeight: 450,
      click: function () {
        return /[\.\?:\-–—]\s*$/.test(this.options.title) || (this.options.title += ":"), !0
      }
    }
  }, {}], 16: [function (t, e, i) {
    "use strict";
    var n = t("../config"), r = t("../utils"), o = t("../dom"), c = {
      counterUrl: "https://vk.com/share.php?act=count&url={url}&index={index}",
      counter: function (t, e) {
        this.promises.push(e), o.getScript(r.makeUrl(t, {index: this.promises.length - 1}))
      },
      promises: [],
      popupUrl: n.protocol + "//vk.com/share.php?url={url}&title={title}",
      popupWidth: 550,
      popupHeight: 330
    };
    r.set(window, "VK.Share.count", function (t, e) {
      c.promises[t](e)
    }), e.exports = c
  }, {"../config": 2, "../dom": 3, "../utils": 18}], 17: [function (t, e, i) {
    "use strict";
    e.exports = {
      facebook: "13 0H3C1 0 0 1 0 3v10c0 2 1 3 3 3h5V9H6V7h2V5c0-2 2-2 2-2h3v2h-3v2h3l-.5 2H10v7h3c2 0 3-1 3-3V3c0-2-1-3-3-3",
      twitter: "15.96 3.42c-.04.153-.144.31-.237.414l-.118.058v.118l-.59.532-.237.295c-.05.036-.398.21-.413.237V6.49h-.06v.473h-.058v.294h-.058v.296h-.06v.235h-.06v.237h-.058c-.1.355-.197.71-.295 1.064h-.06v.116h-.06c-.02.1-.04.197-.058.296h-.06c-.04.118-.08.237-.118.355h-.06c-.038.118-.078.236-.117.353l-.118.06-.06.235-.117.06v.116l-.118.06v.12h-.06c-.02.057-.038.117-.058.175l-.118.06v.117c-.06.04-.118.08-.177.118v.118l-.237.177v.118l-.59.53-.532.592h-.117c-.06.078-.118.156-.177.236l-.177.06-.06.117h-.118l-.06.118-.176.06v.058h-.118l-.06.118-.353.12-.06.117c-.078.02-.156.04-.235.058v.06c-.118.038-.236.078-.354.118v.058H8.76v.06h-.12v.06h-.176v.058h-.118v.06H8.17v.058H7.99v.06l-.413.058v.06h-.237c-.667.22-1.455.293-2.36.293h-.886v-.058h-.53v-.06H3.27v-.06h-.295v-.06H2.68v-.057h-.177v-.06h-.236v-.058H2.09v-.06h-.177v-.058h-.177v-.06H1.56v-.058h-.12v-.06l-.294-.06v-.057c-.118-.04-.236-.08-.355-.118v-.06H.674v-.058H.555v-.06H.437v-.058H.32l-.06-.12H.142v-.058c-.13-.08-.083.026-.177-.118H1.56v-.06c.294-.04.59-.077.884-.117v-.06h.177v-.058h.237v-.06h.118v-.06h.177v-.057h.118v-.06h.177v-.058l.236-.06v-.058l.236-.06c.02-.038.04-.078.058-.117l.237-.06c.02-.04.04-.077.058-.117h.118l.06-.118h.118c.036-.025.047-.078.118-.118V12.1c-1.02-.08-1.84-.54-2.303-1.183-.08-.058-.157-.118-.236-.176v-.117l-.118-.06v-.117c-.115-.202-.268-.355-.296-.65.453.004.987.008 1.354-.06v-.06c-.254-.008-.47-.08-.65-.175v-.058H2.32v-.06c-.08-.02-.157-.04-.236-.058l-.06-.118h-.117l-.118-.178h-.12c-.077-.098-.156-.196-.235-.294l-.118-.06v-.117l-.177-.12c-.35-.502-.6-1.15-.59-2.006h.06c.204.234.948.377 1.357.415v-.06c-.257-.118-.676-.54-.827-.768V5.9l-.118-.06c-.04-.117-.08-.236-.118-.354h-.06v-.118H.787c-.04-.196-.08-.394-.118-.59-.06-.19-.206-.697-.118-1.005h.06V3.36h.058v-.177h.06v-.177h.057V2.83h.06c.04-.118.078-.236.117-.355h.118v.06c.12.097.237.196.355.295v.118l.118.058c.08.098.157.197.236.295l.176.06.354.413h.118l.177.236h.118l.06.117h.117c.04.06.08.118.118.177h.118l.06.118.235.06.06.117.356.12.06.117.53.176v.06h.118v.058l.236.06v.06c.118.02.236.04.355.058v.06h.177v.058h.177v.06h.176v.058h.236v.06l.472.057v.06l1.417.18v-.237c-.1-.112-.058-.442-.057-.65 0-.573.15-.99.354-1.358v-.117l.118-.06.06-.235.176-.118v-.118c.14-.118.276-.236.414-.355l.06-.117h.117l.12-.177.235-.06.06-.117h.117v-.058H9.7v-.058h.177v-.06h.177v-.058h.177v-.06h.296v-.058h1.063v.058h.294v.06h.177v.058h.178v.06h.177v.058h.118v.06h.118l.06.117c.08.018.158.038.236.058.04.06.08.118.118.177h.118l.06.117c.142.133.193.163.472.178.136-.12.283-.05.472-.118v-.06h.177v-.058h.177v-.06l.236-.058v-.06h.177l.59-.352v.176h-.058l-.06.295h-.058v.117h-.06v.118l-.117.06v.118l-.177.118v.117l-.118.06-.354.412h-.117l-.177.236h.06c.13-.112.402-.053.59-.117l1.063-.353",
      vkontakte: "13 0H3C1 0 0 1 0 3v10c0 2 1 3 3 3h10c2 0 3-1 3-3V3c0-2-1-3-3-3zm.452 11.394l-1.603.022s-.345.068-.8-.243c-.598-.41-1.164-1.48-1.604-1.342-.446.144-.432 1.106-.432 1.106s.003.206-.1.315c-.11.12-.326.144-.326.144H7.87s-1.582.095-2.975-1.356c-1.52-1.583-2.862-4.723-2.862-4.723s-.078-.206.006-.305c.094-.112.35-.12.35-.12l1.716-.01s.162.026.277.11c.095.07.15.202.15.202s.276.7.643 1.335c.716 1.238 1.05 1.508 1.293 1.376.353-.193.247-1.75.247-1.75s.006-.565-.178-.817c-.145-.194-.415-.25-.534-.267-.096-.014.062-.238.267-.338.31-.15.853-.16 1.497-.153.502.004.646.035.842.083.59.143.39.694.39 2.016 0 .422-.075 1.018.23 1.215.13.085.453.013 1.256-1.352.38-.647.666-1.407.666-1.407s.062-.136.16-.194c.098-.06.232-.04.232-.04l1.804-.012s.542-.065.63.18c.092.257-.203.857-.94 1.84-1.21 1.612-1.345 1.46-.34 2.394.96.89 1.16 1.325 1.192 1.38.4.66-.44.71-.44.71",
      gplus: "8,6.5v3h4.291c-0.526,2.01-2.093,3.476-4.315,3.476C5.228,12.976,3,10.748,3,8c0-2.748,2.228-4.976,4.976-4.976c1.442,0,2.606,0.623,3.397,1.603L13.52,2.48C12.192,0.955,10.276,0,8,0C3.582,0,0,3.582,0,8s3.582,8,8,8s7.5-3.582,7.5-8V6.5H8",
      pinterest: "7.99 0c-4.417 0-8 3.582-8 8 0 3.39 2.11 6.284 5.086 7.45-.07-.633-.133-1.604.028-2.295.145-.624.938-3.977.938-3.977s-.24-.48-.24-1.188c0-1.112.645-1.943 1.448-1.943.683 0 1.012.512 1.012 1.127 0 .686-.437 1.713-.663 2.664-.19.796.398 1.446 1.184 1.446 1.422 0 2.515-1.5 2.515-3.664 0-1.915-1.377-3.255-3.343-3.255-2.276 0-3.612 1.707-3.612 3.472 0 .688.265 1.425.595 1.826.065.08.075.15.055.23-.06.252-.195.796-.222.907-.035.146-.116.177-.268.107-1-.465-1.624-1.926-1.624-3.1 0-2.523 1.835-4.84 5.287-4.84 2.775 0 4.932 1.977 4.932 4.62 0 2.757-1.74 4.976-4.152 4.976-.81 0-1.573-.42-1.834-.92l-.498 1.903c-.18.695-.668 1.566-.994 2.097.75.232 1.544.357 2.37.357 4.417 0 8-3.582 8-8s-3.583-8-8-8",
      odnoklassniki: "8 6.107c.888 0 1.607-.72 1.607-1.607 0-.888-.72-1.607-1.607-1.607s-1.607.72-1.607 1.607c0 .888.72 1.607 1.607 1.607zM13 0H3C1 0 0 1 0 3v10c0 2 1 3 3 3h10c2 0 3-1 3-3V3c0-2-1-3-3-3zM8 .75c2.07 0 3.75 1.68 3.75 3.75 0 2.07-1.68 3.75-3.75 3.75S4.25 6.57 4.25 4.5C4.25 2.43 5.93.75 8 .75zm3.826 12.634c.42.42.42 1.097 0 1.515-.21.208-.483.313-.758.313-.274 0-.548-.105-.758-.314L8 12.59 5.69 14.9c-.42.418-1.098.418-1.516 0s-.42-1.098 0-1.516L6.357 11.2c-1.303-.386-2.288-1.073-2.337-1.11-.473-.354-.57-1.025-.214-1.5.354-.47 1.022-.567 1.496-.216.03.022 1.4.946 2.698.946 1.31 0 2.682-.934 2.693-.943.474-.355 1.146-.258 1.5.213.355.474.26 1.146-.214 1.5-.05.036-1.035.723-2.338 1.11l2.184 2.184",
      telegram: "6,11.960784l-1,-3l11,-8l-15.378,5.914c0,0 -0.672,0.23 -0.619,0.655c0.053,0.425 0.602,0.619 0.602,0.619l3.575,1.203l1.62,5.154l2.742,-2.411l-0.007,-0.005l3.607,2.766c0.973,0.425 1.327,-0.46 1.327,-0.46l2.531,-13.435l-10,11z"
    }
  }, {}], 18: [function (t, e, i) {
    "use strict";
    var n = {yes: !0, no: !1}, r = {
      each: function (t, e) {
        for (var i in t)t.hasOwnProperty(i) && e(t[i], i)
      }, toArray: function (t) {
        return Array.prototype.slice.call(t)
      }, merge: function () {
        for (var t = {}, e = 0; e < arguments.length; e++) {
          var i = arguments[e];
          if (i)for (var n in i)i.hasOwnProperty(n) && (t[n] = i[n])
        }
        return t
      }, extend: function (t, e) {
        for (var i in e)e.hasOwnProperty(i) && (t[i] = e[i])
      }, getDataset: function (t) {
        if ("object" == typeof t.dataset)return t.dataset;
        var e, i, n, r = {}, o = t.attributes, c = function (t) {
          return t.charAt(1).toUpperCase()
        };
        for (e = o.length - 1; e >= 0; e--)i = o[e], i && i.name && /^data-\w[\w\-]*$/.test(i.name) && (n = i.name.substr(5).replace(/-./g, c), r[n] = i.value);
        return r
      }, bools: function (t) {
        var e = {}, i = r.getDataset(t);
        for (var o in i)if (i.hasOwnProperty(o)) {
          var c = i[o];
          e[o] = n[c] || c
        }
        return e
      }, template: function (t, e) {
        return t ? t.replace(/\{([^\}]+)\}/g, function (t, i) {
          return i in e ? e[i] : t
        }) : ""
      }, makeUrl: function (t, e) {
        for (var i in e)e.hasOwnProperty(i) && (e[i] = encodeURIComponent(e[i]));
        return r.template(t, e)
      }, query: function (t) {
        var e = encodeURIComponent, i = [];
        for (var n in t)"object" != typeof t[n] && i.push(e(n) + "=" + e(t[n]));
        return i.join("&")
      }, set: function (t, e, i) {
        var n = e.split("."), r = null;
        n.forEach(function (e, i) {
          "undefined" == typeof t[e] && (t[e] = {}), i !== n.length - 1 && (t = t[e]), r = e
        }), t[r] = i
      }, getDefaultUrl: function () {
        var t = document.querySelector('link[rel="canonical"]');
        return t ? t.href : window.location.href.replace(window.location.hash, "")
      }
    };
    e.exports = r
  }, {}], 19: [function (t, e, i) {
    "use strict";
    function n(t, e) {
      this.container = t, this.options = e, this.countersLeft = 0, this.buttons = [], this.number = 0, this.init()
    }

    var r = t("./button"), o = t("./config"), c = t("./utils");
    n.prototype = {
      init: function () {
        c.toArray(this.container.children).forEach(this.addButton.bind(this)), this.options.counters ? (this.timer = setTimeout(this.appear.bind(this), this.options.wait), this.timeout = setTimeout(this.ready.bind(this), this.options.timeout)) : this.appear()
      }, addButton: function (t) {
        var e = new r(t, this, this.options);
        this.buttons.push(e), e.options.counterUrl && this.countersLeft++
      }, update: function (t) {
        (t.forceUpdate || t.url !== this.options.url) && (this.countersLeft = this.buttons.length, this.number = 0, this.buttons.forEach(function (e) {
          e.update(t)
        }))
      }, updateCounter: function (t, e) {
        e && (this.number += e), this.countersLeft--, 0 === this.countersLeft && (this.appear(), this.ready())
      }, appear: function () {
        this.container.classList.add(o.name + "_visible")
      }, ready: function () {
        this.timeout && (clearTimeout(this.timeout), this.container.classList.add(o.name + "_ready"))
      }
    }, e.exports = n
  }, {"./button": 1, "./config": 2, "./utils": 18}]
}, {}, [5]);

core.bind('loader.loaded', function () {
  if (!_.isUndefined(window.likely)) {
    window.likely.initiate();
  }
});
var langLabels = require("langLabels");
var Tpl = require("../tpl/m");
function rulleParser(s, d) {
    if (/\[\?v\{/.test(s)) {
        return s.replace(/\[\?v\{(\w+)\}:(.*)\]/ig, function () {
            var keyvar = arguments[1], variants = arguments[2].split('|'), i, a, def;
            for (i = 0; i < variants.length; i++) {
                a = variants[i].split(':');
                if (a[0] == '_') {
                    def = a[1];
                    continue;
                }
                if (a[0] == d[keyvar]) {
                    return a[1];
                }
            }
            if (def)
                return def;
            return arguments[0];
        }, s);
    }
    if (/\[\?b\{/.test(s)) {
        return s.replace(/\[\?b\{(\w+)\}:(.*)\]/ig, function () {
            return arguments[2].split('|')[d[arguments[1]] < 1 ? 1 : 0];
        }, s);
    }
    if (/\[\?j\{/.test(s)) {
        return s.replace(/\[\?j\{(\w+)\}:(.*)\]/ig, function () {
            var last, a;
            if (/\|/.test(arguments[2])) {
                a = arguments[2].split('|');
                last = d.pop();
                return d.join(a[0]) + a[1] + last;
            }
            return d.join(arguments[2]);
        }, s);
    }
    if (/\[\?p\{/.test(s)) {
        return s.replace(/\[\?p\{(\w+)\}:(.*)\]/ig, function () {
            var a = arguments[2].split('|');
            if (isRusInPreposLong(d[(arguments[4].split(arguments[0]))[1].replace(/%/g, '').trim()]))
                return a[1];
            return a[0];
        }, s);
    }
    return s.replace(/\[\?n\{(\w+)\}:(.*)\]/ig, function () {
        var val = d[arguments[1]] | 0;
        return arguments[2].split('|')[val < 1 ? 2 : (val < 2 ? 0 : (val < 5 ? 1 : 2))];
    }, s);
}
function isRusInPreposLong(text) {
    text = text.trim();
    if (['в', 'ф'].join('~').indexOf(text[0].toLowerCase()) === -1)
        return false;
    if (['а', 'о', 'у', 'ы', 'э', 'я', 'ё', 'ю', 'е', 'и'].join('~').indexOf(text[1].toLowerCase()) !== -1)
        return false;
    return true;
}
var Language = (function () {
    function Language() {
    }
    Language.L = function (label, ph) {
        var s;
        if (!langLabels[label]) {
            return 'Language.L(' + label + ')';
        }
        s = langLabels[label];
        if (ph) {
            s = Tpl.t(rulleParser(s, ph), ph, { open: '\\%', close: '\\%' });
        }
        return s;
    };
    return Language;
})();
module.exports = Language;

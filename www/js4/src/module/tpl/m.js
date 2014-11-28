function t(templateString, data, tags) {
    tags = tags || {
        open: '<%=',
        close: '%>'
    };
    return templateString.replace(new RegExp(tags.open + "\\s*([\\w\\.]*)\\s*" + tags.close, "g"), function (s, k) {
        var k = k.split("."), v = data[k.shift()], i;
        for (i in k) {
            v = v[k[i]];
        }
        return (typeof v !== void 0 && v !== null) ? v : '';
    });
}
exports.t = t;

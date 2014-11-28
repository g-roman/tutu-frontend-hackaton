var Tpl = require("./m");
test("Test Tpl module", function () {
    var testStr = "Hello world!";
    equal(typeof Tpl.t, "function", "Function");
    equal(Tpl.t("Hello <%=placeHolder%>!", { placeHolder: "world" }), testStr);
    equal(Tpl.t("Hello <%= placeHolder %>!", { placeHolder: "world" }), testStr);
    equal(Tpl.t("Hello <%= placeHolder %>!", {
        someVar: "abc",
        someData: 123,
        placeHolder: "world",
    }), testStr);
    equal(Tpl.t("Hello <%= place_holder %>!", { place_holder: "world" }), testStr);
    equal(Tpl.t("Hello <%= place2holder %>!", { place2holder: "world" }), testStr);
    equal(Tpl.t("Hello <%= place_holder %>!", { place_holder: "world" }), testStr);
    equal(Tpl.t("Hello {{placeHolder}}!", { placeHolder: "world" }, { open: "{{", close: "}}" }), testStr);
    equal(Tpl.t("Hello <?=placeHolder?>!", { placeHolder: "world" }, { open: "<?=", close: "?>" }), testStr);
});

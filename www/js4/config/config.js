require.config({
	baseUrl: "/js4/src",
	appDir: '',
	paths: {
//		jqueryui:	"//ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min",
//		underscore: "//cdnjs.cloudflare.com/ajax/libs/lodash.js/2.4.0/lodash.min",
//		jquery:		"//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min",
		jquery:		"vendors/jq/1.10.2.min.js",
		underscore:	"vendors/lodash/2.4.0.min",
		jqueryui:	"vendors/jq/ui.1.10.3.min",
		widgets:	"widgets",
		lib:		"lib",
		trait:		"trait",
		module:		"module",
		template:	"template",
		legacy:		"../legacy",
		trainStaticData: "app/train/data",
		vendors:	"vendors",
		moment:		"vendors/jq/plugin/moment/min",
		momentRu:	"vendors/jq/plugin/moment/ru",
		text:		"vendors/rjs/plugin/text",
		json:		"vendors/rjs/plugin/json",
		params:     "empty:"
	},
	shim: {
		jqueryui: { exports: "$.ui" },
		underscore: { exports: "_" },
		typeahead: ["jquery"]
	}
});
(function(){
	var au;
	if (window.location.pathname == '/') {
		Profiler.export.pageName = "tours-page-main";
	}
	else {
		au = window.location.pathname.split('/');

		if ((au.length > 2) && ("strana" == au[1])) {
			Profiler.export.pageName = "tours-page-strana";
		}
	}
	Profiler.i(Profiler.export.pageName);
})()
/**
 *
 */
interface ITags {
	open	: string;
	close	: string;
}

/**
 * Простейший шаблонизатор. На вход подаем строку с плейсхолдерами и данными.
 * Аналог srintf.
 * По дефолту синтаксис тегов как в шаблонизаторе lodash http://lodash.ru/#template
 * Пример:
 *
 *        TR.templateString('hello <%= person.name %> <%=person.surname%>', {person: {name: 'Alexander', surname: 'Majorov'}});
 *
 * @param templateString - шаблон
 * @param data - данные (не обязательно)
 * @param tags - зампенить дефолтные теги на свои
 * @returns {XML|string|void}
 */
export function t(
		templateString	: string,
		data			: Object,
		tags?			: ITags
	){

	/**
	 * По дефолту используем теги в стиле underscore templater
	 * @type {any|{open: string, close: string}}
	 */
	tags = tags || {
		open: '<%=',
		close: '%>'
	};

	return templateString.replace(
		new RegExp(tags.open + "\\s*([\\w\\.]*)\\s*" + tags.close, "g"),
		function(s, k){

			var k = k.split("."),
				v = data[k.shift()],
				i;

			for(i in k) {
				v = v[k[i]];
			}

			return (typeof v !== void 0 && v !== null)
				? v
				: ''
		})
}

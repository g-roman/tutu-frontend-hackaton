/**
 *
 * @param derivedInstase
 * @param baseInstance
 */
function addTraits(derivedInstase: any, baseInstance: any[]) {

	baseInstance.forEach(
		baseInstance => {
			Object
				.getOwnPropertyNames(baseInstance.prototype)
				.forEach( name => derivedInstase.prototype[name] = baseInstance.prototype[name] )
		}
	);

}

export = addTraits;
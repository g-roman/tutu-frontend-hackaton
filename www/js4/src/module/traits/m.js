function addTraits(derivedInstase, baseInstance) {
    baseInstance.forEach(function (baseInstance) {
        Object.getOwnPropertyNames(baseInstance.prototype).forEach(function (name) { return derivedInstase.prototype[name] = baseInstance.prototype[name]; });
    });
}
module.exports = addTraits;

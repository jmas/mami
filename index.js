export default ({ loadModule, modules }) => {
    const getModule = moduleName => {
        const config = modules[moduleName];
        if (!config) {
            return Promise.reject(new Error(`Module config with name '${moduleName}' is not described.`));
        }
        if (typeof config === 'function') {
            return Promise.resolve(config(loadModule, getModule));
        }
        const props = {};
        const propsKeys = Object.keys(config);
        return (
            (
                propsKeys.length > 0
                    ?
                        Promise.all(
                            propsKeys.map(propName => (
                                Promise.resolve(
                                    typeof config[propName] === 'function'
                                        ? config[propName](getModule)
                                        : config[propName]
                                ).then(propValue => {
                                    props[propName] = propValue;
                                })
                            ))
                        )
                    : Promise.resolve()
            )
            .then(() => loadModule(moduleName))
            .then(factory => (
                typeof factory === 'function'
                    ? factory(props)
                    : factory
            ))
        );
    };
    return getModule;
};

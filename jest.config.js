module.exports = {
    moduleNameMapper: {
        'solid-js/web': '<rootDir>/node_modules/solid-js/web/dist/web.cjs',
        'solid-js/store': '<rootDir>/node_modules/solid-js/store/dist/store.cjs',
        'solid-js': '<rootDir>/node_modules/solid-js/dist/solid.cjs',
    },
    preset: 'ts-jest',
    testEnvironment: 'node',
    globals: {
        'ts-jest': {
            'tsconfig': 'tsconfig.json',
            'babelConfig': {
                'presets': [
                    'babel-preset-solid',
                    '@babel/preset-env'
                ]
            }
        }
    }
};

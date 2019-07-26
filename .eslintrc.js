// https://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parserOptions: {
        parser: 'babel-eslint'
    },
    env: {
        browser: true,
    },
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    extends: ['plugin:vue/essential', 'airbnb-base'],
    // required to lint *.vue files
    plugins: [
        'vue'
    ],
    // check if imports actually resolve
    settings: {
        'import/resolver': {
            webpack: {
                config: 'build/webpack.base.conf.js'
            }
        }
    },
    // add your custom rules here
    rules: {
        // don't require .vue extension when importing
        'import/extensions': ['error', 'always', {
            js: 'never',
            vue: 'never'
        }],
        // disallow reassignment of function parameters
        // disallow parameter object manipulation except for specific exclusions
        'no-param-reassign': ['error', {
            props: true,
            ignorePropertyModificationsFor: [
                'state', // for vuex state
                'acc', // for reduce accumulators
                'e' // for e.returnvalue
            ]
        }],
        // allow optionalDependencies
        'import/no-extraneous-dependencies': ['error', {
            optionalDependencies: ['test/unit/index.js']
        }],
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
        'indent': [2, 4],//缩进风格
        // 统一换行符，"\n" unix(for LF) and "\r\n" for windows(CRLF)，默认unix
        // off或0: 禁用规则
        'linebreak-style': 'off',
        // 要求使用 const 声明那些声明后不再被修改的变量
        "prefer-const": 0,
        // 要求使用模板字面量而非字符串连接
        "prefer-template": 0,
        // 不允许对 function 的参数进行重新赋值
        "no-param-reassign": 0,
        // 禁止 if 语句中有 return 之后有 else
        "no-else-return": 0,
        // 禁止使用特定的语法
        "no-restricted-syntax": 0,
        // 禁止标识符中有悬空下划线_bar
        "no-underscore-dangle": 0,
        "max-len": [1, 200],
        // 禁止使用一元操作符 ++ 和 --
        "no-plusplus": 0,
        // 要求或禁止在可能的情况下要求使用简化的赋值操作符
        "operator-assignment": 0,
        // 禁止混合使用不同的操作符
        "no-mixed-operators": 0,
        // 禁用 console
        "no-console": 0,
        "prefer-rest-params": 0,
        "prefer-spread": 0,
        "no-unused-expressions": 0,
        "max-len": [1, 2000],
        "arrow-body-style": ["error", "as-needed"],
        "guard-for-in": 0,
        "no-unneeded-ternary": 0,
        "no-lonely-if": 0,
        "no-useless-return": 0,
        "no-alert": 0,
        "radix": 0,
        "no-undef": 0,
        "indent": 0,
        "default-case": 0,
        "no-nested-ternary": 0,
    }
}

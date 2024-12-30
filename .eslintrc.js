module.exports = {
    "env": {
        "es6": true,
        "jest": true,
        "node": true
    },
    "plugins": [
        "node",
        "react"
    ],
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    /*
     * using babel-eslint as a parser due dynamic import being at stage 3 currently
     * remove it when dynamic import became stage 4
     */
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 2019,
        "ecmaFeatures": {
            "jsx": true
        },
        "sourceType": "module"
    },
    "settings": {
        "react": {
            "version": "detect"
        }
    },
    "rules": {
        "indent": [
            "error",
            "tab"
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "never"
        ],
        "no-extra-parens": [
            "error"
        ],
        "no-multi-spaces": [
            "error"
        ],
        "no-multiple-empty-lines": [
            "error"
        ],
        "key-spacing": [
            "error",
            {
                "beforeColon": false,
                "afterColon": true
            }
        ],
        "keyword-spacing": [
            "error"
        ],
        "no-trailing-spaces": [
            "error"
        ],
        "comma-dangle": [
            "error",
            "never"
        ],
        "eol-last": [
            "error"
        ],
        "curly": [
            "error"
        ],
        "dot-notation": [
            "error"
        ],
        "dot-location": [
            "error",
            "object"
        ],
        "react/prop-types": "off",
        "react/jsx-filename-extension": "off",
        "react/display-name": "off",
        "node/no-unsupported-features/es-syntax": "off"
    }
}

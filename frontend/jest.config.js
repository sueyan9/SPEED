module.exports = {

    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
    moduleNameMapper: {
        "\\.(css|less|sass|scss)$": "identity-obj-proxy"
    },
    moduleFileExtensions: ['js', 'jsx'],
    testEnvironment: 'jsdom',
};


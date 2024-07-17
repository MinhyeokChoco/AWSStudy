module.exports = {
    apps: [
        {
            name: 'myapp',
            script: 'dist/main.js',
            instances: 'max',
            exec_mode: 'cluster',
            watch: false,
            env: {
                NODE_ENV: 'development',
                PORT: 3000,
            },
            env_production: {
                NODE_ENV: 'production',
                PORT: 3000,
            },
        },
    ],
};
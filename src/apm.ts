import apm from 'elastic-apm-node';

apm.start({
    // Override service name from package.json
    // Allowed characters: a-z, A-Z, 0-9, -, _, and space
    serviceName: 'lightproxy',

    // Set custom APM Server URL (default: http://localhost:8200)
    serverUrl: 'https://apm.imdada.cn',
});

export default apm;

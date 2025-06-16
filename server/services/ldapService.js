const ldap = require('ldapjs');
const config = require('../config/config');

// LDAP Configuration
const LDAP_URL = process.env.LDAP_URL || 'ldap://10.91.50.51:389';
const LDAP_BASE_DN = process.env.LDAP_BASE_DN || 'DC=div,DC=com';
const LDAP_TIMEOUT = 5000; // 5 seconds timeout

async function testLDAPConnection() {
    return new Promise((resolve, reject) => {
        console.log('Testing LDAP connection to:', config.ldap.url);
        
        const client = ldap.createClient({
            url: config.ldap.url,
            timeout: config.ldap.timeout,
            connectTimeout: config.ldap.timeout,
            reconnect: false
        });

        client.on('error', (err) => {
            console.error('LDAP connection test error:', {
                code: err.code,
                name: err.name,
                message: err.message
            });
            client.unbind();
            reject(err);
        });

        const timeout = setTimeout(() => {
            console.error('LDAP connection test timeout');
            client.unbind();
            reject(new Error('LDAP connection test timeout'));
        }, config.ldap.timeout);

        client.bind('', '', (err) => {
            clearTimeout(timeout);
            if (err) {
                console.error('LDAP connection test bind error:', {
                    code: err.code,
                    name: err.name,
                    message: err.message
                });
                client.unbind();
                reject(err);
                return;
            }
            console.log('LDAP connection test successful');
            client.unbind();
            resolve(true);
        });
    });
}

/**
 * Verify user credentials against LDAP using UPN bind
 * @param {string} email - User's email (username@company.com)
 * @param {string} password - User's password
 * @returns {Promise<boolean>} - Returns true if credentials are valid
 */
async function verifyLDAPCredentials(email, password) {
    try {
        // First test the connection
        await testLDAPConnection();
        
        return new Promise((resolve, reject) => {
            console.log('Attempting LDAP connection to:', config.ldap.url);
            
            const client = ldap.createClient({
                url: config.ldap.url,
                timeout: config.ldap.timeout,
                connectTimeout: config.ldap.timeout,
                reconnect: false
            });

            client.on('error', (err) => {
                console.error('LDAP client error:', {
                    code: err.code,
                    name: err.name,
                    message: err.message,
                    stack: err.stack
                });
                client.unbind();
                reject(err);
            });

            const timeout = setTimeout(() => {
                console.error('LDAP connection timeout');
                client.unbind();
                reject(new Error('LDAP connection timeout'));
            }, config.ldap.timeout);

            console.log('Attempting LDAP bind with:', email);
            client.bind(email, password, (err) => {
                clearTimeout(timeout);
                
                if (err) {
                    console.error('LDAP bind error details:', {
                        code: err.code,
                        name: err.name,
                        message: err.message,
                        stack: err.stack
                    });
                    client.unbind();
                    reject(err);
                    return;
                }

                console.log('LDAP bind successful');
                client.unbind();
                resolve(true);
            });
        });
    } catch (error) {
        console.error('LDAP verification error:', {
            code: error.code,
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        throw error;
    }
}

module.exports = {
    verifyLDAPCredentials,
    testLDAPConnection
};
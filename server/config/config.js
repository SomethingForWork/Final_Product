require('dotenv').config();

module.exports = {
    // LDAP Configuration
    ldap: {
        url: process.env.LDAP_URL || 'ldap://10.91.50.51:389',
        baseDN: process.env.LDAP_BASE_DN || 'DC=religare,DC=com',
        timeout: 10000
    },
    
    // JWT Configuration
    jwt: {
        secret: process.env.JWT_SECRET || 'your-secret-key',
        expiresIn: '1h'
    },
    
    // MongoDB Configuration
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/restrict_app'
    }
}; 

var ursa = require('ursa');
var key = ursa.createPrivateKey('-----BEGIN RSA PRIVATE KEY-----\n'+
	'MIICdwIBADANBgkqhkiG9w0BAQEFAASCAmEwggJdAgEAAoGBAPAdBTvu2wwE1sqf\n'+
	'NV345l4g2zus+AZ1XyjCtq7U7H1rlrGsnadqTd0NCIP1m39R+RyRmGoViEObPFg6\n'+
	'CRgOag/h9Mx6ojBjh7Sbj5YNMXoR/vi0RbZJ43BRWoG1woP4MYTH1BNpaM4u77Aj\n'+
	'Dh/iBG66ujbuhJy3I0l+InrbkLfZAgMBAAECgYEA2+hYQNmzeEB+T7icceJhadgB\n'+
	'sZfq2E9qxbP/CAQuS3fb3gHPqeKsSUWEhQbOUT9MPaQCyTXLRM/J5qvQZF3fN8KA\n'+
	'OxJUXxu8iy2qb2XPv/9/1dZf0i2uCDivjaCc8/PviXMZs0a0P4HDHsHHffn6vcYI\n'+
	'iEnhCf2eMMIdV3nZxeECQQD4jr4qKMVVMtOme11COJgBnlHVv6CmTLeTGv8rz4LM\n'+
	'zeBSJJfMVjfLpHf8Ivo4mVdx7VBlbNIVi7jwBVPLE4CtAkEA902M6tJ8BahnEX6o\n'+
	'P1p6W2A2ChA6leE7wWnrtzDjiCG9nNExUFHhdCE5EceV8nfLIcX9XE/t6voEyVJU\n'+
	'5pD9XQJBAJqBEJBgW5nESHA6SxQ43bRT14bI4XG+SnZ0151CFop8hy5IdNud1H0P\n'+
	'tU3T6Dp6hzLYU5tYc5bVDZaVmSqo6tkCQFzNJDFGVTYGUM8W2WoUuM+rVfwGxQVT\n'+
	'ZQoahlLTLL778lxzf+7lGxZqFTFf1RwM6hQ9aOsIL3663aryk1uGUx0CQAp0fGJM\n'+
	'/Y5Ic+rrZA46kV5+BtXJulkIRTVBTMW1vv714iCk6selXIzQo2sU0gD0BUVlx8V1\n'+
	'yoKileuksRbuU5k=\n'+
	'-----END RSA PRIVATE KEY-----');
var md5 = '799d04eb962eb3903786b58b0b450463';// 待加密的md5
var md1 = 'E136093F957E77E1075CA308AC800247';
var md2 = 'EBC5F4FC0D2998B3C084B4D9DBCDA11B';
console.log("[RSA\""+md5+"\"加密结果]: "+key.privateEncrypt(md5,'utf8', 'base64'));
console.log("[RSA\""+md1+"\"加密结果]: "+key.privateEncrypt(md1,'utf8', 'base64'));
console.log("[RSA\""+md2+"\"加密结果]: "+key.privateEncrypt(md2,'utf8', 'base64'));
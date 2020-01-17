var fs     = require("fs");
var path   = require("path");
var Config = require("./config.json");
var ENV    = 'DEVELOPMENT';
var MOD    = '';
var UPDATE = 'update';
var IMPORT = 'import/';
var ursa = require('ursa');
var glob = require("glob");
var gutil = require('gulp-util');
var grunt = require("grunt");
/*var ursa_key = ursa.createPrivateKey('-----BEGIN RSA PRIVATE KEY-----\n'+
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
'-----END RSA PRIVATE KEY-----');*/

var ursa_key = ursa.createPrivateKey('-----BEGIN RSA PRIVATE KEY-----\n'+
'MIICXQIBAAKBgQC+JpK8RglbaRyGUKdg5ga2tKDErJOdFNRDe1Nj+Z0Ie6Em6smn\n'+
'LeRuSH3Si+wQXrmJ2fILib8FODiO+H0LjqdxQBchhYCPjjcaSsNiybZISHf+ccx3\n'+
'YUPBjjvzzSLrkV42F4DTTbABPc2sOFiUpsauZfa2T1aRwI1PvrU+yXKFywIDAQAB\n'+
'AoGAAus4qWcx0ZNlerJWP2iIhdlz9lDn2ytsrrR/7TLxtCWhraVA/y33KbI3LDo1\n'+
'n3K0ymbsDj1JD11zkM5DrR+9djrAQQnAlXxhSzyc41W1oUvadf/3t9GotOCaxM81\n'+
'pjZy07yK3xi9ybtsaymk38RIuD49Zwozgvy6oPdiMlWHp1ECQQD5v/GA22b2vShw\n'+
'cejoyhDA5h+g4I0y5SeN4ePwCeLSEvcmzBuojEmz7r2QwGlUgb2DqFUCPaPyAOWV\n'+
'Y980gyH/AkEAwujMxaHKMPrOQBNl4K1cTh7ix1LGtqInqevFDdcEppmTlfVyBJin\n'+
'c/Khya84xKiPbltJe0Vp7bEi5+B1iTuENQJACB326Ws4E3jeYZkyKq62kK5qBL6H\n'+
'mEneWTwoPlrz5kP7iGVF2NqGYrS1sIiwY7C7yhWkfagnNexVid9vF7PTXQJBAKKy\n'+
'lYw7e33bPiN6jcY4sB595augy0NUpGtQ5ZKh873l4K6CzgRMMSu2U5r5axet5Nyn\n'+
'0vTVgpDpFkwcr8A4MCkCQQDUtVGIzsvMH0TosRmzoQIKEq+AXBnGt7cbcqYcnJ5s\n'+
'CKXXKaoMRjTQJWjznQO0cj2IQo7EDeaxptYrn/o6E/R7\n'+
'-----END RSA PRIVATE KEY-----');

var BUILD_DATE = gutil.date(new Date(), "yyyymmdd");

// 获取chdir
var argv = process.argv.slice(2);
// 设置默认工作目录为./dist
if ((argv_env = argv.indexOf("-env")) != -1) {
    var value = argv[argv_env + 1];
    ENV = value || "DEVELOPMENT";
}
if ((argv_mod = argv.indexOf("-mod")) != -1) {
    var value = argv[argv_mod + 1];
    MOD = value || "";
}
if ((argv_channel = argv.indexOf("-channel")) != -1) {
    var value = argv[argv_channel + 1];
    CHANNEL = value || "";
}
if ((argv_nativeVer = argv.indexOf("-native_version")) != -1) {
    var value = argv[argv_nativeVer + 1];
    NATIVE_VERSION = value || "";
}

if (CHANNEL != 'app') {
    UPDATE = CHANNEL + '_' + UPDATE;
}

var Create = {
	getCSV: function (v, url, t, md5) {
		if (md5) {
			return [v, url, t, md5].join(",") + "\n";
		} else {
			return [v, url, t].join(",") + "\n";
		}        
	},
	getInsertSQL: function (v, t, url, md5) {
		return "insert into ss_el_html_version (ID_SS_EL_HTML_VERSION, VERSION_CODE, DESCRIPTION, CATALOGUE, UPDATE_TO_VERSION, MD5, DATA_STATE, CREATED_BY, DATE_CREATED, UPDATED_BY, DATE_UPDATED) values (sys_guid(), '" + v + "', '', '" + url + "', '" + t + "', '" + md5 + "', '0', 'yulicheng661', sysdate, 'yulicheng661', sysdate);\n\r";
	},
	getDeleteSQL: function(v) {
	  var text =  "delete from tms_h5_version_info where update_to_version = '" + v + "';\n\r";
	  return text;
	},
	getUpdateJson: function (v, t, url, md5) {
		var json = ',"' + v + '": {"lastVersion": "' + t + '","md5": "' + md5 + '","modulesName": "' + MOD + '","updateUrl": "' + url + '"}';
		return json;
	},
	files: function (package_config, pkgMD5) {
		var sql = this.getDeleteSQL(Config.from);
		var testSql = this.getDeleteSQL(Config.from);
		var updateJson = '';
		var hostName = 'https://cdn.your360loans.com/indialoan/';
		var csv = "";
		var json = {
			"flag": "1",
			"env": "" + (ENV + '').split("_")[0] + ""
		}
		// 添加预发布路径 PRODUCTION_TEST
		//var	updateUrl = ENV == 'PRODUCTION'?'http://txt.pingan.com.cn/static/paem/cfs-ss/' + MOD + 'html':(ENV == 'PRODUCTION_TEST'?'http://nts-tms-dmzstg1.pingan.com.cn:9027/html-dev/paem/updateH5/prd_test/' + MOD + 'html':'http://nts-tms-dmzstg1.pingan.com.cn:9027/html-dev/paem/updateH5/' + MOD + 'html');
		if (ENV != 'PRD') {
			var map = {
				'10.209.34.43': '36.110.234.238',
				'10.209.34.37': '36.110.234.225',
				'10.209.34.7': '36.110.233.229',
				'10.209.3.153': '36.110.213.55'
				//'10.206.214.148': '27.115.124.145'
			}
			hostName = 'http://' + map[ENV] + '/static/testpackage/'
		}
		var updateUrl = hostName + CHANNEL + '/' + NATIVE_VERSION;

		for (var key in package_config) {
			var from = key;
			var filename = package_config[key].zip;
			var to_version = package_config[key].to;
			var md5 = package_config[key].md5;
			var dest = IMPORT + to_version;
			updateJson += this.getUpdateJson(from, to_version, updateUrl + "/" + to_version + "/" + filename, ursa_key.privateEncrypt(md5,'utf8', 'base64'));

			sql += this.getInsertSQL(from, to_version, updateUrl + "/" + to_version + "/" + filename, md5);

			testSql += this.getInsertSQL(from, to_version, updateUrl +"/" +to_version + "/" + filename, md5);

			csv += this.getCSV(from, updateUrl + "/" + to_version + "/" + filename, to_version, md5);
        }
        if (!fs.existsSync(dest)) {
        	fs.mkdirSync(dest);
        }
        json.data = JSON.parse('{' + updateJson.slice(1) + '}');
        fs.writeFileSync("./tmpfloder/" + CHANNEL + '/' + NATIVE_VERSION + "/" + MOD + ".json", JSON.stringify(json));
        fs.writeFileSync("./rollback/" + BUILD_DATE + "/" + CHANNEL + "/" + MOD + ".json", JSON.stringify(json));
        //fs.writeFileSync(dest + "/" + MOD + ".json", JSON.stringify(json));
        //fs.writeFileSync(dest + "/production_dml.sql", sql);
        //fs.writeFileSync(dest + "/test_dml.sql", testSql);
        //fs.writeFileSync(dest + "/version.csv", csv);
        fs.writeFileSync(dest + "/packages.json", JSON.stringify(package_config));
	}
}

var addDir = {
	mkdir_auto_next: function (mode, pathlist, pathlistlength, callback, pathlistlengthseed, pathtmp) {
	    callback = callback ||
	    function() {};
	    if (pathlistlength > 0) {

	        if (!pathlistlengthseed) {
	            pathlistlengthseed = 0;
	        }

	        if (pathlistlengthseed >= pathlistlength) {
	            callback(true);
	        }
	        else {

	            if (pathtmp) {
	                pathtmp = path.join(pathtmp, pathlist[pathlistlengthseed]);
	            }
	            else {
	                pathtmp = pathlist[pathlistlengthseed];
	            }

	            fs.exists(pathtmp,
	            function(exists) {
	                if (!exists) {
	                    fs.mkdir(pathtmp, mode,
	                    function(isok) {
	                        if (!isok) {
	                            addDir.mkdir_auto_next(mode, pathlist, pathlistlength,
	                            function(callresult) {
	                                callback(callresult);
	                            },
	                            pathlistlengthseed + 1, pathtmp);
	                        }
	                        else {
	                            callback(false);
	                        }
	                    });
	                }
	                else {
	                    addDir.mkdir_auto_next(mode, pathlist, pathlistlength,
	                    function(callresult) {
	                        callback(callresult);
	                    },
	                    pathlistlengthseed + 1, pathtmp);
	                }
	            });

	        }

	    }
	    else {
	        callback(true);
	    }
	},
	mkdirs: function (dirpath, mode, callback) {
	    callback = callback ||
	    function() {};
	    fs.exists(dirpath,
	    function(exitsmain) {
	        if (!exitsmain) {
	            //目录不存在
	            var pathtmp;
	            var pathlist = dirpath.split(path.sep);
	            var pathlistlength = pathlist.length;
	            var pathlistlengthseed = 0;

                addDir.mkdir_auto_next(mode, pathlist, pathlist.length,
	            function(callresult) {
	                if (callresult) {
	                    callback(true);
	                }
	                else {
	                    callback(false);
	                }
	            });

	        }
	        else {
	            callback(true);
	        }

	    });
	}
}

module.exports = exports = {
	/*
		每个升级包文件压缩前触发，这里可以将文件内容进行替换，用来作为替换环境变量
	*/
	beforeZip: function (filename) {
		//if (CHANNEL == 'mobilesafe' && filename.indexOf("navigation.json") != -1) {
		// if (CHANNEL != 'app' && filename.indexOf("navigation.json") != -1) {
		// 	var contents = fs.readFileSync(filename, 'utf-8'),
		// 		//contents = contents.replace(/DEVELOPMENT/g, ENV),
		// 		json = JSON.parse(contents),
		// 		mapping = json.mapping,
		// 		index = mapping['index.html'];
		// 	index.leftIcon = "/images/green/back.png";
		// 	index.rightIcon = "/images/green/personalCenter.png";
		// 	index.title = "安心借条";
		// 	contents = JSON.stringify(json);
		// 	fs.writeFileSync(filename, contents);
		// }
    },
	/*
		设置输出包的名字
	*/
    setOutputName: function (ver) {
        /*return PROJECT_NAME + "_" + ver + "_" + ENV + "_" + new Date().getTime() + ".zip";*/
    },
	/*
		整个增量包打包时触发，需要打包附属文件的话在这里处理
		这里可以拿到json映射文件，可以用来拼sql
	*/
	beforePackage: function (pathname,json,pkgMD5) {
		addDir.mkdirs("./tmpfloder/" + CHANNEL + '/' + NATIVE_VERSION + '/' + json['0000'].to, 777, function() {
            addDir.mkdirs("./rollback/" + BUILD_DATE + '/' + CHANNEL, 0777, function() {
                Create.files(json,pkgMD5);
            });
		});

	    //fs.writeFileSync(path.join(pathname,"test.txt"), "HELLOWORLD", "UTF-8");
    },
    /*
		打包结束时触发
    */
    onEnd: function (json) {
		

    	/*
    	  @desc: 打包结束后把包复制到指定服务器路径，提供下载
    	  @author: qiuxiaoqiang
    	  @date: 20160704
    	 */
		/*json = { '1010100000': 
		   { zip: '1010100000-1010100001.zip',
		     md5: '211c2b22631bb9aeb79b1a60f55a5f9e',
		     to: '1010100001' },
		  '0000': 
		   { zip: '0000-1010100001.zip',
		     md5: 'febf60ea072533437f7d0d96878c6e76',
		     to: '1010100001' }
		 }*/
    	var sourceFolderName = json['0000'].to,
    		//workDir = "/home/tomcat/apache-tomcat-8.0.33/webapps/examples/xiaoqiang/",
    		sourceUri = './' + UPDATE + '/' + sourceFolderName,
    		targetUri = "./tmpfloder/" + CHANNEL + '/' + NATIVE_VERSION + '/' + sourceFolderName;

    	var sourceFiles = glob.sync("**/*", {
    		cwd: sourceUri + "/"
    	});

        sourceFiles.forEach(function(srcfile) {
            var filepath = path.join(sourceUri, srcfile);

            if (grunt.file.isDir(filepath)) {
                grunt.file.mkdir(path.join(targetUri, srcfile));
            } else {
                grunt.file.copy(filepath, path.join(targetUri, srcfile));
            }
        });
    }
}

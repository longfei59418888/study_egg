var Zip = require("jszip");
var fs = require("fs");
var crypto = require('crypto');
var path = require("path");
var rimraf = require('rimraf');
var glob = require("glob");
var grunt = require("grunt");
var packageConfig = {};
var md5Map = {}; //升级包MD5
var md5All = {}; //项目整个目录每个文件MD5
var TEMP_PATH = "./temp";
var TEMP_PACKAGE_PATH = "./temp_zip";
var UPDATE_CODE = "./update_code/*";
var UPDATE = "update";
var WORKDIR = '../dist';
var Config = {};

var argv = process.argv.slice(2);

if ((argv_channel = argv.indexOf("-channel")) != -1) {
    var value = argv[argv_channel + 1];
    CHANNEL = value || "";
}

function copyFiles(){
    var pkgName = fs.readFileSync('pkgName.txt', "binary");
    grunt.file.copy('../output/' + pkgName, "./upgrade/tmpfloder/" + CHANNEL + "/" + CHANNEL + ".zip");
}

function createJson(package_config, pkgMD5) {
		var updateJson = '';
		var hostName = '';
		var csv = "";
		var json = {
			"flag": "1",
			"env": "" + (ENV + '').split("_")[0] + ""
		}
		if (ENV != 'PRD') {
			var map = {
				'10.209.34.43': '36.110.234.238',
				'10.209.34.37': '36.110.234.225',
                '10.209.34.7': '36.110.233.229',
				'10.209.3.153': '36.110.213.55'
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

        }
        if (!fs.existsSync(dest)) {
        	fs.mkdirSync(dest);
        }
        json.data = JSON.parse('{' + updateJson.slice(1) + '}');
        fs.writeFileSync("./tmpfloder/" + CHANNEL + '/' + NATIVE_VERSION + "/" + MOD + ".json", JSON.stringify(json));


        fs.writeFileSync(dest + "/packages.json", JSON.stringify(package_config));
	}

(function() {
    copyFiles();
})();
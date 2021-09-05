"use strict";
var Client = require('ssh2-sftp-client');
var path = require('path');
var fs = require('fs');
var server_info = {
    host: "",
    port: "",
    username: "",
    password: ""
};
var root_src = __dirname;
var root_patch = "/";
var mode = '';
// Parse arguments
var i = 2;
while (i < process.argv.length) {
    var arg = process.argv[i];
    switch (arg) {
        case '--s':
        case '-source':
            root_src = process.argv[i + 1];
            i += 2;
            break;
        case '--d':
        case '-director':
            root_patch = process.argv[i + 1];
            i += 2;
            break;
        case '--h':
        case '-host':
            server_info.host = process.argv[i + 1];
            i += 2;
            break;
        case '--P':
        case '-port':
            server_info.port = process.argv[i + 1];
            i += 2;
            break;
        case '--u':
        case '-username':
            server_info.username = process.argv[i + 1];
            i += 2;
            break;
        case '--p':
        case '-password':
            server_info.password = process.argv[i + 1];
            i += 2;
            break;
        case '--m':
        case '-mode':
            mode = process.argv[i + 1];
            i += 2;
            break;
        default:
            i++;
            console.log("ko du pargram" + arg);
            break;
    }
}
////////////////////////////////
function backupToLocal(dir, patch) {
    let sftp = new Client();
    sftp.connect(server_info).then(() => {
        return sftp.list(patch);
    }).then((data) => {
        copyDir(sftp, data, dir, '/', patch).then(() => {
            console.log("done download");
            sftp.end();
        });
    }).catch(err => {
        console.log('error download:' + err);
        sftp.end();
    });
}
function copy(sftp, src, dest) {
    return new Promise((resolve, reject) => {
        sftp.get(src, dest).then(() => {
            resolve();
        }).catch((err) => {
            reject('fast Get' + err);
        });
    });
}
function mkdirSync(path) {
    try {
        fs.mkdirSync(path);
    }
    catch (e) {
        if (e.code != 'EEXIST')
            throw e;
    }
}
function copyDir(sftp, files, dir, dest, patch) {
    return new Promise(async (resolve, reject) => {
        let t = 0;
        var check_done = () => {
            if (t == files.length)
                resolve();
        };
        mkdirSync(path.join(dir, dest));
        for (let i = 0; i < files.length; i++) {
            let current = files[i];
            if (current.type === 'd') {
                let tmp = current;
                let src = path.join(path.join(patch, dest), tmp.name);
                sftp.list(src).then((data) => {
                    copyDir(sftp, data, dir, path.join(dest, tmp.name), patch).then(() => {
                        t++;
                        check_done();
                    }).catch(() => {
                    });
                }).catch(err => console.log("list: " + err));
            }
            if (current.type === '-') {
                let d = path.join(dest, current.name);
                // @ts-ignore
                await copy(sftp, path.join(patch, d), path.join(dir, d), current.name).then(() => {
                    t++;
                    check_done();
                }).catch((err) => {
                    console.log(err);
                });
            }
        }
    });
}
var backup = (url, name) => {
    // backup;
    let back_up = path.join(__dirname, 'backup');
    mkdirSync(back_up);
    //let date = new Date();
    //let str_date = path.join(back_up, `backup_${date.getDay()}_${date.getMonth()}_${date.getHours()}`);
    //mkdirSync(path.join(str_date, name));
    backupToLocal(back_up, '/opt/no1_alpha/test_app/src');
};
//backup('dasdas', 'web');
function uploadToRemoteServer(src, patch) {
    console.log(`start upload src: ${src} , patch = ${patch}`);
    let sftp = new Client();
    sftp.connect(server_info).then(() => {
        return sftp.list(patch);
    }).then((data) => {
        uploadDir(sftp, src, path.join(patch, '/')).then(() => {
            console.log("done upload");
            sftp.end();
        }).catch((err) => {
            console.log("error upload:" + err);
            sftp.end();
        });
    }).catch(err => {
        sftp.end();
        console.log('khong co patch' + err);
    });
}
//uploadToRemoteServer("/Volumes/Share/Work/Git/No1_Server/20_line(tamhung)/bin/release/netcoreapp2.1/publish", '/opt/dotnet/tamhung');
function mkdirRemote(sftp, patch) {
    return new Promise((resolve, reject) => {
        sftp.list(patch).then((data) => {
            resolve();
        }).catch((err) => {
            sftp.mkdir(patch, true).then(() => {
                resolve();
            }).catch(err => reject('mkdirremote:' + err));
        });
    });
}
function uploadDir(sftp, src, patch) {
    return new Promise((resolve, reject) => {
        let t = 0;
        mkdirRemote(sftp, patch).then(() => {
            let stat = fs.statSync(src);
            if (stat.isDirectory()) {
                fs.readdir(src, async (err, files) => {
                    if (err) {
                        reject(err);
                    }
                    var check_done = () => {
                        if (t == files.length)
                            resolve();
                    };
                    for (let i = 0; i < files.length; i++) {
                        let stat = fs.statSync(path.join(src, files[i]));
                        if (stat.isFile()) {
                            await upload(sftp, path.join(src, files[i]), path.join(patch, files[i])).then(() => {
                                t++;
                                check_done();
                            }).catch((err) => {
                                reject(err);
                            });
                        }
                        if (stat.isDirectory()) {
                            uploadDir(sftp, path.join(src, files[i]), path.join(patch, files[i])).then(() => {
                                t++;
                                check_done();
                            }).catch((err) => {
                                reject(err);
                            });
                        }
                    }
                });
            }
        }).catch(err => reject(err));
    });
}
function upload(sftp, src, dest) {
    return new Promise((resolve, reject) => {
        sftp.put(src, dest).then(() => {
            resolve();
        }).catch((err) => {
            reject('fast Get' + err);
        });
    });
}
(function process() {
    switch (mode) {
        case 'upload':
            uploadToRemoteServer(root_src, root_patch);
            break;
        case 'download':
            backupToLocal(root_src, root_patch);
            break;
        default:
            console.log("no mode");
            break;
    }
})();
//# sourceMappingURL=remote_server_tool.js.map
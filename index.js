#!/usr/bin/env node

/*
 * @Author: jade
 * @Date:   2016-08-09 22:59:16
 * @Last Modified by:   Cosmo
 * @Last Modified time: 2017-11-20 17:48:00
 */

'use strict';
var client = require('scp2');
var homedir = require('os').homedir();

var configFilePath = "./config.toml";
var args = process.argv;
if (args[0].match(/node$/)) args = args.slice(2);
else args = args.slice(1);
for (var i = 0; i < args.length; i++) {
  if (args[i] == "-c" || args[i] == "--config") {
    configFilePath = args[++i];
  }
}

const config = (function(path) {
  var obj = require('fs').readFileSync(configFilePath.replace(/^\~/, homedir)).toString();
  obj = require('toml').parse(obj);
  if (obj.ignore) obj.ignore = new RegExp(obj.ignore);
  if (obj.sshkey) obj.sshkey = require('fs').readFileSync(obj.sshkey.replace(/^\~/, homedir)).toString();
  return obj
})(configFilePath);

require('watch').createMonitor(config.srcPath, {
  interval: config.interval,
  ignoreDotFiles: true,
  ignoreDirectoryPattern: config.ignore
}, function(monitor) {
  monitor.on("created", function(f, stat) {
    console.log(`[Created]: ${f}`);
    uploadFn(f);
  });
  monitor.on("changed", function(f, curr, prev) {
    console.log(`[Modified]: ${f}`);
    uploadFn(f);
  });
  monitor.on("removed", function(f, stat) {
    console.log(`[Removed]: ${f}`);
    uploadFn(f);
  });
});

function uploadFn(f) {
  // Handle file changes
  const destPath = f.replace(config.srcPath, '');
  var scpconf = {};
  if (config.host) scpconf.host = config.host;
  if (config.username) scpconf.username = config.username;
  if (config.password) scpconf.password = config.password;
  if (config.sshkey) scpconf.privateKey = config.sshkey;
  scpconf.path = config.destPath + destPath;
  client.scp(f, scpconf, function(err) {
    if (err) {
      console.error(`[Upload Error]: ${f}`);
      console.error(err);
    } else {
      console.info(`[Upload Success]: ${f}->${scpconf.path}`);
    }
  })
}

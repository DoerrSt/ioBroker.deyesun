"use strict";

/*
 * Created with @iobroker/create-adapter v2.3.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require("@iobroker/adapter-core");
const http = require("http");

// Load your modules here, e.g.:
// const fs = require("fs");

let adapter = null;
let ip = "";
let username = "";
let password = "";
const path = "/status.html";

class Deyesun extends utils.Adapter {
	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	constructor(options) {
		super({
			...options,
			name: "deyesun",
		});
		this.on("ready", this.onReady.bind(this));
		this.on("stateChange", this.onStateChange.bind(this));
		// this.on("objectChange", this.onObjectChange.bind(this));
		// this.on("message", this.onMessage.bind(this));
		this.on("unload", this.onUnload.bind(this));
		adapter = this;
	}

	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	async onReady() {
		// Initialize your adapter here

		// The adapters config (in the instance object everything under the attribute "native") is accessible via
		// this.config:
		adapter.username = this.config.username;
		adapter.password = this.config.password;
		adapter.ip = this.config.ip;
		adapter.RefreshInterval = this.config.RefreshInterval;

		adapter.log.debug("Create states...");

		adapter.setObjectNotExists("Current", {
			type: "state",
			common: {
				name: "Current",
				role: "value",
				read: true,
				write: true,
				type: "number",
			},
			native: {},
		});

		adapter.setObjectNotExists("Today", {
			type: "state",
			common: {
				name: "Today",
				role: "value",
				read: true,
				write: true,
				type: "number",
			},
			native: {},
		});

		adapter.setObjectNotExists("Total", {
			type: "state",
			common: {
				name: "Total",
				role: "value",
				read: true,
				write: true,
				type: "number",
			},
			native: {},
		});

		if (adapter.RefreshInterval < 600) {
			adapter.RefreshInterval = 600;
			adapter.log.info("Refresh Interval is too low. Updates are available each 10 minutes");
		}
		adapter.refreshIntervalObject = setInterval(adapter.RefreshValues, adapter.RefreshInterval * 1000);
	}

	async RefreshValues() {
		try {
			adapter.log.info("IP: " + adapter.ip);
			adapter.log.info("Username: " + adapter.username);

			const request = http.request(
				{ hostname: adapter.ip, path: "/status.html", auth: adapter.username + ":" + adapter.password },
				function (response) {
					console.log("STATUS: " + response.statusCode);
					console.log("HEADERS: " + JSON.stringify(response.headers));
					response.setEncoding("utf8");
					response.on("data", function (chunk) {
						//console.log('BODY: ' + chunk);
						const lines = chunk.split("\n");
						for (let i = 0; i < lines.length; i++) {
							// console.debug(lines[i]);
							if (lines[i].indexOf("var webdata_now_p") >= 0) {
								adapter.log.info(
									"Current: " + lines[i].split("=")[1].replaceAll(";", "").replaceAll('"', ""),
								);
								// Ensure to not write missing values as 0
								if (lines[i].split("=")[1].replaceAll(";", "").replaceAll('"', "").trim != "") {
									const tmp = Number(lines[i].split("=")[1].replaceAll(";", "").replaceAll('"', ""));
									adapter.setState("Current", {
										val: tmp,
										ack: true,
									});
								}
							}
							if (lines[i].indexOf("var webdata_today_e") >= 0) {
								adapter.log.info(
									"Today: " + lines[i].split("=")[1].replaceAll(";", "").replaceAll('"', ""),
								);
								// Ensure to not write missing values as 0
								if (lines[i].split("=")[1].replaceAll(";", "").replaceAll('"', "").trim != "") {
									const tmp = Number(lines[i].split("=")[1].replaceAll(";", "").replaceAll('"', ""));
									adapter.setState("Today", {
										val: tmp,
										ack: true,
									});
								}
							}
							if (lines[i].indexOf("var webdata_total_e") >= 0) {
								adapter.log.info(
									"Total: " + lines[i].split("=")[1].replaceAll(";", "").replaceAll('"', ""),
								);
								// Ensure to not write missing values as 0
								if (lines[i].split("=")[1].replaceAll(";", "").replaceAll('"', "").trim != "") {
									const tmp = Number(lines[i].split("=")[1].replaceAll(";", "").replaceAll('"', ""));
									adapter.setState("Total", {
										val: tmp,
										ack: true,
									});
								}
							}
						}
					});
				},
				function (error) {
					if (error.toString().indexOf("EHOSTUNREACH") >= 0) {
						// Host seems to be offline
						adapter.log.error("Host unreachable");
						adapter.setState("Current", {
							val: 0,
							ack: true,
						});
					}
				},
			);
			request.end();
		} catch (error) {
			adapter.log.error(error);
		}
	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 * @param {() => void} callback
	 */
	onUnload(callback) {
		try {
			// Here you must clear all timeouts or intervals that may still be active
			// clearTimeout(timeout1);
			// clearTimeout(timeout2);
			// ...
			// clearInterval(interval1);

			callback();
		} catch (e) {
			callback();
		}
	}

	// If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
	// You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
	// /**
	//  * Is called if a subscribed object changes
	//  * @param {string} id
	//  * @param {ioBroker.Object | null | undefined} obj
	//  */
	// onObjectChange(id, obj) {
	// 	if (obj) {
	// 		// The object was changed
	// 		this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
	// 	} else {
	// 		// The object was deleted
	// 		this.log.info(`object ${id} deleted`);
	// 	}
	// }

	/**
	 * Is called if a subscribed state changes
	 * @param {string} id
	 * @param {ioBroker.State | null | undefined} state
	 */
	onStateChange(id, state) {
		if (state) {
			// The state was changed
			this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
		} else {
			// The state was deleted
			this.log.info(`state ${id} deleted`);
		}
	}

	// If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
	// /**
	//  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
	//  * Using this method requires "common.messagebox" property to be set to true in io-package.json
	//  * @param {ioBroker.Message} obj
	//  */
	// onMessage(obj) {
	// 	if (typeof obj === "object" && obj.message) {
	// 		if (obj.command === "send") {
	// 			// e.g. send email or pushover or whatever
	// 			this.log.info("send command");

	// 			// Send response in callback if required
	// 			if (obj.callback) this.sendTo(obj.from, obj.command, "Message received", obj.callback);
	// 		}
	// 	}
	// }
}

if (require.main !== module) {
	// Export the constructor in compact mode
	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	module.exports = (options) => new Deyesun(options);
} else {
	// otherwise start the instance directly
	new Deyesun();
}

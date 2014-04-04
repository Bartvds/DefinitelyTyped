/// <reference path="../../_ref.d.ts" />
/// <reference path="stats.ts" />

module DT {
	'use strict';

	var os = require('os');

	export interface ProbeReport {
		duration: number;
		freemem: NumberStats
	}

	export class Probe {
		pid: number;
		interval: any;
		delay: number;
		startTime: number;
		freemem: Statr;

		constructor(delay: number) {
			this.delay = delay;
			this.freemem = new Statr();
			this.start();
		}


		start(): void {
			if (this.interval) {
				clearInterval(this.interval);
			}
			this.startTime = Date.now();
			this.interval = setInterval(() => {
				this.freemem.add(os.freemem());
			}, this.delay);
		}

		stop(): void {
			if (this.interval) {
				clearInterval(this.interval);
				this.interval = null;
			}
		}

		reset(): void {
			this.startTime = 0;
			this.freemem.reset();
		}

		report(): ProbeReport {
			this.stop();
			return {
				duration: Date.now() - this.startTime,
				freemem: this.freemem.getResult()
			}
		}
	}
}

/// <reference path="../../_ref.d.ts" />

module DT {
	'use strict';

	export interface NumberStats {
		samples: number;
		avg: number;
		max: number;
		min: number;
	}

	export class Statr {

		samples: number[] = [];

		constructor () {

		}

		add(value: number): void {
			this.samples.push(value);
		}

		reset(): void {
			this.samples = [];
		}

		getResult(): NumberStats {
			var samples = this.samples.length;
			var res: NumberStats = {
				samples: samples,
				avg: 0,
				max: 0,
				min: 0
			};
			if (samples === 0) {
				return res;
			}
			this.samples.forEach((value: number) => {
				res.avg += value / samples;
				res.min = value < res.min ? value : res.min;
				res.max = value > res.max ? value : res.max;
			});

			return res
		}
	}
}

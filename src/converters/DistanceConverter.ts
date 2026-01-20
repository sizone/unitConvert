/**
 * @file DistanceConverter.ts
 * @author 김영찬
 * @since 2026-01-20
 * @description 거리(Distance) 단위 변환기 (mm, cm, m, km)
 */

import { UnitConverter } from '../UnitConverter';

export class DistanceConverter extends UnitConverter {
    constructor() {
        super();
        this.registerUnit([
            { unit: 'mm', unitValue: 1 },
            { unit: 'cm', unitValue: 10 },    // 1 cm = 10 mm
            { unit: 'm', unitValue: 100 },    // 1 m = 100 cm
            { unit: 'km', unitValue: 1000 }   // 1 km = 1000 m
        ]);
    }
}

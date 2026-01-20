/**
 * @file PowerCapacityConverter.ts
 * @author 김영찬
 * @since 2026-01-20
 * @description 전력 용량(Power Capacity) 단위 변환기 (W, kW 등)
 */

import { UnitConverter } from '../UnitConverter';

export class PowerCapacityConverter extends UnitConverter {
    constructor() {
        super();
        this.registerUnit([
            { unit: 'W', unitValue: 1 },
            { unit: 'kW', unitValue: 1000 },
            { unit: 'MW', unitValue: 1000 },
            { unit: 'GW', unitValue: 1000 },
            { unit: 'TW', unitValue: 1000 }
        ]);
    }
}

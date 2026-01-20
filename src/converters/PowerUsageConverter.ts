/**
 * @file PowerUsageConverter.ts
 * @author 김영찬
 * @since 2026-01-20
 * @description 전력 사용량(Power Usage) 단위 변환기 (Wh, kWh 등)
 */

import { UnitConverter } from '../UnitConverter';

export class PowerUsageConverter extends UnitConverter {
    constructor() {
        super();
        this.registerUnit([
            { unit: 'Wh', unitValue: 1 },
            { unit: 'kWh', unitValue: 1000 },
            { unit: 'MWh', unitValue: 1000 },
            { unit: 'GWh', unitValue: 1000 },
            { unit: 'TWh', unitValue: 1000 }
        ]);
    }
}

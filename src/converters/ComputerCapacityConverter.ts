/**
 * @file ComputerCapacityConverter.ts
 * @author 김영찬
 * @since 2026-01-20
 * @description 컴퓨터 용량 단위 변환기 구현체
 */

import { UnitConverter } from '../UnitConverter';

export class ComputerCapacityConverter extends UnitConverter {
    constructor() {
        super();
        this.registerUnit([
            { unit: 'Byte', unitValue: 1 },
            { unit: 'KB', unitValue: 1024 },
            { unit: 'MB', unitValue: 1024 },
            { unit: 'GB', unitValue: 1024 },
            { unit: 'TB', unitValue: 1024 },
            { unit: 'PB', unitValue: 1024 },
            { unit: 'EB', unitValue: 1024 },
            { unit: 'ZB', unitValue: 1024 },
            { unit: 'YB', unitValue: 1024 }
        ]);
    }
}

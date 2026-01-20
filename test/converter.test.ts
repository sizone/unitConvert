/**
 * @file converter.test.ts
 * @author 김영찬
 * @since 2026-01-20
 * @description UnitConverter 서브클래스들에 대한 테스트 코드입니다.
 */

import { expect } from 'chai';
import { UnitConverter } from '../src/UnitConverter';
import { ComputerCapacityConverter } from '../src/converters/ComputerCapacityConverter';
import { PowerCapacityConverter } from '../src/converters/PowerCapacityConverter';
import { DistanceConverter } from '../src/converters/DistanceConverter';
import { ComplexValueInput } from '../src/types';

describe('단위 변환기 (Domain Specific) 테스트', () => {

    describe('컴퓨터 용량 변환 (ComputerCapacityConverter)', () => {
        let converter: ComputerCapacityConverter;
        beforeEach(() => { converter = new ComputerCapacityConverter(); });

        it('1024 Byte -> 1 KB (convertTo)', () => {
            expect(converter.convertTo(1024, 'Byte', 'KB')).to.equal(1);
        });
        
        it('1 MB -> 1024 * 1024 Byte (convertTo)', () => {
             expect(converter.convertTo(1, 'MB', 'Byte')).to.equal(1048576);
        });

        it('최적 단위 변환 (formatBest) - 1048576 Byte -> 1 MB', () => {
             const result = converter.formatBest(1048576);
             expect(result).to.deep.equal({ value: 1, unit: 'MB' });
        });

        it('최적 단위 변환 (formatBest) - 2048 Byte -> 2 KB', () => {
             const result = converter.formatBest(2048);
             expect(result).to.deep.equal({ value: 2, unit: 'KB' });
        });
    });

    describe('전력 용량 변환 (PowerCapacityConverter)', () => {
        let converter: PowerCapacityConverter;
        beforeEach(() => { converter = new PowerCapacityConverter(); });

        it('1.5 GW -> 1500 MW', () => {
            expect(converter.convertTo(1.5, 'GW', 'MW')).to.equal(1500);
        });

        it('최적 단위 변환 (formatBest) - 1500 W -> 1.5 kW', () => {
            const result = converter.formatBest(1500);
            expect(result).to.deep.equal({ value: 1.5, unit: 'kW' });
        });
    });

    describe('거리 변환 (DistanceConverter)', () => {
        let converter: DistanceConverter;
        beforeEach(() => { converter = new DistanceConverter(); });

        it('10 cm -> 100 mm', () => {
            expect(converter.convertTo(10, 'cm', 'mm')).to.equal(100);
        });

        it('최적 단위 변환 (formatBest) - 1000 m -> 1 km', () => {
            // 1000 m = 1,000,000 mm (Base)
            // formatBest receives value in Base Unit.
            const valInBase = converter.convertTo(1000, 'm', 'mm');
            const result = converter.formatBest(valInBase, undefined);
            expect(result).to.deep.equal({ value: 1, unit: 'km' });
        });

        it('최적 단위 변환 (formatBest) - 100 cm -> 1 m', () => {
             // DistanceConverter: mm(1), cm(10), m(100), km(1000)
             // 100 cm = 1000 mm. Base = 1.
             // m unitValue = 100 * 10 * 1 = 1000 (relative step applied sequentially? Wait.)
             // Let's check logic:
             // mm=1 (Base)
             // cm=10 (Relative) -> Absolute: 10
             // m=100 (Relative) -> Absolute: 1000 (10*100)
             // km=1000 (Relative) -> Absolute: 1,000,000 (1000*1000)
             
             // 100 cm input.
             // Base Value calculation:
             // 100 * 10 (cm abs) = 1000.
             
             // Check against Absolute Units:
             // km (1,000,000) > 1000? No.
             // m (1,000) <= 1000? Yes.
             // Result: 1000 / 1000 = 1 m.
             
             const result = converter.formatBest(100, [{ unit: 'cm', unitValue: 10 }]); 
             // Caution: formatBest with fixedUnits argument treats input as "raw value" (usually base unit) if input is number.
             // If input is number `100` and units are Default Distance:
             // 100 (raw=mm) -> ?
             // mm(1): 100 >= 1 -> 100 mm
             // cm(10): 100 >= 10 -> 10 cm.
             // m(1000): 100 < 1000.
             // So 100 (mm) should come out as 10 cm.
             
             // Wait, the test case above said "100 cm -> 1 m".
             // If I pass `100` to formatBest, it assumes Base Unit (mm). So 100mm = 10cm.
             // NOT 1m. 1m = 1000mm.
             
             // If I want to test "100 cm -> 1 m", I should pass 100 * 10 = 1000 (mm) to formatBest.
             const valInBase = converter.convertTo(100, 'cm', 'mm');
             const result2 = converter.formatBest(valInBase);
             expect(result2).to.deep.equal({ value: 1, unit: 'm' });
        });
    });

    describe('복합 입력 포맷 테스트', () => {
        let converter: UnitConverter;
        beforeEach(() => { converter = new UnitConverter(); });

        it('복합 입력({value, unit[]}) 처리 결과도 객체로 반환해야 한다', () => {
             const input: ComplexValueInput = {
                value: 2048,
                unit: [
                    { unit: 'Byte', unitValue: 1 },
                    { unit: 'KB', unitValue: 1024 }
                ]
            };
            
            const result = converter.formatBest(input);
            expect(result).to.deep.equal({ value: 2, unit: 'KB' });
        });
    });
});

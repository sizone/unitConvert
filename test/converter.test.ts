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

        it('1024 Byte -> 1 KB', () => {
            expect(converter.convertTo(1024, 'Byte', 'KB')).to.equal(1);
        });
        
        it('1 MB -> 1024 * 1024 Byte', () => {
             expect(converter.convertTo(1, 'MB', 'Byte')).to.equal(1048576);
        });

        it('PB 변환 테스트 (PB -> TB)', () => {
            // 1 PB = 1024 TB
            expect(converter.convertTo(1, 'PB', 'TB')).to.equal(1024);
        });
    });

    describe('전력 용량 변환 (PowerCapacityConverter)', () => {
        let converter: PowerCapacityConverter;
        beforeEach(() => { converter = new PowerCapacityConverter(); });

        it('1000 W -> 1 kW', () => {
            expect(converter.convertTo(1000, 'W', 'kW')).to.equal(1);
        });

        it('1.5 GW -> 1500 MW', () => {
            // 1 GW = 1000 MW
            // 1.5 * 1000 = 1500
            expect(converter.convertTo(1.5, 'GW', 'MW')).to.equal(1500);
        });
    });

    describe('거리 변환 (DistanceConverter)', () => {
        let converter: DistanceConverter;
        beforeEach(() => { converter = new DistanceConverter(); });

        it('10 cm -> 100 mm (1cm = 10mm)', () => {
            expect(converter.convertTo(10, 'cm', 'mm')).to.equal(100);
        });

        it('100 cm -> 1 m', () => {
            expect(converter.convertTo(100, 'cm', 'm')).to.equal(1);
        });

        it('1 km -> 1000 m', () => {
            expect(converter.convertTo(1, 'km', 'm')).to.equal(1000);
        });

        it('1 km -> 100,000 cm', () => {
            // 1 km = 1000 m = 1000 * 100 cm = 100,000 cm
            expect(converter.convertTo(1, 'km', 'cm')).to.equal(100000);
        });
    });

    describe('기본 UnitConverter (사용자 정의)', () => {
        it('직접 상속/구현하여 사용 가능해야 한다', () => {
            class TimeConverter extends UnitConverter {
                constructor() {
                    super();
                    this.registerUnit([
                        { unit: 'Sec', unitValue: 1 },
                        { unit: 'Min', unitValue: 60 }
                    ]);
                }
            }
            const converter = new TimeConverter();
            expect(converter.convertTo(60, 'Sec', 'Min')).to.equal(1);
        });
    });
});

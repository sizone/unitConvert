/**
 * @file converter.test.ts
 * @author 김영찬
 * @since 2026-01-20
 * @description UnitConverter 클래스에 대한 테스트 코드입니다.
 */

import { expect } from 'chai';
import { UnitConverter } from '../src/UnitConverter';
import { ComplexValueInput } from '../src/types';

describe('단위 변환기 (UnitConverter) 테스트', () => {
    let converter: UnitConverter;

    beforeEach(() => {
        converter = new UnitConverter();
    });

    describe('기본 용량 변환 테스트', () => {
        it('값을 입력받아 Byte를 KB로 변환할 수 있어야 한다', () => {
            // 1024 Byte -> 1 KB
            const result = converter.convertTo(1024, 'Byte', 'KB');
            expect(result).to.equal(1);
        });

        it('값을 입력받아 KB를 MB로 변환할 수 있어야 한다', () => {
            // 1024 KB -> 1 MB
            const result = converter.convertTo(1024, 'KB', 'MB');
            expect(result).to.equal(1);
        });

        it('값을 입력받아 MB를 Byte로 변환할 수 있어야 한다', () => {
            // 1 MB -> 1024 * 1024 Byte
            const result = converter.convertTo(1, 'MB', 'Byte');
            expect(result).to.equal(1048576);
        });
    });

    describe('최적 단위 표시 기능 테스트 (formatBest)', () => {
        it('1024 Byte는 1 KB로 표시되어야 한다', () => {
            const result = converter.formatBest(1024);
            expect(result).to.equal('1 KB');
        });

        it('500 Byte는 500 Byte로 표시되어야 한다', () => {
            const result = converter.formatBest(500);
            expect(result).to.equal('500 Byte');
        });

        it('1048576 Byte는 1 MB로 표시되어야 한다', () => {
            const result = converter.formatBest(1048576);
            expect(result).to.equal('1 MB');
        });
        
        it('소수점이 있는 경우 최대 2자리까지 표시되어야 한다', () => {
            // 1500 Byte -> 1.46 KB
            const result = converter.formatBest(1500);
            expect(result).to.equal('1.46 KB');
        });
    });

    describe('사용자 정의 단위 및 입력 포맷 테스트', () => {
        it('사용자 정의 단위를 등록하고 변환할 수 있어야 한다', () => {
            // 새로운 단위 등록: Bit (1/8 Byte)
            // 하지만 현재 구현은 unitValue가 1보다 작을수 있는지 확인 필요.
            // 여기서는 Byte가 1이므로 Bit는 0.125
            converter.registerUnit([{ unit: 'Bit', unitValue: 0.125 }]);
            
            // 8 Bit -> 1 Byte
            const result = converter.convertTo(8, 'Bit', 'Byte');
            expect(result).to.equal(1);
        });

        it('복합 입력 포맷({value, unit[]})을 처리할 수 있어야 한다 (Rule 2)', () => {
            const input: ComplexValueInput = {
                value: 2048,
                unit: [
                    { unit: 'Byte', unitValue: 1 },
                    { unit: 'KB', unitValue: 1024 }
                ]
            };
            
            // 2048 (Base=1) -> 2 KB
            const result = converter.formatBest(input);
            expect(result).to.equal('2 KB');
        });

        it('복합 입력 포맷에서 해당 단위 체계에 맞는 최적 단위를 찾아야 한다', () => {
            const input: ComplexValueInput = {
                value: 5000,
                unit: [
                    { unit: 'Sec', unitValue: 1 },
                    { unit: 'Min', unitValue: 60 },
                    { unit: 'Hour', unitValue: 3600 }
                ]
            };
            
            // 5000 Sec -> 5000/3600 = 1.38 Hour
            const result = converter.formatBest(input);
            expect(result).to.equal('1.39 Hour');
        });
    });
});

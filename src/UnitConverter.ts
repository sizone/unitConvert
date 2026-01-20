/**
 * @file UnitConverter.ts
 * @author 김영찬
 * @since 2026-01-20
 * @description 단위 변환 기능 및 최적 단위 표시 기능을 제공하는 메인 클래스입니다. (상대적 배수 로직 적용)
 */

import { UnitDefinition, ComplexValueInput, UnitOutput } from './types';

/**
 * 단위 변환기 클래스
 */
export class UnitConverter {
    private units: UnitDefinition[] = [];

    /**
     * 생성자
     * @description 빈 단위 목록으로 초기화합니다.
     */
    constructor() {
        // 기본 단위 없음 (서브 클래스 또는 registerUnit으로 등록)
    }

    /**
     * 단위 등록 (Rule 5)
     * @param units 단위 정의 목록 (기존 단위 목록 뒤에 추가됨)
     */
    public registerUnit(units: UnitDefinition[]): void {
        this.units = [...this.units, ...units];
        // 정렬하지 않음 (순서가 계산 로직에 중요함)
    }

    /**
     * 단위 목록을 절대 값(Base 기준)으로 변환하여 반환
     */
    private getAbsoluteUnits(units: UnitDefinition[]): UnitDefinition[] {
        let currentMultiplier = 1;
        
        return units.map((u, index) => {
            if (index === 0) {
                currentMultiplier = u.unitValue;
            } else {
                currentMultiplier *= u.unitValue;
            }
            
            return {
                unit: u.unit,
                unitValue: currentMultiplier
            };
        });
    }

    /**
     * 특정 단위로 값 변환 (Rule 1, Rule 4)
     * @param value 값
     * @param fromUnit 현재 단위 (문자열)
     * @param toUnit 변환할 단위 (문자열)
     * @returns 변환된 값
     */
    public convertTo(value: number, fromUnit: string, toUnit: string): number {
        const absoluteUnits = this.getAbsoluteUnits(this.units);
        const fromDef = absoluteUnits.find(u => u.unit === fromUnit);
        const toDef = absoluteUnits.find(u => u.unit === toUnit);

        if (!fromDef || !toDef) {
            throw new Error(`Unit not found: ${!fromDef ? fromUnit : toUnit}`);
        }

        const baseValue = value * fromDef.unitValue;
        return baseValue / toDef.unitValue;
    }

    /**
     * 입력 값을 받아 최적의 단위로 변환 (Rule 1, Rule 2, Rule 3)
     * @param input 복합 입력 값 ({value, unit[]}) 또는 단순 값
     * @param fixedUnits 사용할 단위 목록 (없으면 등록된 단위 사용)
     * @returns 변환된 결과 객체 { value, unit }
     */
    public formatBest(input: number, fixedUnits?: UnitDefinition[]): UnitOutput;
    public formatBest(input: ComplexValueInput): UnitOutput;
    public formatBest(input: number | ComplexValueInput, fixedUnits?: UnitDefinition[]): UnitOutput {
        let value: number;
        let originalUnitDefs: UnitDefinition[];

        if (typeof input === 'object' && 'unit' in input) {
            value = input.value;
            originalUnitDefs = input.unit;
        } else {
            value = input;
            originalUnitDefs = fixedUnits || this.units;
        }

        if (originalUnitDefs.length === 0) {
            return { value, unit: '' };
        }

        // 절대 값으로 변환하여 계산
        const absoluteUnits = this.getAbsoluteUnits(originalUnitDefs);

        // 가장 큰 단위부터 확인
        for (let i = absoluteUnits.length - 1; i >= 0; i--) {
            const unit = absoluteUnits[i];
            
            // 값이 해당 단위의 '단위 값'보다 크거나 같으면 사용
            // 단, 절대값 기준
            if (Math.abs(value) >= unit.unitValue) {
                const converted = value / unit.unitValue;
                const formattedValue = Number.isInteger(converted) 
                    ? converted 
                    : parseFloat(converted.toFixed(2));
                
                return { value: formattedValue, unit: unit.unit };
            }
        }

        // 가장 작은 단위보다도 작을 경우 (가장 작은 단위로 표시)
        const smallest = absoluteUnits[0];
        const converted = value / smallest.unitValue;
        const formattedValue = Number.isInteger(converted) 
            ? converted 
            : parseFloat(converted.toFixed(2));
            
        return { value: formattedValue, unit: smallest.unit };
    }

    /**
     * 현재 등록된 단위 목록 반환 (원본, 상대적 값 포함)
     */
    public getUnits(): UnitDefinition[] {
        return this.units;
    }
}

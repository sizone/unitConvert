/**
 * @file UnitConverter.ts
 * @author 김영찬
 * @since 2026-01-20
 * @description 단위 변환 기능 및 최적 단위 표시 기능을 제공하는 메인 클래스입니다.
 */

import { UnitDefinition, ComplexValueInput } from './types';

/**
 * 단위 변환기 클래스
 */
export class UnitConverter {
    private units: UnitDefinition[] = [];

    /**
     * 생성자
     * @description 기본 컴퓨터 용량 단위(Byte, KB, MB, GB, TB, PB)를 초기화합니다.
     */
    constructor() {
        this.registerDefaultUnits();
    }

    /**
     * 기본 컴퓨터 용량 단위 등록
     */
    private registerDefaultUnits(): void {
        this.units = [
            { unit: 'Byte', unitValue: 1 },
            { unit: 'KB', unitValue: 1024 },
            { unit: 'MB', unitValue: 1024 * 1024 },
            { unit: 'GB', unitValue: 1024 * 1024 * 1024 },
            { unit: 'TB', unitValue: 1024 * 1024 * 1024 * 1024 },
            { unit: 'PB', unitValue: 1024 * 1024 * 1024 * 1024 * 1024 }
        ];
    }

    /**
     * 단위 등록 (Rule 5)
     * @param units 단위 정의 목록
     */
    public registerUnit(units: UnitDefinition[]): void {
        this.units = [...this.units, ...units];
        // unitValue 기준으로 오름차순 정렬 (계산 편의성)
        this.units.sort((a, b) => a.unitValue - b.unitValue);
    }

    /**
     * 특정 단위로 값 변환 (Rule 1, Rule 4)
     * @param value 값
     * @param fromUnit 현재 단위 (문자열)
     * @param toUnit 변환할 단위 (문자열)
     * @returns 변환된 값
     */
    public convertTo(value: number, fromUnit: string, toUnit: string): number {
        const fromDef = this.findUnit(fromUnit);
        const toDef = this.findUnit(toUnit);

        if (!fromDef || !toDef) {
            throw new Error(`Unit not found: ${!fromDef ? fromUnit : toUnit}`);
        }

        // 기본 단위 값으로 변환 후 목표 단위로 변환
        // 예: 1 KB (1024) -> MB (1024*1024)
        // 1 * 1024 / (1024*1024) = 0.0009765625
        const baseValue = value * fromDef.unitValue;
        return baseValue / toDef.unitValue;
    }

    /**
     * 입력 값을 받아 최적의 단위로 변환 (Rule 1, Rule 2, Rule 3)
     * @param input 복합 입력 값 ({value, unit[]}) 또는 단순 값
     * @param fixedUnits 사용할 단위 목록 (없으면 등록된 단위 사용)
     * @returns 변환된 문자열 (예: "100 MB")
     */
    public formatBest(input: number, fixedUnits?: UnitDefinition[]): string;
    public formatBest(input: ComplexValueInput): string;
    public formatBest(input: number | ComplexValueInput, fixedUnits?: UnitDefinition[]): string {
        let value: number;
        let unitDefs: UnitDefinition[];

        if (typeof input === 'object' && 'unit' in input) {
            // Rule 2 Case
            // 입력값은 기본 단위(unitValue:1 또는 가장 작은 단위) 기준이라고 가정하거나,
            // 아니면 입력 구조에 대한 명확한 정의가 필요함.
            // 여기서는 입력된 value가 제공된 unit[0] (혹은 unitValue=1)이 아니라,
            // 제공된 unit 리스트를 '사용할 단위 체계'로 보고, 
            // value는 그 체계의 가장 작은 단위(혹은 기준 값)라고 가정함.
            // *주의*: 요구사항의 예시가 모호하므로, 값은 Base Unit 기준이라고 가정.
            value = input.value;
            unitDefs = input.unit;
            // 정렬
            unitDefs.sort((a, b) => a.unitValue - b.unitValue);
        } else {
            value = input;
            unitDefs = fixedUnits || this.units;
        }

        if (unitDefs.length === 0) return `${value}`;

        // 가장 큰 단위부터 확인하여 값이 >= 1 인지 확인 (혹은 가장 적절한 단위)
        // 오름차순 정렬되어 있다고 가정
        // 예: 1000 Byte -> Byte (1000 >= 1)
        // 1024 Byte -> KB (1024 >= 1024) => 1 KB
        
        // 뒤(큰 단위)에서부터 탐색
        for (let i = unitDefs.length - 1; i >= 0; i--) {
            const unit = unitDefs[i];
            if (value >= unit.unitValue) {
                const converted = value / unit.unitValue;
                // 정수로 딱 떨어지거나, 소수점 2자리까지 표시
                const formatted = Number.isInteger(converted) ? converted : converted.toFixed(2);
                return `${formatted} ${unit.unit}`;
            }
        }

        // 가장 작은 단위보다도 작을 경우, 가장 작은 단위로 표시
        const smallest = unitDefs[0];
        const converted = value / smallest.unitValue;
        const formatted = Number.isInteger(converted) ? converted : converted.toFixed(2);
        return `${formatted} ${smallest.unit}`;
    }

    /**
     * 단위 정의 검색
     */
    private findUnit(unitName: string): UnitDefinition | undefined {
        return this.units.find(u => u.unit === unitName);
    }
    
    /**
     * 현재 등록된 단위 목록 반환
     */
    public getUnits(): UnitDefinition[] {
        return this.units;
    }
}

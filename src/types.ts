/**
 * @file types.ts
 * @author 김영찬
 * @since 2026-01-20
 * @description 단위 변환기에서 사용하는 타입 정의 파일입니다.
 */

/**
 * 단위 정의 인터페이스
 * @interface UnitDefinition
 */
export interface UnitDefinition {
    /**
     * 단위 명칭 (예: 'Byte', 'KB')
     */
    unit: string;

    /**
     * 단위 값 (이전 단위 기준 배수, 첫 번째 단위는 절대 값)
     */
    unitValue: number;
}

/**
 * 복잡한 입력 값 구조
 * @description 값과 해당 값의 단위 정의 목록을 포함하는 입력 형태입니다.
 */
export interface ComplexValueInput {
    /**
     * 변환할 값
     */
    value: number;

    /**
     * 단위 정의 목록
     */
    unit: UnitDefinition[];
}

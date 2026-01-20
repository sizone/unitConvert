# UnitConvert

TypeScript 기반의 강력하고 유연한 단위 변환 라이브러리입니다.
컴퓨터 용량, 전력, 거리 등 다양한 도메인의 단위 변환을 지원하며, 사용자 정의 단위를 쉽게 확장할 수 있습니다.

## 설치 (Installation)

```bash
npm install unitconvert
```

## 주요 기능 (Features)

- **다양한 기본 변환기 제공**: 컴퓨터 용량, 전력 용량/사용량, 거리 등
- **상대적 단위 정의**: 이전 단위 대비 배수(Step)를 통한 직관적인 단위 정의
- **최적 단위 자동 변환**: 값을 가장 읽기 쉬운 단위로 자동 포맷팅 (`formatBest`)
- **타입 안전성**: TypeScript로 작성되어 완벽한 타입 지원
- **확장 가능**: `UnitConverter` 클래스를 상속받아 나만의 변환기 제작 가능

## 사용법 (Usage)

### 1. 컴퓨터 용량 변환 (Computer Capacity)

Byte, KB, MB, GB, TB, PB, EB, ZB, YB 등을 지원합니다. (1024 배수 기준)

```typescript
import { ComputerCapacityConverter } from 'unitconvert';

const converter = new ComputerCapacityConverter();

// 1. 단순 단위 변환
// 1024 Byte -> 1 KB
console.log(converter.convertTo(1024, 'Byte', 'KB')); // 1

// 1 MB -> Byte
console.log(converter.convertTo(1, 'MB', 'Byte')); // 1048576

// 2. 최적 단위 자동 포맷팅
console.log(converter.formatBest(1048576)); // "1 MB"
console.log(converter.formatBest(2048));    // "2 KB"
```

### 2. 거리 변환 (Distance)

mm, cm(10), m(100), km(1000) 단위를 지원합니다.

```typescript
import { DistanceConverter } from 'unitconvert';

const distConverter = new DistanceConverter();

// 1 km -> m
console.log(distConverter.convertTo(1, 'km', 'm')); // 1000

// 100 cm -> 1 m
console.log(distConverter.formatBest(100, undefined)); // "10 cm" 가 아니라 최적 단위인 "1 m"로 변환 (로직에 따라 다름)
// formatBest는 값이 1 이상이 되는 가장 큰 단위를 찾습니다.
```

### 3. 전력 변환 (Power)

- **PowerCapacityConverter**: W, kW, MW, GW, TW (1000 배수)
- **PowerUsageConverter**: Wh, kWh, MWh, GWh, TWh (1000 배수)

```typescript
import { PowerCapacityConverter } from 'unitconvert';

const powerConverter = new PowerCapacityConverter();
console.log(powerConverter.formatBest(1500)); // "1.5 kW" (기본 단위 W 기준)
```

## 고급 사용법 (Advanced)

### 사용자 정의 단위 추가 (Custom Units)

기존 변환기에 새로운 단위를 추가할 수 있습니다. `registerUnit`으로 추가하는 단위는 **마지막 단위**를 기준으로 계산됩니다.

```typescript
const converter = new ComputerCapacityConverter();
// YB(YottaByte) 다음 단위로 BrontoByte(BB)를 추가한다고 가정 (1024배)
converter.registerUnit([{ unit: 'BB', unitValue: 1024 }]);
```

### 나만의 변환기 만들기 (Custom Converter)

`UnitConverter`를 상속받아 새로운 도메인의 변환기를 만들 수 있습니다.

```typescript
import { UnitConverter } from 'unitconvert';

class TimeConverter extends UnitConverter {
    constructor() {
        super();
        this.registerUnit([
            { unit: 'Sec', unitValue: 1 },      // 기준 단위
            { unit: 'Min', unitValue: 60 },     // 이전 단위(Sec) * 60
            { unit: 'Hour', unitValue: 60 },    // 이전 단위(Min) * 60
            { unit: 'Day', unitValue: 24 }      // 이전 단위(Hour) * 24
        ]);
    }
}

const timeConverter = new TimeConverter();
console.log(timeConverter.formatBest(3600)); // "1 Hour"
```

### 복합 입력값 처리

값과 단위 정의를 객체로 전달하여 처리할 수도 있습니다. 이 경우 동적으로 전달된 단위 정의를 사용합니다.

```typescript
const complexInput = {
    value: 2048,
    unit: [
        { unit: 'Byte', unitValue: 1 },
        { unit: 'KB', unitValue: 1024 }
    ]
};
// converter 인스턴스의 종류와 상관없이 formatBest는 입력받은 unit 정의를 우선할 수 있습니다.
// (단, formatBest 구현 상세에 따라 사용법이 다를 수 있음. 주로 내부 로직용)
```

## 라이선스

MIT

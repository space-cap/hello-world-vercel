// tests/utils.js - 테스트용 공통 함수들
function extractRegionFromAddress(address) {
    if (!address) return "서울";
    
    const cleanAddress = address.replace(/\([^)]*\)/g, '').trim();
    
    const patterns = [
        // 광역시/특별시 + 구 + 동
        /(?:서울특별시|부산광역시|대구광역시|인천광역시|광주광역시|대전광역시|울산광역시|세종특별자치시)\s*(\S+구)\s*(\S+동)/,
        
        // 광역시/특별시 + 구
        /(?:서울특별시|부산광역시|대구광역시|인천광역시|광주광역시|대전광역시|울산광역시|세종특별자치시)\s*(\S+구)/,
        
        // 도 + 시 + 구 + 동
        /(?:경기도|강원도|충청북도|충청남도|전라북도|전라남도|경상북도|경상남도|제주특별자치도)\s*(\S+시)\s*(\S+구)\s*(\S+동)/,
        
        // 도 + 시 + 구
        /(?:경기도|강원도|충청북도|충청남도|전라북도|전라남도|경상북도|경상남도|제주특별자치도)\s*(\S+시)\s*(\S+구)/,
        
        // 도 + 시 + 읍면동
        /(?:경기도|강원도|충청북도|충청남도|전라북도|전라남도|경상북도|경상남도|제주특별자치도)\s*(\S+시)\s*(\S+(?:읍|면|동))/,
        
        // 도 + 군 + 읍면
        /(?:경기도|강원도|충청북도|충청남도|전라북도|전라남도|경상북도|경상남도|제주특별자치도)\s*(\S+군)\s*(\S+(?:읍|면))/,
        
        // 도 + 시
        /(?:경기도|강원도|충청북도|충청남도|전라북도|전라남도|경상북도|경상남도|제주특별자치도)\s*(\S+시)/,
        
        // 간단한 패턴들
        /(\S+구)\s*(\S+동)/,
        /(\S+시)\s*(\S+구)/,
        /(\S+시)\s*(\S+(?:읍|면|동))/,
        /(\S+군)\s*(\S+(?:읍|면))/,
        /(\S+구)/,
        /(\S+시)/,
        /(\S+군)/,
    ];
    
    for (const pattern of patterns) {
        const match = cleanAddress.match(pattern);
        if (match) {
            if (match[3]) {
                return `${match[1]} ${match[2]} ${match[3]}`;
            } else if (match[2]) {
                return `${match[1]} ${match[2]}`;
            } else {
                return match[1];
            }
        }
    }
    
    const words = cleanAddress.split(' ').filter(word => word.length > 1);
    return words[0] || "서울";
}

// 테스트 데이터
const TEST_ADDRESSES = [
    // 서울
    { addr: "서울특별시 강남구 역삼동 123", expected: "강남구 역삼동" },
    { addr: "서울 동대문구 제기동 1012", expected: "동대문구 제기동" },
    { addr: "서울시 송파구 잠실동", expected: "송파구 잠실동" },
    
    // 부산
    { addr: "부산광역시 해운대구 우동 456", expected: "해운대구 우동" },
    { addr: "부산 사하구 괴정동", expected: "사하구 괴정동" },
    
    // 경기도
    { addr: "경기도 수원시 영통구 매탄동", expected: "수원시 영통구 매탄동" },
    { addr: "경기도 성남시 분당구 정자동", expected: "성남시 분당구 정자동" },
    { addr: "경기도 안양시 만안구 안양동", expected: "안양시 만안구 안양동" },
    { addr: "경기도 화성시 동탄면", expected: "화성시 동탄면" },
    { addr: "경기도 용인시 수지구", expected: "용인시 수지구" },
    
    // 강원도
    { addr: "강원도 춘천시 춘천동", expected: "춘천시 춘천동" },
    { addr: "강원도 원주시 단계동", expected: "원주시 단계동" },
    { addr: "강원도 평창군 진부면", expected: "평창군 진부면" },
    
    // 충청도
    { addr: "충청북도 청주시 상당구 우암동", expected: "청주시 상당구 우암동" },
    { addr: "충청남도 천안시 동남구 신부동", expected: "천안시 동남구 신부동" },
    { addr: "충청남도 보령시 대천동", expected: "보령시 대천동" },
    
    // 전라도
    { addr: "전라북도 전주시 완산구 중앙동", expected: "전주시 완산구 중앙동" },
    { addr: "전라남도 광양시 중동", expected: "광양시 중동" },
    { addr: "전라남도 무안군 무안읍", expected: "무안군 무안읍" },
    
    // 경상도
    { addr: "경상북도 포항시 북구 죽도동", expected: "포항시 북구 죽도동" },
    { addr: "경상남도 창원시 의창구 팔용동", expected: "창원시 의창구 팔용동" },
    { addr: "경상남도 거제시 고현동", expected: "거제시 고현동" },
    
    // 제주도
    { addr: "제주특별자치도 제주시 일도이동", expected: "제주시 일도이동" },
    { addr: "제주도 서귀포시 중문동", expected: "서귀포시 중문동" },
    
    // 간단한 형태
    { addr: "강남구 역삼동", expected: "강남구 역삼동" },
    { addr: "분당구 정자동", expected: "분당구 정자동" },
    { addr: "해운대구 우동", expected: "해운대구 우동" }
];

// 공통 테스트 함수들
function runTestCase(address, expected) {
    const result = extractRegionFromAddress(address);
    const isCorrect = expected ? result === expected : true;
    
    return {
        address: address,
        result: result,
        expected: expected,
        query: `${result} 치과`,
        isCorrect: isCorrect
    };
}

function runAllTests() {
    return TEST_ADDRESSES.map(test => 
        runTestCase(test.addr, test.expected)
    );
}

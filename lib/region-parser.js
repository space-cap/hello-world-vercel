// lib/region-parser.js - 공통 지역명 추출 모듈
/**
 * 전국 주소에서 네이버 API 검색용 지역명을 추출합니다
 * @param {string} address - 추출할 주소
 * @returns {string} - 추출된 지역명
 */
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
    return words || "서울";
}

// 테스트 데이터도 공통으로 관리
const TEST_ADDRESSES = [
    { addr: "서울특별시 강남구 역삼동 123", expected: "강남구 역삼동" },
    { addr: "서울 동대문구 제기동 1012", expected: "동대문구 제기동" },
    { addr: "부산광역시 해운대구 우동 456", expected: "해운대구 우동" },
    { addr: "경기도 수원시 영통구 매탄동", expected: "수원시 영통구 매탄동" },
    { addr: "강원도 춘천시 춘천동", expected: "춘천시 춘천동" },
    { addr: "충청북도 청주시 상당구 우암동", expected: "청주시 상당구 우암동" },
    { addr: "전라북도 전주시 완산구 중앙동", expected: "전주시 완산구 중앙동" },
    { addr: "경상남도 창원시 의창구 팔용동", expected: "창원시 의창구 팔용동" },
    { addr: "제주특별자치도 제주시 일도이동", expected: "제주시 일도이동" },
    { addr: "강남구 역삼동", expected: "강남구 역삼동" }
];

// Node.js와 브라우저 환경 모두 지원
if (typeof module !== 'undefined' && module.exports) {
    // Node.js 환경 (서버사이드)
    module.exports = {
        extractRegionFromAddress,
        TEST_ADDRESSES
    };
} else if (typeof window !== 'undefined') {
    // 브라우저 환경 (클라이언트사이드)
    window.RegionParser = {
        extractRegionFromAddress,
        TEST_ADDRESSES
    };
}

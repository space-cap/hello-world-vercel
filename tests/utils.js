// tests/utils.js - 공통 모듈 사용
// 공통 모듈을 import하여 사용
function loadRegionParser() {
    // 브라우저 환경에서 공통 모듈 로드
    const script = document.createElement('script');
    script.src = '../lib/region-parser.js';
    document.head.appendChild(script);
}

// 공통 모듈이 로드될 때까지 기다리는 함수
function waitForRegionParser() {
    return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
            if (window.RegionParser) {
                clearInterval(checkInterval);
                resolve(window.RegionParser);
            }
        }, 100);
    });
}

// 테스트 함수들
function runTestCase(address, expected) {
    const result = window.RegionParser.extractRegionFromAddress(address);
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
    return window.RegionParser.TEST_ADDRESSES.map(test => 
        runTestCase(test.addr, test.expected)
    );
}

// 페이지 로드 시 공통 모듈 로드
loadRegionParser();

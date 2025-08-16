// api/search-dentists.js (Vercel Serverless Function)
export default async function handler(req, res) {
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { query, display = 10 } = req.query;
    
    if (!query) {
        return res.status(400).json({ error: '검색어가 필요합니다' });
    }
    
    try {
        const response = await fetch(
            `https://openapi.naver.com/v1/search/local.json?query=${encodeURIComponent(query + ' 치과')}&display=${display}`,
            {
                method: 'GET',
                headers: {
                    'X-Naver-Client-Id': process.env.NAVER_CLIENT_ID,
                    'X-Naver-Client-Secret': process.env.NAVER_CLIENT_SECRET,
                }
            }
        );
                
        if (!response.ok) {
            throw new Error(`API 호출 실패: ${response.status}`);
        }

        const data = await response.json();

        // 🔍 서버에서 원본 응답 로깅
        console.log('=== 네이버 API 원본 응답 ===');
        console.log(JSON.stringify(data, null, 2));

        // 각 항목의 telephone 필드 확인
        data.items.forEach((item, index) => {
            console.log(`치과 ${index + 1} - 전화번호:`, item.telephone);
        });
        
        // 데이터 정제
        const dentists = data.items.map(item => ({
            name: item.title.replace(/<[^>]*>/g, ''), // HTML 태그 제거
            address: item.address,
            roadAddress: item.roadAddress,
            telephone: item.telephone || '⚠️ 전화번호 정보 없음 (네이버 정책상 제공 안됨)',
            category: item.category,
            mapx: item.mapx,
            mapy: item.mapy,
            // 🔍 디버깅용 원본 데이터 추가
            originalData: item
        }));
        
        res.status(200).json({
            success: true,
            total: data.total,
            items: dentists,
            // 🔍 디버깅용 원본 응답 포함
            debug: {
                originalResponse: data
            }
        });
        
    } catch (error) {
        console.error('네이버 API 호출 오류:', error);
        res.status(500).json({
            success: false,
            error: '치과 검색 중 오류가 발생했습니다.'
        });
    }
}

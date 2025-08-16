// api/search-dentists.js (Vercel Serverless Function)
export default async function handler(req, res) {
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { query, display = 5 } = req.query;
    
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
        
        // 데이터 정제
        const dentists = data.items.map(item => ({
            name: item.title.replace(/<[^>]*>/g, ''), // HTML 태그 제거
            address: item.address,
            roadAddress: item.roadAddress,
            telephone: item.telephone || '전화번호 없음',
            category: item.category,
            mapx: item.mapx,
            mapy: item.mapy
        }));
        
        res.status(200).json({
            success: true,
            total: data.total,
            items: dentists
        });
        
    } catch (error) {
        console.error('네이버 API 호출 오류:', error);
        res.status(500).json({
            success: false,
            error: '치과 검색 중 오류가 발생했습니다.'
        });
    }
}

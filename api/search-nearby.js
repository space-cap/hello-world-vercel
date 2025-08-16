// api/search-nearby.js
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    const { lat, lng, radius = 1000, exclude } = req.query;
    
    if (!lat || !lng) {
        return res.status(400).json({ error: '위도와 경도가 필요합니다' });
    }
    
    try {
        // 중심점 기준으로 넓은 범위 검색 (네이버 API는 정확한 반경 검색 미지원)
        const response = await fetch(
            `https://openapi.naver.com/v1/search/local.json?query=치과&display=50`,
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
        
        // 거리 계산 함수
        function calculateDistance(lat1, lng1, lat2, lng2) {
            const R = 6371000; // 지구 반지름 (미터)
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLng = (lng2 - lng1) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                      Math.sin(dLng/2) * Math.sin(dLng/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            return R * c;
        }
        
        const centerLat = parseFloat(lat);
        const centerLng = parseFloat(lng);
        const radiusMeters = parseInt(radius);
        
        // 반경 내 치과 필터링
        const nearbyDentists = [];
        
        data.items.forEach(item => {
            const itemLat = item.mapy / 10000000;
            const itemLng = item.mapx / 10000000;
            
            if (itemLat && itemLng) {
                const distance = calculateDistance(centerLat, centerLng, itemLat, itemLng);
                const name = item.title.replace(/<[^>]*>/g, '');
                
                // 반경 내에 있고, 제외할 치과가 아닌 경우
                if (distance <= radiusMeters && name !== exclude) {
                    nearbyDentists.push({
                        name: name,
                        address: item.address,
                        roadAddress: item.roadAddress,
                        telephone: item.telephone || '전화번호 없음',
                        category: item.category,
                        mapx: item.mapx,
                        mapy: item.mapy,
                        distance: Math.round(distance), // 미터 단위
                        distanceText: distance < 1000 ? 
                            `${Math.round(distance)}m` : 
                            `${(distance/1000).toFixed(1)}km`
                    });
                }
            }
        });
        
        // 거리순 정렬
        nearbyDentists.sort((a, b) => a.distance - b.distance);
        
        console.log(`반경 ${radiusMeters}m 내 ${nearbyDentists.length}개 치과 발견`);
        
        res.status(200).json({
            success: true,
            center: { lat: centerLat, lng: centerLng },
            radius: radiusMeters,
            total: nearbyDentists.length,
            items: nearbyDentists.slice(0, 20) // 최대 20개만 반환
        });
        
    } catch (error) {
        console.error('주변 치과 검색 오류:', error);
        res.status(500).json({
            success: false,
            error: '주변 치과 검색 중 오류가 발생했습니다.',
            details: error.message
        });
    }
}

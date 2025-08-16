export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    
    // 지도 API는 클라이언트에서 사용해도 비교적 안전
    res.status(200).json({
        mapClientId: process.env.NAVER_MAP_CLIENT_ID
    });
}

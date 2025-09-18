export const chatService = {
  async sendMessage({ query, profession = '학생', userId = null }) {
    try {
      const response = await fetch(`${import.meta.env.VITE_AI_BASE_URL}/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
          student_id: userId || 1, // 기본값으로 1 사용
          profession,
          query
        }),
      });

      if (!response.ok) {
        throw new Error(`Chat API failed: ${response.status}`);
      }

      const data = await response.json();
      return {
        answer: data.answer || data.answer_md || '응답을 받지 못했습니다.',
        topMatches: data.top_matches || [],
        success: true
      };
    } catch (error) {
      console.error('Chat API error:', error);
      
      // 더미 응답 반환 (API 실패시)
      return {
        answer: `죄송합니다. 현재 채팅 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요."`,
        topMatches: [],
        success: false,
        error: error.message
      };
    }
  }
};
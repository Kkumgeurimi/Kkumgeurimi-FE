import http from './http.js';

export const meService = {
  // 내 프로필 조회
  async getProfile() {
    const response = await http.get('/my');
    return response.data;
  },

  // 프로필 수정
  async updateProfile(profileData) {
    const response = await http.patch('/my', profileData);
    return response.data;
  },

  // 회원탈퇴
  async deleteAccount() {
    const response = await http.delete('/my');
    return response.data;
  },

  // 내 신청 목록 조회
  async getRegistrations(status = null) {
    const params = status ? { status } : {};
    const response = await http.get('/my/programs/registrations', { params });
    return response.data;
  },

  // 내 찜 목록 조회
  async getLikes() {
    const response = await http.get('/my/programs/likes');
    return response.data;
  },

  // 완료된 프로그램 목록 조회
  async getCompletedPrograms() {
    const response = await http.get('/my/completed');
    return response.data;
  },

  // 리뷰 작성
  async createReview(programRegistrationId, reviewData) {
    try {
      const requestPayload = {
        reviewScore: String(reviewData.score),
        reviewMessage: reviewData.message
      };

      const response = await http.post(`/reviews/${programRegistrationId}`, requestPayload);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 내 진로 정보 조회
  async getCareer() {
    const response = await http.get('/my/career');
    return response.data;
  },

  // 진로 정보 수정
  async updateCareer(careerData) {
    const response = await http.patch('/my/career', careerData);
    return response.data;
  },

  // 관심 분야 등록 (회원가입 시)
  async createInterests(interestData) {
    const response = await http.post('/my/interests', interestData);
    return response.data;
  },

  // 학교급 정보 조회
  async getSchoolLevel() {
    try {
      const response = await http.get('/my/schoollevel');
      return response.data;
    } catch (error) {
      console.error('학교급 조회 실패:', error);
      // 실패 시 기본값 '고' 반환
      return '고';
    }
  }
};

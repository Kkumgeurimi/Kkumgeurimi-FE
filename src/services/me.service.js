import http from './http.js';

export const meService = {
  // 내 프로필 조회
  async getProfile() {
    const response = await http.get('/me');
    return response.data;
  },

  // 프로필 수정
  async updateProfile(profileData) {
    const response = await http.patch('/me', profileData);
    return response.data;
  },

  // 회원탈퇴
  async deleteAccount() {
    const response = await http.delete('/me');
    return response.data;
  },

  // 내 신청 목록 조회
  async getRegistrations(status = null) {
    const params = status ? { status } : {};
    const response = await http.get('/me/registrations', { params });
    return response.data;
  },

  // 내 찜 목록 조회
  async getLikes() {
    const response = await http.get('/me/likes');
    return response.data;
  },

  // 내 진로 정보 조회
  async getCareer() {
    const response = await http.get('/me/career');
    return response.data;
  },

  // 진로 정보 수정
  async updateCareer(careerData) {
    const response = await http.patch('/me/career', careerData);
    return response.data;
  }
};

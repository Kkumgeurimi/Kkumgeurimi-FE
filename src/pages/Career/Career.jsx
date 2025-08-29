import React, { useState, useEffect } from 'react';
import { getMentorsForCareer } from '../../data/mentors.js';
import './Career.css';

// 멘토와 관심사 매핑
const mapMentorToInterest = (mentorId) => {
  const mapping = {
    'content-planner': 'planning',
    'marketing-specialist': 'marketing',
    'ux-ui-designer': 'design',
    'fullstack-developer': 'development',
    'data-scientist': 'data',
    'product-manager': 'planning'
  };
  return mapping[mentorId] || 'planning';
};

const Career = () => {
  const [currentState, setCurrentState] = useState('default');
  const [selectedInterest, setSelectedInterest] = useState(null);
  const [data, setData] = useState({
    interests: [],
    programs: [],
    mentors: []
  });

  // TODO: Replace with actual API call
  useEffect(() => {
    // Mock data - replace with actual server data
    const mockData = {
      interests: [
        { 
          id: 'planning', 
          name: '기획', 
          size: 'large', 
          color: '#ff7675', 
          x: 0, 
          y: 0, 
          weight: 85,
          title: '콘텐츠 기획자',
          description: `
            <h3>주요 업무</h3>
            <p>콘텐츠 기획자는 다양한 미디어 플랫폼에서 사용자에게 전달할 콘텐츠를 기획하고 제작하는 업무를 담당합니다.</p>
            <h3>필요 역량</h3>
            <p>창의적 사고력, 트렌드 감각, 기획력, 커뮤니케이션 능력, 데이터 분석 능력이 필요합니다.</p>
          `,
          background: 'bg-planning'
        },
        { 
          id: 'marketing', 
          name: '마케팅', 
          size: 'large', 
          color: '#fd79a8', 
          x: 200, 
          y: -50, 
          weight: 75,
          title: '마케팅 전문가',
          description: `
            <h3>주요 업무</h3>
            <p>마케팅 전문가는 제품이나 서비스의 시장 진입 전략을 수립하고 실행합니다.</p>
            <h3>필요 역량</h3>
            <p>시장 분석 능력, 창의적 사고, 데이터 분석 능력, 커뮤니케이션 스킬이 중요합니다.</p>
          `,
          background: 'bg-marketing'
        }
      ],
      programs: [
        { id: 'pm-mentoring', name: 'PM 직무\n멘토링', parentId: 'planning', size: 'small', color: '#fdcb6e', x: -120, y: -80, weight: 40 },
        { id: 'cj-career', name: 'CJ 진로\n직업탐색', parentId: 'planning', size: 'small', color: '#e17055', x: -50, y: -120, weight: 35 },
        { id: 'consumer-research', name: '소비자 인\n사이트 리서\n치 컨...', parentId: 'marketing', size: 'small', color: '#fab1a0', x: 80, y: -150, weight: 30 }
      ],
      mentors: getMentorsForCareer().map(mentor => ({
        ...mentor,
        interestId: mapMentorToInterest(mentor.id)
      }))
    };
    setData(mockData);
  }, []);

  const selectInterest = (interestId) => {
    const interest = data.interests.find(i => i.id === interestId);
    if (interest) {
      setSelectedInterest(interest);
      setCurrentState('detail');
    }
  };

  const resetToDefault = () => {
    setCurrentState('default');
    setSelectedInterest(null);
  };

  const renderBubbles = () => {
    const allBubbles = [...data.interests, ...data.programs];
    
    return allBubbles.map(bubble => {
      const isHidden = currentState === 'detail' && selectedInterest && 
        (bubble.id !== selectedInterest.id && bubble.parentId !== selectedInterest.id);
      
      const isSelected = currentState === 'detail' && selectedInterest && 
        (bubble.id === selectedInterest.id || bubble.parentId === selectedInterest.id);

      return (
        <div
          key={bubble.id}
          className={`interest-bubble bubble-${bubble.size} ${isHidden ? 'hidden' : ''} ${isSelected ? 'selected' : ''}`}
          style={{
            backgroundColor: bubble.color,
            left: `calc(50% + ${bubble.x}px - ${bubble.size === 'large' ? '75px' : bubble.size === 'medium' ? '50px' : '35px'})`,
            top: `calc(50% + ${bubble.y}px - ${bubble.size === 'large' ? '75px' : bubble.size === 'medium' ? '50px' : '35px'})`
          }}
          onClick={() => data.interests.find(i => i.id === bubble.id) && selectInterest(bubble.id)}
        >
          {bubble.name}
        </div>
      );
    });
  };

  const renderMentors = () => {
    if (!selectedInterest) return null;
    
    const mentors = data.mentors.filter(m => m.interestId === selectedInterest.id);
    
    return mentors.map(mentor => (
      <div key={mentor.id} className="mentor-card">
        <div className="mentor-avatar">
          <img src={mentor.avatar} alt={mentor.name} />
        </div>
        <div className="mentor-info">
          <h4>{mentor.name}</h4>
          <p>{mentor.description}</p>
        </div>
        <button className="chat-btn">대화하기</button>
      </div>
    ));
  };

  return (
    <div className={`career ${currentState === 'detail' ? 'detail-mode' : ''}`}>
      {currentState === 'detail' && (
        <button className="back-btn" onClick={resetToDefault}>←</button>
      )}
      
      <div className="container">
        <div className="header">
          {currentState === 'default' ? (
            <>
              <h1>나의 진로맵</h1>
              <p>나만의 관심사는</p>
              <h2>콘텐츠 기획, 마케팅, 디자인</h2>
            </>
          ) : (
            <h1>{selectedInterest?.name} 분야를 더 알아볼까요?</h1>
          )}
        </div>

        <div className="interest-map">
          {renderBubbles()}
        </div>

        {currentState === 'detail' && selectedInterest && (
          <div className="detail-section active">
            <div className="job-info">
              <h2>{selectedInterest.title}</h2>
              <div dangerouslySetInnerHTML={{ __html: selectedInterest.description }} />
            </div>

            <div className="mentor-section">
              <div className="mentor-header">
                <h3>관련 멘토</h3>
              </div>
              <div className="mentor-cards">
                {renderMentors()}
              </div>
            </div>
          </div>
        )}

        <div className="programs-section">
          <h2>
            {selectedInterest 
              ? `${selectedInterest.title} 관련 추천 프로그램`
              : '나에게 딱 맞는 추천 프로그램'
            }
          </h2>
          <div className="program-cards">
            <div className="program-card">
              <div className="program-icon" style={{ background: '#74b9ff' }}>🤖</div>
              <h3>AI 개발자 멘토링</h3>
              <p>AI 개발자가 어떻게 일하는지 멘토에게 직접 들어보세요</p>
            </div>
            <div className="program-card">
              <div className="program-icon" style={{ background: '#fd79a8' }}>🎨</div>
              <h3>프론트엔드 개발자 멘토링</h3>
              <p>프론트엔드 개발자가 어떻게 일하는지 배워요</p>
            </div>
            <div className="program-card">
              <div className="program-icon" style={{ background: '#fdcb6e' }}>📝</div>
              <h3>PM 직무 멘토링</h3>
              <p>프로덕트 매니저의 실무를 경험해보세요</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Career;
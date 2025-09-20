import React, { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';
import communityService from '../../services/community.service';
import './Community.css';

const Community = () => {
  const [currentView, setCurrentView] = useState('main'); // main, write, detail
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedPost, setSelectedPost] = useState(null);
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [selectedWriteCategory, setSelectedWriteCategory] = useState('진로·적성');
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    hashtag: ''
  });

  const [selectedImages, setSelectedImages] = useState([]);
  const [hashtagInput, setHashtagInput] = useState('');
  const [hashtags, setHashtags] = useState([]);
  const [isEditingHashtag, setIsEditingHashtag] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const fileInputRef = React.useRef(null);

  const categories = ['전체', '🔥 인기 추천', '문과', '이과', '예체능'];

  // 게시글 목록 조회
  const fetchPosts = async (page = 1, size = 10) => {
    setIsLoading(true);
    try {
      const response = await communityService.getPosts(page, size);
      if (page === 1) {
        setPosts(response.content || []);
      } else {
        setPosts(prev => [...prev, ...(response.content || [])]);
      }
      setCurrentPage(page);
      setTotalPages(response.totalPages || 0);
      setHasMore(page < response.totalPages);
    } catch (error) {
      console.error('게시글 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 게시글 상세 조회
  const fetchPostDetail = async (postId) => {
    try {
      const postDetail = await communityService.getPost(postId);
      setSelectedPost(postDetail);
      setCurrentView('detail');
    } catch (error) {
      console.error('게시글 상세 조회 실패:', error);
    }
  };

  // 댓글 작성
  const handleCommentSubmit = async () => {
    if (!commentInput.trim() || !selectedPost) return;

    try {
      await communityService.createComment(selectedPost.id, commentInput.trim());
      setCommentInput('');

      // 게시글 상세 정보를 다시 조회하여 댓글 목록 업데이트
      const updatedPost = await communityService.getPost(selectedPost.id);
      setSelectedPost(updatedPost);
    } catch (error) {
      console.error('댓글 작성 실패:', error);
    }
  };

  // 댓글 삭제
  const handleCommentDelete = async (commentId) => {
    try {
      await communityService.deleteComment(commentId);

      // 게시글 상세 정보를 다시 조회하여 댓글 목록 업데이트
      const updatedPost = await communityService.getPost(selectedPost.id);
      setSelectedPost(updatedPost);
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
    }
  };

  // 컴포넌트 마운트 시 게시글 조회
  useEffect(() => {
    fetchPosts();
  }, []);

  // Hide bottom navigation and header in detail/write view
  React.useEffect(() => {
    if (currentView === 'detail') {
      document.body.classList.add('community-detail-view');
      document.body.classList.remove('community-write-view');
    } else if (currentView === 'write') {
      document.body.classList.add('community-write-view');
      document.body.classList.remove('community-detail-view');
    } else {
      document.body.classList.remove('community-detail-view');
      document.body.classList.remove('community-write-view');
    }

    return () => {
      document.body.classList.remove('community-detail-view');
      document.body.classList.remove('community-write-view');
    };
  }, [currentView]);


  const handleLike = async (postId, e) => {
    e.stopPropagation(); // 게시글 클릭 방지

    try {
      await communityService.toggleLike(postId);

      const newLikedPosts = new Set(likedPosts);
      const newPosts = posts.map(post => {
        if (post.id === postId) {
          if (likedPosts.has(postId)) {
            newLikedPosts.delete(postId);
            return { ...post, likeCount: post.likeCount - 1 };
          } else {
            newLikedPosts.add(postId);
            return { ...post, likeCount: post.likeCount + 1 };
          }
        }
        return post;
      });
      setLikedPosts(newLikedPosts);
      setPosts(newPosts);

      // 상세페이지가 열려있으면 selectedPost의 likeCount만 업데이트
      if (selectedPost && selectedPost.id === postId) {
        if (likedPosts.has(postId)) {
          setSelectedPost({
            ...selectedPost,
            likeCount: selectedPost.likeCount - 1
          });
        } else {
          setSelectedPost({
            ...selectedPost,
            likeCount: selectedPost.likeCount + 1
          });
        }
      }
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
    }
  };

  const handleImageSelect = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 4 - selectedImages.length;
    const filesToAdd = files.slice(0, remainingSlots);

    filesToAdd.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImages(prev => [...prev, e.target.result]);
      };
      reader.readAsDataURL(file);
    });

    // Reset input
    e.target.value = '';
  };

  const handleHashtagKeyPress = (e) => {
    if (e.key === 'Enter' && hashtagInput.trim()) {
      setHashtags([...hashtags, hashtagInput.trim()]);
      setHashtagInput('');
      setIsEditingHashtag(false);
    } else if (e.key === 'Escape') {
      setHashtagInput('');
      setIsEditingHashtag(false);
    }
  };

  const handleHashtagBlur = () => {
    if (hashtagInput.trim()) {
      setHashtags([...hashtags, hashtagInput.trim()]);
      setHashtagInput('');
    }
    setIsEditingHashtag(false);
  };

  const removeHashtag = (indexToRemove) => {
    setHashtags(hashtags.filter((_, index) => index !== indexToRemove));
  };

  const handleWritePost = async () => {
    if (newPost.title.trim() && newPost.content.trim()) {
      try {
        const categoryMapping = {
          '진로·적성': 'CAREER_PATH',
          '고민상담': 'COUNSELING',
          '체험후기': 'EXPERIENCE_REVIEW',
          '자유소통': 'FREE_TALK'
        };

        const postData = {
          title: newPost.title,
          content: newPost.content,
          category: categoryMapping[selectedWriteCategory] || 'CAREER_PATH'
        };

        await communityService.createPost(postData);

        // 게시글 목록 새로고침
        fetchPosts();

        // 폼 초기화
        setNewPost({ title: '', content: '', hashtag: '' });
        setHashtags([]);
        setSelectedImages([]);
        setSelectedWriteCategory('진로·적성');
        setCurrentView('main');
      } catch (error) {
        console.error('게시글 작성 실패:', error);
      }
    }
  };

  const PostItem = ({ post }) => (
    <div className="community__post-item" onClick={() => {
      fetchPostDetail(post.id);
    }}>
      <div className="community__post-content">
        {/* Left Content */}
        <div className="community__post-main">
          <span className={`community__category-badge ${
            post.category === 'CAREER_PATH' ? 'community__category-badge--blue' :
            post.category === 'FREE_TALK' ? 'community__category-badge--green' :
            post.category === 'CONSULTATION' ? 'community__category-badge--purple' :
            'community__category-badge--orange'
          }`}>
            {post.category === 'CAREER_PATH' ? '진로·적성' :
             post.category === 'FREE_TALK' ? '자유소통' :
             post.category === 'CONSULTATION' ? '고민상담' :
             post.category === 'EXPERIENCE' ? '체험후기' : post.category}
          </span>
          <h3 className="community__post-title">{post.title}</h3>
          <p className="community__post-meta">
            {post.authorNickname} · {new Date(post.createdAt).toLocaleDateString()}
          </p>
          <div className="community__post-actions">
            <button 
              className={`community__action-button ${
                likedPosts.has(post.id) ? 'community__action-button--liked' : ''
              }`}
              onClick={(e) => handleLike(post.id, e)}
            >
              <svg 
                className={`community__action-icon ${likedPosts.has(post.id) ? 'community__action-icon--filled' : ''}`}
                viewBox="0 0 24 24"
                fill={likedPosts.has(post.id) ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              <span className="community__action-text">{post.likeCount || 0}</span>
            </button>
            <span className="community__action-info">
              <svg className="community__action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 3h10c1.5 0 3 1.5 3 3v7c0 1.5-1.5 3-3 3h-4l-4 4v-4H7c-1.5 0-3-1.5-3-3V6c0-1.5 1.5-3 3-3Z"/>
              </svg>
              <span className="community__action-text">{post.commentCount || 0}</span>
            </span>
            <span className="community__action-info">
              <svg className="community__action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                <circle cx="12" cy="12" r="3" strokeWidth="2"/>
              </svg>
              <span className="community__action-text">{post.viewCount || 0}</span>
            </span>
          </div>
        </div>
        
        {/* Right Image */}
        {post.imageUrl && (
          <div className="community__post-image">
            <img src={post.imageUrl} alt="게시글 이미지" className="community__post-image-content" />
          </div>
        )}
      </div>
    </div>
  );

  if (currentView === 'write') {
    return (
      <div className="community__container">
        {/* Header */}
        <div className="community__header">
          <button onClick={() => setCurrentView('main')} className="community__close-button">
            <svg className="community__close-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
          <h1 className="community__header-title">글쓰기</h1>
          <button 
            className={`community__header-action ${newPost.title.trim() && newPost.content.trim() ? 'active' : ''}`}
            onClick={handleWritePost}
          >
            완료
          </button>
        </div>

        {/* Category Tabs */}
        <div className="community__category-section">
          <div className="community__category-tabs">
            {['진로·적성', '고민상담', '체험후기', '자유소통'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedWriteCategory(cat)}
                className={`community__category-tab ${
                  selectedWriteCategory === cat ? 'community__category-tab--active' : ''
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Write Form */}
        <div className="community__write-form">
          <input
            type="text"
            placeholder="제목을 입력해주세요."
            value={newPost.title}
            onChange={(e) => setNewPost({...newPost, title: e.target.value})}
            className="community__write-title"
          />
          
          <textarea
            placeholder="자유롭게 이야기해보세요."
            value={newPost.content}
            onChange={(e) => setNewPost({...newPost, content: e.target.value})}
            className="community__write-content"
          />

          {/* Selected Images Preview */}
          {selectedImages.length > 0 && (
            <div className="community__images-preview">
              {selectedImages.map((image, index) => (
                <div key={index} className="community__image-preview">
                  <img src={image} alt={`첨부 이미지 ${index + 1}`} className="community__preview-image" />
                  <button
                    className="community__image-remove"
                    onClick={() => setSelectedImages(prev => prev.filter((_, i) => i !== index))}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="community__write-actions">
            <div className="community__write-tools">
              <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                onChange={handleImageSelect}
                style={{ display: 'none' }}
              />
              <button
                className="community__tool-button"
                onClick={() => fileInputRef.current?.click()}
                disabled={selectedImages.length >= 4}
              >
                <svg className="community__tool-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            </div>
            
            <div className="community__write-hashtag">
              {!isEditingHashtag ? (
                <>
                  {hashtags.length > 0 ? (
                    <div className="community__hashtag-display">
                      {hashtags.map((tag, index) => (
                        <div key={index} className="community__hashtag-tag">
                          <span className="community__hashtag-text">#{tag}</span>
                          <button
                            className="community__hashtag-remove"
                            onClick={() => removeHashtag(index)}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button className="community__hashtag-edit" onClick={() => setIsEditingHashtag(true)}>+</button>
                    </div>
                  ) : (
                    <button className="community__hashtag-placeholder" onClick={() => setIsEditingHashtag(true)}>
                      + 해시태그 추가
                    </button>
                  )}
                </>
              ) : (
                <div className="community__hashtag-input-container">
                  <input
                    type="text"
                    value={hashtagInput}
                    onChange={(e) => setHashtagInput(e.target.value)}
                    onKeyDown={handleHashtagKeyPress}
                    onBlur={handleHashtagBlur}
                    placeholder="해시태그를 입력하세요"
                    className="community__hashtag-input"
                    autoFocus
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'detail' && selectedPost) {
    return (
      <div className="community__container">
        {/* Header */}
        <div className="community__header">
          <button onClick={() => setCurrentView('main')} className="community__back-button">
            <svg className="community__header-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 12H5m7-7l-7 7 7 7"/>
            </svg>
          </button>
        </div>

        {/* Post Content */}
        <div className="community__detail-content">
          <div className="community__detail-post">
            <h1 className="community__detail-title">{selectedPost.title}</h1>
            <div className="community__detail-meta">
              <span>{selectedPost.authorNickname}</span>
              <span className="community__detail-separator">•</span>
              <span>{new Date(selectedPost.createdAt).toLocaleDateString()}</span>
              <svg className="community__detail-views-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                <circle cx="12" cy="12" r="3" strokeWidth="2"/>
              </svg>
              <span>{selectedPost.viewCount}</span>
            </div>
            <p className="community__detail-text">{selectedPost.content}</p>
            <span className="community__detail-hashtag">{selectedPost.hashtag}</span>
          </div>

          {/* Post Actions */}
          <div className="community__detail-actions">
            <button 
              className="community__detail-action"
              onClick={() => handleLike(selectedPost.id, { stopPropagation: () => {} })}
            >
              <svg 
                className={`community__detail-action-icon ${likedPosts.has(selectedPost.id) ? 'community__detail-action-icon--liked' : ''}`}
                fill={likedPosts.has(selectedPost.id) ? "currentColor" : "none"}
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.60L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
              <span className={`community__detail-action-text ${likedPosts.has(selectedPost.id) ? 'community__detail-action-text--liked' : ''}`}>
                좋아요 {selectedPost.likeCount || 0}
              </span>
            </button>
            <button className="community__detail-action">
              <svg className="community__detail-action-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M7 3h10c1.5 0 3 1.5 3 3v7c0 1.5-1.5 3-3 3h-4l-4 4v-4H7c-1.5 0-3-1.5-3-3V6c0-1.5 1.5-3 3-3Z"/>
              </svg>
              <span className="community__detail-action-text">댓글 {selectedPost.comments ? selectedPost.comments.length : 0}</span>
            </button>
          </div>
        </div>

        {/* Comments */}
        <div className="community__comments">
          {selectedPost.comments && selectedPost.comments.map((comment) => (
            <div key={comment.id} className="community__comment">
              <div className="community__comment-header">
                <span className={`community__comment-author ${comment.isAuthor ? 'community__comment-author--post-author' : ''}`}>
                  {comment.authorNickname}{comment.isAuthor ? ' (글쓴이)' : ''}
                </span>
                <span className="community__comment-date">{new Date(comment.createdAt).toLocaleDateString()}</span>
                {comment.isAuthor && (
                  <button
                    onClick={() => handleCommentDelete(comment.id)}
                    className="community__comment-delete"
                  >
                    ×
                  </button>
                )}
              </div>
              <p className="community__comment-content">{comment.content}</p>
            </div>
          ))}
        </div>

        {/* Comment Input */}
        <div className="community__comment-input-container">
          <div className="community__comment-input">
            <input
              type="text"
              placeholder="댓글을 남겨보세요."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
              className="community__comment-field"
            />
            <button
              className="community__comment-submit"
              onClick={handleCommentSubmit}
              disabled={!commentInput.trim()}
            >
              <svg className="community__comment-submit-icon" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="community__container">
      {/* Header */}
      <div className="community__main-header">
        <h1 className="community__main-title">고등학생 꿈터</h1>
        <svg className="community__search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="11" cy="11" r="8" strokeWidth="2"/>
          <path d="M21 21L16.65 16.65" strokeWidth="2"/>
        </svg>
      </div>

      {/* Category Tabs */}
      <div className="community__category-section">
        <div className="community__category-tabs">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`community__category-tab ${
                selectedCategory === category ? 'community__category-tab--active' : ''
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Post List */}
      <div className="community__post-list">
        {posts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>

      {/* Write Button */}
      <div className="community__write-button-container">
        <button
          onClick={() => setCurrentView('write')}
          className="community__write-button"
        >
          <svg className="community__write-button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          <span className="community__write-button-text">글쓰기</span>
        </button>
      </div>
    </div>
  );
};

export default Community;
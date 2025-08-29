import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { INTEREST_LABELS } from '../../config/constants';
import { programsService } from '../../services/programs.service.js';
import ProgramCard from "../../components/ProgramCard.jsx";
import './Explore.css';

const EXPERIENCE_TYPE_CHIPS = [
  { value: "all", label: "전체" },
  { value: "field_company", label: "현장직업체험형" },
  { value: "job_practice", label: "직업실무체험형" },
  { value: "field_academic", label: "현장견학형" },
  { value: "subject", label: "학과체험형" },
  { value: "camp", label: "캠프형" },
  { value: "lecture", label: "강연형" },
  { value: "dialogue", label: "대화형" },
];

const COST_CHIPS = [
  { value: "all", label: "전체" },
  { value: "free", label: "무료" },
  { value: "paid", label: "유료" },
];

const DEFAULT_FILTERS = {
  category: 'all',
  job: 'all',
  type: 'all',
  cost: 'all',
  startDate: '2025-08-29',
  endDate: '2025-12-31',
};


function InfoItem({ k, v }) {
  return (
    <>
      <dt className="info-grid__key">{k}</dt>
      <dd className="info-grid__val">{v}</dd>
    </>
  );
}
function SelectFilter({ label, value, onChange, options }) {
  return (
    <label className="selectfilter">
      <span className="selectfilter__label">{label}</span>
      <select className="selectfilter__select" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </label>
  );
}

function SelectedFilters({ filters, onClearKey, onReset }) {
  // ✅ value → label 헬퍼
  const labelByValue = (options, v) =>
    options.find(o => o.value === v)?.label ?? v;

  const entries = [
    filters.job !== 'all' && {
      key: 'job',
      label: '직무',
      value: labelByValue(
        [{ value: 'all', label: '전체' }, ...Object.entries(INTEREST_LABELS).map(([code, label]) => ({ value: code, label }))],
        filters.job
      ),
    },
    filters.type !== 'all' && {
      key: 'type',
      label: '체험유형',
      value: labelByValue(EXPERIENCE_TYPE_CHIPS, filters.type),
    },
    filters.cost !== 'all' && {
      key: 'cost',
      label: '비용',
      value: labelByValue(COST_CHIPS, filters.cost), // ✅ paid → 유료
    },
    ((filters.startDate !== DEFAULT_FILTERS.startDate) ||
     (filters.endDate !== DEFAULT_FILTERS.endDate)) && {
      key: 'date',
      label: '체험일',
      value: `${filters.startDate} ~ ${filters.endDate}`,
    },
  ].filter(Boolean);

  if (!entries.length) return null;

  return (
    <div className="selectedfilters">
      {entries.map(({ key, label, value }) => (
        <span key={key} className="sf-badge">
          <b>{label}</b> {value}
          <button
            className="sf-badge__x"
            aria-label={`${label} 제거`}
            onClick={() => onClearKey(key)}
          >
            ×
          </button>
        </span>
      ))}
      <button className="sf-clearall" onClick={onReset}>전체 초기화</button>
    </div>
  );
}

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL 쿼리 동기화: ?cat=IT
  const initialCat = searchParams.get('cat') || 'all';

  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    category: initialCat,
  });

  const [sortBy, setSortBy] = useState('latest');
  const [page, setPage] = useState(1);
  const [liked, setLiked] = useState(() => new Set());
  const [modal, setModal] = useState({ open: false, program: null });
  const [programs, setPrograms] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 10;


  // 카테고리 변경 시 URL 업데이트 + 페이지 리셋
  const handleChangeCategory = (cat) => {
    setFilters((f) => ({ ...f, category: cat }));
    setPage(1);
    const next = new URLSearchParams(searchParams);
    if (cat === 'all') next.delete('cat');
    else next.set('cat', cat);
    setSearchParams(next, { replace: true });
  };

  // API 호출 함수
  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const response = await programsService.searchPrograms({
        interestCategory: filters.job,
        programType: filters.type,
        cost: filters.cost,
        startDate: filters.startDate,
        endDate: filters.endDate,
        sortBy,
        page,
        size: itemsPerPage
      });
      
      setPrograms(response.programs || []);
      setTotalPages(response.totalPages || 1);
      setTotalElements(response.totalElements || 0);
    } catch (error) {
      console.error('프로그램 검색 실패:', error);
      setPrograms([]);
      setTotalPages(1);
      setTotalElements(0);
    } finally {
      setLoading(false);
    }
  };
  

  // 필터나 정렬이 변경될 때 API 호출
  useEffect(() => {
    fetchPrograms();
  }, [filters, sortBy, page]);

  /** 이벤트 */
  const applyFilters = () => {
    setPage(1);
  };
  
  const resetFilters = () => {
    setFilters({ ...DEFAULT_FILTERS, category: 'all' });
    setPage(1);
    const next = new URLSearchParams(searchParams);
    next.delete('cat');
    setSearchParams(next, { replace: true });
  };
  const toggleLike = (id) => {
    setLiked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
      
  useEffect(() => {
    if (modal.open) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => document.body.classList.remove("no-scroll");
  }, [modal.open]);
  
  return (
    <div className="explore">
      {/* 네비게이터: 카테고리 퀵 필터 (sticky 적용 가능) */}

      {/* Header */}
      <header className="explore__header">
        <div className="header__top">
          <h1 className="header__title">프로그램 탐색</h1>
          <i className="fas fa-search header__icon" aria-hidden="true" />
        </div>

      {/* 컴팩트 필터 바 */}
      <div className="filters filters--compact">
        <div className="filters__row">
          <SelectFilter
            label="직무"
            value={filters.job}
            onChange={(v) => setFilters((f) => ({ ...f, job: v }))}
            options={[
              { value: 'all', label: '전체' },
              ...Object.entries(INTEREST_LABELS).map(([code, label]) => ({ value: code, label })),
            ]}
          />
          <SelectFilter
            label="체험유형"
            value={filters.type}
            onChange={(v) => setFilters((f) => ({ ...f, type: v }))}
            options={EXPERIENCE_TYPE_CHIPS}
          />
          <SelectFilter
            label="비용"
            value={filters.cost}
            onChange={(v) => setFilters((f) => ({ ...f, cost: v }))}
            options={COST_CHIPS}
          />
          <label className="selectfilter selectfilter--date">
            <span className="selectfilter__label">체험일</span>
            <div className="date">
              <input
                type="date"
                className="date__input"
                value={filters.startDate}
                onChange={(e) => setFilters((f) => ({ ...f, startDate: e.target.value }))}
              />
              <span>→</span>
              <input
                type="date"
                className="date__input"
                value={filters.endDate}
                onChange={(e) => setFilters((f) => ({ ...f, endDate: e.target.value }))}
              />
            </div>
          </label>

          <div className="filters__actions">
            <button className="btn btn--search" onClick={applyFilters}>검색</button>
          </div>
        </div>

        {/* ✅ 선택된 필터 배지 */}
        <SelectedFilters
          filters={filters}
          onClearKey={(key) => {
            if (key === 'date') {
              setFilters(f => ({ ...f, startDate: DEFAULT_FILTERS.startDate, endDate: DEFAULT_FILTERS.endDate }));
            } else {
              setFilters(f => ({ ...f, [key]: 'all' }));
            }
            setPage(1);
          }}
          onReset={resetFilters}
        />
      </div>
    </header>

      {/* Content */}
      <section className="explore__content">
        <div className="content__top">
          <div className="results">
            {loading ? '검색 중...' : `전체 ${totalElements}개`}
          </div>
          <select className="sort" value={sortBy} onChange={(e) => { setSortBy(e.target.value); setPage(1); }}>
            <option value="latest">최신순</option>
            <option value="popular">인기순</option>
            <option value="deadline">마감임박순</option>
          </select>
        </div>

        <div className="grid">
          {loading ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
              프로그램을 검색하고 있습니다...
            </div>
          ) : programs.length === 0 ? (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
              검색 결과가 없습니다.
            </div>
          ) : (
            programs.map((p) => (
              <ProgramCard
                key={p.program_id}
                program={p}
                isLiked={liked.has(p.program_id)}
                onLike={toggleLike}
                onClick={(program) => setModal({ open: true, program })}
              />
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="pagination" aria-label="페이지네이션">
            <button className="page nav" disabled={page <= 1} onClick={() => setPage((v) => Math.max(1, v - 1))}>
              <span className="nav__arrow">‹</span>
            </button>
          
            {Array.from({ length: totalPages }).slice(Math.max(0, page - 3), Math.min(totalPages, page + 2)).map((_, i) => {
              const first = Math.max(1, page - 2);
              const number = first + i;
              return (
                <button key={number} className={`page ${number === page ? 'active' : ''}`} onClick={() => setPage(number)}>
                  {number}
                </button>
              );
            })}
          
            <button className="page nav" disabled={page >= totalPages} onClick={() => setPage((v) => Math.min(totalPages, v + 1))}>
              <span className="nav__arrow">›</span>
            </button>
          </nav>
          
        )}
      </section>

      {modal.open && modal.program && (
        <div
          className="modal"
          role="dialog"
          aria-modal="true"
          onClick={(e) =>
            e.target.classList.contains("modal") &&
            setModal({ open: false, program: null })
          }
        >
          <div className="modal__panel">
            <div className="modal__header">
              <button
                className="modal__close"
                aria-label="닫기"
                onClick={() => setModal({ open: false, program: null })}
              >
                ×
              </button>
              <h2 className="modal__title">{modal.program.title}</h2>
              <div className="modal__provider">{modal.program.provider}</div>
            </div>

            {/* ✅ 여기만 스크롤 */}
            <div className="modal__content">
              {/* 1) 소개 먼저 */}
              <section className="section section--desc">
                <h3 className="section__title">프로그램 소개</h3>
                <p className="section__text">
                  {modal.program.description}
                </p>
              </section>

              {/* 태그/라벨 */}
              <section className="section section--tags">
                <div className="tags">
                  <span className="tag">{modal.program.field_category}</span>
                  {/*추후 태그로 등록할 것 추가*/}
                </div>
              </section>

              {/* 핵심 정보: 2열 그리드 (모바일 1→2열) */}
              <section className="section">
                <h3 className="section__title">핵심 정보</h3>
                <dl className="info-grid">
                  <InfoItem k="프로그램 유형" v={modal.program.program_type} />
                  <InfoItem k="대상" v={modal.program.target_audience} />
                  <InfoItem k="지역" v={modal.program.venue_region} />
                  <InfoItem k="참가비" v={modal.program.price} />
                  <InfoItem k="모집인원" v={`${modal.program.capacity}명`} />
                  <InfoItem k="운영시간" v={modal.program.avail_hours} />
                  <InfoItem k="장소" v={modal.program.venue} />
                  <InfoItem k="관련직무" v={modal.program.job_field} />
                  <InfoItem k="기간" v={`${modal.program.start_date} ~ ${modal.program.end_date}`} />
                  <InfoItem k="분야" v={modal.program.field_category} />
                </dl>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

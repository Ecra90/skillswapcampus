
import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Code2,
  Compass,
  GraduationCap,
  Heart,
  Laptop,
  Palette,
  Plus,
  Search,
  Sparkles,
  Users,
  X,
  Zap,
} from 'lucide-react';

const STORAGE_KEY = 'skillswap-campus-demo-v1';

const starterSkills = [
  {
    id: 'sample-1',
    title: 'Web Development',
    category: 'Technology',
    description: 'Learn HTML, CSS, JavaScript and how to build your first website.',
    tags: ['HTML', 'CSS', 'React'],
    teacher: 'Brian M.',
    credits: 2,
    own: false,
  },
  {
    id: 'sample-2',
    title: 'Graphic Design',
    category: 'Design',
    description: 'Create posters, social media graphics and clean visual designs.',
    tags: ['Canva', 'Branding', 'Posters'],
    teacher: 'Faith W.',
    credits: 2,
    own: false,
  },
  {
    id: 'sample-3',
    title: 'Mathematics',
    category: 'Academics',
    description: 'Work through challenging maths topics with a fellow student.',
    tags: ['Algebra', 'Calculus', 'Revision'],
    teacher: 'Kevin N.',
    credits: 1,
    own: false,
  },
  {
    id: 'sample-4',
    title: 'Photography',
    category: 'Creative',
    description: 'Learn composition, lighting and how to take better photos.',
    tags: ['Camera', 'Lighting', 'Editing'],
    teacher: 'Michelle K.',
    credits: 2,
    own: false,
  },
  {
    id: 'sample-5',
    title: 'Public Speaking',
    category: 'Personal Growth',
    description: 'Build confidence for presentations, debates and interviews.',
    tags: ['Confidence', 'Debate', 'Speaking'],
    teacher: 'Daniel O.',
    credits: 1,
    own: false,
  },
  {
    id: 'sample-6',
    title: 'Video Editing',
    category: 'Creative',
    description: 'Learn to edit engaging short videos for content and projects.',
    tags: ['CapCut', 'Reels', 'Editing'],
    teacher: 'Sharon W.',
    credits: 2,
    own: false,
  },
];

const categories = [
  'All skills',
  'Technology',
  'Design',
  'Academics',
  'Creative',
  'Personal Growth',
  'Other',
];

const readSavedData = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
};

const getInitialData = () => {
  const saved = readSavedData();

  return {
    skills: Array.isArray(saved?.skills) ? saved.skills : starterSkills,
    requests: Array.isArray(saved?.requests) ? saved.requests : [],
  };
};

const categoryIcon = (category) => {
  if (category === 'Technology') return Code2;
  if (category === 'Design') return Palette;
  if (category === 'Academics') return BookOpen;
  if (category === 'Creative') return Sparkles;
  return GraduationCap;
};

export default function Dashboard({ onBack }) {
  const [initialData] = useState(getInitialData);
  const [skills, setSkills] = useState(initialData.skills);
  const [requests, setRequests] = useState(initialData.requests);
  const [activeTab, setActiveTab] = useState('Explore skills');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All skills');
  const [showModal, setShowModal] = useState(false);
  const [notice, setNotice] = useState('');

  const [form, setForm] = useState({
    title: '',
    category: 'Technology',
    description: '',
    tags: '',
    credits: '2',
  });

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ skills, requests }),
      );
    } catch {
      setNotice('Browser storage is unavailable. Changes may not persist.');
    }
  }, [skills, requests]);

  const mySkills = useMemo(
    () => skills.filter((skill) => skill.own),
    [skills],
  );

  const visibleSkills = useMemo(() => {
    const term = search.trim().toLowerCase();

    return skills.filter((skill) => {
      const matchesCategory =
        category === 'All skills' || skill.category === category;

      const matchesSearch =
        !term ||
        skill.title.toLowerCase().includes(term) ||
        skill.category.toLowerCase().includes(term) ||
        skill.description.toLowerCase().includes(term) ||
        skill.tags.some((tag) => tag.toLowerCase().includes(term)) ||
        skill.teacher.toLowerCase().includes(term);

      const matchesTab =
        activeTab === 'Explore skills' ||
        (activeTab === 'My skills' && skill.own);

      return matchesCategory && matchesSearch && matchesTab;
    });
  }, [skills, category, search, activeTab]);

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const addSkill = (event) => {
    event.preventDefault();

    const title = form.title.trim();
    const description = form.description.trim();

    if (!title || !description) {
      setNotice('Please enter a skill name and description.');
      return;
    }

    const newSkill = {
      id: `skill-${Date.now()}`,
      title,
      category: form.category,
      description,
      tags: form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean)
        .slice(0, 5),
      teacher: 'You',
      credits: Number(form.credits),
      own: true,
    };

    setSkills((current) => [newSkill, ...current]);
    setForm({
      title: '',
      category: 'Technology',
      description: '',
      tags: '',
      credits: '2',
    });
    setShowModal(false);
    setActiveTab('My skills');
    setCategory('All skills');
    setSearch('');
    setNotice('Your skill has been added.');
  };

  const requestSkill = (skill) => {
    if (skill.own) {
      setNotice('That is your own skill listing.');
      return;
    }

    const alreadyRequested = requests.some(
      (request) =>
        request.skillId === skill.id && request.status !== 'Cancelled',
    );

    if (alreadyRequested) {
      setNotice('You have already requested this skill.');
      return;
    }

    const newRequest = {
      id: `request-${Date.now()}`,
      skillId: skill.id,
      title: skill.title,
      teacher: skill.teacher,
      credits: skill.credits,
      status: 'Pending',
      createdAt: new Date().toLocaleDateString(),
    };

    setRequests((current) => [newRequest, ...current]);
    setNotice(`Demo request created for ${skill.title}.`);
  };

  const cancelRequest = (requestId) => {
    setRequests((current) =>
      current.map((request) =>
        request.id === requestId
          ? { ...request, status: 'Cancelled' }
          : request,
      ),
    );
    setNotice('Request cancelled.');
  };

  const openTab = (tab) => {
    setActiveTab(tab);
    setSearch('');
    setCategory('All skills');
    setNotice('');
  };

  return (
    <div className="dash">
      <aside className="dash-sidebar">
        <a
          href="#dashboard"
          className="dash-brand"
          onClick={(event) => event.preventDefault()}
        >
          <span className="brand-icon">S</span>
          <span>SkillSwap <span>Campus</span></span>
        </a>

        <div className="dash-school">
          <GraduationCap size={17} />
          <span>Campus community</span>
        </div>

        <p className="dash-label">WORKSPACE</p>

        <button
          className={`dash-nav ${activeTab === 'Dashboard' ? 'active' : ''}`}
          onClick={() => openTab('Dashboard')}
        >
          <Compass size={17} /> Dashboard
        </button>

        <button
          className={`dash-nav ${activeTab === 'Explore skills' ? 'active' : ''}`}
          onClick={() => openTab('Explore skills')}
        >
          <Search size={17} /> Explore skills
        </button>

        <button
          className={`dash-nav ${activeTab === 'My skills' ? 'active' : ''}`}
          onClick={() => openTab('My skills')}
        >
          <Zap size={17} /> My skills
        </button>

        <button
          className={`dash-nav ${activeTab === 'My requests' ? 'active' : ''}`}
          onClick={() => openTab('My requests')}
        >
          <Heart size={17} /> My requests
          {requests.filter((request) => request.status === 'Pending').length > 0 && (
            <span className="dash-nav-count">
              {requests.filter((request) => request.status === 'Pending').length}
            </span>
          )}
        </button>

        <div className="dash-sidebar-bottom">
          <div className="dash-credit-box">
            <span><Zap size={15} /> Demo skill credits</span>
            <strong>12 credits</strong>
            <small>Sample balance — not real currency</small>
          </div>

          <button className="dash-back" onClick={onBack}>
            <ArrowLeft size={16} /> Back to homepage
          </button>
        </div>
      </aside>

      <main className="dash-main">
        <header className="dash-topbar">
          <div className="dash-mobile-brand">
            <span className="brand-icon">S</span> SkillSwap Campus
          </div>

          <label className="dash-search">
            <Search size={17} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search skills, topics or students..."
              aria-label="Search skills"
            />
            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearch('')}
              >
                <X size={15} />
              </button>
            )}
          </label>

          <div className="dash-user">
            <div className="dash-avatar">E</div>
            <div>
              <strong>Student account</strong>
              <span>Campus member · Demo</span>
            </div>
          </div>
        </header>

        <div className="dash-content">
          {notice && (
            <div className="dash-notice" role="status">
              <CheckCircle2 size={17} />
              <span>{notice}</span>
              <button aria-label="Dismiss message" onClick={() => setNotice('')}>
                <X size={15} />
              </button>
            </div>
          )}

          {activeTab === 'Dashboard' && (
            <>
              <section className="dash-welcome">
                <div>
                  <span className="dash-overline">YOUR CAMPUS, YOUR COMMUNITY</span>
                  <h1>Welcome to SkillSwap Campus 👋</h1>
                  <p>Share what you know. Discover what you can learn.</p>
                </div>
                <button className="dash-primary" onClick={() => setShowModal(true)}>
                  <Plus size={17} /> Add a skill
                </button>
              </section>

              <section className="dash-stats">
                <div><span>Skills available</span><strong>{skills.length}</strong></div>
                <div><span>Your skills</span><strong>{mySkills.length}</strong></div>
                <div><span>Learning requests</span><strong>{requests.length}</strong></div>
              </section>

              <section className="dash-section-heading">
                <div>
                  <h2>Find your next skill</h2>
                  <p>Explore skills offered by the demo campus community.</p>
                </div>
                <button className="dash-text-button" onClick={() => openTab('Explore skills')}>
                  Explore all <ArrowRight size={15} />
                </button>
              </section>

              <div className="dash-quick-actions">
                <button onClick={() => openTab('Explore skills')}>
                  <Search size={19} /><span><strong>Explore skills</strong><small>Find something new to learn</small></span>
                </button>
                <button onClick={() => openTab('My skills')}>
                  <Laptop size={19} /><span><strong>Share your talent</strong><small>Manage the skills you teach</small></span>
                </button>
                <button onClick={() => openTab('My requests')}>
                  <Users size={19} /><span><strong>Track requests</strong><small>See your learning requests</small></span>
                </button>
              </div>
            </>
          )}

          {(activeTab === 'Explore skills' || activeTab === 'My skills') && (
            <>
              <section className="dash-welcome">
                <div>
                  <span className="dash-overline">
                    {activeTab === 'My skills' ? 'SHARE WHAT YOU KNOW' : 'DISCOVER SOMETHING NEW'}
                  </span>
                  <h1>
                    {activeTab === 'My skills' ? 'My skills' : 'Explore skills'}
                  </h1>
                  <p>
                    {activeTab === 'My skills'
                      ? 'Keep track of the skills you offer fellow students.'
                      : 'Find a student who can help you learn something useful.'}
                  </p>
                </div>
                <button className="dash-primary" onClick={() => setShowModal(true)}>
                  <Plus size={17} /> Add a skill
                </button>
              </section>

              <section className="dash-section-heading">
                <div>
                  <h2>{activeTab === 'My skills' ? 'Your skill listings' : 'Skills from the community'}</h2>
                  <p>{visibleSkills.length} {visibleSkills.length === 1 ? 'skill' : 'skills'} found</p>
                </div>
                <span>Demo listings</span>
              </section>

              <div className="dash-filters">
                {categories.map((item) => (
                  <button
                    key={item}
                    className={category === item ? 'selected' : ''}
                    onClick={() => setCategory(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>

              {visibleSkills.length > 0 ? (
                <div className="dash-skill-grid">
                  {visibleSkills.map((skill) => {
                    const Icon = categoryIcon(skill.category);
                    const requested = requests.some(
                      (request) =>
                        request.skillId === skill.id &&
                        request.status !== 'Cancelled',
                    );

                    return (
                      <article className="dash-skill-card" key={skill.id}>
                        <div className="skill-card-top">
                          <div className="skill-icon"><Icon size={22} /></div>
                          <span className="skill-category">{skill.category}</span>
                        </div>

                        <h3>{skill.title}</h3>
                        <p>{skill.description}</p>

                        <div className="skill-tags">
                          {skill.tags.map((tag) => <span key={tag}>{tag}</span>)}
                        </div>

                        <div className="skill-card-footer">
                          <div className="skill-person">
                            <span className="skill-person-avatar">
                              {skill.own ? 'E' : skill.teacher.split(' ').map((part) => part[0]).join('').slice(0, 2)}
                            </span>
                            <span>{skill.own ? 'You' : skill.teacher}</span>
                          </div>
                          <span className="skill-credit">
                            <Zap size={13} /> {skill.credits} credits
                          </span>
                        </div>

                        {skill.own ? (
                          <button className="skill-request" disabled>
                            Your listing <CheckCircle2 size={15} />
                          </button>
                        ) : (
                          <button
                            className="skill-request"
                            disabled={requested}
                            onClick={() => requestSkill(skill)}
                          >
                            {requested ? 'Request sent' : 'Request to learn'}
                            {requested ? <CheckCircle2 size={15} /> : <ArrowRight size={15} />}
                          </button>
                        )}
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="dash-empty">
                  <Search size={27} />
                  <h3>No skills found</h3>
                  <p>
                    {activeTab === 'My skills'
                      ? 'You have no skills in this category yet. Add your first skill to get started.'
                      : 'Try a different search or category.'}
                  </p>
                  {activeTab === 'My skills' && (
                    <button className="dash-primary" onClick={() => setShowModal(true)}>
                      <Plus size={16} /> Add your first skill
                    </button>
                  )}
                  <button
                    className="dash-text-button"
                    onClick={() => { setSearch(''); setCategory('All skills'); }}
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </>
          )}

          {activeTab === 'My requests' && (
            <>
              <section className="dash-welcome">
                <div>
                  <span className="dash-overline">YOUR LEARNING JOURNEY</span>
                  <h1>My requests</h1>
                  <p>Review the demo requests you have made to learn from others.</p>
                </div>
                <button className="dash-primary" onClick={() => openTab('Explore skills')}>
                  <Compass size={17} /> Find skills
                </button>
              </section>

              {requests.length ? (
                <div className="dash-requests">
                  {requests.map((request) => (
                    <article className="dash-request-card" key={request.id}>
                      <div>
                        <h3>{request.title}</h3>
                        <p>Skill provider: {request.teacher} · {request.credits} credits</p>
                        <span className="request-status">
                          Status: {request.status} · Requested {request.createdAt}
                        </span>
                      </div>
                      {request.status === 'Pending' && (
                        <button
                          className="dash-secondary"
                          onClick={() => cancelRequest(request.id)}
                        >
                          Cancel request
                        </button>
                      )}
                    </article>
                  ))}
                </div>
              ) : (
                <div className="dash-empty">
                  <Heart size={28} />
                  <h3>No learning requests yet</h3>
                  <p>Explore the available skills and request to learn something new.</p>
                  <button className="dash-primary" onClick={() => openTab('Explore skills')}>
                    Explore skills <ArrowRight size={16} />
                  </button>
                </div>
              )}
            </>
          )}

          <footer className="dash-footer">
            SkillSwap Campus · Demo version · Learn more, share more, grow together.
          </footer>
        </div>
      </main>

      {showModal && (
        <div
          className="dash-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowModal(false);
          }}
        >
          <section
            className="dash-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="add-skill-title"
          >
            <div className="dash-modal-heading">
              <div>
                <h2 id="add-skill-title">Add a skill</h2>
                <p>Tell fellow students what you can teach.</p>
              </div>
              <button aria-label="Close dialog" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={addSkill}>
              <label htmlFor="skill-title">Skill name</label>
              <input
                id="skill-title"
                name="title"
                value={form.title}
                onChange={updateForm}
                placeholder="e.g. Python programming"
                maxLength={60}
                required
              />

              <label htmlFor="skill-category">Category</label>
              <select
                id="skill-category"
                name="category"
                value={form.category}
                onChange={updateForm}
              >
                {categories.filter((item) => item !== 'All skills').map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>

              <label htmlFor="skill-description">Description</label>
              <textarea
                id="skill-description"
                name="description"
                value={form.description}
                onChange={updateForm}
                placeholder="What can another student learn from you?"
                rows={3}
                maxLength={240}
                required
              />

              <label htmlFor="skill-tags">Topics or tags</label>
              <input
                id="skill-tags"
                name="tags"
                value={form.tags}
                onChange={updateForm}
                placeholder="e.g. JavaScript, HTML, CSS"
              />
              <small>Separate tags with commas.</small>

              <label htmlFor="skill-credits">Demo credits per lesson</label>
              <select
                id="skill-credits"
                name="credits"
                value={form.credits}
                onChange={updateForm}
              >
                <option value="1">1 credit</option>
                <option value="2">2 credits</option>
                <option value="3">3 credits</option>
              </select>

              <button className="dash-primary" type="submit">
                <Plus size={17} /> Save skill
              </button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}


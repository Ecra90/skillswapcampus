
import { useState } from 'react';
import './App.css';
import Auth from './components/Auth.jsx';
import Dashboard from './components/Dashboard.jsx';
import {
  ArrowRight,
  Code2,
  Palette,
  BookOpen,
  Search,
  Users,
  Menu,
  X,
} from 'lucide-react';

const skills = [
  {
    name: 'Web Development',
    category: 'Technology',
    icon: Code2,
    color: '#e3efd4',
  },
  {
    name: 'Graphic Design',
    category: 'Design',
    icon: Palette,
    color: '#f4e4d3',
  },
  {
    name: 'Mathematics',
    category: 'Academics',
    icon: BookOpen,
    color: '#e8e0f5',
  },
];

export default function App() {
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [authMode, setAuthMode] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);

  const filteredSkills = skills.filter(
    (skill) =>
      skill.name.toLowerCase().includes(search.toLowerCase()) ||
      skill.category.toLowerCase().includes(search.toLowerCase())
  );

  // All hooks are declared before conditional returns.
  if (showDashboard) {
    return (
      <Dashboard
        onBack={() => setShowDashboard(false)}
      />
    );
  }

  if (authMode) {
    return (
      <Auth
        mode={authMode}
        onBack={() => setAuthMode(null)}
        onSwitch={setAuthMode}
      />
    );
  }

  return (
    <div className="app">
      <header className="navbar">
        <a
          className="brand"
          href="#"
          onClick={(event) => event.preventDefault()}
        >
          <span className="brand-icon">S</span>
          SkillSwap <span>Campus</span>
        </a>

        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>

        <nav className={menuOpen ? 'nav-links open' : 'nav-links'}>
          <a
            href="#skills"
            onClick={() => setMenuOpen(false)}
          >
            Explore skills
          </a>

          <a
            href="#how"
            onClick={() => setMenuOpen(false)}
          >
            How it works
          </a>

          <a
            href="#community"
            onClick={() => setMenuOpen(false)}
          >
            Community
          </a>

          <button
            type="button"
            className="join-button"
            onClick={() => {
              setShowDashboard(true);
              setMenuOpen(false);
            }}
          >
            Dashboard
          </button>

          <button
            type="button"
            className="join-button"
            onClick={() => {
              setAuthMode('signup');
              setMenuOpen(false);
            }}
          >
            Get started
          </button>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">
              YOUR CAMPUS. YOUR COMMUNITY.
            </span>

            <h1>
              Your skills are
              <br />
              your <span>currency.</span>
            </h1>

            <p>
              Exchange knowledge, discover new talents, and learn from
              fellow students. Everyone has something worth sharing.
            </p>

            <button
              type="button"
              className="primary-button"
              onClick={() => setShowDashboard(true)}
            >
              Explore skills <ArrowRight size={18} />
            </button>

            <div className="hero-note">
              <Users size={18} />
              Built for students, powered by collaboration.
            </div>
          </div>

          <div className="hero-art">
            <div className="art-card art-one">
              <span className="art-icon">
                <Code2 size={25} />
              </span>
              <p>I can teach</p>
              <h3>Web Development</h3>
              <span>HTML · CSS · React</span>
            </div>

            <div className="swap-symbol">↔</div>

            <div className="art-card art-two">
              <span className="art-icon">
                <Palette size={25} />
              </span>
              <p>I want to learn</p>
              <h3>Graphic Design</h3>
              <span>Creativity · Branding</span>
            </div>

            <div className="floating-note">
              Learn together ✦
            </div>
          </div>
        </section>

        <section id="skills" className="skills-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">
                DISCOVER YOUR NEXT SKILL
              </span>
              <h2>What do you want to learn?</h2>
            </div>

            <label className="search-box">
              <Search size={19} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search skills..."
                aria-label="Search skills"
              />
            </label>
          </div>

          <div className="skill-grid">
            {filteredSkills.map((skill) => {
              const Icon = skill.icon;

              return (
                <article className="skill-card" key={skill.name}>
                  <div
                    className="skill-icon"
                    style={{ backgroundColor: skill.color }}
                  >
                    <Icon size={26} />
                  </div>

                  <span>{skill.category}</span>
                  <h3>{skill.name}</h3>

                  <button
                    type="button"
                    className="skill-discover"
                    onClick={() => setShowDashboard(true)}
                  >
                    Discover more <ArrowRight size={16} />
                  </button>
                </article>
              );
            })}

            {filteredSkills.length === 0 && (
              <p>No matching skills. Try another search.</p>
            )}
          </div>
        </section>

        <section id="how" className="how-section">
          <span className="eyebrow">SIMPLE BY DESIGN</span>
          <h2>Learn more. Share more. Grow together.</h2>

          <div className="steps">
            <article>
              <span>01</span>
              <h3>Share your talent</h3>
              <p>
                Tell the campus what you know and what you want to learn.
              </p>
            </article>

            <article>
              <span>02</span>
              <h3>Find your match</h3>
              <p>
                Connect with students whose skills complement yours.
              </p>
            </article>

            <article>
              <span>03</span>
              <h3>Exchange and grow</h3>
              <p>
                Trade skills, use skill credits, or arrange paid lessons.
              </p>
            </article>
          </div>
        </section>

        <section id="community" className="community-section">
          <div>
            <span className="eyebrow">
              YOUR JOURNEY STARTS HERE
            </span>
            <h2>
              Everyone knows something. Everyone can learn something.
            </h2>
            <p>
              Be part of a campus community where knowledge creates
              opportunity.
            </p>
          </div>

          <button
            type="button"
            className="primary-button"
            onClick={() => setAuthMode('signup')}
          >
            Join the movement <ArrowRight size={18} />
          </button>
        </section>
      </main>

      <footer>
        <a className="brand" href="#">
          <span className="brand-icon">S</span>
          SkillSwap <span>Campus</span>
        </a>
        <p>Your skills are your currency.</p>
      </footer>
    </div>
  );
}

import { useState, useEffect } from "react";
import "./Dashboard.css";
import MeetingCalendar from "../components/MeetingCalendar/MeetingCalendar";

const Dashboard = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeetings = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        window.location.href = "/";
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/meetings", {
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (data.success) {
          setMeetings(data.data);
        }
      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  if (loading) {
    return <div className="loading-screen">Loading Dashboard...</div>;
  }

  const upcoming = meetings.filter(
    (m) => !m.IsCancelled && new Date(m.MeetingDate) >= new Date()
  ).length;

  const cancelled = meetings.filter((m) => m.IsCancelled).length;

  const completed = meetings.filter(
    (m) => !m.IsCancelled && new Date(m.MeetingDate) < new Date()
  ).length;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h3>Dashboard</h3>
        <p className="welcome-text">Welcome back, {localStorage.getItem("staffName")}! Here's what's happening with your meetings.</p>
      </div>

      <div className="stats-strip animate-fade-in">
        <div className="stat-item">
          <span className="stat-label">System Performance</span>
          <span className="stat-value">99.9%</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Active Users</span>
          <span className="stat-value">42</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Avg Participation</span>
          <span className="stat-value">85%</span>
        </div>
      </div>

      <div className="dashboard-layout">
        <div className="dashboard-main">
          <div className="dashboard-cards">
            <div className="dashboard-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <h4>Upcoming Meetings</h4>
              <p>{upcoming}</p>
              <span className="card-desc">In-queue for execution</span>
            </div>

            <div className="dashboard-card status-completed animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <h4>Completed</h4>
              <p>{completed}</p>
              <span className="card-desc">Concluded sessions</span>
            </div>

            <div className="dashboard-card status-cancelled animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <h4>Cancelled</h4>
              <p>{cancelled}</p>
              <span className="card-desc">Postponed sessions</span>
            </div>
          </div>

          <section className="dashboard-experience animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="experience-header">
              <h4>Site Experience</h4>
              <span className="live-badge">OPTIMIZED</span>
            </div>
            <div className="experience-grid">
              <div className="experience-node">
                <div className="node-icon">⚡</div>
                <div className="node-info">
                  <h5>High Speed</h5>
                  <p>40% faster loads.</p>
                </div>
              </div>
              <div className="experience-node">
                <div className="node-icon">🛡️</div>
                <div className="node-info">
                  <h5>Secure</h5>
                  <p>Encrypted audits.</p>
                </div>
              </div>
              <div className="experience-node">
                <div className="node-icon">📱</div>
                <div className="node-info">
                  <h5>Responsive</h5>
                  <p>All devices supported.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="dashboard-insights animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <div className="insights-header">
              <h4>Meeting Insights</h4>
              <button className="btn-text">Refresh</button>
            </div>
            <div className="insights-content">
              <div className="insight-row">
                <div className="insight-label">
                  <span>Decision Accuracy</span>
                  <span>92%</span>
                </div>
                <div className="progress-bg"><div className="progress-bar" style={{ width: '92%' }}></div></div>
              </div>
              <div className="insight-row">
                <div className="insight-label">
                  <span>Stakeholder Engagement</span>
                  <span>88%</span>
                </div>
                <div className="progress-bg"><div className="progress-bar orange" style={{ width: '88%' }}></div></div>
              </div>
              <div className="insight-row">
                <div className="insight-label">
                  <span>Follow-up Rate</span>
                  <span>75%</span>
                </div>
                <div className="progress-bg"><div className="progress-bar purple" style={{ width: '75%' }}></div></div>
              </div>
            </div>
          </section>
        </div>

        <div className="calendar-sidebar">
          <MeetingCalendar title="Meeting Schedule" meetings={meetings} />
          <div className="sidebar-ad">
            <h5>Productivity Tip</h5>
            <p>Drafting minutes during the meeting saves 50% more time!</p>
          </div>
        </div>
      </div>

      <section className="dashboard-section events-section animate-fade-in">
        <div className="section-header-elite">
          <div>
            <span className="section-eyebrow">COMMUNITY & GROWTH</span>
            <h4>Recent Events & Workshops</h4>
          </div>
          <button className="btn-text-elite">Explore All Events →</button>
        </div>

        <div className="events-grid-elite">
          <div className="event-card-elite">
            <div className="event-accent-border"></div>
            <span className="event-tag">COMMUNITY</span>
            <h5>Annual Strategy Meet 2025</h5>
            <p>
              A high-level gathering focused on aligning organizational goals
              and defining key performance indicators for the upcoming fiscal year.
            </p>
            <div className="event-footer">
              <span className="event-date">Jan 15, 2025</span>
              <span className="event-link">View Details</span>
            </div>
          </div>

          <div className="event-card-elite purple">
            <div className="event-accent-border"></div>
            <span className="event-tag">TECHNICAL</span>
            <h5>Leadership Alignment Workshop</h5>
            <p>
              Interactive sessions designed for department heads to bridge
              communication gaps and standardize meeting protocols across the board.
            </p>
            <div className="event-footer">
              <span className="event-date">Jan 22, 2025</span>
              <span className="event-link">View Details</span>
            </div>
          </div>

          <div className="event-card-elite orange">
            <div className="event-accent-border"></div>
            <span className="event-tag">AGILE</span>
            <h5>Agile Sprint Review Summit</h5>
            <p>
              Deep dive into iterative development cycles, focusing on
              enhancing sprint velocity and improving stakeholder feedback loops.
            </p>
            <div className="event-footer">
              <span className="event-date">Feb 05, 2025</span>
              <span className="event-link">View Details</span>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-section about-section animate-fade-in">
        <div className="about-content">
          <div className="about-text">
            <span className="about-eyebrow">ENTERPRISE PLATFORM</span>
            <h4>About MOM Management System</h4>
            <p>
              The Minutes of Meeting (MOM) Management System is a sophisticated,
              enterprise-grade ecosystem designed to revolutionize how organizations
              capture, track, and implement strategic decisions.
            </p>
            <p className="mt-20">
              By digitizing the lifecycle of a meeting—from scheduling to audit-ready reporting—we
              empower teams to maintain absolute clarity and accountability.
            </p>
          </div>

          <div className="info-cards">
            <div className="info-card">
              <div className="info-icon">🏢</div>
              <div>
                <h5>10+ Years of Service</h5>
                <p>Trusted by premier educational and corporate institutions.</p>
              </div>
            </div>
            <div className="info-card">
              <div className="info-icon">🏆</div>
              <div>
                <h5>Operational Excellence</h5>
                <p>Standardizing minutes tracking for maximum productivity.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-section guide-section animate-fade-in">
        <h4>Getting Started with MOM</h4>
        <div className="howto-grid">
          <div className="howto-card">
            <div className="howto-num">01</div>
            <h5>Schedule</h5>
            <p>Define agendas and invite stakeholders with ease.</p>
          </div>
          <div className="howto-card">
            <div className="howto-num">02</div>
            <h5>Participate</h5>
            <p>Mark attendance and record live meeting minutes.</p>
          </div>
          <div className="howto-card">
            <div className="howto-num">03</div>
            <h5>Analyze</h5>
            <p>Generate reports and track decision implementation.</p>
          </div>
        </div>

        <div className="guide-cta">
          <a href="https://www.youtube.com/" target="_blank" rel="noreferrer" className="btn-primary">
            Watch Video Guide
          </a>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;

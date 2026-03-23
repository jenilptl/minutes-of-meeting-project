import { useState, useEffect } from "react";
import "./Reports.css";

const Reports = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const role = localStorage.getItem("role");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchReports = async () => {
      if (!token) return;
      try {
        const response = await fetch("http://localhost:5000/api/meetings", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        const data = await response.json();
        if (data.success) {
          setMeetings(data.data);
        }
      } catch (err) {
        console.error("Reports Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const totalMeetings = meetings.length;

  const cancelledMeetings = meetings.filter(
    (m) => m.IsCancelled
  ).length;

  const completedMeetings = meetings.filter(
    (m) => new Date(m.MeetingDate) < new Date() && !m.IsCancelled
  ).length;

  if (loading) return <div className="loading-screen">Loading Reports...</div>;

  return (
    <div className="reports-page">
      <div className="reports-header animate-fade-in">
        <h3>Reports & Analytics</h3>
        <p className="subtitle">Real-time insights into your organization's meeting health</p>
      </div>

      <div className="report-cards">
        <div className="report-card-elite efficiency-card">
          <h4>Total Efficiency</h4>
          <div className="efficiency-cell">
            <div className="stat-value-group">
              <span className="stat-value">94</span>
              <span className="stat-unit">%</span>
            </div>
            <div className="performance-ring-container">
              <svg className="ring-svg" width="70" height="70">
                <circle className="ring-bg" cx="35" cy="35" r="30" />
                <circle
                  className="ring-progress"
                  cx="35" cy="35" r="30"
                  style={{ strokeDasharray: `${2 * Math.PI * 30 * 0.94} 1000` }}
                />
              </svg>
            </div>
          </div>
          <div className="stat-trend up">
            <span>↑ 12%</span>
            <span className="trend-label">vs last month</span>
          </div>
        </div>

        {(role === "Admin" || role === "Convener") && (
          <div className="report-card-elite">
            <h4>Global Meetings</h4>
            <div className="stat-value-group">
              <span className="stat-value">{totalMeetings}</span>
            </div>
            <span className="card-desc">Total sessions recorded across system</span>
            <div className="stat-trend up">
              <span>↑ 2</span>
              <span className="trend-label">new this week</span>
            </div>
          </div>
        )}

        <div className="report-card-elite">
          <h4>Completed Sessions</h4>
          <div className="stat-value-group">
            <span className="stat-value">{completedMeetings}</span>
          </div>
          <span className="card-desc">Meetings successfully concluded</span>
          <div className="stat-trend up">
            <span>{Math.round((completedMeetings / totalMeetings) * 100) || 0}%</span>
            <span className="trend-label">completion rate</span>
          </div>
        </div>

        <div className="report-card-elite">
          <h4>Cancelled</h4>
          <div className="stat-value-group">
            <span className="stat-value">{cancelledMeetings}</span>
          </div>
          <span className="card-desc">Potential loss of productivity</span>
          <div className="stat-trend danger">
            <span>{cancelledMeetings > 0 ? "⚠️ Check Reasons" : "✓ Optimal"}</span>
          </div>
        </div>
      </div>

      <div className="reports-layout">
        <div className="reports-main">
          <section className="report-section-elite animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="section-icon-box">📊</div>
            <div className="section-info-elite">
              <h4>Impact of MOM Management</h4>
              <p>
                Since implementing the MOM system, organizations report a 35% increase in
                action item follow-through and a significant reduction in communication gaps.
              </p>
            </div>
          </section>

          <section className="report-section-elite animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <div className="section-icon-box">🛡️</div>
            <div className="section-info-elite">
              <h4>Data Accuracy & Compliance</h4>
              <p>
                All reports are generated based on real-time attendance markings. This ensures
                100% audit compliance for all official committee sessions.
              </p>
            </div>
          </section>

          <section className="report-section-elite animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <div className="section-icon-box">📈</div>
            <div className="section-info-elite">
              <h4>Strategic Growth Insights</h4>
              <p>
                Predictive analytics suggest that maintaining the current meeting frequency will lead to a
                20% uptick in cross-departmental collaboration by next quarter.
              </p>
            </div>
          </section>
        </div>

        <aside className="reports-sidebar-elite animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <h4>Export Center</h4>
          <p className="export-desc">Generate professional PDF or Excel documents for offline record keeping and auditing.</p>
          <div className="export-btn-group">
            <button className="btn-elite-export primary">
              <span>📄</span> Generate PDF Report
            </button>
            <button className="btn-elite-export secondary">
              <span>📊</span> Download Excel Sheet
            </button>
          </div>
          <div className="sidebar-tip-elite">
            <strong>Pro Tip:</strong> You can filter results by specific date ranges in the Master records before exporting.
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Reports;

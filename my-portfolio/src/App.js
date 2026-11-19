
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [backendMessage, setBackendMessage] = useState('');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const emptyForm = {
    title: '',
    description: '',
    technologies: '',
    github_link: ''
  };

  const [formData, setFormData] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  // Backend connection
  useEffect(() => {
    fetch('http://localhost:5000/api/message')
      .then((response) => response.json())
      .then((data) => setBackendMessage(data.message))
      .catch((error) => console.error(error));
  }, []);

  // READ - Fetch projects
  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/projects');
      if (!response.ok) throw new Error('Unable to fetch projects');

      const data = await response.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Projects fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Handle new project form
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // CREATE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      alert('Project added successfully!');
      setFormData(emptyForm);
      await fetchProjects();
    } catch (error) {
      alert(error.message || 'Unable to add project');
    } finally {
      setSubmitting(false);
    }
  };

  // Start editing a project
  const handleEdit = (project) => {
    setEditId(project.id);

    setEditData({
      title: project.title,
      description: project.description,
      technologies: project.technologies,
      github_link: project.github_link || ''
    });
  };

  // Handle edit form changes
  const handleEditChange = (e) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
  };

  // UPDATE
  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/${editId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editData)
        }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      alert('Project updated successfully!');
      setEditId(null);
      setEditData(emptyForm);
      await fetchProjects();
    } catch (error) {
      alert(error.message || 'Unable to update project');
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this project?'
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/projects/${id}`,
        { method: 'DELETE' }
      );

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      alert('Project deleted successfully!');
      await fetchProjects();
    } catch (error) {
      alert(error.message || 'Unable to delete project');
    }
  };

  // Scroll Reveal Animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    document.querySelectorAll('.reveal').forEach((element) => {
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  // Skills Percentage Animation
  useEffect(() => {
    const skillsSection = document.querySelector('.skills');
    const numbers = document.querySelectorAll('.skill-heading span');

    if (!skillsSection) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            numbers.forEach((number) => {
              const target = Number(number.dataset.target);
              let count = 0;

              const interval = setInterval(() => {
                if (count < target) {
                  count++;
                  number.textContent = count + '%';
                } else {
                  clearInterval(interval);
                }
              }, 20);
            });

            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(skillsSection);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="portfolio">

      {/* Navigation */}
      <nav className="navbar">
        <h2>Shahin.</h2>
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#education">Education</a></li>
          <li><a href="#skills">Skills</a></li>
          <li><a href="#projects">Projects</a></li>
          <li><a href="#contact">Contact</a></li>
        </ul>
      </nav>

      {/* Home */}
      <section className="home" id="home">
        <div className="home-content">
          <h3>Hello, I'm</h3>
          <h1>Shahin</h1>
          <h2>ECE Student | Full Stack Developer</h2>

          <p>
            I am a third-year ECE student passionate about
            software development, Java programming and
            building creative projects.
          </p>

          {backendMessage && (
            <p className="backend-message">{backendMessage}</p>
          )}

          <div className="home-buttons">
            <a href="#projects"><button>View My Projects</button></a>
            <a href="#contact">
              <button className="contact-btn">Contact Me</button>
            </a>
          </div>
        </div>

        <div className="home-image">
          <img
            src={require('./images/shahin.jpg')}
            alt="Shahin"
            className="profile-photo"
          />
        </div>
      </section>

      {/* About */}
      <section className="about reveal" id="about">
        <h1>About Me</h1>
        <p>
          I am Shahin, a third-year B.E. Electronics and
          Communication Engineering student at Prince Shri
          Venkateshwara Padmavathy Engineering College.
          I am interested in software development, Java
          programming and computer networks. I am currently
          learning Full Stack Development and improving my
          technical skills.
        </p>
      </section>

      {/* Education */}
      <section className="education reveal" id="education">
        <h1>My Education</h1>
        <div className="education-card">
          <h2>B.E. Electronics and Communication Engineering</h2>
          <h3>
            Prince Shri Venkateshwara Padmavathy
            Engineering College
          </h3>
          <p>Currently studying – 3rd Year</p>
        </div>
      </section>

      {/* Skills */}
      <section className="skills reveal" id="skills">
        <h1>My Skills</h1>

        <div className="skill-container">
          {[
            ['Java', 70, 'java'],
            ['HTML', 85, 'html'],
            ['CSS', 75, 'css'],
            ['JavaScript', 60, 'javascript'],
            ['React.js', 55, 'react'],
            ['Python', 65, 'python']
          ].map(([name, percentage, className]) => (
            <div className="skill-box" key={name}>
              <div className="skill-heading">
                <h3>{name}</h3>
                <span data-target={percentage}>0%</span>
              </div>
              <div className="progress-bar">
                <div className={`progress ${className}`}></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects and CRUD */}
      <section className="projects reveal" id="projects">
        <h1>My Projects</h1>

        {/* CREATE FORM */}
        <div className="project-card">
          <h2>Add New Project</h2>

          <form onSubmit={handleSubmit}>
            <div>
              <label>Project Title</label>
              <input
                type="text"
                name="title"
                placeholder="Enter project title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Description</label>
              <textarea
                name="description"
                placeholder="Enter project description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>Technologies</label>
              <input
                type="text"
                name="technologies"
                placeholder="React, Node.js, MySQL"
                value={formData.technologies}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>GitHub Link (Optional)</label>
              <input
                type="url"
                name="github_link"
                placeholder="https://github.com/username/project"
                value={formData.github_link}
                onChange={handleChange}
              />
            </div>

            <button type="submit" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add Project'}
            </button>
          </form>
        </div>

        {/* READ */}
        <h2>My Saved Projects</h2>

        {loading ? (
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <p>No projects found.</p>
        ) : (
          <div className="project-container">
            {projects.map((project) => (
              <div className="project-card" key={project.id}>

                {editId === project.id ? (
                  /* UPDATE FORM */
                  <form onSubmit={handleUpdate}>
                    <h2>Edit Project</h2>

                    <div>
                      <label>Project Title</label>
                      <input
                        name="title"
                        value={editData.title}
                        onChange={handleEditChange}
                        required
                      />
                    </div>

                    <div>
                      <label>Description</label>
                      <textarea
                        name="description"
                        value={editData.description}
                        onChange={handleEditChange}
                        required
                      />
                    </div>

                    <div>
                      <label>Technologies</label>
                      <input
                        name="technologies"
                        value={editData.technologies}
                        onChange={handleEditChange}
                        required
                      />
                    </div>

                    <div>
                      <label>GitHub Link</label>
                      <input
                        type="url"
                        name="github_link"
                        value={editData.github_link}
                        onChange={handleEditChange}
                      />
                    </div>

                    <button type="submit">Save Changes</button>

                    <button
                      type="button"
                      onClick={() => setEditId(null)}
                    >
                      Cancel
                    </button>
                  </form>
                ) : (
                  <>
                    <h2>{project.title}</h2>
                    <p>{project.description}</p>
                    <p>
                      <strong>Technologies:</strong>{' '}
                      {project.technologies}
                    </p>

                    {project.github_link && (
                      <p>
                        <a
                          href={project.github_link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View GitHub
                        </a>
                      </p>
                    )}

                    {/* UPDATE BUTTON */}
                    <button
                      type="button"
                      onClick={() => handleEdit(project)}
                    >
                      Edit Project
                    </button>

                    {/* DELETE BUTTON */}
                    <button
                      type="button"
                      onClick={() => handleDelete(project.id)}
                    >
                      Delete Project
                    </button>
                  </>
                )}

              </div>
            ))}
          </div>
        )}
      </section>

      {/* Contact */}
      <section className="contact reveal" id="contact">
        <h1>Contact Me</h1>
        <p>Let's connect and work together!</p>
        <p>Email: Add your email address</p>
        <p>LinkedIn: Add your LinkedIn profile link</p>
        <p>GitHub: Add your GitHub profile link</p>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>© 2026 Shahin. All Rights Reserved.</p>
        <p>Designed and Developed by Shahin ❤️</p>
      </footer>

    </div>
  );
}

export default App;

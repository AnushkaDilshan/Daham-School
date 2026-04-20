import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authServices';
import { jwtDecode } from 'jwt-decode';
import { useUser } from '../context/UserContext';

// Import temple images
import img1 from '../assets/temple1.jpeg';
// import img2 from '../assets/temple2.jpeg';
// import img3 from '../assets/temple3.jpeg';
import img4 from '../assets/temple4.jpeg';
import img5 from '../assets/temple5.jpeg';
import img6 from '../assets/temple6.jpeg';

const images = [img1, img4, img5, img6];

const Login = () => {
  const { setUser } = useUser();
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [currentImage, setCurrentImage] = useState(0);
  const [fade, setFade] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentImage(prev => (prev + 1) % images.length);
        setFade(true);
      }, 600);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await authService.login(form);
    const token = res.data.token;
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    setUser(decoded); // ← full object, not decoded.id
    
    if (decoded.role === 'admin') {
    
       navigate('/user-dashboard');
    } else {
        navigate('/studentView');
    }
  } catch (err) {
    setMessage(err.response?.data?.message || 'Login failed');
  }
};

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      {/* Background Slideshow */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${images[currentImage]})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: fade ? 1 : 0,
          transition: 'opacity 0.6s ease-in-out',
          zIndex: 0,
        }}
      />

      {/* Dark overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom right, rgba(0,0,0,0.55), rgba(20,40,20,0.65))',
          zIndex: 1,
        }}
      />

      {/* Dot indicators */}
      <div style={{
        position: 'absolute',
        bottom: '1.5rem',
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        gap: '8px',
        zIndex: 3,
      }}>
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => { setCurrentImage(i); setFade(true); }}
            style={{
              width: i === currentImage ? '22px' : '8px',
              height: '8px',
              borderRadius: '999px',
              background: i === currentImage ? '#fff' : 'rgba(255,255,255,0.45)',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '1.5rem',
      }}>
        {/* Temple name / logo area */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.3)',
            marginBottom: '0.75rem',
            fontSize: '26px',
          }}>
            🏛️
          </div>
          <h1 style={{
            color: '#fff',
            fontSize: '1.6rem',
            fontWeight: '700',
            margin: 0,
            letterSpacing: '0.02em',
            textShadow: '0 2px 12px rgba(0,0,0,0.4)',
            fontFamily: 'Georgia, serif',
          }}>
            Dhamma School
          </h1>
          <p style={{
            color: 'rgba(255,255,255,0.75)',
            fontSize: '0.85rem',
            margin: '4px 0 0',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}>
            Student Management Portal
          </p>
        </div>

        {/* Login Card */}
        <div style={{
          width: '100%',
          maxWidth: '380px',
          background: 'rgba(255,255,255,0.12)',
          backdropFilter: 'blur(18px)',
          WebkitBackdropFilter: 'blur(18px)',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.25)',
          padding: '2rem',
          boxShadow: '0 8px 40px rgba(0,0,0,0.3)',
        }}>
          <h2 style={{
            color: '#fff',
            fontSize: '1.25rem',
            fontWeight: '600',
            margin: '0 0 1.5rem',
            textAlign: 'center',
          }}>
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
            <input
              name="email"
              type="email"
              placeholder="Email address"
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.65rem 1rem',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.3)',
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.border = '1px solid rgba(255,255,255,0.7)'}
              onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.3)'}
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.65rem 1rem',
                borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.3)',
                background: 'rgba(255,255,255,0.15)',
                color: '#fff',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
              onFocus={e => e.target.style.border = '1px solid rgba(255,255,255,0.7)'}
              onBlur={e => e.target.style.border = '1px solid rgba(255,255,255,0.3)'}
            />

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '0.7rem',
                borderRadius: '10px',
                border: 'none',
                background: 'rgba(255,255,255,0.9)',
                color: '#1a3a1a',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
                marginTop: '0.25rem',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.target.style.background = '#fff'}
              onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.9)'}
            >
              Login
            </button>
          </form>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', margin: '1.25rem 0 0' }} />

          <button
            type="button"
            onClick={() => navigate('/signup')}
            style={{
              width: '100%',
              padding: '0.65rem',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.35)',
              background: 'transparent',
              color: 'rgba(255,255,255,0.9)',
              fontSize: '0.9rem',
              fontWeight: '500',
              cursor: 'pointer',
              marginTop: '1rem',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.target.style.background = 'transparent'}
          >
            Create an Account
          </button>

          {message && (
            <p style={{
              marginTop: '1rem',
              textAlign: 'center',
              fontSize: '0.85rem',
              color: '#ffb3b3',
            }}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
import React, { useState } from 'react';
import icon from '../img/icon.png';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

function Signin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 🔧 MOCK LOGIN DATA
    const res = {
      data: {
        token: 'mock-token-123',
        userData: {
          email: email,
          role: 'customer', // Change to 'admin' or other roles to test redirects
          status: 'Active',
        },
        message: 'Logged in successfully (mock)',
      },
      status: 200,
    };

    // 🔁 Simulate login behavior
    sessionStorage.setItem('token', res.data.token);
    sessionStorage.setItem('userData', JSON.stringify(res.data.userData));

    if (res.data.userData.status === 'InActive') {
      navigate('/');
      toast.error('You are not allowed to login');
    } else if (res.data.userData.role === 'customer') {
      toast.success(res.data.message);
      navigate('/slider'); // change to your actual route
    } else {
      toast.success(res.data.message);
      navigate('/userdash'); // change to your actual route
    }

    setLoading(false);
  };

  return (
    <>
      {loading && (
        <div className="loading-screen">
          <div className="loading-spinner"></div>
        </div>
      )}
      <section>
        <div className="logfull">
          <div className="login" style={{ height: '630px', paddingTop: '35px' }}>
            <div className="avatar" style={{ width: '100px', height: '100px' }}>
              <img src={icon} alt="icon" />
            </div>
            <h2>Login</h2>
            <h3>Welcome back!</h3>

            <form className="login-form">
              <div className="textbox">
                <input
                  type="email"
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
                <span className="material-symbols-outlined"> email </span>
              </div>

              <div className="textbox">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="material-symbols-outlined"> lock </span>
              </div>

              <div id="ch" style={{ display: 'flex', marginTop: 'px' }}>
                <input
                  style={{ width: '15px', margin: '-18px 6px 0px 0px' }}
                  type="checkbox"
                  checked={showPassword}
                  onChange={togglePasswordVisibility}
                />
                <span id="sp" style={{ marginRight: '45px', color: '#157ae1' }}>
                  Show Password
                </span>
                &nbsp; &nbsp;
                <span
                  id="sp"
                  style={{ color: '#157ae1', cursor: 'pointer' }}
                  onClick={() => navigate('/forgetpassword')}
                >
                  Forgot Password?
                </span>
              </div>

              <button type="submit" onClick={handleLogin}>
                LOGIN
              </button>

              <p style={{ color: '#157ae1', fontSize: '18px' }}>
                Create Account For Employee?&nbsp; &nbsp; <br />
                <span
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate('/signup')}
                >
                  Signup
                </span>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

export default Signin;

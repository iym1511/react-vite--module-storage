import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '@/lib/ky';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    // 💡 간단한 유효성 검사
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      setIsLoading(false);
      return;
    }

    try {
      // 🔓 회원가입 전용 authApi 사용 (인터셉터 없음)
      await authApi.post('api/auth/signup', {
        json: {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        },
      });

      // 회원가입 성공 시 로그인 페이지로 이동
      alert('회원가입이 완료되었습니다. 로그인해 주세요.');
      navigate('/login');
    } catch (err: any) {
      console.error('Registration failed:', err);
      setError('회원가입에 실패했습니다. 이미 사용 중인 이메일일 수 있습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <h2>Create Account</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
        <input
          name="name"
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={{ padding: '8px' }}
        />
        <input
          name="email"
          type="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          style={{ padding: '8px' }}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ padding: '8px' }}
        />
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          style={{ padding: '8px' }}
        />
        
        {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
        
        <button 
          type="submit" 
          disabled={isLoading}
          style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          {isLoading ? 'Creating Account...' : 'Register'}
        </button>
      </form>
      
      <p style={{ marginTop: '15px', fontSize: '14px' }}>
        이미 계정이 있으신가요? <Link to="/login" style={{ color: '#646cff' }}>로그인하기</Link>
      </p>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { api, authApi } from '@/lib/ky';

interface User {
  id: string;
  email: string;
  name: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState('admin@naver.com'); // 테스트용 기본값
  const [password, setPassword] = useState('admin');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 🔓 로그인 전용 authApi 사용 (인터셉터 없음)
      const loginResponse = await authApi.post('api/auth/login', {
        json: { email, password },
      }).json<{ message: string; accessToken: string; user: User }>();

      if (loginResponse.user && loginResponse.accessToken) {
        console.log('로그인 성공:', loginResponse.user.email);
        
        // 💡 1. Zustand 스토어에 유저 정보와 토큰을 즉시 저장 (메모리 방식)
        login(loginResponse.user, loginResponse.accessToken); 
        
        // 💡 2. 메인 페이지로 즉시 이동
        navigate('/', { replace: true }); 
      }
      }
     catch (err: any) {
      console.error('로그인 처리 중 에러 발생:', err);
      if (err.response) {
        const errorData = await err.response.json();
        console.error('서버 에러 상세:', errorData);
      }
      setError('로그인에 실패했습니다. 이메일과 비밀번호를 확인해 주세요.');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', flexDirection: 'column' }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '300px' }}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ padding: '8px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '8px' }}
        />
        {error && <p style={{ color: 'red', fontSize: '14px' }}>{error}</p>}
        <button 
          type="submit" 
          disabled={isLoading}
          style={{ padding: '10px', backgroundColor: '#646cff', color: 'white', border: 'none', cursor: 'pointer' }}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <p style={{ marginTop: '15px', fontSize: '14px' }}>
        계정이 없으신가요? <Link to="/register" style={{ color: '#646cff' }}>회원가입하기</Link>
      </p>
    </div>
  );
}

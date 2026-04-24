import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/features/auth/api/auth';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [validationError, setValidationError] = useState<string | null>(null);

  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: () => authService.signup({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    }),
    onSuccess: () => {
      alert('회원가입이 완료되었습니다. 로그인해 주세요.');
      navigate('/login');
    },
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (formData.password !== formData.confirmPassword) {
      setValidationError('비밀번호가 일치하지 않습니다.');
      return;
    }

    registerMutation.mutate();
  };

  const isLoading = registerMutation.isPending;
  const isError = registerMutation.isError;

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
        
        {validationError && <p style={{ color: 'red', fontSize: '14px' }}>{validationError}</p>}
        {isError && <p style={{ color: 'red', fontSize: '14px' }}>회원가입에 실패했습니다. 이미 사용 중인 이메일일 수 있습니다.</p>}
        
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

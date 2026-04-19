'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import Link from 'next/link';

export default function SignupPage() {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [error,    setError]    = useState('');
  const [loading,  setLoading]  = useState(false);
  const [done,     setDone]     = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { name: username },
          emailRedirectTo: undefined,
        },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      if (data?.user) {
        try {
          await supabase.from('user_profiles').upsert({
            id:                 data.user.id,
            username:           username || email.split('@')[0],
            xp_points:          0,
            rank:               'Seedling',
            role:               'user',
            is_verified_modder: false,
            discoveries:        0,
          }, { onConflict: 'id' });
        } catch (profileErr) {
          console.log('Profile creation skipped:', profileErr);
        }
        setDone(true);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Unexpected error. Please try again.');
    }

    setLoading(false);
  };

  if (done) return (
    <div className='min-h-screen flex items-center justify-center bg-green-50 px-4'>
      <div className='bg-white rounded-3xl shadow-lg p-8 w-full max-w-md text-center'>
        <div className='text-5xl mb-4'>🌱</div>
        <h2 className='text-2xl font-bold text-green-900 mb-2'>Account created!</h2>
        <p className='text-gray-600 mb-6'>Welcome to PhytoScan.</p>
        <Link href='/login'
          className='inline-block bg-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-800 transition'>
          Go to Login
        </Link>
      </div>
    </div>
  );

  return (
    <div className='min-h-screen flex items-center justify-center bg-green-50 px-4'>
      <div className='bg-white rounded-3xl shadow-lg p-8 w-full max-w-md'>
        <div className='text-center mb-8'>
          <h1 className='text-3xl font-bold text-green-900'>🌿 Join PhytoScan</h1>
          <p className='text-green-700 mt-1'>Start your botanical journey</p>
        </div>

        {error && (
          <div className='bg-red-50 border border-red-200 text-red-700 rounded-xl p-3 mb-4 text-sm'>
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className='space-y-4'>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-1'>Username</label>
            <input type='text' placeholder='Enter your username' value={username}
              onChange={e => setUsername(e.target.value)} required
              className='w-full px-4 py-3 rounded-xl border-2 border-green-300 bg-white text-gray-900 text-base placeholder-gray-400 focus:outline-none focus:border-green-600' />
          </div>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-1'>Email</label>
            <input type='email' placeholder='Enter your email' value={email}
              onChange={e => setEmail(e.target.value)} required
              className='w-full px-4 py-3 rounded-xl border-2 border-green-300 bg-white text-gray-900 text-base placeholder-gray-400 focus:outline-none focus:border-green-600' />
          </div>
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-1'>Password</label>
            <input type='password' placeholder='Minimum 6 characters' value={password}
              onChange={e => setPassword(e.target.value)} required minLength={6}
              className='w-full px-4 py-3 rounded-xl border-2 border-green-300 bg-white text-gray-900 text-base placeholder-gray-400 focus:outline-none focus:border-green-600' />
          </div>
          <button type='submit' disabled={loading}
            className='w-full py-3 bg-green-700 text-white rounded-xl font-bold text-base hover:bg-green-800 transition disabled:opacity-50'>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className='text-center text-sm text-gray-600 mt-6'>
          Already have an account?{' '}
          <Link href='/login' className='text-green-700 font-bold hover:underline'>Sign in</Link>
        </p>
      </div>
    </div>
  );
}
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Input,
  Label,
} from '../../components/ui';
import { useAppDispatch } from '../../store/hooks';
import { setAuth } from '../../store/slices/authSlice';
import { loginSchema, LoginInput } from './schemas';
import { Activity, ArrowRight, Shield } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'dev@example.com',
      password: 'password123',
    },
  });

  const onSubmit = (data: LoginInput) => {
    dispatch(
      setAuth({
        user: { id: 'usr-1', name: 'Dev Engineer', email: data.email },
        team: { id: '00000000-0000-0000-0000-000000000001', name: 'Acme Corp' },
        token: 'dev-session-token',
      })
    );
    navigate('/');
  };

  return (
    <div className="min-h-screen w-screen bg-zinc-950 flex flex-col justify-center items-center p-4 text-zinc-100 selection:bg-zinc-800">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="flex flex-col items-center space-y-2 text-center">
          <div className="h-12 w-12 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-950 shadow-md">
            <Activity size={26} strokeWidth={2.5} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">BetterPulse</h1>
          <p className="text-xs text-zinc-400 font-mono uppercase tracking-widest">
            Enterprise Uptime & Infrastructure Telemetry
          </p>
        </div>

        {/* Shadcn Card Login Form */}
        <Card className="bg-zinc-900 border-zinc-800 text-zinc-100 shadow-2xl">
          <CardHeader className="space-y-1 text-center border-b border-zinc-800/80 pb-6">
            <CardTitle className="text-xl font-bold tracking-tight text-white">Sign in to account</CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Enter your corporate credentials to access workspace SLA telemetry
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4 pt-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  className="bg-zinc-950 border-zinc-800 text-zinc-100 focus-visible:ring-zinc-100"
                  {...register('email')}
                  error={errors.email?.message}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
                    Password
                  </Label>
                  <a href="#forgot" className="text-xs text-zinc-400 hover:text-zinc-100 underline transition-colors">
                    Forgot?
                  </a>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="bg-zinc-950 border-zinc-800 text-zinc-100 focus-visible:ring-zinc-100"
                  {...register('password')}
                  error={errors.password?.message}
                />
              </div>
            </CardContent>

            <CardFooter className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-zinc-100 text-zinc-950 hover:bg-zinc-200 font-bold gap-2 py-5 shadow-lg"
              >
                Sign In <ArrowRight size={16} />
              </Button>
            </CardFooter>
          </form>
        </Card>

        {/* Footer info */}
        <div className="flex items-center justify-center gap-2 text-xs text-zinc-500">
          <Shield size={14} />
          <span>Secured by 256-bit TLS Encryption & OAuth2 Seam</span>
        </div>
      </div>
    </div>
  );
};

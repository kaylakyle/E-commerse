import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, Role } from '@/contexts/AuthContext';
import { Bus, Users, Shield, Eye, UserCircle, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

const roles: { value: Role; label: string; icon: React.ElementType; desc: string }[] = [
  { value: 'manager', label: 'SACCO Manager', icon: Users, desc: 'Fleet & operations' },
  { value: 'driver', label: 'Driver', icon: Truck, desc: 'Trip management' },
  { value: 'conductor', label: 'Conductor', icon: UserCircle, desc: 'Passenger & fare' },
  { value: 'ntsa', label: 'NTSA Officer', icon: Eye, desc: 'Compliance monitoring' },
  { value: 'admin', label: 'System Admin', icon: Shield, desc: 'System management' },
  { value: 'passenger', label: 'Passenger', icon: Bus, desc: 'Feedback & reports' },
];

const redirectMap: Record<Role, string> = {
  manager: '/manager', driver: '/driver', conductor: '/driver',
  ntsa: '/ntsa', admin: '/admin', passenger: '/passenger',
};

export default function Login() {
  const { login, signup, isAuthenticated, user, loading } = useAuth();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(redirectMap[user.role]);
    }
  }, [isAuthenticated, user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, hsl(210 35% 12%), hsl(190 80% 20%), hsl(152 65% 25%))' }}>
        <div className="text-primary-foreground text-lg">Loading...</div>
      </div>
    );
  }

  if (isAuthenticated && user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRole) { toast.error('Please select a role'); return; }
    if (!email || !password) { toast.error('Enter email and password'); return; }
    if (isSignup && !name) { toast.error('Enter your name'); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }

    setSubmitting(true);
    try {
      if (isSignup) {
        const result = await signup(email, password, name, selectedRole);
        if (result.error) { toast.error(result.error); return; }
        toast.success(`Account created! Welcome ${name}`);
        navigate(redirectMap[selectedRole]);
      } else {
        const result = await login(email, password);
        if (result.error) { toast.error(result.error); return; }
        toast.success('Welcome back!');
        // Navigation handled by useEffect
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4"
      style={{ background: 'linear-gradient(135deg, hsl(210 35% 12%), hsl(190 80% 20%), hsl(152 65% 25%))' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-4">
            <Bus className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-extrabold text-primary-foreground" style={{ fontFamily: 'var(--font-display)' }}>
            QuickTransit
          </h1>
          <p className="text-primary-foreground/60 mt-1">Nairobi Metropolitan Smart Transit System</p>
        </div>

        <div className="bg-card rounded-2xl shadow-2xl p-6 border">
          <h2 className="text-lg font-bold mb-4">{isSignup ? 'Create Account' : 'Sign In'}</h2>

          <div className="mb-5">
            <Label className="text-sm text-muted-foreground mb-2 block">Select Your Role</Label>
            <div className="grid grid-cols-2 gap-2">
              {roles.map(r => (
                <button key={r.value} onClick={() => setSelectedRole(r.value)}
                  className={`flex items-center gap-2 p-3 rounded-xl border-2 text-left transition-all text-sm ${
                    selectedRole === r.value
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-border hover:border-muted-foreground/30'
                  }`}>
                  <r.icon className="w-4 h-4 shrink-0" />
                  <div>
                    <p className="font-semibold text-xs">{r.label}</p>
                    <p className="text-[10px] text-muted-foreground">{r.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" placeholder="John Kamau" value={name} onChange={e => setName(e.target.value)} />
              </div>
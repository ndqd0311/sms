"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Users, Settings, Home, LogOut, BarChart2, ShieldCheck, Key } from 'lucide-react';
import { getUserRole } from '@/lib/token-utils';
import clsx from 'clsx';

const NavLink = ({ href, icon: Icon, children, active }: { href: string, icon: any, children: React.ReactNode, active: boolean }) => (
  <Link 
    href={href} 
    className={clsx(
      "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group",
      active 
        ? "text-indigo-600 bg-indigo-50 font-bold shadow-sm shadow-indigo-100/50" 
        : "text-slate-500 hover:text-indigo-600 hover:bg-slate-50"
    )}
  >
    <Icon size={20} className={active ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-600"} />
    <span className="text-sm tracking-tight">{children}</span>
  </Link>
);

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [userRole, setUserRole] = useState<string | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    setUserRole(getUserRole(token));
  }, []);

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/');

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col transition-all shadow-sm">
        <div className="p-8">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black">S</div>
            <h1 className="text-xl font-black text-slate-800 tracking-tight">
              SMS Manager
            </h1>
          </div>
          <div className="h-1 w-12 bg-indigo-100 rounded-full" />
        </div>

        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          <NavLink href="/dashboard/classes" icon={Home} active={isActive('/dashboard/classes')}>
            Trang chủ (Lớp học)
          </NavLink>
          
          <NavLink href="/dashboard/students" icon={Users} active={isActive('/dashboard/students')}>
            Quản lý Học sinh
          </NavLink>

          <NavLink href="/dashboard/classes/create" icon={BookOpen} active={isActive('/dashboard/classes/create')}>
            Tạo lớp mới
          </NavLink>

          {userRole === 'Admin' && (
            <NavLink href="/dashboard/management/accounts" icon={ShieldCheck} active={isActive('/dashboard/management/accounts')}>
              Quản lý tài khoản
            </NavLink>
          )}

          <div className="my-4 pt-4 border-t border-slate-50">
            <p className="px-3 mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">Hệ thống</p>
            <NavLink href="/dashboard/behavior-categories" icon={Settings} active={isActive('/dashboard/behavior-categories')}>
              Cài đặt Hành vi
            </NavLink>
            
            <NavLink href="/dashboard/stats" icon={BarChart2} active={isActive('/dashboard/stats')}>
              Thống kê Điểm
            </NavLink>
            
            <NavLink href="/dashboard/change-password" icon={Key} active={isActive('/dashboard/change-password')}>
              Đổi mật khẩu
            </NavLink>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-100">
          <button 
            className="flex items-center gap-3 px-3 py-2.5 w-full text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 font-bold group"
            onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}
          >
            <LogOut size={20} className="text-slate-400 group-hover:text-red-600" />
            <span className="text-sm">Đăng xuất</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto bg-[#FBFBFE]">
        <div className="min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}

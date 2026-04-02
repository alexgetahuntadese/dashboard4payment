import React from 'react';
import { 
  Users, 
  CreditCard, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  BookOpen,
  Calendar
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { Card } from '@/src/components/ui/Common';

const data = [
  { name: 'Jan', users: 400, revenue: 2400 },
  { name: 'Feb', users: 600, revenue: 3600 },
  { name: 'Mar', users: 800, revenue: 4800 },
  { name: 'Apr', users: 1200, revenue: 7200 },
  { name: 'May', users: 1500, revenue: 9000 },
  { name: 'Jun', users: 2100, revenue: 12600 },
];

const StatCard = ({ title, value, trend, icon: Icon, color }: any) => (
  <Card className="p-6">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
        <div className="flex items-center gap-1 mt-2">
          {trend > 0 ? (
            <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              <ArrowUpRight className="w-3 h-3 mr-0.5" />
              +{trend}%
            </span>
          ) : (
            <span className="flex items-center text-xs font-medium text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded">
              <ArrowDownRight className="w-3 h-3 mr-0.5" />
              {trend}%
            </span>
          )}
          <span className="text-xs text-slate-400">vs last month</span>
        </div>
      </div>
      <div className={`p-3 rounded-xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </Card>
);

export const Dashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>
          <p className="text-slate-500 text-sm mt-1">Welcome back, here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          <button className="px-3 py-1.5 text-xs font-medium bg-indigo-50 text-indigo-600 rounded-md">Today</button>
          <button className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50 rounded-md">Weekly</button>
          <button className="px-3 py-1.5 text-xs font-medium text-slate-500 hover:bg-slate-50 rounded-md">Monthly</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Users" 
          value="12,842" 
          trend={12.5} 
          icon={Users} 
          color="bg-indigo-600" 
        />
        <StatCard 
          title="Verified Payments" 
          value="8,230" 
          trend={8.2} 
          icon={CreditCard} 
          color="bg-emerald-600" 
        />
        <StatCard 
          title="Pending Reviews" 
          value="154" 
          trend={24.8} 
          icon={Calendar} 
          color="bg-amber-600" 
        />
        <StatCard 
          title="Premium Users" 
          value="4,120" 
          trend={4.1} 
          icon={TrendingUp} 
          color="bg-rose-600" 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900">User Growth</h3>
            <select className="text-xs font-medium text-slate-500 bg-slate-50 border-none outline-none rounded p-1">
              <option>Last 6 months</option>
              <option>Last year</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="users" stroke="#4f46e5" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-slate-900">Revenue Analysis</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-xs text-slate-500">Revenue</span>
              </div>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Activity Placeholder */}
      <Card className="p-6">
        <h3 className="font-bold text-slate-900 mb-6">Upcoming Events</h3>
        <div className="space-y-4">
          {[
            { title: 'New Course Launch: Advanced React', date: 'Tomorrow, 10:00 AM', type: 'Course' },
            { title: 'System Maintenance', date: 'Apr 15, 02:00 AM', type: 'System' },
            { title: 'Admin Meeting', date: 'Apr 18, 04:00 PM', type: 'Meeting' },
          ].map((event, i) => (
            <div key={i} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-slate-500" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-slate-900">{event.title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{event.date}</p>
              </div>
              <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-md">{event.type}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

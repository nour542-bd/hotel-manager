import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Chatbot } from './Chatbot';

export function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-slate-950">
      <Sidebar />
      <div className="flex-1 lg:ml-64">
        <Navbar />
        <main className="mt-16 p-6">
          {children}
        </main>
      </div>
      <Chatbot />
    </div>
  );
}

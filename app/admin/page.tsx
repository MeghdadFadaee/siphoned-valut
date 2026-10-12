import Dashboard from '../dashboard';
import { requireChatGPTUser } from '../chatgpt-auth';
import { isAdmin } from '../../lib/server';
export const dynamic='force-dynamic';
export default async function Admin(){await requireChatGPTUser('/admin');if(!await isAdmin())return <main className="denied"><h1>دسترسی محدود است</h1><p>این حساب اجازهٔ مدیریت خزانه را ندارد.</p><a href="/">بازگشت به خزانه</a></main>;return <Dashboard adminMode/>;}

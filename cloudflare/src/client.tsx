import React from 'react';
import {createRoot} from 'react-dom/client';
import Dashboard from './Dashboard';
import PlayerPage from '../../components/player-page';
import {playerFromPath} from '../../lib/player.mjs';
import migration from '../migration/ledger.json';
const name=playerFromPath(window.location.pathname);
function PlayerAccount(){
 const [rows,setRows]=React.useState(migration.rows);
 const [error,setError]=React.useState(false);
 React.useEffect(()=>{fetch('/ledger.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error();return r.json() as Promise<{rows:typeof migration.rows}>;}).then(d=>setRows(d.rows)).catch(()=>setError(true));},[]);
 return <>{error&&<div className="notice error" role="status">دریافت آخرین نسخه ممکن نشد؛ اطلاعات نسخهٔ همراه سایت نمایش داده می‌شود. <button onClick={()=>window.location.reload()}>تلاش مجدد</button></div>}<PlayerPage rows={rows} name={name!} origin="https://siphoned.oneup.megh.dad"/></>;
}
createRoot(document.getElementById('root')!).render(name?<PlayerAccount/>:<Dashboard/>);

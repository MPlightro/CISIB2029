'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, X, Landmark } from 'lucide-react';
const links = [['Home','/'],['Council','/council'],['Minutes','/minutes'],['Decisions','/decisions'],['Petitions','/petitions'],['Polls','/polls'],['Announcements','/announcements'],['Governance','/governance']];
export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname(); const [open,setOpen]=useState(false);
  return <><header className="topbar"><Link href="/" className="brand"><span className="brand-icon"><Landmark size={19}/></span><span>Class Council<small>CLASS GOVERNANCE</small></span></Link><button className="menu-toggle" aria-label={open?'Close navigation':'Open navigation'} onClick={()=>setOpen(!open)}>{open?<X/>:<Menu/>}</button><nav className={open?'nav open':'nav'} aria-label="Main navigation">{links.map(([name,href])=><Link onClick={()=>setOpen(false)} aria-current={path===href?'page':undefined} className={path===href?'active':''} href={href} key={href}>{name}</Link>)}<Link className="nav-admin" href="/admin">Council login</Link></nav></header><main className="main">{children}</main><footer><div className="footer-inner"><span>Class Council <span className="muted">· A shared space for our class</span></span><Link href="/governance">How decisions are made</Link></div><p className="footer-note">Council actions remain subject to school rules, teacher authority, and administration decisions.</p></footer></>;
}

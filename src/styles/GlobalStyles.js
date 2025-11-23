import styled, { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * { box-sizing: border-box; }
  body { margin:0; font-family: Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial; background: #f6f8fb; color:#111827; }
`;

export const AppShell = styled.div`max-width:1100px; margin:28px auto; padding:20px;`;
export const Header = styled.header`display:flex; align-items:center; justify-content:space-between; gap:16px; margin-bottom:18px;`;
export const Title = styled.h2`margin:0; font-size:20px;`;
export const Tabs = styled.div`display:flex; gap:8px;`;
export const TabButton = styled.button`
  padding:8px 12px; border-radius:8px; border:0; cursor:pointer; background:${(p) => (p.active ? '#4f46e5' : 'white')}; color:${(p) => (p.active ? 'white' : '#374151')}; box-shadow: ${(p) => (p.active ? '0 6px 18px rgba(79,70,229,0.12)' : 'none')};
`;
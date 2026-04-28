css_path = '/var/www/namaweb/public/css/styles.css'
with open(css_path, 'r') as f:
    css = f.read()

# Add premium enhancements for the Medical Dark theme
enhancements = """
/* ===== Medical Dark Premium Enhancements ===== */
[data-theme="10"] body {
  background: #0a0e1a;
  background-image: 
    radial-gradient(ellipse at 20% 50%, rgba(0, 212, 255, 0.03) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(0, 229, 160, 0.02) 0%, transparent 50%);
}

[data-theme="10"] #sidebar {
  background: linear-gradient(180deg, #0d1527 0%, #091320 100%);
  border-left: 1px solid rgba(0, 212, 255, 0.08);
  box-shadow: -4px 0 20px rgba(0, 0, 0, 0.3);
}

[data-theme="10"] .sidebar-header {
  border-bottom: 1px solid rgba(0, 212, 255, 0.1);
  background: rgba(0, 212, 255, 0.03);
}

[data-theme="10"] .sidebar-title {
  background: linear-gradient(135deg, #00d4ff, #00e5a0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 800;
}

[data-theme="10"] .nav-item {
  border-radius: 10px;
  margin: 2px 8px;
  transition: all 0.3s ease;
}

[data-theme="10"] .nav-item:hover {
  background: rgba(0, 212, 255, 0.08);
  transform: translateX(-3px);
}

[data-theme="10"] .nav-item.active {
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.15), rgba(0, 229, 160, 0.08));
  border-right: 3px solid #00d4ff;
  box-shadow: 0 0 15px rgba(0, 212, 255, 0.1);
}

[data-theme="10"] .nav-item.active .nav-label {
  color: #00d4ff;
  font-weight: 700;
}

[data-theme="10"] header, [data-theme="10"] .app-header {
  background: rgba(13, 21, 39, 0.9) !important;
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 212, 255, 0.08);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

[data-theme="10"] .card, [data-theme="10"] .stat-card {
  background: rgba(17, 27, 46, 0.8);
  border: 1px solid rgba(0, 212, 255, 0.06);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  transition: all 0.3s ease;
}

[data-theme="10"] .card:hover {
  border-color: rgba(0, 212, 255, 0.15);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3), 0 0 15px rgba(0, 212, 255, 0.05);
  transform: translateY(-2px);
}

[data-theme="10"] .page-title {
  color: #e2e8f0;
  font-weight: 800;
  font-size: 1.5rem;
}

[data-theme="10"] table {
  border-collapse: separate;
  border-spacing: 0;
}

[data-theme="10"] table thead th {
  background: rgba(0, 212, 255, 0.06);
  color: #00d4ff;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  border-bottom: 1px solid rgba(0, 212, 255, 0.1);
}

[data-theme="10"] table tbody tr {
  transition: all 0.2s ease;
}

[data-theme="10"] table tbody tr:hover {
  background: rgba(0, 212, 255, 0.04);
}

[data-theme="10"] .btn, [data-theme="10"] button.btn {
  border-radius: 10px;
  font-weight: 600;
  transition: all 0.3s ease;
}

[data-theme="10"] .btn-primary, [data-theme="10"] .btn[style*="accent"] {
  background: linear-gradient(135deg, #00d4ff, #0099cc);
  border: none;
  box-shadow: 0 4px 15px rgba(0, 212, 255, 0.2);
}

[data-theme="10"] .btn-primary:hover {
  box-shadow: 0 6px 25px rgba(0, 212, 255, 0.3);
  transform: translateY(-1px);
}

[data-theme="10"] .btn-success {
  background: linear-gradient(135deg, #00e5a0, #00b37d);
  box-shadow: 0 4px 15px rgba(0, 229, 160, 0.2);
}

[data-theme="10"] .btn-danger {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.2);
}

[data-theme="10"] input, [data-theme="10"] select, [data-theme="10"] textarea {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(0, 212, 255, 0.1);
  border-radius: 10px;
  color: #e2e8f0;
  transition: all 0.3s ease;
}

[data-theme="10"] input:focus, [data-theme="10"] select:focus, [data-theme="10"] textarea:focus {
  border-color: #00d4ff;
  box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
  outline: none;
}

[data-theme="10"] .badge, [data-theme="10"] .status-badge {
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.75rem;
}

[data-theme="10"] h1, [data-theme="10"] h2, [data-theme="10"] h3 {
  color: #e2e8f0;
}

[data-theme="10"] .search-box input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(0, 212, 255, 0.1);
}

[data-theme="10"] .search-box input:focus {
  border-color: #00d4ff;
  box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
}

[data-theme="10"] ::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

[data-theme="10"] ::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
}

[data-theme="10"] ::-webkit-scrollbar-thumb {
  background: rgba(0, 212, 255, 0.2);
  border-radius: 10px;
}

[data-theme="10"] ::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 212, 255, 0.3);
}

[data-theme="10"] .user-info, [data-theme="10"] .sidebar-footer {
  border-top: 1px solid rgba(0, 212, 255, 0.08);
  background: rgba(0, 0, 0, 0.2);
}

[data-theme="10"] .toast {
  background: rgba(13, 21, 39, 0.95);
  border: 1px solid rgba(0, 212, 255, 0.15);
  backdrop-filter: blur(20px);
  border-radius: 12px;
}
"""

if 'Medical Dark Premium' not in css:
    css += enhancements
    with open(css_path, 'w') as f:
        f.write(css)
    print("✅ Premium enhancements added")
else:
    print("⚠️ Enhancements already exist")

print("🎉 Theme styling complete!")

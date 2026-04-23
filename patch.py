import re
import sys

with open('mainwindow.cpp', 'r', encoding='utf-8') as f:
    text = f.read()

def repl(m):
    return f'qDebug() << "[DEBUG] Creating Page: {m.group(1)}";\n    {m.group(0)}'

new_text = re.sub(r'pages\->addWidget\(wrapInScroll\((create[A-Za-z]+Page)\(\)\)\);', repl, text)

# Also add debug at the start of MainWindow constructor
new_text = new_text.replace(
    'MainWindow::MainWindow(const QString &userRole, const QString &userName,\n                       QWidget *parent)\n    : QMainWindow(parent), currentUserRole(userRole),\n      currentUserName(userName) {',
    'MainWindow::MainWindow(const QString &userRole, const QString &userName,\n                       QWidget *parent)\n    : QMainWindow(parent), currentUserRole(userRole),\n      currentUserName(userName) {\n  qDebug() << "[DEBUG] MainWindow constructor started";'
)

new_text = new_text.replace(
    'setupUI();\n  applyTheme();',
    'qDebug() << "[DEBUG] Calling setupUI()...";\n  setupUI();\n  qDebug() << "[DEBUG] Calling applyTheme()...";\n  applyTheme();\n  qDebug() << "[DEBUG] MainWindow constructor ended";'
)

with open('mainwindow.cpp', 'w', encoding='utf-8') as f:
    f.write(new_text)

print("Patch applied successfully!")

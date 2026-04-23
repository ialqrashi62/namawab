import re
with open('mainwindow.cpp', 'r', encoding='utf-8') as f:
    text = f.read()

def repl(m):
    return f'qDebug() << "[DEBUG] Creating Page: {m.group(1)}";\n  {m.group(0)}'

new_text = re.sub(r'pages\->addWidget\(wrapInScroll\((create[A-Za-z]+Page)\(\)\)\);', repl, text)

with open('mainwindow.cpp', 'w', encoding='utf-8') as f:
    f.write(new_text)

print('Injected page creation traces again.')

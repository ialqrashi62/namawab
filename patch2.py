import sys

with open('mainwindow.cpp', 'r', encoding='utf-8') as f:
    lines = f.readlines()

start_idx = 0
for i, line in enumerate(lines):
    if 'QWidget *MainWindow::createDoctorStationPage()' in line:
        start_idx = i
        break

end_idx = start_idx
brace_count = 0
found_brace = False
count = 0

for i in range(start_idx, len(lines)):
    line = lines[i]
    if '{' in line:
        brace_count += line.count('{')
        found_brace = True
    if '}' in line:
        brace_count -= line.count('}')
    
    # Inject debug every 15 lines
    if found_brace and (i - start_idx) % 25 == 0 and '{' not in line and '}' not in line and not line.strip().startswith('//'):
        lines[i] = f'qDebug() << "[DEBUG] DoctorStation trace line {i}";\n' + line
        count+=1

    if found_brace and brace_count <= 0:
        end_idx = i
        break

with open('mainwindow.cpp', 'w', encoding='utf-8') as f:
    f.writelines(lines)
print(f'Bisection trace injected! Lines patched: {count}')

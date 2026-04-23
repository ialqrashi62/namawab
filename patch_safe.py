with open('mainwindow.cpp', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('QWidget *MainWindow::createDoctorStationPage() {', 'QWidget *MainWindow::createDoctorStationPage() {\nqDebug() << "[DEBUG] Entering createDoctorStationPage...";')

text = text.replace('// --- Tab 1: Medical History ---', 'qDebug() << "[DEBUG] Tab 1: Medical History";\n  // --- Tab 1: Medical History ---')

text = text.replace('// --- Tab 2: Vital Signs & Chief Complaint ---', 'qDebug() << "[DEBUG] Tab 2: Vitals";\n  // --- Tab 2: Vital Signs & Chief Complaint ---')

text = text.replace('// --- Tab 3: Current Encounter / Diagnosis ---', 'qDebug() << "[DEBUG] Tab 3: Encounter";\n  // --- Tab 3: Current Encounter / Diagnosis ---')

text = text.replace('// --- Tab 4: Prescriptions ---', 'qDebug() << "[DEBUG] Tab 4: Prescriptions";\n  // --- Tab 4: Prescriptions ---')

text = text.replace('// --- Tab 5: Lab & Radiology Orders ---', 'qDebug() << "[DEBUG] Tab 5: Orders";\n  // --- Tab 5: Lab & Radiology Orders ---')

text = text.replace('// Load drugs into the combo box', 'qDebug() << "[DEBUG] Loading Drugs into Combo Box";\n  // Load drugs into the combo box')

with open('mainwindow.cpp', 'w', encoding='utf-8') as f:
    f.write(text)
print('Safe markers injected!')

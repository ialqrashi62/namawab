import sys

file_path = "e:\\NamaMedical\\mainwindow.cpp"
with open(file_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

# Find createDoctorStationPage
doctor_start_idx = -1
for i, line in enumerate(lines):
    if "QWidget *MainWindow::createDoctorStationPage()" in line:
        doctor_start_idx = i
        break

if doctor_start_idx == -1:
    print("Could not find createDoctorStationPage()")
    sys.exit(1)

# Find start and end of vital signs tab
vitals_start_idx = -1
vitals_end_idx = -1

for i in range(doctor_start_idx, len(lines)):
    if "// --- Tab 1b: Vital Signs ---" in lines[i]:
        vitals_start_idx = i
    if "tabs->addTab(" in lines[i] and "tabVitals" in lines[i+1]:
        # The addTab for vitals spans lines. Find its matching );
        for j in range(i, len(lines)):
            if ");" in lines[j] and j >= i + 2:
                vitals_end_idx = j
                break
        if vitals_end_idx != -1:
            break

if vitals_start_idx == -1 or vitals_end_idx == -1:
    print(f"Could not find vitals tab exactly (start: {vitals_start_idx}, end: {vitals_end_idx})")
    sys.exit(1)

vitals_block = lines[vitals_start_idx:vitals_end_idx+1]
new_lines = lines[:vitals_start_idx] + lines[vitals_end_idx+1:]

# We extract patient search and waiting queue from createDoctorStationPage
# From start to loadPatBtn
patient_search_start = -1
for i in range(doctor_start_idx, len(new_lines)):
    if "// ======= PATIENT SEARCH" in new_lines[i]:
        patient_search_start = i
        break

load_btn_idx = -1
for i in range(patient_search_start, len(new_lines)):
    if "connect(loadPatBtn, &QPushButton::clicked" in new_lines[i]:
        load_btn_idx = i
        break

# Waiting Queue Tab
queue_start_idx = -1
queue_end_idx = -1
for i in range(doctor_start_idx, len(new_lines)):
    if "// --- Tab 1: Waiting Queue ---" in new_lines[i]:
        queue_start_idx = i
    if "tabs->addTab(" in new_lines[i] and "tabQueue" in new_lines[i+1]:
        for j in range(i, len(new_lines)):
            if ");" in new_lines[j]:
                queue_end_idx = j
                break
        if queue_end_idx != -1:
            break

nursing_code = []
nursing_code.append("// ===== NURSING STATION =====\n")
nursing_code.append("QWidget *MainWindow::createNursingStationPage() {\n")
nursing_code.append("  qDebug() << \"[DEBUG] Entering createNursingStationPage...\";\n")
nursing_code.append("  QWidget *page = new QWidget();\n")
nursing_code.append("  QVBoxLayout *layout = new QVBoxLayout(page);\n\n")
nursing_code.append("  QLabel *title = new QLabel(tr2(\"Nursing Station\", \"\\xd9\\x85\\xd8\\xad\\xd8\\xb7\\xd8\\xa9 \\xd8\\xa7\\xd9\\x84\\xd8\\xaa\\xd9\\x85\\xd8\\xb1\\xd9\\x8a\\xd8\\xb6\"));\n")
nursing_code.append("  title->setObjectName(\"pageTitle\");\n")
nursing_code.append("  layout->addWidget(title);\n\n")

# Copy the patient search UI (but stop before the connect lambda)
nursing_code.extend(new_lines[patient_search_start:load_btn_idx])

# Define the custom lambda for Nursing Station
custom_lambda = """
  connect(loadPatBtn, &QPushButton::clicked, [=]() {
    QString search = docPatSearch->text().trimmed();
    if (search.isEmpty()) return;
    QString fileNo = "";
    if (search.contains("| #"))
      fileNo = search.mid(search.lastIndexOf("#") + 1).trimmed();
    QSqlQuery qf = Database::instance().exec(
        QString("SELECT id, file_number, name_en, name_ar, national_id, phone, "
                "department, status, notes FROM patients WHERE "
                "name_en LIKE '%%1%' OR name_ar LIKE '%%1%' OR "
                "phone LIKE '%%1%' OR national_id LIKE '%%1%' "
                "OR file_number=%2")
            .arg(search.left(50).replace("'", "''"))
            .arg(fileNo.isEmpty() ? "0" : fileNo));
    if (!qf.next()) {
      patInfo->setText(tr2("Patient not found.", "\\xd9\\x84\\xd9\\x85 \\xd9\\x8a\\xd8\\xaa\\xd9\\x85 \\xd8\\xa7\\xd9\\x84\\xd8\\xb9\\xd8\\xab\\xd9\\x88\\xd8\\xb1 \\xd8\\xb9\\xd9\\x84\\xd9\\x89 \\xd8\\xa7\\xd9\\x84\\xd9\\x85\\xd8\\xb1\\xd9\\x8a\\xd8\\xb6."));
      patInfo->setVisible(true);
      selectedPatId->setText("0");
      return;
    }
    selectedPatId->setText(qf.value(0).toString());
    QString pName = isArabic ? qf.value(3).toString() : qf.value(2).toString();
    patInfo->setText(
        tr2("File #: ", "\\xd8\\xb1\\xd9\\x82\\xd9\\x85 \\xd8\\xa7\\xd9\\x84\\xd9\\x85\\xd9\\x84\\xd9\\x81: ") + qf.value(1).toString() + "  |  " +
        tr2("Name: ", "\\xd8\\xa7\\xd9\\x84\\xd8\\xa7\\xd8\\xb3\\xd9\\x85: ") + pName + "  |  " +
        tr2("ID: ", "\\xd8\\xa7\\xd9\\x84\\xd9\\x87\\xd9\\x88\\xd9\\x8a\\xd8\\xa9: ") + qf.value(4).toString() + "  |  " +
        tr2("Phone: ", "\\xd8\\xa7\\xd9\\x84\\xd8\\xac\\xd9\\x88\\xd8\\xa7\\xd9\\x84: ") + qf.value(5).toString());
    patInfo->setVisible(true);
  });
"""
nursing_code.append(custom_lambda)
nursing_code.append("\n")

# Tabs widget
nursing_code.append("  QTabWidget *tabs = new QTabWidget();\n")
nursing_code.append("  tabs->setObjectName(\"mainTabs\");\n")
nursing_code.append("  // Add space above tabs\n")
nursing_code.append("  layout->addSpacing(15);\n")

nursing_code.extend(new_lines[queue_start_idx:queue_end_idx+1])
nursing_code.append("\n")

# Add Vitals block
nursing_code.extend(vitals_block)
nursing_code.append("\n")

nursing_code.append("  layout->addWidget(tabs, 1);\n")
nursing_code.append("  return page;\n")
nursing_code.append("}\n\n")

final_lines = new_lines[:doctor_start_idx] + nursing_code + new_lines[doctor_start_idx:]

with open(file_path, "w", encoding="utf-8") as f:
    f.writelines(final_lines)

print("Nursing Station successfully constructed and injected!")

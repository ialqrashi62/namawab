
#include <QCoreApplication>
#include <QDebug>
#include <QDir>
#include <QSqlError>
#include <QSqlQuery>
#include <iostream>

int main(int argc, char *argv[]) {
  QCoreApplication a(argc, argv);

  // Setup DB Path identically
  QString dbPath = QDir::currentPath() + "/database.db";
  QSqlDatabase db = QSqlDatabase::addDatabase("QSQLITE");
  db.setDatabaseName(dbPath);
  if (!db.open()) {
    qCritical() << "Cannot open database:" << db.lastError().text();
    return 1;
  }

  QSqlQuery q(db);

  // 1. Insert Patient
  q.exec(
      "INSERT INTO patients (file_number, iqama_id, nationality, name_ar, "
      "name_en, gender, dob, phone, blood_type, is_insured, created_at, "
      "dob_hijri, cr_number, conditional_vat) VALUES ('E2E-100', '1010101010', "
      "'Saudi', 'اختبار آلي', 'Auto Test Patient', 'Male', '1985-05-15', "
      "'0500000000', 'O+', 0, datetime('now'), '1405-08-25', '', 0)");
  int patientId = q.lastInsertId().toInt();

  // 2. Insert Vitals
  q.prepare(
      "INSERT INTO patient_vitals (patient_id, bp_sys, bp_dia, heart_rate, "
      "temp, resp_rate, spo2, weight, height, bmi, created_at) VALUES (?, 120, "
      "80, 75, 37.0, 16, 98, 70, 175, 22.8, datetime('now'))");
  q.addBindValue(patientId);
  q.exec();

  // 3. Queue to Doctor Station (Consultation)
  q.prepare("INSERT INTO reception_queue (patient_id, department, status, "
            "visit_type, notes, created_at) VALUES (?, 'General Practice', "
            "'Waiting', 'New Consultation', 'E2E Flow', datetime('now'))");
  q.addBindValue(patientId);
  q.exec();

  std::cout << "Successfully inserted E2E Patient ID: " << patientId
            << std::endl;
  return 0;
}

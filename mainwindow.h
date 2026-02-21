#pragma once
#include <QComboBox>
#include <QDialog>
#include <QGroupBox>
#include <QHBoxLayout>
#include <QLabel>
#include <QLineEdit>
#include <QListWidget>
#include <QMainWindow>
#include <QMessageBox>
#include <QPushButton>
#include <QSqlDatabase>
#include <QSqlQuery>
#include <QStackedWidget>
#include <QTableWidget>
#include <QVBoxLayout>

class MainWindow : public QMainWindow {
  Q_OBJECT
public:
  MainWindow(const QString &userRole, const QString &userName,
             QWidget *parent = nullptr);
  ~MainWindow() = default;

private slots:
  void onNavChanged(int row);
  void onLanguageChanged(int index);

private:
  void setupUI();
  void applyTheme();
  void setupSidebar();
  bool isPageAllowed(int pageIndex) const;

  QWidget *createDashboardPage();
  QWidget *createReceptionPage();
  QWidget *createHRPage();
  QWidget *createFinancePage();
  QWidget *createInsurancePage();
  QWidget *createReferralPage();
  QWidget *createAppointmentsPage();
  QWidget *createDoctorStationPage();
  QWidget *createLabPage();
  QWidget *createRadiologyPage();
  QWidget *createSettingsPage();
  QWidget *createWaitingQueuePage();
  QWidget *createPharmacyPage();
  QWidget *createPatientAccountsPage();
  QWidget *createPatientPortalPage();
  QWidget *createAccountingPage();
  QWidget *createInventoryPage();
  QWidget *createReportsPage();
  QWidget *createMessagingPage();
  QWidget *createFormBuilderPage();
  QWidget *createDefaultPage(const QString &en, const QString &ar,
                             const QString &detailsEn = "",
                             const QString &detailsAr = "");

  QString tr2(const QString &en, const QString &ar) const;
  void setupPatientCompleter(QLineEdit *field);
  void addDeleteBtn(QTableWidget *table, int row, const QString &dbTable,
                    int dbId);

  QListWidget *navList = nullptr;
  QStackedWidget *pages = nullptr;
  QLabel *headerTitle = nullptr;
  QLineEdit *searchBox = nullptr;
  QComboBox *langCombo = nullptr;
  QWidget *centralContainer = nullptr;

  bool isArabic = false;
  int currentPage = 0;
  int currentTheme = 0;
  QComboBox *themeCombo = nullptr;
  QString currentUserRole;
  QString currentUserName;
};

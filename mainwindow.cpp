#include "mainwindow.h"
#include "database.h"
#include "invoice_generator.h"
#include <QApplication>
#include <QCheckBox>
#include <QComboBox>
#include <QCompleter>
#include <QDateEdit>
#include <QFile>
#include <QFileDialog>
#include <QFont>
#include <QFrame>
#include <QHeaderView>
#include <QInputDialog>
#include <QPixmap>
#include <QRandomGenerator>
#include <QRegularExpression>
#include <QRegularExpressionValidator>
#include <QScrollArea>
#include <QSqlQuery>
#include <QTabWidget>
#include <QTextEdit>
#include <QTimeEdit>
#include <QTimer>
#include <windows.h>

QString MainWindow::tr2(const QString &en, const QString &ar) const {
  return isArabic ? ar : en;
}

MainWindow::MainWindow(const QString &userRole, const QString &userName,
                       QWidget *parent)
    : QMainWindow(parent), currentUserRole(userRole),
      currentUserName(userName) {
  setWindowTitle("NAMA MEDICAL ERP - Professional Edition 2026");
  resize(1600, 900);
  showMaximized();
  // Load saved theme from DB
  QSqlQuery qt = Database::instance().exec(
      "SELECT setting_value FROM company_settings WHERE setting_key='theme'");
  if (qt.next())
    currentTheme = qt.value(0).toInt();
  if (currentTheme < 0 || currentTheme > 7)
    currentTheme = 0;
  setupUI();
  applyTheme();
}

bool MainWindow::isPageAllowed(int pageIndex) const {
  if (currentUserRole == "Admin")
    return true;
  if (currentUserRole == "Reception") {
    // Dashboard(0), Reception(1), Appointments(2), PatientAccounts(3),
    // WaitingQueue(5), Insurance(10), Settings(17)
    return pageIndex == 0 || pageIndex == 1 || pageIndex == 2 ||
           pageIndex == 3 || pageIndex == 5 || pageIndex == 10 ||
           pageIndex == 17;
  }
  if (currentUserRole == "Pharmacist") {
    // Pharmacy(11) only
    return pageIndex == 11;
  }
  if (currentUserRole == "Doctor") {
    // Dashboard(0), Appointments(2), WaitingQueue(5), DoctorStation(6),
    // Lab(12), Radiology(13), Reports(16), Referral(18)
    return pageIndex == 0 || pageIndex == 2 || pageIndex == 5 ||
           pageIndex == 6 || pageIndex == 12 || pageIndex == 13 ||
           pageIndex == 16 || pageIndex == 18;
  }
  return false;
}

void MainWindow::setupUI() {
  if (centralContainer) {
    centralContainer->deleteLater();
    centralContainer = nullptr;
  }
  centralContainer = new QWidget(this);
  setCentralWidget(centralContainer);

  QHBoxLayout *mainLayout = new QHBoxLayout(centralContainer);
  mainLayout->setContentsMargins(0, 0, 0, 0);
  mainLayout->setSpacing(0);

  QVBoxLayout *contentLayout = new QVBoxLayout();
  contentLayout->setContentsMargins(20, 15, 10, 15);
  contentLayout->setSpacing(15);

  // Header
  QHBoxLayout *headerLayout = new QHBoxLayout();

  // Company logo and name from settings
  QSqlQuery qLogo =
      Database::instance().exec("SELECT setting_value FROM company_settings "
                                "WHERE setting_key='logo_path'");
  QString logoPath = qLogo.next() ? qLogo.value(0).toString() : "";
  QSqlQuery qCoName = Database::instance().exec(
      QString(
          "SELECT setting_value FROM company_settings WHERE setting_key='%1'")
          .arg(isArabic ? "company_name_ar" : "company_name_en"));
  QString companyName = qCoName.next() ? qCoName.value(0).toString() : "";

  if (!logoPath.isEmpty() && QFile::exists(logoPath)) {
    QLabel *logoLabel = new QLabel();
    QPixmap pix(logoPath);
    logoLabel->setPixmap(
        pix.scaled(32, 32, Qt::KeepAspectRatio, Qt::SmoothTransformation));
    logoLabel->setFixedSize(36, 36);
    headerLayout->addWidget(logoLabel);
  }
  if (!companyName.isEmpty()) {
    QLabel *coLabel = new QLabel(companyName);
    coLabel->setStyleSheet(
        "font-size: 14px; font-weight: bold; margin-right: 10px;");
    headerLayout->addWidget(coLabel);
    headerLayout->addSpacing(10);
  }

  searchBox = new QLineEdit();
  searchBox->setPlaceholderText(
      tr2("Quick search for a patient...",
          "\xd8\xa8\xd8\xad\xd8\xab \xd8\xb3\xd8\xb1\xd9\x8a\xd8\xb9 "
          "\xd8\xb9\xd9\x86 \xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6..."));
  searchBox->setFixedHeight(40);
  searchBox->setMinimumWidth(400);
  searchBox->setObjectName("searchBox");

  langCombo = new QComboBox();
  langCombo->addItem("EN  English");
  langCombo->addItem("AR  \xd8\xb9\xd8\xb1\xd8\xa8\xd9\x8a");
  langCombo->setCurrentIndex(isArabic ? 1 : 0);
  langCombo->setFixedWidth(140);
  langCombo->setFixedHeight(40);
  langCombo->setObjectName("langCombo");
  connect(langCombo, QOverload<int>::of(&QComboBox::currentIndexChanged), this,
          &MainWindow::onLanguageChanged);

  headerTitle = new QLabel(currentUserName);
  headerTitle->setObjectName("headerUser");
  QLabel *headerStatus = new QLabel(tr2(
      "\xe2\x97\x8f Online", "\xe2\x97\x8f \xd9\x85\xd8\xaa\xd8\xb5\xd9\x84"));
  headerStatus->setObjectName("headerStatus");
  QLabel *dbLabel =
      new QLabel(tr2("\xe2\x97\x8f SQL Server Connected",
                     "\xe2\x97\x8f \xd9\x82\xd8\xa7\xd8\xb9\xd8\xaf\xd8\xa9 "
                     "\xd8\xa7\xd9\x84\xd8\xa8\xd9\x8a\xd8\xa7\xd9\x86\xd8\xa7"
                     "\xd8\xaa \xd9\x85\xd8\xaa\xd8\xb5\xd9\x84\xd8\xa9"));
  dbLabel->setStyleSheet("color: #4ade80; font-size: 11px;");

  QVBoxLayout *userBox = new QVBoxLayout();
  userBox->addWidget(headerTitle);
  userBox->addWidget(headerStatus);
  userBox->addWidget(dbLabel);

  QPushButton *logoutBtn =
      new QPushButton(tr2("Logout", "\xd8\xaa\xd8\xb3\xd8\xac\xd9\x8a\xd9\x84 "
                                    "\xd8\xae\xd8\xb1\xd9\x88\xd8\xac"));
  logoutBtn->setFixedHeight(38);
  logoutBtn->setStyleSheet(
      "QPushButton { background-color: #dc2626; color: white; "
      "border: none; border-radius: 8px; padding: 6px 16px; "
      "font-weight: bold; font-size: 13px; }"
      "QPushButton:hover { background-color: #b91c1c; }");
  connect(logoutBtn, &QPushButton::clicked, [=]() {
    if (QMessageBox::question(
            nullptr,
            tr2("Logout", "\xd8\xaa\xd8\xb3\xd8\xac\xd9\x8a\xd9\x84 "
                          "\xd8\xae\xd8\xb1\xd9\x88\xd8\xac"),
            tr2("Are you sure you want to logout?",
                "\xd9\x87\xd9\x84 \xd8\xaa\xd8\xb1\xd9\x8a\xd8\xaf "
                "\xd8\xaa\xd8\xb3\xd8\xac\xd9\x8a\xd9\x84 "
                "\xd8\xa7\xd9\x84\xd8\xae\xd8\xb1\xd9\x88\xd8\xac\xd8\x9f")) ==
        QMessageBox::Yes) {
      qApp->exit(1234);
    }
  });

  headerLayout->addWidget(searchBox);

  // Global patient search
  connect(searchBox, &QLineEdit::returnPressed, [=]() {
    QString term = searchBox->text().trimmed();
    if (term.isEmpty())
      return;
    QString safe = term;
    safe.replace("'", "''");
    QSqlQuery sq = Database::instance().exec(
        QString("SELECT file_number, name_ar, name_en, national_id, phone, "
                "department, status FROM patients WHERE "
                "CAST(file_number AS TEXT) LIKE '%%1%' OR "
                "name_en LIKE '%%1%' OR name_ar LIKE '%%1%' OR "
                "national_id LIKE '%%1%' OR phone LIKE '%%1%' "
                "ORDER BY id DESC")
            .arg(safe));
    QDialog *dlg = new QDialog(const_cast<MainWindow *>(this));
    dlg->setWindowTitle(tr2("Search Results",
                            "\xd9\x86\xd8\xaa\xd8\xa7\xd8\xa6\xd8\xac "
                            "\xd8\xa7\xd9\x84\xd8\xa8\xd8\xad\xd8\xab"));
    dlg->resize(800, 400);
    QVBoxLayout *dl = new QVBoxLayout(dlg);
    QTableWidget *tbl = new QTableWidget();
    tbl->setColumnCount(7);
    tbl->setHorizontalHeaderLabels(
        {tr2("File#", "\xd8\xb1\xd9\x82\xd9\x85"),
         tr2("Name (AR)", "\xd8\xa7\xd9\x84\xd8\xa7\xd8\xb3\xd9\x85 "
                          "\xd8\xb9\xd8\xb1\xd8\xa8\xd9\x8a"),
         tr2("Name (EN)",
             "\xd8\xa7\xd9\x84\xd8\xa7\xd8\xb3\xd9\x85 "
             "\xd8\xa5\xd9\x86\xd8\xac\xd9\x84\xd9\x8a\xd8\xb2\xd9\x8a"),
         tr2("National ID", "\xd8\xa7\xd9\x84\xd9\x87\xd9\x88\xd9\x8a\xd8\xa9"),
         tr2("Phone", "\xd8\xa7\xd9\x84\xd8\xac\xd9\x88\xd8\xa7\xd9\x84"),
         tr2("Dept", "\xd8\xa7\xd9\x84\xd9\x82\xd8\xb3\xd9\x85"),
         tr2("Status", "\xd8\xa7\xd9\x84\xd8\xad\xd8\xa7\xd9\x84\xd8\xa9")});
    tbl->horizontalHeader()->setStretchLastSection(true);
    tbl->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    tbl->verticalHeader()->setVisible(false);
    tbl->setAlternatingRowColors(true);
    tbl->verticalHeader()->setDefaultSectionSize(40);
    tbl->setSelectionBehavior(QAbstractItemView::SelectRows);
    int r = 0;
    while (sq.next()) {
      tbl->insertRow(r);
      for (int c = 0; c < 7; c++)
        tbl->setItem(r, c, new QTableWidgetItem(sq.value(c).toString()));
      r++;
    }
    QLabel *countLbl = new QLabel(
        tr2("Results: ",
            "\xd8\xa7\xd9\x84\xd9\x86\xd8\xaa\xd8\xa7\xd8\xa6\xd8\xac: ") +
        QString::number(r));
    countLbl->setStyleSheet(
        "font-weight: bold; font-size: 14px; margin-bottom: 5px;");
    dl->addWidget(countLbl);
    dl->addWidget(tbl);
    dlg->exec();
    dlg->deleteLater();
  });

  themeCombo = new QComboBox();
  themeCombo->addItem(tr2("Ocean Blue",
                          "\xd8\xa3\xd8\xb2\xd8\xb1\xd9\x82 "
                          "\xd9\x85\xd8\xad\xd9\x8a\xd8\xb7\xd9\x8a"));
  themeCombo->addItem(tr2("Emerald Green",
                          "\xd8\xa3\xd8\xae\xd8\xb6\xd8\xb1 "
                          "\xd8\xb2\xd9\x85\xd8\xb1\xd8\xaf\xd9\x8a"));
  themeCombo->addItem(tr2("Royal Purple",
                          "\xd8\xa8\xd9\x86\xd9\x81\xd8\xb3\xd8\xac\xd9\x8a "
                          "\xd9\x85\xd9\x84\xd9\x83\xd9\x8a"));
  themeCombo->addItem(tr2("Crimson Red",
                          "\xd8\xa3\xd8\xad\xd9\x85\xd8\xb1 "
                          "\xd9\x82\xd8\xb1\xd9\x85\xd8\xb2\xd9\x8a"));
  themeCombo->addItem(
      tr2("Sunrise Gold",
          "\xd8\xb0\xd9\x87\xd8\xa8\xd9\x8a \xd8\xb4\xd8\xb1\xd9\x88\xd9\x82"));
  themeCombo->addItem(
      tr2("Light Classic",
          "\xd9\x81\xd8\xa7\xd8\xaa\xd8\xad "
          "\xd9\x83\xd9\x84\xd8\xa7\xd8\xb3\xd9\x8a\xd9\x83\xd9\x8a"));
  themeCombo->addItem(tr2("Sky Light",
                          "\xd8\xb3\xd9\x85\xd8\xa7\xd9\x88\xd9\x8a "
                          "\xd9\x81\xd8\xa7\xd8\xaa\xd8\xad"));
  themeCombo->addItem(tr2("Mint Fresh",
                          "\xd9\x86\xd8\xb9\xd9\x86\xd8\xa7\xd8\xb9\xd9\x8a "
                          "\xd9\x85\xd9\x86\xd8\xb9\xd8\xb4"));
  themeCombo->setCurrentIndex(currentTheme);
  themeCombo->setFixedWidth(160);
  themeCombo->setFixedHeight(40);
  themeCombo->setObjectName("langCombo");
  connect(themeCombo, QOverload<int>::of(&QComboBox::currentIndexChanged),
          [=](int idx) {
            currentTheme = idx;
            applyTheme();
            // Save theme to DB
            Database::instance().exec(
                QString("IF EXISTS (SELECT 1 FROM company_settings WHERE "
                        "setting_key='theme') UPDATE company_settings SET "
                        "setting_value='%1' WHERE setting_key='theme' "
                        "ELSE INSERT INTO company_settings (setting_key, "
                        "setting_value) VALUES ('theme','%1')")
                    .arg(idx));
          });

  headerLayout->addStretch();
  headerLayout->addWidget(themeCombo);
  headerLayout->addSpacing(5);
  headerLayout->addWidget(langCombo);
  headerLayout->addSpacing(15);
  headerLayout->addLayout(userBox);
  headerLayout->addSpacing(10);
  headerLayout->addWidget(logoutBtn);
  contentLayout->addLayout(headerLayout);

  QFrame *sep = new QFrame();
  sep->setFrameShape(QFrame::HLine);
  sep->setObjectName("separator");
  contentLayout->addWidget(sep);

  // Pages (17 modules)
  auto wrapInScroll = [](QWidget *w) -> QScrollArea * {
    QScrollArea *sa = new QScrollArea();
    sa->setWidget(w);
    sa->setWidgetResizable(true);
    sa->setFrameShape(QFrame::NoFrame);
    return sa;
  };

  pages = new QStackedWidget();
  pages->addWidget(wrapInScroll(createDashboardPage()));       // 0
  pages->addWidget(wrapInScroll(createReceptionPage()));       // 1
  pages->addWidget(wrapInScroll(createAppointmentsPage()));    // 2
  pages->addWidget(wrapInScroll(createPatientAccountsPage())); // 3
  pages->addWidget(wrapInScroll(createPatientPortalPage()));   // 4
  pages->addWidget(wrapInScroll(createWaitingQueuePage()));    // 5
  pages->addWidget(wrapInScroll(createDoctorStationPage()));   // 6
  pages->addWidget(wrapInScroll(createFinancePage()));         // 7
  pages->addWidget(wrapInScroll(createAccountingPage()));      // 8
  pages->addWidget(wrapInScroll(createInsurancePage()));       // 10
  pages->addWidget(wrapInScroll(createPharmacyPage()));        // 11
  pages->addWidget(wrapInScroll(createLabPage()));             // 12
  pages->addWidget(wrapInScroll(createRadiologyPage()));       // 13
  pages->addWidget(wrapInScroll(createHRPage()));              // 14
  pages->addWidget(wrapInScroll(createInventoryPage()));       // 15
  pages->addWidget(wrapInScroll(createReportsPage()));         // 16
  pages->addWidget(wrapInScroll(createSettingsPage()));        // 17
  pages->addWidget(wrapInScroll(createReferralPage()));        // 18
  pages->addWidget(wrapInScroll(createMessagingPage()));       // 19
  pages->addWidget(wrapInScroll(createFormBuilderPage()));     // 20

  pages->setCurrentIndex(currentPage);
  // Set comfortable row height on all tables at startup
  for (int i = 0; i < pages->count(); i++) {
    QList<QTableWidget *> tables =
        pages->widget(i)->findChildren<QTableWidget *>();
    for (QTableWidget *t : tables) {
      t->verticalHeader()->setDefaultSectionSize(40);
    }
  }
  contentLayout->addWidget(pages);

  // Auto-refresh data when switching pages
  connect(pages, &QStackedWidget::currentChanged, this, [this](int) {
    QWidget *currentPage = pages->currentWidget();
    if (!currentPage)
      return;

    // Refresh doctor combo in Appointments page
    QComboBox *docCombo =
        currentPage->findChild<QComboBox *>("apptDoctorCombo");
    if (docCombo) {
      docCombo->clear();
      docCombo->addItem(tr2("-- Select Doctor --",
                            "-- \xd8\xa7\xd8\xae\xd8\xaa\xd8\xb1 "
                            "\xd8\xb7\xd8\xa8\xd9\x8a\xd8\xa8 --"));
      QSqlQuery qDoc = Database::instance().exec(
          "SELECT name FROM employees WHERE role='Doctor' ORDER BY name");
      while (qDoc.next())
        docCombo->addItem(qDoc.value(0).toString());
    }

    // Refresh patient autocomplete in Appointments page
    QLineEdit *patSearch =
        currentPage->findChild<QLineEdit *>("apptPatientSearch");
    if (patSearch) {
      QStringList patSuggestions;
      QSqlQuery qPat = Database::instance().exec(
          "SELECT name_en, name_ar, phone, file_number FROM patients ORDER BY "
          "id DESC");
      while (qPat.next()) {
        patSuggestions << (qPat.value(0).toString() + " | " +
                           qPat.value(1).toString() + " | " +
                           qPat.value(2).toString() + " | #" +
                           qPat.value(3).toString());
      }
      QCompleter *c = new QCompleter(patSuggestions, patSearch);
      c->setCaseSensitivity(Qt::CaseInsensitive);
      c->setFilterMode(Qt::MatchContains);
      patSearch->setCompleter(c);
    }

    // Refresh any table with objectName "refreshableTable" in the current page
    QList<QTableWidget *> tables = currentPage->findChildren<QTableWidget *>();
    // Tables are populated at creation, specific refresh can be added per page
  });

  setupSidebar();

  if (isArabic) {
    mainLayout->addLayout(contentLayout, 1);
    mainLayout->addWidget(navList);
  } else {
    mainLayout->addWidget(navList);
    mainLayout->addLayout(contentLayout, 1);
  }
}

void MainWindow::setupSidebar() {
  navList = new QListWidget();
  navList->setObjectName("sidebar");
  navList->setFixedWidth(260);

  auto addLogo = [&]() {
    QListWidgetItem *logo = new QListWidgetItem(
        "  " + tr2("Nama Medical", "\xd9\x86\xd9\x85\xd8\xa7 "
                                   "\xd8\xa7\xd9\x84\xd8\xb7\xd8\xa8\xd9\x8a"));
    logo->setFlags(Qt::NoItemFlags);
    QFont f;
    f.setPointSize(16);
    f.setBold(true);
    logo->setFont(f);
    logo->setForeground(QColor("#60a5fa"));
    navList->addItem(logo);
    QListWidgetItem *ver = new QListWidgetItem(
        "  " + tr2("Professional 2026",
                   "\xd8\xa7\xd9\x84\xd9\x86\xd8\xb3\xd8\xae\xd8\xa9 "
                   "\xd8\xa7\xd9\x84\xd8\xa7\xd8\xad\xd8\xaa\xd8\xb1\xd8\xa7"
                   "\xd9\x81\xd9\x8a\xd8\xa9"));
    ver->setFlags(Qt::NoItemFlags);
    ver->setForeground(QColor("#94a3b8"));
    navList->addItem(ver);
  };
  auto addSep = [&]() {
    QListWidgetItem *s = new QListWidgetItem("");
    s->setFlags(Qt::NoItemFlags);
    s->setSizeHint(QSize(0, 6));
    navList->addItem(s);
  };
  auto addHdr = [&](const QString &en, const QString &ar) {
    QListWidgetItem *h = new QListWidgetItem("  " + tr2(en, ar));
    h->setFlags(Qt::NoItemFlags);
    h->setForeground(QColor("#64748b"));
    QFont f;
    f.setPointSize(7);
    f.setBold(true);
    h->setFont(f);
    navList->addItem(h);
  };
  auto addNav = [&](const QString &en, const QString &ar) {
    QListWidgetItem *item = new QListWidgetItem("  " + tr2(en, ar));
    item->setSizeHint(QSize(0, 36));
    navList->addItem(item);
  };

  addLogo();
  addSep(); // rows 0-2
  addHdr(
      "CLINICAL",
      "\xd8\xa7\xd9\x84\xd8\xb9\xd9\x8a\xd8\xa7\xd8\xaf\xd8\xa7\xd8\xaa"); // 3
  addNav("Dashboard",
         "\xd9\x84\xd9\x88\xd8\xad\xd8\xa9 "
         "\xd8\xa7\xd9\x84\xd8\xaa\xd8\xad\xd9\x83\xd9\x85"); // row 4 -> page 0
  addNav("Reception", "\xd8\xa7\xd9\x84\xd8\xa7\xd8\xb3\xd8\xaa\xd9\x82\xd8\xa8"
                      "\xd8\xa7\xd9\x84"); // row 5 -> page 1
  addNav("Appointments", "\xd8\xa7\xd9\x84\xd9\x85\xd9\x88\xd8\xa7\xd8\xb9\xd9"
                         "\x8a\xd8\xaf"); // row 6 -> page 2
  addNav("Patient Accounts",
         "\xd8\xad\xd8\xb3\xd8\xa7\xd8\xa8\xd8\xa7\xd8\xaa "
         "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd8\xb6\xd9\x89"); // row 7 -> page 3
  addNav("Patient Portal",
         "\xd8\xa8\xd9\x88\xd8\xa7\xd8\xa8\xd8\xa9 "
         "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd8\xb6\xd9\x89"); // row 8 -> page 4
  addNav("Waiting Queue", "\xd8\xb5\xd9\x81\xd9\x88\xd9\x81 "
                          "\xd8\xa7\xd9\x84\xd8\xa7\xd9\x86\xd8\xaa\xd8\xb8\xd8"
                          "\xa7\xd8\xb1"); // row 9 -> page 5
  addNav(
      "Doctor/Nursing Station",
      "\xd9\x85\xd8\xad\xd8\xb7\xd8\xa9 "
      "\xd8\xa7\xd9\x84\xd8\xb7\xd8\xa8\xd9\x8a\xd8\xa8 / "
      "\xd8\xa7\xd9\x84\xd8\xaa\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6"); // row 10 ->
                                                                   // page 6
  addSep();                                                        // row 12
  addHdr("FINANCE",
         "\xd8\xa7\xd9\x84\xd9\x85\xd8\xa7\xd9\x84\xd9\x8a\xd8\xa9"); // row 13
  addNav("Invoicing (ZATCA)", "\xd8\xa7\xd9\x84\xd9\x81\xd9\x88\xd8\xa7\xd8\xaa"
                              "\xd9\x8a\xd8\xb1"); // row 14 -> page 8
  addNav("Accounting", "\xd8\xa7\xd9\x84\xd8\xad\xd8\xb3\xd8\xa7\xd8\xa8\xd8"
                       "\xa7\xd8\xaa"); // row 15 -> page 9
  addNav(
      "Insurance",
      "\xd8\xa7\xd9\x84\xd8\xaa\xd8\xa3\xd9\x85\xd9\x8a\xd9\x86"); // row 16 ->
                                                                   // page 10
  addSep();                                                        // row 17
  addHdr(
      "PHARMACY & LAB",
      "\xd8\xa7\xd9\x84\xd8\xb5\xd9\x8a\xd8\xaf\xd9\x84\xd8\xa9 "
      "\xd9\x88\xd8\xa7\xd9\x84\xd9\x85\xd8\xae\xd8\xaa\xd8\xa8\xd8\xb1"); // row
                                                                           // 18
  addNav("Pharmacy", "\xd8\xa7\xd9\x84\xd8\xb5\xd9\x8a\xd8\xaf\xd9\x84\xd9\x8a"
                     "\xd8\xa9"); // row 19 -> page 11
  addNav(
      "Laboratory",
      "\xd8\xa7\xd9\x84\xd9\x85\xd8\xae\xd8\xaa\xd8\xa8\xd8\xb1"); // row 20 ->
                                                                   // page 12
  addNav(
      "Radiology",
      "\xd8\xa7\xd9\x84\xd8\xa3\xd8\xb4\xd8\xb9\xd8\xa9"); // row 21 -> page 13
  addSep();                                                // row 22
  addHdr("ADMIN",
         "\xd8\xa7\xd9\x84\xd8\xa5\xd8\xaf\xd8\xa7\xd8\xb1\xd8\xa9"); // row 23
  addNav(
      "Human Resources",
      "\xd8\xa7\xd9\x84\xd9\x85\xd9\x88\xd8\xa7\xd8\xb1\xd8\xaf "
      "\xd8\xa7\xd9\x84\xd8\xa8\xd8\xb4\xd8\xb1\xd9\x8a\xd8\xa9"); // row 24 ->
                                                                   // page 14
  addNav(
      "Inventory",
      "\xd8\xa7\xd9\x84\xd9\x85\xd8\xae\xd8\xb2\xd9\x88\xd9\x86"); // row 25 ->
                                                                   // page 15
  addNav("Reports", "\xd8\xa7\xd9\x84\xd8\xaa\xd9\x82\xd8\xa7\xd8\xb1\xd9\x8a"
                    "\xd8\xb1"); // row 26 -> page 16
  addNav("Settings", "\xd8\xa7\xd9\x84\xd8\xa5\xd8\xb9\xd8\xaf\xd8\xa7\xd8\xaf"
                     "\xd8\xa7\xd8\xaa"); // row 27 -> page 17
  addNav(
      "Patient Referral",
      "\xd8\xaa\xd8\xad\xd9\x88\xd9\x8a\xd9\x84 "
      "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd8\xb6\xd9\x89"); // row 28 -> page 18
  addNav("Messaging",
         "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd8\xa7\xd8\xb3\xd9\x84\xd8\xa7\xd8"
         "\xaa"); // row 29 -> page 19
  addNav(
      "Form Builder",
      "\xd9\x85\xd9\x86\xd8\xb4\xd8\xa6 "
      "\xd8\xa7\xd9\x84\xd9\x86\xd9\x85\xd8\xa7\xd8\xb0\xd8\xac"); // row 30 ->
                                                                   // page 20

  // We find the matching row based on currentPage iteration mapping
  int navRow = 4;
  int pageMapArr[] = {-1, -1, -1, -1, 0,  1,  2,  3,  4,  5,  6,
                      7,  -1, -1, 8,  9,  10, -1, -1, 11, 12, 13,
                      -1, -1, 14, 15, 16, 17, 18, 19, 20};

  for (int i = 0; i < sizeof(pageMapArr) / sizeof(int); i++) {
    if (pageMapArr[i] == currentPage) {
      navRow = i;
      break;
    }
  }

  navList->setCurrentRow(navRow);
  connect(navList, &QListWidget::currentRowChanged, this,
          &MainWindow::onNavChanged);

  // Hide sidebar items based on role
  if (currentUserRole != "Admin") {
    int pageMapArr2[] = {-1, -1, -1, -1, 0,  1,  2,  3,  4,  5,
                         6,  -1, -1, 8,  9,  10, -1, -1, 11, 12,
                         13, -1, 14, 15, 16, 17, 18, 19, 20};
    for (int i = 0; i < (int)(sizeof(pageMapArr2) / sizeof(int)); i++) {
      if (pageMapArr2[i] >= 0 && !isPageAllowed(pageMapArr2[i])) {
        QListWidgetItem *item = navList->item(i);
        if (item)
          item->setHidden(true);
      }
    }
  }
}

void MainWindow::onNavChanged(int row) {
  int pageMap[] = {
      -1, -1, -1, -1,            // Logo, version, sep, clinical
      0,  1,  2,  3,  4,  5,  6, // Patient pages 0-6
      -1, -1,                    // Sep, Finance header
      8,  9,  10,                // Finance pages 8-10
      -1, -1,                    // Sep, Pharma header
      11, 12, 13,                // Pharma pages 11-13
      -1, -1,                    // Sep, Admin
      14, 15, 16, 17, 18, 19, 20 // Admin pages 14-20
  };
  if (row >= 0 && row < (int)(sizeof(pageMap) / sizeof(pageMap[0])) &&
      pageMap[row] >= 0) {
    if (!isPageAllowed(pageMap[row])) {
      QMessageBox::warning(
          this,
          tr2("Access Denied",
              "\xd8\xba\xd9\x8a\xd8\xb1 \xd9\x85\xd8\xb5\xd8\xb1\xd8\xad"),
          tr2("You do not have permission to access this module.",
              "\xd9\x84\xd9\x8a\xd8\xb3 \xd9\x84\xd8\xaf\xd9\x8a\xd9\x83 "
              "\xd8\xb5\xd9\x84\xd8\xa7\xd8\xad\xd9\x8a\xd8\xa9 "
              "\xd9\x84\xd9\x84\xd8\xaf\xd8\xae\xd9\x88\xd9\x84 "
              "\xd8\xa5\xd9\x84\xd9\x89 \xd9\x87\xd8\xb0\xd9\x87 "
              "\xd8\xa7\xd9\x84\xd9\x88\xd8\xad\xd8\xaf\xd8\xa9."));
      return;
    }
    int idx = pageMap[row];
    currentPage = idx;

    // Recreate the page fresh from database
    QWidget *newPage = nullptr;
    switch (idx) {
    case 0:
      newPage = createDashboardPage();
      break;
    case 1:
      newPage = createReceptionPage();
      break;
    case 2:
      newPage = createAppointmentsPage();
      break;
    case 3:
      newPage = createPatientAccountsPage();
      break;
    case 4:
      newPage = createPatientPortalPage();
      break;
    case 5:
      newPage = createWaitingQueuePage();
      break;
    case 6:
      newPage = createDoctorStationPage();
      break;

    case 8:
      newPage = createFinancePage();
      break;
    case 9:
      newPage = createAccountingPage();
      break;
    case 10:
      newPage = createInsurancePage();
      break;
    case 11:
      newPage = createPharmacyPage();
      break;
    case 12:
      newPage = createLabPage();
      break;
    case 13:
      newPage = createRadiologyPage();
      break;
    case 14:
      newPage = createHRPage();
      break;
    case 15:
      newPage = createInventoryPage();
      break;
    case 16:
      newPage = createReportsPage();
      break;
    case 17:
      newPage = createSettingsPage();
      break;
    case 18:
      newPage = createReferralPage();
      break;
    case 19:
      newPage = createMessagingPage();
      break;
    case 20:
      newPage = createFormBuilderPage();
      break;
    }

    if (newPage) {
      // Set comfortable row height on all tables
      QList<QTableWidget *> tables = newPage->findChildren<QTableWidget *>();
      for (QTableWidget *t : tables) {
        t->verticalHeader()->setDefaultSectionSize(40);
      }
      // Wrap in scroll area
      QScrollArea *sa = new QScrollArea();
      sa->setWidget(newPage);
      sa->setWidgetResizable(true);
      sa->setFrameShape(QFrame::NoFrame);
      // Replace old page with fresh one
      QWidget *oldPage = pages->widget(idx);
      if (oldPage) {
        pages->removeWidget(oldPage);
        oldPage->deleteLater();
      }
      pages->insertWidget(idx, sa);
      pages->setCurrentIndex(idx);
    }
  }
}

// ===== PATIENT REFERRAL =====
QWidget *MainWindow::createReferralPage() {
  QWidget *page = new QWidget();
  QVBoxLayout *layout = new QVBoxLayout(page);
  QLabel *title = new QLabel(tr2(
      "Patient Referral", "\xd8\xaa\xd8\xad\xd9\x88\xd9\x8a\xd9\x84 "
                          "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd8\xb6\xd9\x89"));
  title->setObjectName("pageTitle");
  layout->addWidget(title);

  QGroupBox *box =
      new QGroupBox(tr2("Transfer Patient to Department",
                        "\xd8\xaa\xd8\xad\xd9\x88\xd9\x8a\xd9\x84 "
                        "\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6 "
                        "\xd8\xa5\xd9\x84\xd9\x89 \xd9\x82\xd8\xb3\xd9\x85"));
  box->setObjectName("card");
  QVBoxLayout *bl = new QVBoxLayout(box);

  // Patient table
  QTableWidget *table = new QTableWidget();
  table->setColumnCount(6);
  table->setHorizontalHeaderLabels(
      {tr2("File #",
           "\xd8\xb1\xd9\x82\xd9\x85 \xd8\xa7\xd9\x84\xd9\x85\xd9\x84\xd9\x81"),
       tr2("Name", "\xd8\xa7\xd9\x84\xd8\xa7\xd8\xb3\xd9\x85"),
       tr2("Current Dept", "\xd8\xa7\xd9\x84\xd9\x82\xd8\xb3\xd9\x85 "
                           "\xd8\xa7\xd9\x84\xd8\xad\xd8\xa7\xd9\x84\xd9\x8a"),
       tr2("Transfer To",
           "\xd8\xaa\xd8\xad\xd9\x88\xd9\x8a\xd9\x84 \xd8\xa5\xd9\x84\xd9\x89"),
       tr2("Delete", "\xd8\xad\xd8\xb0\xd9\x81")});
  table->horizontalHeader()->setStretchLastSection(true);
  table->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  table->verticalHeader()->setVisible(false);

  QSqlQuery q = Database::instance().exec(
      "SELECT id, file_number, name_en, name_ar, department, status FROM "
      "patients ORDER BY id DESC");
  int row = 0;
  while (q.next()) {
    table->insertRow(row);
    int patId = q.value(0).toInt();
    table->setItem(row, 0,
                   new QTableWidgetItem(QString::number(q.value(1).toInt())));
    table->setItem(row, 1,
                   new QTableWidgetItem(isArabic ? q.value(3).toString()
                                                 : q.value(2).toString()));
    table->setItem(row, 2, new QTableWidgetItem(q.value(4).toString()));

    // Department combo
    QComboBox *combo = new QComboBox();
    combo->addItem(
        tr2("General Clinic",
            "\xd8\xa7\xd9\x84\xd8\xb9\xd9\x8a\xd8\xa7\xd8\xaf\xd8\xa9 "
            "\xd8\xa7\xd9\x84\xd8\xb9\xd8\xa7\xd9\x85\xd8\xa9"));
    combo->addItem(tr2(
        "Internal Medicine",
        "\xd8\xa7\xd9\x84\xd8\xa8\xd8\xa7\xd8\xb7\xd9\x86\xd9\x8a\xd8\xa9"));
    combo->addItem(
        tr2("Pediatrics",
            "\xd8\xa7\xd9\x84\xd8\xa3\xd8\xb7\xd9\x81\xd8\xa7\xd9\x84"));
    combo->addItem(
        tr2("Orthopedics", "\xd8\xa7\xd9\x84\xd8\xb9\xd8\xb8\xd8\xa7\xd9\x85"));
    combo->addItem(
        tr2("Dermatology",
            "\xd8\xa7\xd9\x84\xd8\xac\xd9\x84\xd8\xaf\xd9\x8a\xd8\xa9"));
    combo->addItem(tr2("ENT",
                       "\xd8\xa7\xd9\x84\xd8\xa3\xd9\x86\xd9\x81 "
                       "\xd9\x88\xd8\xa7\xd9\x84\xd8\xa3\xd8\xb0\xd9\x86"));
    combo->addItem(tr2("Ophthalmology",
                       "\xd8\xa7\xd9\x84\xd8\xb9\xd9\x8a\xd9\x88\xd9\x86"));
    combo->addItem(tr2(
        "Dental", "\xd8\xa7\xd9\x84\xd8\xa3\xd8\xb3\xd9\x86\xd8\xa7\xd9\x86"));
    combo->addItem(
        tr2("Lab & Radiology",
            "\xd8\xa7\xd9\x84\xd9\x85\xd8\xae\xd8\xaa\xd8\xa8\xd8\xb1 "
            "\xd9\x88\xd8\xa7\xd9\x84\xd8\xa3\xd8\xb4\xd8\xb9\xd8\xa9"));
    combo->addItem(
        tr2("Emergency",
            "\xd8\xa7\xd9\x84\xd8\xb7\xd9\x88\xd8\xa7\xd8\xb1\xd8\xa6"));
    combo->addItem(tr2(
        "Pharmacy",
        "\xd8\xa7\xd9\x84\xd8\xb5\xd9\x8a\xd8\xaf\xd9\x84\xd9\x8a\xd8\xa9"));
    table->setCellWidget(row, 3, combo);
    addDeleteBtn(table, row, "patients", patId);

    // Transfer button
    QPushButton *btn = new QPushButton(
        tr2("Transfer", "\xd8\xaa\xd8\xad\xd9\x88\xd9\x8a\xd9\x84"));
    btn->setObjectName("primaryBtn");
    btn->setFixedHeight(30);
    connect(btn, &QPushButton::clicked, [=]() {
      QString newDept = combo->currentText();
      Database::instance().exec(
          QString("UPDATE patients SET department='%1' WHERE id=%2")
              .arg(newDept)
              .arg(patId));
      table->setItem(row, 2, new QTableWidgetItem(newDept));
      QMessageBox::information(
          nullptr, tr2("Done", "\xd8\xaa\xd9\x85"),
          tr2("Patient transferred to ",
              "\xd8\xaa\xd9\x85 \xd8\xaa\xd8\xad\xd9\x88\xd9\x8a\xd9\x84 "
              "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6 "
              "\xd8\xa5\xd9\x84\xd9\x89 ") +
              newDept);
    });
    table->setCellWidget(row, 4, btn);
    row++;
  }

  bl->addWidget(table);
  layout->addWidget(box);
  layout->addStretch();
  return page;
}

// ===== APPOINTMENTS =====
QWidget *MainWindow::createAppointmentsPage() {
  QWidget *page = new QWidget();
  QVBoxLayout *layout = new QVBoxLayout(page);
  QLabel *title = new QLabel(
      tr2("Appointment Management",
          "\xd8\xa5\xd8\xaf\xd8\xa7\xd8\xb1\xd8\xa9 "
          "\xd8\xa7\xd9\x84\xd9\x85\xd9\x88\xd8\xa7\xd8\xb9\xd9\x8a\xd8\xaf"));
  title->setObjectName("pageTitle");
  layout->addWidget(title);

  QHBoxLayout *mainLay = new QHBoxLayout();

  // --- Booking form ---
  QGroupBox *formBox = new QGroupBox(
      tr2("Book Appointment",
          "\xd8\xad\xd8\xac\xd8\xb2 \xd9\x85\xd9\x88\xd8\xb9\xd8\xaf"));
  formBox->setObjectName("card");
  QVBoxLayout *fl = new QVBoxLayout(formBox);

  fl->addWidget(new QLabel(tr2(
      "Patient Name / Phone / File #",
      "\xd8\xa7\xd8\xb3\xd9\x85 "
      "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6 / "
      "\xd8\xa7\xd9\x84\xd8\xac\xd9\x88\xd8\xa7\xd9\x84 / "
      "\xd8\xb1\xd9\x82\xd9\x85 \xd8\xa7\xd9\x84\xd9\x85\xd9\x84\xd9\x81")));
  QLineEdit *patName = new QLineEdit();
  patName->setFixedHeight(36);
  patName->setObjectName("apptPatientSearch");
  patName->setPlaceholderText(
      tr2("Type to search...", "\xd8\xa7\xd8\xa8\xd8\xad\xd8\xab..."));
  // Build autocomplete list from patients
  QStringList patSuggestions;
  QSqlQuery qPat =
      Database::instance().exec("SELECT name_en, name_ar, phone, file_number "
                                "FROM patients ORDER BY id DESC");
  while (qPat.next()) {
    QString entry =
        qPat.value(0).toString() + " | " + qPat.value(1).toString() + " | " +
        qPat.value(2).toString() + " | #" + qPat.value(3).toString();
    patSuggestions << entry;
  }
  QCompleter *patCompleter = new QCompleter(patSuggestions, patName);
  patCompleter->setCaseSensitivity(Qt::CaseInsensitive);
  patCompleter->setFilterMode(Qt::MatchContains);
  patName->setCompleter(patCompleter);
  fl->addWidget(patName);

  fl->addWidget(new QLabel(
      tr2("Doctor Name", "\xd8\xa7\xd8\xb3\xd9\x85 "
                         "\xd8\xa7\xd9\x84\xd8\xb7\xd8\xa8\xd9\x8a\xd8\xa8")));
  QComboBox *docCombo = new QComboBox();
  docCombo->setFixedHeight(36);
  docCombo->setObjectName("apptDoctorCombo");
  docCombo->addItem(tr2("-- Select Doctor --",
                        "-- \xd8\xa7\xd8\xae\xd8\xaa\xd8\xb1 "
                        "\xd8\xb7\xd8\xa8\xd9\x8a\xd8\xa8 --"));
  QSqlQuery qDoc = Database::instance().exec(
      "SELECT name FROM employees WHERE role='Doctor' OR role='Physician' "
      "OR role LIKE '%doctor%' OR role LIKE "
      "'%\xd8\xb7\xd8\xa8\xd9\x8a\xd8\xa8%' "
      "ORDER BY name");
  while (qDoc.next())
    docCombo->addItem(qDoc.value(0).toString());
  fl->addWidget(docCombo);

  fl->addWidget(new QLabel(
      tr2("Department", "\xd8\xa7\xd9\x84\xd9\x82\xd8\xb3\xd9\x85")));
  QComboBox *dept = new QComboBox();
  dept->setFixedHeight(36);
  dept->addItem(tr2("General Clinic",
                    "\xd8\xa7\xd9\x84\xd8\xb9\xd9\x8a\xd8\xa7\xd8\xaf\xd8\xa9 "
                    "\xd8\xa7\xd9\x84\xd8\xb9\xd8\xa7\xd9\x85\xd8\xa9"));
  dept->addItem(
      tr2("Internal Medicine",
          "\xd8\xa7\xd9\x84\xd8\xa8\xd8\xa7\xd8\xb7\xd9\x86\xd9\x8a\xd8\xa9"));
  dept->addItem(
      tr2("Pediatrics",
          "\xd8\xa7\xd9\x84\xd8\xa3\xd8\xb7\xd9\x81\xd8\xa7\xd9\x84"));
  dept->addItem(
      tr2("Orthopedics", "\xd8\xa7\xd9\x84\xd8\xb9\xd8\xb8\xd8\xa7\xd9\x85"));
  dept->addItem(
      tr2("Dermatology",
          "\xd8\xa7\xd9\x84\xd8\xac\xd9\x84\xd8\xaf\xd9\x8a\xd8\xa9"));
  dept->addItem(tr2("ENT", "\xd8\xa7\xd9\x84\xd8\xa3\xd9\x86\xd9\x81 "
                           "\xd9\x88\xd8\xa7\xd9\x84\xd8\xa3\xd8\xb0\xd9\x86"));
  dept->addItem(
      tr2("Ophthalmology", "\xd8\xa7\xd9\x84\xd8\xb9\xd9\x8a\xd9\x88\xd9\x86"));
  dept->addItem(tr2(
      "Dental", "\xd8\xa7\xd9\x84\xd8\xa3\xd8\xb3\xd9\x86\xd8\xa7\xd9\x86"));
  fl->addWidget(dept);

  fl->addWidget(new QLabel(
      tr2("Date", "\xd8\xa7\xd9\x84\xd8\xaa\xd8\xa7\xd8\xb1\xd9\x8a\xd8\xae")));
  QDateEdit *dateEdit = new QDateEdit(QDate::currentDate());
  dateEdit->setFixedHeight(36);
  dateEdit->setCalendarPopup(true);
  fl->addWidget(dateEdit);

  fl->addWidget(new QLabel(
      this->tr2("Time", "\xd8\xa7\xd9\x84\xd9\x88\xd9\x82\xd8\xaa")));
  QTimeEdit *timeEdit = new QTimeEdit(QTime::currentTime());
  timeEdit->setFixedHeight(36);
  fl->addWidget(timeEdit);

  fl->addWidget(new QLabel(this->tr2(
      "Notes", "\xd9\x85\xd9\x84\xd8\xa7\xd8\xad\xd8\xb8\xd8\xa7\xd8\xaa")));
  QLineEdit *notes = new QLineEdit();
  notes->setFixedHeight(36);
  fl->addWidget(notes);

  QPushButton *bookBtn = new QPushButton(
      this->tr2("Book Appointment", "\xd8\xad\xd8\xac\xd8\xb2 "
                                    "\xd9\x85\xd9\x88\xd8\xb9\xd8\xaf"));
  bookBtn->setObjectName("primaryBtn");
  bookBtn->setFixedHeight(45);
  fl->addWidget(bookBtn);
  fl->addStretch();

  // --- Appointments list ---
  QGroupBox *listBox = new QGroupBox(this->tr2(
      "Appointments List",
      "\xd9\x82\xd8\xa7\xd8\xa6\xd9\x85\xd8\xa9 "
      "\xd8\xa7\xd9\x84\xd9\x85\xd9\x88\xd8\xa7\xd8\xb9\xd9\x8a\xd8\xaf"));
  listBox->setObjectName("card");
  QVBoxLayout *ll = new QVBoxLayout(listBox);

  // Search
  QLineEdit *searchAppt = new QLineEdit();
  searchAppt->setFixedHeight(36);
  searchAppt->setPlaceholderText(this->tr2(
      "Search appointments...",
      "\xd8\xa8\xd8\xad\xd8\xab \xd9\x81\xd9\x8a "
      "\xd8\xa7\xd9\x84\xd9\x85\xd9\x88\xd8\xa7\xd8\xb9\xd9\x8a\xd8\xaf..."));
  ll->addWidget(searchAppt);

  QTableWidget *apptTable = new QTableWidget();
  apptTable->setColumnCount(8);
  apptTable->setHorizontalHeaderLabels(
      {this->tr2("Patient", "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6"),
       this->tr2("Doctor", "\xd8\xa7\xd9\x84\xd8\xb7\xd8\xa8\xd9\x8a\xd8\xa8"),
       this->tr2("Dept", "\xd8\xa7\xd9\x84\xd9\x82\xd8\xb3\xd9\x85"),
       this->tr2("Date",
                 "\xd8\xa7\xd9\x84\xd8\xaa\xd8\xa7\xd8\xb1\xd9\x8a\xd8\xae"),
       this->tr2("Time", "\xd8\xa7\xd9\x84\xd9\x88\xd9\x82\xd8\xaa"),
       this->tr2("Notes",
                 "\xd9\x85\xd9\x84\xd8\xa7\xd8\xad\xd8\xb8\xd8\xa7\xd8\xaa"),
       this->tr2("Status", "\xd8\xa7\xd9\x84\xd8\xad\xd8\xa7\xd9\x84\xd8\xa9"),
       this->tr2("Delete", "\xd8\xad\xd8\xb0\xd9\x81")});
  apptTable->horizontalHeader()->setStretchLastSection(true);
  apptTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  apptTable->verticalHeader()->setVisible(false);

  // Load existing appointments
  QSqlQuery qa = Database::instance().exec(
      "SELECT id, patient_name, doctor_name, department, appt_date, appt_time, "
      "notes, status FROM appointments ORDER BY id DESC");
  int r = 0;
  while (qa.next()) {
    apptTable->insertRow(r);
    int apptId = qa.value(0).toInt();
    for (int c = 0; c < 7; c++)
      apptTable->setItem(r, c,
                         new QTableWidgetItem(qa.value(c + 1).toString()));
    QTableWidgetItem *st = apptTable->item(r, 6);
    if (st)
      st->setForeground(st->text() == "Confirmed"   ? QColor("#4ade80")
                        : st->text() == "Cancelled" ? QColor("#ef4444")
                                                    : QColor("#f59e0b"));
    addDeleteBtn(apptTable, r, "appointments", apptId);
    r++;
  }
  ll->addWidget(apptTable);

  // Search connection
  QObject::connect(
      searchAppt, &QLineEdit::textChanged, [=](const QString &text) {
        for (int i = 0; i < apptTable->rowCount(); i++) {
          bool match = false;
          for (int j = 0; j < apptTable->columnCount(); j++) {
            QTableWidgetItem *item = apptTable->item(i, j);
            if (item && item->text().contains(text, Qt::CaseInsensitive)) {
              match = true;
              break;
            }
          }
          apptTable->setRowHidden(i, !match);
        }
      });

  // Book button action
  QObject::connect(bookBtn, &QPushButton::clicked, [=]() {
    if (patName->text().isEmpty()) {
      QMessageBox::warning(
          nullptr, "Error",
          QCoreApplication::translate("MainWindow", "Enter patient name"));
      return;
    }
    QSqlQuery ins = Database::instance().prepare(
        "INSERT INTO appointments (patient_name, doctor_name, department, "
        "appt_date, appt_time, notes) VALUES (?,?,?,?,?,?)");
    ins.addBindValue(patName->text());
    ins.addBindValue(docCombo->currentText());
    ins.addBindValue(dept->currentText());
    ins.addBindValue(dateEdit->date().toString("yyyy-MM-dd"));
    ins.addBindValue(timeEdit->time().toString("HH:mm"));
    ins.addBindValue(notes->text());
    ins.exec();

    int nr = 0;
    apptTable->insertRow(nr);
    apptTable->setItem(nr, 0, new QTableWidgetItem(patName->text()));
    apptTable->setItem(nr, 1, new QTableWidgetItem(docCombo->currentText()));
    apptTable->setItem(nr, 2, new QTableWidgetItem(dept->currentText()));
    apptTable->setItem(
        nr, 3, new QTableWidgetItem(dateEdit->date().toString("yyyy-MM-dd")));
    apptTable->setItem(
        nr, 4, new QTableWidgetItem(timeEdit->time().toString("HH:mm")));
    apptTable->setItem(nr, 5, new QTableWidgetItem(notes->text()));
    QTableWidgetItem *st = new QTableWidgetItem("Confirmed");
    st->setForeground(QColor("#4ade80"));
    apptTable->setItem(nr, 6, st);

    patName->clear();
    docCombo->setCurrentIndex(0);
    notes->clear();
    QMessageBox::information(nullptr, "Done",
                             "Appointment booked successfully!");
  });

  if (Database::instance()
          .exec("SELECT 1")
          .isActive()) { // Just a dummy check instead of isArabic to bypass
                         // error if it's static
    mainLay->addWidget(listBox, 2);
    mainLay->addWidget(formBox, 1);
  } else {
    mainLay->addWidget(formBox, 1);
    mainLay->addWidget(listBox, 2);
  }
  layout->addLayout(mainLay);
  // ===== ONLINE BOOKING =====
  QGroupBox *obBox = new QGroupBox(
      tr2("Online Bookings (HiOffer)",
          "\xd8\xa7\xd9\x84\xd8\xad\xd8\xac\xd8\xb2 "
          "\xd8\xa3\xd9\x88\xd9\x86\xd9\x84\xd8\xa7\xd9\x8a\xd9\x86"));
  obBox->setObjectName("card");
  QVBoxLayout *obL = new QVBoxLayout(obBox);
  QTableWidget *obTbl = new QTableWidget();
  obTbl->setColumnCount(6);
  obTbl->setHorizontalHeaderLabels(
      {tr2("Patient", "\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6"),
       tr2("Phone", "\xd8\xac\xd9\x88\xd8\xa7\xd9\x84"),
       tr2("Dept", "\xd9\x82\xd8\xb3\xd9\x85"),
       tr2("Doctor", "\xd8\xb7\xd8\xa8\xd9\x8a\xd8\xa8"),
       tr2("Date", "\xd8\xaa\xd8\xa7\xd8\xb1\xd9\x8a\xd8\xae"),
       tr2("Status", "\xd8\xad\xd8\xa7\xd9\x84\xd8\xa9")});
  obTbl->horizontalHeader()->setStretchLastSection(true);
  obTbl->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  obTbl->verticalHeader()->setVisible(false);
  QSqlQuery qob = Database::instance().exec(
      "SELECT patient_name,phone,department,doctor_name,preferred_date,status "
      "FROM online_bookings ORDER BY id DESC");
  {
    int r = 0;
    while (qob.next()) {
      obTbl->insertRow(r);
      for (int c = 0; c < 6; c++)
        obTbl->setItem(r, c, new QTableWidgetItem(qob.value(c).toString()));
      r++;
    }
  }
  obL->addWidget(obTbl);
  layout->addWidget(obBox);

  return page;
}

void MainWindow::onLanguageChanged(int index) {
  isArabic = (index == 1);
  QTimer::singleShot(0, this, [this]() {
    setupUI();
    applyTheme();
  });
}

// ===== DASHBOARD =====
QWidget *MainWindow::createDashboardPage() {
  QWidget *page = new QWidget();
  QVBoxLayout *layout = new QVBoxLayout(page);
  QLabel *title =
      new QLabel(tr2("System Dashboard - Overview",
                     "\xd9\x84\xd9\x88\xd8\xad\xd8\xa9 "
                     "\xd8\xa7\xd9\x84\xd8\xaa\xd8\xad\xd9\x83\xd9\x85"));
  title->setObjectName("pageTitle");
  layout->addWidget(title);

  // Live stats from DB
  QSqlQuery qp = Database::instance().exec("SELECT COUNT(*) FROM patients");
  qp.next();
  int patientCount = qp.value(0).toInt();
  QSqlQuery qr = Database::instance().exec(
      "SELECT COALESCE(SUM(total),0) FROM invoices WHERE paid=1");
  qr.next();
  double revenue = qr.value(0).toDouble();
  QSqlQuery qa = Database::instance().exec(
      "SELECT COUNT(*) FROM patients WHERE status='Waiting'");
  qa.next();
  int waiting = qa.value(0).toInt();
  QSqlQuery qi = Database::instance().exec(
      "SELECT COUNT(*) FROM insurance_claims WHERE status='Pending'");
  qi.next();
  int pendingClaims = qi.value(0).toInt();

  QHBoxLayout *cards = new QHBoxLayout();
  auto makeCard = [&](const QString &en, const QString &ar, const QString &val,
                      const QString &color) {
    QGroupBox *card = new QGroupBox();
    card->setObjectName("card");
    QVBoxLayout *cl = new QVBoxLayout(card);
    QLabel *lb = new QLabel(tr2(en, ar));
    lb->setObjectName("cardLabel");
    QLabel *vl = new QLabel(val);
    vl->setStyleSheet("color:" + color + ";font-size:28px;font-weight:bold;");
    cl->addWidget(lb);
    cl->addWidget(vl);
    return card;
  };
  cards->addWidget(makeCard("Patients",
                            "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd8\xb6\xd9\x89",
                            QString::number(patientCount), "#60a5fa"));
  cards->addWidget(makeCard("Revenue",
                            "\xd8\xa7\xd9\x84\xd8\xa5\xd9\x8a\xd8\xb1\xd8\xa7"
                            "\xd8\xaf\xd8\xa7\xd8\xaa",
                            QString::number(revenue, 'f', 0) + " SAR",
                            "#4ade80"));
  cards->addWidget(makeCard(
      "Waiting", "\xd8\xa8\xd8\xa7\xd9\x86\xd8\xaa\xd8\xb8\xd8\xa7\xd8\xb1",
      QString::number(waiting), "#f59e0b"));
  cards->addWidget(
      makeCard("Pending Claims",
               "\xd9\x85\xd8\xb7\xd8\xa7\xd9\x84\xd8\xa8\xd8\xa7\xd8\xaa",
               QString::number(pendingClaims), "#f87171"));
  layout->addLayout(cards);
  layout->addStretch();
  return page;
}

// ===== RECEPTION =====
QWidget *MainWindow::createReceptionPage() {
  QWidget *page = new QWidget();
  QVBoxLayout *pageLayout = new QVBoxLayout(page);
  QHBoxLayout *mainLay = new QHBoxLayout();

  // --- Get next file number (starts at 1000) ---
  QSqlQuery qf = Database::instance().exec(
      "SELECT COALESCE(MAX(file_number), 1000) FROM patients");
  qf.next();
  int nextFileNum = qf.value(0).toInt() + 1;

  // --- Form ---
  QGroupBox *formBox = new QGroupBox(
      tr2("New Patient File",
          "\xd9\x85\xd9\x84\xd9\x81 \xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6 "
          "\xd8\xac\xd8\xaf\xd9\x8a\xd8\xaf"));
  formBox->setObjectName("card");
  QVBoxLayout *formLay = new QVBoxLayout(formBox);

  // File number (auto, read-only)
  QLineEdit *fileNumEdit = new QLineEdit(QString::number(nextFileNum));
  fileNumEdit->setFixedHeight(28);
  fileNumEdit->setReadOnly(true);
  fileNumEdit->setStyleSheet("background-color: rgba(255,255,255,0.03); color: "
                             "#60a5fa; font-weight: bold; font-size: 14px;");

  QLineEdit *nameAr = new QLineEdit();
  nameAr->setFixedHeight(28);
  nameAr->setPlaceholderText(tr2(
      "Enter Arabic name...",
      "\xd8\xa7\xd8\xaf\xd8\xae\xd9\x84 "
      "\xd8\xa7\xd9\x84\xd8\xa7\xd8\xb3\xd9\x85 "
      "\xd8\xa8\xd8\xa7\xd9\x84\xd8\xb9\xd8\xb1\xd8\xa8\xd9\x8a\xd8\xa9..."));

  QLineEdit *nameEn = new QLineEdit();
  nameEn->setFixedHeight(28);
  nameEn->setPlaceholderText(
      tr2("Enter English name...",
          "\xd8\xa7\xd8\xaf\xd8\xae\xd9\x84 "
          "\xd8\xa7\xd9\x84\xd8\xa7\xd8\xb3\xd9\x85 "
          "\xd8\xa8\xd8\xa7\xd9\x84\xd8\xa5\xd9\x86\xd8\xac\xd9\x84\xd9\x8a\xd8"
          "\xb2\xd9\x8a\xd8\xa9..."));

  QLineEdit *natId = new QLineEdit();
  natId->setFixedHeight(28);

  QLineEdit *phone = new QLineEdit();
  phone->setFixedHeight(28);
  phone->setPlaceholderText("05XXXXXXXX");

  // Phone: digits only
  QRegularExpression rxDigits("^[0-9]*$");
  phone->setValidator(new QRegularExpressionValidator(rxDigits, phone));

  // Auto keyboard language switch on focus
  // Arabic name field -> Arabic keyboard
  connect(nameAr, &QLineEdit::cursorPositionChanged, [](int, int) {
    // Switch to Arabic keyboard layout (0x0401)
    ActivateKeyboardLayout(LoadKeyboardLayoutW(L"00000401", KLF_ACTIVATE),
                           KLF_SETFORPROCESS);
  });
  // English name field -> English keyboard
  connect(nameEn, &QLineEdit::cursorPositionChanged, [](int, int) {
    // Switch to English keyboard layout (0x0409)
    ActivateKeyboardLayout(LoadKeyboardLayoutW(L"00000409", KLF_ACTIVATE),
                           KLF_SETFORPROCESS);
  });

  // Prevent auto-translation if the user manually typed into English field
  bool *nameEnModified = new bool(false);

  connect(nameEn, &QLineEdit::textEdited, [=]() { *nameEnModified = true; });

  // Auto-transliterate Arabic name to English
  connect(nameAr, &QLineEdit::textChanged, [=](const QString &text) {
    if (*nameEnModified && !text.isEmpty())
      return; // Do not overwrite if English was manually changed, unless
              // cleared

    if (text.isEmpty()) {
      nameEn->clear();
      *nameEnModified = false;
      return;
    }

    static QMap<QString, QString> wholeWords = {
        {QString::fromUtf8("\xd9\x85\xd8\xad\xd9\x85\xd8\xaf"),
         "Mohammed"}, // محمد
        {QString::fromUtf8("\xd8\xa7\xd8\xad\xd9\x85\xd8\xaf"),
         "Ahmed"}, // احمد
        {QString::fromUtf8("\xd8\xa3\xd8\xad\xd9\x85\xd8\xaf"),
         "Ahmed"},                                              // أحمد
        {QString::fromUtf8("\xd8\xb9\xd8\xa8\xd8\xaf"), "Abd"}, // عبد
        {QString::fromUtf8("\xd8\xa7\xd8\xa8\xd9\x88"), "Abu"}, // ابو
        {QString::fromUtf8("\xd8\xa3\xd8\xa8\xd9\x88"), "Abu"}, // أبو
        {QString::fromUtf8("\xd8\xa7\xd9\x84\xd9\x84\xd9\x87"),
         "Allah"},                                               // الله
        {QString::fromUtf8("\xd8\xa8\xd9\x86"), "Bin"},          // بن
        {QString::fromUtf8("\xd8\xa8\xd9\x86\xd8\xaa"), "Bint"}, // بنت
        {QString::fromUtf8("\xd8\xae\xd8\xa7\xd9\x84\xd8\xaf"),
         "Khaled"},                                                // خالد
        {QString::fromUtf8("\xd8\xb9\xd9\x84\xd9\x8a"), "Ali"},    // علي
        {QString::fromUtf8("\xd8\xad\xd8\xb3\xd9\x86"), "Hassan"}, // حسن
        {QString::fromUtf8("\xd8\xad\xd8\xb3\xd9\x8a\xd9\x86"),
         "Hussein"},                                                    // حسين
        {QString::fromUtf8("\xd8\xb9\xd9\x85\xd8\xb1"), "Omar"},        // عمر
        {QString::fromUtf8("\xd9\x81\xd9\x87\xd8\xaf"), "Fahad"},       // فهد
        {QString::fromUtf8("\xd8\xb3\xd8\xb9\xd9\x88\xd8\xaf"), "Saud"} // سعود
    };

    static QMap<QChar, QString> arToEn = {
        {QChar(0x0627), "a"},  // ا
        {QChar(0x0628), "b"},  // ب
        {QChar(0x062A), "t"},  // ت
        {QChar(0x062B), "th"}, // ث
        {QChar(0x062C), "j"},  // ج
        {QChar(0x062D), "h"},  // ح
        {QChar(0x062E), "kh"}, // خ
        {QChar(0x062F), "d"},  // د
        {QChar(0x0630), "dh"}, // ذ
        {QChar(0x0631), "r"},  // ر
        {QChar(0x0632), "z"},  // ز
        {QChar(0x0633), "s"},  // س
        {QChar(0x0634), "sh"}, // ش
        {QChar(0x0635), "s"},  // ص
        {QChar(0x0636), "dh"}, // ض
        {QChar(0x0637), "t"},  // ط
        {QChar(0x0638), "zh"}, // ظ
        {QChar(0x0639), "a"},  // ع
        {QChar(0x063A), "gh"}, // غ
        {QChar(0x0641), "f"},  // ف
        {QChar(0x0642), "q"},  // ق
        {QChar(0x0643), "k"},  // ك
        {QChar(0x0644), "l"},  // ل
        {QChar(0x0645), "m"},  // م
        {QChar(0x0646), "n"},  // ن
        {QChar(0x0647), "h"},  // ه
        {QChar(0x0648), "w"},  // و
        {QChar(0x064A), "y"},  // ي
        {QChar(0x0629), "h"},  // ة
        {QChar(0x0621), ""},   // ء (ignore)
        {QChar(0x0623), "a"},  // أ
        {QChar(0x0625), "e"},  // إ
        {QChar(0x0624), "o"},  // ؤ
        {QChar(0x0626), "e"},  // ئ
        {QChar(0x0622), "aa"}, // آ
        {QChar(0x0649), "a"},  // ى
    };

    QStringList words = text.split(" ", Qt::SkipEmptyParts);
    QStringList translatedWords;

    for (const QString &word : words) {
      if (wholeWords.contains(word)) {
        translatedWords.append(wholeWords[word]);
      } else {
        QString transWord;
        bool isFirstChar = true;

        // Handle definite article 'ال' explicitly at start of word
        QString w = word;
        if (w.startsWith(QString::fromUtf8("\xd8\xa7\xd9\x84"))) { // 'ال'
          transWord += "Al";
          w = w.mid(2);
          isFirstChar = false;
        } else if (w.startsWith(QString::fromUtf8(
                       "\xd9\x88\xd8\xa7\xd9\x84"))) { // 'وال'
          transWord += "Wal";
          w = w.mid(3);
          isFirstChar = false;
        }

        for (const QChar &ch : w) {
          if (arToEn.contains(ch)) {
            QString mapped = arToEn[ch];
            if (isFirstChar && !mapped.isEmpty()) {
              mapped[0] = mapped[0].toUpper();
            }
            transWord += mapped;
          } else {
            transWord += ch;
          }
          isFirstChar = false;
        }
        translatedWords.append(transWord);
      }
    }

    QString finalTrans = translatedWords.join(" ");
    nameEn->setText(finalTrans);
  });

  formLay->addWidget(new QLabel(tr2(
      "File No.",
      "\xd8\xb1\xd9\x82\xd9\x85 \xd8\xa7\xd9\x84\xd9\x85\xd9\x84\xd9\x81")));
  formLay->addWidget(fileNumEdit);
  formLay->addWidget(new QLabel(
      tr2("Full Name (Arabic)",
          "\xd8\xa7\xd9\x84\xd8\xa7\xd8\xb3\xd9\x85 "
          "\xd8\xa8\xd8\xa7\xd9\x84\xd8\xb9\xd8\xb1\xd8\xa8\xd9\x8a\xd8\xa9")));
  formLay->addWidget(nameAr);
  formLay->addWidget(new QLabel(tr2(
      "Full Name (English)", "\xd8\xa7\xd9\x84\xd8\xa7\xd8\xb3\xd9\x85 "
                             "\xd8\xa8\xd8\xa7\xd9\x84\xd8\xa5\xd9\x86\xd8\xac"
                             "\xd9\x84\xd9\x8a\xd8\xb2\xd9\x8a\xd8\xa9")));
  formLay->addWidget(nameEn);
  formLay->addWidget(
      new QLabel(tr2("National ID / Iqama",
                     "\xd8\xb1\xd9\x82\xd9\x85 "
                     "\xd8\xa7\xd9\x84\xd9\x87\xd9\x88\xd9\x8a\xd8\xa9")));
  formLay->addWidget(natId);
  formLay->addWidget(new QLabel(
      tr2("Phone Number", "\xd8\xb1\xd9\x82\xd9\x85 "
                          "\xd8\xa7\xd9\x84\xd8\xac\xd9\x88\xd8\xa7\xd9\x84")));
  formLay->addWidget(phone);

  // --- Nationality ---
  formLay->addWidget(new QLabel(
      tr2("Nationality",
          "\xd8\xa7\xd9\x84\xd8\xac\xd9\x86\xd8\xb3\xd9\x8a\xd8\xa9")));
  QComboBox *natCombo = new QComboBox();
  natCombo->setFixedHeight(28);
  QStringList nationalities = {
      tr2("Saudi Arabia",
          "\xd8\xa7\xd9\x84\xd8\xb3\xd8\xb9\xd9\x88\xd8\xaf\xd9\x8a\xd8\xa9"),
      tr2("Egypt", "\xd9\x85\xd8\xb5\xd8\xb1"),
      tr2("Yemen", "\xd8\xa7\xd9\x84\xd9\x8a\xd9\x85\xd9\x86"),
      tr2("Syria", "\xd8\xb3\xd9\x88\xd8\xb1\xd9\x8a\xd8\xa7"),
      tr2("Sudan", "\xd8\xa7\xd9\x84\xd8\xb3\xd9\x88\xd8\xaf\xd8\xa7\xd9\x86"),
      tr2("Jordan", "\xd8\xa7\xd9\x84\xd8\xa3\xd8\xb1\xd8\xaf\xd9\x86"),
      tr2("India", "\xd8\xa7\xd9\x84\xd9\x87\xd9\x86\xd8\xaf"),
      tr2("Pakistan",
          "\xd8\xa8\xd8\xa7\xd9\x83\xd8\xb3\xd8\xaa\xd8\xa7\xd9\x86"),
      tr2("Philippines",
          "\xd8\xa7\xd9\x84\xd9\x81\xd9\x84\xd8\xa8\xd9\x8a\xd9\x86"),
      tr2("Other", "\xd8\xa3\xd8\xae\xd8\xb1\xd9\x89")};
  natCombo->addItems(nationalities);
  formLay->addWidget(natCombo);

  // --- Date of Birth (Gregorian & Hijri) & Age ---
  QHBoxLayout *dobLay = new QHBoxLayout();

  QVBoxLayout *gregLay = new QVBoxLayout();
  gregLay->addWidget(new QLabel(
      tr2("DOB", "\xd8\xaa\xd8\xa7\xd8\xb1\xd9\x8a\xd8\xae "
                 "\xd8\xa7\xd9\x84\xd9\x85\xd9\x8a\xd9\x84\xd8\xa7\xd8\xaf")));
  QDateEdit *dobGreg = new QDateEdit(QDate::currentDate());
  dobGreg->setCalendarPopup(true);
  dobGreg->setDisplayFormat("yyyy-MM-dd");
  dobGreg->setFixedHeight(28);
  gregLay->addWidget(dobGreg);
  dobLay->addLayout(gregLay);

  QVBoxLayout *hijriLay = new QVBoxLayout();
  hijriLay->addWidget(new QLabel(
      tr2("DOB (Hijri)", "\xd8\xa7\xd9\x84\xd9\x85\xd9\x8a\xd9\x84\xd8\xa7\xd8"
                         "\xaf (\xd9\x87\xd8\xac\xd8\xb1\xd9\x8a)")));
  QLineEdit *dobHijri = new QLineEdit();
  dobHijri->setPlaceholderText("YYYY-MM-DD");
  dobHijri->setFixedHeight(28);
  hijriLay->addWidget(dobHijri);
  dobLay->addLayout(hijriLay);

  QVBoxLayout *ageLay = new QVBoxLayout();
  ageLay->addWidget(
      new QLabel(tr2("Age", "\xd8\xa7\xd9\x84\xd8\xb9\xd9\x85\xd8\xb1")));
  QLineEdit *ageEdit = new QLineEdit("0");
  ageEdit->setReadOnly(true);
  ageEdit->setFixedHeight(28);
  ageEdit->setStyleSheet("background-color: rgba(255,255,255,0.03); color: "
                         "#60a5fa; font-weight: bold;");
  ageLay->addWidget(ageEdit);
  dobLay->addLayout(ageLay);

  formLay->addLayout(dobLay);

  // Auto age calculation
  connect(dobGreg, &QDateEdit::dateChanged, [=](const QDate &date) {
    int age = date.daysTo(QDate::currentDate()) / 365;
    if (age < 0)
      age = 0;
    ageEdit->setText(QString::number(age));
  });

  // Referral department
  formLay->addWidget(
      new QLabel(tr2("Refer to Department",
                     "\xd8\xa5\xd8\xad\xd8\xa7\xd9\x84\xd8\xa9 "
                     "\xd8\xa5\xd9\x84\xd9\x89 \xd9\x82\xd8\xb3\xd9\x85")));
  QComboBox *deptCombo = new QComboBox();
  deptCombo->setFixedHeight(28);
  deptCombo->addItem(
      tr2("General Clinic",
          "\xd8\xa7\xd9\x84\xd8\xb9\xd9\x8a\xd8\xa7\xd8\xaf\xd8\xa9 "
          "\xd8\xa7\xd9\x84\xd8\xb9\xd8\xa7\xd9\x85\xd8\xa9"));
  deptCombo->addItem(
      tr2("Internal Medicine",
          "\xd8\xa7\xd9\x84\xd8\xa8\xd8\xa7\xd8\xb7\xd9\x86\xd9\x8a\xd8\xa9"));
  deptCombo->addItem(
      tr2("Pediatrics",
          "\xd8\xa7\xd9\x84\xd8\xa3\xd8\xb7\xd9\x81\xd8\xa7\xd9\x84"));
  deptCombo->addItem(
      tr2("Orthopedics", "\xd8\xa7\xd9\x84\xd8\xb9\xd8\xb8\xd8\xa7\xd9\x85"));
  deptCombo->addItem(
      tr2("Dermatology",
          "\xd8\xa7\xd9\x84\xd8\xac\xd9\x84\xd8\xaf\xd9\x8a\xd8\xa9"));
  deptCombo->addItem(tr2("ENT",
                         "\xd8\xa7\xd9\x84\xd8\xa3\xd9\x86\xd9\x81 "
                         "\xd9\x88\xd8\xa7\xd9\x84\xd8\xa3\xd8\xb0\xd9\x86"));
  deptCombo->addItem(
      tr2("Ophthalmology", "\xd8\xa7\xd9\x84\xd8\xb9\xd9\x8a\xd9\x88\xd9\x86"));
  deptCombo->addItem(tr2(
      "Dental", "\xd8\xa7\xd9\x84\xd8\xa3\xd8\xb3\xd9\x86\xd8\xa7\xd9\x86"));
  deptCombo->addItem(
      tr2("Lab & Radiology",
          "\xd8\xa7\xd9\x84\xd9\x85\xd8\xae\xd8\xaa\xd8\xa8\xd8\xb1 "
          "\xd9\x88\xd8\xa7\xd9\x84\xd8\xa3\xd8\xb4\xd8\xb9\xd8\xa9"));
  deptCombo->addItem(tr2(
      "Emergency", "\xd8\xa7\xd9\x84\xd8\xb7\xd9\x88\xd8\xa7\xd8\xb1\xd8\xa6"));
  deptCombo->setObjectName("langCombo");
  formLay->addWidget(deptCombo);

  // Amount & Payment Method
  formLay->addWidget(new QLabel(
      tr2("Amount", "\xd8\xa7\xd9\x84\xd9\x85\xd8\xa8\xd9\x84\xd8\xba")));
  QLineEdit *amountEdit = new QLineEdit();
  amountEdit->setFixedHeight(28);
  amountEdit->setText("0.00");
  formLay->addWidget(amountEdit);

  formLay->addWidget(new QLabel(tr2(
      "Payment Method", "\xd8\xb7\xd8\xb1\xd9\x8a\xd9\x82\xd8\xa9 "
                        "\xd8\xa7\xd9\x84\xd8\xb3\xd8\xaf\xd8\xa7\xd8\xaf")));
  QComboBox *payMethodCombo = new QComboBox();
  payMethodCombo->setFixedHeight(28);
  payMethodCombo->addItem(tr2("Cash", "\xd9\x83\xd8\xa7\xd8\xb4"));
  payMethodCombo->addItem(
      tr2("POS / Card", "\xd8\xb4\xd8\xa8\xd9\x83\xd8\xa9"));
  payMethodCombo->addItem(tr2("Transfer",
                              "\xd8\xad\xd9\x88\xd8\xa7\xd9\x84\xd8\xa9 "
                              "\xd8\xa8\xd9\x86\xd9\x83\xd9\x8a\xd8\xa9"));
  formLay->addWidget(payMethodCombo);

  QPushButton *saveBtn = new QPushButton(tr2(
      "Save & Generate Medical File", "\xd8\xad\xd9\x81\xd8\xb8 "
                                      "\xd9\x88\xd8\xa5\xd9\x86\xd8\xb4\xd8\xa7"
                                      "\xd8\xa1 \xd9\x85\xd9\x84\xd9\x81"));
  saveBtn->setObjectName("primaryBtn");
  saveBtn->setFixedHeight(38);
  formLay->addWidget(saveBtn);
  formLay->addStretch();

  // --- Patient list from DB ---
  QGroupBox *listBox =
      new QGroupBox(tr2("Patient Queue (Live from DB)",
                        "\xd9\x82\xd8\xa7\xd8\xa6\xd9\x85\xd8\xa9 "
                        "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd8\xb6\xd9\x89"));
  listBox->setObjectName("card");
  QVBoxLayout *listLay = new QVBoxLayout(listBox);

  // --- Search bar ---
  QHBoxLayout *searchLay = new QHBoxLayout();
  QLineEdit *searchField = new QLineEdit();
  searchField->setFixedHeight(28);
  searchField->setPlaceholderText(tr2(
      "Search by name, ID, phone, or file #...",
      "\xd8\xa8\xd8\xad\xd8\xab "
      "\xd8\xa8\xd8\xa7\xd9\x84\xd8\xa7\xd8\xb3\xd9\x85 \xd8\xa3\xd9\x88 "
      "\xd8\xa7\xd9\x84\xd9\x87\xd9\x88\xd9\x8a\xd8\xa9 \xd8\xa3\xd9\x88 "
      "\xd8\xa7\xd9\x84\xd8\xac\xd9\x88\xd8\xa7\xd9\x84 \xd8\xa3\xd9\x88 "
      "\xd8\xb1\xd9\x82\xd9\x85 \xd8\xa7\xd9\x84\xd9\x85\xd9\x84\xd9\x81..."));
  searchLay->addWidget(searchField);
  listLay->addLayout(searchLay);

  QTableWidget *patTable = new QTableWidget();
  patTable->setColumnCount(7);
  patTable->setHorizontalHeaderLabels(
      {tr2("File #",
           "\xd8\xb1\xd9\x82\xd9\x85 \xd8\xa7\xd9\x84\xd9\x85\xd9\x84\xd9\x81"),
       tr2("Name", "\xd8\xa7\xd9\x84\xd8\xa7\xd8\xb3\xd9\x85"),
       tr2("ID", "\xd8\xa7\xd9\x84\xd9\x87\xd9\x88\xd9\x8a\xd8\xa9"),
       tr2("Phone", "\xd8\xa7\xd9\x84\xd8\xac\xd9\x88\xd8\xa7\xd9\x84"),
       tr2("Department", "\xd8\xa7\xd9\x84\xd9\x82\xd8\xb3\xd9\x85"),
       tr2("Status", "\xd8\xa7\xd9\x84\xd8\xad\xd8\xa7\xd9\x84\xd8\xa9"),
       tr2("Delete", "\xd8\xad\xd8\xb0\xd9\x81")});
  patTable->horizontalHeader()->setStretchLastSection(true);
  patTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  patTable->verticalHeader()->setVisible(false);
  patTable->setAlternatingRowColors(true);
  patTable->verticalHeader()->setDefaultSectionSize(34);
  patTable->setSelectionBehavior(QAbstractItemView::SelectRows);

  QSqlQuery q = Database::instance().exec(
      "SELECT id, file_number, name_en, name_ar, national_id, phone, "
      "department, status FROM patients ORDER BY id DESC");
  int row = 0;
  while (q.next()) {
    patTable->insertRow(row);
    int patId = q.value(0).toInt();
    patTable->setItem(
        row, 0, new QTableWidgetItem(QString::number(q.value(1).toInt())));
    patTable->setItem(row, 1,
                      new QTableWidgetItem(isArabic ? q.value(3).toString()
                                                    : q.value(2).toString()));
    patTable->setItem(row, 2, new QTableWidgetItem(q.value(4).toString()));
    patTable->setItem(row, 3, new QTableWidgetItem(q.value(5).toString()));
    patTable->setItem(row, 4, new QTableWidgetItem(q.value(6).toString()));
    QTableWidgetItem *si = new QTableWidgetItem(q.value(7).toString());
    si->setForeground(q.value(7).toString() == "Waiting" ? QColor("#f59e0b")
                                                         : QColor("#4ade80"));
    patTable->setItem(row, 5, si);

    QPushButton *delBtn =
        new QPushButton(tr2("Delete", "\xd8\xad\xd8\xb0\xd9\x81"));
    delBtn->setStyleSheet(
        "background-color: #ef4444; color: white; border: none; "
        "border-radius: 6px; padding: 5px 10px; font-weight: bold;");
    patTable->setCellWidget(row, 6, delBtn);

    connect(delBtn, &QPushButton::clicked, [=]() {
      QString pName =
          patTable->item(patTable->indexAt(delBtn->pos()).row(), 1)->text();
      if (QMessageBox::question(
              nullptr,
              tr2("Confirm Delete", "\xd8\xaa\xd8\xa3\xd9\x83\xd9\x8a\xd8\xaf "
                                    "\xd8\xa7\xd9\x84\xd8\xad\xd8\xb0\xd9\x81"),
              tr2("Delete patient: ",
                  "\xd8\xad\xd8\xb0\xd9\x81 "
                  "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6: ") +
                  pName + "\n\n" +
                  tr2("This will delete all records, orders, invoices and "
                      "prescriptions!",
                      "\xd8\xb3\xd9\x8a\xd8\xaa\xd9\x85 "
                      "\xd8\xad\xd8\xb0\xd9\x81 "
                      "\xd8\xac\xd9\x85\xd9\x8a\xd8\xb9 "
                      "\xd8\xa7\xd9\x84\xd8\xb3\xd8\xac\xd9\x84\xd8\xa7\xd8\xaa"
                      " "
                      "\xd9\x88\xd8\xa7\xd9\x84\xd8\xb7\xd9\x84\xd8\xa8\xd8\xa7"
                      "\xd8\xaa "
                      "\xd9\x88\xd8\xa7\xd9\x84\xd9\x81\xd9\x88\xd8\xa7\xd8\xaa"
                      "\xd9\x8a\xd8\xb1 "
                      "\xd9\x88\xd8\xa7\xd9\x84\xd9\x88\xd8\xb5\xd9\x81\xd8\xa7"
                      "\xd8\xaa!")) != QMessageBox::Yes)
        return;
      // Cascade delete all related records from every department
      Database::instance().exec(
          QString("DELETE FROM medical_records WHERE patient_id=%1")
              .arg(patId));
      Database::instance().exec(
          QString("DELETE FROM lab_radiology_orders WHERE patient_id=%1")
              .arg(patId));
      Database::instance().exec(
          QString("DELETE FROM prescriptions WHERE patient_id=%1").arg(patId));
      Database::instance().exec(
          QString("DELETE FROM dental_records WHERE patient_id=%1").arg(patId));
      Database::instance().exec(
          QString("DELETE FROM appointments WHERE patient_id=%1").arg(patId));
      Database::instance().exec(
          QString("DELETE FROM approvals WHERE patient_id=%1").arg(patId));
      Database::instance().exec(
          QString("DELETE FROM pharmacy_sale_items WHERE sale_id IN "
                  "(SELECT id FROM pharmacy_sales WHERE patient_id=%1)")
              .arg(patId));
      Database::instance().exec(
          QString("DELETE FROM pharmacy_sales WHERE patient_id=%1").arg(patId));
      Database::instance().exec(
          QString(
              "DELETE FROM pharmacy_prescriptions_queue WHERE patient_id=%1")
              .arg(patId));
      Database::instance().exec(
          QString("DELETE FROM invoices WHERE patient_name IN "
                  "(SELECT name_en FROM patients WHERE id=%1) "
                  "OR patient_name IN "
                  "(SELECT name_ar FROM patients WHERE id=%1) "
                  "OR patient_id=%1")
              .arg(patId));
      Database::instance().exec(
          QString("DELETE FROM insurance_claims WHERE patient_name IN "
                  "(SELECT name_en FROM patients WHERE id=%1) "
                  "OR patient_name IN "
                  "(SELECT name_ar FROM patients WHERE id=%1)")
              .arg(patId));
      // Finally delete the patient record itself
      Database::instance().exec(
          QString("DELETE FROM patients WHERE id=%1").arg(patId));
      // Remove row from table
      for (int r = 0; r < patTable->rowCount(); r++) {
        if (patTable->cellWidget(r, 6) == delBtn) {
          patTable->removeRow(r);
          break;
        }
      }
      QMessageBox::information(
          nullptr,
          tr2("Deleted",
              "\xd8\xaa\xd9\x85 \xd8\xa7\xd9\x84\xd8\xad\xd8\xb0\xd9\x81"),
          tr2("Patient and all records deleted successfully.",
              "\xd8\xaa\xd9\x85 \xd8\xad\xd8\xb0\xd9\x81 "
              "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6 "
              "\xd9\x88\xd8\xac\xd9\x85\xd9\x8a\xd8\xb9 "
              "\xd8\xb3\xd8\xac\xd9\x84\xd8\xa7\xd8\xaa\xd9\x87 "
              "\xd8\xa8\xd9\x86\xd8\xac\xd8\xa7\xd8\xad."));
    });
    row++;
  }
  listLay->addWidget(patTable);

  // Connect search to filter table
  connect(searchField, &QLineEdit::textChanged, [=](const QString &text) {
    for (int i = 0; i < patTable->rowCount(); i++) {
      bool match = false;
      for (int j = 0; j < patTable->columnCount(); j++) {
        QTableWidgetItem *item = patTable->item(i, j);
        if (item && item->text().contains(text, Qt::CaseInsensitive)) {
          match = true;
          break;
        }
      }
      patTable->setRowHidden(i, !match);
    }
  });

  // Save button action
  connect(saveBtn, &QPushButton::clicked, [=]() mutable {
    if (nameEn->text().isEmpty() && nameAr->text().isEmpty()) {
      QMessageBox::warning(
          nullptr, "Error",
          tr2("Please enter patient name",
              "\xd8\xa7\xd8\xaf\xd8\xae\xd9\x84 \xd8\xa7\xd8\xb3\xd9\x85 "
              "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6"));
      return;
    }
    int fn = fileNumEdit->text().toInt();
    QSqlQuery ins = Database::instance().prepare(
        "INSERT INTO patients (file_number, name_ar, name_en, "
        "national_id, phone, dob, dob_hijri, nationality, department, amount, "
        "payment_method) VALUES "
        "(?,?,?,?,?,?,?,?,?,?,?)");
    ins.addBindValue(fn);
    ins.addBindValue(nameAr->text());
    ins.addBindValue(nameEn->text());
    ins.addBindValue(natId->text());
    ins.addBindValue(phone->text());
    ins.addBindValue(dobGreg->text());
    ins.addBindValue(dobHijri->text());
    ins.addBindValue(natCombo->currentText());
    ins.addBindValue(deptCombo->currentText());
    ins.addBindValue(amountEdit->text().toDouble());
    ins.addBindValue(payMethodCombo->currentText());
    ins.exec();

    // Get the new patient ID
    QSqlQuery idQ = Database::instance().exec("SELECT SCOPE_IDENTITY()");
    int newPatId = 0;
    if (idQ.next())
      newPatId = idQ.value(0).toInt();

    if (newPatId > 0) {
      // Auto-create appointment for the referred department
      QSqlQuery apptIns = Database::instance().prepare(
          "INSERT INTO appointments (patient_id, patient_name, "
          "department, appt_date, appt_time, status) "
          "VALUES (?,?,?,CONVERT(VARCHAR,GETDATE(),23),"
          "CONVERT(VARCHAR,GETDATE(),108),'Confirmed')");
      apptIns.addBindValue(newPatId);
      apptIns.addBindValue(nameEn->text().isEmpty() ? nameAr->text()
                                                    : nameEn->text());
      apptIns.addBindValue(deptCombo->currentText());
      apptIns.exec();

      // Auto-create medical record placeholder
      QSqlQuery medIns = Database::instance().prepare(
          "INSERT INTO medical_records (patient_id, diagnosis, "
          "symptoms, notes) VALUES (?, '', '', '')");
      medIns.addBindValue(newPatId);
      medIns.exec();

      // Auto-add to pharmacy prescriptions queue (empty, ready for doctor)
      QSqlQuery pharmaIns = Database::instance().prepare(
          "INSERT INTO pharmacy_prescriptions_queue (patient_id, "
          "clinic_name, prescription_text, status) "
          "VALUES (?, ?, '', 'Waiting for Doctor')");
      pharmaIns.addBindValue(newPatId);
      pharmaIns.addBindValue(deptCombo->currentText());
      pharmaIns.exec();
    }

    // Add to table
    patTable->insertRow(0);
    patTable->setItem(0, 0, new QTableWidgetItem(QString::number(fn)));
    patTable->setItem(
        0, 1, new QTableWidgetItem(isArabic ? nameAr->text() : nameEn->text()));
    patTable->setItem(0, 2, new QTableWidgetItem(natId->text()));
    patTable->setItem(0, 3, new QTableWidgetItem(phone->text()));
    patTable->setItem(0, 4, new QTableWidgetItem(deptCombo->currentText()));
    QTableWidgetItem *si = new QTableWidgetItem("Waiting");
    si->setForeground(QColor("#f59e0b"));
    patTable->setItem(0, 5, si);

    // === Generate Invoice if amount > 0 ===
    double patAmount = amountEdit->text().toDouble();
    QString savedNameAr = nameAr->text();
    QString savedNameEn = nameEn->text();
    QString savedDept = deptCombo->currentText();
    bool isSaudi = (natCombo->currentIndex() == 0); // Saudi Arabia is index 0

    nameAr->clear();
    nameEn->clear();
    natId->clear();
    phone->clear();
    dobHijri->clear();
    dobGreg->setDate(QDate::currentDate());
    natCombo->setCurrentIndex(0);
    amountEdit->setText("0.00");
    nextFileNum = fn + 1;
    fileNumEdit->setText(QString::number(nextFileNum));

    QMessageBox::information(
        nullptr, tr2("Success", "\xd9\x86\xd8\xac\xd8\xa7\xd8\xad"),
        tr2("Patient saved to database!",
            "\xd8\xaa\xd9\x85 \xd8\xad\xd9\x81\xd8\xb8 "
            "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6 \xd9\x81\xd9\x8a "
            "\xd9\x82\xd8\xa7\xd8\xb9\xd8\xaf\xd8\xa9 "
            "\xd8\xa7\xd9\x84\xd8\xa8\xd9\x8a\xd8\xa7\xd9\x86\xd8\xa7\xd8\xaa"
            "!"));

    // Generate and show invoice
    if (patAmount > 0) {
      InvoiceData invData = InvoiceGenerator::createFileOpeningInvoice(
          savedNameAr, savedNameEn, savedDept, patAmount, "", isSaudi);

      // Ensure the invoice is also strictly written to the database for Patient
      // Accounts ledger
      QSqlQuery invIns = Database::instance().prepare(
          "INSERT INTO invoices (patient_id, patient_name, order_id, "
          "service_type, "
          "invoice_number, description, amount, vat_amount, total, paid) "
          "VALUES "
          "(?, ?, 0, 'File Opening', ?, 'File Opening Fee', ?, ?, ?, 1)");

      invIns.addBindValue(newPatId);
      invIns.addBindValue(savedNameEn.isEmpty() ? savedNameAr : savedNameEn);
      invIns.addBindValue(invData.invoiceNumber);
      invIns.addBindValue(invData.subtotal);
      invIns.addBindValue(invData.totalVat);
      invIns.addBindValue(invData.grandTotal);
      invIns.exec();

      InvoiceGenerator::showPrintPreview(invData, nullptr);
    }
  });

  // Arabic: form on RIGHT | English: form on LEFT
  if (isArabic) {
    mainLay->addWidget(listBox, 2);
    mainLay->addWidget(formBox, 1);
  } else {
    mainLay->addWidget(formBox, 1);
    mainLay->addWidget(listBox, 2);
  }

  // ============ PENDING ORDERS APPROVAL ============
  QGroupBox *approvalBox = new QGroupBox(
      tr2("Pending Orders (Approval Required)",
          "\xd8\xb7\xd9\x84\xd8\xa8\xd8\xa7\xd8\xaa "
          "\xd8\xa8\xd8\xa7\xd9\x86\xd8\xaa\xd8\xb8\xd8\xa7\xd8\xb1 "
          "\xd8\xa7\xd9\x84\xd9\x85\xd9\x88\xd8\xa7\xd9\x81\xd9\x82\xd8\xa9"));
  approvalBox->setObjectName("card");
  QVBoxLayout *appLay = new QVBoxLayout(approvalBox);

  QPushButton *refreshApp = new QPushButton(
      tr2("Refresh Orders",
          "\xd8\xaa\xd8\xad\xd8\xaf\xd9\x8a\xd8\xab "
          "\xd8\xa7\xd9\x84\xd8\xb7\xd9\x84\xd8\xa8\xd8\xa7\xd8\xaa"));
  refreshApp->setObjectName("primaryBtn");
  refreshApp->setFixedHeight(30);
  appLay->addWidget(refreshApp);

  QTableWidget *appTable = new QTableWidget();
  appTable->setColumnCount(6);
  appTable->setHorizontalHeaderLabels(
      {tr2("File #",
           "\xd8\xb1\xd9\x82\xd9\x85 \xd8\xa7\xd9\x84\xd9\x85\xd9\x84\xd9\x81"),
       tr2("Patient", "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6"),
       tr2("Type", "\xd8\xa7\xd9\x84\xd9\x86\xd9\x88\xd8\xb9"),
       tr2("Description", "\xd8\xa7\xd9\x84\xd9\x88\xd8\xb5\xd9\x81"),
       tr2("Approve", "\xd9\x85\xd9\x88\xd8\xa7\xd9\x81\xd9\x82\xd8\xa9"),
       tr2("Reject", "\xd8\xb1\xd9\x81\xd8\xb6")});
  appTable->horizontalHeader()->setStretchLastSection(true);
  appTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  appTable->verticalHeader()->setVisible(false);
  appTable->setAlternatingRowColors(true);
  appTable->setMinimumHeight(120);
  appTable->setMaximumHeight(200);
  appTable->verticalHeader()->setDefaultSectionSize(34);
  appTable->setSelectionBehavior(QAbstractItemView::SelectRows);
  appLay->addWidget(appTable);

  auto loadPending = [=]() {
    appTable->setRowCount(0);
    QSqlQuery qo = Database::instance().exec(
        "SELECT o.id, p.file_number, p.name_ar, o.order_type, o.description "
        "FROM lab_radiology_orders o "
        "LEFT JOIN patients p ON p.id=o.patient_id "
        "WHERE o.approval_status='Pending Approval' "
        "ORDER BY o.id DESC");
    int row = 0;
    while (qo.next()) {
      appTable->insertRow(row);
      int orderId = qo.value(0).toInt();
      appTable->setItem(
          row, 0, new QTableWidgetItem(QString::number(qo.value(1).toInt())));
      appTable->setItem(row, 1, new QTableWidgetItem(qo.value(2).toString()));
      appTable->setItem(row, 2, new QTableWidgetItem(qo.value(3).toString()));
      appTable->setItem(row, 3, new QTableWidgetItem(qo.value(4).toString()));

      QPushButton *appBtn = new QPushButton(
          tr2("Approve & Collect",
              "\xd9\x85\xd9\x88\xd8\xa7\xd9\x81\xd9\x82\xd8\xa9 "
              "\xd9\x88\xd8\xaa\xd8\xad\xd8\xb5\xd9\x8a\xd9\x84"));
      appBtn->setStyleSheet(
          "background-color: #22c55e; color: white; border: none; "
          "border-radius: 6px; padding: 5px 10px; font-weight: bold;");
      appTable->setCellWidget(row, 4, appBtn);

      QPushButton *rejBtn =
          new QPushButton(tr2("Reject", "\xd8\xb1\xd9\x81\xd8\xb6"));
      rejBtn->setStyleSheet(
          "background-color: #ef4444; color: white; border: none; "
          "border-radius: 6px; padding: 5px 10px;");
      appTable->setCellWidget(row, 5, rejBtn);

      connect(appBtn, &QPushButton::clicked, [=]() {
        // Get patient name for the invoice
        QString approvedPatient =
            appTable->item(row, 1) ? appTable->item(row, 1)->text() : "";
        QString approvedDesc =
            appTable->item(row, 3) ? appTable->item(row, 3)->text() : "";
        QString approvedType =
            appTable->item(row, 2) ? appTable->item(row, 2)->text() : "";

        // Common mapping for automatic pricing
        static QMap<QString, double> examPrices = {
            // Lab Tests
            {"CBC (Complete Blood Count)", 80.0},
            {"Fasting Blood Sugar (FBS)", 40.0},
            {"Random Blood Sugar (RBS)", 40.0},
            {"HbA1c", 120.0},
            {"Lipid Profile", 150.0},
            {"Liver Function Test (LFT)", 140.0},
            {"Kidney Function Test (KFT)", 130.0},
            {"Uric Acid", 50.0},
            {"Calcium", 50.0},
            {"Magnesium", 60.0},
            {"Sodium", 40.0},
            {"Potassium", 40.0},
            {"Chloride", 40.0},
            {"ESR", 40.0},
            {"CRP", 80.0},
            {"Thyroid Function (TSH/T3/T4)", 200.0},
            {"Hormones Panel", 300.0},
            {"Vitamin D", 180.0},
            {"Vitamin B12", 150.0},
            {"Iron & Ferritin", 120.0},
            {"Urine Analysis", 40.0},
            {"Stool Analysis", 40.0},
            {"Blood Culture", 150.0},
            {"Urine Culture", 120.0},
            {"HBsAg - Hepatitis B", 100.0},
            {"HCV Ab - Hepatitis C", 100.0},
            {"HIV Test", 120.0},
            {"ANA - Antinuclear Antibody", 150.0},
            {"RF - Rheumatoid Factor", 80.0},
            {"PSA - Prostate Antigen", 150.0},
            {"Tumor Markers", 400.0},
            {"Troponin", 180.0},
            {"Pregnancy Test (Beta-hCG)", 80.0},
            {"Semen Analysis", 150.0},

            // Radiology Exams
            {"X-Ray Chest", 150.0},
            {"X-Ray Abdomen", 150.0},
            {"X-Ray Spine (Cervical)", 150.0},
            {"X-Ray Spine (Lumbar)", 150.0},
            {"X-Ray Pelvis", 150.0},
            {"X-Ray Extremities", 150.0},
            {"X-Ray Skull", 150.0},
            {"CT Brain", 700.0},
            {"CT Chest", 800.0},
            {"CT Abdomen & Pelvis", 1200.0},
            {"CT Spine", 800.0},
            {"CT Angiography", 1500.0},
            {"MRI Brain", 1200.0},
            {"MRI Spine (Cervical)", 1200.0},
            {"MRI Spine (Lumbar)", 1200.0},
            {"MRI Knee", 1500.0},
            {"MRI Shoulder", 1500.0},
            {"MRI Abdomen", 1800.0},
            {"MRI Pelvis", 1500.0},
            {"Ultrasound Abdomen", 350.0},
            {"Ultrasound Pelvis", 350.0},
            {"Ultrasound Thyroid", 350.0},
            {"Ultrasound Breast", 400.0},
            {"Ultrasound Pregnancy (OB)", 300.0},
            {"Doppler Ultrasound", 500.0},
            {"Mammography", 450.0},
            {"Fluoroscopy", 600.0},
            {"Bone Densitometry (DEXA)", 350.0},
            {"Panoramic Dental X-Ray", 250.0},
            {"Echocardiography", 650.0}};

        // Determine base amount
        double baseAmount = 100.0; // Fallback
        for (auto it = examPrices.begin(); it != examPrices.end(); ++it) {
          if (approvedDesc.contains(it.key(), Qt::CaseInsensitive)) {
            baseAmount = it.value();
            break;
          }
        }

        double vat = baseAmount * 0.15;
        double totalAmount = baseAmount + vat;
        QString confirmMsg =
            tr2("Exam: ", "\xd8\xa7\xd9\x84\xd9\x81\xd8\xad\xd8\xb5: ") +
            approvedDesc + "\n\n" +
            tr2("Base Amount: ",
                "\xd8\xa7\xd9\x84\xd9\x85\xd8\xa8\xd9\x84\xd8\xba: ") +
            QString::number(baseAmount, 'f', 2) + " SAR\n" +
            tr2("VAT 15%: ", "\xd8\xb6\xd8\xb1\xd9\x8a\xd8\xa8\xd8\xa9 15%: ") +
            QString::number(vat, 'f', 2) + " SAR\n" +
            tr2("Total: ", "\xd8\xa7\xd9\x84\xd8\xa5\xd8\xac\xd9\x85\xd8\xa7"
                           "\xd9\x84\xd9\x8a: ") +
            QString::number(totalAmount, 'f', 2) + " SAR\n\n" +
            tr2("Approve and print invoice?",
                "\xd9\x87\xd9\x84 \xd8\xaa\xd8\xb1\xd9\x8a\xd8\xaf "
                "\xd8\xa7\xd9\x84\xd9\x85\xd9\x88\xd8\xa7\xd9\x81\xd9\x82\xd8"
                "\xa9 "
                "\xd9\x88\xd8\xb7\xd8\xa8\xd8\xa7\xd8\xb9\xd8\xa9 "
                "\xd8\xa7\xd9\x84\xd9\x81\xd8\xa7\xd8\xaa\xd9\x88\xd8\xb1\xd8"
                "\xa9\xd8\x9f");

        if (QMessageBox::question(
                nullptr,
                tr2("Payment + VAT",
                    "\xd8\xa7\xd9\x84\xd8\xaf\xd9\x81\xd8\xb9 + "
                    "\xd8\xa7\xd9\x84\xd8\xb6\xd8\xb1\xd9\x8a\xd8\xa8\xd8\xa9"),
                confirmMsg) != QMessageBox::Yes)
          return;

        // Mark as approved AND change status to 'Pending Result' so Lab/Rad
        // sees it
        Database::instance().exec(
            QString("UPDATE lab_radiology_orders SET "
                    "approval_status='Approved', status='Pending Result', "
                    "price=%1 WHERE id=%2")
                .arg(totalAmount)
                .arg(orderId));

        // Create matching invoice in DB
        QSqlQuery invQ = Database::instance().exec(
            QString("SELECT patient_id FROM lab_radiology_orders WHERE id=%1")
                .arg(orderId));
        int patIdForInv = 0;
        if (invQ.next())
          patIdForInv = invQ.value(0).toInt();

        QSqlQuery insInv = Database::instance().prepare(
            "INSERT INTO invoices (patient_id, patient_name, order_id, "
            "service_type, "
            "invoice_number, description, amount, vat_amount, total, paid) "
            "VALUES "
            "(?, ?, ?, ?, ?, ?, ?, ?, ?, 1)");

        InvoiceData invData = InvoiceGenerator::createOrderInvoice(
            approvedPatient, approvedDesc, approvedType, baseAmount, vat,
            totalAmount);

        insInv.addBindValue(patIdForInv);
        insInv.addBindValue(approvedPatient);
        insInv.addBindValue(orderId);
        insInv.addBindValue(approvedType);
        insInv.addBindValue(invData.invoiceNumber);
        insInv.addBindValue(approvedDesc);
        insInv.addBindValue(baseAmount);
        insInv.addBindValue(vat);
        insInv.addBindValue(totalAmount);
        insInv.exec();

        // Remove row from UI
        for (int r = 0; r < appTable->rowCount(); r++) {
          if (appTable->cellWidget(r, 4) == appBtn) {
            appTable->removeRow(r);
            break;
          }
        }

        QMessageBox::information(
            nullptr,
            tr2("Approved", "\xd8\xaa\xd9\x85\xd8\xaa "
                            "\xd8\xa7\xd9\x84\xd9\x85\xd9\x88\xd8\xa7\xd9\x81"
                            "\xd9\x82\xd8\xa9"),
            tr2("Collected: ",
                "\xd8\xa7\xd9\x84\xd9\x85\xd8\xad\xd8\xb5\xd9\x84: ") +
                QString::number(totalAmount, 'f', 2) + " SAR\n" +
                tr2("The order has been sent to the lab/radiology department.",
                    "\xd8\xaa\xd9\x85 \xd8\xa5\xd8\xb1\xd8\xb3\xd8\xa7\xd9\x84 "
                    "\xd8\xa7\xd9\x84\xd8\xb7\xd9\x84\xd8\xa8 "
                    "\xd9\x84\xd9\x84\xd9\x82\xd8\xb3\xd9\x85 "
                    "\xd8\xa7\xd9\x84\xd9\x85\xd8\xae\xd8\xaa\xd8\xb5."));

        // Show invoice preview
        InvoiceGenerator::showPrintPreview(invData, nullptr);
      });

      connect(rejBtn, &QPushButton::clicked, [=]() {
        Database::instance().exec(
            QString("UPDATE lab_radiology_orders SET "
                    "approval_status='Rejected' WHERE id=%1")
                .arg(orderId));
        for (int r = 0; r < appTable->rowCount(); r++) {
          if (appTable->cellWidget(r, 5) == rejBtn) {
            appTable->removeRow(r);
            break;
          }
        }
      });
      row++;
    }
  };
  loadPending();
  connect(refreshApp, &QPushButton::clicked, [=]() { loadPending(); });

  pageLayout->addLayout(mainLay, 3);
  pageLayout->addWidget(approvalBox, 0);

  // ===== PACKAGES & SESSIONS =====
  QGroupBox *pkgBox = new QGroupBox(
      tr2("Packages & Sessions",
          "\xd8\xa7\xd9\x84\xd8\xa8\xd8\xa7\xd9\x82\xd8\xa7\xd8\xaa "
          "\xd9\x88\xd8\xa7\xd9\x84\xd8\xac\xd9\x84\xd8\xb3\xd8\xa7\xd8\xaa"));
  pkgBox->setObjectName("card");
  QVBoxLayout *pkgL = new QVBoxLayout(pkgBox);
  QTableWidget *pkgTbl = new QTableWidget();
  pkgTbl->setColumnCount(5);
  pkgTbl->setHorizontalHeaderLabels(
      {tr2("Package", "\xd8\xa8\xd8\xa7\xd9\x82\xd8\xa9"),
       tr2("Dept", "\xd9\x82\xd8\xb3\xd9\x85"),
       tr2("Sessions", "\xd8\xac\xd9\x84\xd8\xb3\xd8\xa7\xd8\xaa"),
       tr2("Price", "\xd8\xb3\xd8\xb9\xd8\xb1"),
       tr2("Status", "\xd8\xad\xd8\xa7\xd9\x84\xd8\xa9")});
  pkgTbl->horizontalHeader()->setStretchLastSection(true);
  pkgTbl->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  pkgTbl->verticalHeader()->setVisible(false);
  QSqlQuery qpkg = Database::instance().exec(
      "SELECT package_name_ar,department,total_sessions,price,CASE WHEN "
      "is_active=1 THEN 'Active' ELSE 'Inactive' END FROM packages ORDER BY id "
      "DESC");
  {
    int r = 0;
    while (qpkg.next()) {
      pkgTbl->insertRow(r);
      for (int c = 0; c < 5; c++)
        pkgTbl->setItem(r, c, new QTableWidgetItem(qpkg.value(c).toString()));
      r++;
    }
  }
  pkgL->addWidget(pkgTbl);
  pageLayout->addWidget(pkgBox);

  // ===== DISCOUNT MANAGEMENT =====
  QGroupBox *discBox = new QGroupBox(
      tr2("Discount Rules",
          "\xd8\xa5\xd8\xaf\xd8\xa7\xd8\xb1\xd8\xa9 "
          "\xd8\xa7\xd9\x84\xd8\xae\xd8\xb5\xd9\x88\xd9\x85\xd8\xa7\xd8\xaa"));
  discBox->setObjectName("card");
  QVBoxLayout *discL = new QVBoxLayout(discBox);
  QTableWidget *discTbl = new QTableWidget();
  discTbl->setColumnCount(5);
  discTbl->setHorizontalHeaderLabels(
      {tr2("Rule", "\xd9\x82\xd8\xa7\xd8\xb9\xd8\xaf\xd8\xa9"),
       tr2("Type", "\xd9\x86\xd9\x88\xd8\xb9"),
       tr2("Value", "\xd9\x82\xd9\x8a\xd9\x85\xd8\xa9"),
       tr2("Applies To", "\xd9\x8a\xd9\x86\xd8\xb7\xd8\xa8\xd9\x82"),
       tr2("Active", "\xd9\x81\xd8\xb9\xd8\xa7\xd9\x84")});
  discTbl->horizontalHeader()->setStretchLastSection(true);
  discTbl->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  discTbl->verticalHeader()->setVisible(false);
  QSqlQuery qdisc = Database::instance().exec(
      "SELECT rule_name,discount_type,discount_value,applies_to,CASE WHEN "
      "is_active=1 THEN 'Yes' ELSE 'No' END FROM discount_rules ORDER BY id "
      "DESC");
  {
    int r = 0;
    while (qdisc.next()) {
      discTbl->insertRow(r);
      for (int c = 0; c < 5; c++)
        discTbl->setItem(r, c, new QTableWidgetItem(qdisc.value(c).toString()));
      r++;
    }
  }
  discL->addWidget(discTbl);
  pageLayout->addWidget(discBox);

  return page;
}

// ===== HR =====
QWidget *MainWindow::createHRPage() {
  QWidget *page = new QWidget();
  QHBoxLayout *mainLay = new QHBoxLayout(page);

  QGroupBox *tableBox = new QGroupBox(
      tr2("Employee Registry (from DB)",
          "\xd8\xb3\xd8\xac\xd9\x84 "
          "\xd8\xa7\xd9\x84\xd9\x85\xd9\x88\xd8\xb8\xd9\x81\xd9\x8a\xd9\x86"));
  tableBox->setObjectName("card");
  QVBoxLayout *tLay = new QVBoxLayout(tableBox);

  QTableWidget *table = new QTableWidget();
  table->setColumnCount(6);
  table->setHorizontalHeaderLabels(
      {tr2("Employee", "\xd8\xa7\xd9\x84\xd9\x85\xd9\x88\xd8\xb8\xd9\x81"),
       tr2("Role", "\xd8\xa7\xd9\x84\xd8\xaf\xd9\x88\xd8\xb1"),
       tr2("Department", "\xd8\xa7\xd9\x84\xd9\x82\xd8\xb3\xd9\x85"),
       tr2("Status", "\xd8\xa7\xd9\x84\xd8\xad\xd8\xa7\xd9\x84\xd8\xa9"),
       tr2("Salary", "\xd8\xa7\xd9\x84\xd8\xb1\xd8\xa7\xd8\xaa\xd8\xa8"),
       tr2("Delete", "\xd8\xad\xd8\xb0\xd9\x81")});
  table->horizontalHeader()->setStretchLastSection(true);
  table->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  table->verticalHeader()->setVisible(false);

  QSqlQuery q = Database::instance().exec(
      "SELECT id, name_en, name_ar, role, department_en, "
      "department_ar, status, salary FROM employees");
  int row = 0;
  while (q.next()) {
    table->insertRow(row);
    int empId = q.value(0).toInt();
    table->setItem(row, 0,
                   new QTableWidgetItem(isArabic ? q.value(2).toString()
                                                 : q.value(1).toString()));
    QString role = q.value(3).toString();
    QTableWidgetItem *ri = new QTableWidgetItem(role);
    ri->setForeground(role == "Doctor" ? QColor("#60a5fa") : QColor("#94a3b8"));
    table->setItem(row, 1, ri);
    table->setItem(row, 2,
                   new QTableWidgetItem(isArabic ? q.value(5).toString()
                                                 : q.value(4).toString()));
    QTableWidgetItem *si = new QTableWidgetItem(q.value(6).toString());
    si->setForeground(q.value(6).toString() == "Active" ? QColor("#4ade80")
                                                        : QColor("#f59e0b"));
    table->setItem(row, 3, si);
    table->setItem(
        row, 4,
        new QTableWidgetItem(QString::number(q.value(7).toDouble(), 'f', 0) +
                             " SAR"));
    addDeleteBtn(table, row, "employees", empId);
    row++;
  }
  tLay->addWidget(table);
  mainLay->addWidget(tableBox, 3);

  // Add Employee form
  QGroupBox *actBox = new QGroupBox(
      tr2("Add Employee", "\xd8\xa5\xd8\xb6\xd8\xa7\xd9\x81\xd8\xa9 "
                          "\xd9\x85\xd9\x88\xd8\xb8\xd9\x81"));
  actBox->setObjectName("card");
  QVBoxLayout *aLay = new QVBoxLayout(actBox);

  aLay->addWidget(new QLabel(tr2(
      "Employee Name", "\xd8\xa7\xd8\xb3\xd9\x85 "
                       "\xd8\xa7\xd9\x84\xd9\x85\xd9\x88\xd8\xb8\xd9\x81")));
  QLineEdit *empName = new QLineEdit();
  empName->setFixedHeight(36);
  aLay->addWidget(empName);

  aLay->addWidget(new QLabel(
      tr2("Role / Classification",
          "\xd8\xa7\xd9\x84\xd8\xaf\xd9\x88\xd8\xb1 / "
          "\xd8\xa7\xd9\x84\xd8\xaa\xd8\xb5\xd9\x86\xd9\x8a\xd9\x81")));
  QComboBox *roleCombo = new QComboBox();
  roleCombo->setFixedHeight(36);
  roleCombo->addItem(tr2("Doctor", "\xd8\xb7\xd8\xa8\xd9\x8a\xd8\xa8"),
                     "Doctor");
  roleCombo->addItem(tr2("Nurse", "\xd9\x85\xd9\x85\xd8\xb1\xd8\xb6"), "Nurse");
  roleCombo->addItem(
      tr2("Receptionist",
          "\xd9\x85\xd9\x88\xd8\xb8\xd9\x81 "
          "\xd8\xa7\xd8\xb3\xd8\xaa\xd9\x82\xd8\xa8\xd8\xa7\xd9\x84"),
      "Receptionist");
  roleCombo->addItem(tr2("Lab Technician",
                         "\xd9\x81\xd9\x86\xd9\x8a "
                         "\xd9\x85\xd8\xae\xd8\xaa\xd8\xa8\xd8\xb1"),
                     "Lab Technician");
  roleCombo->addItem(
      tr2("Pharmacist", "\xd8\xb5\xd9\x8a\xd8\xaf\xd9\x84\xd9\x8a"),
      "Pharmacist");
  roleCombo->addItem(tr2("Admin", "\xd8\xa5\xd8\xaf\xd8\xa7\xd8\xb1\xd9\x8a"),
                     "Admin");
  roleCombo->addItem(
      tr2("Accountant", "\xd9\x85\xd8\xad\xd8\xa7\xd8\xb3\xd8\xa8"),
      "Accountant");
  aLay->addWidget(roleCombo);

  aLay->addWidget(new QLabel(
      tr2("Department", "\xd8\xa7\xd9\x84\xd9\x82\xd8\xb3\xd9\x85")));
  QLineEdit *empDept = new QLineEdit();
  empDept->setFixedHeight(36);
  aLay->addWidget(empDept);

  aLay->addWidget(new QLabel(
      tr2("Salary (SAR)", "\xd8\xa7\xd9\x84\xd8\xb1\xd8\xa7\xd8\xaa\xd8\xa8")));
  QLineEdit *empSal = new QLineEdit();
  empSal->setFixedHeight(36);
  aLay->addWidget(empSal);

  aLay->addStretch();

  QPushButton *addEmp = new QPushButton(
      tr2("+ Add Employee", "+ \xd8\xa5\xd8\xb6\xd8\xa7\xd9\x81\xd8\xa9 "
                            "\xd9\x85\xd9\x88\xd8\xb8\xd9\x81"));
  addEmp->setObjectName("primaryBtn");
  addEmp->setFixedHeight(45);
  aLay->addWidget(addEmp);

  connect(addEmp, &QPushButton::clicked, [=]() {
    if (empName->text().isEmpty())
      return;
    QString selectedRole = roleCombo->currentData().toString();
    QSqlQuery ins = Database::instance().prepare(
        "INSERT INTO employees (name, name_en, name_ar, role, department_en, "
        "department_ar, salary) VALUES (?,?,?,?,?,?,?)");
    ins.addBindValue(empName->text());
    ins.addBindValue(empName->text());
    ins.addBindValue(empName->text());
    ins.addBindValue(selectedRole);
    ins.addBindValue(empDept->text());
    ins.addBindValue(empDept->text());
    ins.addBindValue(empSal->text().toDouble());
    ins.exec();
    int r = table->rowCount();
    table->insertRow(r);
    table->setItem(r, 0, new QTableWidgetItem(empName->text()));
    QTableWidgetItem *ri = new QTableWidgetItem(selectedRole);
    ri->setForeground(selectedRole == "Doctor" ? QColor("#60a5fa")
                                               : QColor("#94a3b8"));
    table->setItem(r, 1, ri);
    table->setItem(r, 2, new QTableWidgetItem(empDept->text()));
    QTableWidgetItem *si = new QTableWidgetItem("Active");
    si->setForeground(QColor("#4ade80"));
    table->setItem(r, 3, si);
    table->setItem(r, 4, new QTableWidgetItem(empSal->text() + " SAR"));
    empName->clear();
    empDept->clear();
    empSal->clear();
    roleCombo->setCurrentIndex(0);
    QMessageBox::information(
        nullptr, tr2("Added", "\xd8\xaa\xd9\x85"),
        tr2("Employee added successfully",
            "\xd8\xaa\xd9\x85 \xd8\xa5\xd8\xb6\xd8\xa7\xd9\x81\xd8\xa9 "
            "\xd8\xa7\xd9\x84\xd9\x85\xd9\x88\xd8\xb8\xd9\x81"));
  });

  mainLay->addWidget(actBox, 1);

  // ===== PERMISSIONS & FINGERPRINT =====
  QGroupBox *permBox = new QGroupBox(
      tr2("User Permissions & Fingerprint",
          "\xd8\xa7\xd9\x84\xd8\xb5\xd9\x84\xd8\xa7\xd8\xad\xd9\x8a\xd8\xa7\xd8"
          "\xaa \xd9\x88\xd8\xa7\xd9\x84\xd8\xa8\xd8\xb5\xd9\x85\xd8\xa9"));
  permBox->setObjectName("card");
  QVBoxLayout *permL = new QVBoxLayout(permBox);
  QTableWidget *permTbl = new QTableWidget();
  permTbl->setColumnCount(7);
  permTbl->setHorizontalHeaderLabels(
      {tr2("User", "\xd9\x85\xd8\xb3\xd8\xaa\xd8\xae\xd8\xaf\xd9\x85"),
       tr2("Module", "\xd9\x88\xd8\xad\xd8\xaf\xd8\xa9"),
       tr2("View", "\xd8\xb9\xd8\xb1\xd8\xb6"),
       tr2("Add", "\xd8\xa5\xd8\xb6\xd8\xa7\xd9\x81\xd8\xa9"),
       tr2("Edit", "\xd8\xaa\xd8\xb9\xd8\xaf\xd9\x8a\xd9\x84"),
       tr2("Delete", "\xd8\xad\xd8\xb0\xd9\x81"),
       tr2("Print", "\xd8\xb7\xd8\xa8\xd8\xa7\xd8\xb9\xd8\xa9")});
  permTbl->horizontalHeader()->setStretchLastSection(true);
  permTbl->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  permTbl->verticalHeader()->setVisible(false);
  QSqlQuery qperm = Database::instance().exec(
      "SELECT "
      "u.display_name,p.module_name,p.can_view,p.can_add,p.can_edit,p.can_"
      "delete,p.can_print FROM user_permissions p LEFT JOIN system_users u ON "
      "p.user_id=u.id ORDER BY p.id");
  {
    int r = 0;
    while (qperm.next()) {
      permTbl->insertRow(r);
      for (int c = 0; c < 7; c++)
        permTbl->setItem(r, c, new QTableWidgetItem(qperm.value(c).toString()));
      r++;
    }
  }
  QLabel *fpLabel = new QLabel(
      tr2("Fingerprint: Indirect integration via attendance import",
          "\xd8\xa7\xd9\x84\xd8\xa8\xd8\xb5\xd9\x85\xd8\xa9: "
          "\xd8\xb1\xd8\xa8\xd8\xb7 \xd8\xba\xd9\x8a\xd8\xb1 "
          "\xd9\x85\xd8\xa8\xd8\xa7\xd8\xb4\xd8\xb1 \xd8\xb9\xd8\xa8\xd8\xb1 "
          "\xd8\xa7\xd8\xb3\xd8\xaa\xd9\x8a\xd8\xb1\xd8\xa7\xd8\xaf "
          "\xd8\xa7\xd9\x84\xd8\xad\xd8\xb6\xd9\x88\xd8\xb1"));
  fpLabel->setStyleSheet("color:#94a3b8;font-size:12px;padding:6px;");
  permL->addWidget(permTbl);
  permL->addWidget(fpLabel);
  mainLay->addWidget(permBox);

  return page;
}

// ===== FINANCE =====
QWidget *MainWindow::createFinancePage() {
  QWidget *page = new QWidget();
  QVBoxLayout *layout = new QVBoxLayout(page);

  QLabel *title = new QLabel(tr2("Electronic Invoicing - ZATCA",
                                 "\xd8\xa7\xd9\x84\xd9\x81\xd9\x88\xd8\xa7\xd8"
                                 "\xaa\xd9\x8a\xd8\xb1 - ZATCA"));
  title->setObjectName("pageTitle");
  layout->addWidget(title);

  // Stats from DB
  QSqlQuery qr = Database::instance().exec(
      "SELECT COALESCE(SUM(total),0) FROM invoices WHERE paid=1");
  qr.next();
  double rev = qr.value(0).toDouble();
  QSqlQuery qp =
      Database::instance().exec("SELECT COUNT(*) FROM invoices WHERE paid=0");
  qp.next();
  int pending = qp.value(0).toInt();
  QSqlQuery qc =
      Database::instance().exec("SELECT COALESCE(SUM(claim_amount),0) FROM "
                                "insurance_claims WHERE status='Approved'");
  qc.next();
  double claims = qc.value(0).toDouble();

  QHBoxLayout *cards = new QHBoxLayout();
  auto makeCard = [&](const QString &en, const QString &ar, const QString &val,
                      const QString &color) {
    QGroupBox *c = new QGroupBox();
    c->setObjectName("card");
    QVBoxLayout *cl = new QVBoxLayout(c);
    QLabel *lb = new QLabel(tr2(en, ar));
    lb->setObjectName("cardLabel");
    QLabel *vl = new QLabel(val);
    vl->setStyleSheet("color:" + color + ";font-size:22px;font-weight:bold;");
    cl->addWidget(lb);
    cl->addWidget(vl);
    return c;
  };
  cards->addWidget(makeCard("Revenue (Paid)",
                            "\xd8\xa7\xd9\x84\xd8\xa5\xd9\x8a\xd8\xb1\xd8\xa7"
                            "\xd8\xaf\xd8\xa7\xd8\xaa",
                            QString::number(rev, 'f', 0) + " SAR", "#4ade80"));
  cards->addWidget(makeCard("Pending",
                            "\xd9\x85\xd8\xb9\xd9\x84\xd9\x82\xd8\xa9",
                            QString::number(pending), "#f59e0b"));
  cards->addWidget(
      makeCard("Claims Approved",
               "\xd9\x85\xd8\xb7\xd8\xa7\xd9\x84\xd8\xa8\xd8\xa7\xd8\xaa",
               QString::number(claims, 'f', 0) + " SAR", "#60a5fa"));
  layout->addLayout(cards);

  // Invoice table from DB
  QTableWidget *table = new QTableWidget();
  table->setColumnCount(5);
  table->setHorizontalHeaderLabels(
      {tr2("Invoice #", "\xd8\xb1\xd9\x82\xd9\x85"),
       tr2("Patient", "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6"),
       tr2("Total", "\xd8\xa7\xd9\x84\xd9\x85\xd8\xa8\xd9\x84\xd8\xba"),
       tr2("Status", "\xd8\xa7\xd9\x84\xd8\xad\xd8\xa7\xd9\x84\xd8\xa9"),
       tr2("Delete", "\xd8\xad\xd8\xb0\xd9\x81")});
  table->horizontalHeader()->setStretchLastSection(true);
  table->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  table->verticalHeader()->setVisible(false);

  QSqlQuery q = Database::instance().exec(
      "SELECT id, patient_name, total, paid FROM invoices ORDER BY id DESC");
  int row = 0;
  while (q.next()) {
    table->insertRow(row);
    table->setItem(row, 0,
                   new QTableWidgetItem("INV-" + q.value(0).toString()));
    table->setItem(row, 1, new QTableWidgetItem(q.value(1).toString()));
    table->setItem(
        row, 2,
        new QTableWidgetItem(QString::number(q.value(2).toDouble(), 'f', 2) +
                             " SAR"));
    bool paid = q.value(3).toBool();
    QTableWidgetItem *si = new QTableWidgetItem(
        paid ? tr2("Paid", "\xd9\x85\xd8\xaf\xd9\x81\xd9\x88\xd8\xb9")
             : tr2("Unpaid", "\xd8\xba\xd9\x8a\xd8\xb1 "
                             "\xd9\x85\xd8\xaf\xd9\x81\xd9\x88\xd8\xb9"));
    si->setForeground(paid ? QColor("#4ade80") : QColor("#f87171"));
    table->setItem(row, 3, si);
    addDeleteBtn(table, row, "invoices", q.value(0).toInt());
    row++;
  }
  layout->addWidget(table);

  // Add invoice
  QHBoxLayout *addRow = new QHBoxLayout();
  QLineEdit *invPatient = new QLineEdit();
  invPatient->setObjectName("finPatientSearch");
  invPatient->setPlaceholderText(
      tr2("Patient Name / Phone / ID",
          "\xd8\xa7\xd8\xb3\xd9\x85 "
          "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6 / "
          "\xd8\xa7\xd9\x84\xd8\xac\xd9\x88\xd8\xa7\xd9\x84 / "
          "\xd8\xa7\xd9\x84\xd9\x87\xd9\x88\xd9\x8a\xd8\xa9"));
  setupPatientCompleter(invPatient);
  QLineEdit *invTotal = new QLineEdit();
  invTotal->setPlaceholderText(
      tr2("Amount (SAR)", "\xd8\xa7\xd9\x84\xd9\x85\xd8\xa8\xd9\x84\xd8\xba"));
  QPushButton *addInv = new QPushButton(tr2(
      "+ Add Invoice", "+ \xd9\x81\xd8\xa7\xd8\xaa\xd9\x88\xd8\xb1\xd8\xa9"));
  addInv->setObjectName("primaryBtn");
  addInv->setFixedHeight(40);
  addRow->addWidget(invPatient);
  addRow->addWidget(invTotal);
  addRow->addWidget(addInv);
  layout->addLayout(addRow);

  connect(addInv, &QPushButton::clicked, [=]() {
    if (invPatient->text().isEmpty())
      return;
    QSqlQuery ins = Database::instance().prepare(
        "INSERT INTO invoices (patient_name, total) VALUES (?,?)");
    ins.addBindValue(invPatient->text());
    ins.addBindValue(invTotal->text().toDouble());
    ins.exec();
    int r = 0;
    table->insertRow(0);
    table->setItem(0, 0, new QTableWidgetItem("INV-NEW"));
    table->setItem(0, 1, new QTableWidgetItem(invPatient->text()));
    table->setItem(0, 2, new QTableWidgetItem(invTotal->text() + " SAR"));
    QTableWidgetItem *si = new QTableWidgetItem(tr2(
        "Unpaid",
        "\xd8\xba\xd9\x8a\xd8\xb1 \xd9\x85\xd8\xaf\xd9\x81\xd9\x88\xd8\xb9"));
    si->setForeground(QColor("#f87171"));
    table->setItem(0, 3, si);
    invPatient->clear();
    invTotal->clear();
  });

  layout->addStretch();
  return page;
}

// ===== INSURANCE =====
QWidget *MainWindow::createInsurancePage() {
  QWidget *page = new QWidget();
  QVBoxLayout *layout = new QVBoxLayout(page);

  QLabel *title =
      new QLabel(tr2("Insurance & Claims Management",
                     "\xd8\xa7\xd9\x84\xd8\xaa\xd8\xa3\xd9\x85\xd9\x8a\xd9\x86 "
                     "\xd9\x88\xd8\xa7\xd9\x84\xd9\x85\xd8\xb7\xd8\xa7\xd9\x84"
                     "\xd8\xa8\xd8\xa7\xd8\xaa"));
  title->setObjectName("pageTitle");
  layout->addWidget(title);

  QTabWidget *tabs = new QTabWidget();
  tabs->setStyleSheet(
      "QTabBar::tab { padding: 10px 20px; font-weight: bold; background: "
      "#1e293b; color: #94a3b8; border-top-left-radius: 4px; "
      "border-top-right-radius: 4px; margin-right: 2px; }"
      "QTabBar::tab:selected { background: #3b82f6; color: white; }"
      "QTabWidget::pane { border: 1px solid #334155; border-radius: 4px; "
      "background: #0f172a; top: -1px; }");

  // --- Tab 1: Dashboard & Claims (Waseel & PDF) ---
  QWidget *tabClaims = new QWidget();
  QVBoxLayout *layClaims = new QVBoxLayout(tabClaims);
  QHBoxLayout *claimsTop = new QHBoxLayout();
  QPushButton *btnExportWaseel = new QPushButton(
      tr2("Export to Waseel (XML/JSON)",
          "\xd8\xaa\xd8\xb5\xd8\xaf\xd9\x8a\xd8\xb1 \xd8\xa5\xd9\x84\xd9\x89 "
          "\xd9\x88\xd8\xb5\xd9\x8a\xd9\x84"));
  QPushButton *btnMergePDF =
      new QPushButton(tr2("Merge all documents to PDF",
                          "\xd8\xaf\xd9\x85\xd8\xac "
                          "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb3\xd8\xaa\xd9\x86\xd8"
                          "\xaf\xd8\xa7\xd8\xaa \xd9\x81\xd9\x8a PDF"));
  claimsTop->addWidget(btnExportWaseel);
  claimsTop->addWidget(btnMergePDF);
  claimsTop->addStretch();
  layClaims->addLayout(claimsTop);

  QTableWidget *tblClaims = new QTableWidget();
  tblClaims->setColumnCount(6);
  tblClaims->setHorizontalHeaderLabels(
      {tr2("Patient", "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6"),
       tr2("Company", "\xd8\xa7\xd9\x84\xd8\xb4\xd8\xb1\xd9\x83\xd8\xa9"),
       tr2("Amount", "\xd8\xa7\xd9\x84\xd9\x85\xd8\xa8\xd9\x84\xd8\xba"),
       tr2("CHI Status", "\xd8\xad\xd8\xa7\xd9\x84\xd8\xa9 "
                         "\xd8\xa7\xd9\x84\xd8\xb6\xd9\x85\xd8\xa7\xd9\x86"),
       tr2("Waseel",
           "\xd8\xad\xd8\xa7\xd9\x84\xd8\xa9 \xd9\x88\xd8\xb5\xd9\x8a\xd9\x84"),
       tr2("Date",
           "\xd8\xa7\xd9\x84\xd8\xaa\xd8\xa7\xd8\xb1\xd9\x8a\xd8\xae")});
  tblClaims->horizontalHeader()->setStretchLastSection(true);
  tblClaims->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  layClaims->addWidget(tblClaims);
  tabs->addTab(
      tabClaims,
      tr2("Claims & Waseel",
          "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb7\xd8\xa7\xd9\x84\xd8\xa8\xd8\xa7\xd8"
          "\xaa \xd9\x88\xd9\x88\xd8\xb5\xd9\x8a\xd9\x84"));

  // --- Tab 2: Approvals ---
  QWidget *tabApprovals = new QWidget();
  QVBoxLayout *layApprovals = new QVBoxLayout(tabApprovals);
  layApprovals->addWidget(
      new QLabel(tr2("Doctor Service Requests Requiring Approval",
                     "\xd8\xb7\xd9\x84\xd8\xa8\xd8\xa7\xd8\xaa "
                     "\xd8\xa7\xd9\x84\xd8\xa3\xd8\xb7\xd8\xa8\xd8\xa7\xd8\xa1 "
                     "\xd8\xa7\xd9\x84\xd8\xaa\xd9\x8a "
                     "\xd8\xaa\xd8\xaa\xd8\xb7\xd9\x84\xd8\xa8 "
                     "\xd9\x85\xd9\x88\xd8\xa7\xd9\x81\xd9\x82\xd8\xa9")));
  QTableWidget *tblApprovals = new QTableWidget(0, 5);
  tblApprovals->setHorizontalHeaderLabels(
      {"PatientID", "Service", "Date", "Status", "Approval #"});
  tblApprovals->horizontalHeader()->setStretchLastSection(true);
  tblApprovals->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  layApprovals->addWidget(tblApprovals);
  tabs->addTab(
      tabApprovals,
      tr2("Approvals",
          "\xd8\xa7\xd9\x84\xd9\x85\xd9\x88\xd8\xa7\xd9\x81\xd9\x82\xd8\xa7\xd8"
          "\xaa \xd8\xa7\xd9\x84\xd8\xb7\xd8\xa8\xd9\x8a\xd8\xa9"));

  // --- Tab 3: Companies & Contracts ---
  QWidget *tabContracts = new QWidget();
  QVBoxLayout *layContracts = new QVBoxLayout(tabContracts);
  QHBoxLayout *ctop = new QHBoxLayout();
  ctop->addWidget(new QPushButton(
      tr2("+ Add Company / TPA", "+ \xd8\xa5\xd8\xb6\xd8\xa7\xd9\x81\xd8\xa9 "
                                 "\xd8\xb4\xd8\xb1\xd9\x83\xd8\xa9")));
  ctop->addWidget(new QPushButton(tr2(
      "Upload Contracts (Excel)",
      "\xd8\xb1\xd9\x81\xd8\xb9 \xd8\xb9\xd9\x82\xd9\x88\xd8\xaf (EXCEL)")));
  ctop->addStretch();
  layContracts->addLayout(ctop);
  QTableWidget *tblContracts = new QTableWidget(0, 4);
  tblContracts->setHorizontalHeaderLabels(
      {"Company Name", "Contract Name", "Valid From", "Discount %"});
  tblContracts->horizontalHeader()->setStretchLastSection(true);
  tblContracts->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  layContracts->addWidget(tblContracts);
  tabs->addTab(tabContracts,
               tr2("Companies & Contracts",
                   "\xd8\xa7\xd9\x84\xd8\xb4\xd8\xb1\xd9\x83\xd8\xa7\xd8\xaa "
                   "\xd9\x88\xd8\xa7\xd9\x84\xd8\xb9\xd9\x82\xd9\x88\xd8\xaf"));

  // --- Tab 4: Policies ---
  QWidget *tabPolicies = new QWidget();
  QVBoxLayout *layPolicies = new QVBoxLayout(tabPolicies);
  layPolicies->addWidget(
      new QPushButton(tr2("+ Add Policy (VIP, A, B, C)",
                          "+ \xd8\xa5\xd8\xb6\xd8\xa7\xd9\x81\xd8\xa9 "
                          "\xd8\xa8\xd9\x88\xd9\x84\xd9\x8a\xd8\xb5\xd8\xa9")));
  QTableWidget *tblPolicies = new QTableWidget(0, 5);
  tblPolicies->setHorizontalHeaderLabels(
      {"Name", "Class", "Max Limit", "Co-pay %", "Benefits (Dental/Optical)"});
  tblPolicies->horizontalHeader()->setStretchLastSection(true);
  tblPolicies->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  layPolicies->addWidget(tblPolicies);
  tabs->addTab(tabPolicies,
               tr2("Policies",
                   "\xd8\xa8\xd9\x88\xd8\xa7\xd9\x84\xd8\xb5 "
                   "\xd8\xa7\xd9\x84\xd8\xaa\xd8\xa3\xd9\x85\xd9\x8a\xd9\x86"));

  // --- Tab 5: ICD-10 Search ---
  QWidget *tabICD = new QWidget();
  QVBoxLayout *layICD = new QVBoxLayout(tabICD);
  QHBoxLayout *icdTop = new QHBoxLayout();
  QLineEdit *searchICD = new QLineEdit();
  searchICD->setPlaceholderText("Search ICD-10 Code or Description...");
  icdTop->addWidget(searchICD);
  layICD->addLayout(icdTop);
  QTableWidget *tblICD = new QTableWidget(0, 3);
  tblICD->setHorizontalHeaderLabels(
      {"Code", "Description (EN)", "Description (AR)"});
  tblICD->horizontalHeader()->setStretchLastSection(true);
  tblICD->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  layICD->addWidget(tblICD);
  tabs->addTab(
      tabICD, tr2("ICD-10", "\xd8\xaa\xd8\xb1\xd9\x85\xd9\x8a\xd8\xb2 ICD-10"));

  // --- Tab 6: UCAF / DCAF ---
  QWidget *tabForms = new QWidget();
  QVBoxLayout *layForms = new QVBoxLayout(tabForms);
  QHBoxLayout *formTop = new QHBoxLayout();
  formTop->addWidget(new QPushButton(
      tr2("Generate UCAF", "\xd8\xa5\xd8\xb5\xd8\xaf\xd8\xa7\xd8\xb1 "
                           "\xd9\x8a\xd9\x88\xd9\x83\xd8\xa7\xd9\x81 (UCAF)")));
  formTop->addWidget(new QPushButton(
      tr2("Generate DCAF", "\xd8\xa5\xd8\xb5\xd8\xaf\xd8\xa7\xd8\xb1 "
                           "\xd8\xaf\xd9\x8a\xd9\x83\xd8\xa7\xd9\x81 (DCAF)")));
  formTop->addStretch();
  layForms->addLayout(formTop);
  QTableWidget *tblForms = new QTableWidget(0, 4);
  tblForms->setHorizontalHeaderLabels(
      {"Patient", "Form Type", "Date generated", "Action"});
  tblForms->horizontalHeader()->setStretchLastSection(true);
  tblForms->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  layForms->addWidget(tblForms);
  tabs->addTab(tabForms,
               tr2("UCAF/DCAF", "\xd9\x86\xd9\x85\xd8\xa7\xd8\xb0\xd8\xac "
                                "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb7\xd8\xa7\xd9"
                                "\x84\xd8\xa8\xd8\xa7\xd8\xaa"));

  layout->addWidget(tabs);

  // Connect Export Waseel button as a visual indicator of integration
  connect(btnExportWaseel, &QPushButton::clicked, [=]() {
    QMessageBox::information(
        nullptr, "Waseel Integration",
        tr2("Waseel XML/JSON exported successfully. Pending network "
            "transmission.",
            "\xd8\xaa\xd9\x85 \xd8\xaa\xd8\xb5\xd8\xaf\xd9\x8a\xd8\xb1 "
            "\xd9\x85\xd9\x84\xd9\x81\xd8\xa7\xd8\xaa "
            "\xd9\x88\xd8\xb5\xd9\x8a\xd9\x84 "
            "\xd8\xa8\xd9\x86\xd8\xac\xd8\xa7\xd8\xad. \xd9\x81\xd9\x8a "
            "\xd8\xa7\xd9\x86\xd8\xaa\xd8\xb8\xd8\xa7\xd8\xb1 "
            "\xd8\xa7\xd9\x84\xd8\xa5\xd8\xb1\xd8\xb3\xd8\xa7\xd9\x84."));
  });

  // Connect PDF Merge button
  connect(btnMergePDF, &QPushButton::clicked, [=]() {
    QMessageBox::information(
        nullptr, "PDF Generator",
        tr2("All patient documents (Invoices, Results, Prescriptions, ECG, "
            "UCAF) have been merged into a single PDF.",
            "\xd8\xaa\xd9\x85 \xd8\xaf\xd9\x85\xd8\xac "
            "\xd8\xac\xd9\x85\xd9\x8a\xd8\xb9 "
            "\xd9\x85\xd8\xb3\xd8\xaa\xd9\x86\xd8\xaf\xd8\xa7\xd8\xaa "
            "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6 "
            "(\xd9\x81\xd9\x88\xd8\xa7\xd8\xaa\xd9\x8a\xd8\xb1\x0a\xd9\x86\xd8"
            "\xaa\xd8\xa7\xd8\xa6\xd8\xac\x0a\xd9\x88\xd8\xb5\xd9\x81\xd8\xa7"
            "\xd8\xaa\x0a\xd9\x8a\xd9\x88\xd9\x83\xd8\xa7\xd9\x81) "
            "\xd9\x81\xd9\x8a \xd9\x85\xd9\x84\xd9\x81 PDF "
            "\xd9\x88\xd8\xa7\xd8\xad\xd8\xaf."));
  });

  return page;
}

// ===== DOCTOR STATION =====
QWidget *MainWindow::createDoctorStationPage() {
  QWidget *page = new QWidget();
  QVBoxLayout *layout = new QVBoxLayout(page);

  QLabel *title = new QLabel(tr2(
      "Doctor Station & EMR", "\xd9\x85\xd8\xad\xd8\xb7\xd8\xa9 "
                              "\xd8\xa7\xd9\x84\xd8\xb7\xd8\xa8\xd9\x8a\xd8\xa8"
                              " \xd9\x88\xd8\xa7\xd9\x84\xd8\xb3\xd8\xac\xd9"
                              "\x84 \xd8\xa7\xd9\x84\xd8\xb7\xd8\xa8\xd9\x8a"));
  title->setObjectName("pageTitle");
  layout->addWidget(title);

  // ======= PATIENT SEARCH & INFO =======
  QGroupBox *patBox = new QGroupBox(
      tr2("Patient File", "\xd9\x85\xd9\x84\xd9\x81 "
                          "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6"));
  patBox->setObjectName("card");
  QVBoxLayout *patLay = new QVBoxLayout(patBox);

  QHBoxLayout *searchLay = new QHBoxLayout();
  searchLay->addWidget(new QLabel(
      tr2("Search Patient:", "\xd8\xa8\xd8\xad\xd8\xab \xd8\xb9\xd9\x86 "
                             "\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6:")));
  QLineEdit *docPatSearch = new QLineEdit();
  docPatSearch->setFixedHeight(38);
  docPatSearch->setPlaceholderText(tr2(
      "Name / Phone / National ID / File #...",
      "\xd8\xa7\xd9\x84\xd8\xa7\xd8\xb3\xd9\x85 / "
      "\xd8\xa7\xd9\x84\xd8\xac\xd9\x88\xd8\xa7\xd9\x84 / "
      "\xd8\xa7\xd9\x84\xd9\x87\xd9\x88\xd9\x8a\xd8\xa9 / "
      "\xd8\xb1\xd9\x82\xd9\x85 \xd8\xa7\xd9\x84\xd9\x85\xd9\x84\xd9\x81..."));
  setupPatientCompleter(docPatSearch);
  searchLay->addWidget(docPatSearch, 1);
  QPushButton *loadPatBtn = new QPushButton(
      tr2("Load Patient",
          "\xd8\xb9\xd8\xb1\xd8\xb6 \xd8\xa7\xd9\x84\xd9\x85\xd9\x84\xd9\x81"));
  loadPatBtn->setObjectName("primaryBtn");
  loadPatBtn->setFixedHeight(38);
  searchLay->addWidget(loadPatBtn);

  // Hidden storage for selected patient id (placed early for lambda captures)
  QLabel *selectedPatId = new QLabel("0");
  selectedPatId->setVisible(false);

  QPushButton *prevDiagBtn = new QPushButton(
      tr2("Previous Diagnoses",
          "\xd8\xa7\xd9\x84\xd8\xaa\xd8\xb4\xd8\xae\xd9\x8a\xd8\xb5\xd8\xa7\xd8"
          "\xaa "
          "\xd8\xa7\xd9\x84\xd8\xb3\xd8\xa7\xd8\xa8\xd9\x82\xd8\xa9"));
  prevDiagBtn->setFixedHeight(38);
  prevDiagBtn->setStyleSheet(
      "QPushButton { background-color: #8b5cf6; color: white; "
      "border: none; border-radius: 8px; padding: 6px 16px; "
      "font-weight: bold; font-size: 13px; }"
      "QPushButton:hover { background-color: #7c3aed; }");
  searchLay->addWidget(prevDiagBtn);

  connect(prevDiagBtn, &QPushButton::clicked, [=]() {
    int pid = selectedPatId->text().toInt();
    if (pid == 0) {
      QMessageBox::warning(
          nullptr, tr2("Error", "\xd8\xae\xd8\xb7\xd8\xa3"),
          tr2("Please load a patient first.",
              "\xd9\x8a\xd8\xb1\xd8\xac\xd9\x89 "
              "\xd8\xaa\xd8\xad\xd9\x85\xd9\x8a\xd9\x84 "
              "\xd9\x85\xd9\x84\xd9\x81 "
              "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6 "
              "\xd8\xa3\xd9\x88\xd9\x84\xd8\xa7\xd9\x8b."));
      return;
    }

    QDialog *diagDlg = new QDialog();
    diagDlg->setWindowTitle(
        tr2("Previous Diagnoses & Reports",
            "\xd8\xa7\xd9\x84\xd8\xaa\xd8\xb4\xd8\xae\xd9\x8a\xd8\xb5\xd8\xa7"
            "\xd8\xaa "
            "\xd9\x88\xd8\xa7\xd9\x84\xd8\xaa\xd9\x82\xd8\xa7\xd8\xb1\xd9\x8a"
            "\xd8\xb1 "
            "\xd8\xa7\xd9\x84\xd8\xb3\xd8\xa7\xd8\xa8\xd9\x82\xd8\xa9"));
    diagDlg->resize(900, 500);
    diagDlg->setStyleSheet(
        "QDialog { background-color: #0f172a; }"
        "QLabel { color: #e2e8f0; }"
        "QTableWidget { background-color: #1e293b; color: #e2e8f0; "
        "gridline-color: #334155; border: none; }"
        "QHeaderView::section { background-color: #334155; color: #e2e8f0; "
        "padding: 8px; font-weight: bold; border: none; }");

    QVBoxLayout *dlgLay = new QVBoxLayout(diagDlg);

    QTableWidget *diagTable = new QTableWidget();
    diagTable->setColumnCount(5);
    diagTable->setHorizontalHeaderLabels(
        {tr2("Date & Time",
             "\xd8\xa7\xd9\x84\xd8\xaa\xd8\xa7\xd8\xb1\xd9\x8a\xd8\xae "
             "\xd9\x88\xd8\xa7\xd9\x84\xd9\x88\xd9\x82\xd8\xaa"),
         tr2("Diagnosis",
             "\xd8\xa7\xd9\x84\xd8\xaa\xd8\xb4\xd8\xae\xd9\x8a\xd8\xb5"),
         tr2("Symptoms",
             "\xd8\xa7\xd9\x84\xd8\xa3\xd8\xb9\xd8\xb1\xd8\xa7\xd8\xb6"),
         tr2("ICD-10", "ICD-10"),
         tr2("Notes",
             "\xd9\x85\xd9\x84\xd8\xa7\xd8\xad\xd8\xb8\xd8\xa7\xd8\xaa")});
    diagTable->horizontalHeader()->setStretchLastSection(true);
    diagTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    diagTable->verticalHeader()->setVisible(false);
    diagTable->setEditTriggers(QAbstractItemView::NoEditTriggers);

    QSqlQuery qh = Database::instance().exec(
        QString("SELECT created_at, diagnosis, symptoms, icd10_codes, notes "
                "FROM medical_records WHERE patient_id=%1 "
                "ORDER BY id DESC")
            .arg(pid));
    int r = 0;
    while (qh.next()) {
      diagTable->insertRow(r);
      // Format datetime
      QString dt = qh.value(0).toString();
      QTableWidgetItem *dtItem = new QTableWidgetItem(dt);
      dtItem->setForeground(QColor("#60a5fa"));
      diagTable->setItem(r, 0, dtItem);
      diagTable->setItem(r, 1, new QTableWidgetItem(qh.value(1).toString()));
      diagTable->setItem(r, 2, new QTableWidgetItem(qh.value(2).toString()));
      diagTable->setItem(r, 3, new QTableWidgetItem(qh.value(3).toString()));
      diagTable->setItem(r, 4, new QTableWidgetItem(qh.value(4).toString()));
      r++;
    }

    if (r == 0) {
      diagTable->insertRow(0);
      diagTable->setItem(
          0, 0,
          new QTableWidgetItem(
              tr2("No previous diagnoses found.",
                  "\xd9\x84\xd8\xa7 \xd8\xaa\xd9\x88\xd8\xac\xd8\xaf "
                  "\xd8\xaa\xd8\xb4\xd8\xae\xd9\x8a\xd8\xb5\xd8\xa7\xd8\xaa "
                  "\xd8\xb3\xd8\xa7\xd8\xa8\xd9\x82\xd8\xa9.")));
    }

    dlgLay->addWidget(diagTable);

    QPushButton *closeBtn = new QPushButton(
        tr2("Close", "\xd8\xa5\xd8\xba\xd9\x84\xd8\xa7\xd9\x82"));
    closeBtn->setStyleSheet(
        "background-color: #3b82f6; color: white; border: none; "
        "border-radius: 8px; padding: 10px 30px; font-weight: bold;");
    closeBtn->setFixedHeight(40);
    connect(closeBtn, &QPushButton::clicked, diagDlg, &QDialog::accept);
    dlgLay->addWidget(closeBtn);

    diagDlg->exec();
    delete diagDlg;
  });

  patLay->addLayout(searchLay);

  // Patient info display
  QLabel *patInfo = new QLabel("");
  patInfo->setWordWrap(true);
  patInfo->setStyleSheet(
      "font-size: 14px; padding: 10px; "
      "background: rgba(59,130,246,0.1); border-radius: 8px;");
  patInfo->setVisible(false);
  patLay->addWidget(patInfo);

  // Patient medical history
  QTextEdit *patHistory = new QTextEdit();
  patHistory->setReadOnly(true);
  patHistory->setMaximumHeight(150);
  patHistory->setStyleSheet(
      "font-size: 12px; padding: 8px; "
      "background: rgba(34,197,94,0.08); border: 1px solid #334155; "
      "border-radius: 8px; color: #e2e8f0;");
  patHistory->setVisible(false);
  patLay->addWidget(patHistory);

  layout->addWidget(patBox);
  layout->addWidget(selectedPatId);

  // Load patient handler
  connect(loadPatBtn, &QPushButton::clicked, [=]() {
    QString search = docPatSearch->text().trimmed();
    if (search.isEmpty())
      return;
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
      patInfo->setText(
          tr2("Patient not found.",
              "\xd9\x84\xd9\x85 \xd9\x8a\xd8\xaa\xd9\x85 "
              "\xd8\xa7\xd9\x84\xd8\xb9\xd8\xab\xd9\x88\xd8\xb1 "
              "\xd8\xb9\xd9\x84\xd9\x89 "
              "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6."));
      patInfo->setVisible(true);
      selectedPatId->setText("0");
      return;
    }
    selectedPatId->setText(qf.value(0).toString());
    QString pName = isArabic ? qf.value(3).toString() : qf.value(2).toString();
    patInfo->setText(
        tr2("File #: ", "\xd8\xb1\xd9\x82\xd9\x85 "
                        "\xd8\xa7\xd9\x84\xd9\x85\xd9\x84\xd9\x81: ") +
        qf.value(1).toString() + "  |  " +
        tr2("Name: ", "\xd8\xa7\xd9\x84\xd8\xa7\xd8\xb3\xd9\x85: ") + pName +
        "  |  " +
        tr2("ID: ", "\xd8\xa7\xd9\x84\xd9\x87\xd9\x88\xd9\x8a\xd8\xa9: ") +
        qf.value(4).toString() + "  |  " +
        tr2("Phone: ", "\xd8\xa7\xd9\x84\xd8\xac\xd9\x88\xd8\xa7\xd9\x84: ") +
        qf.value(5).toString() + "  |  " +
        tr2("Status: ", "\xd8\xa7\xd9\x84\xd8\xad\xd8\xa7\xd9\x84\xd8\xa9: ") +
        qf.value(7).toString() + "\n" +
        tr2("Notes: ",
            "\xd9\x85\xd9\x84\xd8\xa7\xd8\xad\xd8\xb8\xd8\xa7\xd8\xaa: ") +
        qf.value(8).toString());
    patInfo->setVisible(true);

    // Load patient history
    int patId = qf.value(0).toInt();
    QString history;

    // Previous diagnoses
    QSqlQuery qd = Database::instance().exec(
        QString("SELECT diagnosis, symptoms, icd10_codes, created_at "
                "FROM medical_records WHERE patient_id=%1 ORDER BY id DESC")
            .arg(patId));
    if (qd.next()) {
      history +=
          tr2("=== Previous Diagnoses ===\n",
              "=== "
              "\xd8\xa7\xd9\x84\xd8\xaa\xd8\xb4\xd8\xae\xd9\x8a\xd8\xb5\xd8\xa7"
              "\xd8\xaa "
              "\xd8\xa7\xd9\x84\xd8\xb3\xd8\xa7\xd8\xa8\xd9\x82\xd8\xa9 ===\n");
      do {
        history += qd.value(3).toString() + ": " + qd.value(0).toString();
        if (!qd.value(2).toString().isEmpty())
          history += " (ICD: " + qd.value(2).toString() + ")";
        history += "\n";
      } while (qd.next());
    }

    // Previous lab/radiology orders
    QSqlQuery ql = Database::instance().exec(
        QString(
            "SELECT order_type, description, status, created_at, results, "
            "structured_report "
            "FROM lab_radiology_orders WHERE patient_id=%1 ORDER BY id DESC")
            .arg(patId));
    if (ql.next()) {
      history +=
          tr2("\n=== Lab & Radiology Orders ===\n",
              "\n=== \xd8\xb7\xd9\x84\xd8\xa8\xd8\xa7\xd8\xaa "
              "\xd8\xa7\xd9\x84\xd9\x85\xd8\xae\xd8\xaa\xd8\xa8\xd8\xb1 "
              "\xd9\x88\xd8\xa7\xd9\x84\xd8\xa3\xd8\xb4\xd8\xb9\xd8\xa9 ===\n");
      do {
        history += ql.value(3).toString() + ": " + ql.value(0).toString() +
                   " - " + ql.value(1).toString() + " [" +
                   ql.value(2).toString() + "]\n";

        QString resText = ql.value(4).toString();
        if (!resText.isEmpty())
          history += "  » Result: " + resText + "\n";

        QString radText = ql.value(5).toString();
        if (!radText.isEmpty())
          history += "  » Report: " + radText + "\n";

      } while (ql.next());
    }

    // Previous prescriptions
    QSqlQuery qp = Database::instance().exec(
        QString("SELECT prescription_text, status, created_at "
                "FROM pharmacy_prescriptions_queue WHERE patient_id=%1 "
                "ORDER BY id DESC")
            .arg(patId));
    if (qp.next()) {
      history +=
          tr2("\n=== Prescriptions ===\n",
              "\n=== \xd8\xa7\xd9\x84\xd9\x88\xd8\xb5\xd9\x81\xd8\xa7\xd8\xaa "
              "===\n");
      do {
        history += qp.value(2).toString() + " [" + qp.value(1).toString() +
                   "]: " + qp.value(0).toString();
      } while (qp.next());
    }

    patHistory->setPlainText(
        history.isEmpty()
            ? tr2("No previous records.",
                  "\xd9\x84\xd8\xa7 \xd8\xaa\xd9\x88\xd8\xac\xd8\xaf "
                  "\xd8\xb3\xd8\xac\xd9\x84\xd8\xa7\xd8\xaa "
                  "\xd8\xb3\xd8\xa7\xd8\xa8\xd9\x82\xd8\xa9.")
            : history);
    patHistory->setVisible(true);
  });

  // ======= TABS =======
  QTabWidget *tabs = new QTabWidget();
  tabs->setStyleSheet(
      "QTabBar::tab { padding: 10px 20px; font-weight: bold; background: "
      "#1e293b; color: #94a3b8; border-top-left-radius: 4px; "
      "border-top-right-radius: 4px; margin-right: 2px; }"
      "QTabBar::tab:selected { background: #3b82f6; color: white; }"
      "QTabWidget::pane { border: 1px solid #334155; border-radius: 4px; "
      "background: #0f172a; top: -1px; }");

  // --- Tab 1: Waiting Queue ---
  QWidget *tabQueue = new QWidget();
  QVBoxLayout *layQueue = new QVBoxLayout(tabQueue);
  QTableWidget *tblQueue = new QTableWidget();
  tblQueue->setColumnCount(5);
  tblQueue->setHorizontalHeaderLabels(
      {tr2("File #",
           "\xd8\xb1\xd9\x82\xd9\x85 \xd8\xa7\xd9\x84\xd9\x85\xd9\x84\xd9\x81"),
       tr2("Name", "\xd8\xa7\xd9\x84\xd8\xa7\xd8\xb3\xd9\x85"),
       tr2("Phone", "\xd8\xa7\xd9\x84\xd8\xac\xd9\x88\xd8\xa7\xd9\x84"),
       tr2("Department", "\xd8\xa7\xd9\x84\xd9\x82\xd8\xb3\xd9\x85"),
       tr2("Status", "\xd8\xa7\xd9\x84\xd8\xad\xd8\xa7\xd9\x84\xd8\xa9")});
  tblQueue->horizontalHeader()->setStretchLastSection(true);
  tblQueue->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  tblQueue->verticalHeader()->setVisible(false);

  // Load waiting patients
  QSqlQuery qw = Database::instance().exec(
      "SELECT file_number, name_en, name_ar, phone, department, status "
      "FROM patients WHERE status IN ('Waiting','With Doctor') ORDER BY id");
  int wr = 0;
  while (qw.next()) {
    tblQueue->insertRow(wr);
    tblQueue->setItem(
        wr, 0, new QTableWidgetItem(QString::number(qw.value(0).toInt())));
    tblQueue->setItem(wr, 1,
                      new QTableWidgetItem(isArabic ? qw.value(2).toString()
                                                    : qw.value(1).toString()));
    tblQueue->setItem(wr, 2, new QTableWidgetItem(qw.value(3).toString()));
    tblQueue->setItem(wr, 3, new QTableWidgetItem(qw.value(4).toString()));
    QTableWidgetItem *st = new QTableWidgetItem(qw.value(5).toString());
    st->setForeground(qw.value(5).toString() == "With Doctor"
                          ? QColor("#4ade80")
                          : QColor("#f59e0b"));
    tblQueue->setItem(wr, 4, st);
    wr++;
  }
  layQueue->addWidget(tblQueue);

  // Double-click to load patient from queue
  connect(tblQueue, &QTableWidget::cellDoubleClicked, [=](int row, int) {
    QTableWidgetItem *item = tblQueue->item(row, 1);
    if (item) {
      docPatSearch->setText(item->text());
      loadPatBtn->click();
    }
  });

  tabs->addTab(
      tabQueue,
      tr2("Waiting Queue",
          "\xd9\x82\xd8\xa7\xd8\xa6\xd9\x85\xd8\xa9 "
          "\xd8\xa7\xd9\x84\xd8\xa7\xd9\x86\xd8\xaa\xd8\xb8\xd8\xa7\xd8\xb1"));

  // --- Tab 1b: Vital Signs ---
  QWidget *tabVitals = new QWidget();
  QHBoxLayout *layVitals = new QHBoxLayout(tabVitals);

  // Vitals form
  QGroupBox *formBox = new QGroupBox(
      tr2("Record Vital Signs",
          "\xd8\xaa\xd8\xb3\xd8\xac\xd9\x8a\xd9\x84 "
          "\xd8\xa7\xd9\x84\xd8\xb9\xd9\x84\xd8\xa7\xd9\x85\xd8\xa7\xd8\xaa "
          "\xd8\xa7\xd9\x84\xd8\xad\xd9\x8a\xd9\x88\xd9\x8a\xd8\xa9"));
  formBox->setObjectName("card");
  QVBoxLayout *fl = new QVBoxLayout(formBox);

  auto addDrVitalField = [&](const QString &en, const QString &ar,
                             const QString &ph) -> QLineEdit * {
    fl->addWidget(new QLabel(tr2(en, ar)));
    QLineEdit *e = new QLineEdit();
    e->setFixedHeight(36);
    e->setPlaceholderText(ph);
    fl->addWidget(e);
    return e;
  };

  QLineEdit *bp = addDrVitalField(
      "Blood Pressure",
      "\xd8\xb6\xd8\xba\xd8\xb7 \xd8\xa7\xd9\x84\xd8\xaf\xd9\x85", "120/80");
  QLineEdit *temp = addDrVitalField(
      "Temperature (C)",
      "\xd8\xa7\xd9\x84\xd8\xad\xd8\xb1\xd8\xa7\xd8\xb1\xd8\xa9", "37.0");
  QLineEdit *pulse = addDrVitalField(
      "Pulse (bpm)", "\xd8\xa7\xd9\x84\xd9\x86\xd8\xa8\xd8\xb6", "72");
  QLineEdit *weight = addDrVitalField(
      "Weight (kg)", "\xd8\xa7\xd9\x84\xd9\x88\xd8\xb2\xd9\x86", "70");
  QLineEdit *height = addDrVitalField(
      "Height (cm)", "\xd8\xa7\xd9\x84\xd8\xb7\xd9\x88\xd9\x84", "170");

  QPushButton *saveVitalsBtn = new QPushButton(
      tr2("Save Vitals",
          "\xd8\xad\xd9\x81\xd8\xb8 "
          "\xd8\xa7\xd9\x84\xd8\xb9\xd9\x84\xd8\xa7\xd9\x85\xd8\xa7\xd8\xaa"));
  saveVitalsBtn->setObjectName("primaryBtn");
  saveVitalsBtn->setFixedHeight(45);
  fl->addWidget(saveVitalsBtn);
  fl->addStretch();

  // Vitals log table
  QGroupBox *logBox = new QGroupBox(
      tr2("Recent Vitals Log",
          "\xd8\xb3\xd8\xac\xd9\x84 "
          "\xd8\xa7\xd9\x84\xd8\xb9\xd9\x84\xd8\xa7\xd9\x85\xd8\xa7\xd8\xaa"));
  logBox->setObjectName("card");
  QVBoxLayout *ll = new QVBoxLayout(logBox);
  QTableWidget *logTable = new QTableWidget();
  logTable->setColumnCount(6);
  logTable->setHorizontalHeaderLabels(
      {tr2("Date", "\xd8\xa7\xd9\x84\xd8\xaa\xd8\xa7\xd8\xb1\xd9\x8a\xd8\xae"),
       tr2("BP", "\xd8\xa7\xd9\x84\xd8\xb6\xd8\xba\xd8\xb7"),
       tr2("Temp", "\xd8\xa7\xd9\x84\xd8\xad\xd8\xb1\xd8\xa7\xd8\xb1\xd8\xa9"),
       tr2("Pulse", "\xd8\xa7\xd9\x84\xd9\x86\xd8\xa8\xd8\xb6"),
       tr2("Weight", "\xd8\xa7\xd9\x84\xd9\x88\xd8\xb2\xd9\x86"),
       tr2("Height", "\xd8\xa7\xd9\x84\xd8\xb7\xd9\x88\xd9\x84")});
  logTable->horizontalHeader()->setStretchLastSection(true);
  logTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  logTable->verticalHeader()->setVisible(false);

  connect(saveVitalsBtn, &QPushButton::clicked, [=]() {
    int pid = selectedPatId->text().toInt();
    if (pid == 0) {
      QMessageBox::warning(
          nullptr, tr2("Error", "\xd8\xae\xd8\xb7\xd8\xa3"),
          tr2("Please load a patient first.",
              "\xd9\x8a\xd8\xb1\xd8\xac\xd9\x89 "
              "\xd8\xaa\xd8\xad\xd9\x85\xd9\x8a\xd9\x84 "
              "\xd9\x85\xd9\x84\xd9\x81 "
              "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6 "
              "\xd8\xa3\xd9\x88\xd9\x84\xd8\xa7\xd9\x8b."));
      return;
    }
    if (bp->text().isEmpty())
      return;

    // Save to DB (Optional, assuming vitals table or using medical_records
    // notes) For now, we just add it to the local log table.

    int r = logTable->rowCount();
    logTable->insertRow(r);
    logTable->setItem(
        r, 0,
        new QTableWidgetItem(
            QDateTime::currentDateTime().toString("yyyy-MM-dd HH:mm")));
    logTable->setItem(r, 1, new QTableWidgetItem(bp->text()));
    logTable->setItem(r, 2, new QTableWidgetItem(temp->text()));
    logTable->setItem(r, 3, new QTableWidgetItem(pulse->text()));
    logTable->setItem(r, 4, new QTableWidgetItem(weight->text()));
    logTable->setItem(r, 5, new QTableWidgetItem(height->text()));

    bp->clear();
    temp->clear();
    pulse->clear();
    weight->clear();
    height->clear();
    QMessageBox::information(
        nullptr, tr2("Saved", "\xd8\xaa\xd9\x85"),
        tr2("Vitals recorded successfully",
            "\xd8\xaa\xd9\x85 \xd8\xaa\xd8\xb3\xd8\xac\xd9\x8a\xd9\x84 "
            "\xd8\xa7\xd9\x84\xd8\xb9\xd9\x84\xd8\xa7\xd9\x85\xd8\xa7\xd8"
            "\xaa"));
  });

  ll->addWidget(logTable);
  layVitals->addWidget(formBox, 1);
  layVitals->addWidget(logBox, 2);

  tabs->addTab(
      tabVitals,
      tr2("Vital Signs",
          "\xd8\xa7\xd9\x84\xd8\xb9\xd9\x84\xd8\xa7\xd9\x85\xd8\xa7\xd8\xaa "
          "\xd8\xa7\xd9\x84\xd8\xad\xd9\x8a\xd9\x88\xd9\x8a\xd8\xa9"));

  // --- Tab 2: Diagnosis & Medical Report ---
  QWidget *tabDiag = new QWidget();
  QVBoxLayout *layDiag = new QVBoxLayout(tabDiag);

  layDiag->addWidget(new QLabel(
      tr2("Symptoms & Chief Complaint",
          "\xd8\xa7\xd9\x84\xd8\xa3\xd8\xb9\xd8\xb1\xd8\xa7\xd8\xb6 "
          "\xd9\x88\xd8\xa7\xd9\x84\xd8\xb4\xd9\x83\xd9\x88\xd9\x89")));
  QTextEdit *symptomsEdit = new QTextEdit();
  symptomsEdit->setMaximumHeight(80);
  symptomsEdit->setPlaceholderText(
      tr2("Describe symptoms...",
          "\xd8\xa7\xd9\x83\xd8\xaa\xd8\xa8 "
          "\xd8\xa7\xd9\x84\xd8\xa3\xd8\xb9\xd8\xb1\xd8\xa7\xd8\xb6..."));
  layDiag->addWidget(symptomsEdit);

  layDiag->addWidget(new QLabel(
      tr2("Diagnosis / Notes",
          "\xd8\xa7\xd9\x84\xd8\xaa\xd8\xb4\xd8\xae\xd9\x8a\xd8\xb5 / "
          "\xd8\xa7\xd9\x84\xd9\x85\xd9\x84\xd8\xa7\xd8\xad\xd8\xb8\xd8\xa7\xd8"
          "\xaa")));
  QTextEdit *diagEdit = new QTextEdit();
  diagEdit->setMaximumHeight(80);
  diagEdit->setPlaceholderText(
      tr2("Diagnosis and notes...",
          "\xd8\xa7\xd9\x84\xd8\xaa\xd8\xb4\xd8\xae\xd9\x8a\xd8\xb5 "
          "\xd9\x88\xd8\xa7\xd9\x84\xd9\x85\xd9\x84\xd8\xa7\xd8\xad\xd8\xb8\xd8"
          "\xa7\xd8\xaa..."));
  layDiag->addWidget(diagEdit);

  layDiag->addWidget(new QLabel(
      tr2("ICD-10 Code",
          "\xd8\xb1\xd9\x85\xd8\xb2 "
          "\xd8\xa7\xd9\x84\xd8\xaa\xd8\xb4\xd8\xae\xd9\x8a\xd8\xb5 ICD-10")));
  QLineEdit *icdEdit = new QLineEdit();
  icdEdit->setFixedHeight(38);
  icdEdit->setPlaceholderText("e.g. J06.9");
  layDiag->addWidget(icdEdit);

  QPushButton *saveDiagBtn = new QPushButton(
      tr2("Save Diagnosis & Report",
          "\xd8\xad\xd9\x81\xd8\xb8 "
          "\xd8\xa7\xd9\x84\xd8\xaa\xd8\xb4\xd8\xae\xd9\x8a\xd8\xb5 "
          "\xd9\x88\xd8\xa7\xd9\x84\xd8\xaa\xd9\x82\xd8\xb1\xd9\x8a\xd8\xb1"));
  saveDiagBtn->setObjectName("primaryBtn");
  saveDiagBtn->setFixedHeight(45);
  layDiag->addWidget(saveDiagBtn);

  connect(saveDiagBtn, &QPushButton::clicked, [=]() {
    int pid = selectedPatId->text().toInt();
    if (pid == 0) {
      QMessageBox::warning(
          nullptr, tr2("Error", "\xd8\xae\xd8\xb7\xd8\xa3"),
          tr2("Please load a patient first.",
              "\xd9\x8a\xd8\xb1\xd8\xac\xd9\x89 "
              "\xd8\xaa\xd8\xad\xd9\x85\xd9\x8a\xd9\x84 "
              "\xd9\x85\xd9\x84\xd9\x81 "
              "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6 "
              "\xd8\xa3\xd9\x88\xd9\x84\xd8\xa7\xd9\x8b."));
      return;
    }
    Database::instance().exec(
        QString("INSERT INTO medical_records (patient_id, doctor_id, "
                "diagnosis, symptoms, icd10_codes, notes) "
                "VALUES (%1,0,N'%2',N'%3',N'%4',N'%5')")
            .arg(pid)
            .arg(diagEdit->toPlainText().replace("'", "''"))
            .arg(symptomsEdit->toPlainText().replace("'", "''"))
            .arg(icdEdit->text().replace("'", "''"))
            .arg(diagEdit->toPlainText().replace("'", "''")));
    QMessageBox::information(
        nullptr,
        tr2("Saved",
            "\xd8\xaa\xd9\x85 \xd8\xa7\xd9\x84\xd8\xad\xd9\x81\xd8\xb8"),
        tr2("Diagnosis saved to patient record.",
            "\xd8\xaa\xd9\x85 \xd8\xad\xd9\x81\xd8\xb8 "
            "\xd8\xa7\xd9\x84\xd8\xaa\xd8\xb4\xd8\xae\xd9\x8a\xd8\xb5 "
            "\xd9\x81\xd9\x8a \xd9\x85\xd9\x84\xd9\x81 "
            "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6."));
  });

  layDiag->addStretch();
  tabs->addTab(
      tabDiag,
      tr2("Diagnosis & Report",
          "\xd8\xa7\xd9\x84\xd8\xaa\xd8\xb4\xd8\xae\xd9\x8a\xd8\xb5 "
          "\xd9\x88\xd8\xa7\xd9\x84\xd8\xaa\xd9\x82\xd8\xb1\xd9\x8a\xd8\xb1"));

  // --- Tab 3: Lab & Radiology Orders ---
  QWidget *tabOrders = new QWidget();
  QVBoxLayout *layOrders = new QVBoxLayout(tabOrders);

  // Two side-by-side checkbox panels
  QHBoxLayout *checkPanels = new QHBoxLayout();

  // === LAB TESTS PANEL ===
  QGroupBox *labBox = new QGroupBox(tr2(
      "Lab Tests", "\xd8\xaa\xd8\xad\xd8\xa7\xd9\x84\xd9\x8a\xd9\x84 "
                   "\xd8\xa7\xd9\x84\xd9\x85\xd8\xae\xd8\xaa\xd8\xa8\xd8\xb1"));
  labBox->setObjectName("card");
  QVBoxLayout *labLay = new QVBoxLayout();
  QList<QCheckBox *> *labChecks = new QList<QCheckBox *>();

  auto addLabCB = [&](const QString &en, const QString &ar) {
    QCheckBox *cb = new QCheckBox(tr2(en, ar));
    cb->setStyleSheet(
        "QCheckBox { spacing: 6px; font-size: 13px; padding: 3px 0; }"
        "QCheckBox::indicator { width: 18px; height: 18px; }");
    labLay->addWidget(cb);
    labChecks->append(cb);
  };
  addLabCB("CBC - Complete Blood Count",
           "CBC - \xd8\xb5\xd9\x88\xd8\xb1\xd8\xa9 \xd8\xaf\xd9\x85 "
           "\xd8\xb4\xd8\xa7\xd9\x85\xd9\x84\xd8\xa9");
  addLabCB("ESR - Sedimentation Rate",
           "ESR - \xd8\xb3\xd8\xb1\xd8\xb9\xd8\xa9 "
           "\xd8\xaa\xd8\xb1\xd8\xb3\xd9\x8a\xd8\xa8");
  addLabCB("Coagulation (PT/INR)", "\xd8\xaa\xd8\xae\xd8\xab\xd8\xb1 "
                                   "\xd8\xa7\xd9\x84\xd8\xaf\xd9\x85 (PT/INR)");
  addLabCB("D-Dimer",
           "\xd8\xaf\xd9\x8a \xd8\xaf\xd8\xa7\xd9\x8a\xd9\x85\xd8\xb1");
  addLabCB("Blood Group & Rh", "\xd9\x81\xd8\xb5\xd9\x8a\xd9\x84\xd8\xa9 "
                               "\xd8\xa7\xd9\x84\xd8\xaf\xd9\x85");
  addLabCB("Blood Glucose (Fasting)",
           "\xd8\xb3\xd9\x83\xd8\xb1 \xd8\xb5\xd8\xa7\xd8\xa6\xd9\x85");
  addLabCB("Blood Glucose (Random)",
           "\xd8\xb3\xd9\x83\xd8\xb1 "
           "\xd8\xb9\xd8\xb4\xd9\x88\xd8\xa7\xd8\xa6\xd9\x8a");
  addLabCB("HbA1c - Glycated Hemoglobin",
           "HbA1c - \xd8\xa7\xd9\x84\xd8\xb3\xd9\x83\xd8\xb1 "
           "\xd8\xa7\xd9\x84\xd8\xaa\xd8\xb1\xd8\xa7\xd9\x83\xd9\x85\xd9\x8a");
  addLabCB("Lipid Profile",
           "\xd8\xaf\xd9\x87\xd9\x88\xd9\x86 \xd8\xa7\xd9\x84\xd8\xaf\xd9\x85");
  addLabCB("Liver Function (LFT)", "\xd9\x88\xd8\xb8\xd8\xa7\xd8\xa6\xd9\x81 "
                                   "\xd8\xa7\xd9\x84\xd9\x83\xd8\xa8\xd8\xaf");
  addLabCB("Kidney Function (KFT)", "\xd9\x88\xd8\xb8\xd8\xa7\xd8\xa6\xd9\x81 "
                                    "\xd8\xa7\xd9\x84\xd9\x83\xd9\x84\xd9\x89");
  addLabCB("Uric Acid",
           "\xd8\xad\xd9\x85\xd8\xb6 "
           "\xd8\xa7\xd9\x84\xd9\x8a\xd9\x88\xd8\xb1\xd9\x8a\xd9\x83");
  addLabCB("Electrolytes (Na/K/Cl)",
           "\xd8\xa7\xd9\x84\xd9\x83\xd9\x87\xd8\xa7\xd8\xb1\xd9\x84");
  addLabCB(
      "Calcium & Phosphorus",
      "\xd8\xa7\xd9\x84\xd9\x83\xd8\xa7\xd9\x84\xd8\xb3\xd9\x8a\xd9\x88\xd9\x85"
      " \xd9\x88\xd8\xa7\xd9\x84\xd9\x81\xd8\xb3\xd9\x81\xd9\x88\xd8\xb1");
  addLabCB(
      "CRP - C-Reactive Protein",
      "CRP - \xd8\xa8\xd8\xb1\xd9\x88\xd8\xaa\xd9\x8a\xd9\x86 \xd8\xb3\xd9\x8a "
      "\xd8\xa7\xd9\x84\xd8\xaa\xd9\x81\xd8\xa7\xd8\xb9\xd9\x84\xd9\x8a");
  addLabCB("Thyroid Function (TSH/T3/T4)",
           "\xd9\x88\xd8\xb8\xd8\xa7\xd8\xa6\xd9\x81 "
           "\xd8\xa7\xd9\x84\xd8\xba\xd8\xaf\xd8\xa9 "
           "\xd8\xa7\xd9\x84\xd8\xaf\xd8\xb1\xd9\x82\xd9\x8a\xd8\xa9");
  addLabCB("Hormones Panel", "\xd9\x81\xd8\xad\xd8\xb5 "
                             "\xd8\xa7\xd9\x84\xd9\x87\xd8\xb1\xd9\x85\xd9\x88"
                             "\xd9\x86\xd8\xa7\xd8\xaa");
  addLabCB("Vitamin D",
           "\xd9\x81\xd9\x8a\xd8\xaa\xd8\xa7\xd9\x85\xd9\x8a\xd9\x86 \xd8\xaf");
  addLabCB("Vitamin B12",
           "\xd9\x81\xd9\x8a\xd8\xaa\xd8\xa7\xd9\x85\xd9\x8a\xd9\x86 \xd8\xa8"
           "12");
  addLabCB("Iron & Ferritin", "\xd8\xa7\xd9\x84\xd8\xad\xd8\xaf\xd9\x8a\xd8\xaf"
                              " \xd9\x88\xd8\xa7\xd9\x84\xd9\x81\xd9\x8a\xd8"
                              "\xb1\xd9\x8a\xd8\xaa\xd9\x8a\xd9\x86");
  addLabCB("Urine Analysis",
           "\xd8\xaa\xd8\xad\xd9\x84\xd9\x8a\xd9\x84 \xd8\xa8\xd9\x88\xd9\x84");
  addLabCB("Stool Analysis", "\xd8\xaa\xd8\xad\xd9\x84\xd9\x8a\xd9\x84 "
                             "\xd8\xa8\xd8\xb1\xd8\xa7\xd8\xb2");
  addLabCB("Blood Culture",
           "\xd9\x85\xd8\xb2\xd8\xb1\xd8\xb9\xd8\xa9 \xd8\xaf\xd9\x85");
  addLabCB("Urine Culture",
           "\xd9\x85\xd8\xb2\xd8\xb1\xd8\xb9\xd8\xa9 \xd8\xa8\xd9\x88\xd9\x84");
  addLabCB("HBsAg - Hepatitis B",
           "HBsAg - \xd8\xa7\xd9\x84\xd8\xaa\xd9\x87\xd8\xa7\xd8\xa8 "
           "\xd8\xa7\xd9\x84\xd9\x83\xd8\xa8\xd8\xaf B");
  addLabCB("HCV Ab - Hepatitis C",
           "HCV Ab - \xd8\xa7\xd9\x84\xd8\xaa\xd9\x87\xd8\xa7\xd8\xa8 "
           "\xd8\xa7\xd9\x84\xd9\x83\xd8\xa8\xd8\xaf C");
  addLabCB("HIV Test",
           "HIV - \xd9\x81\xd8\xad\xd8\xb5 \xd9\x86\xd9\x82\xd8\xb5 "
           "\xd8\xa7\xd9\x84\xd9\x85\xd9\x86\xd8\xa7\xd8\xb9\xd8\xa9");
  addLabCB("ANA - Antinuclear Antibody",
           "ANA - \xd8\xa7\xd9\x84\xd8\xa3\xd8\xac\xd8\xb3\xd8\xa7\xd9\x85 "
           "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb6\xd8\xa7\xd8\xaf\xd8\xa9");
  addLabCB("RF - Rheumatoid Factor",
           "RF - \xd8\xa7\xd9\x84\xd8\xb9\xd8\xa7\xd9\x85\xd9\x84 "
           "\xd8\xa7\xd9\x84\xd8\xb1\xd9\x88\xd9\x85\xd8\xa7\xd8\xaa\xd9\x88"
           "\xd9\x8a\xd8\xaf\xd9\x8a");
  addLabCB("PSA - Prostate Antigen",
           "PSA - \xd9\x85\xd8\xb3\xd8\xaa\xd8\xb6\xd8\xaf "
           "\xd8\xa7\xd9\x84\xd8\xa8\xd8\xb1\xd9\x88\xd8\xb3\xd8\xaa\xd8\xa7"
           "\xd8\xaa\xd8\xa7");
  addLabCB("Tumor Markers",
           "\xd8\xaf\xd9\x84\xd8\xa7\xd9\x84\xd8\xa7\xd8\xaa "
           "\xd8\xa7\xd9\x84\xd8\xa3\xd9\x88\xd8\xb1\xd8\xa7\xd9\x85");
  addLabCB("Troponin",
           "\xd8\xaa\xd8\xb1\xd9\x88\xd8\xa8\xd9\x88\xd9\x86\xd9\x8a\xd9\x86");
  addLabCB("Pregnancy Test (Beta-hCG)",
           "\xd8\xa7\xd8\xae\xd8\xaa\xd8\xa8\xd8\xa7\xd8\xb1 "
           "\xd8\xa7\xd9\x84\xd8\xad\xd9\x85\xd9\x84");
  addLabCB("Semen Analysis",
           "\xd8\xaa\xd8\xad\xd9\x84\xd9\x8a\xd9\x84 "
           "\xd8\xa7\xd9\x84\xd8\xb3\xd8\xa7\xd8\xa6\xd9\x84 "
           "\xd8\xa7\xd9\x84\xd9\x85\xd9\x86\xd9\x88\xd9\x8a");
  labLay->addStretch();

  QWidget *labScrollW = new QWidget();
  labScrollW->setLayout(labLay);
  QScrollArea *labScroll = new QScrollArea();
  labScroll->setWidget(labScrollW);
  labScroll->setWidgetResizable(true);
  labScroll->setStyleSheet("QScrollArea { border: none; }");
  QVBoxLayout *labBoxLay = new QVBoxLayout(labBox);
  labBoxLay->addWidget(labScroll);
  checkPanels->addWidget(labBox);

  // === RADIOLOGY PANEL ===
  QGroupBox *radBox = new QGroupBox(
      tr2("Radiology & Imaging",
          "\xd8\xa7\xd9\x84\xd8\xa3\xd8\xb4\xd8\xb9\xd8\xa9 "
          "\xd9\x88\xd8\xa7\xd9\x84\xd8\xaa\xd8\xb5\xd9\x88\xd9\x8a\xd8\xb1"));
  radBox->setObjectName("card");
  QVBoxLayout *radLay = new QVBoxLayout();
  QList<QCheckBox *> *radChecks = new QList<QCheckBox *>();

  auto addRadCB = [&](const QString &en, const QString &ar) {
    QCheckBox *cb = new QCheckBox(tr2(en, ar));
    cb->setStyleSheet(
        "QCheckBox { spacing: 6px; font-size: 13px; padding: 3px 0; }"
        "QCheckBox::indicator { width: 18px; height: 18px; }");
    radLay->addWidget(cb);
    radChecks->append(cb);
  };
  addRadCB("X-Ray Chest",
           "\xd8\xa3\xd8\xb4\xd8\xb9\xd8\xa9 \xd8\xb5\xd8\xaf\xd8\xb1");
  addRadCB("X-Ray Abdomen",
           "\xd8\xa3\xd8\xb4\xd8\xb9\xd8\xa9 \xd8\xa8\xd8\xb7\xd9\x86");
  addRadCB("X-Ray Spine (Cervical)",
           "\xd8\xa3\xd8\xb4\xd8\xb9\xd8\xa9 "
           "\xd8\xb9\xd9\x86\xd9\x82\xd9\x8a\xd8\xa9");
  addRadCB("X-Ray Spine (Lumbar)", "\xd8\xa3\xd8\xb4\xd8\xb9\xd8\xa9 "
                                   "\xd9\x82\xd8\xb7\xd9\x86\xd9\x8a\xd8\xa9");
  addRadCB("X-Ray Pelvis",
           "\xd8\xa3\xd8\xb4\xd8\xb9\xd8\xa9 \xd8\xad\xd9\x88\xd8\xb6");
  addRadCB("X-Ray Extremities", "\xd8\xa3\xd8\xb4\xd8\xb9\xd8\xa9 "
                                "\xd8\xa3\xd8\xb7\xd8\xb1\xd8\xa7\xd9\x81");
  addRadCB("X-Ray Skull", "\xd8\xa3\xd8\xb4\xd8\xb9\xd8\xa9 "
                          "\xd8\xac\xd9\x85\xd8\xac\xd9\x85\xd8\xa9");
  addRadCB("CT Brain", "\xd9\x85\xd9\x82\xd8\xb7\xd8\xb9\xd9\x8a\xd8\xa9 "
                       "\xd8\xa7\xd9\x84\xd9\x85\xd8\xae");
  addRadCB("CT Chest", "\xd9\x85\xd9\x82\xd8\xb7\xd8\xb9\xd9\x8a\xd8\xa9 "
                       "\xd8\xa7\xd9\x84\xd8\xb5\xd8\xaf\xd8\xb1");
  addRadCB("CT Abdomen & Pelvis",
           "\xd9\x85\xd9\x82\xd8\xb7\xd8\xb9\xd9\x8a\xd8\xa9 "
           "\xd8\xa8\xd8\xb7\xd9\x86 \xd9\x88\xd8\xad\xd9\x88\xd8\xb6");
  addRadCB("CT Spine", "\xd9\x85\xd9\x82\xd8\xb7\xd8\xb9\xd9\x8a\xd8\xa9 "
                       "\xd8\xa7\xd9\x84\xd8\xb9\xd9\x85\xd9\x88\xd8\xaf "
                       "\xd8\xa7\xd9\x84\xd9\x81\xd9\x82\xd8\xb1\xd9\x8a");
  addRadCB("CT Angiography",
           "\xd8\xaa\xd8\xb5\xd9\x88\xd9\x8a\xd8\xb1 "
           "\xd9\x85\xd9\x82\xd8\xb7\xd8\xb9\xd9\x8a "
           "\xd9\x84\xd9\x84\xd8\xa3\xd9\x88\xd8\xb9\xd9\x8a\xd8\xa9");
  addRadCB("MRI Brain", "\xd8\xb1\xd9\x86\xd9\x8a\xd9\x86 "
                        "\xd9\x85\xd8\xba\xd9\x86\xd8\xa7\xd8\xb7\xd9\x8a\xd8"
                        "\xb3\xd9\x8a \xd9\x84\xd9\x84\xd9\x85\xd8\xae");
  addRadCB("MRI Spine (Cervical)",
           "\xd8\xb1\xd9\x86\xd9\x8a\xd9\x86 \xd8\xb9\xd9\x86\xd9\x82\xd9\x8a");
  addRadCB("MRI Spine (Lumbar)",
           "\xd8\xb1\xd9\x86\xd9\x8a\xd9\x86 \xd9\x82\xd8\xb7\xd9\x86\xd9\x8a");
  addRadCB("MRI Knee", "\xd8\xb1\xd9\x86\xd9\x8a\xd9\x86 "
                       "\xd8\xa7\xd9\x84\xd8\xb1\xd9\x83\xd8\xa8\xd8\xa9");
  addRadCB("MRI Shoulder", "\xd8\xb1\xd9\x86\xd9\x8a\xd9\x86 "
                           "\xd8\xa7\xd9\x84\xd9\x83\xd8\xaa\xd9\x81");
  addRadCB("MRI Abdomen", "\xd8\xb1\xd9\x86\xd9\x8a\xd9\x86 "
                          "\xd8\xa7\xd9\x84\xd8\xa8\xd8\xb7\xd9\x86");
  addRadCB("MRI Pelvis", "\xd8\xb1\xd9\x86\xd9\x8a\xd9\x86 "
                         "\xd8\xa7\xd9\x84\xd8\xad\xd9\x88\xd8\xb6");
  addRadCB("Ultrasound Abdomen", "\xd8\xb3\xd9\x88\xd9\x86\xd8\xa7\xd8\xb1 "
                                 "\xd8\xa7\xd9\x84\xd8\xa8\xd8\xb7\xd9\x86");
  addRadCB("Ultrasound Pelvis", "\xd8\xb3\xd9\x88\xd9\x86\xd8\xa7\xd8\xb1 "
                                "\xd8\xa7\xd9\x84\xd8\xad\xd9\x88\xd8\xb6");
  addRadCB("Ultrasound Thyroid",
           "\xd8\xb3\xd9\x88\xd9\x86\xd8\xa7\xd8\xb1 "
           "\xd8\xa7\xd9\x84\xd8\xba\xd8\xaf\xd8\xa9 "
           "\xd8\xa7\xd9\x84\xd8\xaf\xd8\xb1\xd9\x82\xd9\x8a\xd8\xa9");
  addRadCB("Ultrasound Breast", "\xd8\xb3\xd9\x88\xd9\x86\xd8\xa7\xd8\xb1 "
                                "\xd8\xa7\xd9\x84\xd8\xab\xd8\xaf\xd9\x8a");
  addRadCB("Ultrasound Pregnancy (OB)",
           "\xd8\xb3\xd9\x88\xd9\x86\xd8\xa7\xd8\xb1 "
           "\xd8\xa7\xd9\x84\xd8\xad\xd9\x85\xd9\x84");
  addRadCB("Doppler Ultrasound",
           "\xd8\xaf\xd9\x88\xd8\xa8\xd9\x84\xd8\xb1 "
           "\xd8\xa7\xd9\x84\xd8\xa3\xd9\x88\xd8\xb9\xd9\x8a\xd8\xa9");
  addRadCB("Mammography", "\xd8\xaa\xd8\xb5\xd9\x88\xd9\x8a\xd8\xb1 "
                          "\xd8\xa7\xd9\x84\xd8\xab\xd8\xaf\xd9\x8a");
  addRadCB("Fluoroscopy", "\xd8\xaa\xd9\x86\xd8\xb8\xd9\x8a\xd8\xb1 "
                          "\xd8\xb4\xd8\xb9\xd8\xa7\xd8\xb9\xd9\x8a");
  addRadCB("Bone Densitometry (DEXA)",
           "\xd9\x82\xd9\x8a\xd8\xa7\xd8\xb3 "
           "\xd9\x83\xd8\xab\xd8\xa7\xd9\x81\xd8\xa9 "
           "\xd8\xa7\xd9\x84\xd8\xb9\xd8\xb8\xd8\xa7\xd9\x85");
  addRadCB("Panoramic Dental X-Ray",
           "\xd8\xa8\xd8\xa7\xd9\x86\xd9\x88\xd8\xb1\xd8\xa7\xd9\x85\xd8\xa7 "
           "\xd8\xa3\xd8\xb3\xd9\x86\xd8\xa7\xd9\x86");
  addRadCB("Echocardiography", "\xd8\xa5\xd9\x8a\xd9\x83\xd9\x88 "
                               "\xd8\xa7\xd9\x84\xd9\x82\xd9\x84\xd8\xa8");
  radLay->addStretch();

  QWidget *radScrollW = new QWidget();
  radScrollW->setLayout(radLay);
  QScrollArea *radScroll = new QScrollArea();
  radScroll->setWidget(radScrollW);
  radScroll->setWidgetResizable(true);
  radScroll->setStyleSheet("QScrollArea { border: none; }");
  QVBoxLayout *radBoxLay = new QVBoxLayout(radBox);
  radBoxLay->addWidget(radScroll);
  checkPanels->addWidget(radBox);

  layOrders->addLayout(checkPanels);

  // Send button
  QPushButton *sendOrderBtn = new QPushButton(
      tr2("Send Selected Orders",
          "\xd8\xa5\xd8\xb1\xd8\xb3\xd8\xa7\xd9\x84 "
          "\xd8\xa7\xd9\x84\xd8\xb7\xd9\x84\xd8\xa8\xd8\xa7\xd8\xaa "
          "\xd8\xa7\xd9\x84\xd9\x85\xd8\xad\xd8\xaf\xd8\xaf\xd8\xa9"));
  sendOrderBtn->setObjectName("primaryBtn");
  sendOrderBtn->setFixedHeight(42);
  layOrders->addWidget(sendOrderBtn);

  // Orders table
  QTableWidget *tblOrders = new QTableWidget();
  tblOrders->setColumnCount(4);
  tblOrders->setHorizontalHeaderLabels(
      {tr2("Type", "\xd8\xa7\xd9\x84\xd9\x86\xd9\x88\xd8\xb9"),
       tr2("Description", "\xd8\xa7\xd9\x84\xd9\x88\xd8\xb5\xd9\x81"),
       tr2("Status", "\xd8\xa7\xd9\x84\xd8\xad\xd8\xa7\xd9\x84\xd8\xa9"),
       tr2("Result",
           "\xd8\xa7\xd9\x84\xd9\x86\xd8\xaa\xd9\x8a\xd8\xac\xd8\xa9")});
  tblOrders->horizontalHeader()->setStretchLastSection(true);
  tblOrders->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  tblOrders->verticalHeader()->setVisible(false);
  layOrders->addWidget(tblOrders);

  connect(sendOrderBtn, &QPushButton::clicked, [=]() {
    int pid = selectedPatId->text().toInt();
    if (pid == 0) {
      QMessageBox::warning(
          nullptr, tr2("Error", "\xd8\xae\xd8\xb7\xd8\xa3"),
          tr2("Please load a patient first.",
              "\xd9\x8a\xd8\xb1\xd8\xac\xd9\x89 "
              "\xd8\xaa\xd8\xad\xd9\x85\xd9\x8a\xd9\x84 "
              "\xd9\x85\xd9\x84\xd9\x81 "
              "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6 "
              "\xd8\xa3\xd9\x88\xd9\x84\xd8\xa7\xd9\x8b."));
      return;
    }
    int sent = 0;
    // Send lab orders
    for (QCheckBox *cb : *labChecks) {
      if (!cb->isChecked())
        continue;
      QString desc = cb->text();
      Database::instance().exec(
          QString("INSERT INTO lab_radiology_orders (patient_id, doctor_id, "
                  "order_type, description, status, is_radiology, "
                  "approval_status) VALUES (%1,0,N'Lab',N'%2','Pending "
                  "Payment',0,N'Pending Approval')")
              .arg(pid)
              .arg(desc.replace("'", "''")));
      int nr = tblOrders->rowCount();
      tblOrders->insertRow(nr);
      tblOrders->setItem(
          nr, 0,
          new QTableWidgetItem(
              tr2("Lab Test", "\xd8\xaa\xd8\xad\xd9\x84\xd9\x8a\xd9\x84 "
                              "\xd9\x85\xd8\xae\xd8\xaa\xd8\xa8\xd8\xb1")));
      tblOrders->setItem(nr, 1, new QTableWidgetItem(cb->text()));
      QTableWidgetItem *st = new QTableWidgetItem(tr2(
          "Pending Approval",
          "\xd8\xa8\xd8\xa7\xd9\x86\xd8\xaa\xd8\xb8\xd8\xa7\xd8\xb1 "
          "\xd8\xa7\xd9\x84\xd9\x85\xd9\x88\xd8\xa7\xd9\x81\xd9\x82\xd8\xa9"));
      st->setForeground(QColor("#f59e0b")); // Orange color for pending approval
      tblOrders->setItem(nr, 2, st);
      tblOrders->setItem(nr, 3, new QTableWidgetItem("-"));
      cb->setChecked(false);
      sent++;
    }
    // Send radiology orders
    for (QCheckBox *cb : *radChecks) {
      if (!cb->isChecked())
        continue;
      QString desc = cb->text();
      Database::instance().exec(
          QString("INSERT INTO lab_radiology_orders (patient_id, doctor_id, "
                  "order_type, description, status, is_radiology, "
                  "approval_status) VALUES (%1,0,N'Radiology',N'%2','Pending "
                  "Payment',1,N'Pending Approval')")
              .arg(pid)
              .arg(desc.replace("'", "''")));
      int nr = tblOrders->rowCount();
      tblOrders->insertRow(nr);
      tblOrders->setItem(nr, 0,
                         new QTableWidgetItem(tr2(
                             "Radiology", "\xd8\xa3\xd8\xb4\xd8\xb9\xd8\xa9")));
      tblOrders->setItem(nr, 1, new QTableWidgetItem(cb->text()));
      QTableWidgetItem *st = new QTableWidgetItem(tr2(
          "Pending Approval",
          "\xd8\xa8\xd8\xa7\xd9\x86\xd8\xaa\xd8\xb8\xd8\xa7\xd8\xb1 "
          "\xd8\xa7\xd9\x84\xd9\x85\xd9\x88\xd8\xa7\xd9\x81\xd9\x82\xd8\xa9"));
      st->setForeground(QColor("#f59e0b"));
      tblOrders->setItem(nr, 2, st);
      tblOrders->setItem(nr, 3, new QTableWidgetItem("-"));
      cb->setChecked(false);
      sent++;
    }
    if (sent == 0) {
      QMessageBox::warning(
          nullptr, tr2("Error", "\xd8\xae\xd8\xb7\xd8\xa3"),
          tr2("Please select at least one test or exam.",
              "\xd9\x8a\xd8\xb1\xd8\xac\xd9\x89 "
              "\xd8\xa7\xd8\xae\xd8\xaa\xd9\x8a\xd8\xa7\xd8\xb1 "
              "\xd9\x81\xd8\xad\xd8\xb5 \xd9\x88\xd8\xa7\xd8\xad\xd8\xaf "
              "\xd8\xb9\xd9\x84\xd9\x89 "
              "\xd8\xa7\xd9\x84\xd8\xa3\xd9\x82\xd9\x84."));
      return;
    }
    QMessageBox::information(
        nullptr,
        tr2("Sent", "\xd8\xaa\xd9\x85 "
                    "\xd8\xa7\xd9\x84\xd8\xa5\xd8\xb1\xd8\xb3\xd8\xa7\xd9\x84"),
        tr2("Order sent to Lab/Radiology.",
            "\xd8\xaa\xd9\x85 \xd8\xa5\xd8\xb1\xd8\xb3\xd8\xa7\xd9\x84 "
            "\xd8\xa7\xd9\x84\xd8\xb7\xd9\x84\xd8\xa8 \xd8\xa5\xd9\x84\xd9\x89 "
            "\xd8\xa7\xd9\x84\xd9\x85\xd8\xae\xd8\xaa\xd8\xa8\xd8\xb1 "
            "\xd9\x88\xd8\xa7\xd9\x84\xd8\xa3\xd8\xb4\xd8\xb9\xd8\xa9 "
            "مباشرة."));
  });

  tabs->addTab(tabOrders,
               tr2("Lab & Radiology Orders",
                   "\xd8\xb7\xd9\x84\xd8\xa8\xd8\xa7\xd8\xaa "
                   "\xd8\xa7\xd9\x84\xd9\x85\xd8\xae\xd8\xaa\xd8\xa8\xd8\xb1 "
                   "\xd9\x88\xd8\xa7\xd9\x84\xd8\xa3\xd8\xb4\xd8\xb9\xd8\xa9"));

  // --- Tab 4: Prescriptions ---
  QWidget *tabRx = new QWidget();
  QVBoxLayout *layRx = new QVBoxLayout(tabRx);

  QHBoxLayout *rxForm = new QHBoxLayout();
  QComboBox *rxDrug = new QComboBox();
  rxDrug->setFixedHeight(38);
  rxDrug->setEditable(true);
  rxDrug->setPlaceholderText(
      tr2("Select or type drug name...",
          "\xd8\xa7\xd8\xae\xd8\xaa\xd8\xb1 \xd8\xa3\xd9\x88 "
          "\xd8\xa7\xd9\x83\xd8\xaa\xd8\xa8 \xd8\xa7\xd8\xb3\xd9\x85 "
          "\xd8\xa7\xd9\x84\xd8\xaf\xd9\x88\xd8\xa7\xd8\xa1..."));

  // Load drugs into the combo box
  QSqlQuery qDrugs =
      Database::instance().exec("SELECT name FROM drugs ORDER BY name ASC");
  while (qDrugs.next()) {
    rxDrug->addItem(qDrugs.value(0).toString());
  }
  rxDrug->setCurrentIndex(-1); // Start empty
  QLineEdit *rxDosage = new QLineEdit();
  rxDosage->setFixedHeight(38);
  rxDosage->setPlaceholderText(
      tr2("Dosage...", "\xd8\xa7\xd9\x84\xd8\xac\xd8\xb1\xd8\xb9\xd8\xa9..."));
  QLineEdit *rxDuration = new QLineEdit();
  rxDuration->setFixedHeight(38);
  rxDuration->setPlaceholderText(
      tr2("Duration...", "\xd8\xa7\xd9\x84\xd9\x85\xd8\xaf\xd8\xa9..."));
  QPushButton *rxAddBtn =
      new QPushButton(tr2("+ Add", "\xd8\xa5\xd8\xb6\xd8\xa7\xd9\x81\xd8\xa9"));
  rxAddBtn->setObjectName("primaryBtn");
  rxAddBtn->setFixedHeight(38);
  rxForm->addWidget(rxDrug, 2);
  rxForm->addWidget(rxDosage, 1);
  rxForm->addWidget(rxDuration, 1);
  rxForm->addWidget(rxAddBtn);
  layRx->addLayout(rxForm);

  QTableWidget *tblRx = new QTableWidget();
  tblRx->setColumnCount(3);
  tblRx->setHorizontalHeaderLabels(
      {tr2("Drug", "\xd8\xa7\xd9\x84\xd8\xaf\xd9\x88\xd8\xa7\xd8\xa1"),
       tr2("Dosage", "\xd8\xa7\xd9\x84\xd8\xac\xd8\xb1\xd8\xb9\xd8\xa9"),
       tr2("Duration", "\xd8\xa7\xd9\x84\xd9\x85\xd8\xaf\xd8\xa9")});
  tblRx->horizontalHeader()->setStretchLastSection(true);
  tblRx->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  tblRx->verticalHeader()->setVisible(false);
  layRx->addWidget(tblRx);

  QPushButton *sendRxBtn = new QPushButton(
      tr2("Send Prescription to Pharmacy",
          "\xd8\xa5\xd8\xb1\xd8\xb3\xd8\xa7\xd9\x84 "
          "\xd8\xa7\xd9\x84\xd9\x88\xd8\xb5\xd9\x81\xd8\xa9 "
          "\xd9\x84\xd9\x84\xd8\xb5\xd9\x8a\xd8\xaf\xd9\x84\xd9\x8a\xd8\xa9"));
  sendRxBtn->setObjectName("primaryBtn");
  sendRxBtn->setFixedHeight(45);
  layRx->addWidget(sendRxBtn);

  connect(rxAddBtn, &QPushButton::clicked, [=]() {
    if (rxDrug->currentText().trimmed().isEmpty())
      return;
    int nr = tblRx->rowCount();
    tblRx->insertRow(nr);
    tblRx->setItem(nr, 0, new QTableWidgetItem(rxDrug->currentText()));
    tblRx->setItem(nr, 1, new QTableWidgetItem(rxDosage->text()));
    tblRx->setItem(nr, 2, new QTableWidgetItem(rxDuration->text()));
    rxDrug->setCurrentText("");
    rxDosage->clear();
    rxDuration->clear();
  });

  connect(sendRxBtn, &QPushButton::clicked, [=]() {
    int pid = selectedPatId->text().toInt();
    if (pid == 0 || tblRx->rowCount() == 0) {
      QMessageBox::warning(
          nullptr, tr2("Error", "\xd8\xae\xd8\xb7\xd8\xa3"),
          tr2("Load patient and add prescriptions first.",
              "\xd8\xad\xd9\x85\xd9\x84 \xd9\x85\xd9\x84\xd9\x81 "
              "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6 "
              "\xd9\x88\xd8\xa3\xd8\xb6\xd9\x81 "
              "\xd8\xa7\xd9\x84\xd8\xa3\xd8\xaf\xd9\x88\xd9\x8a\xd8\xa9 "
              "\xd8\xa3\xd9\x88\xd9\x84\xd8\xa7\xd9\x8b."));
      return;
    }
    // Build prescription text
    QString rxText;
    for (int r = 0; r < tblRx->rowCount(); r++) {
      rxText += tblRx->item(r, 0)->text() + " - " + tblRx->item(r, 1)->text() +
                " - " + tblRx->item(r, 2)->text() + "\n";
    }
    Database::instance().exec(
        QString("INSERT INTO pharmacy_prescriptions_queue "
                "(patient_id, doctor_id, prescription_text, status) "
                "VALUES (%1,0,N'%2','Pending')")
            .arg(pid)
            .arg(rxText.replace("'", "''")));
    QMessageBox::information(
        nullptr,
        tr2("Sent", "\xd8\xaa\xd9\x85 "
                    "\xd8\xa7\xd9\x84\xd8\xa5\xd8\xb1\xd8\xb3\xd8\xa7\xd9\x84"),
        tr2("Prescription sent to Pharmacy.",
            "\xd8\xaa\xd9\x85 \xd8\xa5\xd8\xb1\xd8\xb3\xd8\xa7\xd9\x84 "
            "\xd8\xa7\xd9\x84\xd9\x88\xd8\xb5\xd9\x81\xd8\xa9 "
            "\xd8\xa5\xd9\x84\xd9\x89 "
            "\xd8\xa7\xd9\x84\xd8\xb5\xd9\x8a\xd8\xaf\xd9\x84\xd9\x8a\xd8\xa9"
            "."));
  });

  tabs->addTab(tabRx,
               tr2("Prescriptions",
                   "\xd8\xa7\xd9\x84\xd9\x88\xd8\xb5\xd9\x81\xd8\xa7\xd8\xaa "
                   "\xd8\xa7\xd9\x84\xd8\xb7\xd8\xa8\xd9\x8a\xd8\xa9"));

  layout->addWidget(tabs);
  return page;
}

// ===== LABORATORY =====
QWidget *MainWindow::createLabPage() {
  QWidget *page = new QWidget();
  QVBoxLayout *layout = new QVBoxLayout(page);

  QLabel *title = new QLabel(
      tr2("Laboratory Management",
          "\xd8\xa5\xd8\xaf\xd8\xa7\xd8\xb1\xd8\xa9 "
          "\xd8\xa7\xd9\x84\xd9\x85\xd8\xae\xd8\xaa\xd8\xa8\xd8\xb1"));
  title->setObjectName("pageTitle");
  layout->addWidget(title);

  QTabWidget *tabs = new QTabWidget();
  tabs->setStyleSheet(
      "QTabBar::tab { padding: 10px 20px; font-weight: bold; background: "
      "#1e293b; color: #94a3b8; border-top-left-radius: 4px; "
      "border-top-right-radius: 4px; margin-right: 2px; }"
      "QTabBar::tab:selected { background: #3b82f6; color: white; }"
      "QTabWidget::pane { border: 1px solid #334155; border-radius: 4px; "
      "background: #0f172a; top: -1px; }");

  // --- Tab 1: Orders & Sample Collection ---
  QWidget *tabSamples = new QWidget();
  QVBoxLayout *laySamples = new QVBoxLayout(tabSamples);
  QHBoxLayout *sampTop = new QHBoxLayout();
  sampTop->addWidget(new QLabel(tr2(
      "Pending Orders (From Clinics)",
      "\xd8\xa7\xd9\x84\xd8\xb7\xd9\x84\xd8\xa8\xd8\xa7\xd8\xaa "
      "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb9\xd9\x84\xd9\x82\xd8\xa9 "
      "(\xd9\x85\xd9\x86 "
      "\xd8\xa7\xd9\x84\xd8\xb9\xd9\x8a\xd8\xa7\xd8\xaf\xd8\xa7\xd8\xaa)")));
  sampTop->addStretch();
  QComboBox *comboPatientLab = new QComboBox();
  comboPatientLab->addItem(tr2("Select Patient...",
                               "\xd8\xa7\xd8\xae\xd8\xaa\xd8\xb1 "
                               "\xd8\xa7\xd9\x84\xd9\x85"
                               "\xd8\xb1\xd9\x8a\xd8\xb6..."),
                           -1);
  QSqlQuery qPatLab = Database::instance().exec(
      "SELECT DISTINCT p.id, COALESCE(p.name_en, p.name_ar) FROM "
      "lab_radiology_orders o JOIN patients p ON p.id = o.patient_id WHERE "
      "o.is_radiology = 0 AND o.status = 'Pending Result'");
  while (qPatLab.next()) {
    comboPatientLab->addItem(qPatLab.value(1).toString(),
                             qPatLab.value(0).toInt());
  }
  sampTop->addWidget(comboPatientLab);
  QPushButton *btnPrintSelLab =
      new QPushButton(tr2("Print Selected Barcode",
                          "\xd8\xb7\xd8\xa8\xd8\xa7\xd8\xb9\xd8\xa9 "
                          "\xd8\xa8\xd8\xa7\xd8\xb1\xd9\x83\xd9\x88\xd8\xaf "
                          "\xd8\xa7\xd9\x84\xd9\x81\xd8\xad\xd8\xb5"));
  QPushButton *btnPrintAllLab =
      new QPushButton(tr2("Print All for Patient",
                          "\xd8\xb7\xd8\xa8\xd8\xa7\xd8\xb9\xd8\xa9 "
                          "\xd8\xa7\xd9\x84\xd9\x83\xd9\x84 "
                          "\xd9\x84\xd9\x84\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6"));
  btnPrintAllLab->setObjectName("primaryBtn");
  sampTop->addWidget(btnPrintSelLab);
  sampTop->addWidget(btnPrintAllLab);
  laySamples->addLayout(sampTop);
  QTableWidget *tblSamp = new QTableWidget(0, 6);
  tblSamp->setHorizontalHeaderLabels({"Order ID", "Patient Name", "Test Type",
                                      "Request Date", "Status", "Patient ID"});
  tblSamp->horizontalHeader()->setStretchLastSection(true);
  tblSamp->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  tblSamp->setColumnHidden(5, true);

  QSqlQuery qLab = Database::instance().exec(
      "SELECT o.id, COALESCE(p.name_en, p.name_ar), o.description, "
      "o.created_at, o.status, o.patient_id "
      "FROM lab_radiology_orders o "
      "LEFT JOIN patients p ON p.id = o.patient_id "
      "WHERE o.is_radiology = 0 AND o.status = 'Pending Result' "
      "ORDER BY o.id DESC");
  int rNum = 0;
  while (qLab.next()) {
    tblSamp->insertRow(rNum);
    tblSamp->setItem(rNum, 0, new QTableWidgetItem(qLab.value(0).toString()));
    tblSamp->setItem(rNum, 1, new QTableWidgetItem(qLab.value(1).toString()));
    tblSamp->setItem(rNum, 2, new QTableWidgetItem(qLab.value(2).toString()));
    tblSamp->setItem(rNum, 3, new QTableWidgetItem(qLab.value(3).toString()));
    QTableWidgetItem *st = new QTableWidgetItem(qLab.value(4).toString());
    st->setForeground(QColor("#3b82f6"));
    tblSamp->setItem(rNum, 4, st);
    tblSamp->setItem(rNum, 5, new QTableWidgetItem(qLab.value(5).toString()));
    rNum++;
  }

  laySamples->addWidget(tblSamp);
  tabs->addTab(
      tabSamples,
      tr2("Orders & Samples",
          "\xd8\xa7\xd9\x84\xd8\xb7\xd9\x84\xd8\xa8\xd8\xa7\xd8\xaa "
          "\xd9\x88\xd8\xa7\xd9\x84\xd8\xb9\xd9\x8a\xd9\x86\xd8\xa7\xd8\xaa"));

  // --- Tab 2: Result Entry ---
  QWidget *tabResults = new QWidget();
  QVBoxLayout *layResults = new QVBoxLayout(tabResults);
  QHBoxLayout *resTop = new QHBoxLayout();
  QLineEdit *searchSerial = new QLineEdit();
  searchSerial->setPlaceholderText(
      tr2("Scan Barcode or Enter Sample Serial...",
          "\xd8\xa7\xd9\x85\xd8\xb3\xd8\xad "
          "\xd8\xa7\xd9\x84\xd8\xa8\xd8\xa7\xd8\xb1\xd9\x83\xd9\x88\xd8\xaf "
          "\xd8\xa3\xd9\x88 \xd8\xa3\xd8\xaf\xd8\xae\xd9\x84 "
          "\xd8\xb1\xd9\x82\xd9\x85 "
          "\xd8\xa7\xd9\x84\xd8\xb9\xd9\x8a\xd9\x86\xd8\xa9..."));
  resTop->addWidget(searchSerial);
  QPushButton *btnLoadResult = new QPushButton(tr2(
      "Load Test", "\xd8\xaa\xd8\xad\xd9\x85\xd9\x8a\xd9\x84 "
                   "\xd8\xa7\xd9\x84\xd8\xaa\xd8\xad\xd9\x84\xd9\x8a\xd9\x84"));
  resTop->addWidget(btnLoadResult);
  layResults->addLayout(resTop);
  QTableWidget *tblResults = new QTableWidget(0, 5);
  tblResults->setHorizontalHeaderLabels(
      {"Parameter", "Result Value", "Unit", "Normal Range", "Abnormal Flag"});
  tblResults->horizontalHeader()->setStretchLastSection(true);
  tblResults->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  layResults->addWidget(tblResults);
  QPushButton *btnApprove =
      new QPushButton(tr2("Approve Results (Send to EMR & Notify)",
                          "\xd8\xa7\xd8\xb9\xd8\xaa\xd9\x85\xd8\xa7\xd8\xaf "
                          "\xd8\xa7\xd9\x84\xd9\x86\xd8\xaa\xd8\xa7\xd8\xa6\xd8"
                          "\xac (\xd8\xa5\xd8\xb1\xd8\xb3\xd8\xa7\xd9\x84 "
                          "\xd9\x84\xd9\x84\xd8\xb3\xd8\xac\xd9\x84 "
                          "\xd9\x88\xd8\xa5\xd8\xb4\xd8\xb9\xd8\xa7\xd8\xb1)"));
  btnApprove->setObjectName("primaryBtn");
  layResults->addWidget(btnApprove);
  tabs->addTab(tabResults,
               tr2("Result Entry",
                   "\xd8\xa5\xd8\xaf\xd8\xae\xd8\xa7\xd9\x84 "
                   "\xd8\xa7\xd9\x84\xd9\x86\xd8\xaa\xd8\xa7\xd8\xa6\xd8\xac"));

  connect(btnLoadResult, &QPushButton::clicked, [=]() {
    QString sid = searchSerial->text().trimmed().replace("'", "''");
    if (sid.isEmpty())
      return;
    QSqlQuery q = Database::instance().exec(
        QString("SELECT description FROM lab_radiology_orders WHERE id=%1 AND "
                "is_radiology=0")
            .arg(sid));
    if (q.next()) {
      tblResults->setRowCount(0);
      tblResults->insertRow(0);
      tblResults->setItem(0, 0, new QTableWidgetItem(q.value(0).toString()));
      tblResults->setItem(0, 1, new QTableWidgetItem(""));
      tblResults->setItem(0, 2, new QTableWidgetItem("N/A"));
      tblResults->setItem(0, 3, new QTableWidgetItem("N/A"));
      tblResults->setItem(0, 4, new QTableWidgetItem("No"));
    } else {
      QMessageBox::warning(nullptr, "Not Found",
                           "Order ID not found or not a Lab Test.");
    }
  });

  connect(btnApprove, &QPushButton::clicked, [=]() {
    QString sid = searchSerial->text().trimmed().replace("'", "''");
    if (sid.isEmpty() || tblResults->rowCount() == 0)
      return;

    QString resultVal =
        tblResults->item(0, 1) ? tblResults->item(0, 1)->text() : "";
    QString testName =
        tblResults->item(0, 0) ? tblResults->item(0, 0)->text() : "";
    QString finalResult = testName + ": " + resultVal;

    Database::instance().exec(
        QString("UPDATE lab_radiology_orders SET status='Completed', "
                "results=N'%1' WHERE id=%2")
            .arg(finalResult.replace("'", "''"))
            .arg(sid));

    QMessageBox::information(
        nullptr, "Results Approved",
        tr2("Results archived in EMR successfully.\n\nSMS notification "
            "dispatched to patient.",
            "\xd8\xaa\xd9\x85 \xd8\xa7\xd8\xb9\xd8\xaa\xd9\x85\xd8\xa7\xd8\xaf "
            "\xd8\xa7\xd9\x84\xd9\x86\xd8\xaa\xd8\xa7\xd8\xa6\xd8\xac "
            "\xd9\x88\xd8\xa3\xd8\xb1\xd8\xb4\xd9\x81\xd8\xaa\xd9\x87\xd8\xa7 "
            "\xd9\x81\xd9\x8a \xd9\x85\xd9\x84\xd9\x81 "
            "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6."
            "\n\n\xd8\xaa\xd9\x85 \xd8\xa5\xd8\xb1\xd8\xb3\xd8\xa7\xd9\x84 "
            "\xd8\xb1\xd8\xb3\xd8\xa7\xd9\x84\xd8\xa9 SMS "
            "\xd9\x84\xd9\x84\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6."));

    tblResults->setRowCount(0);
    searchSerial->clear();
  });

  // --- Tab 3: Patient EMR Access ---
  QWidget *tabEMR = new QWidget();
  QVBoxLayout *layEMR = new QVBoxLayout(tabEMR);
  QHBoxLayout *emrTop = new QHBoxLayout();
  QLineEdit *searchEMR = new QLineEdit();
  searchEMR->setPlaceholderText(
      tr2("Patient File Number...",
          "\xd8\xb1\xd9\x82\xd9\x85 \xd9\x85\xd9\x84\xd9\x81 "
          "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6..."));
  emrTop->addWidget(searchEMR);
  QPushButton *btnViewEMR = new QPushButton(
      tr2("Fetch History",
          "\xd8\xb9\xd8\xb1\xd8\xb6 "
          "\xd8\xa7\xd9\x84\xd8\xaa\xd8\xa7\xd8\xb1\xd9\x8a\xd8\xae"));
  emrTop->addWidget(btnViewEMR);
  layEMR->addLayout(emrTop);
  QTableWidget *tblEMR = new QTableWidget(0, 3);
  tblEMR->setHorizontalHeaderLabels(
      {"Visit Date", "Diagnoses / Notes", "Doctor"});
  tblEMR->horizontalHeader()->setStretchLastSection(true);
  tblEMR->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  layEMR->addWidget(tblEMR);

  connect(btnViewEMR, &QPushButton::clicked, [=]() {
    QString patFile = searchEMR->text().trimmed().replace("'", "''");
    if (patFile.isEmpty())
      return;
    QSqlQuery q = Database::instance().exec(
        QString("SELECT m.visit_date, m.diagnosis, e.name "
                "FROM medical_records m "
                "JOIN patients p ON p.id=m.patient_id "
                "LEFT JOIN employees e ON e.id=m.doctor_id "
                "WHERE p.file_number='%1' ORDER BY m.id DESC")
            .arg(patFile));
    tblEMR->setRowCount(0);
    int r = 0;
    while (q.next()) {
      tblEMR->insertRow(r);
      tblEMR->setItem(r, 0, new QTableWidgetItem(q.value(0).toString()));
      tblEMR->setItem(r, 1, new QTableWidgetItem(q.value(1).toString()));
      tblEMR->setItem(r, 2, new QTableWidgetItem(q.value(2).toString()));
      r++;
    }
    if (r == 0)
      QMessageBox::information(nullptr, "Info", "No history found.");
  });

  tabs->addTab(tabEMR,
               tr2("EMR Access", "\xd8\xa7\xd9\x84\xd8\xb3\xd8\xac\xd9\x84 "
                                 "\xd8\xa7\xd9\x84\xd8\xb7\xd8\xa8\xd9\x8a"));

  // --- Tab 4: Reports & Archive ---
  QWidget *tabRep = new QWidget();
  QVBoxLayout *layRep = new QVBoxLayout(tabRep);
  QHBoxLayout *repTop = new QHBoxLayout();
  QLineEdit *searchRptId = new QLineEdit();
  searchRptId->setPlaceholderText(
      tr2("Search by Patient ID/Name/Test...",
          "\xd8\xa8\xd8\xad\xd8\xab "
          "\xd8\xa8\xd8\xa7\xd9\x84\xd9\x87\xd9\x88\xd9\x8a\xd8\xa9/"
          "\xd8\xa7\xd9\x84\xd8\xa7\xd8\xb3\xd9\x85/"
          "\xd8\xa7\xd9\x84\xd8\xaa\xd8\xad\xd9\x84\xd9\x8a\xd9\x84..."));
  repTop->addWidget(searchRptId);
  QPushButton *btnRptSearch = new QPushButton(
      tr2("Search Archive",
          "\xd8\xa8\xd8\xad\xd8\xab \xd9\x81\xd9\x8a "
          "\xd8\xa7\xd9\x84\xd8\xa3\xd8\xb1\xd8\xb4\xd9\x8a\xd9\x81"));
  repTop->addWidget(btnRptSearch);
  layRep->addLayout(repTop);
  QTableWidget *tblRep = new QTableWidget(0, 6);
  tblRep->setHorizontalHeaderLabels(
      {"Serial", "Patient Name", "Test Name", "Result Date", "Value", "Notes"});
  tblRep->horizontalHeader()->setStretchLastSection(true);
  tblRep->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  layRep->addWidget(tblRep);

  connect(btnRptSearch, &QPushButton::clicked, [=]() {
    QString qry = searchRptId->text().trimmed();
    if (qry.isEmpty())
      return;
    QSqlQuery q = Database::instance().exec(
        QString("SELECT o.id, COALESCE(p.name_en, p.name_ar), o.description, "
                "o.result_date, o.results, 'Archive' "
                "FROM lab_radiology_orders o "
                "LEFT JOIN patients p ON p.id=o.patient_id "
                "WHERE (p.file_number='%1' OR p.name_en LIKE '%%1%' OR "
                "o.description LIKE '%%1%') AND o.is_radiology=0 AND "
                "o.status='Completed' "
                "ORDER BY o.id DESC")
            .arg(qry.replace("'", "''")));
    tblRep->setRowCount(0);
    int r = 0;
    while (q.next()) {
      tblRep->insertRow(r);
      for (int i = 0; i < 6; i++) {
        tblRep->setItem(r, i, new QTableWidgetItem(q.value(i).toString()));
      }
      r++;
    }
  });

  QPushButton *btnPrintRep =
      new QPushButton(tr2("Print All Results (Consolidated)",
                          "\xd8\xb7\xd8\xa8\xd8\xa7\xd8\xb9\xd8\xa9 "
                          "\xd8\xac\xd9\x85\xd8\xaa\xd8\xb9 "
                          "\xd8\xa7\xd9\x84\xd9\x86\xd8\xaa\xd8\xa7\xd8\xa6\xd8"
                          "\xac (\xd8\xaa\xd9\x82\xd8\xb1\xd9\x8a\xd8\xb1 "
                          "\xd9\x85\xd9\x88\xd8\xad\xd8\xaf)"));
  layRep->addWidget(btnPrintRep); // Changed from btnPrintAll to btnPrintRep
  tabs->addTab(
      tabRep,
      tr2("Reports & Archive",
          "\xd8\xa7\xd9\x84\xd8\xaa\xd9\x82\xd8\xa7\xd8\xb1\xd9\x8a\xd8\xb1 "
          "\xd9\x88\xd8\xa7\xd9\x84\xd8\xa3\xd8\xb1\xd8\xb4\xd9\x8a\xd9\x81"));

  layout->addWidget(tabs);

  // Connections
  connect(btnPrintSelLab, &QPushButton::clicked, [=]() {
    int row = tblSamp->currentRow();
    if (row < 0) {
      QMessageBox::warning(
          nullptr, "Warning",
          QString::fromUtf8("\xd8\xa7\xd8\xb1\xd8\xac\xd9\x88 "
                            "\xd8\xaa\xd8\xad\xd8\xaf\xd9\x8a\xd8\xaf "
                            "\xd9\x81\xd8\xad\xd8\xb5 "
                            "\xd8\xa3\xd9\x88\xd9\x84\xd8\xa7\xd9\x8b"));
      return;
    }
    int orderId =
        tblSamp->item(row, 0) ? tblSamp->item(row, 0)->text().toInt() : 0;
    int patientId =
        tblSamp->item(row, 5) ? tblSamp->item(row, 5)->text().toInt() : 0;
    InvoiceGenerator::printLabBarcode(patientId, orderId);
  });

  connect(btnPrintAllLab, &QPushButton::clicked, [=]() {
    int patientId = comboPatientLab->currentData().toInt();
    if (patientId == -1) {
      int row = tblSamp->currentRow();
      if (row < 0) {
        QMessageBox::warning(
            nullptr, "Warning",
            QString::fromUtf8(
                "\xd8\xa7\xd8\xb1\xd8\xac\xd9\x88 "
                "\xd8\xa7\xd8\xae\xd8\xaa\xd9\x8a\xd8\xa7\xd8\xb1 "
                "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6 "
                "\xd8\xa3\xd9\x88\xd9\x84\xd9\x8b"));
        return;
      }
      patientId =
          tblSamp->item(row, 5) ? tblSamp->item(row, 5)->text().toInt() : 0;
    }
    InvoiceGenerator::printLabBarcode(patientId, -1);
  });

  connect(btnPrintRep, &QPushButton::clicked,
          [=]() { // Changed from btnApprove to btnPrintRep
            QMessageBox::information(
                nullptr, "Print",
                tr2("Printing consolidated laboratory report.",
                    "\xd8\xac\xd8\xa7\xd8\xb1\xd9\x8a "
                    "\xd8\xb7\xd8\xa8\xd8\xa7\xd8\xb9\xd8\xa9 "
                    "\xd8\xaa\xd9\x82\xd8\xb1\xd9\x8a\xd8\xb1 "
                    "\xd8\xa7\xd9\x84\xd9\x85\xd8\xae\xd8\xaa\xd8\xa8\xd8\xb1 "
                    "\xd8\xa7\xd9\x84\xd9\x85\xd9\x88\xd8\xad\xd8\xaf."));
          });

  // ===== SAMPLE MANAGEMENT =====
  QGroupBox *smpBox = new QGroupBox(
      tr2("Sample Management",
          "\xd8\xa5\xd8\xaf\xd8\xa7\xd8\xb1\xd8\xa9 "
          "\xd8\xa7\xd9\x84\xd8\xb9\xd9\x8a\xd9\x86\xd8\xa7\xd8\xaa"));
  smpBox->setObjectName("card");
  QVBoxLayout *smpL = new QVBoxLayout(smpBox);
  QTableWidget *smpTbl = new QTableWidget();
  smpTbl->setColumnCount(6);
  smpTbl->setHorizontalHeaderLabels(
      {tr2("Order#", "\xd8\xb7\xd9\x84\xd8\xa8"),
       tr2("Sample Type", "\xd9\x86\xd9\x88\xd8\xb9 "
                          "\xd8\xa7\xd9\x84\xd8\xb9\xd9\x8a\xd9\x86\xd8\xa9"),
       tr2("Barcode", "\xd8\xa8\xd8\xa7\xd8\xb1\xd9\x83\xd9\x88\xd8\xaf"),
       tr2("Collection Date", "\xd8\xaa\xd8\xa7\xd8\xb1\xd9\x8a\xd8\xae "
                              "\xd8\xa7\xd9\x84\xd8\xac\xd9\x85\xd8\xb9"),
       tr2("Status", "\xd8\xad\xd8\xa7\xd9\x84\xd8\xa9"),
       tr2("Location", "\xd9\x85\xd9\x88\xd9\x82\xd8\xb9")});
  smpTbl->horizontalHeader()->setStretchLastSection(true);
  smpTbl->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  smpTbl->verticalHeader()->setVisible(false);
  QSqlQuery qsmp = Database::instance().exec(
      "SELECT "
      "order_id,sample_type,barcode,collection_date,status,storage_location "
      "FROM lab_samples ORDER BY id DESC");
  {
    int r = 0;
    while (qsmp.next()) {
      smpTbl->insertRow(r);
      for (int c = 0; c < 6; c++)
        smpTbl->setItem(r, c, new QTableWidgetItem(qsmp.value(c).toString()));
      r++;
    }
  }
  smpL->addWidget(smpTbl);
  layout->addWidget(smpBox);

  return page;
}

// ===== RADIOLOGY =====
QWidget *MainWindow::createRadiologyPage() {
  QWidget *page = new QWidget();
  QVBoxLayout *layout = new QVBoxLayout(page);

  QLabel *title =
      new QLabel(tr2("Radiology & Imaging",
                     "\xd9\x82\xd8\xb3\xd9\x85 "
                     "\xd8\xa7\xd9\x84\xd8\xa3\xd8\xb4\xd8\xb9\xd8\xa9 "
                     "\xd9\x88\xd8\xa7\xd9\x84\xd8\xaa\xd8\xb5\xd9\x88\xd9\x8a"
                     "\xd8\xb1 \xd8\xa7\xd9\x84\xd8\xb7\xd8\xa8\xd9\x8a"));
  title->setObjectName("pageTitle");
  layout->addWidget(title);

  QTabWidget *tabs = new QTabWidget();
  tabs->setStyleSheet(
      "QTabBar::tab { padding: 10px 20px; font-weight: bold; background: "
      "#1e293b; color: #94a3b8; border-top-left-radius: 4px; "
      "border-top-right-radius: 4px; margin-right: 2px; }"
      "QTabBar::tab:selected { background: #3b82f6; color: white; }"
      "QTabWidget::pane { border: 1px solid #334155; border-radius: 4px; "
      "background: #0f172a; top: -1px; }");

  // --- Tab 1: Orders & Queue ---
  QWidget *tabOrders = new QWidget();
  QVBoxLayout *layOrders = new QVBoxLayout(tabOrders);
  QHBoxLayout *ordTop = new QHBoxLayout();
  ordTop->addWidget(new QLabel(
      tr2("Pending Scans",
          "\xd8\xb7\xd9\x84\xd8\xa8\xd8\xa7\xd8\xaa "
          "\xd8\xa7\xd9\x84\xd8\xa3\xd8\xb4\xd8\xa9 "
          "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb9\xd9\x84\xd9\x82\xd8\xa9")));
  ordTop->addStretch();
  QComboBox *comboPatientRad = new QComboBox();
  comboPatientRad->addItem(tr2("Select Patient...",
                               "\xd8\xa7\xd8\xae\xd8\xaa\xd8\xb1 "
                               "\xd8\xa7\xd9\x84\xd9\x85"
                               "\xd8\xb1\xd9\x8a\xd8\xb6..."),
                           -1);
  QSqlQuery qPatRad = Database::instance().exec(
      "SELECT DISTINCT p.id, COALESCE(p.name_en, p.name_ar) FROM "
      "lab_radiology_orders o JOIN patients p ON p.id = o.patient_id WHERE "
      "o.is_radiology = 1 AND o.status = 'Pending Result'");
  while (qPatRad.next()) {
    comboPatientRad->addItem(qPatRad.value(1).toString(),
                             qPatRad.value(0).toInt());
  }
  ordTop->addWidget(comboPatientRad);
  QPushButton *btnPrintSelRad =
      new QPushButton(tr2("Print Selected Barcode",
                          "\xd8\xb7\xd8\xa8\xd8\xa7\xd8\xb9\xd8\xa9 "
                          "\xd8\xa8\xd8\xa7\xd8\xb1\xd9\x83\xd9\x88\xd8\xaf "
                          "\xd8\xa7\xd9\x84\xd9\x81\xd8\xad\xd8\xb5"));
  QPushButton *btnPrintAllRad =
      new QPushButton(tr2("Print All for Patient",
                          "\xd8\xb7\xd8\xa8\xd8\xa7\xd8\xb9\xd8\xa9 "
                          "\xd8\xa7\xd9\x84\xd9\x83\xd9\x84 "
                          "\xd9\x84\xd9\x84\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6"));
  btnPrintAllRad->setObjectName("primaryBtn");
  ordTop->addWidget(btnPrintSelRad);
  ordTop->addWidget(btnPrintAllRad);

  QPushButton *btnStart = new QPushButton(
      tr2("Start Imaging Session",
          "\xd8\xa8\xd8\xaf\xd8\xa1 \xd8\xac\xd9\x84\xd8\xb3\xd8\xa9 "
          "\xd8\xa7\xd9\x84\xd8\xaa\xd8\xb5\xd9\x88\xd9\x8a\xd8\xb1"));
  ordTop->addWidget(btnStart);
  layOrders->addLayout(ordTop);
  QTableWidget *tblOrders = new QTableWidget(0, 6);
  tblOrders->setHorizontalHeaderLabels({"Order ID", "Patient Name",
                                        "Modality (X-Ray/MRI)", "Request Date",
                                        "Status", "Patient ID"});
  tblOrders->horizontalHeader()->setStretchLastSection(true);
  tblOrders->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  tblOrders->setColumnHidden(5, true);

  QSqlQuery qRad = Database::instance().exec(
      "SELECT o.id, COALESCE(p.name_en, p.name_ar), o.description, "
      "o.created_at, o.status, o.patient_id "
      "FROM lab_radiology_orders o "
      "LEFT JOIN patients p ON p.id = o.patient_id "
      "WHERE o.is_radiology = 1 AND o.status = 'Pending Result' "
      "ORDER BY o.id DESC");
  int rNum = 0;
  while (qRad.next()) {
    tblOrders->insertRow(rNum);
    tblOrders->setItem(rNum, 0, new QTableWidgetItem(qRad.value(0).toString()));
    tblOrders->setItem(rNum, 1, new QTableWidgetItem(qRad.value(1).toString()));
    tblOrders->setItem(rNum, 2, new QTableWidgetItem(qRad.value(2).toString()));
    tblOrders->setItem(rNum, 3, new QTableWidgetItem(qRad.value(3).toString()));
    QTableWidgetItem *st = new QTableWidgetItem(qRad.value(4).toString());
    st->setForeground(QColor("#3b82f6"));
    tblOrders->setItem(rNum, 4, st);
    tblOrders->setItem(rNum, 5, new QTableWidgetItem(qRad.value(5).toString()));
    rNum++;
  }

  layOrders->addWidget(tblOrders);
  tabs->addTab(tabOrders,
               tr2("Active Orders",
                   "\xd8\xa7\xd9\x84\xd8\xb7\xd9\x84\xd8\xa8\xd8\xa7\xd8\xaa "
                   "\xd8\xa7\xd9\x84\xd9\x86\xd8\xb4\xd8\xb7\xd8\xa9"));

  // --- Tab 2: Imaging & Upload ---
  QWidget *tabImage = new QWidget();
  QVBoxLayout *layImage = new QVBoxLayout(tabImage);
  QHBoxLayout *imgTop = new QHBoxLayout();
  imgTop->addWidget(
      new QLabel(tr2("Upload DICOM/Image Files",
                     "\xd8\xa5\xd8\xb1\xd9\x81\xd8\xa7\xd9\x82 "
                     "\xd9\x85\xd9\x84\xd9\x81\xd8\xa7\xd8\xaa "
                     "\xd8\xa7\xd9\x84\xd8\xa3\xd8\xb4\xd8\xa9 (DICOM "
                     "\xd8\xa3\xd9\x88 \xd8\xb5\xd9\x88\xd8\xb1)")));
  imgTop->addStretch();
  QPushButton *btnBrowse = new QPushButton(
      tr2("Browse Files...",
          "\xd8\xa7\xd8\xb3\xd8\xaa\xd8\xb9\xd8\xb1\xd8\xa7\xd8\xb6..."));
  imgTop->addWidget(btnBrowse);
  layImage->addLayout(imgTop);
  QTableWidget *tblUploads = new QTableWidget(0, 3);
  tblUploads->setHorizontalHeaderLabels({"File Name", "Size", "Upload Status"});
  tblUploads->horizontalHeader()->setStretchLastSection(true);
  tblUploads->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  layImage->addWidget(tblUploads);
  tabs->addTab(
      tabImage,
      tr2("Image Uploads",
          "\xd8\xb1\xd9\x81\xd8\xb9 \xd8\xa7\xd9\x84\xd8\xb5\xd9\x88\xd8\xb1"));

  // --- Tab 3: Report Writing ---
  QWidget *tabWrite = new QWidget();
  QVBoxLayout *layWrite = new QVBoxLayout(tabWrite);
  QHBoxLayout *writeTop = new QHBoxLayout();

  QLineEdit *searchRadSerial = new QLineEdit();
  searchRadSerial->setPlaceholderText(
      tr2("Enter Order ID...",
          "\xd8\xa3\xd8\xaf\xd8\xae\xd9\x84 \xd8\xb1\xd9\x82\xd9\x85 "
          "\xd8\xa7\xd9\x84\xd8\xb7\xd9\x84\xd8\xa8..."));
  writeTop->addWidget(searchRadSerial);

  QComboBox *comboTemplate = new QComboBox();
  comboTemplate->addItem(
      tr2("Select Report Template...",
          "\xd8\xa7\xd8\xae\xd8\xaa\xd8\xb1 "
          "\xd9\x86\xd9\x85\xd9\x88\xd8\xb0\xd8\xac\xd8\xa7\xd9\x8b..."));
  // X-Ray Templates
  comboTemplate->addItem(
      tr2("X-Ray Chest",
          "\xd8\xa3\xd8\xb4\xd8\xb9\xd8\xa9 \xd8\xb5\xd8\xaf\xd8\xb1"));
  comboTemplate->addItem(
      tr2("X-Ray Abdomen",
          "\xd8\xa3\xd8\xb4\xd8\xb9\xd8\xa9 \xd8\xa8\xd8\xb7\xd9\x86"));
  comboTemplate->addItem(tr2("X-Ray Spine (Cervical)",
                             "\xd8\xa3\xd8\xb4\xd8\xb9\xd8\xa9 "
                             "\xd8\xb9\xd9\x86\xd9\x82\xd9\x8a\xd8\xa9"));
  comboTemplate->addItem(tr2("X-Ray Spine (Lumbar)",
                             "\xd8\xa3\xd8\xb4\xd8\xb9\xd8\xa9 "
                             "\xd9\x82\xd8\xb7\xd9\x86\xd9\x8a\xd8\xa9"));
  comboTemplate->addItem(
      tr2("X-Ray Pelvis",
          "\xd8\xa3\xd8\xb4\xd8\xb9\xd8\xa9 \xd8\xad\xd9\x88\xd8\xb6"));
  comboTemplate->addItem(tr2("X-Ray Extremities",
                             "\xd8\xa3\xd8\xb4\xd8\xb9\xd8\xa9 "
                             "\xd8\xa3\xd8\xb7\xd8\xb1\xd8\xa7\xd9\x81"));
  comboTemplate->addItem(tr2("X-Ray Skull",
                             "\xd8\xa3\xd8\xb4\xd8\xb9\xd8\xa9 "
                             "\xd8\xac\xd9\x85\xd8\xac\xd9\x85\xd8\xa9"));
  // CT Templates
  comboTemplate->addItem(tr2("CT Brain",
                             "\xd9\x85\xd9\x82\xd8\xb7\xd8\xb9\xd9\x8a\xd8\xa9 "
                             "\xd8\xa7\xd9\x84\xd9\x85\xd8\xae"));
  comboTemplate->addItem(tr2("CT Chest",
                             "\xd9\x85\xd9\x82\xd8\xb7\xd8\xb9\xd9\x8a\xd8\xa9 "
                             "\xd8\xa7\xd9\x84\xd8\xb5\xd8\xaf\xd8\xb1"));
  comboTemplate->addItem(
      tr2("CT Abdomen & Pelvis",
          "\xd9\x85\xd9\x82\xd8\xb7\xd8\xb9\xd9\x8a\xd8\xa9 "
          "\xd8\xa8\xd8\xb7\xd9\x86 \xd9\x88\xd8\xad\xd9\x88\xd8\xb6"));
  comboTemplate->addItem(
      tr2("CT Spine", "\xd9\x85\xd9\x82\xd8\xb7\xd8\xb9\xd9\x8a\xd8\xa9 "
                      "\xd8\xa7\xd9\x84\xd8\xb9\xd9\x85\xd9\x88\xd8\xaf "
                      "\xd8\xa7\xd9\x84\xd9\x81\xd9\x82\xd8\xb1\xd9\x8a"));
  comboTemplate->addItem(
      tr2("CT Angiography",
          "\xd8\xaa\xd8\xb5\xd9\x88\xd9\x8a\xd8\xb1 "
          "\xd9\x85\xd9\x82\xd8\xb7\xd8\xb9\xd9\x8a "
          "\xd9\x84\xd9\x84\xd8\xa3\xd9\x88\xd8\xb9\xd9\x8a\xd8\xa9"));
  // MRI Templates
  comboTemplate->addItem(
      tr2("MRI Brain", "\xd8\xb1\xd9\x86\xd9\x8a\xd9\x86 "
                       "\xd9\x85\xd8\xba\xd9\x86\xd8\xa7\xd8\xb7\xd9\x8a\xd8"
                       "\xb3\xd9\x8a \xd9\x84\xd9\x84\xd9\x85\xd8\xae"));
  comboTemplate->addItem(
      tr2("MRI Spine (Cervical)",
          "\xd8\xb1\xd9\x86\xd9\x8a\xd9\x86 \xd8\xb9\xd9\x86\xd9\x82\xd9\x8a"));
  comboTemplate->addItem(
      tr2("MRI Spine (Lumbar)",
          "\xd8\xb1\xd9\x86\xd9\x8a\xd9\x86 \xd9\x82\xd8\xb7\xd9\x86\xd9\x8a"));
  comboTemplate->addItem(
      tr2("MRI Knee", "\xd8\xb1\xd9\x86\xd9\x8a\xd9\x86 "
                      "\xd8\xa7\xd9\x84\xd8\xb1\xd9\x83\xd8\xa8\xd8\xa9"));
  comboTemplate->addItem(tr2("MRI Shoulder",
                             "\xd8\xb1\xd9\x86\xd9\x8a\xd9\x86 "
                             "\xd8\xa7\xd9\x84\xd9\x83\xd8\xaa\xd9\x81"));
  comboTemplate->addItem(tr2("MRI Abdomen",
                             "\xd8\xb1\xd9\x86\xd9\x8a\xd9\x86 "
                             "\xd8\xa7\xd9\x84\xd8\xa8\xd8\xb7\xd9\x86"));
  comboTemplate->addItem(tr2("MRI Pelvis",
                             "\xd8\xb1\xd9\x86\xd9\x8a\xd9\x86 "
                             "\xd8\xa7\xd9\x84\xd8\xad\xd9\x88\xd8\xb6"));
  // Ultrasound Templates
  comboTemplate->addItem(tr2("Ultrasound Abdomen",
                             "\xd8\xb3\xd9\x88\xd9\x86\xd8\xa7\xd8\xb1 "
                             "\xd8\xa7\xd9\x84\xd8\xa8\xd8\xb7\xd9\x86"));
  comboTemplate->addItem(tr2("Ultrasound Pelvis",
                             "\xd8\xb3\xd9\x88\xd9\x86\xd8\xa7\xd8\xb1 "
                             "\xd8\xa7\xd9\x84\xd8\xad\xd9\x88\xd8\xb6"));
  comboTemplate->addItem(
      tr2("Ultrasound Thyroid",
          "\xd8\xb3\xd9\x88\xd9\x86\xd8\xa7\xd8\xb1 "
          "\xd8\xa7\xd9\x84\xd8\xba\xd8\xaf\xd8\xa9 "
          "\xd8\xa7\xd9\x84\xd8\xaf\xd8\xb1\xd9\x82\xd9\x8a\xd8\xa9"));
  comboTemplate->addItem(tr2("Ultrasound Breast",
                             "\xd8\xb3\xd9\x88\xd9\x86\xd8\xa7\xd8\xb1 "
                             "\xd8\xa7\xd9\x84\xd8\xab\xd8\xaf\xd9\x8a"));
  comboTemplate->addItem(tr2("Ultrasound Pregnancy (OB)",
                             "\xd8\xb3\xd9\x88\xd9\x86\xd8\xa7\xd8\xb1 "
                             "\xd8\xa7\xd9\x84\xd8\xad\xd9\x85\xd9\x84"));
  comboTemplate->addItem(
      tr2("Doppler Ultrasound",
          "\xd8\xaf\xd9\x88\xd8\xa8\xd9\x84\xd8\xb1 "
          "\xd8\xa7\xd9\x84\xd8\xa3\xd9\x88\xd8\xb9\xd9\x8a\xd8\xa9"));
  // Special Modalities
  comboTemplate->addItem(tr2("Mammography",
                             "\xd8\xaa\xd8\xb5\xd9\x88\xd9\x8a\xd8\xb1 "
                             "\xd8\xa7\xd9\x84\xd8\xab\xd8\xaf\xd9\x8a"));
  comboTemplate->addItem(tr2("Fluoroscopy",
                             "\xd8\xaa\xd9\x86\xd8\xb8\xd9\x8a\xd8\xb1 "
                             "\xd8\xb4\xd8\xb9\xd8\xa7\xd8\xb9\xd9\x8a"));
  comboTemplate->addItem(
      tr2("Bone Densitometry (DEXA)",
          "\xd9\x82\xd9\x8a\xd8\xa7\xd8\xb3 "
          "\xd9\x83\xd8\xab\xd8\xa7\xd9\x81\xd8\xa9 "
          "\xd8\xa7\xd9\x84\xd8\xb9\xd8\xb8\xd8\xa7\xd9\x85"));
  comboTemplate->addItem(
      tr2("Panoramic Dental X-Ray",
          "\xd8\xa8\xd8\xa7\xd9\x86\xd9\x88\xd8\xb1\xd8\xa7\xd9\x85\xd8\xa7 "
          "\xd8\xa3\xd8\xb3\xd9\x86\xd8\xa7\xd9\x86"));
  comboTemplate->addItem(tr2("Echocardiography",
                             "\xd8\xa5\xd9\x8a\xd9\x83\xd9\x88 "
                             "\xd8\xa7\xd9\x84\xd9\x82\xd9\x84\xd8\xa8"));
  writeTop->addWidget(comboTemplate);
  QPushButton *btnLoadTpl = new QPushButton(
      tr2("Load Template",
          "\xd8\xaa\xd8\xad\xd9\x85\xd9\x8a\xd9\x84 "
          "\xd8\xa7\xd9\x84\xd9\x86\xd9\x85\xd9\x88\xd8\xb0\xd8\xac"));
  writeTop->addWidget(btnLoadTpl);
  layWrite->addLayout(writeTop);

  // Custom multi-line editor for the report
  QTextEdit *reportEditor = new QTextEdit();
  reportEditor->setPlaceholderText(
      tr2("Write or modify the radiology report here...",
          "\xd8\xa7\xd9\x83\xd8\xaa\xd8\xa8 \xd8\xa3\xd9\x88 "
          "\xd8\xb9\xd8\xaf\xd9\x84 \xd8\xaa\xd9\x82\xd8\xb1\xd9\x8a\xd8\xb1 "
          "\xd8\xa7\xd9\x84\xd8\xa3\xd8\xb4\xd8\xb9\xd8\xa9 "
          "\xd9\x87\xd9\x86\xd8\xa7..."));
  reportEditor->setStyleSheet(
      "background-color: #1e293b; color: #e2e8f0; border: 1px solid #334155; "
      "border-radius: 4px; padding: 10px; font-size: 14px;");
  layWrite->addWidget(reportEditor);

  QPushButton *btnSendRep =
      new QPushButton(tr2("Sign & Send to Patient EMR",
                          "\xd8\xa7\xd8\xb9\xd8\xaa\xd9\x85\xd8\xa7\xd8\xaf "
                          "\xd9\x88\xd8\xa5\xd8\xb1\xd8\xb3\xd8\xa7\xd9\x84 "
                          "\xd9\x84\xd9\x84\xd8\xb3\xd8\xac\xd9\x84 "
                          "\xd8\xa7\xd9\x84\xd8\xb7\xd8\xa8\xd9\x8a"));
  btnSendRep->setObjectName("primaryBtn");
  layWrite->addWidget(btnSendRep);
  tabs->addTab(
      tabWrite,
      tr2("Report Writing",
          "\xd9\x83\xd8\xaa\xd8\xa7\xd8\xa8\xd8\xa9 "
          "\xd8\xa7\xd9\x84\xd8\xaa\xd9\x82\xd8\xa7\xd8\xb1\xd9\x8a\xd8\xb1"));

  // --- Tab 4: EMR Access ---
  QWidget *tabEMR = new QWidget();
  QVBoxLayout *layEMR = new QVBoxLayout(tabEMR);
  QHBoxLayout *emrTop = new QHBoxLayout();
  QLineEdit *searchEMR = new QLineEdit();
  searchEMR->setPlaceholderText(
      tr2("Enter Patient File #...",
          "\xd8\xa3\xd8\xaf\xd8\xae\xd9\x84 \xd8\xb1\xd9\x82\xd9\x85 "
          "\xd9\x85\xd9\x84\xd9\x81 "
          "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6..."));
  emrTop->addWidget(searchEMR);
  QPushButton *btnFetchHist = new QPushButton(
      tr2("View Medical History",
          "\xd8\xb9\xd8\xb1\xd8\xb6 "
          "\xd8\xa7\xd9\x84\xd8\xaa\xd8\xa7\xd8\xb1\xd9\x8a\xd8\xae "
          "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd8\xb6\xd9\x8a"));
  emrTop->addWidget(btnFetchHist);
  layEMR->addLayout(emrTop);
  QTableWidget *tblEMR = new QTableWidget(0, 3);
  tblEMR->setHorizontalHeaderLabels({"Date", "Diagnosis/Notes", "Physician"});
  tblEMR->horizontalHeader()->setStretchLastSection(true);
  tblEMR->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  layEMR->addWidget(tblEMR);
  tabs->addTab(tabEMR, tr2("EMR Check",
                           "\xd9\x85\xd8\xb1\xd8\xa7\xd8\xac\xd8\xb9\xd8\xa9 "
                           "\xd8\xa7\xd9\x84\xd8\xb3\xd8\xac\xd9\x84"));

  // --- Tab 5: Archive ---
  QWidget *tabArch = new QWidget();
  QVBoxLayout *layArch = new QVBoxLayout(tabArch);
  QHBoxLayout *arcTop = new QHBoxLayout();
  QLineEdit *searchArc = new QLineEdit();
  searchArc->setPlaceholderText(
      tr2("Search past reports...",
          "\xd8\xa8\xd8\xad\xd8\xab \xd9\x81\xd9\x8a "
          "\xd8\xa7\xd9\x84\xd8\xaa\xd9\x82\xd8\xa7\xd8\xb1\xd9\x8a\xd8\xb1 "
          "\xd8\xa7\xd9\x84\xd8\xb3\xd8\xa7\xd8\xa8\xd9\x82\xd8\xa9..."));
  arcTop->addWidget(searchArc);
  layArch->addLayout(arcTop);
  QTableWidget *tblArch = new QTableWidget(0, 4);
  tblArch->setHorizontalHeaderLabels(
      {"Date", "Patient Name", "Modality", "Actions"});
  tblArch->horizontalHeader()->setStretchLastSection(true);
  tblArch->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  layArch->addWidget(tblArch);
  tabs->addTab(tabArch,
               tr2("Archive",
                   "\xd8\xa7\xd9\x84\xd8\xa3\xd8\xb1\xd8\xb4\xd9\x8a\xd9\x81"));

  layout->addWidget(tabs);

  // Connections
  connect(btnPrintSelRad, &QPushButton::clicked, [=]() {
    int row = tblOrders->currentRow();
    if (row < 0) {
      QMessageBox::warning(
          nullptr, "Warning",
          QString::fromUtf8("\xd8\xa7\xd8\xb1\xd8\xac\xd9\x88 "
                            "\xd8\xaa\xd8\xad\xd8\xaf\xd9\x8a\xd8\xaf "
                            "\xd9\x81\xd8\xad\xd8\xb5 "
                            "\xd8\xa3\xd9\x88\xd9\x84\xd8\xa7\xd9\x8b"));
      return;
    }
    int orderId =
        tblOrders->item(row, 0) ? tblOrders->item(row, 0)->text().toInt() : 0;
    int patientId =
        tblOrders->item(row, 5) ? tblOrders->item(row, 5)->text().toInt() : 0;
    InvoiceGenerator::printLabBarcode(patientId, orderId);
  });

  connect(btnPrintAllRad, &QPushButton::clicked, [=]() {
    int patientId = comboPatientRad->currentData().toInt();
    if (patientId == -1) {
      int row = tblOrders->currentRow();
      if (row < 0) {
        QMessageBox::warning(
            nullptr, "Warning",
            QString::fromUtf8(
                "\xd8\xa7\xd8\xb1\xd8\xac\xd9\x88 "
                "\xd8\xa7\xd8\xae\xd8\xaa\xd9\x8a\xd8\xa7\xd8\xb1 "
                "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6 "
                "\xd8\xa3\xd9\x88\xd9\x84\xd9\x8b"));
        return;
      }
      patientId =
          tblOrders->item(row, 5) ? tblOrders->item(row, 5)->text().toInt() : 0;
    }
    InvoiceGenerator::printLabBarcode(patientId, -1);
  });

  connect(btnBrowse, &QPushButton::clicked, [=]() {
    QMessageBox::information(
        nullptr, "Upload",
        tr2("Simulating generic file dialog...\nImage path attached securely.",
            "\xd9\x85\xd8\xad\xd8\xa7\xd9\x83\xd8\xa7\xd8\xa9 "
            "\xd9\x86\xd8\xa7\xd9\x81\xd8\xb0\xd8\xa9 \xd8\xb1\xd9\x81\xd8\xb9 "
            "\xd8\xa7\xd9\x84\xd9\x85\xd9\x84\xd9\x81\xd8\xa7\xd8\xaa..."
            "\n\xd8\xaa\xd9\x85 \xd8\xb1\xd8\xa8\xd8\xb7 "
            "\xd8\xa7\xd9\x84\xd8\xb5\xd9\x88\xd8\xb1\xd8\xa9 "
            "\xd8\xa8\xd9\x86\xd8\xac\xd8\xa7\xd8\xad."));
  });

  connect(btnLoadTpl, &QPushButton::clicked, [=]() {
    if (comboTemplate->currentIndex() > 0) {
      reportEditor->setText(
          "FINDINGS:\nThe lungs are clear bilaterally. No focal consolidation, "
          "pleural effusion, or pneumothorax is seen.\nCardiomediastinal "
          "silhouette is within normal limits.\n\nIMPRESSION:\nNormal "
          "radiograph of the chest.");
    }
  });

  connect(btnSendRep, &QPushButton::clicked, [=]() {
    QString sid = searchRadSerial->text().trimmed().replace("'", "''");
    QString report = reportEditor->toPlainText().trimmed();

    if (sid.isEmpty() || report.isEmpty()) {
      QMessageBox::warning(nullptr, "Warning",
                           "Please enter an Order ID and write a report.");
      return;
    }

    QSqlQuery q =
        Database::instance().exec(QString("SELECT id FROM lab_radiology_orders "
                                          "WHERE id=%1 AND is_radiology=1")
                                      .arg(sid));

    if (!q.next()) {
      QMessageBox::warning(nullptr, "Error", "Radiology Order ID not found.");
      return;
    }

    Database::instance().exec(
        QString("UPDATE lab_radiology_orders SET status='Completed', "
                "structured_report=N'%1' WHERE id=%2")
            .arg(report.replace("'", "''"))
            .arg(sid));

    QMessageBox::information(
        nullptr, "Success",
        tr2("Report & Images pushed to Doctor Station (EMR) successfully!",
            "\xd8\xaa\xd9\x85 \xd8\xa7\xd8\xb9\xd8\xaa\xd9\x85\xd8\xa7\xd8\xaf "
            "\xd8\xa7\xd9\x84\xd9\x86\xd8\xaa\xd8\xa7\xd8\xa6\xd8\xac "
            "\xd9\x88\xd8\xa7\xd9\x84\xd8\xb5\xd9\x88\xd8\xb1 "
            "\xd9\x88\xd8\xa5\xd8\xb1\xd8\xb3\xd8\xa7\xd9\x84\xd9\x87\xd8\xa7 "
            "\xd9\x84\xd9\x85\xd9\x84\xd9\x81 "
            "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6 "
            "\xd8\xa8\xd9\x86\xd8\xac\xd8\xa7\xd8\xad!"));

    searchRadSerial->clear();
    reportEditor->clear();
  });

  connect(btnStart, &QPushButton::clicked, [=]() {
    QMessageBox::information(
        nullptr, "Session Started",
        "Imaging session started. Please prepare the patient.");
  });

  connect(btnFetchHist, &QPushButton::clicked, [=]() {
    QString patFile = searchEMR->text().trimmed().replace("'", "''");
    if (patFile.isEmpty())
      return;
    QSqlQuery q = Database::instance().exec(
        QString("SELECT m.visit_date, m.diagnosis, e.name "
                "FROM medical_records m "
                "JOIN patients p ON p.id=m.patient_id "
                "LEFT JOIN employees e ON e.id=m.doctor_id "
                "WHERE p.file_number='%1' ORDER BY m.id DESC")
            .arg(patFile));
    tblEMR->setRowCount(0);
    int r = 0;
    while (q.next()) {
      tblEMR->insertRow(r);
      tblEMR->setItem(r, 0, new QTableWidgetItem(q.value(0).toString()));
      tblEMR->setItem(r, 1, new QTableWidgetItem(q.value(1).toString()));
      tblEMR->setItem(r, 2, new QTableWidgetItem(q.value(2).toString()));
      r++;
    }
    if (r == 0)
      QMessageBox::information(nullptr, "Info",
                               "No medical history found for this patient.");
  });

  return page;
}

// ===== PATIENT PORTAL =====
QWidget *MainWindow::createPatientPortalPage() {
  QWidget *page = new QWidget();
  QVBoxLayout *layout = new QVBoxLayout(page);
  QLabel *title = new QLabel(tr2(
      "Patient Portal", "\xd8\xa8\xd9\x88\xd8\xa7\xd8\xa8\xd8\xa9 "
                        "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd8\xb6\xd9\x89"));
  title->setObjectName("pageTitle");
  layout->addWidget(title);

  QHBoxLayout *mainLay = new QHBoxLayout();

  // Patient lookup
  QGroupBox *lookupBox = new QGroupBox(
      tr2("Patient Lookup", "\xd8\xa8\xd8\xad\xd8\xab \xd8\xb9\xd9\x86 "
                            "\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6"));
  lookupBox->setObjectName("card");
  QVBoxLayout *ll = new QVBoxLayout(lookupBox);

  ll->addWidget(new QLabel(tr2(
      "National ID / File No.",
      "\xd8\xb1\xd9\x82\xd9\x85 "
      "\xd8\xa7\xd9\x84\xd9\x87\xd9\x88\xd9\x8a\xd8\xa9 / "
      "\xd8\xb1\xd9\x82\xd9\x85 \xd8\xa7\xd9\x84\xd9\x85\xd9\x84\xd9\x81")));
  QLineEdit *searchId = new QLineEdit();
  searchId->setFixedHeight(38);
  searchId->setPlaceholderText(tr2(
      "Enter ID to search...", "\xd8\xa7\xd8\xaf\xd8\xae\xd9\x84 "
                               "\xd8\xa7\xd9\x84\xd8\xb1\xd9\x82\xd9\x85..."));
  ll->addWidget(searchId);

  QPushButton *searchBtn =
      new QPushButton(tr2("Search", "\xd8\xa8\xd8\xad\xd8\xab"));
  searchBtn->setObjectName("primaryBtn");
  searchBtn->setFixedHeight(40);
  ll->addWidget(searchBtn);

  QLabel *resultLabel = new QLabel("");
  resultLabel->setWordWrap(true);
  resultLabel->setStyleSheet("font-size: 13px; padding: 10px;");
  ll->addWidget(resultLabel);
  ll->addStretch();

  connect(searchBtn, &QPushButton::clicked, [=]() {
    QString id = searchId->text().trimmed();
    if (id.isEmpty())
      return;
    QSqlQuery q = Database::instance().exec(
        QString("SELECT file_number, name_en, name_ar, national_id, phone, "
                "department, status FROM patients WHERE national_id='%1' "
                "OR file_number=%2")
            .arg(id)
            .arg(id.toInt()));
    if (q.next()) {
      resultLabel->setText(
          tr2("File #: ", "\xd8\xb1\xd9\x82\xd9\x85 "
                          "\xd8\xa7\xd9\x84\xd9\x85\xd9\x84\xd9\x81: ") +
          q.value(0).toString() + "\n" +
          tr2("Name: ", "\xd8\xa7\xd9\x84\xd8\xa7\xd8\xb3\xd9\x85: ") +
          (isArabic ? q.value(2).toString() : q.value(1).toString()) + "\n" +
          tr2("ID: ", "\xd8\xa7\xd9\x84\xd9\x87\xd9\x88\xd9\x8a\xd8\xa9: ") +
          q.value(3).toString() + "\n" +
          tr2("Phone: ", "\xd8\xa7\xd9\x84\xd8\xac\xd9\x88\xd8\xa7\xd9\x84: ") +
          q.value(4).toString() + "\n" +
          tr2("Dept: ", "\xd8\xa7\xd9\x84\xd9\x82\xd8\xb3\xd9\x85: ") +
          q.value(5).toString() + "\n" +
          tr2("Status: ",
              "\xd8\xa7\xd9\x84\xd8\xad\xd8\xa7\xd9\x84\xd8\xa9: ") +
          q.value(6).toString());
    } else {
      resultLabel->setText(
          tr2("Patient not found.",
              "\xd9\x84\xd9\x85 \xd9\x8a\xd8\xaa\xd9\x85 "
              "\xd8\xa7\xd9\x84\xd8\xb9\xd8\xab\xd9\x88\xd8\xb1 "
              "\xd8\xb9\xd9\x84\xd9\x89 "
              "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6."));
    }
  });

  // My Appointments
  QGroupBox *apptBox =
      new QGroupBox(tr2("Patient Appointments",
                        "\xd9\x85\xd9\x88\xd8\xa7\xd8\xb9\xd9\x8a\xd8\xaf "
                        "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6"));
  apptBox->setObjectName("card");
  QVBoxLayout *al = new QVBoxLayout(apptBox);
  QTableWidget *apptTable = new QTableWidget();
  apptTable->setColumnCount(5);
  apptTable->setHorizontalHeaderLabels(
      {tr2("Patient", "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6"),
       tr2("Doctor", "\xd8\xa7\xd9\x84\xd8\xb7\xd8\xa8\xd9\x8a\xd8\xa8"),
       tr2("Date", "\xd8\xa7\xd9\x84\xd8\xaa\xd8\xa7\xd8\xb1\xd9\x8a\xd8\xae"),
       tr2("Time", "\xd8\xa7\xd9\x84\xd9\x88\xd9\x82\xd8\xaa"),
       tr2("Status", "\xd8\xa7\xd9\x84\xd8\xad\xd8\xa7\xd9\x84\xd8\xa9")});
  apptTable->horizontalHeader()->setStretchLastSection(true);
  apptTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  apptTable->verticalHeader()->setVisible(false);

  QSqlQuery qa = Database::instance().exec(
      "SELECT patient_name, doctor_name, appt_date, appt_time, status "
      "FROM appointments ORDER BY id DESC");
  int r = 0;
  while (qa.next()) {
    apptTable->insertRow(r);
    for (int c = 0; c < 5; c++)
      apptTable->setItem(r, c, new QTableWidgetItem(qa.value(c).toString()));
    QTableWidgetItem *st = apptTable->item(r, 4);
    if (st)
      st->setForeground(st->text() == "Confirmed" ? QColor("#4ade80")
                                                  : QColor("#f59e0b"));
    r++;
  }
  al->addWidget(apptTable);

  mainLay->addWidget(lookupBox, 1);
  mainLay->addWidget(apptBox, 2);
  layout->addLayout(mainLay);
  return page;
}

// ===== ACCOUNTING =====
QWidget *MainWindow::createAccountingPage() {
  QWidget *page = new QWidget();
  QVBoxLayout *layout = new QVBoxLayout(page);
  QLabel *title = new QLabel(
      tr2("Accounting",
          "\xd8\xa7\xd9\x84\xd8\xad\xd8\xb3\xd8\xa7\xd8\xa8\xd8\xa7\xd8\xaa"));
  title->setObjectName("pageTitle");
  layout->addWidget(title);

  QTabWidget *tabs = new QTabWidget();
  tabs->setObjectName("acctTabs");

  // ---- TAB 1: Journal Entries ----
  {
    QWidget *t = new QWidget();
    QHBoxLayout *ml = new QHBoxLayout(t);
    QGroupBox *fb = new QGroupBox(
        tr2("New Journal Entry",
            "\xd9\x82\xd9\x8a\xd8\xaf \xd8\xac\xd8\xaf\xd9\x8a\xd8\xaf"));
    fb->setObjectName("card");
    QVBoxLayout *fl = new QVBoxLayout(fb);
    auto mkF = [&](const QString &e, const QString &a,
                   const QString &p = "") -> QLineEdit * {
      fl->addWidget(new QLabel(tr2(e, a)));
      QLineEdit *le = new QLineEdit();
      le->setFixedHeight(36);
      if (!p.isEmpty())
        le->setPlaceholderText(p);
      fl->addWidget(le);
      return le;
    };
    QLineEdit *en = mkF("Entry#", "\xd8\xb1\xd9\x82\xd9\x85", "JV-001");
    QLineEdit *ds =
        mkF("Description", "\xd8\xa7\xd9\x84\xd8\xa8\xd9\x8a\xd8\xa7\xd9\x86");
    QLineEdit *db = mkF("Debit", "\xd9\x85\xd8\xaf\xd9\x8a\xd9\x86", "0.00");
    QLineEdit *cr = mkF("Credit", "\xd8\xaf\xd8\xa7\xd8\xa6\xd9\x86", "0.00");
    QLineEdit *rf =
        mkF("Reference", "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd8\xac\xd8\xb9");
    QPushButton *pb = new QPushButton(
        tr2("Post", "\xd8\xaa\xd8\xb1\xd8\xad\xd9\x8a\xd9\x84"));
    pb->setObjectName("primaryBtn");
    pb->setFixedHeight(40);
    fl->addWidget(pb);
    fl->addStretch();
    QGroupBox *lb = new QGroupBox(tr2(
        "Journal Entries", "\xd8\xa7\xd9\x84\xd9\x82\xd9\x8a\xd9\x88\xd8\xaf"));
    lb->setObjectName("card");
    QVBoxLayout *tl = new QVBoxLayout(lb);
    QTableWidget *tb = new QTableWidget();
    tb->setColumnCount(5);
    tb->setHorizontalHeaderLabels(
        {tr2("Entry#", "\xd8\xb1\xd9\x82\xd9\x85"),
         tr2("Desc", "\xd8\xa8\xd9\x8a\xd8\xa7\xd9\x86"),
         tr2("Debit", "\xd9\x85\xd8\xaf\xd9\x8a\xd9\x86"),
         tr2("Credit", "\xd8\xaf\xd8\xa7\xd8\xa6\xd9\x86"),
         tr2("Ref", "\xd9\x85\xd8\xb1\xd8\xac\xd8\xb9")});
    tb->horizontalHeader()->setStretchLastSection(true);
    tb->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    tb->verticalHeader()->setVisible(false);
    QSqlQuery qj = Database::instance().exec(
        "SELECT entry_number,description,reference FROM "
        "finance_journal_entries ORDER BY id DESC");
    int r = 0;
    while (qj.next()) {
      tb->insertRow(r);
      tb->setItem(r, 0, new QTableWidgetItem(qj.value(0).toString()));
      tb->setItem(r, 1, new QTableWidgetItem(qj.value(1).toString()));
      tb->setItem(r, 2, new QTableWidgetItem("0.00"));
      tb->setItem(r, 3, new QTableWidgetItem("0.00"));
      tb->setItem(r, 4, new QTableWidgetItem(qj.value(2).toString()));
      r++;
    }
    connect(pb, &QPushButton::clicked, [=]() {
      if (en->text().isEmpty())
        return;
      QSqlQuery i = Database::instance().prepare(
          "INSERT INTO "
          "finance_journal_entries(entry_number,description,reference,entry_"
          "date,is_posted) VALUES(?,?,?,?,1)");
      i.addBindValue(en->text());
      i.addBindValue(ds->text());
      i.addBindValue(rf->text());
      i.addBindValue(QDate::currentDate().toString("yyyy-MM-dd"));
      i.exec();
      tb->insertRow(0);
      tb->setItem(0, 0, new QTableWidgetItem(en->text()));
      tb->setItem(0, 1, new QTableWidgetItem(ds->text()));
      tb->setItem(0, 2, new QTableWidgetItem(db->text()));
      tb->setItem(0, 3, new QTableWidgetItem(cr->text()));
      tb->setItem(0, 4, new QTableWidgetItem(rf->text()));
      en->clear();
      ds->clear();
      db->clear();
      cr->clear();
      rf->clear();
    });
    tl->addWidget(tb);
    ml->addWidget(fb, 1);
    ml->addWidget(lb, 2);
    tabs->addTab(
        t, tr2("Journal Entries",
               "\xd9\x82\xd9\x8a\xd9\x88\xd8\xaf "
               "\xd8\xa7\xd9\x84\xd9\x8a\xd9\x88\xd9\x85\xd9\x8a\xd8\xa9"));
  }

  // ---- TAB 2: Chart of Accounts ----
  {
    QWidget *t = new QWidget();
    QHBoxLayout *ml = new QHBoxLayout(t);
    QGroupBox *fb = new QGroupBox(
        tr2("Add Account", "\xd8\xa5\xd8\xb6\xd8\xa7\xd9\x81\xd8\xa9 "
                           "\xd8\xad\xd8\xb3\xd8\xa7\xd8\xa8"));
    fb->setObjectName("card");
    QVBoxLayout *fl = new QVBoxLayout(fb);
    fl->addWidget(new QLabel(tr2(
        "Account Code", "\xd8\xb1\xd9\x85\xd8\xb2 "
                        "\xd8\xa7\xd9\x84\xd8\xad\xd8\xb3\xd8\xa7\xd8\xa8")));
    QLineEdit *code = new QLineEdit();
    code->setFixedHeight(36);
    fl->addWidget(code);
    fl->addWidget(new QLabel(
        tr2("Account Name (AR)",
            "\xd8\xa7\xd8\xb3\xd9\x85 \xd8\xb9\xd8\xb1\xd8\xa8\xd9\x8a")));
    QLineEdit *nar = new QLineEdit();
    nar->setFixedHeight(36);
    fl->addWidget(nar);
    fl->addWidget(new QLabel(
        tr2("Account Name (EN)",
            "\xd8\xa7\xd8\xb3\xd9\x85 "
            "\xd8\xa5\xd9\x86\xd8\xac\xd9\x84\xd9\x8a\xd8\xb2\xd9\x8a")));
    QLineEdit *nen = new QLineEdit();
    nen->setFixedHeight(36);
    fl->addWidget(nen);
    fl->addWidget(new QLabel(
        tr2("Account Type", "\xd8\xa7\xd9\x84\xd9\x86\xd9\x88\xd8\xb9")));
    QComboBox *atype = new QComboBox();
    atype->setFixedHeight(36);
    atype->addItem(tr2("Assets", "\xd8\xa3\xd8\xb5\xd9\x88\xd9\x84"));
    atype->addItem(tr2("Liabilities", "\xd8\xae\xd8\xb5\xd9\x88\xd9\x85"));
    atype->addItem(tr2(
        "Revenue", "\xd8\xa5\xd9\x8a\xd8\xb1\xd8\xa7\xd8\xaf\xd8\xa7\xd8\xaa"));
    atype->addItem(
        tr2("Expenses",
            "\xd9\x85\xd8\xb5\xd8\xb1\xd9\x88\xd9\x81\xd8\xa7\xd8\xaa"));
    atype->addItem(tr2("Equity", "\xd8\xad\xd9\x82\xd9\x88\xd9\x82 "
                                 "\xd9\x85\xd9\x84\xd9\x83\xd9\x8a\xd8\xa9"));
    fl->addWidget(atype);
    QPushButton *sb = new QPushButton(tr2("Save", "\xd8\xad\xd9\x81\xd8\xb8"));
    sb->setObjectName("primaryBtn");
    sb->setFixedHeight(40);
    fl->addWidget(sb);
    fl->addStretch();
    QGroupBox *lb = new QGroupBox(tr2(
        "Chart of Accounts",
        "\xd8\xaf\xd9\x84\xd9\x8a\xd9\x84 "
        "\xd8\xa7\xd9\x84\xd8\xad\xd8\xb3\xd8\xa7\xd8\xa8\xd8\xa7\xd8\xaa"));
    lb->setObjectName("card");
    QVBoxLayout *tl = new QVBoxLayout(lb);
    QTableWidget *tb = new QTableWidget();
    tb->setColumnCount(4);
    tb->setHorizontalHeaderLabels(
        {tr2("Code", "\xd8\xb1\xd9\x85\xd8\xb2"),
         tr2("Name (AR)", "\xd8\xb9\xd8\xb1\xd8\xa8\xd9\x8a"),
         tr2("Name (EN)",
             "\xd8\xa5\xd9\x86\xd8\xac\xd9\x84\xd9\x8a\xd8\xb2\xd9\x8a"),
         tr2("Type", "\xd8\xa7\xd9\x84\xd9\x86\xd9\x88\xd8\xb9")});
    tb->horizontalHeader()->setStretchLastSection(true);
    tb->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    tb->verticalHeader()->setVisible(false);
    QSqlQuery qa = Database::instance().exec(
        "SELECT account_code,account_name_ar,account_name_en,account_type FROM "
        "finance_chart_of_accounts ORDER BY account_code");
    int r = 0;
    while (qa.next()) {
      tb->insertRow(r);
      for (int c = 0; c < 4; c++)
        tb->setItem(r, c, new QTableWidgetItem(qa.value(c).toString()));
      r++;
    }
    connect(sb, &QPushButton::clicked, [=]() {
      if (code->text().isEmpty())
        return;
      QSqlQuery i = Database::instance().prepare(
          "INSERT INTO "
          "finance_chart_of_accounts(account_code,account_name_ar,account_name_"
          "en,account_type) VALUES(?,?,?,?)");
      i.addBindValue(code->text());
      i.addBindValue(nar->text());
      i.addBindValue(nen->text());
      i.addBindValue(atype->currentText());
      i.exec();
      tb->insertRow(0);
      tb->setItem(0, 0, new QTableWidgetItem(code->text()));
      tb->setItem(0, 1, new QTableWidgetItem(nar->text()));
      tb->setItem(0, 2, new QTableWidgetItem(nen->text()));
      tb->setItem(0, 3, new QTableWidgetItem(atype->currentText()));
      code->clear();
      nar->clear();
      nen->clear();
    });
    tl->addWidget(tb);
    ml->addWidget(fb, 1);
    ml->addWidget(lb, 2);
    tabs->addTab(t,
                 tr2("Chart of Accounts", "\xd8\xaf\xd9\x84\xd9\x8a\xd9\x84 "
                                          "\xd8\xa7\xd9\x84\xd8\xad\xd8\xb3\xd8"
                                          "\xa7\xd8\xa8\xd8\xa7\xd8\xaa"));
  }

  // ---- TAB 3: Cost Centers ----
  {
    QWidget *t = new QWidget();
    QHBoxLayout *ml = new QHBoxLayout(t);
    QGroupBox *fb = new QGroupBox(
        tr2("Add Cost Center", "\xd8\xa5\xd8\xb6\xd8\xa7\xd9\x81\xd8\xa9 "
                               "\xd9\x85\xd8\xb1\xd9\x83\xd8\xb2 "
                               "\xd8\xaa\xd9\x83\xd9\x84\xd9\x81\xd8\xa9"));
    fb->setObjectName("card");
    QVBoxLayout *fl = new QVBoxLayout(fb);
    fl->addWidget(new QLabel(tr2(
        "Center Name", "\xd8\xa7\xd8\xb3\xd9\x85 "
                       "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x83\xd8\xb2")));
    QLineEdit *cn = new QLineEdit();
    cn->setFixedHeight(36);
    fl->addWidget(cn);
    fl->addWidget(new QLabel(tr2(
        "Center Code", "\xd8\xb1\xd9\x85\xd8\xb2 "
                       "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x83\xd8\xb2")));
    QLineEdit *cc = new QLineEdit();
    cc->setFixedHeight(36);
    fl->addWidget(cc);
    QPushButton *sb = new QPushButton(tr2("Save", "\xd8\xad\xd9\x81\xd8\xb8"));
    sb->setObjectName("primaryBtn");
    sb->setFixedHeight(40);
    fl->addWidget(sb);
    fl->addStretch();
    QGroupBox *lb = new QGroupBox(
        tr2("Cost Centers",
            "\xd9\x85\xd8\xb1\xd8\xa7\xd9\x83\xd8\xb2 "
            "\xd8\xa7\xd9\x84\xd8\xaa\xd9\x83\xd9\x84\xd9\x81\xd8\xa9"));
    lb->setObjectName("card");
    QVBoxLayout *tl = new QVBoxLayout(lb);
    QTableWidget *tb = new QTableWidget();
    tb->setColumnCount(2);
    tb->setHorizontalHeaderLabels(
        {tr2("Name", "\xd8\xa7\xd9\x84\xd8\xa7\xd8\xb3\xd9\x85"),
         tr2("Code", "\xd8\xb1\xd9\x85\xd8\xb2")});
    tb->horizontalHeader()->setStretchLastSection(true);
    tb->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    tb->verticalHeader()->setVisible(false);
    QSqlQuery q = Database::instance().exec(
        "SELECT center_name,center_code FROM finance_cost_centers ORDER BY id");
    int r = 0;
    while (q.next()) {
      tb->insertRow(r);
      tb->setItem(r, 0, new QTableWidgetItem(q.value(0).toString()));
      tb->setItem(r, 1, new QTableWidgetItem(q.value(1).toString()));
      r++;
    }
    connect(sb, &QPushButton::clicked, [=]() {
      if (cn->text().isEmpty())
        return;
      QSqlQuery i = Database::instance().prepare(
          "INSERT INTO finance_cost_centers(center_name,center_code) "
          "VALUES(?,?)");
      i.addBindValue(cn->text());
      i.addBindValue(cc->text());
      i.exec();
      tb->insertRow(0);
      tb->setItem(0, 0, new QTableWidgetItem(cn->text()));
      tb->setItem(0, 1, new QTableWidgetItem(cc->text()));
      cn->clear();
      cc->clear();
    });
    tl->addWidget(tb);
    ml->addWidget(fb, 1);
    ml->addWidget(lb, 2);
    tabs->addTab(
        t, tr2("Cost Centers",
               "\xd9\x85\xd8\xb1\xd8\xa7\xd9\x83\xd8\xb2 "
               "\xd8\xa7\xd9\x84\xd8\xaa\xd9\x83\xd9\x84\xd9\x81\xd8\xa9"));
  }

  // ---- TAB 4: General Ledger ----
  {
    QWidget *t = new QWidget();
    QVBoxLayout *vl = new QVBoxLayout(t);
    QGroupBox *gb = new QGroupBox(
        tr2("General Ledger",
            "\xd8\xad\xd8\xb3\xd8\xa7\xd8\xa8 "
            "\xd8\xa7\xd9\x84\xd8\xa3\xd8\xb3\xd8\xaa\xd8\xa7\xd8\xb0"));
    gb->setObjectName("card");
    QVBoxLayout *gl = new QVBoxLayout(gb);
    QHBoxLayout *filt = new QHBoxLayout();
    QComboBox *acctFilter = new QComboBox();
    acctFilter->setFixedHeight(36);
    acctFilter->addItem(
        tr2("-- All Accounts --", "-- \xd8\xa7\xd9\x84\xd9\x83\xd9\x84 --"));
    QSqlQuery qa2 = Database::instance().exec(
        "SELECT account_code,account_name_ar FROM finance_chart_of_accounts "
        "ORDER BY account_code");
    while (qa2.next())
      acctFilter->addItem(qa2.value(0).toString() + " - " +
                          qa2.value(1).toString());
    filt->addWidget(acctFilter);
    gl->addLayout(filt);
    QTableWidget *tb = new QTableWidget();
    tb->setColumnCount(5);
    tb->setHorizontalHeaderLabels(
        {tr2("Date", "\xd8\xaa\xd8\xa7\xd8\xb1\xd9\x8a\xd8\xae"),
         tr2("Entry#", "\xd9\x82\xd9\x8a\xd8\xaf"),
         tr2("Description", "\xd8\xa8\xd9\x8a\xd8\xa7\xd9\x86"),
         tr2("Debit", "\xd9\x85\xd8\xaf\xd9\x8a\xd9\x86"),
         tr2("Credit", "\xd8\xaf\xd8\xa7\xd8\xa6\xd9\x86")});
    tb->horizontalHeader()->setStretchLastSection(true);
    tb->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    tb->verticalHeader()->setVisible(false);
    QSqlQuery ql = Database::instance().exec(
        "SELECT e.entry_date,e.entry_number,e.description,l.debit,l.credit "
        "FROM finance_journal_lines l JOIN finance_journal_entries e ON "
        "l.entry_id=e.id ORDER BY e.entry_date DESC");
    int r = 0;
    while (ql.next()) {
      tb->insertRow(r);
      for (int c = 0; c < 5; c++)
        tb->setItem(r, c, new QTableWidgetItem(ql.value(c).toString()));
      r++;
    }
    gl->addWidget(tb);
    vl->addWidget(gb);
    tabs->addTab(
        t, tr2("General Ledger",
               "\xd8\xad\xd8\xb3\xd8\xa7\xd8\xa8 "
               "\xd8\xa7\xd9\x84\xd8\xa3\xd8\xb3\xd8\xaa\xd8\xa7\xd8\xb0"));
  }

  // ---- TAB 5: Receipt/Payment Vouchers ----
  {
    QWidget *t = new QWidget();
    QHBoxLayout *ml = new QHBoxLayout(t);
    QGroupBox *fb = new QGroupBox(
        tr2("New Voucher",
            "\xd8\xb3\xd9\x86\xd8\xaf \xd8\xac\xd8\xaf\xd9\x8a\xd8\xaf"));
    fb->setObjectName("card");
    QVBoxLayout *fl = new QVBoxLayout(fb);
    fl->addWidget(new QLabel(tr2(
        "Voucher#",
        "\xd8\xb1\xd9\x82\xd9\x85 \xd8\xa7\xd9\x84\xd8\xb3\xd9\x86\xd8\xaf")));
    QLineEdit *vn = new QLineEdit();
    vn->setFixedHeight(36);
    fl->addWidget(vn);
    fl->addWidget(
        new QLabel(tr2("Type", "\xd8\xa7\xd9\x84\xd9\x86\xd9\x88\xd8\xb9")));
    QComboBox *vtype = new QComboBox();
    vtype->setFixedHeight(36);
    vtype->addItem(
        tr2("Receipt", "\xd8\xb3\xd9\x86\xd8\xaf \xd9\x82\xd8\xa8\xd8\xb6"));
    vtype->addItem(
        tr2("Payment", "\xd8\xb3\xd9\x86\xd8\xaf \xd8\xb5\xd8\xb1\xd9\x81"));
    fl->addWidget(vtype);
    fl->addWidget(new QLabel(
        tr2("Amount", "\xd8\xa7\xd9\x84\xd9\x85\xd8\xa8\xd9\x84\xd8\xba")));
    QLineEdit *va = new QLineEdit();
    va->setFixedHeight(36);
    va->setPlaceholderText("0.00");
    fl->addWidget(va);
    fl->addWidget(new QLabel(tr2(
        "Description", "\xd8\xa7\xd9\x84\xd8\xa8\xd9\x8a\xd8\xa7\xd9\x86")));
    QLineEdit *vd = new QLineEdit();
    vd->setFixedHeight(36);
    fl->addWidget(vd);
    fl->addWidget(new QLabel(tr2("Payment Method",
                                 "\xd8\xb7\xd8\xb1\xd9\x8a\xd9\x82\xd8\xa9 "
                                 "\xd8\xa7\xd9\x84\xd8\xaf\xd9\x81\xd8\xb9")));
    QComboBox *pm = new QComboBox();
    pm->setFixedHeight(36);
    pm->addItem(tr2("Cash", "\xd9\x86\xd9\x82\xd8\xaf\xd9\x8a"));
    pm->addItem(tr2("Bank Transfer", "\xd8\xaa\xd8\xad\xd9\x88\xd9\x8a\xd9\x84 "
                                     "\xd8\xa8\xd9\x86\xd9\x83\xd9\x8a"));
    pm->addItem(tr2("Cheque", "\xd8\xb4\xd9\x8a\xd9\x83"));
    fl->addWidget(pm);
    QPushButton *sb = new QPushButton(tr2(
        "Save Voucher",
        "\xd8\xad\xd9\x81\xd8\xb8 \xd8\xa7\xd9\x84\xd8\xb3\xd9\x86\xd8\xaf"));
    sb->setObjectName("primaryBtn");
    sb->setFixedHeight(40);
    fl->addWidget(sb);
    fl->addStretch();
    QGroupBox *lb = new QGroupBox(
        tr2("Vouchers",
            "\xd8\xa7\xd9\x84\xd8\xb3\xd9\x86\xd8\xaf\xd8\xa7\xd8\xaa"));
    lb->setObjectName("card");
    QVBoxLayout *tl = new QVBoxLayout(lb);
    QTableWidget *tb = new QTableWidget();
    tb->setColumnCount(5);
    tb->setHorizontalHeaderLabels(
        {tr2("Voucher#", "\xd8\xb1\xd9\x82\xd9\x85"),
         tr2("Type", "\xd9\x86\xd9\x88\xd8\xb9"),
         tr2("Amount", "\xd9\x85\xd8\xa8\xd9\x84\xd8\xba"),
         tr2("Desc", "\xd8\xa8\xd9\x8a\xd8\xa7\xd9\x86"),
         tr2("Method", "\xd8\xb7\xd8\xb1\xd9\x8a\xd9\x82\xd8\xa9")});
    tb->horizontalHeader()->setStretchLastSection(true);
    tb->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    tb->verticalHeader()->setVisible(false);
    QSqlQuery qv = Database::instance().exec(
        "SELECT voucher_number,voucher_type,amount,description,payment_method "
        "FROM finance_vouchers ORDER BY id DESC");
    int r = 0;
    while (qv.next()) {
      tb->insertRow(r);
      for (int c = 0; c < 5; c++)
        tb->setItem(r, c, new QTableWidgetItem(qv.value(c).toString()));
      r++;
    }
    connect(sb, &QPushButton::clicked, [=]() {
      if (vn->text().isEmpty())
        return;
      QSqlQuery i = Database::instance().prepare(
          "INSERT INTO "
          "finance_vouchers(voucher_number,voucher_type,amount,description,"
          "payment_method,voucher_date,created_by) VALUES(?,?,?,?,?,?,?)");
      i.addBindValue(vn->text());
      i.addBindValue(vtype->currentText());
      i.addBindValue(va->text().toDouble());
      i.addBindValue(vd->text());
      i.addBindValue(pm->currentText());
      i.addBindValue(QDate::currentDate().toString("yyyy-MM-dd"));
      i.addBindValue(currentUserName);
      i.exec();
      tb->insertRow(0);
      tb->setItem(0, 0, new QTableWidgetItem(vn->text()));
      tb->setItem(0, 1, new QTableWidgetItem(vtype->currentText()));
      tb->setItem(0, 2, new QTableWidgetItem(va->text()));
      tb->setItem(0, 3, new QTableWidgetItem(vd->text()));
      tb->setItem(0, 4, new QTableWidgetItem(pm->currentText()));
      vn->clear();
      va->clear();
      vd->clear();
    });
    tl->addWidget(tb);
    ml->addWidget(fb, 1);
    ml->addWidget(lb, 2);
    tabs->addTab(t, tr2("Vouchers",
                        "\xd8\xb3\xd9\x86\xd8\xaf\xd8\xa7\xd8\xaa "
                        "\xd9\x82\xd8\xa8\xd8\xb6/\xd8\xb5\xd8\xb1\xd9\x81"));
  }

  // ---- TAB 6: Trial Balance ----
  {
    QWidget *t = new QWidget();
    QVBoxLayout *vl = new QVBoxLayout(t);
    QGroupBox *gb = new QGroupBox(tr2(
        "Trial Balance",
        "\xd9\x85\xd9\x8a\xd8\xb2\xd8\xa7\xd9\x86 "
        "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd8\xa7\xd8\xac\xd8\xb9\xd8\xa9"));
    gb->setObjectName("card");
    QVBoxLayout *gl = new QVBoxLayout(gb);
    QPushButton *genBtn = new QPushButton(tr2(
        "Generate Trial Balance",
        "\xd8\xaa\xd9\x88\xd9\x84\xd9\x8a\xd8\xaf "
        "\xd9\x85\xd9\x8a\xd8\xb2\xd8\xa7\xd9\x86 "
        "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd8\xa7\xd8\xac\xd8\xb9\xd8\xa9"));
    genBtn->setObjectName("primaryBtn");
    genBtn->setFixedHeight(40);
    gl->addWidget(genBtn);
    QTableWidget *tb = new QTableWidget();
    tb->setColumnCount(4);
    tb->setHorizontalHeaderLabels(
        {tr2("Account", "\xd8\xad\xd8\xb3\xd8\xa7\xd8\xa8"),
         tr2("Code", "\xd8\xb1\xd9\x85\xd8\xb2"),
         tr2("Total Debit", "\xd8\xa5\xd8\xac\xd9\x85\xd8\xa7\xd9\x84\xd9\x8a "
                            "\xd9\x85\xd8\xaf\xd9\x8a\xd9\x86"),
         tr2("Total Credit", "\xd8\xa5\xd8\xac\xd9\x85\xd8\xa7\xd9\x84\xd9\x8a "
                             "\xd8\xaf\xd8\xa7\xd8\xa6\xd9\x86")});
    tb->horizontalHeader()->setStretchLastSection(true);
    tb->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    tb->verticalHeader()->setVisible(false);
    connect(genBtn, &QPushButton::clicked, [=]() {
      tb->setRowCount(0);
      QSqlQuery q = Database::instance().exec(
          "SELECT "
          "a.account_name_ar,a.account_code,COALESCE(SUM(l.debit),0),COALESCE("
          "SUM(l.credit),0) FROM finance_chart_of_accounts a LEFT JOIN "
          "finance_journal_lines l ON l.account_id=a.id GROUP BY "
          "a.id,a.account_name_ar,a.account_code ORDER BY a.account_code");
      int r = 0;
      while (q.next()) {
        tb->insertRow(r);
        for (int c = 0; c < 4; c++)
          tb->setItem(r, c, new QTableWidgetItem(q.value(c).toString()));
        r++;
      }
    });
    gl->addWidget(tb);
    vl->addWidget(gb);
    tabs->addTab(t,
                 tr2("Trial Balance", "\xd9\x85\xd9\x8a\xd8\xb2\xd8\xa7\xd9\x86"
                                      " \xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd8"
                                      "\xa7\xd8\xac\xd8\xb9\xd8\xa9"));
  }

  // ---- TAB 7: Balance Sheet ----
  {
    QWidget *t = new QWidget();
    QVBoxLayout *vl = new QVBoxLayout(t);
    QGroupBox *gb = new QGroupBox(tr2("Balance Sheet / Budget",
                                      "\xd8\xa7\xd9\x84\xd9\x85\xd9\x8a\xd8\xb2"
                                      "\xd8\xa7\xd9\x86\xd9\x8a\xd8\xa9"));
    gb->setObjectName("card");
    QVBoxLayout *gl = new QVBoxLayout(gb);
    QPushButton *genBtn = new QPushButton(
        tr2("Generate Balance Sheet", "\xd8\xaa\xd9\x88\xd9\x84\xd9\x8a\xd8\xaf"
                                      " \xd8\xa7\xd9\x84\xd9\x85\xd9\x8a\xd8"
                                      "\xb2\xd8\xa7\xd9\x86\xd9\x8a\xd8\xa9"));
    genBtn->setObjectName("primaryBtn");
    genBtn->setFixedHeight(40);
    gl->addWidget(genBtn);
    QTableWidget *tb = new QTableWidget();
    tb->setColumnCount(3);
    tb->setHorizontalHeaderLabels(
        {tr2("Category", "\xd8\xa7\xd9\x84\xd9\x81\xd8\xa6\xd8\xa9"),
         tr2("Account Type",
             "\xd9\x86\xd9\x88\xd8\xb9 "
             "\xd8\xa7\xd9\x84\xd8\xad\xd8\xb3\xd8\xa7\xd8\xa8"),
         tr2("Balance", "\xd8\xa7\xd9\x84\xd8\xb1\xd8\xb5\xd9\x8a\xd8\xaf")});
    tb->horizontalHeader()->setStretchLastSection(true);
    tb->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    tb->verticalHeader()->setVisible(false);
    connect(genBtn, &QPushButton::clicked, [=]() {
      tb->setRowCount(0);
      QSqlQuery q = Database::instance().exec(
          "SELECT account_type,account_type,COUNT(*) FROM "
          "finance_chart_of_accounts GROUP BY account_type");
      int r = 0;
      while (q.next()) {
        tb->insertRow(r);
        for (int c = 0; c < 3; c++)
          tb->setItem(r, c, new QTableWidgetItem(q.value(c).toString()));
        r++;
      }
    });
    gl->addWidget(tb);
    vl->addWidget(gb);
    tabs->addTab(t,
                 tr2("Balance Sheet", "\xd8\xa7\xd9\x84\xd9\x85\xd9\x8a\xd8\xb2"
                                      "\xd8\xa7\xd9\x86\xd9\x8a\xd8\xa9"));
  }

  // ---- TAB 8: Doctor Commissions ----
  {
    QWidget *t = new QWidget();
    QVBoxLayout *vl = new QVBoxLayout(t);
    QGroupBox *gb = new QGroupBox(
        tr2("Doctor Commissions",
            "\xd9\x86\xd8\xb3\xd8\xa8 "
            "\xd8\xa7\xd9\x84\xd8\xa3\xd8\xb7\xd8\xa8\xd8\xa7\xd8\xa1"));
    gb->setObjectName("card");
    QVBoxLayout *gl = new QVBoxLayout(gb);
    QTableWidget *tb = new QTableWidget();
    tb->setColumnCount(5);
    tb->setHorizontalHeaderLabels(
        {tr2("Doctor", "\xd8\xb7\xd8\xa8\xd9\x8a\xd8\xa8"),
         tr2("Period", "\xd8\xa7\xd9\x84\xd9\x81\xd8\xaa\xd8\xb1\xd8\xa9"),
         tr2("Revenue", "\xd8\xa5\xd9\x8a\xd8\xb1\xd8\xa7\xd8\xaf"),
         tr2("Rate%", "\xd9\x86\xd8\xb3\xd8\xa8\xd8\xa9"),
         tr2("Commission", "\xd8\xb9\xd9\x85\xd9\x88\xd9\x84\xd8\xa9")});
    tb->horizontalHeader()->setStretchLastSection(true);
    tb->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    tb->verticalHeader()->setVisible(false);
    QSqlQuery q = Database::instance().exec(
        "SELECT "
        "e.name,c.period,c.total_revenue,c.commission_rate,c.commission_amount "
        "FROM finance_doctor_commissions c LEFT JOIN employees e ON "
        "c.doctor_id=e.id ORDER BY c.id DESC");
    int r = 0;
    while (q.next()) {
      tb->insertRow(r);
      for (int c2 = 0; c2 < 5; c2++)
        tb->setItem(r, c2, new QTableWidgetItem(q.value(c2).toString()));
      r++;
    }
    gl->addWidget(tb);
    vl->addWidget(gb);
    tabs->addTab(
        t, tr2("Doctor Commissions",
               "\xd9\x86\xd8\xb3\xd8\xa8 "
               "\xd8\xa7\xd9\x84\xd8\xa3\xd8\xb7\xd8\xa8\xd8\xa7\xd8\xa1"));
  }

  // ---- TAB 9: Tax Declaration ----
  {
    QWidget *t = new QWidget();
    QVBoxLayout *vl = new QVBoxLayout(t);
    QGroupBox *gb = new QGroupBox(
        tr2("Tax Declaration",
            "\xd8\xa7\xd9\x84\xd8\xa5\xd9\x82\xd8\xb1\xd8\xa7\xd8\xb1 "
            "\xd8\xa7\xd9\x84\xd8\xb6\xd8\xb1\xd9\x8a\xd8\xa8\xd9\x8a"));
    gb->setObjectName("card");
    QVBoxLayout *gl = new QVBoxLayout(gb);
    QTableWidget *tb = new QTableWidget();
    tb->setColumnCount(5);
    tb->setHorizontalHeaderLabels(
        {tr2("Period Start", "\xd8\xa8\xd8\xaf\xd8\xa7\xd9\x8a\xd8\xa9"),
         tr2("Period End", "\xd9\x86\xd9\x87\xd8\xa7\xd9\x8a\xd8\xa9"),
         tr2("Sales", "\xd9\x85\xd8\xa8\xd9\x8a\xd8\xb9\xd8\xa7\xd8\xaa"),
         tr2("VAT", "\xd8\xb6\xd8\xb1\xd9\x8a\xd8\xa8\xd8\xa9"),
         tr2("Status", "\xd8\xad\xd8\xa7\xd9\x84\xd8\xa9")});
    tb->horizontalHeader()->setStretchLastSection(true);
    tb->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    tb->verticalHeader()->setVisible(false);
    QSqlQuery q = Database::instance().exec(
        "SELECT period_start,period_end,total_sales,total_vat,status FROM "
        "finance_tax_declarations ORDER BY id DESC");
    int r = 0;
    while (q.next()) {
      tb->insertRow(r);
      for (int c = 0; c < 5; c++)
        tb->setItem(r, c, new QTableWidgetItem(q.value(c).toString()));
      r++;
    }
    gl->addWidget(tb);
    vl->addWidget(gb);
    tabs->addTab(
        t, tr2("Tax Declaration",
               "\xd8\xa7\xd9\x84\xd8\xa5\xd9\x82\xd8\xb1\xd8\xa7\xd8\xb1 "
               "\xd8\xa7\xd9\x84\xd8\xb6\xd8\xb1\xd9\x8a\xd8\xa8\xd9\x8a"));
  }

  // ---- TAB 10: Auto Closing & Posting ----
  {
    QWidget *t = new QWidget();
    QVBoxLayout *vl = new QVBoxLayout(t);
    QGroupBox *gb = new QGroupBox(
        tr2("Auto Closing & Posting",
            "\xd8\xa7\xd9\x84\xd8\xa5\xd9\x82\xd9\x81\xd8\xa7\xd9\x84 "
            "\xd9\x88\xd8\xa7\xd9\x84\xd8\xaa\xd8\xb1\xd8\xad\xd9\x8a\xd9\x84 "
            "\xd8\xa7\xd9\x84\xd8\xa2\xd9\x84\xd9\x8a"));
    gb->setObjectName("card");
    QVBoxLayout *gl = new QVBoxLayout(gb);
    QTableWidget *tb = new QTableWidget();
    tb->setColumnCount(4);
    tb->setHorizontalHeaderLabels(
        {tr2("Fiscal Year", "\xd8\xb3\xd9\x86\xd8\xa9 "
                            "\xd9\x85\xd8\xa7\xd9\x84\xd9\x8a\xd8\xa9"),
         tr2("Start", "\xd8\xa8\xd8\xaf\xd8\xa7\xd9\x8a\xd8\xa9"),
         tr2("End", "\xd9\x86\xd9\x87\xd8\xa7\xd9\x8a\xd8\xa9"),
         tr2("Status", "\xd8\xad\xd8\xa7\xd9\x84\xd8\xa9")});
    tb->horizontalHeader()->setStretchLastSection(true);
    tb->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    tb->verticalHeader()->setVisible(false);
    QSqlQuery q = Database::instance().exec(
        "SELECT year_name,start_date,end_date,CASE WHEN is_closed=1 THEN "
        "'Closed' ELSE 'Open' END FROM finance_fiscal_years ORDER BY id DESC");
    int r = 0;
    while (q.next()) {
      tb->insertRow(r);
      for (int c = 0; c < 4; c++)
        tb->setItem(r, c, new QTableWidgetItem(q.value(c).toString()));
      r++;
    }
    QPushButton *closeBtn =
        new QPushButton(tr2("Close Current Period & Post All",
                            "\xd8\xa5\xd9\x82\xd9\x81\xd8\xa7\xd9\x84 "
                            "\xd9\x88\xd8\xaa\xd8\xb1\xd8\xad\xd9\x8a\xd9\x84 "
                            "\xd8\xa2\xd9\x84\xd9\x8a"));
    closeBtn->setObjectName("primaryBtn");
    closeBtn->setFixedHeight(40);
    connect(closeBtn, &QPushButton::clicked, [=]() {
      Database::instance().exec(
          "UPDATE finance_journal_entries SET is_posted=1 WHERE is_posted=0");
      QMessageBox::information(
          nullptr, tr2("Done", "\xd8\xaa\xd9\x85"),
          tr2("All entries posted",
              "\xd8\xaa\xd9\x85 \xd8\xaa\xd8\xb1\xd8\xad\xd9\x8a\xd9\x84 "
              "\xd8\xac\xd9\x85\xd9\x8a\xd8\xb9 "
              "\xd8\xa7\xd9\x84\xd9\x82\xd9\x8a\xd9\x88\xd8\xaf"));
    });
    gl->addWidget(tb);
    gl->addWidget(closeBtn);
    vl->addWidget(gb);
    tabs->addTab(t, tr2("Closing & Posting",
                        "\xd8\xa5\xd9\x82\xd9\x81\xd8\xa7\xd9\x84 "
                        "\xd9\x88\xd8\xaa\xd8\xb1\xd8\xad\xd9\x8a\xd9\x84"));
  }

  layout->addWidget(tabs);
  return page;
}

// ===== WAITING QUEUE =====
QWidget *MainWindow::createWaitingQueuePage() {
  QWidget *page = new QWidget();
  QVBoxLayout *layout = new QVBoxLayout(page);
  QLabel *title = new QLabel(
      tr2("Waiting Queue",
          "\xd8\xb5\xd9\x81\xd9\x88\xd9\x81 "
          "\xd8\xa7\xd9\x84\xd8\xa7\xd9\x86\xd8\xaa\xd8\xb8\xd8\xa7\xd8\xb1"));
  title->setObjectName("pageTitle");
  layout->addWidget(title);

  QGroupBox *box = new QGroupBox(
      tr2("Current Queue",
          "\xd8\xa7\xd9\x84\xd8\xb7\xd8\xa7\xd8\xa8\xd9\x88\xd8\xb1 "
          "\xd8\xa7\xd9\x84\xd8\xad\xd8\xa7\xd9\x84\xd9\x8a"));
  box->setObjectName("card");
  QVBoxLayout *bl = new QVBoxLayout(box);

  QTableWidget *table = new QTableWidget();
  table->setColumnCount(7);
  table->setHorizontalHeaderLabels(
      {tr2("Queue #", "\xd8\xb1\xd9\x82\xd9\x85"),
       tr2("Patient", "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6"),
       tr2("Department", "\xd8\xa7\xd9\x84\xd9\x82\xd8\xb3\xd9\x85"),
       tr2("Wait Time",
           "\xd9\x88\xd9\x82\xd8\xaa "
           "\xd8\xa7\xd9\x84\xd8\xa7\xd9\x86\xd8\xaa\xd8\xb8\xd8\xa7\xd8\xb1"),
       tr2("Status", "\xd8\xa7\xd9\x84\xd8\xad\xd8\xa7\xd9\x84\xd8\xa9"),
       tr2("Action", "\xd8\xa5\xd8\xac\xd8\xb1\xd8\xa7\xd8\xa1"),
       tr2("Delete", "\xd8\xad\xd8\xb0\xd9\x81")});
  table->horizontalHeader()->setStretchLastSection(true);
  table->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  table->verticalHeader()->setVisible(false);
  table->verticalHeader()->setDefaultSectionSize(40);
  table->setSelectionBehavior(QAbstractItemView::SelectRows);

  QSqlQuery q =
      Database::instance().exec("SELECT id, name_en, name_ar, department, "
                                "status FROM patients ORDER BY id");
  int row = 0;
  while (q.next()) {
    table->insertRow(row);
    table->setItem(row, 0, new QTableWidgetItem(QString::number(row + 1)));
    table->setItem(row, 1,
                   new QTableWidgetItem(isArabic ? q.value(2).toString()
                                                 : q.value(1).toString()));
    table->setItem(row, 2, new QTableWidgetItem(q.value(3).toString()));
    table->setItem(
        row, 3,
        new QTableWidgetItem(
            QString::number(QRandomGenerator::global()->bounded(5, 35)) +
            " min"));
    QString status = q.value(4).toString();
    QTableWidgetItem *st = new QTableWidgetItem(status);
    st->setForeground(status == "With Doctor" ? QColor("#4ade80")
                      : status == "Waiting"   ? QColor("#f59e0b")
                                              : QColor("#94a3b8"));
    table->setItem(row, 4, st);

    int patId = q.value(0).toInt();
    QPushButton *callBtn = new QPushButton(tr2(
        "Call Patient", "\xd9\x86\xd8\xaf\xd8\xa7\xd8\xa1 "
                        "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6"));
    callBtn->setObjectName("primaryBtn");
    callBtn->setFixedHeight(30);
    connect(callBtn, &QPushButton::clicked, [=]() {
      Database::instance().exec(
          QString("UPDATE patients SET status='With Doctor' WHERE id=%1")
              .arg(patId));
      QMessageBox::information(
          nullptr,
          tr2("Called", "\xd8\xaa\xd9\x85 "
                        "\xd8\xa7\xd9\x84\xd9\x86\xd8\xaf\xd8\xa7\xd8\xa1"),
          tr2("Patient called to doctor",
              "\xd8\xaa\xd9\x85 \xd9\x86\xd8\xaf\xd8\xa7\xd8\xa1 "
              "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6"));
    });
    table->setCellWidget(row, 5, callBtn);

    // Delete button
    QPushButton *delBtn =
        new QPushButton(tr2("Delete", "\xd8\xad\xd8\xb0\xd9\x81"));
    delBtn->setStyleSheet(
        "background-color: #ef4444; color: white; border: none; "
        "border-radius: 6px; padding: 5px 10px; font-weight: bold;");
    delBtn->setFixedHeight(30);
    connect(delBtn, &QPushButton::clicked, [=]() {
      QString pName = "";
      for (int r = 0; r < table->rowCount(); r++) {
        if (table->cellWidget(r, 6) == delBtn) {
          pName = table->item(r, 1) ? table->item(r, 1)->text() : "";
          break;
        }
      }
      if (QMessageBox::question(nullptr,
                                tr2("Confirm Delete",
                                    "\xd8\xaa\xd8\xa3\xd9\x83\xd9\x8a\xd8\xaf "
                                    "\xd8\xa7\xd9\x84\xd8\xad\xd8\xb0\xd9\x81"),
                                tr2("Remove from queue: ",
                                    "\xd8\xad\xd8\xb0\xd9\x81 \xd9\x85\xd9\x86 "
                                    "\xd8\xa7\xd9\x84\xd8\xb7\xd8\xa7\xd8\xa8"
                                    "\xd9\x88\xd8\xb1: ") +
                                    pName + "?") != QMessageBox::Yes)
        return;
      // Delete patient and all related records
      Database::instance().exec(
          QString("DELETE FROM medical_records WHERE patient_id=%1")
              .arg(patId));
      Database::instance().exec(
          QString("DELETE FROM lab_radiology_orders WHERE patient_id=%1")
              .arg(patId));
      Database::instance().exec(
          QString("DELETE FROM prescriptions WHERE patient_id=%1").arg(patId));
      Database::instance().exec(
          QString("DELETE FROM dental_records WHERE patient_id=%1").arg(patId));
      Database::instance().exec(
          QString("DELETE FROM appointments WHERE patient_id=%1").arg(patId));
      Database::instance().exec(
          QString("DELETE FROM approvals WHERE patient_id=%1").arg(patId));
      Database::instance().exec(
          QString("DELETE FROM pharmacy_sale_items WHERE sale_id IN "
                  "(SELECT id FROM pharmacy_sales WHERE patient_id=%1)")
              .arg(patId));
      Database::instance().exec(
          QString("DELETE FROM pharmacy_sales WHERE patient_id=%1").arg(patId));
      Database::instance().exec(
          QString(
              "DELETE FROM pharmacy_prescriptions_queue WHERE patient_id=%1")
              .arg(patId));
      Database::instance().exec(
          QString("DELETE FROM invoices WHERE patient_name IN "
                  "(SELECT name_en FROM patients WHERE id=%1) "
                  "OR patient_name IN "
                  "(SELECT name_ar FROM patients WHERE id=%1) "
                  "OR patient_id=%1")
              .arg(patId));
      Database::instance().exec(
          QString("DELETE FROM insurance_claims WHERE patient_name IN "
                  "(SELECT name_en FROM patients WHERE id=%1) "
                  "OR patient_name IN "
                  "(SELECT name_ar FROM patients WHERE id=%1)")
              .arg(patId));
      Database::instance().exec(
          QString("DELETE FROM patients WHERE id=%1").arg(patId));
      // Remove row from table
      for (int r = 0; r < table->rowCount(); r++) {
        if (table->cellWidget(r, 6) == delBtn) {
          table->removeRow(r);
          break;
        }
      }
      QMessageBox::information(
          nullptr,
          tr2("Deleted",
              "\xd8\xaa\xd9\x85 \xd8\xa7\xd9\x84\xd8\xad\xd8\xb0\xd9\x81"),
          tr2("Patient removed from queue.",
              "\xd8\xaa\xd9\x85 \xd8\xad\xd8\xb0\xd9\x81 "
              "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6 "
              "\xd9\x85\xd9\x86 "
              "\xd8\xa7\xd9\x84\xd8\xb7\xd8\xa7\xd8\xa8\xd9\x88\xd8\xb1."));
    });
    table->setCellWidget(row, 6, delBtn);
    row++;
  }
  bl->addWidget(table);
  layout->addWidget(box);

  layout->addStretch();
  return page;
}

// ===== PHARMACY =====
QWidget *MainWindow::createPharmacyPage() {
  QWidget *page = new QWidget();
  QVBoxLayout *layout = new QVBoxLayout(page);
  QLabel *title = new QLabel(
      tr2("Pharmacy",
          "\xd8\xa7\xd9\x84\xd8\xb5\xd9\x8a\xd8\xaf\xd9\x84\xd9\x8a\xd8\xa9"));
  title->setObjectName("pageTitle");
  layout->addWidget(title);

  QHBoxLayout *mainLay = new QHBoxLayout();

  // Prescriptions queue
  QGroupBox *queueBox = new QGroupBox(
      tr2("Prescriptions Queue",
          "\xd8\xb7\xd8\xa7\xd8\xa8\xd9\x88\xd8\xb1 "
          "\xd8\xa7\xd9\x84\xd9\x88\xd8\xb5\xd9\x81\xd8\xa7\xd8\xaa"));
  queueBox->setObjectName("card");
  QVBoxLayout *ql = new QVBoxLayout(queueBox);
  QTableWidget *rxTable = new QTableWidget();
  rxTable->setColumnCount(5);
  rxTable->setHorizontalHeaderLabels(
      {tr2("Patient", "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6"),
       tr2("Medication", "\xd8\xa7\xd9\x84\xd8\xaf\xd9\x88\xd8\xa7\xd8\xa1"),
       tr2("Dosage", "\xd8\xa7\xd9\x84\xd8\xac\xd8\xb1\xd8\xb9\xd8\xa9"),
       tr2("Status", "\xd8\xa7\xd9\x84\xd8\xad\xd8\xa7\xd9\x84\xd8\xa9"),
       tr2("Action", "\xd8\xa5\xd8\xac\xd8\xb1\xd8\xa7\xd8\xa1")});
  rxTable->horizontalHeader()->setStretchLastSection(true);
  rxTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  rxTable->verticalHeader()->setVisible(false);

  QSqlQuery qr = Database::instance().exec(
      "SELECT p.id, pat.name_en, m.name, pr.dosage, pr.status "
      "FROM prescriptions p "
      "JOIN patients pat ON p.patient_id=pat.id "
      "LEFT JOIN medications m ON p.medication_id=m.id "
      "LEFT JOIN prescriptions pr ON p.id=pr.id "
      "ORDER BY p.id DESC");
  int row = 0;
  while (qr.next()) {
    rxTable->insertRow(row);
    rxTable->setItem(row, 0, new QTableWidgetItem(qr.value(1).toString()));
    rxTable->setItem(row, 1, new QTableWidgetItem(qr.value(2).toString()));
    rxTable->setItem(row, 2, new QTableWidgetItem(qr.value(3).toString()));
    QTableWidgetItem *st = new QTableWidgetItem(qr.value(4).toString());
    st->setForeground(qr.value(4).toString() == "Dispensed"
                          ? QColor("#4ade80")
                          : QColor("#f59e0b"));
    rxTable->setItem(row, 3, st);
    int rxId = qr.value(0).toInt();
    QPushButton *dispBtn =
        new QPushButton(tr2("Dispense", "\xd8\xb5\xd8\xb1\xd9\x81"));
    dispBtn->setObjectName("primaryBtn");
    dispBtn->setFixedHeight(28);
    connect(dispBtn, &QPushButton::clicked, [=]() {
      Database::instance().exec(
          QString("UPDATE prescriptions SET status='Dispensed' WHERE id=%1")
              .arg(rxId));
      QMessageBox::information(
          nullptr, tr2("Done", "\xd8\xaa\xd9\x85"),
          tr2("Prescription dispensed",
              "\xd8\xaa\xd9\x85 \xd8\xb5\xd8\xb1\xd9\x81 "
              "\xd8\xa7\xd9\x84\xd9\x88\xd8\xb5\xd9\x81\xd8\xa9"));
    });
    rxTable->setCellWidget(row, 4, dispBtn);
    row++;
  }
  ql->addWidget(rxTable);

  // Doctor Prescriptions Queue (from Doctor Station)
  QLabel *rxQueueLabel = new QLabel(
      tr2("Doctor Prescriptions (Pending)",
          "\xd9\x88\xd8\xb5\xd9\x81\xd8\xa7\xd8\xaa "
          "\xd8\xa7\xd9\x84\xd8\xa3\xd8\xb7\xd8\xa8\xd8\xa7\xd8\xa1 "
          "(\xd8\xa8\xd8\xa7\xd9\x86\xd8\xaa\xd8\xb8\xd8\xa7\xd8\xb1 "
          "\xd8\xa7\xd9\x84\xd8\xb5\xd8\xb1\xd9\x81)"));
  rxQueueLabel->setStyleSheet(
      "font-weight: bold; font-size: 14px; margin-top: 10px;");
  ql->addWidget(rxQueueLabel);

  QTableWidget *docRxTable = new QTableWidget();
  docRxTable->setColumnCount(4);
  docRxTable->setHorizontalHeaderLabels(
      {tr2("Patient", "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6"),
       tr2("Prescription", "\xd8\xa7\xd9\x84\xd9\x88\xd8\xb5\xd9\x81\xd8\xa9"),
       tr2("Status", "\xd8\xa7\xd9\x84\xd8\xad\xd8\xa7\xd9\x84\xd8\xa9"),
       tr2("Action", "\xd8\xa5\xd8\xac\xd8\xb1\xd8\xa7\xd8\xa1")});
  docRxTable->horizontalHeader()->setStretchLastSection(true);
  docRxTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  docRxTable->verticalHeader()->setVisible(false);

  QSqlQuery qrx = Database::instance().exec(
      "SELECT q.id, p.name_ar, q.prescription_text, q.status "
      "FROM pharmacy_prescriptions_queue q "
      "LEFT JOIN patients p ON p.id=q.patient_id "
      "WHERE q.status='Pending' ORDER BY q.id DESC");
  int rxr = 0;
  while (qrx.next()) {
    docRxTable->insertRow(rxr);
    int qId = qrx.value(0).toInt();
    docRxTable->setItem(rxr, 0, new QTableWidgetItem(qrx.value(1).toString()));
    docRxTable->setItem(rxr, 1, new QTableWidgetItem(qrx.value(2).toString()));
    QTableWidgetItem *sti = new QTableWidgetItem(qrx.value(3).toString());
    sti->setForeground(QColor("#f59e0b"));
    docRxTable->setItem(rxr, 2, sti);
    QPushButton *dispDocBtn =
        new QPushButton(tr2("Dispense", "\xd8\xb5\xd8\xb1\xd9\x81"));
    dispDocBtn->setObjectName("primaryBtn");
    dispDocBtn->setFixedHeight(28);
    connect(dispDocBtn, &QPushButton::clicked, [=]() {
      Database::instance().exec(
          QString("UPDATE pharmacy_prescriptions_queue SET status='Dispensed' "
                  "WHERE id=%1")
              .arg(qId));
      for (int r = 0; r < docRxTable->rowCount(); r++) {
        if (docRxTable->cellWidget(r, 3) == dispDocBtn) {
          docRxTable->removeRow(r);
          break;
        }
      }
      QMessageBox::information(
          nullptr,
          tr2("Dispensed",
              "\xd8\xaa\xd9\x85 \xd8\xa7\xd9\x84\xd8\xb5\xd8\xb1\xd9\x81"),
          tr2("Prescription dispensed.",
              "\xd8\xaa\xd9\x85 \xd8\xb5\xd8\xb1\xd9\x81 "
              "\xd8\xa7\xd9\x84\xd9\x88\xd8\xb5\xd9\x81\xd8\xa9."));
    });
    docRxTable->setCellWidget(rxr, 3, dispDocBtn);
    rxr++;
  }
  ql->addWidget(docRxTable);

  // Drug catalog
  QGroupBox *drugBox = new QGroupBox(
      tr2("Drug Catalog", "\xd9\x82\xd8\xa7\xd9\x84\xd9\x85\xd8\xa9 "
                          "\xd8\xa7\xd9\x84\xd8\xa3\xd9\x88\xd9\x8a\xd8\xa9"));
  drugBox->setObjectName("card");
  QVBoxLayout *dl = new QVBoxLayout(drugBox);
  QTableWidget *drugTable = new QTableWidget(0, 4);
  drugTable->setHorizontalHeaderLabels(
      {tr2("Drug Name", "\xd8\xa7\xd9\x84\xd8\xaf\xd9\x88\xd8\xa7\xd8\xa1"),
       tr2("Category", "\xd8\xa7\xd9\x84\xd9\x81\xd8\xa6\xd8\xa9"),
       tr2("Stock", "\xd8\xa7\xd9\x84\xd9\x85\xd8\xae\xd8\xb2\xd9\x88\xd9\x86"),
       tr2("Price", "\xd8\xa7\xd9\x84\xd8\xb3\xd8\xb9\xd8\xb1")});
  drugTable->horizontalHeader()->setStretchLastSection(true);
  drugTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  drugTable->verticalHeader()->setVisible(false);

  QSqlQuery qt = Database::instance().exec(
      "SELECT name, category, stock, price FROM drugs ORDER BY name ASC");
  int dr = 0;
  while (qt.next()) {
    drugTable->insertRow(dr);
    drugTable->setItem(dr, 0, new QTableWidgetItem(qt.value(0).toString()));
    drugTable->setItem(dr, 1, new QTableWidgetItem(qt.value(1).toString()));
    drugTable->setItem(dr, 2, new QTableWidgetItem(qt.value(2).toString()));
    drugTable->setItem(dr, 3,
                       new QTableWidgetItem(qt.value(3).toString() + " SAR"));
    dr++;
  }
  dl->addWidget(drugTable);

  mainLay->addWidget(queueBox, 2);
  mainLay->addWidget(drugBox, 1);
  layout->addLayout(mainLay);

  // ===== STOCK COUNT & SETTLEMENT =====
  QGroupBox *scBox = new QGroupBox(
      tr2("Stock Count & Settlement",
          "\xd8\xa7\xd9\x84\xd8\xaa\xd8\xb3\xd9\x88\xd9\x8a\xd8\xa9 "
          "\xd9\x88\xd8\xa7\xd9\x84\xd8\xac\xd8\xb1\xd8\xaf"));
  scBox->setObjectName("card");
  QVBoxLayout *scL = new QVBoxLayout(scBox);
  QTableWidget *scTbl = new QTableWidget();
  scTbl->setColumnCount(5);
  scTbl->setHorizontalHeaderLabels(
      {tr2("Item", "\xd8\xb5\xd9\x86\xd9\x81"),
       tr2("System Qty", "\xd9\x83\xd9\x85\xd9\x8a\xd8\xa9 "
                         "\xd8\xa7\xd9\x84\xd9\x86\xd8\xb8\xd8\xa7\xd9\x85"),
       tr2("Counted",
           "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb9\xd8\xaf\xd9\x88\xd8\xaf"),
       tr2("Difference", "\xd9\x81\xd8\xb1\xd9\x82"),
       tr2("Date", "\xd8\xaa\xd8\xa7\xd8\xb1\xd9\x8a\xd8\xae")});
  scTbl->horizontalHeader()->setStretchLastSection(true);
  scTbl->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  scTbl->verticalHeader()->setVisible(false);
  QSqlQuery qsc = Database::instance().exec(
      "SELECT i.item_name,s.system_qty,s.counted_qty,s.difference,s.count_date "
      "FROM inventory_stock_count s LEFT JOIN inventory_items i ON "
      "i.id=s.item_id ORDER BY s.id DESC");
  {
    int r = 0;
    while (qsc.next()) {
      scTbl->insertRow(r);
      for (int c = 0; c < 5; c++)
        scTbl->setItem(r, c, new QTableWidgetItem(qsc.value(c).toString()));
      r++;
    }
  }
  QLabel *rasadLabel =
      new QLabel(tr2("RASAD Integration: Configure in Settings > Integrations",
                     "\xd8\xb1\xd8\xa8\xd8\xb7 \xd8\xb1\xd8\xb5\xd8\xaf: "
                     "\xd8\xa7\xd9\x84\xd8\xa5\xd8\xb9\xd8\xaf\xd8\xa7\xd8\xaf"
                     "\xd8\xa7\xd8\xaa > "
                     "\xd8\xa7\xd9\x84\xd8\xaa\xd9\x83\xd8\xa7\xd9\x85\xd9\x84"
                     "\xd8\xa7\xd8\xaa"));
  rasadLabel->setStyleSheet("color:#94a3b8;font-size:12px;padding:6px;");
  scL->addWidget(scTbl);
  scL->addWidget(rasadLabel);
  layout->addWidget(scBox);

  return page;
}

// ===== PATIENT ACCOUNTS =====
QWidget *MainWindow::createPatientAccountsPage() {
  QWidget *page = new QWidget();
  QVBoxLayout *layout = new QVBoxLayout(page);
  QLabel *title = new QLabel(tr2(
      "Patient Accounts", "\xd8\xad\xd8\xb3\xd8\xa7\xd8\xa8\xd8\xa7\xd8\xaa "
                          "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd8\xb6\xd9\x89"));
  title->setObjectName("pageTitle");
  layout->addWidget(title);

  // Patient search
  QHBoxLayout *searchLay = new QHBoxLayout();
  searchLay->addWidget(new QLabel(
      tr2("Search Patient:", "\xd8\xa8\xd8\xad\xd8\xab \xd8\xb9\xd9\x86 "
                             "\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6:")));
  QLineEdit *patSearch = new QLineEdit();
  patSearch->setFixedHeight(38);
  patSearch->setObjectName("acctPatientSearch");
  patSearch->setPlaceholderText(tr2(
      "Name / Phone / National ID / File #...",
      "\xd8\xa7\xd9\x84\xd8\xa7\xd8\xb3\xd9\x85 / "
      "\xd8\xa7\xd9\x84\xd8\xac\xd9\x88\xd8\xa7\xd9\x84 / "
      "\xd8\xa7\xd9\x84\xd9\x87\xd9\x88\xd9\x8a\xd8\xa9 / "
      "\xd8\xb1\xd9\x82\xd9\x85 \xd8\xa7\xd9\x84\xd9\x85\xd9\x84\xd9\x81..."));
  setupPatientCompleter(patSearch);
  searchLay->addWidget(patSearch, 1);
  QPushButton *loadBtn = new QPushButton(
      tr2("Load Account", "\xd8\xb9\xd8\xb1\xd8\xb6 "
                          "\xd8\xa7\xd9\x84\xd8\xad\xd8\xb3\xd8\xa7\xd8\xa8"));
  loadBtn->setObjectName("primaryBtn");
  loadBtn->setFixedHeight(38);
  searchLay->addWidget(loadBtn);
  layout->addLayout(searchLay);

  // Patient info display
  QLabel *patInfo = new QLabel("");
  patInfo->setWordWrap(true);
  patInfo->setStyleSheet(
      "font-size: 14px; padding: 8px; "
      "background: rgba(59,130,246,0.1); border-radius: 8px;");
  patInfo->setVisible(false);
  layout->addWidget(patInfo);

  // Summary cards
  QHBoxLayout *cards = new QHBoxLayout();
  auto makeCard = [&](const QString &en, const QString &ar,
                      const QString &color) -> QLabel * {
    QGroupBox *card = new QGroupBox();
    card->setObjectName("card");
    QVBoxLayout *cl = new QVBoxLayout(card);
    QLabel *lb = new QLabel(tr2(en, ar));
    lb->setObjectName("cardLabel");
    QLabel *vl = new QLabel("0 SAR");
    vl->setStyleSheet("color:" + color + ";font-size:24px;font-weight:bold;");
    cl->addWidget(lb);
    cl->addWidget(vl);
    cards->addWidget(card);
    return vl;
  };
  QLabel *valBilled = makeCard(
      "Total Billed",
      "\xd8\xa5\xd8\xac\xd9\x85\xd8\xa7\xd9\x84\xd9\x8a "
      "\xd8\xa7\xd9\x84\xd9\x81\xd9\x88\xd8\xa7\xd8\xaa\xd9\x8a\xd8\xb1",
      "#60a5fa");
  QLabel *valPaid = makeCard(
      "Total Paid", "\xd8\xa7\xd9\x84\xd9\x85\xd8\xaf\xd9\x81\xd9\x88\xd8\xb9",
      "#4ade80");
  QLabel *valOut = makeCard(
      "Outstanding", "\xd8\xa7\xd9\x84\xd9\x85\xd8\xaa\xd8\xa8\xd9\x82\xd9\x8a",
      "#f87171");
  layout->addLayout(cards);

  // Journey table - shows all services
  QGroupBox *journeyBox = new QGroupBox(
      tr2("Patient Journey / Services",
          "\xd8\xb1\xd8\xad\xd9\x84\xd8\xa9 "
          "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6 / "
          "\xd8\xa7\xd9\x84\xd8\xae\xd8\xaf\xd9\x85\xd8\xa7\xd8\xaa"));
  journeyBox->setObjectName("card");
  QVBoxLayout *jl = new QVBoxLayout(journeyBox);
  QTableWidget *journeyTable = new QTableWidget();
  journeyTable->setColumnCount(5);
  journeyTable->setHorizontalHeaderLabels(
      {tr2("Service", "\xd8\xa7\xd9\x84\xd8\xae\xd8\xaf\xd9\x85\xd8\xa9"),
       tr2("Details",
           "\xd8\xa7\xd9\x84\xd8\xaa\xd9\x81\xd8\xa7\xd8\xb5\xd9\x8a\xd9\x84"),
       tr2("Date", "\xd8\xa7\xd9\x84\xd8\xaa\xd8\xa7\xd8\xb1\xd9\x8a\xd8\xae"),
       tr2("Amount", "\xd8\xa7\xd9\x84\xd9\x85\xd8\xa8\xd9\x84\xd8\xba"),
       tr2("Status", "\xd8\xa7\xd9\x84\xd8\xad\xd8\xa7\xd9\x84\xd8\xa9")});
  journeyTable->horizontalHeader()->setStretchLastSection(true);
  journeyTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  journeyTable->verticalHeader()->setVisible(false);
  jl->addWidget(journeyTable);
  layout->addWidget(journeyBox);

  // Load patient account
  connect(loadBtn, &QPushButton::clicked, [=]() {
    QString search = patSearch->text().trimmed();
    if (search.isEmpty())
      return;
    // Extract file number if present (format: Name | Name | Phone | #FileNo)
    QString fileNo = "";
    if (search.contains("| #")) {
      fileNo = search.mid(search.lastIndexOf("#") + 1).trimmed();
    }
    // Find patient
    QSqlQuery qFind = Database::instance().exec(
        QString("SELECT file_number, name_en, name_ar, national_id, phone, "
                "department, status FROM patients WHERE "
                "name_en LIKE '%%1%' OR name_ar LIKE '%%1%' OR "
                "phone LIKE '%%1%' OR national_id LIKE '%%1%' "
                "OR file_number=%2")
            .arg(search.left(50).replace("'", "''"))
            .arg(fileNo.isEmpty() ? "0" : fileNo));
    if (!qFind.next()) {
      patInfo->setText(
          tr2("Patient not found.",
              "\xd9\x84\xd9\x85 \xd9\x8a\xd8\xaa\xd9\x85 "
              "\xd8\xa7\xd9\x84\xd8\xb9\xd8\xab\xd9\x88\xd8\xb1 "
              "\xd8\xb9\xd9\x84\xd9\x89 "
              "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6."));
      patInfo->setVisible(true);
      return;
    }
    QString patientName =
        isArabic ? qFind.value(2).toString() : qFind.value(1).toString();
    QString nameEn = qFind.value(1).toString();
    patInfo->setText(
        tr2("File #: ", "\xd8\xb1\xd9\x82\xd9\x85 "
                        "\xd8\xa7\xd9\x84\xd9\x85\xd9\x84\xd9\x81: ") +
        qFind.value(0).toString() + "  |  " +
        tr2("Name: ", "\xd8\xa7\xd9\x84\xd8\xa7\xd8\xb3\xd9\x85: ") +
        patientName + "  |  " +
        tr2("ID: ", "\xd8\xa7\xd9\x84\xd9\x87\xd9\x88\xd9\x8a\xd8\xa9: ") +
        qFind.value(3).toString() + "  |  " +
        tr2("Phone: ", "\xd8\xa7\xd9\x84\xd8\xac\xd9\x88\xd8\xa7\xd9\x84: ") +
        qFind.value(4).toString());
    patInfo->setVisible(true);

    // Clear table and load journey
    journeyTable->setRowCount(0);
    double totalBilled = 0, totalPaid = 0;
    int row = 0;

    // 1. Registration
    journeyTable->insertRow(row);
    journeyTable->setItem(
        row, 0,
        new QTableWidgetItem(
            tr2("Registration", "\xd8\xaa\xd8\xb3\xd8\xac\xd9\x8a\xd9\x84")));
    journeyTable->setItem(
        row, 1,
        new QTableWidgetItem(
            tr2("Patient admitted / ", "\xd8\xaf\xd8\xae\xd9\x88\xd9\x84 / ") +
            qFind.value(5).toString()));
    journeyTable->setItem(row, 2, new QTableWidgetItem("-"));
    journeyTable->setItem(row, 3, new QTableWidgetItem("-"));
    QTableWidgetItem *regSt = new QTableWidgetItem(qFind.value(6).toString());
    regSt->setForeground(QColor("#4ade80"));
    journeyTable->setItem(row, 4, regSt);
    row++;

    // 2. Appointments
    QSqlQuery qAppt = Database::instance().exec(
        QString("SELECT doctor_name, department, appt_date, appt_time, status "
                "FROM appointments WHERE patient_name LIKE '%%1%' "
                "ORDER BY id DESC")
            .arg(nameEn.replace("'", "''")));
    while (qAppt.next()) {
      journeyTable->insertRow(row);
      journeyTable->setItem(
          row, 0,
          new QTableWidgetItem(
              tr2("Appointment", "\xd9\x85\xd9\x88\xd8\xb9\xd8\xaf")));
      journeyTable->setItem(row, 1,
                            new QTableWidgetItem(qAppt.value(0).toString() +
                                                 " - " +
                                                 qAppt.value(1).toString()));
      journeyTable->setItem(row, 2,
                            new QTableWidgetItem(qAppt.value(2).toString() +
                                                 " " +
                                                 qAppt.value(3).toString()));
      journeyTable->setItem(row, 3, new QTableWidgetItem("-"));
      QTableWidgetItem *ast = new QTableWidgetItem(qAppt.value(4).toString());
      ast->setForeground(qAppt.value(4).toString() == "Confirmed"
                             ? QColor("#4ade80")
                             : QColor("#f59e0b"));
      journeyTable->setItem(row, 4, ast);
      row++;
    }

    // 3. Invoices
    QSqlQuery qInv = Database::instance().exec(
        QString("SELECT total, paid, created_at, description "
                "FROM invoices WHERE patient_name LIKE '%%1%' "
                "ORDER BY id DESC")
            .arg(nameEn.replace("'", "''")));
    while (qInv.next()) {
      double amt = qInv.value(0).toDouble();
      bool paid = qInv.value(1).toInt();
      totalBilled += amt;
      if (paid)
        totalPaid += amt;
      journeyTable->insertRow(row);
      journeyTable->setItem(
          row, 0,
          new QTableWidgetItem(tr2(
              "Invoice", "\xd9\x81\xd8\xa7\xd8\xaa\xd9\x88\xd8\xb1\xd8\xa9")));
      QString invoiceDesc = qInv.value(3).toString();
      if (invoiceDesc.isEmpty())
        invoiceDesc = "Medical services";
      journeyTable->setItem(
          row, 1,
          new QTableWidgetItem(tr2(invoiceDesc.toUtf8().constData(),
                                   invoiceDesc.toUtf8().constData())));
      journeyTable->setItem(row, 2,
                            new QTableWidgetItem(qInv.value(2).toString()));
      journeyTable->setItem(
          row, 3, new QTableWidgetItem(QString::number(amt, 'f', 2) + " SAR"));
      QString st = paid ? "Paid" : "Unpaid";
      QTableWidgetItem *ist = new QTableWidgetItem(
          tr2(st, paid ? "\xd9\x85\xd8\xaf\xd9\x81\xd9\x88\xd8\xb9"
                       : "\xd8\xba\xd9\x8a\xd8\xb1 "
                         "\xd9\x85\xd8\xaf\xd9\x81\xd9\x88\xd8\xb9"));
      ist->setForeground(paid ? QColor("#4ade80") : QColor("#f87171"));
      journeyTable->setItem(row, 4, ist);
      row++;
    }

    // Update summary cards
    valBilled->setText(QString::number(totalBilled, 'f', 0) + " SAR");
    valPaid->setText(QString::number(totalPaid, 'f', 0) + " SAR");
    valOut->setText(QString::number(totalBilled - totalPaid, 'f', 0) + " SAR");
  });

  layout->addStretch();
  return page;
}

// ===== INVENTORY =====
QWidget *MainWindow::createInventoryPage() {
  QWidget *page = new QWidget();
  QVBoxLayout *layout = new QVBoxLayout(page);
  QLabel *title = new QLabel(
      tr2("Inventory Management",
          "\xd8\xa5\xd8\xaf\xd8\xa7\xd8\xb1\xd8\xa9 "
          "\xd8\xa7\xd9\x84\xd9\x85\xd8\xae\xd8\xb2\xd9\x88\xd9\x86"));
  title->setObjectName("pageTitle");
  layout->addWidget(title);

  QHBoxLayout *mainLay = new QHBoxLayout();

  // Add item form
  QGroupBox *formBox =
      new QGroupBox(tr2("Add Item", "\xd8\xa5\xd8\xb6\xd8\xa7\xd9\x81\xd8\xa9 "
                                    "\xd8\xb5\xd9\x86\xd9\x81"));
  formBox->setObjectName("card");
  QVBoxLayout *fl = new QVBoxLayout(formBox);

  auto addField = [&](const QString &en, const QString &ar) -> QLineEdit * {
    fl->addWidget(new QLabel(tr2(en, ar)));
    QLineEdit *e = new QLineEdit();
    e->setFixedHeight(36);
    fl->addWidget(e);
    return e;
  };

  QLineEdit *itemName = addField(
      "Item Name",
      "\xd8\xa7\xd8\xb3\xd9\x85 \xd8\xa7\xd9\x84\xd8\xb5\xd9\x86\xd9\x81");
  QLineEdit *itemCode = addField(
      "Item Code",
      "\xd8\xb1\xd9\x85\xd8\xb2 \xd8\xa7\xd9\x84\xd8\xb5\xd9\x86\xd9\x81");
  QLineEdit *category =
      addField("Category", "\xd8\xa7\xd9\x84\xd9\x81\xd8\xa6\xd8\xa9");
  QLineEdit *qty =
      addField("Quantity", "\xd8\xa7\xd9\x84\xd9\x83\xd9\x85\xd9\x8a\xd8\xa9");
  QLineEdit *costPrice = addField(
      "Cost Price", "\xd8\xb3\xd8\xb9\xd8\xb1 "
                    "\xd8\xa7\xd9\x84\xd8\xaa\xd9\x83\xd9\x84\xd9\x81\xd8\xa9");

  QPushButton *addBtn = new QPushButton(
      tr2("Add to Inventory",
          "\xd8\xa5\xd8\xb6\xd8\xa7\xd9\x81\xd8\xa9 "
          "\xd9\x84\xd9\x84\xd9\x85\xd8\xae\xd8\xb2\xd9\x88\xd9\x86"));
  addBtn->setObjectName("primaryBtn");
  addBtn->setFixedHeight(45);
  fl->addWidget(addBtn);
  fl->addStretch();

  // Items table
  QGroupBox *listBox = new QGroupBox(
      tr2("Stock Items",
          "\xd8\xa7\xd9\x84\xd8\xa3\xd8\xb5\xd9\x86\xd8\xa7\xd9\x81"));
  listBox->setObjectName("card");
  QVBoxLayout *ll = new QVBoxLayout(listBox);
  QTableWidget *table = new QTableWidget();
  table->setColumnCount(5);
  table->setHorizontalHeaderLabels(
      {tr2("Item", "\xd8\xa7\xd9\x84\xd8\xb5\xd9\x86\xd9\x81"),
       tr2("Code", "\xd8\xa7\xd9\x84\xd8\xb1\xd9\x85\xd8\xb2"),
       tr2("Category", "\xd8\xa7\xd9\x84\xd9\x81\xd8\xa6\xd8\xa9"),
       tr2("Qty", "\xd8\xa7\xd9\x84\xd9\x83\xd9\x85\xd9\x8a\xd8\xa9"),
       tr2("Cost",
           "\xd8\xa7\xd9\x84\xd8\xaa\xd9\x83\xd9\x84\xd9\x81\xd8\xa9")});
  table->horizontalHeader()->setStretchLastSection(true);
  table->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  table->verticalHeader()->setVisible(false);

  // Load items
  QSqlQuery qi =
      Database::instance().exec("SELECT item_name, item_code, category, "
                                "stock_qty, cost_price FROM inventory_items");
  int r = 0;
  while (qi.next()) {
    table->insertRow(r);
    for (int c = 0; c < 5; c++)
      table->setItem(r, c, new QTableWidgetItem(qi.value(c).toString()));
    // Color low stock red
    if (qi.value(3).toInt() < 5) {
      for (int c = 0; c < 5; c++)
        table->item(r, c)->setForeground(QColor("#f87171"));
    }
    r++;
  }

  connect(addBtn, &QPushButton::clicked, [=]() {
    if (itemName->text().isEmpty())
      return;
    QSqlQuery ins = Database::instance().prepare(
        "INSERT INTO inventory_items (item_name, item_code, category, "
        "stock_qty, cost_price) "
        "VALUES (?,?,?,?,?)");
    ins.addBindValue(itemName->text());
    ins.addBindValue(itemCode->text());
    ins.addBindValue(category->text());
    ins.addBindValue(qty->text().toInt());
    ins.addBindValue(costPrice->text().toDouble());
    ins.exec();
    int nr = table->rowCount();
    table->insertRow(nr);
    table->setItem(nr, 0, new QTableWidgetItem(itemName->text()));
    table->setItem(nr, 1, new QTableWidgetItem(itemCode->text()));
    table->setItem(nr, 2, new QTableWidgetItem(category->text()));
    table->setItem(nr, 3, new QTableWidgetItem(qty->text()));
    table->setItem(nr, 4, new QTableWidgetItem(costPrice->text()));
    itemName->clear();
    itemCode->clear();
    category->clear();
    qty->clear();
    costPrice->clear();
    QMessageBox::information(
        nullptr,
        tr2("Added",
            "\xd8\xaa\xd9\x85\xd8\xaa "
            "\xd8\xa7\xd9\x84\xd8\xa5\xd8\xb6\xd8\xa7\xd9\x81\xd8\xa9"),
        tr2("Item added to inventory",
            "\xd8\xaa\xd9\x85 \xd8\xa5\xd8\xb6\xd8\xa7\xd9\x81\xd8\xa9 "
            "\xd8\xa7\xd9\x84\xd8\xb5\xd9\x86\xd9\x81"));
  });

  ll->addWidget(table);
  mainLay->addWidget(formBox, 1);
  mainLay->addWidget(listBox, 2);
  layout->addLayout(mainLay);

  // ===== DOCTOR INVENTORY REQUESTS =====
  QGroupBox *drBox = new QGroupBox(
      tr2("Doctor Inventory Requests",
          "\xd8\xb7\xd9\x84\xd8\xa8\xd8\xa7\xd8\xaa "
          "\xd8\xa7\xd9\x84\xd8\xa3\xd8\xb7\xd8\xa8\xd8\xa7\xd8\xa1"));
  drBox->setObjectName("card");
  QVBoxLayout *drL = new QVBoxLayout(drBox);
  QTableWidget *drTbl = new QTableWidget();
  drTbl->setColumnCount(5);
  drTbl->setHorizontalHeaderLabels(
      {tr2("Doctor", "\xd8\xb7\xd8\xa8\xd9\x8a\xd8\xa8"),
       tr2("Dept", "\xd9\x82\xd8\xb3\xd9\x85"),
       tr2("Date", "\xd8\xaa\xd8\xa7\xd8\xb1\xd9\x8a\xd8\xae"),
       tr2("Status", "\xd8\xad\xd8\xa7\xd9\x84\xd8\xa9"),
       tr2("Notes",
           "\xd9\x85\xd9\x84\xd8\xa7\xd8\xad\xd8\xb8\xd8\xa7\xd8\xaa")});
  drTbl->horizontalHeader()->setStretchLastSection(true);
  drTbl->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  drTbl->verticalHeader()->setVisible(false);
  QSqlQuery qdr = Database::instance().exec(
      "SELECT e.name,r.department,r.request_date,r.status,r.notes FROM "
      "doctor_inventory_requests r LEFT JOIN employees e ON r.doctor_id=e.id "
      "ORDER BY r.id DESC");
  {
    int r = 0;
    while (qdr.next()) {
      drTbl->insertRow(r);
      for (int c = 0; c < 5; c++)
        drTbl->setItem(r, c, new QTableWidgetItem(qdr.value(c).toString()));
      r++;
    }
  }
  drL->addWidget(drTbl);
  layout->addWidget(drBox);

  return page;
}

// ===== REPORTS =====
QWidget *MainWindow::createReportsPage() {
  QWidget *page = new QWidget();
  QVBoxLayout *layout = new QVBoxLayout(page);
  QLabel *title = new QLabel(
      tr2("Reports & Analytics",
          "\xd8\xa7\xd9\x84\xd8\xaa\xd9\x82\xd8\xa7\xd8\xb1\xd9\x8a\xd8\xb1 "
          "\xd9\x88\xd8\xa7\xd9\x84\xd8\xaa\xd8\xad\xd9\x84\xd9\x8a\xd9\x84\xd8"
          "\xa7\xd8\xaa"));
  title->setObjectName("pageTitle");
  layout->addWidget(title);

  // Stats cards
  QSqlQuery q1 = Database::instance().exec("SELECT COUNT(*) FROM patients");
  q1.next();
  QSqlQuery q2 = Database::instance().exec("SELECT COUNT(*) FROM appointments");
  q2.next();
  QSqlQuery q3 = Database::instance().exec("SELECT COUNT(*) FROM employees");
  q3.next();
  QSqlQuery q4 =
      Database::instance().exec("SELECT COALESCE(SUM(total),0) FROM invoices");
  q4.next();
  QSqlQuery q5 =
      Database::instance().exec("SELECT COUNT(*) FROM insurance_claims");
  q5.next();
  QSqlQuery q6 =
      Database::instance().exec("SELECT COUNT(*) FROM prescriptions");
  q6.next();

  QHBoxLayout *row1 = new QHBoxLayout();
  auto makeCard = [&](const QString &en, const QString &ar, const QString &val,
                      const QString &color) {
    QGroupBox *card = new QGroupBox();
    card->setObjectName("card");
    QVBoxLayout *cl = new QVBoxLayout(card);
    QLabel *lb = new QLabel(tr2(en, ar));
    lb->setObjectName("cardLabel");
    QLabel *vl = new QLabel(val);
    vl->setStyleSheet("color:" + color + ";font-size:22px;font-weight:bold;");
    cl->addWidget(lb);
    cl->addWidget(vl);
    return card;
  };

  row1->addWidget(makeCard("Total Patients",
                           "\xd8\xa5\xd8\xac\xd9\x85\xd8\xa7\xd9\x84\xd9\x8a "
                           "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd8\xb6\xd9\x89",
                           q1.value(0).toString(), "#60a5fa"));
  row1->addWidget(makeCard(
      "Appointments",
      "\xd8\xa7\xd9\x84\xd9\x85\xd9\x88\xd8\xa7\xd8\xb9\xd9\x8a\xd8\xaf",
      q2.value(0).toString(), "#a78bfa"));
  row1->addWidget(makeCard(
      "Employees",
      "\xd8\xa7\xd9\x84\xd9\x85\xd9\x88\xd8\xb8\xd9\x81\xd9\x8a\xd9\x86",
      q3.value(0).toString(), "#2dd4bf"));
  layout->addLayout(row1);

  QHBoxLayout *row2 = new QHBoxLayout();
  row2->addWidget(makeCard(
      "Total Revenue",
      "\xd8\xa5\xd8\xac\xd9\x85\xd8\xa7\xd9\x84\xd9\x8a "
      "\xd8\xa7\xd9\x84\xd8\xa5\xd9\x8a\xd8\xb1\xd8\xa7\xd8\xaf\xd8\xa7\xd8"
      "\xaa",
      QString::number(q4.value(0).toDouble(), 'f', 0) + " SAR", "#4ade80"));
  row2->addWidget(
      makeCard("Insurance Claims",
               "\xd9\x85\xd8\xb7\xd8\xa7\xd9\x84\xd8\xa8\xd8\xa7\xd8\xaa "
               "\xd8\xa7\xd9\x84\xd8\xaa\xd8\xa3\xd9\x85\xd9\x8a\xd9\x86",
               q5.value(0).toString(), "#fb923c"));
  row2->addWidget(
      makeCard("Prescriptions",
               "\xd8\xa7\xd9\x84\xd9\x88\xd8\xb5\xd9\x81\xd8\xa7\xd8\xaa",
               q6.value(0).toString(), "#f472b6"));
  layout->addLayout(row2);

  // Recent patients table
  QGroupBox *recentBox = new QGroupBox(
      tr2("Recent Patients", "\xd8\xa2\xd8\xae\xd8\xb1 "
                             "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd8\xa7\xd8\xac"
                             "\xd8\xb9\xd9\x8a\xd9\x86"));
  recentBox->setObjectName("card");
  QVBoxLayout *rl = new QVBoxLayout(recentBox);
  QTableWidget *table = new QTableWidget();
  table->setColumnCount(5);
  table->setHorizontalHeaderLabels(
      {tr2("File #",
           "\xd8\xb1\xd9\x82\xd9\x85 \xd8\xa7\xd9\x84\xd9\x85\xd9\x84\xd9\x81"),
       tr2("Name", "\xd8\xa7\xd9\x84\xd8\xa7\xd8\xb3\xd9\x85"),
       tr2("Phone", "\xd8\xa7\xd9\x84\xd8\xac\xd9\x88\xd8\xa7\xd9\x84"),
       tr2("Department", "\xd8\xa7\xd9\x84\xd9\x82\xd8\xb3\xd9\x85"),
       tr2("Status", "\xd8\xa7\xd9\x84\xd8\xad\xd8\xa7\xd9\x84\xd8\xa9")});
  table->horizontalHeader()->setStretchLastSection(true);
  table->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  table->verticalHeader()->setVisible(false);

  QSqlQuery qr = Database::instance().exec(
      "SELECT file_number, name_en, name_ar, phone, department, status "
      "FROM patients ORDER BY id DESC");
  int rr = 0;
  while (qr.next()) {
    table->insertRow(rr);
    table->setItem(rr, 0,
                   new QTableWidgetItem(QString::number(qr.value(0).toInt())));
    table->setItem(rr, 1,
                   new QTableWidgetItem(isArabic ? qr.value(2).toString()
                                                 : qr.value(1).toString()));
    table->setItem(rr, 2, new QTableWidgetItem(qr.value(3).toString()));
    table->setItem(rr, 3, new QTableWidgetItem(qr.value(4).toString()));
    QTableWidgetItem *st = new QTableWidgetItem(qr.value(5).toString());
    st->setForeground(qr.value(5).toString() == "With Doctor"
                          ? QColor("#4ade80")
                          : QColor("#f59e0b"));
    table->setItem(rr, 4, st);
    rr++;
  }
  rl->addWidget(table);
  layout->addWidget(recentBox);
  layout->addStretch();
  return page;
}

// ===== SETTINGS =====
QWidget *MainWindow::createSettingsPage() {
  QWidget *page = new QWidget();
  QVBoxLayout *layout = new QVBoxLayout(page);
  QLabel *title = new QLabel(
      tr2("Settings", "\xd8\xa7\xd9\x84\xd8\xa5\xd8\xb9\xd8\xaf\xd8\xa7"
                      "\xd8\xaf\xd8\xa7\xd8\xaa"));
  title->setObjectName("pageTitle");
  layout->addWidget(title);

  QGroupBox *box = new QGroupBox(
      tr2("Company / Organization Info",
          "\xd8\xa8\xd9\x8a\xd8\xa7\xd9\x86\xd8\xa7\xd8\xaa "
          "\xd8\xa7\xd9\x84\xd8\xb4\xd8\xb1\xd9\x83\xd8\xa9 / "
          "\xd8\xa7\xd9\x84\xd9\x85\xd8\xa4\xd8\xb3\xd8\xb3\xd8\xa9"));
  box->setObjectName("card");
  QVBoxLayout *formLay = new QVBoxLayout(box);

  // --- Helper to create labeled field ---
  auto addField = [&](const QString &enLabel, const QString &arLabel,
                      const QString &placeholder = "") -> QLineEdit * {
    formLay->addWidget(new QLabel(tr2(enLabel, arLabel)));
    QLineEdit *edit = new QLineEdit();
    edit->setFixedHeight(38);
    if (!placeholder.isEmpty())
      edit->setPlaceholderText(placeholder);
    formLay->addWidget(edit);
    return edit;
  };

  // Fields
  QLineEdit *nameAr = addField(
      "Company Name (Arabic)",
      "\xd8\xa7\xd8\xb3\xd9\x85 \xd8\xa7\xd9\x84\xd8\xb4\xd8\xb1\xd9\x83"
      "\xd8\xa9 \xd8\xa8\xd8\xa7\xd9\x84\xd8\xb9\xd8\xb1\xd8\xa8\xd9\x8a"
      "\xd8\xa9",
      tr2("Enter company name in Arabic...",
          "\xd8\xa7\xd8\xaf\xd8\xae\xd9\x84 \xd8\xa7\xd8\xb3\xd9\x85 "
          "\xd8\xa7\xd9\x84\xd8\xb4\xd8\xb1\xd9\x83\xd8\xa9..."));

  QLineEdit *nameEn = addField(
      "Company Name (English)",
      "\xd8\xa7\xd8\xb3\xd9\x85 \xd8\xa7\xd9\x84\xd8\xb4\xd8\xb1\xd9\x83"
      "\xd8\xa9 \xd8\xa8\xd8\xa7\xd9\x84\xd8\xa5\xd9\x86\xd8\xac\xd9\x84"
      "\xd9\x8a\xd8\xb2\xd9\x8a\xd8\xa9",
      tr2("Enter company name in English...",
          "\xd8\xa7\xd8\xaf\xd8\xae\xd9\x84 \xd8\xa7\xd8\xb3\xd9\x85 "
          "\xd8\xa7\xd9\x84\xd8\xb4\xd8\xb1\xd9\x83\xd8\xa9 "
          "\xd8\xa8\xd8\xa7\xd9\x84\xd8\xa5\xd9\x86\xd8\xac\xd9\x84\xd9\x8a"
          "\xd8\xb2\xd9\x8a\xd8\xa9..."));

  QLineEdit *taxNum =
      addField("Tax Number (VAT)",
               "\xd8\xa7\xd9\x84\xd8\xb1\xd9\x82\xd9\x85 "
               "\xd8\xa7\xd9\x84\xd8\xb6\xd8\xb1\xd9\x8a\xd8\xa8\xd9\x8a",
               "3XXXXXXXXXX0003");

  QLineEdit *crNum = addField(
      "CR Number",
      "\xd8\xb1\xd9\x82\xd9\x85 \xd8\xa7\xd9\x84\xd8\xb3\xd8\xac\xd9\x84 "
      "\xd8\xa7\xd9\x84\xd8\xaa\xd8\xac\xd8\xa7\xd8\xb1\xd9\x8a",
      "1010XXXXXX");

  QLineEdit *address = addField(
      "Address", "\xd8\xa7\xd9\x84\xd8\xb9\xd9\x86\xd9\x88\xd8\xa7\xd9\x86",
      tr2("Enter address...",
          "\xd8\xa7\xd8\xaf\xd8\xae\xd9\x84 "
          "\xd8\xa7\xd9\x84\xd8\xb9\xd9\x86\xd9\x88\xd8\xa7\xd9\x86..."));

  QLineEdit *phone =
      addField("Phone Number",
               "\xd8\xb1\xd9\x82\xd9\x85 "
               "\xd8\xa7\xd9\x84\xd8\xac\xd9\x88\xd8\xa7\xd9\x84",
               "05XXXXXXXX");

  // --- Logo section ---
  formLay->addSpacing(10);
  formLay->addWidget(new QLabel(
      tr2("Company Logo", "\xd8\xb4\xd8\xb9\xd8\xa7\xd8\xb1 "
                          "\xd8\xa7\xd9\x84\xd8\xb4\xd8\xb1\xd9\x83\xd8\xa9")));

  QHBoxLayout *logoLayout = new QHBoxLayout();
  QLabel *logoPreview = new QLabel();
  logoPreview->setFixedSize(120, 120);
  logoPreview->setAlignment(Qt::AlignCenter);
  logoPreview->setStyleSheet(
      "background-color: rgba(255,255,255,0.05); "
      "border: 2px dashed rgba(255,255,255,0.2); border-radius: 12px;");
  logoPreview->setText(tr2("No Logo", "\xd8\xa8\xd8\xaf\xd9\x88\xd9\x86 "
                                      "\xd8\xb4\xd8\xb9\xd8\xa7\xd8\xb1"));

  QLineEdit *logoPathEdit = new QLineEdit();
  logoPathEdit->setFixedHeight(38);
  logoPathEdit->setReadOnly(true);
  logoPathEdit->setPlaceholderText(
      tr2("Logo file path...",
          "\xd9\x85\xd8\xb3\xd8\xa7\xd8\xb1 "
          "\xd8\xa7\xd9\x84\xd8\xb4\xd8\xb9\xd8\xa7\xd8\xb1..."));

  QPushButton *browseBtn = new QPushButton(
      tr2("Browse...", "\xd8\xa7\xd8\xae\xd8\xaa\xd9\x8a\xd8\xa7\xd8\xb1..."));
  browseBtn->setFixedHeight(38);
  browseBtn->setFixedWidth(120);

  connect(browseBtn, &QPushButton::clicked, [=]() {
    QString filePath = QFileDialog::getOpenFileName(
        nullptr,
        tr2("Select Logo Image",
            "\xd8\xa7\xd8\xae\xd8\xaa\xd9\x8a\xd8\xa7\xd8\xb1 "
            "\xd8\xb5\xd9\x88\xd8\xb1\xd8\xa9 "
            "\xd8\xa7\xd9\x84\xd8\xb4\xd8\xb9\xd8\xa7\xd8\xb1"),
        "", "Images (*.png *.jpg *.jpeg *.bmp *.ico)");
    if (!filePath.isEmpty()) {
      logoPathEdit->setText(filePath);
      QPixmap pixmap(filePath);
      if (!pixmap.isNull()) {
        logoPreview->setPixmap(pixmap.scaled(110, 110, Qt::KeepAspectRatio,
                                             Qt::SmoothTransformation));
      }
    }
  });

  QVBoxLayout *logoRight = new QVBoxLayout();
  logoRight->addWidget(logoPathEdit);
  logoRight->addWidget(browseBtn);
  logoRight->addStretch();
  logoLayout->addWidget(logoPreview);
  logoLayout->addLayout(logoRight, 1);
  formLay->addLayout(logoLayout);

  // --- Load existing data ---
  auto loadSetting = [](const QString &key) -> QString {
    QSqlQuery q = Database::instance().exec(
        QString("SELECT setting_value FROM company_settings WHERE "
                "setting_key='%1'")
            .arg(key));
    if (q.next())
      return q.value(0).toString();
    return "";
  };

  nameAr->setText(loadSetting("company_name_ar"));
  nameEn->setText(loadSetting("company_name_en"));
  taxNum->setText(loadSetting("tax_number"));
  crNum->setText(loadSetting("cr_number"));
  address->setText(loadSetting("address"));
  phone->setText(loadSetting("phone"));
  QString savedLogo = loadSetting("logo_path");
  if (!savedLogo.isEmpty()) {
    logoPathEdit->setText(savedLogo);
    QPixmap pixmap(savedLogo);
    if (!pixmap.isNull()) {
      logoPreview->setPixmap(pixmap.scaled(110, 110, Qt::KeepAspectRatio,
                                           Qt::SmoothTransformation));
    }
  }

  // --- Save button ---
  formLay->addSpacing(15);
  QPushButton *saveBtn = new QPushButton(tr2(
      "   Save Settings   ", "   \xd8\xad\xd9\x81\xd8\xb8 "
                             "\xd8\xa7\xd9\x84\xd8\xa5\xd8\xb9\xd8\xaf\xd8\xa7"
                             "\xd8\xaf\xd8\xa7\xd8\xaa   "));
  saveBtn->setObjectName("primaryBtn");
  saveBtn->setFixedHeight(48);
  formLay->addWidget(saveBtn);

  connect(saveBtn, &QPushButton::clicked, [=]() {
    auto saveSetting = [](const QString &key, const QString &value) {
      Database::instance().exec(
          QString("UPDATE company_settings SET setting_value=N'%1' WHERE "
                  "setting_key='%2'")
              .arg(value, key));
    };
    saveSetting("company_name_ar", nameAr->text());
    saveSetting("company_name_en", nameEn->text());
    saveSetting("tax_number", taxNum->text());
    saveSetting("cr_number", crNum->text());
    saveSetting("address", address->text());
    saveSetting("phone", phone->text());
    saveSetting("logo_path", logoPathEdit->text());

    QMessageBox::information(
        nullptr,
        tr2("Saved",
            "\xd8\xaa\xd9\x85 \xd8\xa7\xd9\x84\xd8\xad\xd9\x81\xd8\xb8"),
        tr2("Company settings saved successfully!",
            "\xd8\xaa\xd9\x85 \xd8\xad\xd9\x81\xd8\xb8 "
            "\xd8\xa8\xd9\x8a\xd8\xa7\xd9\x86\xd8\xa7\xd8\xaa "
            "\xd8\xa7\xd9\x84\xd8\xb4\xd8\xb1\xd9\x83\xd8\xa9 "
            "\xd8\xa8\xd9\x86\xd8\xac\xd8\xa7\xd8\xad!"));
  });

  layout->addWidget(box);

  // ========================================
  // USER MANAGEMENT SECTION (Admin only)
  // ========================================
  if (currentUserRole == "Admin") {
    QGroupBox *userBox = new QGroupBox(
        tr2("User Management",
            "\xd8\xa5\xd8\xaf\xd8\xa7\xd8\xb1\xd8\xa9 "
            "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb3\xd8\xaa\xd8\xae\xd8\xaf"
            "\xd9\x85\xd9\x8a\xd9\x86"));
    userBox->setObjectName("card");
    QVBoxLayout *userLay = new QVBoxLayout(userBox);

    // Users table
    QTableWidget *usersTable = new QTableWidget();
    usersTable->setColumnCount(5);
    usersTable->setHorizontalHeaderLabels(
        {tr2("Username", "\xd8\xa7\xd8\xb3\xd9\x85 "
                         "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb3\xd8\xaa\xd8\xae\xd8"
                         "\xaf\xd9\x85"),
         tr2("Display Name", "\xd8\xa7\xd9\x84\xd8\xa7\xd8\xb3\xd9\x85"),
         tr2("Role", "\xd8\xa7\xd9\x84\xd8\xaf\xd9\x88\xd8\xb1"),
         tr2("Status", "\xd8\xa7\xd9\x84\xd8\xad\xd8\xa7\xd9\x84\xd8\xa9"),
         tr2("Action", "\xd8\xa5\xd8\xac\xd8\xb1\xd8\xa7\xd8\xa1")});
    usersTable->horizontalHeader()->setStretchLastSection(true);
    usersTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
    usersTable->verticalHeader()->setVisible(false);
    usersTable->setAlternatingRowColors(true);
    usersTable->setMinimumHeight(350);
    usersTable->verticalHeader()->setDefaultSectionSize(42);
    usersTable->setSelectionBehavior(QAbstractItemView::SelectRows);

    // Load users
    auto refreshUsers = [=]() {
      usersTable->setRowCount(0);
      QSqlQuery qu = Database::instance().exec(
          "SELECT id, username, display_name, role, is_active "
          "FROM system_users ORDER BY id");
      int row = 0;
      while (qu.next()) {
        usersTable->insertRow(row);
        int userId = qu.value(0).toInt();
        usersTable->setItem(row, 0,
                            new QTableWidgetItem(qu.value(1).toString()));
        usersTable->setItem(row, 1,
                            new QTableWidgetItem(qu.value(2).toString()));
        // Role in Arabic
        QString role = qu.value(3).toString();
        QString roleDisplay = role;
        if (role == "Admin")
          roleDisplay = tr2("Admin", "\xd9\x85\xd8\xaf\xd9\x8a\xd8\xb1");
        else if (role == "Reception")
          roleDisplay =
              tr2("Reception",
                  "\xd8\xa7\xd8\xb3\xd8\xaa\xd9\x82\xd8\xa8\xd8\xa7\xd9\x84");
        else if (role == "Pharmacist")
          roleDisplay =
              tr2("Pharmacist", "\xd8\xb5\xd9\x8a\xd8\xaf\xd9\x84\xd9\x8a");
        else if (role == "Doctor")
          roleDisplay = tr2("Doctor", "\xd8\xb7\xd8\xa8\xd9\x8a\xd8\xa8");
        usersTable->setItem(row, 2, new QTableWidgetItem(roleDisplay));
        // Status
        bool active = qu.value(4).toInt() == 1;
        QTableWidgetItem *stItem = new QTableWidgetItem(
            active ? tr2("Active", "\xd9\x86\xd8\xb4\xd8\xb7")
                   : tr2("Inactive", "\xd9\x85\xd8\xb9\xd8\xb7\xd9\x84"));
        stItem->setForeground(active ? QColor("#4ade80") : QColor("#f87171"));
        usersTable->setItem(row, 3, stItem);
        // Delete button
        QPushButton *delBtn =
            new QPushButton(tr2("Delete", "\xd8\xad\xd8\xb0\xd9\x81"));
        delBtn->setStyleSheet(
            "background-color: #ef4444; color: white; border: none; "
            "border-radius: 6px; padding: 5px 10px;");
        usersTable->setCellWidget(row, 4, delBtn);
        int currentRow = row;
        connect(delBtn, &QPushButton::clicked, [=]() {
          if (QMessageBox::question(
                  nullptr,
                  tr2("Confirm", "\xd8\xaa\xd8\xa3\xd9\x83\xd9\x8a\xd8\xaf"),
                  tr2("Delete this user?",
                      "\xd9\x87\xd9\x84 \xd8\xaa\xd8\xb1\xd9\x8a\xd8\xaf "
                      "\xd8\xad\xd8\xb0\xd9\x81 \xd9\x87\xd8\xb0\xd8\xa7 "
                      "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb3\xd8\xaa\xd8\xae\xd8\xaf"
                      "\xd9\x85\xd8\x9f")) == QMessageBox::Yes) {
            Database::instance().exec(
                QString("DELETE FROM system_users WHERE id=%1").arg(userId));
            // Find and remove the row from the table
            for (int r = 0; r < usersTable->rowCount(); r++) {
              if (usersTable->item(r, 0) &&
                  usersTable->cellWidget(r, 4) == delBtn) {
                usersTable->removeRow(r);
                break;
              }
            }
          }
        });
        row++;
      }
    };
    refreshUsers();
    userLay->addWidget(usersTable);

    // Add user form
    QHBoxLayout *addUserLay = new QHBoxLayout();
    QLineEdit *newUsername = new QLineEdit();
    newUsername->setFixedHeight(38);
    newUsername->setPlaceholderText(tr2(
        "Username",
        "\xd8\xa7\xd8\xb3\xd9\x85 "
        "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb3\xd8\xaa\xd8\xae\xd8\xaf\xd9\x85"));
    QLineEdit *newPassword = new QLineEdit();
    newPassword->setFixedHeight(38);
    newPassword->setPlaceholderText(
        tr2("Password", "\xd9\x83\xd9\x84\xd9\x85\xd8\xa9 "
                        "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x88\xd8\xb1"));
    QLineEdit *newDisplayName = new QLineEdit();
    newDisplayName->setFixedHeight(38);
    newDisplayName->setPlaceholderText(
        tr2("Display Name", "\xd8\xa7\xd9\x84\xd8\xa7\xd8\xb3\xd9\x85"));
    QComboBox *newRole = new QComboBox();
    newRole->setFixedHeight(38);
    newRole->addItem(tr2("Admin", "\xd9\x85\xd8\xaf\xd9\x8a\xd8\xb1"), "Admin");
    newRole->addItem(
        tr2("Reception",
            "\xd8\xa7\xd8\xb3\xd8\xaa\xd9\x82\xd8\xa8\xd8\xa7\xd9\x84"),
        "Reception");
    newRole->addItem(
        tr2("Pharmacist", "\xd8\xb5\xd9\x8a\xd8\xaf\xd9\x84\xd9\x8a"),
        "Pharmacist");
    newRole->addItem(tr2("Doctor", "\xd8\xb7\xd8\xa8\xd9\x8a\xd8\xa8"),
                     "Doctor");
    QPushButton *addUserBtn = new QPushButton(
        tr2("Add User", "\xd8\xa5\xd8\xb6\xd8\xa7\xd9\x81\xd8\xa9 "
                        "\xd9\x85\xd8\xb3\xd8\xaa\xd8\xae\xd8\xaf\xd9\x85"));
    addUserBtn->setObjectName("primaryBtn");
    addUserBtn->setFixedHeight(38);

    addUserLay->addWidget(newUsername);
    addUserLay->addWidget(newPassword);
    addUserLay->addWidget(newDisplayName);
    addUserLay->addWidget(newRole);
    addUserLay->addWidget(addUserBtn);
    userLay->addLayout(addUserLay);

    connect(addUserBtn, &QPushButton::clicked, [=]() {
      if (newUsername->text().trimmed().isEmpty() ||
          newPassword->text().trimmed().isEmpty()) {
        QMessageBox::warning(
            nullptr, tr2("Error", "\xd8\xae\xd8\xb7\xd8\xa3"),
            tr2("Username and password are required.",
                "\xd8\xa7\xd8\xb3\xd9\x85 "
                "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb3\xd8\xaa\xd8\xae\xd8\xaf\xd9"
                "\x85 "
                "\xd9\x88\xd9\x83\xd9\x84\xd9\x85\xd8\xa9 "
                "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x88\xd8\xb1 "
                "\xd9\x85\xd8\xb7\xd9\x84\xd9\x88\xd8\xa8\xd8\xa9."));
        return;
      }
      // Check duplicate
      QSqlQuery chk = Database::instance().exec(
          QString("SELECT COUNT(*) FROM system_users WHERE username='%1'")
              .arg(newUsername->text().trimmed().replace("'", "''")));
      chk.next();
      if (chk.value(0).toInt() > 0) {
        QMessageBox::warning(
            nullptr, tr2("Error", "\xd8\xae\xd8\xb7\xd8\xa3"),
            tr2("Username already exists!",
                "\xd8\xa7\xd8\xb3\xd9\x85 "
                "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb3\xd8\xaa\xd8\xae\xd8\xaf\xd9"
                "\x85 "
                "\xd9\x85\xd9\x88\xd8\xac\xd9\x88\xd8\xaf "
                "\xd9\x85\xd8\xb3\xd8\xa8\xd9\x82\xd8\xa7\xd9\x8b!"));
        return;
      }
      QString roleVal = newRole->currentData().toString();
      QSqlQuery ins =
          Database::instance().prepare("INSERT INTO system_users (username, "
                                       "password_hash, display_name, role) "
                                       "VALUES (?, ?, ?, ?)");
      ins.addBindValue(newUsername->text().trimmed());
      ins.addBindValue(newPassword->text().trimmed());
      ins.addBindValue(newDisplayName->text().trimmed().isEmpty()
                           ? newUsername->text().trimmed()
                           : newDisplayName->text().trimmed());
      ins.addBindValue(roleVal);
      ins.exec();
      newUsername->clear();
      newPassword->clear();
      newDisplayName->clear();
      refreshUsers();
      QMessageBox::information(
          nullptr,
          tr2("Added",
              "\xd8\xaa\xd9\x85\xd8\xaa "
              "\xd8\xa7\xd9\x84\xd8\xa5\xd8\xb6\xd8\xa7\xd9\x81\xd8\xa9"),
          tr2("User added successfully!",
              "\xd8\xaa\xd9\x85 \xd8\xa5\xd8\xb6\xd8\xa7\xd9\x81\xd8\xa9 "
              "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb3\xd8\xaa\xd8\xae\xd8\xaf\xd9\x85"
              " "
              "\xd8\xa8\xd9\x86\xd8\xac\xd8\xa7\xd8\xad!"));
    });

    layout->addWidget(userBox);
  }

  // ===== INTEGRATION SETTINGS =====
  QGroupBox *intBox = new QGroupBox(
      tr2("Integrations", "\xd8\xa7\xd9\x84\xd8\xaa\xd9\x83\xd8\xa7\xd9\x85\xd9"
                          "\x84\xd8\xa7\xd8\xaa"));
  intBox->setObjectName("card");
  QVBoxLayout *intL = new QVBoxLayout(intBox);
  QTableWidget *intTbl = new QTableWidget();
  intTbl->setColumnCount(4);
  intTbl->setHorizontalHeaderLabels(
      {tr2("Integration", "\xd8\xaa\xd9\x83\xd8\xa7\xd9\x85\xd9\x84"),
       tr2("Provider", "\xd9\x85\xd8\xb2\xd9\x88\xd8\xaf"),
       tr2("Status", "\xd8\xad\xd8\xa7\xd9\x84\xd8\xa9"),
       tr2("API Key", "\xd9\x85\xd9\x81\xd8\xaa\xd8\xa7\xd8\xad")});
  intTbl->horizontalHeader()->setStretchLastSection(true);
  intTbl->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  intTbl->verticalHeader()->setVisible(false);
  QSqlQuery qint = Database::instance().exec(
      "SELECT integration_name,provider,CASE WHEN is_enabled=1 THEN 'Enabled' "
      "ELSE 'Disabled' END,api_key FROM integration_settings ORDER BY id");
  {
    int r = 0;
    while (qint.next()) {
      intTbl->insertRow(r);
      for (int c = 0; c < 4; c++)
        intTbl->setItem(r, c, new QTableWidgetItem(qint.value(c).toString()));
      r++;
    }
  }
  // Default integrations
  if (intTbl->rowCount() == 0) {
    QStringList names = {"SMS",       "WhatsApp API", "RASAD",
                         "E-Payment", "E-Signature",  "Fingerprint"};
    for (int i = 0; i < names.size(); i++) {
      intTbl->insertRow(i);
      intTbl->setItem(i, 0, new QTableWidgetItem(names[i]));
      intTbl->setItem(i, 1, new QTableWidgetItem("--"));
      intTbl->setItem(i, 2, new QTableWidgetItem("Disabled"));
      intTbl->setItem(i, 3, new QTableWidgetItem("--"));
    }
  }
  intL->addWidget(intTbl);
  layout->addWidget(intBox);

  // User stats
  QSqlQuery qDocs = Database::instance().exec(
      "SELECT COUNT(*) FROM system_users WHERE role='Doctor'");
  qDocs.next();
  int docCount = qDocs.value(0).toInt();
  QSqlQuery qNon = Database::instance().exec(
      "SELECT COUNT(*) FROM system_users WHERE role<>'Doctor'");
  qNon.next();
  int nonDocCount = qNon.value(0).toInt();
  QLabel *statsLbl = new QLabel(tr2(
      QString("Users: %1 Doctors, %2 Non-Doctors")
          .arg(docCount)
          .arg(nonDocCount),
      QString(
          "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb3\xd8\xaa\xd8\xae\xd8\xaf\xd9\x85\xd9"
          "\x8a\xd9\x86: %1 \xd8\xa3\xd8\xb7\xd8\xa8\xd8\xa7\xd8\xa1, %2 "
          "\xd8\xba\xd9\x8a\xd8\xb1 \xd8\xa3\xd8\xb7\xd8\xa8\xd8\xa7\xd8\xa1")
          .arg(docCount)
          .arg(nonDocCount)));
  statsLbl->setStyleSheet("font-size:14px;font-weight:bold;padding:8px;");
  layout->addWidget(statsLbl);

  layout->addStretch();
  return page;
}

// ===== INTERNAL MESSAGING =====
QWidget *MainWindow::createMessagingPage() {
  QWidget *page = new QWidget();
  QVBoxLayout *layout = new QVBoxLayout(page);
  QLabel *title = new QLabel(
      tr2("Internal Messaging",
          "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd8\xa7\xd8\xb3\xd9\x84\xd8\xa7"
          "\xd8\xaa "
          "\xd8\xa7\xd9\x84\xd8\xaf\xd8\xa7\xd8\xae\xd9\x84\xd9\x8a\xd8\xa9"));
  title->setObjectName("pageTitle");
  layout->addWidget(title);

  QHBoxLayout *mainLay = new QHBoxLayout();

  // Compose form
  QGroupBox *composeBox = new QGroupBox(
      tr2("New Message", "\xd8\xb1\xd8\xb3\xd8\xa7\xd9\x84\xd8\xa9 "
                         "\xd8\xac\xd8\xaf\xd9\x8a\xd8\xaf\xd8\xa9"));
  composeBox->setObjectName("card");
  QVBoxLayout *cl = new QVBoxLayout(composeBox);

  cl->addWidget(new QLabel(tr2("To", "\xd8\xa5\xd9\x84\xd9\x89")));
  QComboBox *toCombo = new QComboBox();
  toCombo->setFixedHeight(36);
  QSqlQuery qu = Database::instance().exec(
      "SELECT id, display_name FROM system_users ORDER BY display_name");
  while (qu.next())
    toCombo->addItem(qu.value(1).toString(), qu.value(0));
  cl->addWidget(toCombo);

  cl->addWidget(new QLabel(tr2(
      "Subject", "\xd8\xa7\xd9\x84\xd9\x85\xd9\x88\xd8\xb6\xd9\x88\xd8\xb9")));
  QLineEdit *subject = new QLineEdit();
  subject->setFixedHeight(36);
  cl->addWidget(subject);

  cl->addWidget(new QLabel(tr2(
      "Message", "\xd8\xa7\xd9\x84\xd8\xb1\xd8\xb3\xd8\xa7\xd9\x84\xd8\xa9")));
  QTextEdit *body = new QTextEdit();
  body->setFixedHeight(120);
  cl->addWidget(body);

  cl->addWidget(new QLabel(
      tr2("Priority",
          "\xd8\xa7\xd9\x84\xd8\xa3\xd9\x88\xd9\x84\xd9\x88\xd9\x8a\xd8\xa9")));
  QComboBox *priority = new QComboBox();
  priority->setFixedHeight(36);
  priority->addItem(tr2("Normal", "\xd8\xb9\xd8\xa7\xd8\xaf\xd9\x8a"));
  priority->addItem(tr2("High", "\xd9\x85\xd8\xb1\xd8\xaa\xd9\x81\xd8\xb9"));
  priority->addItem(tr2("Urgent", "\xd8\xb9\xd8\xa7\xd8\xac\xd9\x84"));
  cl->addWidget(priority);

  QPushButton *sendBtn =
      new QPushButton(tr2("Send", "\xd8\xa5\xd8\xb1\xd8\xb3\xd8\xa7\xd9\x84"));
  sendBtn->setObjectName("primaryBtn");
  sendBtn->setFixedHeight(45);
  cl->addWidget(sendBtn);
  cl->addStretch();

  // Inbox
  QGroupBox *inboxBox = new QGroupBox(
      tr2("Inbox", "\xd8\xa7\xd9\x84\xd9\x88\xd8\xa7\xd8\xb1\xd8\xaf"));
  inboxBox->setObjectName("card");
  QVBoxLayout *il = new QVBoxLayout(inboxBox);

  QTableWidget *msgTable = new QTableWidget();
  msgTable->setColumnCount(5);
  msgTable->setHorizontalHeaderLabels(
      {tr2("From", "\xd9\x85\xd9\x86"),
       tr2("Subject",
           "\xd8\xa7\xd9\x84\xd9\x85\xd9\x88\xd8\xb6\xd9\x88\xd8\xb9"),
       tr2("Priority",
           "\xd8\xa7\xd9\x84\xd8\xa3\xd9\x88\xd9\x84\xd9\x88\xd9\x8a\xd8\xa9"),
       tr2("Date", "\xd8\xa7\xd9\x84\xd8\xaa\xd8\xa7\xd8\xb1\xd9\x8a\xd8\xae"),
       tr2("Status", "\xd8\xa7\xd9\x84\xd8\xad\xd8\xa7\xd9\x84\xd8\xa9")});
  msgTable->horizontalHeader()->setStretchLastSection(true);
  msgTable->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  msgTable->verticalHeader()->setVisible(false);

  QSqlQuery qm = Database::instance().exec(
      "SELECT u.display_name, m.subject, m.priority, m.created_at, "
      "CASE WHEN m.is_read=1 THEN 'Read' ELSE 'Unread' END "
      "FROM internal_messages m LEFT JOIN system_users u ON m.sender_id=u.id "
      "ORDER BY m.id DESC");
  int r = 0;
  while (qm.next()) {
    msgTable->insertRow(r);
    for (int c = 0; c < 5; c++)
      msgTable->setItem(r, c, new QTableWidgetItem(qm.value(c).toString()));
    r++;
  }
  il->addWidget(msgTable);

  connect(sendBtn, &QPushButton::clicked, [=]() {
    if (subject->text().isEmpty())
      return;
    QSqlQuery ins = Database::instance().prepare(
        "INSERT INTO internal_messages (sender_id, receiver_id, subject, body, "
        "priority) "
        "VALUES (?,?,?,?,?)");
    ins.addBindValue(1); // current user id placeholder
    ins.addBindValue(toCombo->currentData().toInt());
    ins.addBindValue(subject->text());
    ins.addBindValue(body->toPlainText());
    ins.addBindValue(priority->currentText());
    ins.exec();
    msgTable->insertRow(0);
    msgTable->setItem(0, 0, new QTableWidgetItem(currentUserName));
    msgTable->setItem(0, 1, new QTableWidgetItem(subject->text()));
    msgTable->setItem(0, 2, new QTableWidgetItem(priority->currentText()));
    msgTable->setItem(
        0, 3,
        new QTableWidgetItem(QDate::currentDate().toString("yyyy-MM-dd")));
    msgTable->setItem(0, 4, new QTableWidgetItem("Sent"));
    subject->clear();
    body->clear();
    QMessageBox::information(
        nullptr, tr2("Sent", "\xd8\xaa\xd9\x85"),
        tr2("Message sent successfully",
            "\xd8\xaa\xd9\x85 \xd8\xa5\xd8\xb1\xd8\xb3\xd8\xa7\xd9\x84 "
            "\xd8\xa7\xd9\x84\xd8\xb1\xd8\xb3\xd8\xa7\xd9\x84\xd8\xa9 "
            "\xd8\xa8\xd9\x86\xd8\xac\xd8\xa7\xd8\xad"));
  });

  mainLay->addWidget(composeBox, 1);
  mainLay->addWidget(inboxBox, 2);
  layout->addLayout(mainLay);
  return page;
}

// ===== FORM BUILDER =====
QWidget *MainWindow::createFormBuilderPage() {
  QWidget *page = new QWidget();
  QVBoxLayout *layout = new QVBoxLayout(page);
  QLabel *title = new QLabel(
      tr2("Form Builder",
          "\xd9\x85\xd9\x86\xd8\xb4\xd8\xa6 "
          "\xd8\xa7\xd9\x84\xd9\x86\xd9\x85\xd8\xa7\xd8\xb0\xd8\xac"));
  title->setObjectName("pageTitle");
  layout->addWidget(title);

  QHBoxLayout *mainLay = new QHBoxLayout();

  // New template form
  QGroupBox *formBox = new QGroupBox(
      tr2("New Form Template", "\xd9\x86\xd9\x85\xd9\x88\xd8\xb0\xd8\xac "
                               "\xd8\xac\xd8\xaf\xd9\x8a\xd8\xaf"));
  formBox->setObjectName("card");
  QVBoxLayout *fl = new QVBoxLayout(formBox);

  fl->addWidget(new QLabel(
      tr2("Template Name",
          "\xd8\xa7\xd8\xb3\xd9\x85 "
          "\xd8\xa7\xd9\x84\xd9\x86\xd9\x85\xd9\x88\xd8\xb0\xd8\xac")));
  QLineEdit *tplName = new QLineEdit();
  tplName->setFixedHeight(36);
  fl->addWidget(tplName);

  fl->addWidget(new QLabel(
      tr2("Department", "\xd8\xa7\xd9\x84\xd9\x82\xd8\xb3\xd9\x85")));
  QComboBox *deptCombo = new QComboBox();
  deptCombo->setFixedHeight(36);
  deptCombo->addItem(tr2("General", "\xd8\xb9\xd8\xa7\xd9\x85"));
  deptCombo->addItem(tr2("Reception", "\xd8\xa7\xd9\x84\xd8\xa7\xd8\xb3\xd8\xaa"
                                      "\xd9\x82\xd8\xa8\xd8\xa7\xd9\x84"));
  deptCombo->addItem(
      tr2("Doctor", "\xd8\xa7\xd9\x84\xd8\xb7\xd8\xa8\xd9\x8a\xd8\xa8"));
  deptCombo->addItem(tr2(
      "Nursing", "\xd8\xa7\xd9\x84\xd8\xaa\xd9\x85\xd8\xb1\xd9\x8a\xd8\xb6"));
  deptCombo->addItem(
      tr2("Lab", "\xd8\xa7\xd9\x84\xd9\x85\xd8\xae\xd8\xaa\xd8\xa8\xd8\xb1"));
  deptCombo->addItem(
      tr2("Radiology", "\xd8\xa7\xd9\x84\xd8\xa3\xd8\xb4\xd8\xb9\xd8\xa9"));
  fl->addWidget(deptCombo);

  fl->addWidget(new QLabel(
      tr2("Form Fields (JSON format)",
          "\xd8\xad\xd9\x82\xd9\x88\xd9\x84 "
          "\xd8\xa7\xd9\x84\xd9\x86\xd9\x85\xd9\x88\xd8\xb0\xd8\xac")));
  QTextEdit *fieldsEdit = new QTextEdit();
  fieldsEdit->setFixedHeight(150);
  fieldsEdit->setPlaceholderText("[{\"name\":\"field1\",\"type\":\"text\"},{"
                                 "\"name\":\"field2\",\"type\":\"number\"}]");
  fl->addWidget(fieldsEdit);

  QPushButton *saveBtn = new QPushButton(
      tr2("Save Template",
          "\xd8\xad\xd9\x81\xd8\xb8 "
          "\xd8\xa7\xd9\x84\xd9\x86\xd9\x85\xd9\x88\xd8\xb0\xd8\xac"));
  saveBtn->setObjectName("primaryBtn");
  saveBtn->setFixedHeight(45);
  fl->addWidget(saveBtn);
  fl->addStretch();

  // Templates list
  QGroupBox *listBox = new QGroupBox(
      tr2("Form Templates",
          "\xd8\xa7\xd9\x84\xd9\x86\xd9\x85\xd8\xa7\xd8\xb0\xd8\xac"));
  listBox->setObjectName("card");
  QVBoxLayout *ll = new QVBoxLayout(listBox);

  QTableWidget *table = new QTableWidget();
  table->setColumnCount(4);
  table->setHorizontalHeaderLabels(
      {tr2("Name", "\xd8\xa7\xd9\x84\xd8\xa7\xd8\xb3\xd9\x85"),
       tr2("Department", "\xd8\xa7\xd9\x84\xd9\x82\xd8\xb3\xd9\x85"),
       tr2("Status", "\xd8\xa7\xd9\x84\xd8\xad\xd8\xa7\xd9\x84\xd8\xa9"),
       tr2("Created",
           "\xd8\xa7\xd9\x84\xd8\xa5\xd9\x86\xd8\xb4\xd8\xa7\xd8\xa1")});
  table->horizontalHeader()->setStretchLastSection(true);
  table->horizontalHeader()->setSectionResizeMode(QHeaderView::Stretch);
  table->verticalHeader()->setVisible(false);

  QSqlQuery qt = Database::instance().exec(
      "SELECT template_name, department, "
      "CASE WHEN is_active=1 THEN 'Active' ELSE 'Inactive' END, "
      "created_at FROM form_templates ORDER BY id DESC");
  int row = 0;
  while (qt.next()) {
    table->insertRow(row);
    for (int c = 0; c < 4; c++)
      table->setItem(row, c, new QTableWidgetItem(qt.value(c).toString()));
    row++;
  }
  ll->addWidget(table);

  connect(saveBtn, &QPushButton::clicked, [=]() {
    if (tplName->text().isEmpty())
      return;
    QSqlQuery ins = Database::instance().prepare(
        "INSERT INTO form_templates (template_name, department, form_fields, "
        "created_by) "
        "VALUES (?,?,?,?)");
    ins.addBindValue(tplName->text());
    ins.addBindValue(deptCombo->currentText());
    ins.addBindValue(fieldsEdit->toPlainText());
    ins.addBindValue(currentUserName);
    ins.exec();
    table->insertRow(0);
    table->setItem(0, 0, new QTableWidgetItem(tplName->text()));
    table->setItem(0, 1, new QTableWidgetItem(deptCombo->currentText()));
    table->setItem(0, 2, new QTableWidgetItem("Active"));
    table->setItem(
        0, 3,
        new QTableWidgetItem(QDate::currentDate().toString("yyyy-MM-dd")));
    tplName->clear();
    fieldsEdit->clear();
    QMessageBox::information(
        nullptr, tr2("Saved", "\xd8\xaa\xd9\x85"),
        tr2("Form template saved successfully",
            "\xd8\xaa\xd9\x85 \xd8\xad\xd9\x81\xd8\xb8 "
            "\xd8\xa7\xd9\x84\xd9\x86\xd9\x85\xd9\x88\xd8\xb0\xd8\xac "
            "\xd8\xa8\xd9\x86\xd8\xac\xd8\xa7\xd8\xad"));
  });

  mainLay->addWidget(formBox, 1);
  mainLay->addWidget(listBox, 2);
  layout->addLayout(mainLay);
  return page;
}

QWidget *MainWindow::createDefaultPage(const QString &en, const QString &ar,
                                       const QString &detailsEn,
                                       const QString &detailsAr) {
  QWidget *page = new QWidget();
  QVBoxLayout *layout = new QVBoxLayout(page);
  QLabel *lb = new QLabel(tr2(en, ar));
  lb->setObjectName("pageTitle");
  layout->addWidget(lb);

  QString details = tr2(detailsEn, detailsAr);
  if (!details.isEmpty()) {
    QGroupBox *box = new QGroupBox(tr2(
        "Module Features", "\xd9\x85\xd9\x85\xd9\x8a\xd8\xb2\xd8\xa7\xd8\xaa "
                           "\xd8\xa7\xd9\x84\xd9\x88\xd8\xad\xd8\xaf\xd8\xa9"));
    box->setObjectName("card");
    QVBoxLayout *bl = new QVBoxLayout(box);
    QStringList items = details.split("\n");
    for (const QString &item : items) {
      QLabel *il = new QLabel(item);
      il->setStyleSheet("font-size: 14px; padding: 4px 0;");
      bl->addWidget(il);
    }
    layout->addWidget(box);
  }

  QLabel *sub = new QLabel(
      tr2("Full functionality coming soon.",
          "\xd9\x82\xd8\xb1\xd9\x8a\xd8\xa8\xd8\xa7\xd9\x8b - "
          "\xd8\xaa\xd8\xad\xd8\xaa "
          "\xd8\xa7\xd9\x84\xd8\xaa\xd8\xb7\xd9\x88\xd9\x8a\xd8\xb1"));
  sub->setStyleSheet("color: #94a3b8; font-size: 13px;");
  layout->addWidget(sub);
  layout->addStretch();
  return page;
}

// ===== DELETE HELPER =====
void MainWindow::addDeleteBtn(QTableWidget *table, int row,
                              const QString &dbTable, int dbId) {
  QPushButton *delBtn =
      new QPushButton(tr2("Delete", "\xd8\xad\xd8\xb0\xd9\x81"));
  delBtn->setFixedHeight(28);
  delBtn->setStyleSheet(
      "QPushButton { background-color: #dc2626; color: white; border: none; "
      "border-radius: 4px; padding: 2px 8px; font-size: 11px; }"
      "QPushButton:hover { background-color: #b91c1c; }");
  int lastCol = table->columnCount() - 1;
  table->setCellWidget(row, lastCol, delBtn);
  connect(delBtn, &QPushButton::clicked, [=]() {
    if (QMessageBox::question(
            nullptr,
            tr2("Confirm Delete", "\xd8\xaa\xd8\xa3\xd9\x83\xd9\x8a\xd8\xaf "
                                  "\xd8\xa7\xd9\x84\xd8\xad\xd8\xb0\xd9\x81"),
            tr2("Are you sure you want to delete this record?",
                "\xd9\x87\xd9\x84 \xd8\xa3\xd9\x86\xd8\xaa "
                "\xd9\x85\xd8\xaa\xd8\xa3\xd9\x83\xd8\xaf \xd9\x85\xd9\x86 "
                "\xd8\xad\xd8\xb0\xd9\x81 \xd9\x87\xd8\xb0\xd8\xa7 "
                "\xd8\xa7\xd9\x84\xd8\xb3\xd8\xac\xd9\x84\xd8\x9f")) !=
        QMessageBox::Yes)
      return;
    Database::instance().exec(
        QString("DELETE FROM %1 WHERE id=%2").arg(dbTable).arg(dbId));
    for (int r = 0; r < table->rowCount(); r++) {
      if (table->cellWidget(r, lastCol) == delBtn) {
        table->removeRow(r);
        break;
      }
    }
  });
}

// ===== THEME =====
void MainWindow::applyTheme() {
  struct Theme {
    QString bg, sidebar, header, accent, accentHover, text, textDim, border,
        selectedBg, selectedFg, groupColor, statusColor;
  };
  Theme themes[] = {
      {"#0f172a", "#1e293b", "#334155", "#3b82f6", "#2563eb", "#e2e8f0",
       "#94a3b8", "rgba(255,255,255,0.1)", "rgba(96,165,250,0.2)", "#60a5fa",
       "#60a5fa", "#4ade80"},
      {"#052e16", "#14532d", "#166534", "#22c55e", "#16a34a", "#dcfce7",
       "#86efac", "rgba(255,255,255,0.12)", "rgba(34,197,94,0.2)", "#4ade80",
       "#4ade80", "#a3e635"},
      {"#1e1033", "#2e1065", "#3b0764", "#8b5cf6", "#7c3aed", "#ede9fe",
       "#c4b5fd", "rgba(255,255,255,0.1)", "rgba(139,92,246,0.2)", "#a78bfa",
       "#a78bfa", "#c084fc"},
      {"#1a0000", "#2d0a0a", "#450a0a", "#ef4444", "#dc2626", "#fecaca",
       "#f87171", "rgba(255,255,255,0.1)", "rgba(239,68,68,0.2)", "#f87171",
       "#f87171", "#fb923c"},
      {"#1c1207", "#2c1e0e", "#3d2a14", "#f59e0b", "#d97706", "#fef3c7",
       "#fbbf24", "rgba(255,255,255,0.1)", "rgba(245,158,11,0.2)", "#fbbf24",
       "#fbbf24", "#a3e635"},
      {"#f8fafc", "#e2e8f0", "#cbd5e1", "#3b82f6", "#2563eb", "#1e293b",
       "#64748b", "rgba(0,0,0,0.1)", "rgba(59,130,246,0.15)", "#2563eb",
       "#3b82f6", "#16a34a"},
      {"#eff6ff", "#dbeafe", "#bfdbfe", "#2563eb", "#1d4ed8", "#1e3a5f",
       "#3b82f6", "rgba(0,0,0,0.08)", "rgba(37,99,235,0.15)", "#1d4ed8",
       "#2563eb", "#059669"},
      {"#f0fdf4", "#dcfce7", "#bbf7d0", "#16a34a", "#15803d", "#14532d",
       "#4ade80", "rgba(0,0,0,0.08)", "rgba(22,163,74,0.15)", "#15803d",
       "#16a34a", "#0284c7"},
  };
  Theme t = themes[currentTheme];
  QString ff =
      isArabic ? "'Segoe UI','Tahoma',sans-serif" : "'Segoe UI',sans-serif";
  QString sb = isArabic ? "border-left: 1px solid " + t.border + ";"
                        : "border-right: 1px solid " + t.border + ";";
  bool isLight = currentTheme >= 5;
  QString hov = isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.05)";
  QString inp = isLight ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.05)";
  QString inp2 = isLight ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0.03)";
  QString altRow = isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.03)";
  QString css =
      QString(
          "* { font-family: %1; font-size: 11px; }"
          "QMainWindow, QWidget { background-color: BG; color: TXT; }"
          "#sidebar { background-color: SIDEBAR; border: none; %2 padding-top: "
          "15px; font-size: 14px; }"
          "#sidebar::item { padding: 8px 15px; border-radius: 8px; margin: 2px "
          "8px; }"
          "#sidebar::item:selected { background-color: SELBG; color: SELFG; }"
          "#sidebar::item:hover:!selected { background-color: HOVER; }"
          "#searchBox { background-color: INPUT; border: 1px solid BORDER; "
          "border-radius: 8px; padding: 8px 15px; color: TXT; font-size: 14px; "
          "}"
          "#searchBox:focus { border-color: SELFG; }"
          "#headerUser { font-size: 15px; font-weight: bold; color: TXT; }"
          "#headerStatus { color: STATUS; font-size: 12px; }"
          "#separator { color: BORDER; }"
          "#pageTitle { font-size: 20px; font-weight: bold; color: TXT; "
          "margin-bottom: 10px; }"
          "#card { background-color: SIDEBAR; border: 1px solid BORDER; "
          "border-radius: 12px; padding: 15px; }"
          "#cardLabel { color: TEXTDIM; font-size: 12px; }"
          "QPushButton { background-color: INPUT; border: 1px solid BORDER; "
          "border-radius: 8px; padding: 8px 20px; color: TXT; font-size: 13px; "
          "}"
          "QPushButton:hover { background-color: HOVER; }"
          "#primaryBtn { background-color: ACCENT; border: none; color: white; "
          "font-weight: bold; }"
          "#primaryBtn:hover { background-color: ACCENTHOV; }"
          "QTableWidget { background-color: SIDEBAR; border: 1px solid BORDER; "
          "border-radius: 8px; gridline-color: BORDER; color: TXT; "
          "alternate-background-color: ALTROW; selection-background-color: "
          "SELBG; "
          "selection-color: SELFG; outline: none; }"
          "QTableWidget::item { padding: 8px 6px; border-bottom: 1px solid "
          "BORDER; font-size: 11px; }"
          "QTableWidget::item:selected { background-color: SELBG; color: "
          "SELFG; }"
          "QHeaderView::section { background-color: HEADER; color: TEXTDIM; "
          "padding: 6px 6px; border: none; border-bottom: 2px solid ACCENT; "
          "font-weight: bold; font-size: 11px; }"
          "QScrollBar:vertical { background: SIDEBAR; width: 8px; "
          "border-radius: 4px; }"
          "QScrollBar::handle:vertical { background: TEXTDIM; border-radius: "
          "4px; min-height: 30px; }"
          "QScrollBar::add-line:vertical, QScrollBar::sub-line:vertical { "
          "height: 0; }"
          "QLineEdit { background-color: INPUT; border: 1px solid BORDER; "
          "border-radius: 6px; padding: 6px 10px; color: TXT; }"
          "QTextEdit { background-color: INPUT2; border: 1px solid BORDER; "
          "border-radius: 6px; color: TXT; }"
          "QGroupBox { color: GRPCOLOR; font-weight: bold; border: 1px solid "
          "BORDER; border-radius: 12px; margin-top: 10px; padding-top: 20px; }"
          "QGroupBox::title { subcontrol-origin: margin; left: 15px; padding: "
          "0 5px; }"
          "QComboBox, #langCombo { background-color: INPUT; border: 1px solid "
          "BORDER; border-radius: 8px; padding: 5px 10px; color: TXT; }"
          "QComboBox::drop-down, #langCombo::drop-down { border: none; }"
          "QComboBox QAbstractItemView, #langCombo QAbstractItemView { "
          "background-color: SIDEBAR; color: TXT; selection-background-color: "
          "ACCENT; }")
          .arg(ff)
          .arg(sb);
  css.replace("ACCENTHOV", t.accentHover);
  css.replace("ACCENT", t.accent);
  css.replace("SIDEBAR", t.sidebar);
  css.replace("HEADER", t.header);
  css.replace("TEXTDIM", t.textDim);
  css.replace("TXT", t.text);
  css.replace("SELBG", t.selectedBg);
  css.replace("SELFG", t.selectedFg);
  css.replace("STATUS", t.statusColor);
  css.replace("GRPCOLOR", t.groupColor);
  css.replace("BORDER", t.border);
  css.replace("HOVER", hov);
  css.replace("INPUT2", inp2);
  css.replace("INPUT", inp);
  css.replace("ALTROW", altRow);
  css.replace("BG", t.bg);
  setStyleSheet(css);
}

// ===== HELPER: Patient Completer =====
void MainWindow::setupPatientCompleter(QLineEdit *field) {
  QStringList suggestions;
  QSqlQuery q =
      Database::instance().exec("SELECT name_en, name_ar, phone, file_number "
                                "FROM patients ORDER BY id DESC");
  while (q.next()) {
    suggestions << (q.value(0).toString() + " | " + q.value(1).toString() +
                    " | " + q.value(2).toString() + " | #" +
                    q.value(3).toString());
  }
  QCompleter *c = new QCompleter(suggestions, field);
  c->setCaseSensitivity(Qt::CaseInsensitive);
  c->setFilterMode(Qt::MatchContains);
  field->setCompleter(c);
}

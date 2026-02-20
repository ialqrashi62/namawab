#include "database.h"
#include "mainwindow.h"
#include <QApplication>
#include <QDialog>
#include <QDir>
#include <QLabel>
#include <QLineEdit>
#include <QMessageBox>
#include <QPushButton>
#include <QSqlQuery>
#include <QVBoxLayout>

int main(int argc, char *argv[]) {
  QApplication app(argc, argv);
  app.setApplicationName("Nama Medical ERP");
  app.setOrganizationName("Nama Medical");

  // Initialize database
  QString dbPath = QCoreApplication::applicationDirPath() + "/nama_medical.db";
  if (!Database::instance().init(dbPath)) {
    return 1;
  }

  // ===== LOGIN DIALOG =====
  // Read saved theme from DB to style login page
  int savedTheme = 0;
  {
    QSqlQuery qt = Database::instance().exec(
        "SELECT setting_value FROM company_settings WHERE setting_key='theme'");
    if (qt.next())
      savedTheme = qt.value(0).toInt();
    if (savedTheme < 0 || savedTheme > 7)
      savedTheme = 0;
  }
  // Theme colors: bg, accent, accentHover, text, textDim, border
  struct LoginTheme {
    const char *bg, *accent, *accentHover, *text, *textDim, *inputBg, *border;
  };
  LoginTheme loginThemes[] = {
      {"#0f172a", "#3b82f6", "#2563eb", "#e2e8f0", "#94a3b8",
       "rgba(255,255,255,0.05)", "rgba(255,255,255,0.15)"},
      {"#052e16", "#22c55e", "#16a34a", "#dcfce7", "#86efac",
       "rgba(255,255,255,0.05)", "rgba(255,255,255,0.15)"},
      {"#1e1033", "#8b5cf6", "#7c3aed", "#ede9fe", "#c4b5fd",
       "rgba(255,255,255,0.05)", "rgba(255,255,255,0.15)"},
      {"#1a0000", "#ef4444", "#dc2626", "#fecaca", "#f87171",
       "rgba(255,255,255,0.05)", "rgba(255,255,255,0.15)"},
      {"#1c1207", "#f59e0b", "#d97706", "#fef3c7", "#fbbf24",
       "rgba(255,255,255,0.05)", "rgba(255,255,255,0.15)"},
      {"#f8fafc", "#3b82f6", "#2563eb", "#1e293b", "#64748b",
       "rgba(255,255,255,0.8)", "rgba(0,0,0,0.15)"},
      {"#eff6ff", "#2563eb", "#1d4ed8", "#1e3a5f", "#3b82f6",
       "rgba(255,255,255,0.8)", "rgba(0,0,0,0.12)"},
      {"#f0fdf4", "#16a34a", "#15803d", "#14532d", "#4ade80",
       "rgba(255,255,255,0.8)", "rgba(0,0,0,0.12)"},
  };
  LoginTheme lt = loginThemes[savedTheme];

  QDialog loginDlg;
  loginDlg.setWindowTitle("\xd8\xaa\xd8\xb3\xd8\xac\xd9\x8a\xd9\x84 "
                          "\xd8\xa7\xd9\x84\xd8\xaf\xd8\xae\xd9\x88\xd9\x84 - "
                          "Nama Medical");
  loginDlg.setFixedSize(420, 340);
  loginDlg.setStyleSheet(
      QString("QDialog { background-color: %1; }"
              "QLabel { color: %2; font-size: 14px; }"
              "QLineEdit { background-color: %3; "
              "border: 1px solid %4; border-radius: 8px; "
              "padding: 10px; color: %2; font-size: 14px; }"
              "QLineEdit:focus { border-color: %5; }"
              "QPushButton { background-color: %5; border: none; "
              "border-radius: 8px; padding: 12px; color: white; "
              "font-size: 15px; font-weight: bold; }"
              "QPushButton:hover { background-color: %6; }")
          .arg(lt.bg, lt.text, lt.inputBg, lt.border, lt.accent,
               lt.accentHover));

  QVBoxLayout *loginLayout = new QVBoxLayout(&loginDlg);
  loginLayout->setContentsMargins(40, 30, 40, 30);
  loginLayout->setSpacing(12);

  // Logo / Title
  QLabel *logoLabel = new QLabel("\xd9\x86\xd9\x85\xd8\xa7 "
                                 "\xd8\xa7\xd9\x84\xd8\xb7\xd8\xa8\xd9\x8a");
  logoLabel->setStyleSheet(
      QString("font-size: 28px; font-weight: bold; color: %1;").arg(lt.accent));
  logoLabel->setAlignment(Qt::AlignCenter);
  loginLayout->addWidget(logoLabel);

  QLabel *subtitleLabel = new QLabel("Nama Medical ERP");
  subtitleLabel->setStyleSheet(
      QString("font-size: 13px; color: %1;").arg(lt.textDim));
  subtitleLabel->setAlignment(Qt::AlignCenter);
  loginLayout->addWidget(subtitleLabel);
  loginLayout->addSpacing(15);

  // Username
  loginLayout->addWidget(
      new QLabel("\xd8\xa7\xd8\xb3\xd9\x85 "
                 "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb3\xd8\xaa\xd8\xae\xd8\xaf"
                 "\xd9\x85:"));
  QLineEdit *userEdit = new QLineEdit();
  userEdit->setPlaceholderText("Username");
  userEdit->setFixedHeight(42);
  loginLayout->addWidget(userEdit);

  // Password
  loginLayout->addWidget(
      new QLabel("\xd9\x83\xd9\x84\xd9\x85\xd8\xa9 "
                 "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x88\xd8\xb1:"));
  QLineEdit *passEdit = new QLineEdit();
  passEdit->setEchoMode(QLineEdit::Password);
  passEdit->setPlaceholderText("Password");
  passEdit->setFixedHeight(42);
  loginLayout->addWidget(passEdit);
  loginLayout->addSpacing(10);

  // Login button
  QPushButton *loginBtn = new QPushButton("\xd8\xaf\xd8\xae\xd9\x88\xd9\x84");
  loginBtn->setFixedHeight(48);
  loginLayout->addWidget(loginBtn);

  QString loggedRole, loggedName;
  bool loginSuccess = false;

  auto doLogin = [&]() {
    QString user = userEdit->text().trimmed();
    QString pass = passEdit->text().trimmed();
    if (user.isEmpty() || pass.isEmpty()) {
      QMessageBox::warning(
          &loginDlg, "\xd8\xae\xd8\xb7\xd8\xa3",
          "\xd9\x8a\xd8\xb1\xd8\xac\xd9\x89 \xd8\xa5\xd8\xaf\xd8\xae\xd8\xa7"
          "\xd9\x84 \xd8\xa7\xd8\xb3\xd9\x85 "
          "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb3\xd8\xaa\xd8\xae\xd8\xaf\xd9\x85 "
          "\xd9\x88\xd9\x83\xd9\x84\xd9\x85\xd8\xa9 "
          "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x88\xd8\xb1");
      return;
    }
    QSqlQuery q = Database::instance().exec(
        QString("SELECT display_name, role FROM system_users "
                "WHERE username=N'%1' AND password_hash=N'%2' AND is_active=1")
            .arg(user.replace("'", "''"))
            .arg(pass.replace("'", "''")));
    if (q.next()) {
      loggedName = q.value(0).toString();
      loggedRole = q.value(1).toString();
      loginSuccess = true;
      loginDlg.accept();
    } else {
      QMessageBox::critical(
          &loginDlg,
          "\xd9\x81\xd8\xb4\xd9\x84 \xd8\xaa\xd8\xb3\xd8\xac\xd9\x8a\xd9\x84 "
          "\xd8\xa7\xd9\x84\xd8\xaf\xd8\xae\xd9\x88\xd9\x84",
          "\xd8\xa7\xd8\xb3\xd9\x85 "
          "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb3\xd8\xaa\xd8\xae\xd8\xaf\xd9\x85 "
          "\xd8\xa3\xd9\x88 \xd9\x83\xd9\x84\xd9\x85\xd8\xa9 "
          "\xd8\xa7\xd9\x84\xd9\x85\xd8\xb1\xd9\x88\xd8\xb1 "
          "\xd8\xba\xd9\x8a\xd8\xb1 "
          "\xd8\xb5\xd8\xad\xd9\x8a\xd8\xad\xd8\xa9!");
      passEdit->clear();
      passEdit->setFocus();
    }
  };

  QObject::connect(loginBtn, &QPushButton::clicked, doLogin);
  QObject::connect(passEdit, &QLineEdit::returnPressed, doLogin);
  QObject::connect(userEdit, &QLineEdit::returnPressed,
                   [&]() { passEdit->setFocus(); });

  userEdit->setFocus();

  int exitCode = 0;
  do {
    loggedRole.clear();
    loggedName.clear();
    loginSuccess = false;
    userEdit->clear();
    passEdit->clear();
    userEdit->setFocus();

    if (loginDlg.exec() != QDialog::Accepted || !loginSuccess) {
      return 0;
    }

    MainWindow *window = new MainWindow(loggedRole, loggedName);
    window->show();
    exitCode = app.exec();
    delete window;
  } while (exitCode == 1234);

  return exitCode;
}

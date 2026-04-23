#!/bin/bash
set -e

wget http://archive.ubuntu.com/ubuntu/pool/main/o/openldap/libldap-2.5-0_2.5.16+dfsg-0ubuntu0.22.04.2_amd64.deb -O libldap.deb || true
dpkg -i libldap.deb || true
rm -f libldap.deb

systemctl restart mssql-server
sleep 5

systemctl status mssql-server

/opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P 'NamaMedical@2026!' -Q "CREATE DATABASE NAMA_MEDICAL;"

cmake_minimum_required(VERSION 3.16)
project(NamaMedical VERSION 1.0 LANGUAGES CXX)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTORCC ON)
set(CMAKE_AUTOUIC ON)

# Suppress Vulkan not found warning
set(CMAKE_FIND_PACKAGE_WARN_QUIET ON)

find_package(Qt6 REQUIRED COMPONENTS Widgets Sql PrintSupport)

add_executable(NamaMedical
    main.cpp
    mainwindow.cpp
    mainwindow.h
    database.h
    qrcode.h
    invoice_generator.h
)

target_link_libraries(NamaMedical PRIVATE
    Qt6::Widgets
    Qt6::Sql
    Qt6::PrintSupport
)

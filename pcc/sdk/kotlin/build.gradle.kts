plugins {
    kotlin("jvm") version "1.9.0"
    application
}

group = "com.jumanasoft"
version = "3.316.6"

repositories {
    mavenCentral()
}

dependencies {
    implementation(kotlin("stdlib"))
}

application {
    mainClass.set("com.jumanasoft.pcc.examples.MainKt")
}

tasks.withType<org.jetbrains.kotlin.gradle.tasks.KotlinCompile> {
    kotlinOptions {
        jvmTarget = "11"
    }
}
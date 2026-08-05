// swift-tools-version: 5.7
import PackageDescription

let package = Package(
    name: "PCC",
    platforms: [
        .macOS(.v12),
        .iOS(.v15)
    ],
    products: [
        .library(
            name: "PCC",
            targets: ["PCC"]
        )
    ],
    targets: [
        .target(
            name: "PCC",
            path: "Sources/PCC"
        )
    ]
)
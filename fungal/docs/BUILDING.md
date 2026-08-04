# Building the Fungal System

Complete guide to building, testing, and deploying the Fungal System.

## System Requirements

### Minimum Requirements
- **C++ Compiler**: C++17 capable (GCC 7+, Clang 5+, MSVC 2017+)
- **CMake**: 3.10 or higher
- **Python**: 3.6+ (optional, for build scripts)
- **RAM**: 1GB minimum, 4GB recommended
- **Disk**: 500MB for build artifacts

### Supported Platforms
- **Linux**: Ubuntu 18.04+, CentOS 7+, Debian 9+
- **macOS**: 10.12+
- **Windows**: 10 with MSVC 2017+ or MinGW

### Compiler Support
- GCC 7.0+
- Clang 5.0+
- MSVC 2017+
- ICC (Intel C++ Compiler) 2019+

## Dependencies

### Required
- **CMake 3.10+**: Build system
- **C++17 Standard Library**: Included with compiler

### Optional (for testing)
- **Google Test (GTest)**: For unit/integration/system tests
  - Install on Ubuntu: `sudo apt-get install libgtest-dev`
  - Install on macOS: `brew install googletest`
  - Install on Windows: vcpkg or manual build

### Optional (for documentation)
- **Doxygen**: Generate API documentation (optional)
- **Graphviz**: Generate architecture diagrams (optional)

## Build Instructions

### Quick Start

```bash
cd fungal
mkdir -p build && cd build
cmake ..
make -j4
```

### Detailed Build Steps

1. **Clone and navigate:**
```bash
git clone https://github.com/yourusername/fungal.git
cd fungal
```

2. **Create build directory:**
```bash
mkdir build
cd build
```

3. **Configure CMake:**
```bash
# Basic configuration
cmake ..

# With optimization flags
cmake -DCMAKE_BUILD_TYPE=Release ..

# With debug symbols
cmake -DCMAKE_BUILD_TYPE=Debug ..
```

4. **Build:**
```bash
# Build with 4 parallel jobs
make -j4

# Or use CMake directly
cmake --build . --config Release -j4
```

5. **Verify build:**
```bash
# Should show the main executable
ls -la ./fungal
```

### Build Configurations

#### Release (Optimized)
```bash
cmake -DCMAKE_BUILD_TYPE=Release ..
make -j4
```
- Maximum optimization
- Minimal debug symbols
- Best performance

#### Debug (Development)
```bash
cmake -DCMAKE_BUILD_TYPE=Debug ..
make -j4
```
- No optimization
- Full debug symbols
- Slower execution, easier debugging

#### RelWithDebInfo (Testing)
```bash
cmake -DCMAKE_BUILD_TYPE=RelWithDebInfo ..
make -j4
```
- Medium optimization
- Debug symbols for profiling
- Good balance for testing

## Building Tests

### If GTest is installed:

Tests build automatically:
```bash
cd build
cmake ..
make
ctest --output-on-failure
```

### Install GTest

**Ubuntu/Debian:**
```bash
sudo apt-get install libgtest-dev
cd /usr/src/gtest
sudo cmake .
sudo make
sudo make install
```

**macOS:**
```bash
brew install googletest
```

**Windows (vcpkg):**
```bash
vcpkg install gtest:x64-windows
cmake .. -DCMAKE_TOOLCHAIN_FILE=[vcpkg]/scripts/buildsystems/vcpkg.cmake
```

## Running Tests

### All Tests
```bash
cd build
ctest --output-on-failure
```

### Unit Tests Only
```bash
ctest -L unit --output-on-failure
```

### Integration Tests Only
```bash
ctest -L integration --output-on-failure
```

### System Tests Only
```bash
ctest -L system --output-on-failure
```

### Verbose Output
```bash
ctest --output-on-failure -VV
```

### Run Specific Test
```bash
ctest -R test_name --output-on-failure
```

## Running the Demo Application

```bash
cd build
./fungal
```

Expected output:
```
=== Self-Aware Autonomous AI System Test ===

TEST 1: Hardware Detection
  CPU Cores: 4
  Memory: 16075 MB
  OS: Linux
  Architecture: x86_64
  ✓ Hardware detection working

[... more tests ...]

All systems operational. Self-aware AI ready.
```

## Build Troubleshooting

### GTest Not Found
**Error:**
```
-- GTest not found - tests skipped
```

**Solution:**
```bash
# Install GTest first
sudo apt-get install libgtest-dev

# Clean build
cd build
rm -rf *
cmake ..
make
```

### C++ Version Not Supported
**Error:**
```
error: C++17 is required
```

**Solution:**
- Ensure compiler is C++17 capable
- Update compiler: `sudo apt-get install g++ -y`
- Or specify compiler explicitly:
```bash
cmake -DCMAKE_CXX_COMPILER=g++-9 ..
```

### Out of Memory During Build
**Error:**
```
fatal error: could not write to output file
```

**Solution:**
```bash
# Build with 1 parallel job
make -j1

# Or use fewer jobs
make -j2
```

### Missing Include Directories
**Error:**
```
fatal error: hardware.hpp: No such file or directory
```

**Solution:**
- Ensure CMakeLists.txt includes `target_include_directories`
- Clean and rebuild:
```bash
cd build
rm -rf *
cmake ..
make -j4
```

## Building on Different Platforms

### Linux

**Ubuntu 20.04:**
```bash
# Install dependencies
sudo apt-get update
sudo apt-get install -y build-essential cmake git libgtest-dev

# Build
git clone [repo]
cd fungal
mkdir build && cd build
cmake ..
make -j4
ctest --output-on-failure
```

**CentOS 7:**
```bash
# Install dependencies
sudo yum install -y gcc-c++ cmake git gtest-devel

# Build
git clone [repo]
cd fungal
mkdir build && cd build
cmake ..
make -j4
ctest --output-on-failure
```

### macOS

```bash
# Install dependencies via Homebrew
brew install cmake googletest

# Build
git clone [repo]
cd fungal
mkdir build && cd build
cmake ..
make -j4
ctest --output-on-failure
```

### Windows (MSVC)

```bash
# Using Visual Studio Command Prompt
cd fungal
mkdir build
cd build
cmake -G "Visual Studio 16 2019" ..
cmake --build . --config Release -j4
ctest -C Release --output-on-failure
```

### Windows (MinGW)

```bash
# Using MinGW
cd fungal
mkdir build
cd build
cmake -G "MinGW Makefiles" ..
cmake --build . --config Release -j4
ctest --output-on-failure
```

## Cross-Compilation

### Build for ARM64 on x86_64

```bash
# Create toolchain file (arm64-toolchain.cmake)
set(CMAKE_SYSTEM_NAME Linux)
set(CMAKE_SYSTEM_PROCESSOR aarch64)
set(CMAKE_CXX_COMPILER aarch64-linux-gnu-g++)
set(CMAKE_C_COMPILER aarch64-linux-gnu-gcc)

# Build with toolchain
cmake -DCMAKE_TOOLCHAIN_FILE=arm64-toolchain.cmake ..
make -j4
```

### Build for Raspberry Pi

```bash
cmake -DCMAKE_CXX_COMPILER=arm-linux-gnueabihf-g++ ..
make -j4
```

## Performance Build

For maximum performance:

```bash
cmake -DCMAKE_BUILD_TYPE=Release \
      -DCMAKE_CXX_FLAGS="-march=native -mtune=native -O3" \
      ..
make -j4
```

This enables:
- Native architecture optimization
- Aggressive inlining
- SIMD instruction generation
- Loop unrolling

## Incremental Builds

After modifying source files:

```bash
cd build
make -j4     # Only recompiles changed files
ctest --output-on-failure
```

To force full rebuild:

```bash
cd build
rm -rf *
cmake ..
make -j4
```

## Installation

```bash
cd build
make install

# Default install location: /usr/local/
# Custom location:
make install DESTDIR=/custom/path
```

## Docker Build

Create `Dockerfile`:

```dockerfile
FROM ubuntu:20.04

RUN apt-get update && apt-get install -y \
    build-essential cmake git libgtest-dev

WORKDIR /app
COPY . .

RUN mkdir build && cd build && \
    cmake .. && \
    make -j4 && \
    ctest --output-on-failure

ENTRYPOINT ["./build/fungal"]
```

Build and run:

```bash
docker build -t fungal .
docker run fungal
```

## Build Tips

1. **Fast incremental builds**: Use `-j$(nproc)` for parallel compilation
2. **Reduce binary size**: Use `-DCMAKE_BUILD_TYPE=Release`
3. **Debug with symbols**: Use `-DCMAKE_BUILD_TYPE=Debug`
4. **Check dependencies**: Use `ldd ./fungal` on Linux
5. **Profile build time**: Use `cmake --build . --verbose`

## CI/CD Integration

### GitHub Actions

```yaml
name: Build and Test

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Install dependencies
        run: sudo apt-get install -y libgtest-dev
      - name: Build
        run: |
          mkdir build && cd build
          cmake ..
          make -j4
      - name: Test
        run: cd build && ctest --output-on-failure
```

### GitLab CI

```yaml
build:
  image: ubuntu:20.04
  script:
    - apt-get update && apt-get install -y build-essential cmake libgtest-dev
    - mkdir build && cd build
    - cmake .. && make -j4 && ctest --output-on-failure
```

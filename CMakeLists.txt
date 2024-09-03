cmake_minimum_required(VERSION 3.15)
project(lib3mf_nodeaddon)

# Specify the C++ standard
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Include directories for Node.js and CMake.js
include_directories("/home/vijai/Applications/node-v20.13.1-linux-x64/include/node")

# Source files
set(SOURCE_FILES
        lib3mf_nodeaddon.cc
        lib3mf_nodewrapper.cc
        lib3mf_dynamic.cc
)

# Add the shared library target for the Node.js addon
add_library(${PROJECT_NAME} SHARED ${SOURCE_FILES} ${CMAKE_JS_SRC})

# Platform-specific settings
if (WIN32)
    # Windows-specific compiler settings
    target_compile_definitions(${PROJECT_NAME} PRIVATE _HAS_EXCEPTIONS=1)
    target_compile_options(${PROJECT_NAME} PRIVATE /EHsc)  # Exception handling for MSVC
else()
    # Linux/macOS-specific compiler settings
    target_compile_options(${PROJECT_NAME} PRIVATE -fexceptions)
endif()

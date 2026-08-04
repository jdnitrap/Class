cmake_minimum_required(VERSION 3.10)
project(Fungal)

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

enable_testing()

find_package(GTest QUIET)

if(NOT GTest_FOUND)
    find_package(PkgConfig QUIET)
    if(PkgConfig_FOUND)
        pkg_check_modules(GTEST gtest)
        pkg_check_modules(GTEST_MAIN gtest_main)
    endif()
endif()

set(FOUNDATION_SOURCES
    src/hardware.cpp
    src/substrate.cpp
    src/introspection.cpp
    src/autonomous_node.cpp
    src/self_model.cpp
)

set(LAYER1_SOURCES
    src/layer1/tokenizer.cpp
    src/layer1/analyzer.cpp
    src/layer1/dictionary.cpp
    src/layer1/verifier.cpp
    src/layer1/builder.cpp
    src/layer1/layer1.cpp
)

set(LAYER2_CORE_SOURCES
    src/layer2/core/node.cpp
    src/layer2/core/substrate.cpp
    src/layer2/core/energy.cpp
)

set(LAYER2_PHASES_SOURCES
    src/layer2/phases/phase1_claim_decay.cpp
    src/layer2/phases/phase2_energy_transfer.cpp
    src/layer2/phases/phase3_quarantine.cpp
    src/layer2/phases/phase4_removal.cpp
    src/layer2/phases/phase5_environmental_shocks.cpp
    src/layer2/phases/phase6_asymmetric_trust.cpp
    src/layer2/phases/phase7_specialization.cpp
    src/layer2/phases/phase8_substrate_learning.cpp
    src/layer2/phases/phase9_claim_refinement.cpp
    src/layer2/phases/phase10_multi_network_learning.cpp
    src/layer2/phases/phase11_measurement_uncertainty.cpp
    src/layer2/phases/phase12_hardware_constraints.cpp
)

set(LAYER2_VOTING_SOURCES
    src/layer2/voting/voting.cpp
)

set(BRIDGE_SOURCES
    src/bridge/bridge.cpp
)

set(LAYER2_SOURCES
    src/layer2/layer2.cpp
    ${LAYER2_CORE_SOURCES}
    ${LAYER2_PHASES_SOURCES}
    ${LAYER2_VOTING_SOURCES}
)

set(ALL_SOURCES
    ${FOUNDATION_SOURCES}
    src/fungal_system.cpp
    ${LAYER1_SOURCES}
    ${LAYER2_SOURCES}
    ${BRIDGE_SOURCES}
)

add_library(fungal_lib ${ALL_SOURCES})
target_include_directories(fungal_lib PUBLIC include)

add_executable(fungal src/main.cpp)
target_link_libraries(fungal fungal_lib)

if(GTest_FOUND OR GTEST_FOUND)
    if(GTEST_FOUND)
        include_directories(${GTEST_INCLUDE_DIRS})
    endif()

    add_executable(test_tokenizer tests/unit/test_tokenizer.cpp)
    target_link_libraries(test_tokenizer fungal_lib GTest::gtest_main)
    add_test(NAME test_tokenizer COMMAND test_tokenizer LABELS "unit")

    add_executable(test_analyzer tests/unit/test_analyzer.cpp)
    target_link_libraries(test_analyzer fungal_lib GTest::gtest_main)
    add_test(NAME test_analyzer COMMAND test_analyzer LABELS "unit")

    add_executable(test_phases tests/unit/test_phases.cpp)
    target_link_libraries(test_phases fungal_lib GTest::gtest_main)
    add_test(NAME test_phases COMMAND test_phases LABELS "unit")

    add_executable(test_system_integration tests/integration/test_system.cpp)
    target_link_libraries(test_system_integration fungal_lib GTest::gtest_main)
    add_test(NAME test_system_integration COMMAND test_system_integration LABELS "integration")

    add_executable(test_stress tests/system/test_stress.cpp)
    target_link_libraries(test_stress fungal_lib GTest::gtest_main)
    add_test(NAME test_stress COMMAND test_stress LABELS "system")

    message(STATUS "GTest found - building tests")
else()
    message(WARNING "GTest not found - tests skipped. Install libgtest-dev or set GTEST_INCLUDE_DIRS")
endif()

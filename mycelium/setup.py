#!/usr/bin/env python3
"""Setup for Mycelium v1"""

from setuptools import setup, find_packages
from pathlib import Path

root = Path(__file__).resolve().parent
readme = root / "README_mycelium.md"

setup(
    name="mycelium",
    version="0.1.0",
    description="Walk-the-graph memory. Not a transformer.",
    long_description=readme.read_text() if readme.exists() else "",
    long_description_content_type="text/markdown",
    author="Mycelium",
    packages=find_packages(),
    python_requires=">=3.9",
    install_requires=[],
    entry_points={
        "console_scripts": [
            "mycelium=mycelium.cli:loop",
        ],
    },
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "Programming Language :: Python :: 3.12",
    ],
)

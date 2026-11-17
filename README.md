# NumVex — High-Precision Number System & Computer Arithmetic Suite

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Vanilla JS](https://img.shields.io/badge/Dependencies-Zero%20(Pure%20Vanilla%20JS)-emerald.svg)]()
[![Platform](https://img.shields.io/badge/Platform-Web%20(Client--Side)-indigo.svg)]()
[![Precision](https://img.shields.io/badge/Precision-Arbitrary%20BigInt-amber.svg)]()

**NumVex** is an open-source, client-side workstation for positional numeral systems, arbitrary-radix arithmetic, and computer hardware representations. It provides bidirectional conversions across standard bases and arbitrary radices from **Base 2 up to Base 9999**, complete with step-by-step mathematical derivations, an interactive 64-bit register analyzer, dual IEEE-754 floating-point decomposition, and a bitwise logic laboratory.

All computation is performed in-memory on the client device using native JavaScript `BigInt` and typed arrays—ensuring zero external telemetry, zero latency, and 100% data privacy.

---

## Architecture & Functional Modules

### 1. OmniBase Real-Time Synchronizer
- **Synchronized Bidirectional Input**: Real-time conversion across Binary, Octal, Decimal, Hexadecimal, RFC 4648 Base64, and Roman numerals.
- **Arbitrary Radix Support**: Live translation into user-defined bases from 2 to 9999 with configurable bracketed digit notation ($[d_k]\dots[d_0]$).
- **Arbitrary-Precision Integers**: Powered by ECMAScript `BigInt` arithmetic, eliminating integer overflow constraints up to system memory limits.
- **Exact Fractional Expansion**: Handles fractional inputs with arbitrary-precision rational division and configurable precision limits.

### 2. High-Radix Processing Engine (Bases 2–9999)
- **High Information Density**: Demonstrates higher-order positional notation where each digit position in Base 9999 carries $\log_2(9999) \approx 13.2877$ bits of entropy. A 64-bit unsigned integer ($18,446,744,073,709,551,615$) is fully represented in only 5 digits ($[1844][8584][8117][9279][2355]_{9999}$).
- **Standardized Bracketed Representation**: Radices greater than 36 utilize standard bracketed positional notation ($[0]$ through $[R-1]$), preventing ambiguity between multi-character digits.
- **Pre-Configured Computing Radices**:
  - **Base 1000**: Metric thousand grouping ($10^3$).
  - **Base 1024**: IEC binary kilo ($2^{10}$), aligning 10 bits per column.
  - **Base 2048**: BIP-39 mnemonic lexicon space ($2^{11}$).
  - **Base 3600**: Sexagesimal chrono-radix ($60^2$).
  - **Base 4096**: Memory page boundary ($2^{12}$), mapping exactly three hexadecimal nibbles ($[000]-[FFF]$) per column.
  - **Base 9999**: Tetradigital decimal ceiling ($10^4 - 1$).

### 3. Step-by-Step Mathematical Derivations
- **Polynomial Expansion**: Formulates base-to-decimal translations via explicit Horner-form and sum-of-weights notation:
  $$\sum_{i=0}^{n-1} d_i \cdot b^i$$
- **Repeated Division / Remainder Method**: Computes integer radix conversions with tabular quotients and remainders, recording both Forward and Reverse readouts.
- **Power-of-Two Direct Grouping**: Visualizes direct bit-chunking for $2^k$ radices without intermediate base-10 conversion (Base 8 = 3 bits, Base 16 = 4 bits, Base 64 = 6 bits, Base 1024 = 10 bits, Base 4096 = 12 bits).
- **RFC 4648 Base64 Grouping**: Demonstrates 24-bit (3-byte) buffer alignment into four 6-bit indices with standard padding rules (`=`, `==`).
- **Export Formats**: One-click generation of formatted LaTeX ($\LaTeX$) source, Markdown tables, and structured plain-text calculation sheets.

### 4. Hardware Bit Board & 64-Bit Register Architect
- **Interactive Register Matrix**: Visual toggle array supporting 8-bit, 16-bit, 32-bit, and 64-bit register widths.
- **Signed & Unsigned Encoding**: Real-time evaluation of Unsigned, Two's Complement, One's Complement, and Sign-Magnitude representations.
- **Reflected Binary Gray Code**: Dynamic Gray code encoder/decoder ($G = B \oplus (B \gg 1)$) with single-bit transition verification.
- **Binary-Coded Decimal (BCD)**: Live 8421 packed BCD translation with invalid pseudo-tetrad detection ($> 9$).
- **Byte Order Visualization**: Immediate comparison between Big-Endian and Little-Endian memory layouts.

### 5. Dual-Precision IEEE-754 Floating-Point Analyzer
- **Single (32-bit) and Double (64-bit) Precision**: Complete hardware-level decomposition:
  - **Float32**: 1 Sign bit, 8 Exponent bits (Bias: 127), 23 Mantissa/Significand bits.
  - **Float64**: 1 Sign bit, 11 Exponent bits (Bias: 1023), 52 Mantissa/Significand bits.
- **Special Value Identification**: Automated detection and mathematical formula derivation for Normalized values, Subnormal/Denormal values, Positive Zero ($+0$), Negative Zero ($-0$), Positive/Negative Infinity ($\pm\infty$), and Not-a-Number (Quiet/Signaling NaN).

### 6. Bitwise Operations Laboratory
- **Interactive Logic Engine**: Supports two-operand operations (`AND`, `OR`, `XOR`, `NAND`, `NOR`, `XNOR`) and single-operand operations (`NOT`, Arithmetic Shift Left/Right, Logical Shift Right, Rotate Left/Right).
- **Aligned Bitwise Inspector**: Displays operand registers vertically aligned bit-by-bit with individual gate truth evaluations.

---

## Technical Specifications

| Parameter | Specification |
| :--- | :--- |
| **Supported Base Range** | $2 \le \text{Base} \le 9999$ |
| **Numeric Engine** | ECMAScript `BigInt` (arbitrary integer precision) |
| **Float Standards** | IEEE 754-2008 (Single 32-bit, Double 64-bit) |
| **Dependencies** | Zero external runtime dependencies; Lucide icons for UI symbols |
| **Network Footprint** | 100% Client-Side; no analytics, no external telemetry, zero server round-trips |
| **Theme Engine** | System-aware Dark / Light mode (CSS custom properties) |

---

## Getting Started

### Local Execution

NumVex is composed of static HTML, CSS, and vanilla ES6+ modules. It can be served using any local web server:

```bash
# Clone the repository
git clone https://github.com/priince0/NumVex.git
cd NumVex

# Start a local static file server (Python 3)
python3 -m http.server 8080
```

Open `http://localhost:8080` in any modern web browser.

Alternatively, you can open `index.html` directly:
```bash
# macOS
open index.html

# Linux
xdg-open index.html

# Windows
start index.html
```

---

## Directory Structure

```text
NumVex/
├── index.html            # Core application layout and semantic markup
├── css/
│   └── style.css         # Modern responsive design and design tokens
├── js/
│   ├── app.js            # UI controller, event delegation, and state synchronization
│   ├── converter.js      # Core arithmetic engine (BigInt, arbitrary radix, IEEE-754)
│   └── steps.js          # Mathematical proof generator and LaTeX exporter
├── .gitignore            # Version control exclusion rules
└── README.md             # Technical documentation and specifications
```

---

## License

This project is licensed under the [MIT License](LICENSE).

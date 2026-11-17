<div align="center">

# ⚡ NumVex

### High-Precision Number System, Arbitrary-Radix & Computer Arithmetic Suite

*A zero-dependency, client-side engineering workstation for positional numeral systems (Bases 2–9999), IEEE-754 hardware floating-point decomposition, 64-bit register architecture, and step-by-step mathematical proofs.*

---

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-priince0.github.io%2FNumVex-2563EB?style=for-the-badge)](https://priince0.github.io/NumVex/)
[![GitHub stars](https://img.shields.io/github/stars/priince0/NumVex?style=for-the-badge&color=F59E0B)](https://github.com/priince0/NumVex/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-10B981?style=for-the-badge)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero%20(Pure%20ES6+)-8B5CF6?style=for-the-badge)]()
[![Platform: Client-Side](https://img.shields.io/badge/Platform-100%25%20Private%20Client--Side-06B6D4?style=for-the-badge)]()

<br />

[**Explore Live Application »**](https://priince0.github.io/NumVex/)

[Report Bug](https://github.com/priince0/NumVex/issues) • [Request Feature](https://github.com/priince0/NumVex/issues) • [View Derivation Engine](#-step-by-step-mathematical-derivation-engine)

</div>

<br />

---

## 🧭 System Architecture & Data Flow

```
                     ┌────────────────────────────────────────┐
                     │          OmniBase Real-Time Hub        │
                     │  (Arbitrary-Precision BigInt Engine)   │
                     └───────────────────┬────────────────────┘
                                         │
        ┌────────────────────────────────┼────────────────────────────────┐
        ▼                                ▼                                ▼
┌────────────────┐              ┌────────────────┐              ┌────────────────┐
│ Standard Bases │              │  Radix Engine  │              │ Computer Logic │
│ • Binary (b2)  │              │ • Bases 2–9999 │              │ • IEEE-754 FP  │
│ • Octal (b8)   │              │ • Bracketed [] │              │ • 64b Register │
│ • Decimal (b10)│              │ • Exact Horner │              │ • Gray / BCD   │
│ • Hex (b16)    │              │ • IEC Kibi/MiB │              │ • Bitwise Lab  │
│ • Base64 / RFC │              │ • Page Radices │              │ • ASCII Matrix │
└───────┬────────┘              └────────┬───────┘              └────────┬───────┘
        │                                │                               │
        └────────────────────────────────┼───────────────────────────────┘
                                         ▼
                     ┌────────────────────────────────────────┐
                     │       LaTeX & Markdown Derivations     │
                     │     Print / Homework Export Ready      │
                     └────────────────────────────────────────┘
```

---

## ✨ Key Capabilities

| Module | Core Capability | Highlights |
| :--- | :--- | :--- |
| **🌐 OmniBase Hub** | Unified bidirectional conversion | Arbitrary `BigInt`, exact fraction expansion, quick-copy ticks, smooth horizontal pan |
| **🪐 Arbitrary Radix** | Bases **2 through 9999** | Standardized bracket notation $[d_k]...[d_0]$, metric ($10^3$), IEC ($2^{10}$), page radices ($2^{12}$) |
| **📐 Math Explainer** | Step-by-step calculation proofs | Polynomial Horner expansions, tabular repeated division, direct $2^k$ chunking |
| **🔬 IEEE-754 Lab** | Float32 & Float64 analyzer | Hardware-level Sign, Biased Exponent, and Significand; detects Subnormal, $\pm0$, $\pm\infty$, NaN |
| **🎛️ 64-Bit Register** | Interactive bit board & architect | Clickable toggles (8/16/32/64b), Two's Complement, Gray Code ($G = B \oplus (B \gg 1)$), BCD 8421 |
| **⚡ Bitwise Lab** | Multi-gate aligned truth viewer | Vertical bit alignment for `AND`, `OR`, `XOR`, `NOT`, `NAND`, `NOR`, `XNOR`, and Shifts |
| **🔤 ASCII Matrix** | 128-entry character reference | Dec, Hex, Oct, Bin, Symbol, Name, and functional descriptions with real-time search |

---

## 🚀 Deep-Dive Modules

### 🌐 1. OmniBase Real-Time Synchronizer
- **Instant Reactive Sync**: Editing any numeral representation immediately recalculates all complementary formats without race conditions or input jitter.
- **Unbounded Integer Precision**: Powered by native JavaScript `BigInt`, allowing numbers with dozens of decimal digits without precision loss or truncation.
- **Large-Number UX**:
  - ↔️ **Horizontal Mouse-Wheel Slide**: Smoothly glide through 64-bit or 128-bit bitstreams.
  - ‹ › **Edge Jump Arrows**: One-click jump to Most Significant Bit (MSB) or Least Significant Bit (LSB).
  - 📋 **In-Place Confirmation**: Copy buttons morph into a checkmark (`✓`) with a subtle pulse.
  - 💡 **Magnitude Badges**: Automatic scale annotation (e.g., `≈ 1 Million`, `≈ 18.45 Quintillion`, `UINT64 MAX`).

---

### 🪐 2. Arbitrary-Radix Spectrum (Bases 2–9999)
- **High-Density Positional Notation**: In Base 9999, each digit carries $\log_2(9999) \approx 13.2877$ bits of information. A 64-bit integer requires only 5 digits.
- **Standardized Bracketed Representation**: Radices beyond Base 36 utilize standard mathematical bracketed notation ($[0]$ through $[R-1]$), preventing ambiguity between multi-character digits.
- **Pre-Configured Architecture Benchmarks**:
  - `Base 1000` — Metric decimal thousand ($10^3$)
  - `Base 1024` — Binary Kibi ($2^{10}$), aligning 10 raw bits per column
  - `Base 2048` — BIP-39 mnemonic lexicon space ($2^{11}$)
  - `Base 3600` — Astronomical sexagesimal chrono-radix ($60^2$)
  - `Base 4096` — Hardware memory page radix ($2^{12} = 4096$), exactly three hexadecimal nibbles ($[000]-[FFF]$)
  - `Base 9999` — Tetradigital decimal boundary

---

### 📐 3. Step-by-Step Mathematical Derivation Engine

> [!NOTE]
> Every calculation provides human-readable mathematical proofs formatted for academic coursework, technical reports, and printouts.

- **Polynomial Expansion Method**:
  $$\text{Value} = \sum_{i=0}^{n-1} d_i \cdot b^i = d_{n-1} b^{n-1} + \dots + d_1 b^1 + d_0 b^0$$
- **Repeated Division / Remainder Method**:
  Visualizes integer radix transitions through structured division tables tracking intermediate quotients and remainders (with both Forward and Reverse readouts).
- **Direct Power-of-Two Bit Grouping**:
  Avoids base-10 intermediate hops by slicing binary streams directly into power-of-two clusters:
  - **Base 8 (Octal)**: 3-bit clusters
  - **Base 16 (Hex)**: 4-bit nibbles
  - **Base 64 (RFC 4648)**: 6-bit sextets with `=`/`==` padding
  - **Base 1024**: 10-bit chunks
  - **Base 4096**: 12-bit blocks
- **Academic Export**: One-click export for **LaTeX source code** ($\LaTeX$) and **Markdown tables**, with `@media print` optimized styling for physical reports.

---

### 🔬 4. Dual IEEE-754 Floating-Point Laboratory

Visualizes physical IEEE 754-2008 memory layouts:

```
Float32 (Single Precision, 32-bit):
┌───┬──────────────┬─────────────────────────────────────────────────┐
│ S │  8-bit Exp   │                 23-bit Mantissa                 │
└───┴──────────────┴─────────────────────────────────────────────────┘
 31  30          23 22                                              0

Float64 (Double Precision, 64-bit):
┌───┬───────────────────┬────────────────────────────────────────────┐
│ S │    11-bit Exp     │               52-bit Mantissa              │
└───┴───────────────────┴────────────────────────────────────────────┘
 63  62               52 51                                         0
```

- **Color-Coded Hardware Breakdown**:
  - 🟥 **Sign ($S$)**: $0 = \text{Positive}$, $1 = \text{Negative}$
  - 🟩 **Biased Exponent ($E$)**: Raw exponent with bias adjustment (Bias 127 for Float32, Bias 1023 for Float64)
  - 🟦 **Mantissa / Significand ($M$)**: Stored fraction with implicit hidden bit ($1.M$)
- **Automated Condition Detection**:
  - Normalized Numbers: $(-1)^S \times 2^{E - \text{Bias}} \times (1 + M)$
  - Subnormal / Denormal Numbers: $(-1)^S \times 2^{1 - \text{Bias}} \times (0 + M)$
  - Zero Representation ($+0.0$ and $-0.0$)
  - Infinities ($+\infty$ and $-\infty$)
  - Not-a-Number (Quiet NaN / Signaling NaN)

---

### 🎛️ 5. 64-Bit Register Architect & Logic Lab
- **Interactive Switch Matrix**: Click individual bits to toggle states across 8, 16, 32, or 64-bit word lengths.
- **Signed Arithmetic Interpretations**:
  - **Unsigned Integer**: Standard binary magnitude
  - **Two's Complement**: Hardware standard signed arithmetic ($N = -b_{n-1} 2^{n-1} + \sum_{i=0}^{n-2} b_i 2^i$)
  - **One's Complement & Sign-Magnitude**: Classic historical signed formats
- **Digital Logic Decoders**:
  - **Gray Code**: Reflected binary encoding ($G = B \oplus (B \gg 1)$) preventing race conditions during physical encoder transitions.
  - **BCD (8421)**: Binary-Coded Decimal validator with illegal state detection ($1010_2$ to $1111_2$).
  - **Endianness**: Big-Endian vs. Little-Endian memory byte alignment.

---

## 🔒 Security & Privacy Guarantee

> [!IMPORTANT]
> **Zero Network Telemetry**: NumVex is strictly client-side.
> - No tracking scripts, analytics cookies, or external server pings.
> - No user input leaves your browser session.
> - Operates seamlessly offline.

---

## 💻 Quick Start

### 🌐 Direct Browser Access
Visit the hosted instance: **[https://priince0.github.io/NumVex/](https://priince0.github.io/NumVex/)**

### 🖥️ Local Setup
Clone and serve the repository using any static web server:

```bash
# 1. Clone repository
git clone https://github.com/priince0/NumVex.git
cd NumVex

# 2. Run local HTTP server (Python 3)
python3 -m http.server 8080

# 3. Open in browser
open http://localhost:8080
```

---

## 📁 Repository Structure

```
NumVex/
├── index.html            # Semantic HTML5 layout and accessibility markup
├── css/
│   └── style.css         # Glassmorphism design system, CSS variables, print styles
├── js/
│   ├── app.js            # UI controller, state sync, and keyboard shortcuts
│   ├── converter.js      # Core BigInt, arbitrary-radix, and IEEE-754 algorithms
│   └── steps.js          # Formal derivation generator and LaTeX/Markdown exporter
├── .gitignore            # Git exclusion rules
├── LICENSE               # MIT Open Source License
└── README.md             # Project documentation
```

---

## 📄 License

This project is open-source under the [MIT License](LICENSE).

---

<div align="center">

Made with precision by **[@priince0](https://github.com/priince0)**

⭐ **If you find NumVex useful, please consider starring the repository!**

</div>

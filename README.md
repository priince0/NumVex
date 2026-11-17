# NumVex — Modern Number System & Radix Suite

A feature-packed, high-precision number system converter, deep **Radix Cosmos (Base 2 to 9999)**, step-by-step mathematical explainer (including dedicated **RFC 4648 Base64** 6-bit grouping, power-of-two chunking up to Base 4096, and arbitrary custom radices up to 9999), interactive bit register architect, dual IEEE-754 32/64-bit floating point analyzer, and bitwise logic lab.

---

## 🚀 The 9999 Expansion: Beyond Human & Computing Limits

We expanded the custom base engine from Base 999 to **Base 9999 (Tetradigital Myriad Zenith)**:
- **Entropy & Information Density**: At Base 9999, each single digit stores $\log_2(9999) \approx 13.2877$ bits of raw binary information. A 64-bit unsigned integer ($18,446,744,073,709,551,615$) requires only **5 digits** in Base 9999!
- **High-Radix Bracketed Standard**: Positional digits range from $[0]$ through $[9998]$. For example:
  - $1,000,000_{10} = [100][100]_{9999}$ ($100 \times 9999 + 100 = 1,000,000$).
  - $[1][2][3]_{9999} = 100,000,002_{10}$.
- **Key Computing & Historical Landmarks**:
  - **Base 1000** ("Millennial Radix"): Metric thousands grouping ($10^3$).
  - **Base 1024** ("Binary Kibi / IEC Radix"): $2^{10}$ exact power-of-two chunking (10 bits per column).
  - **Base 2048** ("BIP-39 Radix"): The 2048-word mnemonic dictionary used in cryptocurrency hardware wallets.
  - **Base 3600** ("Sexagesimal Chrono-Radix"): $60^2$ seconds per hour for astronomical time.
  - **Base 4096** ("Page Radix"): $2^{12} = 4096$ memory page size, exactly 3 hex nibbles ($[000]-[FFF]$) per digit.
  - **Base 9999** ("Tetradigital Myriad Zenith"): 4-decimal-digit boundary.
- **Power-of-Two Bit-Grouping Suite**: Direct nibble/chunk mapping for 8 (3b), 16 (4b), 64 (6b), 256 (8b), 1024 (10b), and 4096 (12b).

---

## 🌟 What's New: The "11/10" Engineering Upgrade

1. **✨ Clean, Focused Minimalist Header**:
   - Streamlined, distraction-free header featuring clean branding and an instant Light / Dark Obsidian Glassmorphism theme toggle.
   - 100% private, zero network tracking, client-side only architecture.
2. **📋 In-Place Copy Tick Indicator (No Bottom Toasts)**:
   - Every copy button across the app (OmniBase cards, Step-by-Step LaTeX / Markdown export) now provides in-place confirmation: the icon instantly morphs into an emerald green checkmark/tick (`check`), applies a subtle pulse and emerald ring highlight, and smoothly reverts after 1.6 seconds without showing any intrusive bottom popup toasts.
3. **↔️ Universal Horizontal Scroll & Navigation for Large Numbers**:
   - For numbers of any length (64-bit/128-bit Binary, 50-digit Decimal, long Hex, or high-radix Custom decompositions):
     - **Mouse-Wheel Horizontal Pan**: Hover over any input and use the mouse wheel to smoothly slide through large numbers.
     - **Floating Jump Arrows (`‹` / `›`)**: Sleek edge jump buttons appear when content overflows, allowing instant 1-click snapping to the start or end of the number.
     - **Dedicated Binary Bit Scrubber**: Interactive slider beneath the Binary card with live pan percentage and **◄ MSB** / **LSB ►** buttons.
4. **💡 High-Utility Micro-Details**:
   - **Human-Readable Magnitudes**: Decimal inputs display real-time magnitude badges (e.g. `≈ 1 Million`, `≈ 1 Billion`, `≈ 18.45 Quintillion`, `UINT64 MAX`).
   - **Quick Sign Toggle ($\pm$)**: Dedicated `±` button on every card flips positive and negative signed representation with one click.
   - **Double-Click Select-All**: Double-clicking any input instantly selects the entire number.
   - **Escape Key Clear**: Pressing `Esc` while focused on any input clears it immediately.
5. **🔬 Dual-Precision IEEE-754 Analyzer (32-bit Single & 64-bit Double Precision)**:
   - Full 64-bit IEEE-754 support with 1-bit Sign, 11-bit Exponent (Bias 1023), and 52-bit Mantissa breakdown.
   - Exact subnormal, infinity, and NaN hardware condition modeling.
2. **📑 Multi-Format Derivation Exporter**:
   - One-click copy for **LaTeX** ($\LaTeX$) mathematical notation and **Markdown** formatted tables.
   - Direct-to-PDF / Print calculation sheets formatted via `@media print`.
3. **⌨️ Searchable 128 ASCII & Control Character Matrix**:
   - Complete 0–127 character reference with Dec, Hex, Oct, Bin, Symbol, Name, and description (e.g. `NUL`, `CR`, `LF`, `ESC`, `DEL`).
   - Real-time search filter and quick access modal.
4. **🔊 Web Audio API Synthesized Tactile Sound**:
   - Zero-asset, zero-latency mechanical click & snap audio feedback using procedural Web Audio oscillators.
   - Header toggle button with persistent state.
5. **🧮 Gray Code & BCD (8421) Register Decoders**:
   - Live reflected binary Gray code decoder ($G = B \oplus (B \gg 1)$) on the Bit Board.
   - Binary-Coded Decimal (packed 8421 nibbles) real-time decoder with illegal nibble detection ($> 9$).

---

## 🛠️ Complete Feature Suite

1. **🌐 OmniBase Real-Time Hub**: Real-time synchronized conversion across Binary, Octal, Decimal, Hexadecimal, Custom Base (2–9999 with quick pills), and Roman Numerals with `BigInt` and exact rational fraction arithmetic.
2. **🪐 Radix Cosmos (Base 2 – 9999)**: Interactive spectrum slider, famous radices carousel (12, 16, 60, 64, 256, 1000, 1024, 3600, 4096, 9999), interactive positional abacus tower with `+`/`-` steppers, capacity gauges, and number theory metrics.
3. **📐 Step-by-Step Mathematical Explainer**: Detailed polynomial expansions, repeated divisions, and direct bit-grouping for Binary, Octal, Hex, Base64, and any custom radix up to 9999.
4. **🎛️ Interactive Bit Board & Register Architect**: Clickable 8/16/32/64-bit switches, unsigned/signed two's complement, Gray code, BCD, and endianness visualizer.
5. **🔬 IEEE-754 32/64-bit Dual Precision Floating Point Analyzer**: Color-coded Sign, Biased Exponent, and Mantissa hardware breakdown for Float32 and Float64.
6. **⚡ Bitwise Operations Lab**: Bit-by-bit aligned truth viewer for AND, OR, XOR, NOT, NAND, NOR, XNOR, and Shifts.
7. **🔤 Text & ASCII / UTF-8 Encoder**: Instant text to hex, binary, and decimal byte array inspector.

---

## 🚀 Running the App

```bash
# Using Python:
python3 -m http.server 8080

# Or simply open index.html in your browser
open index.html
```
Navigate to `http://localhost:8080`.

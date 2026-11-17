/**
 * NumVex - Number System Converter Core Engine
 * High precision conversion handling arbitrary-sized integers (BigInt),
 * exact rational fractional radix conversions, IEEE-754 32-bit & 64-bit floats,
 * Two's Complement, Gray Code, BCD, Roman Numerals, RFC 4648 Base64,
 * and High-Radix positional engines up to Base 9999.
 */

const Converter = (() => {
  const DIGITS_36 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const DIGITS_62 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  const BASE64_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

  // Famous high radices registry with rich mathematical & historical metadata
  const FAMOUS_RADICES = {
    2: { name: "Binary", category: "Computing", note: "The atomic foundation of digital computation and Boolean logic." },
    3: { name: "Ternary", category: "Exotic", note: "Balanced ternary was used in Soviet Setun computers; minimizes radix economy." },
    8: { name: "Octal", category: "Computing", note: "Compact representation for 3-bit groups; classic Unix file permissions." },
    10: { name: "Decimal", category: "Human", note: "Universal Hindu-Arabic system based on 10 human fingers." },
    12: { name: "Duodecimal (Dozenal)", category: "Mathematical", note: "Advocated by Dozenalists; highly divisible by 2, 3, 4, and 6." },
    16: { name: "Hexadecimal", category: "Computing", note: "The developer lingua franca; maps 1:1 with 4-bit nibbles." },
    20: { name: "Vigesimal", category: "Historical", note: "Ancient Mayan long count calendar and Celtic/traditional French counting." },
    36: { name: "Base 36 (Alphanumeric)", category: "Encoding", note: "Case-insensitive compact URLs and alphanumeric hash codes." },
    60: { name: "Babylonian Sexagesimal", category: "Historical", note: "Ancient Mesopotamian astronomical base; still measures our clocks and angles (60s, 60m, 360°)." },
    64: { name: "Base64 (RFC 4648)", category: "Encoding", note: "Groups bits into 6-bit units (2^6 = 64). Industry standard for binary-to-text encoding in web assets, MIME, and cryptographic keys." },
    85: { name: "Ascii85 (Base85)", category: "Encoding", note: "Used in Adobe PostScript, PDF specifications, and Git binary patches." },
    100: { name: "Centimal", category: "Decimal Matrix", note: "Two-decimal digit grouping; natural basis for currency and percentages." },
    256: { name: "Byte / Octet Radix", category: "Hardware", note: "Base 256 powers IPv4 addressing (192.168.1.1) and raw memory streams." },
    360: { name: "Degree Radix", category: "Geometry", note: "Corresponds to the 360 degrees of a full circle and Babylonian calendar." },
    999: { name: "Kilocimal Boundary", category: "High Radix", note: "The 3-digit decimal boundary. Each digit represents values 0 through 998." },
    1000: { name: "Millennial Radix", category: "Metric Scale", note: "The 3-decimal digit metric grouping radix. Powers correspond directly to metric prefixes (kilo, mega, giga, tera)." },
    1024: { name: "Binary Kibi (IEC Radix)", category: "Computing", note: "2^10 = 1024. Exact hardware unit for KiB, MiB, GiB. Each positional column represents exactly 10 raw binary bits." },
    2048: { name: "BIP-39 Mnemonic Radix", category: "Cryptography", note: "Standard 2048-word dictionary used in deterministic cryptocurrency wallet seeds." },
    3600: { name: "Sexagesimal Chrono-Radix", category: "Chronometry", note: "60^2 = 3600 seconds per hour. The universal foundation for celestial degrees and astronomical time." },
    4096: { name: "Page Radix (4 KiB)", category: "Operating Systems", note: "2^12 = 4096. Standard memory page size in x86/ARM CPUs. Exactly 3 hexadecimal nibbles [000]-[FFF] per digit." },
    9999: { name: "Tetradigital Myriad Zenith", category: "Extreme Radix", note: "The ultimate 4-digit decimal boundary. Each digit represents values 0 through 9998, encoding 13.2877 bits of entropy per column." }
  };

  // Prime factorization of any base N
  function getBaseFactorization(base) {
    let n = parseInt(base, 10);
    if (isNaN(n) || n < 2) return [];
    const factors = [];
    let d = 2;
    while (d * d <= n) {
      if (n % d === 0) {
        let count = 0;
        while (n % d === 0) {
          count++;
          n = Math.floor(n / d);
        }
        factors.push({ prime: d, power: count });
      }
      d = d === 2 ? 3 : d + 2;
    }
    if (n > 1) {
      factors.push({ prime: n, power: 1 });
    }
    return factors;
  }

  // Divisors of base N
  function getDivisors(base) {
    const n = parseInt(base, 10);
    const divs = [];
    for (let i = 1; i <= n; i++) {
      if (n % i === 0) divs.push(i);
    }
    return divs;
  }

  // Split string into sign, integer, and fractional parts
  function splitParts(str) {
    const clean = str.trim();
    const isNegative = clean.startsWith('-');
    const withoutSign = isNegative ? clean.slice(1) : (clean.startsWith('+') ? clean.slice(1) : clean);
    const dotIndex = withoutSign.indexOf('.');
    if (dotIndex === -1) {
      return { isNegative, intPart: withoutSign, fracPart: null };
    }
    return {
      isNegative,
      intPart: withoutSign.slice(0, dotIndex),
      fracPart: withoutSign.slice(dotIndex + 1)
    };
  }

  // Check if string contains bracketed/delimited high radix tokens
  function isBracketedOrDelimited(str) {
    return str.includes('[') || str.includes(']') || str.includes(',') || str.includes(':') || (str.includes(' ') && /\d+\s+\d+/.test(str));
  }

  // Parse high radix tokens
  function parseHighRadixTokens(str, radix) {
    const r = parseInt(radix, 10);
    let s = str.trim();
    if (s.startsWith('-') || s.startsWith('+')) s = s.slice(1);
    s = s.trim();

    let tokens = [];
    if (s.includes('[') || s.includes(']')) {
      const matches = s.match(/\[(\d+)\]/g);
      if (!matches) throw new Error("Invalid bracketed digit format. Expected e.g. [12][45]");
      tokens = matches.map(m => parseInt(m.replace(/[\[\]]/g, ''), 10));
    } else if (s.includes(',') || s.includes(':') || s.includes(' ')) {
      tokens = s.split(/[\s,:]+/).filter(Boolean).map(t => parseInt(t, 10));
    } else if (/^\d+$/.test(s) && r > 36) {
      tokens = [parseInt(s, 10)];
    } else {
      throw new Error(`Cannot parse high-radix string for Base ${radix}`);
    }

    for (const d of tokens) {
      if (isNaN(d) || d < 0 || d >= r) {
        throw new Error(`Digit ${d} is out of valid range [0, ${r - 1}] for Base ${radix}`);
      }
    }
    return tokens;
  }

  // Validate if input is valid for arbitrary radix (2 to 9999)
  function isValidForRadix(str, radix) {
    if (!str || str.length === 0) return false;
    const r = parseInt(radix, 10);
    if (isNaN(r) || r < 2 || r > 9999) return false;

    let s = str.trim();
    if (s.startsWith('-') || s.startsWith('+')) s = s.slice(1);
    s = s.trim();
    if (!s) return false;

    // High radix bracketed / delimited check
    if (isBracketedOrDelimited(s)) {
      try {
        const parts = s.split('.');
        if (parts.length > 2) return false;
        parseHighRadixTokens(parts[0], r);
        if (parts[1]) parseHighRadixTokens(parts[1], r);
        return true;
      } catch (e) {
        return false;
      }
    }

    // Base 64 RFC 4648 character check
    if (r === 64) {
      const parts = s.split('.');
      if (parts.length > 2) return false;
      for (const part of parts) {
        for (let i = 0; i < part.length; i++) {
          if (BASE64_ALPHABET.indexOf(part[i]) === -1) return false;
        }
      }
      return true;
    }

    // Standard alphanumeric for radix <= 36
    if (r <= 36) {
      s = s.replace(/[\s_,]/g, '');
      const parts = s.split('.');
      if (parts.length > 2) return false;
      for (const part of parts) {
        for (let i = 0; i < part.length; i++) {
          const char = part[i].toUpperCase();
          const val = DIGITS_36.indexOf(char);
          if (val === -1 || val >= r) return false;
        }
      }
      return true;
    }

    // Radix 37 to 62 support alphanumeric
    if (r <= 62 && /^[0-9a-zA-Z.]+$/.test(s)) {
      const parts = s.split('.');
      if (parts.length > 2) return false;
      for (const part of parts) {
        for (let i = 0; i < part.length; i++) {
          const val = DIGITS_62.indexOf(part[i]);
          if (val === -1 || val >= r) return false;
        }
      }
      return true;
    }

    // High radix raw single integer number
    if (/^\d+$/.test(s)) {
      const val = parseInt(s, 10);
      return !isNaN(val) && val < r;
    }

    return false;
  }

  // Parse BigInt from any radix (2 to 9999)
  function parseBigInt(str, radix) {
    const r = BigInt(radix);
    const rNum = parseInt(radix, 10);
    let s = str.trim();
    let isNeg = false;
    if (s.startsWith('-')) {
      isNeg = true;
      s = s.slice(1);
    } else if (s.startsWith('+')) {
      s = s.slice(1);
    }
    s = s.trim();

    if (!s) throw new Error("Empty number string");

    if (isBracketedOrDelimited(s) || (rNum > 36 && rNum !== 64 && !/^[0-9a-zA-Z]+$/.test(s))) {
      const tokens = parseHighRadixTokens(s, rNum);
      let val = 0n;
      for (const d of tokens) {
        val = val * r + BigInt(d);
      }
      return isNeg ? -val : val;
    }

    if (rNum === 64) {
      let val = 0n;
      for (let i = 0; i < s.length; i++) {
        const idx = BASE64_ALPHABET.indexOf(s[i]);
        if (idx === -1) throw new Error(`Invalid Base64 character '${s[i]}'`);
        val = val * 64n + BigInt(idx);
      }
      return isNeg ? -val : val;
    }

    if (rNum <= 36) {
      s = s.replace(/[\s_,]/g, '');
      let val = 0n;
      for (let i = 0; i < s.length; i++) {
        const char = s[i].toUpperCase();
        const digit = DIGITS_36.indexOf(char);
        if (digit === -1 || digit >= rNum) {
          throw new Error(`Invalid digit '${s[i]}' for base ${radix}`);
        }
        val = val * r + BigInt(digit);
      }
      return isNeg ? -val : val;
    }

    if (rNum <= 62 && /^[0-9a-zA-Z]+$/.test(s)) {
      let val = 0n;
      for (let i = 0; i < s.length; i++) {
        const digit = DIGITS_62.indexOf(s[i]);
        if (digit === -1 || digit >= rNum) {
          throw new Error(`Invalid digit '${s[i]}' for base ${radix}`);
        }
        val = val * r + BigInt(digit);
      }
      return isNeg ? -val : val;
    }

    if (/^\d+$/.test(s)) {
      const d = BigInt(s);
      if (d >= r) throw new Error(`Digit ${s} is out of range for base ${radix}`);
      return isNeg ? -d : d;
    }

    throw new Error(`Cannot parse "${str}" in Base ${radix}`);
  }

  // Format BigInt to any radix (2 to 9999)
  function formatBigInt(val, radix, options = {}) {
    const rNum = parseInt(radix, 10);
    const r = BigInt(rNum);
    const isNeg = val < 0n;
    let n = isNeg ? -val : val;

    if (n === 0n) {
      if (rNum === 64) return options.forceBracketed ? "[0]" : "A";
      if (rNum > 36) return "[0]";
      return "0";
    }

    const digitArray = [];
    while (n > 0n) {
      const rem = Number(n % r);
      digitArray.unshift(rem);
      n = n / r;
    }

    let result = "";

    if (rNum <= 36 && !options.forceBracketed) {
      const alphabet = options.uppercase === false ? DIGITS_36.toLowerCase() : DIGITS_36;
      result = digitArray.map(d => alphabet[d]).join('');
    } else if (rNum === 64 && !options.forceBracketed) {
      result = digitArray.map(d => BASE64_ALPHABET[d]).join('');
    } else if (rNum <= 62 && options.alphanumeric62) {
      result = digitArray.map(d => DIGITS_62[d]).join('');
    } else {
      if (options.delimiter) {
        result = digitArray.join(options.delimiter);
      } else {
        result = digitArray.map(d => `[${d}]`).join('');
      }
    }

    return isNeg ? "-" + result : result;
  }

  // Get detailed positional decomposition vector of BigInt in radix
  function getPositionalDecomposition(val, radix) {
    const rNum = parseInt(radix, 10);
    const r = BigInt(rNum);
    const isNeg = val < 0n;
    let n = isNeg ? -val : val;

    if (n === 0n) {
      return [{
        position: 0,
        digit: 0,
        powerWeight: "1",
        contribution: "0",
        fractionOfBase: 0,
        symbol: rNum === 64 ? "A" : (rNum <= 36 ? "0" : "[0]")
      }];
    }

    const rawDigits = [];
    while (n > 0n) {
      rawDigits.push(Number(n % r));
      n = n / r;
    }

    const columns = [];
    for (let i = 0; i < rawDigits.length; i++) {
      const digit = rawDigits[i];
      const power = BigInt(i);
      const weight = r ** power;
      const termContribution = BigInt(digit) * weight;

      let symbol = `[${digit}]`;
      if (rNum === 64) symbol = BASE64_ALPHABET[digit];
      else if (rNum <= 36 && digit < 36) symbol = DIGITS_36[digit];

      columns.unshift({
        position: i,
        digit,
        symbol,
        powerWeight: weight.toString(),
        contribution: termContribution.toString(),
        fractionOfBase: rNum > 1 ? digit / (rNum - 1) : 0
      });
    }

    return columns;
  }

  // Exact rational fraction conversion using BigInt
  function convertFraction(fracStr, srcRadix, tgtRadix, maxPrecision = 12) {
    if (!fracStr || fracStr.length === 0) return "";

    const srcRNum = parseInt(srcRadix, 10);
    const tgtRNum = parseInt(tgtRadix, 10);
    const srcR = BigInt(srcRNum);
    const tgtR = BigInt(tgtRNum);

    let numerator = 0n;
    let denominator = 1n;

    if (isBracketedOrDelimited(fracStr)) {
      const tokens = parseHighRadixTokens(fracStr, srcRNum);
      for (const d of tokens) {
        numerator = numerator * srcR + BigInt(d);
      }
      denominator = srcR ** BigInt(tokens.length);
    } else if (srcRNum === 64) {
      for (let i = 0; i < fracStr.length; i++) {
        const idx = BASE64_ALPHABET.indexOf(fracStr[i]);
        if (idx === -1) break;
        numerator = numerator * 64n + BigInt(idx);
      }
      denominator = 64n ** BigInt(fracStr.length);
    } else if (srcRNum <= 36) {
      for (let i = 0; i < fracStr.length; i++) {
        const digit = BigInt(DIGITS_36.indexOf(fracStr[i].toUpperCase()));
        if (digit < 0n || digit >= srcR) break;
        numerator = numerator * srcR + digit;
      }
      denominator = srcR ** BigInt(fracStr.length);
    }

    function gcd(a, b) {
      while (b > 0n) {
        const temp = b;
        b = a % b;
        a = temp;
      }
      return a;
    }

    const g = gcd(numerator, denominator);
    if (g > 1n) {
      numerator /= g;
      denominator /= g;
    }

    const fracDigits = [];
    let count = 0;

    while (numerator > 0n && count < maxPrecision) {
      numerator *= tgtR;
      const digit = Number(numerator / denominator);
      fracDigits.push(digit);
      numerator = numerator % denominator;
      count++;
    }

    if (fracDigits.length === 0) return "0";

    if (tgtRNum === 64) {
      return fracDigits.map(d => BASE64_ALPHABET[d]).join('');
    } else if (tgtRNum <= 36) {
      return fracDigits.map(d => DIGITS_36[d]).join('');
    } else {
      return fracDigits.map(d => `[${d}]`).join('');
    }
  }

  // Full conversion from any base (2 to 9999) to any base (2 to 9999)
  function convertRadix(inputStr, srcRadix, tgtRadix, options = {}) {
    if (!isValidForRadix(inputStr, srcRadix)) {
      throw new Error(`Invalid input for Base ${srcRadix}`);
    }

    const { isNegative, intPart, fracPart } = splitParts(inputStr);

    let tgtInt = "0";
    if (intPart && intPart.length > 0) {
      const bigIntVal = parseBigInt(intPart, srcRadix);
      tgtInt = formatBigInt(bigIntVal, tgtRadix, options);
    }

    let tgtFrac = "";
    if (fracPart !== null && fracPart.length > 0) {
      tgtFrac = convertFraction(fracPart, srcRadix, tgtRadix, 12);
    }

    let result = (isNegative && tgtInt !== "0" && tgtInt !== "[0]" ? "-" : "") + tgtInt;
    if (fracPart !== null) {
      result += "." + (tgtFrac || "0");
    }

    return result;
  }

  // Formatting with bit/digit grouping
  function formatGrouped(valStr, radix, groupSize = null) {
    if (!valStr) return "";
    const r = parseInt(radix, 10);
    if (r > 36 && r !== 64) return valStr;

    const isNeg = valStr.startsWith('-');
    const clean = isNeg ? valStr.slice(1) : valStr;
    const parts = clean.split('.');

    let intPart = parts[0];
    const fracPart = parts[1];

    if (!groupSize) {
      if (r === 2) groupSize = 4;
      else if (r === 8) groupSize = 3;
      else if (r === 10) groupSize = 3;
      else if (r === 16) groupSize = 4;
      else if (r === 64) groupSize = 4;
      else groupSize = 4;
    }

    let groupedInt = "";
    let len = intPart.length;
    for (let i = len; i > 0; i -= groupSize) {
      const start = Math.max(0, i - groupSize);
      const chunk = intPart.substring(start, i);
      groupedInt = chunk + (groupedInt ? " " + groupedInt : "");
    }

    let groupedFrac = "";
    if (fracPart !== undefined) {
      for (let i = 0; i < fracPart.length; i += groupSize) {
        const chunk = fracPart.substring(i, i + groupSize);
        groupedFrac += (groupedFrac ? " " : "") + chunk;
      }
    }

    let res = (isNeg ? "-" : "") + (groupedInt || "0");
    if (fracPart !== undefined) res += "." + (groupedFrac || "0");
    return res;
  }

  // Two's complement and bit representations for given bit width
  function getBitRepresentations(valueBigInt, bitWidth = 32) {
    const mask = (1n << BigInt(bitWidth)) - 1n;
    const signBitMask = 1n << BigInt(bitWidth - 1);
    const minSigned = -(1n << BigInt(bitWidth - 1));
    const maxSigned = (1n << BigInt(bitWidth - 1)) - 1n;
    const maxUnsigned = mask;

    const val = BigInt(valueBigInt);
    let unsignedVal = val & mask;
    let signedVal = unsignedVal >= signBitMask ? unsignedVal - (1n << BigInt(bitWidth)) : unsignedVal;

    let binStr = unsignedVal.toString(2).padStart(bitWidth, '0');
    let hexStr = unsignedVal.toString(16).toUpperCase().padStart(bitWidth / 4, '0');

    const byteCount = bitWidth / 8;
    const bytes = [];
    for (let i = 0; i < byteCount; i++) {
      const shift = BigInt((byteCount - 1 - i) * 8);
      const byteVal = Number((unsignedVal >> shift) & 0xFFn);
      bytes.push(byteVal.toString(16).toUpperCase().padStart(2, '0'));
    }

    return {
      bitWidth,
      binaryString: binStr,
      hexString: hexStr,
      unsignedValue: unsignedVal.toString(10),
      signedValue: signedVal.toString(10),
      bigEndian: bytes.join(' '),
      littleEndian: [...bytes].reverse().join(' '),
      isOverflow: val < minSigned || val > maxUnsigned
    };
  }

  // Gray Code: g = n ^ (n >> 1)
  function toGrayCode(valueBigInt, bitWidth = 32) {
    const mask = (1n << BigInt(bitWidth)) - 1n;
    const n = BigInt(valueBigInt) & mask;
    const gray = (n ^ (n >> 1n)) & mask;
    return gray.toString(2).padStart(bitWidth, '0');
  }

  // Binary-Coded Decimal (BCD - 8421): e.g. 255 -> 0010 0101 0101
  function toBCD(decStr) {
    const clean = String(decStr).replace(/[^\d]/g, '');
    if (!clean) return "0000";
    return clean.split('').map(d => parseInt(d, 10).toString(2).padStart(4, '0')).join(' ');
  }

  // IEEE-754 32-bit Single Precision Float Breakdown
  function analyzeIEEE754(floatVal) {
    const buffer = new ArrayBuffer(4);
    const f32 = new Float32Array(buffer);
    const u32 = new Uint32Array(buffer);

    f32[0] = floatVal;
    const intVal = u32[0];

    const binStr = intVal.toString(2).padStart(32, '0');
    const signBit = binStr[0];
    const exponentBits = binStr.slice(1, 9);
    const fractionBits = binStr.slice(9);

    const sign = signBit === '1' ? -1 : 1;
    const rawExponent = parseInt(exponentBits, 2);
    const unbiasedExponent = rawExponent === 0 ? -126 : rawExponent - 127;
    
    let mantissaDecimal = 0;
    for (let i = 0; i < 23; i++) {
      if (fractionBits[i] === '1') {
        mantissaDecimal += Math.pow(2, -(i + 1));
      }
    }

    let type = "Normal";
    let calculatedValue = 0;
    let formula = "";

    if (rawExponent === 255) {
      if (mantissaDecimal === 0) {
        type = sign === 1 ? "+Infinity" : "-Infinity";
        calculatedValue = sign === 1 ? Infinity : -Infinity;
        formula = type;
      } else {
        type = "NaN (Not a Number)";
        calculatedValue = NaN;
        formula = "NaN (Not a Number)";
      }
    } else if (rawExponent === 0) {
      if (mantissaDecimal === 0) {
        type = sign === 1 ? "+0.0" : "-0.0";
        calculatedValue = sign === 1 ? 0 : -0;
        formula = sign === 1 ? "+0.0 (Zero)" : "-0.0 (Negative Zero)";
      } else {
        type = "Subnormal (Denormalized)";
        calculatedValue = sign * mantissaDecimal * Math.pow(2, -126);
        formula = `(-1)^${signBit} × (0 + ${mantissaDecimal.toFixed(7)}) × 2^(-126)`;
      }
    } else {
      type = "Normal";
      calculatedValue = sign * (1 + mantissaDecimal) * Math.pow(2, unbiasedExponent);
      formula = `(-1)^${signBit} × (1 + ${mantissaDecimal.toFixed(7)}) × 2^(${rawExponent} - 127)`;
    }

    return {
      precision: "32-bit (Single)",
      floatValue: f32[0],
      hexString: '0x' + intVal.toString(16).toUpperCase().padStart(8, '0'),
      binary32: binStr,
      signBit,
      signMultiplier: sign,
      exponentBits,
      rawExponent,
      unbiasedExponent,
      bias: 127,
      fractionBits,
      mantissaDecimal,
      significantWithLeading: (rawExponent === 0 ? "0." : "1.") + fractionBits,
      type,
      formula
    };
  }

  // IEEE-754 64-bit Double Precision Float Breakdown
  function analyzeIEEE754Double(doubleVal) {
    const buffer = new ArrayBuffer(8);
    const f64 = new Float64Array(buffer);
    const u32 = new Uint32Array(buffer);

    f64[0] = doubleVal;
    const high = BigInt(u32[1]);
    const low = BigInt(u32[0]);
    const bits64 = (high << 32n) | low;
    const binStr = bits64.toString(2).padStart(64, '0');

    const signBit = binStr[0];
    const exponentBits = binStr.slice(1, 12);
    const fractionBits = binStr.slice(12);

    const sign = signBit === '1' ? -1 : 1;
    const rawExponent = parseInt(exponentBits, 2);
    const unbiasedExponent = rawExponent === 0 ? -1022 : rawExponent - 1023;

    let mantissaDecimal = 0;
    for (let i = 0; i < 52; i++) {
      if (fractionBits[i] === '1') {
        mantissaDecimal += Math.pow(2, -(i + 1));
      }
    }

    let type = "Normal";
    let formula = "";

    if (rawExponent === 2047) {
      if (mantissaDecimal === 0) {
        type = sign === 1 ? "+Infinity" : "-Infinity";
        formula = type;
      } else {
        type = "NaN (Not a Number)";
        formula = "NaN (Not a Number)";
      }
    } else if (rawExponent === 0) {
      if (mantissaDecimal === 0) {
        type = sign === 1 ? "+0.0" : "-0.0";
        formula = sign === 1 ? "+0.0 (Zero)" : "-0.0 (Negative Zero)";
      } else {
        type = "Subnormal (Denormalized)";
        formula = `(-1)^${signBit} × (0 + ${mantissaDecimal.toFixed(12)}) × 2^(-1022)`;
      }
    } else {
      type = "Normal";
      formula = `(-1)^${signBit} × (1 + ${mantissaDecimal.toFixed(12)}) × 2^(${rawExponent} - 1023)`;
    }

    return {
      precision: "64-bit (Double)",
      floatValue: f64[0],
      hexString: '0x' + bits64.toString(16).toUpperCase().padStart(16, '0'),
      binary64: binStr,
      signBit,
      signMultiplier: sign,
      exponentBits,
      rawExponent,
      unbiasedExponent,
      bias: 1023,
      fractionBits,
      mantissaDecimal,
      significantWithLeading: (rawExponent === 0 ? "0." : "1.") + fractionBits,
      type,
      formula
    };
  }

  function parseIEEE754FromHex(hexStr, isDouble = false) {
    const cleanHex = hexStr.trim().replace(/^0x/i, '').replace(/\s/g, '');
    if (!isDouble) {
      const intVal = parseInt(cleanHex, 16);
      if (isNaN(intVal)) throw new Error("Invalid 32-bit Hexadecimal");
      const buffer = new ArrayBuffer(4);
      const u32 = new Uint32Array(buffer);
      const f32 = new Float32Array(buffer);
      u32[0] = intVal;
      return analyzeIEEE754(f32[0]);
    } else {
      const bigVal = BigInt("0x" + cleanHex);
      const buffer = new ArrayBuffer(8);
      const u32 = new Uint32Array(buffer);
      const f64 = new Float64Array(buffer);
      u32[0] = Number(bigVal & 0xFFFFFFFFn);
      u32[1] = Number((bigVal >> 32n) & 0xFFFFFFFFn);
      return analyzeIEEE754Double(f64[0]);
    }
  }

  // Full 128 Standard ASCII Character Matrix Generator
  function getFullAsciiTable() {
    const controlNames = {
      0: "NUL (Null)", 1: "SOH (Start of Heading)", 2: "STX (Start of Text)", 3: "ETX (End of Text)",
      4: "EOT (End of Trans.)", 5: "ENQ (Enquiry)", 6: "ACK (Acknowledge)", 7: "BEL (Bell)",
      8: "BS (Backspace)", 9: "TAB (Horizontal Tab)", 10: "LF (Line Feed)", 11: "VT (Vertical Tab)",
      12: "FF (Form Feed)", 13: "CR (Carriage Return)", 14: "SO (Shift Out)", 15: "SI (Shift In)",
      16: "DLE (Data Link Esc)", 17: "DC1 (Device Ctrl 1)", 18: "DC2 (Device Ctrl 2)", 19: "DC3 (Device Ctrl 3)",
      20: "DC4 (Device Ctrl 4)", 21: "NAK (Negative Ack)", 22: "SYN (Synchronous Idle)", 23: "ETB (End Trans Block)",
      24: "CAN (Cancel)", 25: "EM (End of Medium)", 26: "SUB (Substitute)", 27: "ESC (Escape)",
      28: "FS (File Separator)", 29: "GS (Group Separator)", 30: "RS (Record Separator)", 31: "US (Unit Separator)",
      32: "SP (Space)", 127: "DEL (Delete)"
    };

    const table = [];
    for (let i = 0; i < 128; i++) {
      let charDisplay = String.fromCharCode(i);
      let desc = i < 32 || i === 127 ? controlNames[i] : `Printable character '${charDisplay}'`;
      if (i < 32 || i === 127) charDisplay = controlNames[i].split(' ')[0];

      table.push({
        dec: i,
        hex: '0x' + i.toString(16).toUpperCase().padStart(2, '0'),
        oct: '0o' + i.toString(8).padStart(3, '0'),
        bin: i.toString(2).padStart(8, '0'),
        char: charDisplay,
        desc
      });
    }
    return table;
  }

  // Roman Numerals
  const ROMAN_MAP = [
    { value: 1000, symbol: 'M' },
    { value: 900, symbol: 'CM' },
    { value: 500, symbol: 'D' },
    { value: 400, symbol: 'CD' },
    { value: 100, symbol: 'C' },
    { value: 90, symbol: 'XC' },
    { value: 50, symbol: 'L' },
    { value: 40, symbol: 'XL' },
    { value: 10, symbol: 'X' },
    { value: 9, symbol: 'IX' },
    { value: 5, symbol: 'V' },
    { value: 4, symbol: 'IV' },
    { value: 1, symbol: 'I' }
  ];

  function toRoman(num) {
    if (num <= 0 || num > 3999) return "N/A (Range 1-3999)";
    let n = num;
    let res = "";
    for (const { value, symbol } of ROMAN_MAP) {
      while (n >= value) {
        res += symbol;
        n -= value;
      }
    }
    return res;
  }

  function fromRoman(str) {
    const s = str.trim().toUpperCase();
    if (!s) return null;
    let res = 0;
    let i = 0;
    while (i < s.length) {
      let matched = false;
      for (const { value, symbol } of ROMAN_MAP) {
        if (s.startsWith(symbol, i)) {
          res += value;
          i += symbol.length;
          matched = true;
          break;
        }
      }
      if (!matched) return null;
    }
    return res;
  }

  // Text / ASCII / Unicode conversion
  function textToNumbers(text) {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(text);
    const hex = [];
    const bin = [];
    const dec = [];
    const oct = [];

    bytes.forEach(b => {
      hex.push(b.toString(16).toUpperCase().padStart(2, '0'));
      bin.push(b.toString(2).padStart(8, '0'));
      dec.push(b.toString(10));
      oct.push(b.toString(8).padStart(3, '0'));
    });

    return {
      text,
      byteCount: bytes.length,
      hex: hex.join(' '),
      bin: bin.join(' '),
      dec: dec.join(' '),
      oct: oct.join(' ')
    };
  }

  function bitwiseOperation(valA, valB, op, bitWidth = 32) {
    const mask = (1n << BigInt(bitWidth)) - 1n;
    const a = BigInt(valA) & mask;
    const b = BigInt(valB) & mask;
    let res = 0n;

    switch (op) {
      case 'AND': res = a & b; break;
      case 'OR': res = a | b; break;
      case 'XOR': res = a ^ b; break;
      case 'NOT': res = (~a) & mask; break;
      case 'NAND': res = (~(a & b)) & mask; break;
      case 'NOR': res = (~(a | b)) & mask; break;
      case 'XNOR': res = (~(a ^ b)) & mask; break;
      case 'SHL':
        const shiftL = Number(b % BigInt(bitWidth));
        res = (a << BigInt(shiftL)) & mask;
        break;
      case 'SHR':
        const shiftR = Number(b % BigInt(bitWidth));
        res = (a >> BigInt(shiftR)) & mask;
        break;
      default: throw new Error(`Unknown operator ${op}`);
    }

    const signBitMask = 1n << BigInt(bitWidth - 1);
    const signedVal = res >= signBitMask ? res - (1n << BigInt(bitWidth)) : res;

    return {
      op,
      bitWidth,
      resultUnsigned: res.toString(10),
      resultSigned: signedVal.toString(10),
      resultBin: res.toString(2).padStart(bitWidth, '0'),
      resultHex: res.toString(16).toUpperCase().padStart(bitWidth / 4, '0'),
      binA: a.toString(2).padStart(bitWidth, '0'),
      binB: b.toString(2).padStart(bitWidth, '0')
    };
  }

  return {
    BASE64_ALPHABET,
    FAMOUS_RADICES,
    getBaseFactorization,
    getDivisors,
    isValidForRadix,
    splitParts,
    parseBigInt,
    formatBigInt,
    getPositionalDecomposition,
    convertRadix,
    formatGrouped,
    getBitRepresentations,
    toGrayCode,
    toBCD,
    analyzeIEEE754,
    analyzeIEEE754Double,
    parseIEEE754FromHex,
    getFullAsciiTable,
    toRoman,
    fromRoman,
    textToNumbers,
    bitwiseOperation
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = Converter;
}

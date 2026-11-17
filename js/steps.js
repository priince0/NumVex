/**
 * NumVex - Step-by-Step Conversion Explainer Engine
 * Generates pedagogical mathematical breakdowns, tables, formula derivations,
 * and one-click LaTeX / Markdown export for all radices from Base 2 up to Base 9999.
 */

const StepsExplainer = (() => {
  const DIGITS_36 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const BASE64_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  const POWERS_OF_TWO = [4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096];

  function explainConversion(inputStr, srcRadix, tgtRadix) {
    srcRadix = parseInt(srcRadix, 10);
    tgtRadix = parseInt(tgtRadix, 10);

    if (!Converter.isValidForRadix(inputStr, srcRadix)) {
      return {
        error: `"${inputStr}" is not a valid Base ${srcRadix} number.`
      };
    }

    const { isNegative, intPart, fracPart } = Converter.splitParts(inputStr);
    const converted = Converter.convertRadix(inputStr, srcRadix, tgtRadix);

    if (srcRadix === tgtRadix) {
      return {
        type: 'identity',
        title: `Base ${srcRadix} to Base ${tgtRadix}`,
        summary: `The source base and target base are identical (${srcRadix}). No conversion needed.`,
        result: converted,
        steps: []
      };
    }

    // Direct Bit-Grouping for Powers of 2 (Base 2 <-> 8, 16, 64, 256, 1024, 4096)
    if (srcRadix === 2 && POWERS_OF_TWO.includes(tgtRadix)) {
      return explainBitGrouping(inputStr, srcRadix, tgtRadix, converted, isNegative, intPart, fracPart);
    }
    if (POWERS_OF_TWO.includes(srcRadix) && tgtRadix === 2) {
      return explainBitGrouping(inputStr, srcRadix, tgtRadix, converted, isNegative, intPart, fracPart);
    }

    // Direct Power of Two Bridge (e.g. Hex <-> Base64, Octal <-> Hex, Base64 <-> Base 1024)
    if (POWERS_OF_TWO.includes(srcRadix) && POWERS_OF_TWO.includes(tgtRadix)) {
      return explainPowerOfTwoBridge(inputStr, srcRadix, tgtRadix, converted, isNegative, intPart, fracPart);
    }

    // Conversion to Decimal (Radix -> Base 10): Positional Expansion
    if (tgtRadix === 10) {
      return explainToDecimal(inputStr, srcRadix, converted, isNegative, intPart, fracPart);
    }

    // Conversion from Decimal (Base 10 -> Radix): Repeated Division
    if (srcRadix === 10) {
      return explainFromDecimal(inputStr, tgtRadix, converted, isNegative, intPart, fracPart);
    }

    // General Radix A -> Radix B (via Base 10)
    return explainGeneralViaDecimal(inputStr, srcRadix, tgtRadix, converted, isNegative, intPart, fracPart);
  }

  // Base N -> Decimal (Polynomial Expansion)
  function explainToDecimal(inputStr, srcRadix, converted, isNegative, intPart, fracPart) {
    const intTerms = [];
    let intSum = 0n;

    const parsedVal = Converter.parseBigInt(intPart, srcRadix);
    const decomposition = Converter.getPositionalDecomposition(parsedVal, srcRadix);

    decomposition.forEach(col => {
      let char = col.symbol;
      if (srcRadix === 64) {
        char = `${BASE64_ALPHABET[col.digit]} (${col.digit})`;
      } else if (srcRadix > 36) {
        char = `[${col.digit}]`;
      } else if (col.digit >= 10) {
        char = `${DIGITS_36[col.digit]} (${col.digit})`;
      }

      intTerms.push({
        position: col.position,
        char,
        digitVal: col.digit.toString(),
        power: col.position.toString(),
        weight: col.powerWeight,
        termVal: col.contribution
      });
      intSum += BigInt(col.contribution);
    });

    const isBase64 = srcRadix === 64;
    return {
      type: 'to_decimal',
      title: isBase64 
        ? `Base64 (RFC 4648) to Decimal (Base 10) Expansion` 
        : `Base ${srcRadix} to Decimal (Base 10) Expansion`,
      summary: isBase64
        ? `Each Base64 character corresponds to a 6-bit numeric magnitude (0–63) multiplied by its positional weight (64^position).`
        : `Each positional digit $d_i$ in Base ${srcRadix} contributes $d_i \\times ${srcRadix}^i$ to the decimal total.`,
      source: inputStr,
      srcRadix,
      tgtRadix: 10,
      result: converted,
      intTerms,
      isNegative,
      isBase64
    };
  }

  // Base 10 -> Base N (Repeated Division)
  function explainFromDecimal(inputStr, tgtRadix, converted, isNegative, intPart, fracPart) {
    const divisionSteps = [];
    let current = Converter.parseBigInt(intPart, 10);
    const r = BigInt(tgtRadix);

    if (current === 0n) {
      divisionSteps.push({
        step: 1,
        value: '0',
        quotient: '0',
        remainder: 0,
        digit: tgtRadix === 64 ? 'A (Index 0)' : (tgtRadix > 36 ? '[0]' : '0')
      });
    } else {
      let stepNum = 1;
      while (current > 0n) {
        const quotient = current / r;
        const remainder = Number(current % r);
        let digit = remainder.toString();
        
        if (tgtRadix === 64) {
          digit = `${BASE64_ALPHABET[remainder]} (Index ${remainder})`;
        } else if (tgtRadix > 36) {
          digit = `[${remainder}]`;
        } else if (remainder >= 10) {
          digit = `${DIGITS_36[remainder]} (${remainder})`;
        }

        divisionSteps.push({
          step: stepNum++,
          value: current.toString(),
          quotient: quotient.toString(),
          remainder,
          digit
        });
        current = quotient;
      }
    }

    const isBase64 = tgtRadix === 64;
    return {
      type: 'from_decimal',
      title: isBase64 
        ? `Decimal (Base 10) to Base64 (RFC 4648) Conversion` 
        : `Decimal (Base 10) to Base ${tgtRadix} Conversion`,
      summary: isBase64
        ? `Repeatedly divide by 64. Record each remainder (0–63) and map it to its corresponding RFC 4648 character.`
        : `Successively divide by ${tgtRadix} and record remainders, reading bottom to top.`,
      source: inputStr,
      srcRadix: 10,
      tgtRadix,
      result: converted,
      divisionSteps,
      isNegative,
      isBase64
    };
  }

  // Direct Bit Grouping (Binary <-> Octal, Hex, Base 64, Base 256, Base 1024, Base 4096)
  function explainBitGrouping(inputStr, srcRadix, tgtRadix, converted, isNegative, intPart, fracPart) {
    const isBinaryToGroup = srcRadix === 2;
    const groupRadix = isBinaryToGroup ? tgtRadix : srcRadix;
    const groupSize = Math.round(Math.log2(groupRadix));
    let groupName = `Base ${groupRadix} (${groupSize} bits)`;

    if (groupRadix === 8) {
      groupName = "Octal (3 bits)";
    } else if (groupRadix === 16) {
      groupName = "Hexadecimal (4 bits)";
    } else if (groupRadix === 64) {
      groupName = "Base64 (6 bits / 2^6 = 64)";
    } else if (groupRadix === 256) {
      groupName = "Byte / Octet (8 bits / 2^8 = 256)";
    } else if (groupRadix === 1024) {
      groupName = "Binary Kibi / IEC (10 bits / 2^10 = 1024)";
    } else if (groupRadix === 4096) {
      groupName = "Page Radix (12 bits / 2^12 = 4096)";
    }

    const groups = [];

    if (isBinaryToGroup) {
      let paddedInt = intPart;
      const rem = paddedInt.length % groupSize;
      const leadingZeros = rem === 0 ? 0 : groupSize - rem;
      if (leadingZeros > 0) {
        paddedInt = "0".repeat(leadingZeros) + paddedInt;
      }

      for (let i = 0; i < paddedInt.length; i += groupSize) {
        const chunk = paddedInt.slice(i, i + groupSize);
        const decVal = parseInt(chunk, 2);
        let digit = decVal.toString();
        if (tgtRadix === 64) {
          digit = BASE64_ALPHABET[decVal];
        } else if (tgtRadix <= 36) {
          digit = DIGITS_36[decVal];
        } else {
          digit = `[${decVal}]`;
        }

        groups.push({
          chunk,
          decVal,
          digit,
          isPadding: i === 0 && leadingZeros > 0
        });
      }

      return {
        type: 'bit_grouping',
        title: tgtRadix === 64 
          ? `Binary to Base64 Direct 6-Bit Chunking (RFC 4648)` 
          : `Binary to Base ${tgtRadix} Direct ${groupSize}-Bit Grouping`,
        summary: tgtRadix === 64
          ? `Since 64 = 2^6, each Base64 character corresponds to exactly 6 binary bits. Split the binary sequence into 6-bit nibbles and map each directly via the RFC 4648 index table.`
          : `Since ${tgtRadix} = 2^${groupSize}, each digit directly maps to ${groupSize} binary bits without converting to decimal.`,
        groupSize,
        groupName,
        source: inputStr,
        srcRadix,
        tgtRadix,
        result: converted,
        groups,
        isNegative,
        isBase64: tgtRadix === 64
      };
    } else {
      let tokens = [];
      if (srcRadix === 64) {
        tokens = intPart.split('').map(c => ({ char: c, decVal: BASE64_ALPHABET.indexOf(c) }));
      } else if (srcRadix <= 36) {
        tokens = intPart.split('').map(c => ({ char: c, decVal: DIGITS_36.indexOf(c.toUpperCase()) }));
      } else {
        const rawTokens = Converter.getPositionalDecomposition(Converter.parseBigInt(intPart, srcRadix), srcRadix);
        tokens = rawTokens.map(col => ({ char: `[${col.digit}]`, decVal: col.digit }));
      }

      for (const tok of tokens) {
        const binChunk = tok.decVal.toString(2).padStart(groupSize, '0');
        groups.push({
          char: tok.char,
          decVal: tok.decVal,
          binChunk
        });
      }

      return {
        type: 'bit_expansion',
        title: srcRadix === 64
          ? `Base64 to Binary Direct 6-Bit Expansion (RFC 4648)`
          : `Base ${srcRadix} to Binary Direct ${groupSize}-Bit Expansion`,
        summary: srcRadix === 64
          ? `Each Base64 character expands into exactly 6 binary bits based on its RFC 4648 index (0–63).`
          : `Each digit expands directly into exactly ${groupSize} binary bits ($2^{${groupSize}} = ${srcRadix}$).`,
        groupSize,
        groupName,
        source: inputStr,
        srcRadix,
        tgtRadix,
        result: converted,
        groups,
        isNegative,
        isBase64: srcRadix === 64
      };
    }
  }

  // Power of Two Bridge
  function explainPowerOfTwoBridge(inputStr, srcRadix, tgtRadix, converted, isNegative, intPart, fracPart) {
    const intermediateBin = Converter.convertRadix(inputStr, srcRadix, 2);
    const step1 = explainBitGrouping(inputStr, srcRadix, 2, intermediateBin, isNegative, intPart, fracPart);
    const step2 = explainBitGrouping(intermediateBin, 2, tgtRadix, converted, isNegative, Converter.splitParts(intermediateBin).intPart, null);

    const srcName = srcRadix === 64 ? 'Base64' : (srcRadix === 16 ? 'Hexadecimal' : 'Octal');
    const tgtName = tgtRadix === 64 ? 'Base64' : (tgtRadix === 16 ? 'Hexadecimal' : 'Octal');

    return {
      type: 'bridge',
      title: `${srcName} to ${tgtName} via Binary Bridge (${step1.groupSize}b ↔ ${step2.groupSize}b)`,
      summary: `Because both bases are powers of 2 (2^${step1.groupSize} and 2^${step2.groupSize}), the fastest conversion translates ${srcName} into raw binary bits, then re-chunks into ${step2.groupSize}-bit ${tgtName} symbols.`,
      step1,
      step2,
      result: converted,
      intermediateBin
    };
  }

  // General Base A to Base B via Base 10
  function explainGeneralViaDecimal(inputStr, srcRadix, tgtRadix, converted, isNegative, intPart, fracPart) {
    const intermediateDec = Converter.convertRadix(inputStr, srcRadix, 10);
    const step1 = explainToDecimal(inputStr, srcRadix, intermediateDec, isNegative, intPart, fracPart);
    const step2 = explainFromDecimal(intermediateDec, tgtRadix, converted, isNegative, Converter.splitParts(intermediateDec).intPart, fracPart ? Converter.splitParts(intermediateDec).fracPart : null);

    return {
      type: 'two_step_decimal',
      title: `Base ${srcRadix} to Base ${tgtRadix} (via Decimal Bridge)`,
      summary: `Standard 2-Step Method: (1) Convert Base ${srcRadix} to Base 10 using positional polynomial expansion. (2) Convert Base 10 to Base ${tgtRadix} using successive division.`,
      step1,
      step2,
      result: converted,
      intermediateDec
    };
  }

  // LaTeX Exporter
  function generateLaTeX(exp) {
    let tex = `% NumVex Conversion Derivation\n`;
    tex += `% Generated automatically by NumVex Suite\n\n`;
    tex += `\\subsection*{${exp.title}}\n`;
    tex += `\\[ (${exp.source})_{${exp.srcRadix}} = (${exp.result})_{${exp.tgtRadix}} \\]\n\n`;

    if (exp.type === 'to_decimal') {
      tex += `\\textbf{Polynomial Expansion:}\n`;
      tex += `\\begin{align*}\n`;
      tex += `(${exp.source})_{${exp.srcRadix}} &= ` + exp.intTerms.map(t => `${t.digitVal} \\times ${exp.srcRadix}^{${t.position}}`).join(' + ') + ` \\\\\n`;
      tex += `&= ` + exp.intTerms.map(t => t.termVal).join(' + ') + ` \\\\\n`;
      tex += `&= ${exp.result}_{10}\n`;
      tex += `\\end{align*}\n`;
    } else if (exp.type === 'from_decimal') {
      tex += `\\textbf{Successive Division Algorithm by ${exp.tgtRadix}:}\n`;
      tex += `\\begin{center}\n\\begin{tabular}{|c|c|c|c|}\n\\hline\n`;
      tex += `Step & Division & Quotient & Remainder (Digit) \\\\\n\\hline\n`;
      exp.divisionSteps.forEach(s => {
        tex += `${s.step} & ${s.value} \\div ${exp.tgtRadix} & ${s.quotient} & ${s.remainder} \\implies \\text{${s.digit}} \\\\\n`;
      });
      tex += `\\hline\n\\end{tabular}\n\\end{center}\n\n`;
      tex += `Reading remainders from bottom to top gives $(${exp.result})_{${exp.tgtRadix}}$.\n`;
    } else if (exp.type === 'bit_grouping') {
      tex += `\\textbf{Direct Bit Grouping (${exp.groupSize} bits per digit):}\n`;
      tex += `\\begin{center}\n\\begin{tabular}{|c|c|c|}\n\\hline\n`;
      tex += `Chunk & Decimal Value & Symbol \\\\\n\\hline\n`;
      exp.groups.forEach(g => {
        tex += `${g.chunk} & ${g.decVal} & ${g.digit} \\\\\n`;
      });
      tex += `\\hline\n\\end{tabular}\n\\end{center}\n`;
    }
    return tex;
  }

  // Markdown Exporter
  function generateMarkdown(exp) {
    let md = `### ${exp.title}\n\n`;
    md += `**Result:** \`(${exp.source})_${exp.srcRadix} = (${exp.result})_${exp.tgtRadix}\`\n\n`;

    if (exp.type === 'to_decimal') {
      md += `| Digit | Positional Weight | Term Value |\n`;
      md += `| :---: | :---: | :---: |\n`;
      exp.intTerms.forEach(t => {
        md += `| **${t.char}** | ${exp.srcRadix}^${t.position} = ${t.weight} | +${t.termVal} |\n`;
      });
      md += `\n**Total Sum:** \`${exp.intTerms.map(t => t.termVal).join(' + ')} = ${exp.result}\`\n`;
    } else if (exp.type === 'from_decimal') {
      md += `| Step | Operation | Quotient | Remainder | Digit |\n`;
      md += `| :---: | :---: | :---: | :---: | :---: |\n`;
      exp.divisionSteps.forEach(s => {
        md += `| #${s.step} | ${s.value} ÷ ${exp.tgtRadix} | **${s.quotient}** | ${s.remainder} | **${s.digit}** |\n`;
      });
      md += `\n*Read remainders bottom-to-top:* **\`${exp.result}\`**\n`;
    } else if (exp.type === 'bit_grouping') {
      md += `| Binary Chunk | Decimal | Digit Symbol |\n`;
      md += `| :---: | :---: | :---: |\n`;
      exp.groups.forEach(g => {
        md += `| \`${g.chunk}\` | ${g.decVal} | **\`${g.digit}\`** |\n`;
      });
      md += `\n**Assembled Result:** \`${exp.result}\`\n`;
    }
    return md;
  }

  function subscript(n) {
    const subMap = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉' };
    return String(n).split('').map(c => subMap[c] || c).join('');
  }

  return {
    BASE64_ALPHABET,
    explainConversion,
    generateLaTeX,
    generateMarkdown,
    subscript
  };
})();

if (typeof module !== 'undefined' && module.exports) {
  module.exports = StepsExplainer;
}

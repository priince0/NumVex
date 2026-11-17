/**
 * NumVex - Application Controller & User Interface Logic
 * Expanded to 11/10:
 * - 32-bit Single & 64-bit Double Precision IEEE-754 Analyzer
 * - LaTeX, Markdown & PDF/Print Export for Step-by-Step Calculations
 * - Full 128 ASCII & Control Character Matrix Searchable Modal
 * - Web Audio API Mechanical Sound Synthesis Feedback
 * - Gray Code (Reflected Binary) & BCD (8421) Register Decoders
 * - Deep Radix Cosmos (Base 2 to 9999) & Interactive Positional Abacus
 */

document.addEventListener('DOMContentLoaded', () => {
  if (window.lucide && typeof lucide.createIcons === 'function') {
    lucide.createIcons();
  }

  // Security Sanitization Helper
  function escapeHTML(str) {
    if (typeof str !== 'string') return String(str ?? '');
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /* ==========================================================================
     Web Audio API Mechanical Sound Synthesizer
     ========================================================================== */
  const Sound = (() => {
    let audioCtx = null;
    let isMuted = localStorage.getItem('numvex-audio') === 'muted';

    function playClick(freq = null, duration = null, type = null) {
      if (isMuted) return;
      try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        let f = freq;
        let d = duration;
        let t = type;

        if (f === null || t === null) {
          if (currentSystem === 'cyberdeck') {
            f = f || 1200;
            d = d || 0.028;
            t = t || 'square';
          } else if (currentSystem === 'mainframe') {
            f = f || 190;
            d = d || 0.04;
            t = t || 'triangle';
          } else if (currentSystem === 'blueprint') {
            f = f || 880;
            d = d || 0.018;
            t = t || 'sawtooth';
          } else {
            f = f || 680;
            d = d || 0.022;
            t = t || 'sine';
          }
        }

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = t;
        osc.frequency.setValueAtTime(f, audioCtx.currentTime);
        gain.gain.setValueAtTime(t === 'square' ? 0.03 : 0.06, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + d);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + d);
      } catch(e) {}
    }

    function toggleMute() {
      isMuted = !isMuted;
      localStorage.setItem('numvex-audio', isMuted ? 'muted' : 'unmuted');
      return isMuted;
    }

    return { playClick, toggleMute, isMuted: () => isMuted };
  })();

  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundIcon = document.getElementById('soundIcon');

  function updateSoundIcon() {
    if (soundIcon) {
      soundIcon.setAttribute('data-lucide', Sound.isMuted() ? 'volume-x' : 'volume-2');
      if (window.lucide) lucide.createIcons();
    }
  }
  updateSoundIcon();

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      const muted = Sound.toggleMute();
      updateSoundIcon();
      showToast(muted ? 'Sound muted' : 'Sound effects enabled');
      if (!muted) Sound.playClick(800, 0.04);
    });
  }

  /* ==========================================================================
     Theme Management
     ========================================================================== */
  const themeToggleBtn = document.getElementById('themeToggleBtn');
  const themeIcon = document.getElementById('themeIcon');
  const htmlRoot = document.documentElement;

  function initTheme() {
    const savedTheme = localStorage.getItem('numvex-theme') || 
      (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    setTheme(savedTheme);
  }

  function setTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('numvex-theme', theme);
    if (themeIcon) {
      themeIcon.setAttribute('data-lucide', theme === 'dark' ? 'sun' : 'moon');
      if (window.lucide) lucide.createIcons();
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      Sound.playClick(500, 0.03);
      const current = htmlRoot.getAttribute('data-theme') || 'dark';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }
  initTheme();

  /* ==========================================================================
     Theme Cleanup & Default State
     ========================================================================== */
  try {
    localStorage.removeItem('numvex-system');
    htmlRoot.removeAttribute('data-system');
  } catch (e) {}

  /* ==========================================================================
     Toast Notifications
     ========================================================================== */
  const toastContainer = document.getElementById('toastContainer');
  function showToast(message) {
    if (!toastContainer) return;
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i data-lucide="check-circle" style="width: 16px; height: 16px; color: var(--accent-emerald);"></i> <span>${message}</span>`;
    toastContainer.appendChild(toast);
    if (window.lucide) lucide.createIcons();

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 2200);
  }

  /* ==========================================================================
     Tab Navigation
     ========================================================================== */
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  const presetsBar = document.getElementById('presetsBar');

  function switchTab(targetTab) {
    Sound.playClick(450, 0.02);
    tabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === targetTab);
    });

    tabContents.forEach(content => {
      content.classList.toggle('hidden', content.id !== `tab-${targetTab}`);
    });

    if (presetsBar) {
      presetsBar.style.display = targetTab === 'omnibase' ? 'flex' : 'none';
    }

    if (targetTab === 'cosmos') updateCosmosExplorer();
    if (targetTab === 'explainer') updateExplainer();
    if (targetTab === 'bitboard') renderBitBoard();
    if (targetTab === 'ieee754') updateIEEE754();
    if (targetTab === 'bitwise') updateBitwiseLab();
    if (targetTab === 'ascii') updateAsciiEncoder();

    if (window.lucide) lucide.createIcons();
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.getAttribute('data-tab')));
  });

  const btnJumpToCosmos = document.getElementById('btnJumpToCosmos');
  if (btnJumpToCosmos) {
    btnJumpToCosmos.addEventListener('click', () => switchTab('cosmos'));
  }

  /* ==========================================================================
     Tab 1: OmniBase Converter Logic (Expanded to Base 9999)
     ========================================================================== */
  const inputDec = document.getElementById('input-dec');
  const inputBin = document.getElementById('input-bin');
  const inputHex = document.getElementById('input-hex');
  const inputOct = document.getElementById('input-oct');
  const inputCustom = document.getElementById('input-custom');
  const inputRoman = document.getElementById('input-roman');

  const radixSlider = document.getElementById('radixSlider');
  const radixNumberInput = document.getElementById('radixNumberInput');
  const customBaseLabel = document.getElementById('customBaseLabel');
  const customAlphabetHint = document.getElementById('customAlphabetHint');

  const statDecDigits = document.getElementById('stat-dec-digits');
  const statBinBits = document.getElementById('stat-bin-bits');
  const statHexDigits = document.getElementById('stat-hex-digits');
  const statOctDigits = document.getElementById('stat-oct-digits');

  let currentRadix = 9999;
  let isUpdatingOmni = false;
  const groupingSettings = { 10: false, 2: false, 16: false, 8: false };

  function updateCustomRadix(newRadix) {
    currentRadix = Math.max(2, Math.min(9999, parseInt(newRadix, 10) || 9999));
    if (radixSlider) radixSlider.value = currentRadix;
    if (radixNumberInput) radixNumberInput.value = currentRadix;
    if (customBaseLabel) customBaseLabel.textContent = `Base ${currentRadix}`;
    if (inputCustom) inputCustom.setAttribute('data-radix', currentRadix);

    if (customAlphabetHint) {
      if (currentRadix <= 36) {
        const alpha = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ".slice(0, currentRadix);
        customAlphabetHint.textContent = `Valid chars: 0-${alpha[alpha.length - 1]} (${currentRadix} symbols)`;
      } else if (currentRadix === 64) {
        customAlphabetHint.textContent = `RFC 4648 Base64: A-Z, a-z, 0-9, +, / (64 symbols)`;
      } else {
        customAlphabetHint.textContent = `High Radix: bracketed [d_k]...[d_0] where digits are 0–${currentRadix - 1}`;
      }
    }

    document.querySelectorAll('.famous-radix-pill').forEach(pill => {
      pill.classList.toggle('active', parseInt(pill.getAttribute('data-radix'), 10) === currentRadix);
    });

    if (inputDec && inputDec.value.trim() && Converter.isValidForRadix(inputDec.value, 10)) {
      try {
        inputCustom.value = Converter.convertRadix(inputDec.value, 10, currentRadix);
        inputCustom.classList.remove('invalid');
      } catch (e) {
        inputCustom.value = '';
      }
    }
  }

  if (radixSlider) radixSlider.addEventListener('input', (e) => updateCustomRadix(e.target.value));
  if (radixNumberInput) radixNumberInput.addEventListener('change', (e) => updateCustomRadix(e.target.value));

  document.querySelectorAll('.famous-radix-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      Sound.playClick(600, 0.02);
      updateCustomRadix(parseInt(pill.getAttribute('data-radix'), 10));
    });
  });

  document.querySelectorAll('.btn-toggle-group').forEach(btn => {
    btn.addEventListener('click', () => {
      Sound.playClick(500, 0.02);
      const base = parseInt(btn.getAttribute('data-base'), 10);
      if (!base) return;
      groupingSettings[base] = !groupingSettings[base];
      btn.classList.toggle('active', groupingSettings[base]);
      refreshOmniDisplay();
    });
  });

  function updateAllFrom(sourceInput, srcRadix) {
    if (isUpdatingOmni) return;
    isUpdatingOmni = true;

    try {
      const rawVal = sourceInput.value.trim();

      if (!rawVal) {
        [inputDec, inputBin, inputHex, inputOct, inputCustom, inputRoman].forEach(inp => {
          if (inp) {
            inp.value = '';
            inp.classList.remove('invalid');
          }
        });
        updateStats();
        isUpdatingOmni = false;
        return;
      }

      if (!Converter.isValidForRadix(rawVal, srcRadix)) {
        sourceInput.classList.add('invalid');
        isUpdatingOmni = false;
        return;
      }
      sourceInput.classList.remove('invalid');

      const decValue = Converter.convertRadix(rawVal, srcRadix, 10);

      if (sourceInput !== inputDec) {
        inputDec.value = formatIfGrouped(decValue, 10);
        inputDec.classList.remove('invalid');
      }

      if (sourceInput !== inputBin) {
        inputBin.value = formatIfGrouped(Converter.convertRadix(decValue, 10, 2), 2);
        inputBin.classList.remove('invalid');
      }

      if (sourceInput !== inputHex) {
        inputHex.value = formatIfGrouped(Converter.convertRadix(decValue, 10, 16), 16);
        inputHex.classList.remove('invalid');
      }

      if (sourceInput !== inputOct) {
        inputOct.value = formatIfGrouped(Converter.convertRadix(decValue, 10, 8), 8);
        inputOct.classList.remove('invalid');
      }

      if (sourceInput !== inputCustom) {
        inputCustom.value = Converter.convertRadix(decValue, 10, currentRadix);
        inputCustom.classList.remove('invalid');
      }

      if (sourceInput !== inputRoman) {
        if (!decValue.includes('.')) {
          const intVal = parseInt(decValue, 10);
          if (!isNaN(intVal) && intVal > 0 && intVal <= 3999) {
            inputRoman.value = Converter.toRoman(intVal);
            inputRoman.classList.remove('invalid');
          } else {
            inputRoman.value = intVal <= 0 || intVal > 3999 ? 'N/A (Range 1-3999)' : '';
          }
        } else {
          inputRoman.value = 'N/A (Integers only)';
        }
      }

      updateStats();
      syncOtherTabsWithDec(decValue);

    } catch (err) {
      console.warn("Conversion error:", err);
    } finally {
      isUpdatingOmni = false;
    }
  }

  function formatIfGrouped(val, radix) {
    if (groupingSettings[radix]) {
      return Converter.formatGrouped(val, radix);
    }
    return val;
  }

  function refreshOmniDisplay() {
    if (!inputDec || !inputDec.value) return;
    const cleanDec = inputDec.value.trim().replace(/[\s_,]/g, '');
    if (Converter.isValidForRadix(cleanDec, 10)) {
      isUpdatingOmni = true;
      if (inputDec) inputDec.value = formatIfGrouped(cleanDec, 10);
      if (inputBin) inputBin.value = formatIfGrouped(Converter.convertRadix(cleanDec, 10, 2), 2);
      if (inputHex) inputHex.value = formatIfGrouped(Converter.convertRadix(cleanDec, 10, 16), 16);
      if (inputOct) inputOct.value = formatIfGrouped(Converter.convertRadix(cleanDec, 10, 8), 8);
      isUpdatingOmni = false;
    }
  }

  const SCALES = [
    { exp: 100n, name: 'Googol' },
    { exp: 33n, name: 'Decillion' },
    { exp: 30n, name: 'Nonillion' },
    { exp: 27n, name: 'Octillion' },
    { exp: 24n, name: 'Septillion' },
    { exp: 21n, name: 'Sextillion' },
    { exp: 18n, name: 'Quintillion' },
    { exp: 15n, name: 'Quadrillion' },
    { exp: 12n, name: 'Trillion' },
    { exp: 9n, name: 'Billion' },
    { exp: 6n, name: 'Million' },
    { exp: 3n, name: 'Thousand' }
  ];

  function getHumanScaleDescription(decStr) {
    const clean = decStr.replace(/[\s_,-]/g, '').split('.')[0];
    if (!clean || clean === '0') return '';
    try {
      const val = BigInt(clean);
      if (val < 1000n) return '';
      if (val === 18446744073709551615n) return 'UINT64 MAX';
      if (val === 4294967295n) return 'UINT32 MAX';
      if (val === 65535n) return 'UINT16 MAX';
      if (val === 255n) return 'UINT8 MAX';

      for (const s of SCALES) {
        const threshold = 10n ** s.exp;
        if (val >= threshold) {
          const quotient = Number(val * 100n / threshold) / 100;
          return `≈ ${quotient.toLocaleString()} ${s.name}`;
        }
      }
    } catch(e) {}
    return '';
  }

  function updateInputScrollIndicators(input) {
    if (!input) return;
    const wrapper = input.closest('.input-wrapper');
    if (!wrapper) return;

    const leftBtn = wrapper.querySelector('.btn-scroll-left');
    const rightBtn = wrapper.querySelector('.btn-scroll-right');
    const maxScroll = input.scrollWidth - input.clientWidth;

    if (maxScroll > 5) {
      if (leftBtn) leftBtn.classList.toggle('hidden', input.scrollLeft <= 5);
      if (rightBtn) rightBtn.classList.toggle('hidden', input.scrollLeft >= maxScroll - 5);
    } else {
      if (leftBtn) leftBtn.classList.add('hidden');
      if (rightBtn) rightBtn.classList.add('hidden');
    }
  }

  function updateAllScrollIndicators() {
    document.querySelectorAll('.base-input').forEach(input => {
      updateInputScrollIndicators(input);
    });
    if (typeof updateBinaryScrollerState === 'function') {
      updateBinaryScrollerState();
    }
  }

  function updateStats() {
    if (statDecDigits && inputDec) {
      const clean = inputDec.value.replace(/[\s_,-]/g, '');
      const len = clean.length;
      const scale = getHumanScaleDescription(clean);
      statDecDigits.innerHTML = `${len} digit${len === 1 ? '' : 's'}${scale ? ` <span class="stat-scale-pill">${scale}</span>` : ''}`;
    }
    if (statBinBits && inputBin) {
      const clean = inputBin.value.replace(/[\s_.-]/g, '');
      const len = clean.length;
      const bytes = Math.ceil(len / 8);
      statBinBits.textContent = `${len} bit${len === 1 ? '' : 's'}${len >= 8 ? ` (${bytes} byte${bytes === 1 ? '' : 's'})` : ''}`;
    }
    if (statHexDigits && inputHex) {
      const clean = inputHex.value.replace(/[\s_.-]/g, '');
      const len = clean.length;
      const bytes = Math.ceil(len / 2);
      statHexDigits.textContent = `${len} hex char${len === 1 ? '' : 's'}${len >= 2 ? ` (${bytes} byte${bytes === 1 ? '' : 's'})` : ''}`;
    }
    if (statOctDigits && inputOct) {
      const len = inputOct.value.replace(/[\s_.-]/g, '').length;
      statOctDigits.textContent = `${len} digit${len === 1 ? '' : 's'}`;
    }
    setTimeout(updateAllScrollIndicators, 0);
  }

  if (inputDec) inputDec.addEventListener('input', () => updateAllFrom(inputDec, 10));
  if (inputBin) inputBin.addEventListener('input', () => updateAllFrom(inputBin, 2));
  if (inputHex) inputHex.addEventListener('input', () => {
    let val = inputHex.value.trim();
    if (val.startsWith('0x') || val.startsWith('0X')) inputHex.value = val.slice(2);
    updateAllFrom(inputHex, 16);
  });
  if (inputOct) inputOct.addEventListener('input', () => updateAllFrom(inputOct, 8));
  if (inputCustom) inputCustom.addEventListener('input', () => updateAllFrom(inputCustom, currentRadix));

  if (inputRoman) {
    inputRoman.addEventListener('input', () => {
      if (isUpdatingOmni) return;
      const raw = inputRoman.value.trim().toUpperCase();
      if (!raw) {
        inputDec.value = '';
        updateAllFrom(inputDec, 10);
        return;
      }
      const decVal = Converter.fromRoman(raw);
      if (decVal !== null) {
        inputRoman.classList.remove('invalid');
        inputDec.value = decVal.toString();
        updateAllFrom(inputDec, 10);
      } else {
        inputRoman.classList.add('invalid');
      }
    });
  }

  document.querySelectorAll('.preset-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      Sound.playClick(720, 0.025);
      const val = chip.getAttribute('data-preset');
      if (inputDec) {
        inputDec.value = val;
        updateAllFrom(inputDec, 10);
        showToast(`Loaded preset ${val}`);
      }
    });
  });

  function showCopySuccess(btn, isPill = false, originalIcon = 'copy', originalLabel = '') {
    btn.classList.add('copied');
    if (isPill) {
      btn.innerHTML = `<i data-lucide="check" style="width: 14px; height: 14px; color: var(--accent-emerald);"></i> <span>Copied!</span>`;
    } else {
      btn.innerHTML = `<i data-lucide="check" style="width: 15px; height: 15px; color: var(--accent-emerald);"></i>`;
    }
    if (window.lucide) lucide.createIcons();

    setTimeout(() => {
      btn.classList.remove('copied');
      if (isPill) {
        btn.innerHTML = `<i data-lucide="${originalIcon}" style="width: 14px; height: 14px;"></i> <span>${originalLabel}</span>`;
      } else {
        btn.innerHTML = `<i data-lucide="${originalIcon}" style="width: 15px; height: 15px;"></i>`;
      }
      if (window.lucide) lucide.createIcons();
    }, 1600);
  }

  document.querySelectorAll('.btn-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      Sound.playClick(850, 0.02);
      const targetId = btn.getAttribute('data-target');
      const targetInput = document.getElementById(targetId);
      if (targetInput && targetInput.value) {
        const textToCopy = targetInput.value;
        navigator.clipboard.writeText(textToCopy).then(() => {
          showCopySuccess(btn, false, 'copy');
        }).catch(() => {
          showCopySuccess(btn, false, 'copy');
        });
      }
    });
  });

  /* ==========================================================================
     Interactive Binary Bit Scrubber Slider
     ========================================================================== */
  const binScroller = document.getElementById('binScroller');
  const binSliderPos = document.getElementById('binSliderPos');
  const btnScrubMSB = document.getElementById('btnScrubMSB');
  const btnScrubLSB = document.getElementById('btnScrubLSB');

  function updateBinaryScrollerState() {
    if (!inputBin || !binScroller) return;
    const maxScroll = Math.max(0, inputBin.scrollWidth - inputBin.clientWidth);
    binScroller.max = maxScroll > 0 ? maxScroll : 100;
    binScroller.disabled = maxScroll === 0;

    const rawBits = inputBin.value.replace(/[\s_.-]/g, '');
    const bitCount = rawBits.length;

    if (maxScroll === 0) {
      binScroller.value = 0;
      if (binSliderPos) {
        binSliderPos.textContent = bitCount > 0 
          ? `All ${bitCount} bits visible (MSB ◄──► LSB)` 
          : `◄ MSB · Slide Bits · LSB ►`;
      }
    } else {
      binScroller.value = inputBin.scrollLeft;
      const pct = Math.round((inputBin.scrollLeft / maxScroll) * 100);
      if (binSliderPos) {
        binSliderPos.textContent = `${pct}% panned (${bitCount} bits total)`;
      }
    }
  }

  if (binScroller && inputBin) {
    binScroller.addEventListener('input', (e) => {
      const maxScroll = Math.max(0, inputBin.scrollWidth - inputBin.clientWidth);
      if (maxScroll > 0) {
        inputBin.scrollLeft = parseInt(e.target.value, 10);
        const pct = Math.round((inputBin.scrollLeft / maxScroll) * 100);
        const bitCount = inputBin.value.replace(/[\s_.-]/g, '').length;
        if (binSliderPos) {
          binSliderPos.textContent = `${pct}% panned (${bitCount} bits total)`;
        }
      }
    });

    inputBin.addEventListener('scroll', () => {
      const maxScroll = Math.max(0, inputBin.scrollWidth - inputBin.clientWidth);
      if (maxScroll > 0) {
        binScroller.value = inputBin.scrollLeft;
        const pct = Math.round((inputBin.scrollLeft / maxScroll) * 100);
        const bitCount = inputBin.value.replace(/[\s_.-]/g, '').length;
        if (binSliderPos) {
          binSliderPos.textContent = `${pct}% panned (${bitCount} bits total)`;
        }
      }
    });

    if (btnScrubMSB) {
      btnScrubMSB.addEventListener('click', () => {
        Sound.playClick(600, 0.02);
        inputBin.scrollLeft = 0;
        binScroller.value = 0;
        updateBinaryScrollerState();
      });
    }

    if (btnScrubLSB) {
      btnScrubLSB.addEventListener('click', () => {
        Sound.playClick(800, 0.02);
        const maxScroll = Math.max(0, inputBin.scrollWidth - inputBin.clientWidth);
        inputBin.scrollLeft = maxScroll;
        binScroller.value = maxScroll;
        updateBinaryScrollerState();
      });
    }
  }

  document.querySelectorAll('.btn-clear').forEach(btn => {
    btn.addEventListener('click', () => {
      Sound.playClick(350, 0.03);
      const targetId = btn.getAttribute('data-target');
      const targetInput = document.getElementById(targetId);
      if (targetInput) {
        targetInput.value = '';
        updateAllFrom(targetInput, parseInt(targetInput.getAttribute('data-radix') || 10, 10));
      }
    });
  });

  // Quick Sign Toggle (±)
  document.querySelectorAll('.btn-sign').forEach(btn => {
    btn.addEventListener('click', () => {
      Sound.playClick(620, 0.02);
      const targetId = btn.getAttribute('data-target');
      const targetInput = document.getElementById(targetId);
      if (targetInput && targetInput.value) {
        let val = targetInput.value.trim();
        if (val.startsWith('-')) {
          val = val.slice(1);
        } else if (val !== '0' && val !== '[0]') {
          val = '-' + val;
        }
        targetInput.value = val;
        const radix = parseInt(targetInput.getAttribute('data-radix') || 10, 10);
        updateAllFrom(targetInput, radix);
      }
    });
  });

  // Jump to Start (◄) & End (►) Arrow Buttons on all inputs
  document.querySelectorAll('.btn-scroll-arrow').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      Sound.playClick(600, 0.02);
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (input) {
        if (btn.classList.contains('btn-scroll-left')) {
          input.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          input.scrollTo({ left: input.scrollWidth, behavior: 'smooth' });
        }
        setTimeout(() => updateInputScrollIndicators(input), 200);
      }
    });
  });

  // Universal Mouse-Wheel Horizontal Scroll & Keyboard Shortcuts on all Base Inputs
  document.querySelectorAll('.base-input').forEach(input => {
    // Scroll horizontally when mouse wheel spins
    input.addEventListener('wheel', (e) => {
      if (input.scrollWidth > input.clientWidth) {
        e.preventDefault();
        const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
        input.scrollLeft += delta * 0.9;
        updateInputScrollIndicators(input);
        if (input.id === 'input-bin' && typeof updateBinaryScrollerState === 'function') {
          updateBinaryScrollerState();
        }
      }
    }, { passive: false });

    // Update arrows on native scroll
    input.addEventListener('scroll', () => {
      updateInputScrollIndicators(input);
      if (input.id === 'input-bin' && typeof updateBinaryScrollerState === 'function') {
        updateBinaryScrollerState();
      }
    });

    // Double-click to select all
    input.addEventListener('dblclick', () => {
      input.select();
    });

    // Escape key to clear focused input
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        input.value = '';
        const radix = parseInt(input.getAttribute('data-radix') || 10, 10);
        updateAllFrom(input, radix);
      }
    });
  });

  function syncOtherTabsWithDec(decValue) {
    const clean = decValue.replace(/[\s_]/g, '');
    const explainInput = document.getElementById('explainInput');
    if (explainInput && document.activeElement !== explainInput) {
      explainInput.value = clean;
    }
    const cosmosDecInput = document.getElementById('cosmosDecInput');
    if (cosmosDecInput && document.activeElement !== cosmosDecInput) {
      cosmosDecInput.value = clean;
    }
  }

  /* ==========================================================================
     Tab 2: 🪐 RADIX COSMOS (DEEP HIGH-RADIX EXPLORER 2 - 9999)
     ========================================================================== */
  let cosmosActiveRadix = 9999;
  let cosmosActiveBigInt = 1000000n;

  const cosmosBaseNumber = document.getElementById('cosmosBaseNumber');
  const cosmosBaseCategory = document.getElementById('cosmosBaseCategory');
  const cosmosBaseInput = document.getElementById('cosmosBaseInput');
  const cosmosSlider = document.getElementById('cosmosSlider');
  const cosmosHistoricalNote = document.getElementById('cosmosHistoricalNote');
  const cosmosDecInput = document.getElementById('cosmosDecInput');
  const cosmosEncodedOut = document.getElementById('cosmosEncodedOut');
  const abacusColumnsRow = document.getElementById('abacusColumnsRow');
  const famousGrid = document.getElementById('famousGrid');

  const metricFactorization = document.getElementById('metricFactorization');
  const metricInfoDensity = document.getElementById('metricInfoDensity');
  const metricSpatialCompression = document.getElementById('metricSpatialCompression');
  const metricTerminatingFractions = document.getElementById('metricTerminatingFractions');

  function initFamousRadicesGrid() {
    if (!famousGrid) return;
    famousGrid.innerHTML = '';
    const popularBases = [2, 12, 16, 60, 64, 256, 1000, 1024, 3600, 4096, 9999];

    popularBases.forEach(b => {
      const meta = Converter.FAMOUS_RADICES[b] || { name: `Base ${b}`, category: 'Radix', note: '' };
      const card = document.createElement('div');
      card.className = `famous-card ${b === cosmosActiveRadix ? 'active' : ''}`;
      card.setAttribute('data-radix', b);

      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span class="famous-base-tag">Base ${b}</span>
          <span style="font-size: 0.68rem; color: var(--text-muted); text-transform: uppercase;">${meta.category}</span>
        </div>
        <div class="famous-title">${meta.name}</div>
        <div class="famous-desc">${meta.note.slice(0, 75)}...</div>
      `;

      card.addEventListener('click', () => {
        Sound.playClick(650, 0.02);
        setCosmosRadix(b);
      });

      famousGrid.appendChild(card);
    });
  }
  initFamousRadicesGrid();

  function setCosmosRadix(newRadix) {
    cosmosActiveRadix = Math.max(2, Math.min(9999, parseInt(newRadix, 10) || 9999));
    if (cosmosSlider) cosmosSlider.value = cosmosActiveRadix;
    if (cosmosBaseInput) cosmosBaseInput.value = cosmosActiveRadix;

    document.querySelectorAll('.famous-card').forEach(card => {
      const b = parseInt(card.getAttribute('data-radix'), 10);
      card.classList.toggle('active', b === cosmosActiveRadix);
    });

    updateCosmosExplorer();
  }

  if (cosmosSlider) cosmosSlider.addEventListener('input', (e) => setCosmosRadix(e.target.value));
  if (cosmosBaseInput) cosmosBaseInput.addEventListener('change', (e) => setCosmosRadix(e.target.value));

  if (cosmosDecInput) {
    cosmosDecInput.addEventListener('input', () => {
      const raw = cosmosDecInput.value.trim().replace(/[\s_,]/g, '');
      if (raw && Converter.isValidForRadix(raw, 10)) {
        try {
          cosmosActiveBigInt = Converter.parseBigInt(raw, 10);
          updateCosmosExplorer(false);
          if (inputDec && document.activeElement === cosmosDecInput) {
            inputDec.value = raw;
            updateAllFrom(inputDec, 10);
          }
        } catch (e) {}
      }
    });
  }

  function updateCosmosExplorer(syncInput = true) {
    if (cosmosBaseNumber) cosmosBaseNumber.textContent = `Base ${cosmosActiveRadix}`;

    const meta = Converter.FAMOUS_RADICES[cosmosActiveRadix] || {
      name: `Base ${cosmosActiveRadix}`,
      category: cosmosActiveRadix > 100 ? "High Radix Realm" : "Custom Positional",
      note: `In Base ${cosmosActiveRadix}, each positional column has a weight of ${cosmosActiveRadix}^pos and holds magnitudes from 0 to ${cosmosActiveRadix - 1}.`
    };

    if (cosmosBaseCategory) cosmosBaseCategory.textContent = meta.category;
    if (cosmosHistoricalNote) {
      cosmosHistoricalNote.innerHTML = `<strong>${meta.name}:</strong> ${meta.note}`;
    }

    if (syncInput && cosmosDecInput) {
      cosmosDecInput.value = cosmosActiveBigInt.toString(10);
    }

    const encoded = Converter.formatBigInt(cosmosActiveBigInt, cosmosActiveRadix);
    if (cosmosEncodedOut) cosmosEncodedOut.value = encoded;

    renderAbacusColumns();
    renderCosmosMetrics();
  }

  function renderAbacusColumns() {
    if (!abacusColumnsRow) return;
    abacusColumnsRow.innerHTML = '';

    const columns = Converter.getPositionalDecomposition(cosmosActiveBigInt, cosmosActiveRadix);

    columns.forEach(col => {
      const colEl = document.createElement('div');
      colEl.className = 'abacus-column';
      const pct = Math.round(col.fractionOfBase * 100);

      colEl.innerHTML = `
        <div class="col-power-label">${cosmosActiveRadix}<sup>${col.position}</sup></div>
        <div class="col-weight-sub">Weight: ${col.powerWeight}</div>

        <div class="col-digit-stepper">
          <button class="btn-col-step btn-step-down" data-pos="${col.position}">-</button>
          <input type="number" min="0" max="${cosmosActiveRadix - 1}" class="col-digit-input" value="${col.digit}" data-pos="${col.position}">
          <button class="btn-col-step btn-step-up" data-pos="${col.position}">+</button>
        </div>

        <div class="col-gauge-track" title="${pct}% of base capacity">
          <div class="col-gauge-fill" style="width: ${pct}%;"></div>
        </div>

        <div class="col-contribution-label">+ ${col.contribution}</div>
      `;

      const stepDownBtn = colEl.querySelector('.btn-step-down');
      const stepUpBtn = colEl.querySelector('.btn-step-up');
      const digitInput = colEl.querySelector('.col-digit-input');

      stepDownBtn.addEventListener('click', () => {
        Sound.playClick(400, 0.02);
        modifyColumnDigit(col.position, -1);
      });

      stepUpBtn.addEventListener('click', () => {
        Sound.playClick(750, 0.02);
        modifyColumnDigit(col.position, 1);
      });

      digitInput.addEventListener('change', (e) => {
        let val = parseInt(e.target.value, 10);
        if (isNaN(val)) val = 0;
        val = Math.max(0, Math.min(cosmosActiveRadix - 1, val));
        setColumnDigit(col.position, val);
      });

      abacusColumnsRow.appendChild(colEl);
    });
  }

  function modifyColumnDigit(position, delta) {
    const power = BigInt(cosmosActiveRadix) ** BigInt(position);
    const newBigInt = cosmosActiveBigInt + (BigInt(delta) * power);
    if (newBigInt >= 0n) {
      cosmosActiveBigInt = newBigInt;
      updateCosmosExplorer(true);
      if (inputDec) {
        inputDec.value = cosmosActiveBigInt.toString(10);
        updateAllFrom(inputDec, 10);
      }
    }
  }

  function setColumnDigit(position, newDigit) {
    const columns = Converter.getPositionalDecomposition(cosmosActiveBigInt, cosmosActiveRadix);
    const existing = columns.find(c => c.position === position);
    const oldDigit = existing ? existing.digit : 0;
    const diff = BigInt(newDigit - oldDigit);
    const power = BigInt(cosmosActiveRadix) ** BigInt(position);
    cosmosActiveBigInt = cosmosActiveBigInt + (diff * power);
    updateCosmosExplorer(true);
    if (inputDec) {
      inputDec.value = cosmosActiveBigInt.toString(10);
      updateAllFrom(inputDec, 10);
    }
  }

  function renderCosmosMetrics() {
    const factors = Converter.getBaseFactorization(cosmosActiveRadix);
    if (metricFactorization) {
      if (factors.length === 1 && factors[0].power === 1) {
        metricFactorization.textContent = `${cosmosActiveRadix} (Prime Number!)`;
      } else {
        const factorStr = factors.map(f => f.power > 1 ? `${f.prime}<sup>${f.power}</sup>` : `${f.prime}`).join(' × ');
        metricFactorization.innerHTML = factorStr;
      }
    }

    const bitsPerDigit = Math.log2(cosmosActiveRadix).toFixed(2);
    if (metricInfoDensity) {
      metricInfoDensity.textContent = `${bitsPerDigit} bits / digit`;
    }

    const decLen = cosmosActiveBigInt.toString(10).length;
    const columns = Converter.getPositionalDecomposition(cosmosActiveBigInt, cosmosActiveRadix);
    const radixLen = columns.length;
    if (metricSpatialCompression) {
      if (radixLen < decLen) {
        const pctSaved = Math.round((1 - (radixLen / decLen)) * 100);
        metricSpatialCompression.textContent = `${pctSaved}% shorter (${radixLen} vs ${decLen} digits)`;
      } else if (radixLen === decLen) {
        metricSpatialCompression.textContent = `Equal length (${radixLen} digits)`;
      } else {
        metricSpatialCompression.textContent = `${radixLen} digits (longer than dec ${decLen})`;
      }
    }

    if (metricTerminatingFractions) {
      const termFractions = [];
      const testDenoms = [2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 16, 20, 25, 27, 37, 60];
      for (const d of testDenoms) {
        const dFactors = Converter.getBaseFactorization(d);
        const canTerminate = dFactors.every(df => factors.some(rf => rf.prime === df.prime));
        if (canTerminate) termFractions.push(`1/${d}`);
        if (termFractions.length >= 6) break;
      }
      metricTerminatingFractions.textContent = termFractions.join(', ') || 'Only 1/1';
    }
  }

  /* ==========================================================================
     Tab 3: Step-by-Step Explainer Logic (With LaTeX & Markdown Export)
     ========================================================================== */
  const explainSrcBase = document.getElementById('explainSrcBase');
  const explainTgtBase = document.getElementById('explainTgtBase');
  const explainCustomSrc = document.getElementById('explainCustomSrc');
  const explainCustomTgt = document.getElementById('explainCustomTgt');
  const explainInput = document.getElementById('explainInput');
  const btnSwapExplainBases = document.getElementById('btnSwapExplainBases');
  const explainContent = document.getElementById('explainContent');

  const btnExportLaTeX = document.getElementById('btnExportLaTeX');
  const btnExportMarkdown = document.getElementById('btnExportMarkdown');
  const btnPrintExplainer = document.getElementById('btnPrintExplainer');

  let currentExplainerResult = null;

  function getActiveExplainBases() {
    let src = explainSrcBase.value === 'custom' 
      ? Math.max(2, Math.min(9999, parseInt(explainCustomSrc.value, 10) || 12))
      : parseInt(explainSrcBase.value, 10);

    let tgt = explainTgtBase.value === 'custom'
      ? Math.max(2, Math.min(9999, parseInt(explainCustomTgt.value, 10) || 64))
      : parseInt(explainTgtBase.value, 10);

    return { src, tgt };
  }

  function handleCustomBaseVisibility() {
    if (explainCustomSrc) {
      explainCustomSrc.classList.toggle('hidden', explainSrcBase.value !== 'custom');
    }
    if (explainCustomTgt) {
      explainCustomTgt.classList.toggle('hidden', explainTgtBase.value !== 'custom');
    }
  }

  function updateExplainer() {
    handleCustomBaseVisibility();
    if (!explainContent || !explainInput) return;

    const val = explainInput.value.trim();
    const { src, tgt } = getActiveExplainBases();

    if (!val) {
      explainContent.innerHTML = `<div style="text-align: center; color: var(--text-muted); padding: 2rem;">Please enter a number to see step-by-step conversion steps.</div>`;
      currentExplainerResult = null;
      return;
    }

    const explanation = StepsExplainer.explainConversion(val, src, tgt);
    currentExplainerResult = explanation;

    if (explanation.error) {
      explainContent.innerHTML = `
        <div style="background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3); color: #f87171; padding: 1rem; border-radius: var(--radius-md);">
          <strong>Invalid Input:</strong> ${escapeHTML(explanation.error)}
        </div>
      `;
      return;
    }

    const hasBase64 = src === 64 || tgt === 64;

    let html = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
        <div>
          <h2 style="font-size: 1.35rem; font-weight: 700; color: var(--text-primary); display: flex; align-items: center; gap: 0.5rem;">
            ${escapeHTML(explanation.title)}
            ${hasBase64 ? '<span style="font-size: 0.72rem; background: rgba(59, 130, 246, 0.15); color: #60a5fa; padding: 0.2rem 0.5rem; border-radius: 12px; font-weight: 600;">RFC 4648 6-Bit Encoding</span>' : ''}
          </h2>
          <p style="color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.25rem;">${escapeHTML(explanation.summary)}</p>
        </div>
        <div style="background: var(--bg-input); padding: 0.5rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle); font-family: var(--font-mono); font-size: 1.15rem;">
          <span style="color: var(--accent-cyan); font-weight: 700;">(${escapeHTML(val)})${StepsExplainer.subscript(src)}</span>
          <span style="color: var(--text-muted); margin: 0 0.4rem;">=</span>
          <span style="color: var(--accent-emerald); font-weight: 700;">(${escapeHTML(explanation.result)})${StepsExplainer.subscript(tgt)}</span>
        </div>
      </div>
    `;

    if (hasBase64) {
      html += `
        <div style="background: rgba(59, 130, 246, 0.08); border: 1px solid rgba(59, 130, 246, 0.25); border-radius: var(--radius-md); padding: 0.85rem 1rem; margin-bottom: 1rem; font-size: 0.85rem;">
          <div style="font-weight: 700; color: #60a5fa; margin-bottom: 0.25rem; display: flex; align-items: center; gap: 0.4rem;">
            <i data-lucide="info" style="width: 15px; height: 15px;"></i> Base64 RFC 4648 6-Bit Index Mapping Reference
          </div>
          <div style="color: var(--text-secondary); line-height: 1.45;">
            Because <strong>64 = 2⁶</strong>, each Base64 symbol encodes exactly <strong>6 bits</strong> (0–63):
            <span style="font-family: var(--font-mono); color: var(--accent-purple);">A–Z (0–25)</span>, 
            <span style="font-family: var(--font-mono); color: var(--accent-cyan);">a–z (26–51)</span>, 
            <span style="font-family: var(--font-mono); color: var(--accent-amber);">0–9 (52–61)</span>, 
            <span style="font-family: var(--font-mono); color: var(--accent-rose);">+ (62)</span>, and 
            <span style="font-family: var(--font-mono); color: var(--accent-emerald);">/ (63)</span>.
            In stream encoding, 3 bytes (24 bits) map to 4 Base64 characters (4 × 6 = 24 bits).
          </div>
        </div>
      `;
    }

    if (explanation.type === 'to_decimal') {
      html += renderToDecimalSteps(explanation);
    } else if (explanation.type === 'from_decimal') {
      html += renderFromDecimalSteps(explanation);
    } else if (explanation.type === 'bit_grouping' || explanation.type === 'bit_expansion') {
      html += renderBitGroupingSteps(explanation);
    } else if (explanation.type === 'two_step_decimal') {
      html += `
        <div class="step-card">
          <span class="step-badge">Stage 1: Base ${src} to Decimal (Base 10)</span>
          ${renderToDecimalSteps(explanation.step1)}
        </div>
        <div class="step-card" style="margin-top: 1.5rem;">
          <span class="step-badge">Stage 2: Decimal (Base 10) to Base ${tgt}</span>
          ${renderFromDecimalSteps(explanation.step2)}
        </div>
      `;
    } else if (explanation.type === 'bridge') {
      html += `
        <div class="step-card">
          <span class="step-badge">Phase 1: Base ${src} to Binary (Base 2) [${explanation.step1.groupSize} bits each]</span>
          ${renderBitGroupingSteps(explanation.step1)}
        </div>
        <div class="step-card" style="margin-top: 1.5rem;">
          <span class="step-badge">Phase 2: Re-chunking Binary into Base ${tgt} [${explanation.step2.groupSize} bits each]</span>
          ${renderBitGroupingSteps(explanation.step2)}
        </div>
      `;
    } else if (explanation.type === 'identity') {
      html += `<div style="padding: 1.5rem; text-align: center; color: var(--accent-emerald);">Source and target bases are the same! Result: ${explanation.result}</div>`;
    }

    explainContent.innerHTML = html;
    if (window.lucide) lucide.createIcons();
  }

  function renderToDecimalSteps(exp) {
    let out = `
      <h3 style="font-size: 1.05rem; margin-bottom: 0.75rem; color: #60a5fa;">Polynomial Expansion Formula:</h3>
      <div class="math-table-wrapper">
        <table class="math-table">
          <thead>
            <tr>
              <th>Digit Magnitude</th>
              <th>Positional Weight</th>
              <th>Calculation (Digit × Base^Pos)</th>
              <th>Term Value</th>
            </tr>
          </thead>
          <tbody>
    `;

    exp.intTerms.forEach(t => {
      out += `
        <tr>
          <td><strong style="color: var(--accent-purple); font-size: 1.1rem;">${t.char}</strong></td>
          <td>${exp.srcRadix}<sup>${t.position}</sup> = ${t.weight}</td>
          <td>${t.digitVal} × ${t.weight}</td>
          <td style="color: var(--accent-emerald); font-weight: 700;">+ ${t.termVal}</td>
        </tr>
      `;
    });

    out += `
          </tbody>
        </table>
      </div>
      <div style="background: var(--bg-input); padding: 0.85rem 1rem; border-radius: var(--radius-md); font-family: var(--font-mono); font-size: 1rem; border: 1px solid var(--border-subtle);">
        <strong>Total Sum:</strong> ${exp.intTerms.map(t => t.termVal).join(' + ')} = <strong style="color: var(--accent-emerald);">${exp.result}</strong>
      </div>
    `;

    return out;
  }

  function renderFromDecimalSteps(exp) {
    let out = `
      <h3 style="font-size: 1.05rem; margin-bottom: 0.5rem; color: #34d399;">Successive Division Algorithm:</h3>
      <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.75rem;">Divide the value by target base (${exp.tgtRadix}) repeatedly until quotient becomes 0.</p>
      <div class="math-table-wrapper">
        <table class="math-table">
          <thead>
            <tr>
              <th>Step</th>
              <th>Value</th>
              <th>Division</th>
              <th>Quotient</th>
              <th>Remainder</th>
              <th>Target Base Digit</th>
            </tr>
          </thead>
          <tbody>
    `;

    exp.divisionSteps.forEach(s => {
      out += `
        <tr>
          <td>#${s.step}</td>
          <td>${s.value}</td>
          <td>${s.value} ÷ ${exp.tgtRadix}</td>
          <td><strong>${s.quotient}</strong></td>
          <td class="highlight-remainder">${s.remainder}</td>
          <td><span style="background: var(--hex-bg); color: var(--accent-purple); padding: 0.2rem 0.5rem; border-radius: 4px; font-weight: 700;">${s.digit}</span></td>
        </tr>
      `;
    });

    out += `
          </tbody>
        </table>
      </div>
      <div class="read-direction-banner">
        <i data-lucide="arrow-up" style="width: 18px; height: 18px;"></i>
        <span>Read remainders from bottom to top: <strong style="font-family: var(--font-mono); font-size: 1.1rem; color: white;">${exp.result}</strong></span>
      </div>
    `;

    return out;
  }

  function renderBitGroupingSteps(exp) {
    let out = `
      <div style="margin: 1rem 0;">
        <h4 style="font-size: 0.95rem; color: var(--accent-cyan); margin-bottom: 0.5rem;">Bit Grouping Chart (${exp.groupName}):</h4>
        <div class="bit-groups-diagram">
    `;

    exp.groups.forEach(g => {
      out += `
        <div class="bit-group-box">
          <div class="bit-group-chunk">${g.chunk || g.binChunk}</div>
          <div class="bit-group-arrow">↓</div>
          <div class="bit-group-digit">${g.digit || g.char}</div>
        </div>
      `;
    });

    out += `
        </div>
      </div>
      <div style="background: var(--bg-input); padding: 0.85rem 1rem; border-radius: var(--radius-md); font-family: var(--font-mono); border: 1px solid var(--border-subtle);">
        Assembled result: <strong style="color: var(--accent-emerald); font-size: 1.15rem;">${exp.result}</strong>
      </div>
    `;
    return out;
  }

  if (explainSrcBase) explainSrcBase.addEventListener('change', updateExplainer);
  if (explainTgtBase) explainTgtBase.addEventListener('change', updateExplainer);
  if (explainCustomSrc) explainCustomSrc.addEventListener('input', updateExplainer);
  if (explainCustomTgt) explainCustomTgt.addEventListener('input', updateExplainer);
  if (explainInput) explainInput.addEventListener('input', updateExplainer);

  if (btnSwapExplainBases) {
    btnSwapExplainBases.addEventListener('click', () => {
      Sound.playClick(600, 0.02);
      const temp = explainSrcBase.value;
      explainSrcBase.value = explainTgtBase.value;
      explainTgtBase.value = temp;
      updateExplainer();
    });
  }

  // Export LaTeX, Markdown & PDF
  if (btnExportLaTeX) {
    btnExportLaTeX.addEventListener('click', () => {
      Sound.playClick(750, 0.02);
      if (currentExplainerResult && !currentExplainerResult.error) {
        const tex = StepsExplainer.generateLaTeX(currentExplainerResult);
        navigator.clipboard.writeText(tex).then(() => {
          showCopySuccess(btnExportLaTeX, true, 'code-2', 'Copy LaTeX');
        });
      } else {
        showToast('Please enter a valid conversion first');
      }
    });
  }

  if (btnExportMarkdown) {
    btnExportMarkdown.addEventListener('click', () => {
      Sound.playClick(750, 0.02);
      if (currentExplainerResult && !currentExplainerResult.error) {
        const md = StepsExplainer.generateMarkdown(currentExplainerResult);
        navigator.clipboard.writeText(md).then(() => {
          showCopySuccess(btnExportMarkdown, true, 'file-text', 'Copy Markdown');
        });
      } else {
        showToast('Please enter a valid conversion first');
      }
    });
  }

  if (btnPrintExplainer) {
    btnPrintExplainer.addEventListener('click', () => {
      window.print();
    });
  }

  /* ==========================================================================
     Tab 4: Interactive Bit Board & Register (With Gray Code & BCD)
     ========================================================================== */
  let currentBitWidth = 32;
  let registerBigInt = 0n;

  const bitGridRow = document.getElementById('bitGridRow');
  const regUnsignedVal = document.getElementById('regUnsignedVal');
  const regSignedVal = document.getElementById('regSignedVal');
  const regHexVal = document.getElementById('regHexVal');
  const regOctVal = document.getElementById('regOctVal');
  const regGrayVal = document.getElementById('regGrayVal');
  const regBcdVal = document.getElementById('regBcdVal');
  const regBigEndianVal = document.getElementById('regBigEndianVal');
  const regLittleEndianVal = document.getElementById('regLittleEndianVal');

  document.querySelectorAll('.width-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      Sound.playClick(550, 0.02);
      document.querySelectorAll('.width-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentBitWidth = parseInt(btn.getAttribute('data-width'), 10);
      const mask = (1n << BigInt(currentBitWidth)) - 1n;
      registerBigInt = registerBigInt & mask;
      renderBitBoard();
    });
  });

  function renderBitBoard() {
    if (!bitGridRow) return;
    bitGridRow.innerHTML = '';

    const binStr = registerBigInt.toString(2).padStart(currentBitWidth, '0');
    const nibbleCount = currentBitWidth / 4;

    for (let nibbleIdx = 0; nibbleIdx < nibbleCount; nibbleIdx++) {
      const block = document.createElement('div');
      block.className = 'nibble-block';

      const startBitPos = currentBitWidth - 1 - (nibbleIdx * 4);
      const nibbleBits = binStr.slice(nibbleIdx * 4, (nibbleIdx + 1) * 4);
      const nibbleHex = parseInt(nibbleBits, 2).toString(16).toUpperCase();

      block.innerHTML = `<div class="nibble-hex-label">0x${nibbleHex}</div>`;

      const bitsRow = document.createElement('div');
      bitsRow.className = 'bits-row';

      for (let b = 0; b < 4; b++) {
        const bitIndex = startBitPos - b;
        const bitVal = binStr[nibbleIdx * 4 + b];

        const cell = document.createElement('div');
        cell.className = 'bit-cell';

        const indexLabel = document.createElement('div');
        indexLabel.className = 'bit-index';
        indexLabel.textContent = bitIndex;

        const switchBtn = document.createElement('div');
        switchBtn.className = `bit-switch ${bitVal === '1' ? 'on' : ''}`;
        switchBtn.textContent = bitVal;
        switchBtn.setAttribute('data-bit', bitIndex);

        switchBtn.addEventListener('click', () => {
          Sound.playClick(bitVal === '1' ? 420 : 780, 0.02);
          toggleBit(bitIndex);
        });

        cell.appendChild(indexLabel);
        cell.appendChild(switchBtn);
        bitsRow.appendChild(cell);
      }

      block.appendChild(bitsRow);
      bitGridRow.appendChild(block);
    }

    updateRegisterDecodedDisplays();
  }

  function toggleBit(bitIndex) {
    const bitMask = 1n << BigInt(bitIndex);
    registerBigInt = registerBigInt ^ bitMask;
    renderBitBoard();
  }

  function updateRegisterDecodedDisplays() {
    const reps = Converter.getBitRepresentations(registerBigInt, currentBitWidth);
    if (regUnsignedVal) regUnsignedVal.textContent = reps.unsignedValue;
    if (regSignedVal) regSignedVal.textContent = reps.signedValue;
    if (regHexVal) regHexVal.textContent = '0x' + reps.hexString;
    if (regOctVal) regOctVal.textContent = '0o' + BigInt(reps.unsignedValue).toString(8);

    // Gray Code
    if (regGrayVal) {
      const gray = Converter.toGrayCode(registerBigInt, currentBitWidth);
      regGrayVal.textContent = gray.match(/.{4}/g).join(' ');
    }

    // BCD (Binary Coded Decimal 8421)
    if (regBcdVal) {
      regBcdVal.textContent = Converter.toBCD(reps.unsignedValue);
    }

    if (regBigEndianVal) regBigEndianVal.textContent = reps.bigEndian;
    if (regLittleEndianVal) regLittleEndianVal.textContent = reps.littleEndian;
  }

  const btnInvertBits = document.getElementById('btnInvertBits');
  const btnShiftLeftBits = document.getElementById('btnShiftLeftBits');
  const btnShiftRightBits = document.getElementById('btnShiftRightBits');
  const btnClearAllBits = document.getElementById('btnClearAllBits');
  const btnSetAllBits = document.getElementById('btnSetAllBits');

  if (btnInvertBits) {
    btnInvertBits.addEventListener('click', () => {
      Sound.playClick(650, 0.03);
      const mask = (1n << BigInt(currentBitWidth)) - 1n;
      registerBigInt = (~registerBigInt) & mask;
      renderBitBoard();
      showToast('Inverted all bits');
    });
  }

  if (btnShiftLeftBits) {
    btnShiftLeftBits.addEventListener('click', () => {
      Sound.playClick(700, 0.02);
      const mask = (1n << BigInt(currentBitWidth)) - 1n;
      registerBigInt = (registerBigInt << 1n) & mask;
      renderBitBoard();
    });
  }

  if (btnShiftRightBits) {
    btnShiftRightBits.addEventListener('click', () => {
      Sound.playClick(500, 0.02);
      registerBigInt = registerBigInt >> 1n;
      renderBitBoard();
    });
  }

  if (btnClearAllBits) {
    btnClearAllBits.addEventListener('click', () => {
      Sound.playClick(320, 0.03);
      registerBigInt = 0n;
      renderBitBoard();
      showToast('Cleared register to 0');
    });
  }

  if (btnSetAllBits) {
    btnSetAllBits.addEventListener('click', () => {
      Sound.playClick(820, 0.03);
      registerBigInt = (1n << BigInt(currentBitWidth)) - 1n;
      renderBitBoard();
      showToast('Set all bits to 1');
    });
  }

  /* ==========================================================================
     Tab 5: IEEE-754 32-bit & 64-bit Floating Point Analyzer Logic
     ========================================================================== */
  let ieeePrecision = 32; // 32 or 64
  let isUpdatingIEEE = false;

  const ieeeDecInput = document.getElementById('ieeeDecInput');
  const ieeeHexInput = document.getElementById('ieeeHexInput');
  const ieeeHexInputLabel = document.getElementById('ieeeHexInputLabel');
  const ieeeSignBit = document.getElementById('ieeeSignBit');
  const ieeeExpBits = document.getElementById('ieeeExpBits');
  const ieeeExpLabel = document.getElementById('ieeeExpLabel');
  const ieeeMantBits = document.getElementById('ieeeMantBits');
  const ieeeMantLabel = document.getElementById('ieeeMantLabel');
  const ieeeBreakdownCard = document.getElementById('ieeeBreakdownCard');

  // Precision Switcher (32 vs 64)
  document.querySelectorAll('.precision-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      Sound.playClick(600, 0.02);
      document.querySelectorAll('.precision-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      ieeePrecision = parseInt(btn.getAttribute('data-precision'), 10);

      if (ieeeHexInputLabel) {
        ieeeHexInputLabel.textContent = `Hexadecimal Representation (${ieeePrecision}-bit):`;
      }
      if (ieeeExpLabel) {
        ieeeExpLabel.textContent = ieeePrecision === 32 
          ? 'BIASED EXPONENT (8b / Bias 127)' 
          : 'BIASED EXPONENT (11b / Bias 1023)';
      }
      if (ieeeMantLabel) {
        ieeeMantLabel.textContent = ieeePrecision === 32 
          ? 'MANTISSA / FRACTION (23b)' 
          : 'MANTISSA / FRACTION (52b)';
      }

      updateIEEE754FromFloat();
    });
  });

  function updateIEEE754() {
    updateIEEE754FromFloat();
  }

  function updateIEEE754FromFloat() {
    if (isUpdatingIEEE || !ieeeDecInput) return;
    isUpdatingIEEE = true;
    try {
      const floatVal = parseFloat(ieeeDecInput.value);
      if (isNaN(floatVal)) return;

      const analysis = ieeePrecision === 32 
        ? Converter.analyzeIEEE754(floatVal) 
        : Converter.analyzeIEEE754Double(floatVal);

      if (ieeeHexInput) ieeeHexInput.value = analysis.hexString;
      renderIEEE754Analysis(analysis);
    } catch (e) {
      console.error(e);
    } finally {
      isUpdatingIEEE = false;
    }
  }

  function updateIEEE754FromHex() {
    if (isUpdatingIEEE || !ieeeHexInput) return;
    isUpdatingIEEE = true;
    try {
      const analysis = Converter.parseIEEE754FromHex(ieeeHexInput.value, ieeePrecision === 64);
      if (ieeeDecInput) ieeeDecInput.value = analysis.floatValue.toString();
      renderIEEE754Analysis(analysis);
    } catch (e) {
      console.error(e);
    } finally {
      isUpdatingIEEE = false;
    }
  }

  function renderIEEE754Analysis(a) {
    if (ieeeSignBit) ieeeSignBit.textContent = a.signBit;
    if (ieeeExpBits) ieeeExpBits.textContent = a.exponentBits;
    if (ieeeMantBits) ieeeMantBits.textContent = a.fractionBits;

    if (ieeeBreakdownCard) {
      ieeeBreakdownCard.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1rem;">
          <div>
            <span style="color: var(--text-muted); font-size: 0.78rem;">Hardware Precision:</span>
            <div style="font-size: 1.1rem; font-weight: 700; color: var(--accent-cyan);">${a.precision}</div>
          </div>
          <div>
            <span style="color: var(--text-muted); font-size: 0.78rem;">Encoding Type:</span>
            <div style="font-size: 1.1rem; font-weight: 700; color: var(--accent-emerald);">${a.type}</div>
          </div>
          <div>
            <span style="color: var(--text-muted); font-size: 0.78rem;">Sign Bit (MSB):</span>
            <div style="font-size: 1.1rem; font-weight: 700; color: #f87171;">${a.signBit} (${a.signBit === '1' ? 'Negative (-)' : 'Positive (+)'})</div>
          </div>
          <div>
            <span style="color: var(--text-muted); font-size: 0.78rem;">Biased Exponent:</span>
            <div style="font-size: 1.1rem; font-weight: 700; color: #60a5fa;">${a.rawExponent} (2^(${a.rawExponent} - ${a.bias}) = 2^${a.unbiasedExponent})</div>
          </div>
          <div>
            <span style="color: var(--text-muted); font-size: 0.78rem;">Normalized Significand:</span>
            <div style="font-size: 1.1rem; font-weight: 700; color: #34d399;">${(1 + a.mantissaDecimal).toFixed(ieeePrecision === 32 ? 7 : 12)}</div>
          </div>
        </div>

        <div style="background: var(--bg-input); padding: 0.85rem 1rem; border-radius: var(--radius-md); border: 1px solid var(--border-subtle);">
          <div style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.25rem;">Evaluation Formula:</div>
          <div style="font-size: 1.1rem; font-weight: 700; color: var(--accent-cyan);">${a.formula}</div>
          <div style="margin-top: 0.4rem; font-size: 0.85rem; color: var(--text-secondary);">
            = ${a.signMultiplier} × ${(1 + a.mantissaDecimal).toFixed(ieeePrecision === 32 ? 7 : 12)} × 2^${a.unbiasedExponent} = <strong>${a.floatValue}</strong>
          </div>
        </div>
      `;
    }
  }

  if (ieeeDecInput) ieeeDecInput.addEventListener('input', updateIEEE754FromFloat);
  if (ieeeHexInput) ieeeHexInput.addEventListener('input', updateIEEE754FromHex);

  /* ==========================================================================
     Tab 6: Bitwise Operations Lab Logic
     ========================================================================== */
  const bitwiseInputA = document.getElementById('bitwiseInputA');
  const bitwiseInputB = document.getElementById('bitwiseInputB');
  const bitwiseVisBlock = document.getElementById('bitwiseVisBlock');
  let currentBitwiseOp = 'AND';

  document.querySelectorAll('.op-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      Sound.playClick(620, 0.02);
      document.querySelectorAll('.op-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentBitwiseOp = btn.getAttribute('data-op');
      updateBitwiseLab();
    });
  });

  function parseOperand(str) {
    str = str.trim();
    if (str.startsWith('0x') || str.startsWith('0X')) {
      return Converter.parseBigInt(str.slice(2), 16);
    }
    if (str.startsWith('0b') || str.startsWith('0B')) {
      return Converter.parseBigInt(str.slice(2), 2);
    }
    return Converter.parseBigInt(str, 10);
  }

  function updateBitwiseLab() {
    if (!bitwiseVisBlock || !bitwiseInputA) return;

    try {
      const valA = parseOperand(bitwiseInputA.value || '0');
      const valB = parseOperand(bitwiseInputB.value || '0');

      const res = Converter.bitwiseOperation(valA, valB, currentBitwiseOp, 16);

      let opSymbol = '&';
      if (currentBitwiseOp === 'OR') opSymbol = '|';
      if (currentBitwiseOp === 'XOR') opSymbol = '^';
      if (currentBitwiseOp === 'NOT') opSymbol = '~';
      if (currentBitwiseOp === 'NAND') opSymbol = 'NAND';
      if (currentBitwiseOp === 'NOR') opSymbol = 'NOR';
      if (currentBitwiseOp === 'XNOR') opSymbol = 'XNOR';
      if (currentBitwiseOp === 'SHL') opSymbol = '<<';
      if (currentBitwiseOp === 'SHR') opSymbol = '>>>';

      bitwiseVisBlock.innerHTML = `
        <div class="bitwise-row">
          <div class="bitwise-row-label">Operand A:</div>
          <div class="bitwise-row-bits text-blue">${res.binA.match(/.{4}/g).join(' ')}</div>
          <div style="color: var(--text-muted); font-size: 0.85rem;">(${valA.toString(10)}) [0x${(valA & 0xFFFFn).toString(16).toUpperCase()}]</div>
        </div>

        ${currentBitwiseOp !== 'NOT' ? `
          <div class="bitwise-row">
            <div class="bitwise-row-label">${opSymbol} Oper B:</div>
            <div class="bitwise-row-bits text-amber">${res.binB.match(/.{4}/g).join(' ')}</div>
            <div style="color: var(--text-muted); font-size: 0.85rem;">(${valB.toString(10)}) [0x${(valB & 0xFFFFn).toString(16).toUpperCase()}]</div>
          </div>
        ` : ''}

        <div class="bitwise-divider"></div>

        <div class="bitwise-row">
          <div class="bitwise-row-label" style="color: var(--accent-emerald);">Result:</div>
          <div class="bitwise-row-bits text-emerald">${res.resultBin.match(/.{4}/g).join(' ')}</div>
          <div style="color: var(--accent-emerald); font-size: 0.88rem; font-weight: 700;">
            = ${res.resultUnsigned} (Signed: ${res.resultSigned}) [0x${res.resultHex}]
          </div>
        </div>
      `;
    } catch (e) {
      bitwiseVisBlock.innerHTML = `<div style="color: #f87171;">Invalid operand syntax: ${escapeHTML(e.message)}</div>`;
    }
  }

  if (bitwiseInputA) bitwiseInputA.addEventListener('input', updateBitwiseLab);
  if (bitwiseInputB) bitwiseInputB.addEventListener('input', updateBitwiseLab);

  /* ==========================================================================
     Tab 7: Text & ASCII / UTF-8 Encoder + 128 ASCII Matrix Modal
     ========================================================================== */
  const asciiTextInput = document.getElementById('asciiTextInput');
  const asciiHexOut = document.getElementById('asciiHexOut');
  const asciiBinOut = document.getElementById('asciiBinOut');
  const asciiDecOut = document.getElementById('asciiDecOut');
  const asciiByteLength = document.getElementById('asciiByteLength');

  const btnOpenAsciiModal = document.getElementById('btnOpenAsciiModal');
  const btnCloseAsciiModal = document.getElementById('btnCloseAsciiModal');
  const asciiModal = document.getElementById('asciiModal');
  const asciiModalSearch = document.getElementById('asciiModalSearch');
  const asciiMatrixTbody = document.getElementById('asciiMatrixTbody');

  function updateAsciiEncoder() {
    if (!asciiTextInput) return;
    const text = asciiTextInput.value;
    const res = Converter.textToNumbers(text);

    if (asciiHexOut) asciiHexOut.textContent = res.hex || '(empty)';
    if (asciiBinOut) asciiBinOut.textContent = res.bin || '(empty)';
    if (asciiDecOut) asciiDecOut.textContent = res.dec || '(empty)';
    if (asciiByteLength) asciiByteLength.textContent = `${res.byteCount} byte${res.byteCount === 1 ? '' : 's'} (${res.byteCount * 8} bits)`;
  }

  if (asciiTextInput) asciiTextInput.addEventListener('input', updateAsciiEncoder);

  // Full ASCII Table Modal
  const fullAsciiData = Converter.getFullAsciiTable();

  function renderAsciiModalTable(filter = '') {
    if (!asciiMatrixTbody) return;
    asciiMatrixTbody.innerHTML = '';
    const query = filter.trim().toLowerCase();

    const filtered = fullAsciiData.filter(row => {
      if (!query) return true;
      return row.dec.toString().includes(query) ||
             row.hex.toLowerCase().includes(query) ||
             row.char.toLowerCase().includes(query) ||
             row.desc.toLowerCase().includes(query) ||
             row.bin.includes(query);
    });

    filtered.forEach(r => {
      const tr = document.createElement('tr');
      tr.style.cursor = 'pointer';
      tr.innerHTML = `
        <td style="color: var(--accent-blue); font-weight: 700;">${r.dec}</td>
        <td style="color: var(--accent-purple); font-weight: 700;">${r.hex}</td>
        <td>${r.oct}</td>
        <td style="color: var(--accent-emerald); font-size: 0.8rem;">${r.bin}</td>
        <td><strong style="font-size: 1.1rem; color: var(--accent-rose);">${r.char}</strong></td>
        <td style="color: var(--text-secondary); font-size: 0.82rem;">${r.desc}</td>
      `;
      tr.addEventListener('click', () => {
        Sound.playClick(750, 0.02);
        if (asciiTextInput) {
          asciiTextInput.value += String.fromCharCode(r.dec);
          updateAsciiEncoder();
          showToast(`Inserted character '${r.char}' (0x${r.hex.slice(2)})`);
        }
      });
      asciiMatrixTbody.appendChild(tr);
    });
  }

  if (btnOpenAsciiModal) {
    btnOpenAsciiModal.addEventListener('click', () => {
      Sound.playClick(600, 0.02);
      renderAsciiModalTable();
      if (asciiModal) asciiModal.classList.remove('hidden');
    });
  }

  if (btnCloseAsciiModal) {
    btnCloseAsciiModal.addEventListener('click', () => {
      if (asciiModal) asciiModal.classList.add('hidden');
    });
  }

  if (asciiModalSearch) {
    asciiModalSearch.addEventListener('input', (e) => {
      renderAsciiModalTable(e.target.value);
    });
  }

  if (asciiModal) {
    asciiModal.addEventListener('click', (e) => {
      if (e.target === asciiModal) {
        asciiModal.classList.add('hidden');
      }
    });
  }

  /* ==========================================================================
     Global Keyboard Shortcuts
     ========================================================================== */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (asciiModal && !asciiModal.classList.contains('hidden')) {
        asciiModal.classList.add('hidden');
        return;
      }
      if (document.activeElement && document.activeElement.tagName === 'INPUT') {
        document.activeElement.value = '';
        document.activeElement.dispatchEvent(new Event('input'));
      }
    }
  });

  // Initial Boot
  if (inputDec) {
    inputDec.value = '1000';
    updateAllFrom(inputDec, 10);
  }
  updateCustomRadix(9999);
  updateCosmosExplorer(true);
  updateExplainer();
  renderBitBoard();
  updateIEEE754();
  updateBitwiseLab();
  updateAsciiEncoder();
});

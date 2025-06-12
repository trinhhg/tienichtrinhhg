document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded');

  const translations = {
    vn: {
      appTitle: 'Tiện Ích Của Trịnh Hg',
      contactText1: '- Nếu có ý tưởng mới hãy liên hệ facebook trao đổi với mình nhé: ',
      contactText2: '- Đọc truyện trên Truyện HD để ủng hộ mình nhé: ',
      settingsTab: 'Settings',
      replaceTab: 'Replace',
      splitTab: 'Chia Chương',
      settingsTitle: 'Cài đặt tìm kiếm và thay thế',
      modeLabel: 'Chọn chế độ:',
      default: 'Mặc định',
      addMode: 'Thêm chế độ mới',
      copyMode: 'Sao Chép Chế Độ',
      matchCaseOn: 'Match Case: Bật',
      matchCaseOff: 'Match Case: Tắt',
      findPlaceholder: 'Tìm ví dụ dấu phẩy',
      replacePlaceholder: 'Thay thế ví dụ dấu chấm phẩy',
      removeButton: 'Xóa',
      addPair: 'Thêm',
      saveSettings: 'Lưu cài đặt',
      replaceTitle: 'Thay thế Dấu câu',
      inputText: 'Dán văn bản của bạn vào đây...',
      replaceButton: 'Thay thế',
      outputText: 'Kết quả sẽ xuất hiện ở đây...',
      copyButton: 'Sao chép',
      splitTitle: 'Chia Chương',
      splitInputText: 'Dán văn bản của bạn vào đây...',
      splitButton: 'Chia Chương',
      output1Text: 'Kết quả chương 1 sẽ xuất hiện ở đây...',
      output2Text: 'Kết quả chương 2 sẽ xuất hiện ở đây...',
      output3Text: 'Kết quả chương 3 sẽ xuất hiện ở đây...',
      output4Text: 'Kết quả chương 4 sẽ xuất hiện ở đây...',
      noPairsToSave: 'Không có cặp nào để lưu!',
      settingsSaved: 'Đã lưu cài đặt cho chế độ "{mode}"!',
      newModePrompt: 'Nhập tên chế độ mới:',
      invalidModeName: 'Tên chế độ không hợp lệ hoặc đã tồn tại!',
      modeCreated: 'Đã tạo chế độ "{mode}"!',
      switchedMode: 'Đã chuyển sang chế độ "{mode}"',
      noTextToReplace: 'Không có văn bản để thay thế!',
      noPairsConfigured: 'Không có cặp tìm-thay thế nào được cấu hình!',
      textReplaced: 'Đã thay thế văn bản thành công!',
      textCopied: 'Đã sao chép văn bản vào clipboard!',
      failedToCopy: 'Không thể sao chép văn bản!',
      noTextToCopy: 'Không có văn bản để sao chép!',
      modeDeleted: 'Đã xóa chế độ "{mode}"!',
      renamePrompt: 'Nhập tên mới cho chế độ:',
      renameSuccess: 'Đã đổi tên chế độ thành "{mode}"!',
      renameError: 'Lỗi khi đổi tên chế độ!',
      noTextToSplit: 'Không có văn bản để chia!',
      splitSuccess: 'Đã chia chương thành công!',
      exportSettings: 'Xuất Cài Đặt',
      importSettings: 'Nhập Cài Đặt',
      settingsExported: 'Đã xuất cài đặt thành công!',
      settingsImported: 'Đã nhập cài đặt thành công!',
      importError: 'Lỗi khi nhập cài đặt!'
    }
  };

  let currentLang = 'vn';
  let matchCaseEnabled = false;
  let currentMode = 'default';
  let currentSplitMode = 2';
  const LOCAL_STORAGE_KEY = 'local_settings';

  function escapeHtml(str) {
    try {
      if (typeof str !== 'string') return '';
      const htmlEntities = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '\'' // Sửa lỗi: sử dụng ký tự nháy đơn thoát
      };
      return str.replace(/[&<>"']/g, match => htmlEntities[match] || '');
    } catch (error) {
      console.error('Lỗi trong escapeHtml:', error);
      return str || '';
    }
  }

  function updateLanguage(lang) {
    if (!translations[lang]) {
      console.error(`Ngôn ngữ ${lang} không được hỗ trợ`);
      return;
    }
    currentLang = lang;
    const elements = document.documentElement.lang = lang;

    const elements = {
      appTitle: document.getElementById('app-title'),
      contactText1: document.getElementById('contact-text1'),
      contactText2: document.getElementById('contact-text2'),
      settingsTab: document.getElementById('settings-tab'),
      replaceTab: document.getElementById('replace-tab'),
      splitTab: document.getElementById('split-tab'),
      settingsTitle: document.getElementById('settings-title'),
      modeLabel: document.getElementById('mode-label'),
      addMode: document.getElementById('add-mode'),
      copyMode: document.getElementById('copy-mode'),
      matchCase: document.getElementById('match-case'),
      findPlaceholder: document.getElementById('find-placeholder'),
      replacePlaceholder: document.getElementById('replace-placeholder'),
      removeButton: document.getElementById('remove-button'),
      addPair: document.getElementById('add-pair'),
      saveSettings: document.getElementById('save-settings'),
      replaceTitle: document.getElementById('replace-title'),
      inputText: document.getElementById('input-text'),
      replaceButton: document.getElementById('replace-button'),
      outputText: document.getElementById('output-text'),
      copyButton: document.getElementById('copy-button'),
      splitTitle: document.getElementById('split-title'),
      splitInputText: document.getElementById('split-input-text'),
      splitButton: document.getElementById('split-button'),
      output1Text: document.getElementById('output1-text'),
      output2Text: document.getElementById('output2-text'),
      output3Text: document.getElementById('output3-text'),
      output4Text: document.getElementById('output4-text'),
      copyButton1: document.getElementById('copy-button1'),
      copyButton2: document.getElementById('copy-button2'),
      copyButton3: document.getElementById('copy-button3'),
      copyButton4: document.getElementById('copy-button4'),
      exportSettings: document.getElementById('export-settings'),
      importSettings: document.getElementById('import-settings')
    });

    try {
      if (elements.appTitle) elements.appTitle.textContent = translations[lang].appTitle;
      if (elements.contactTextArea1) {
        const textArea1 = elements.contactTextArea1.childNodes;
        const textNode = Array.from().find(node => node.nodeType === Node.Text_NODE);
        if (textNode) {
          textNode.textContent = translations[lang].contactText;
        }
      if (elements.contactText2) {
        const textNode = Array.from(elements.contactText2.childNodes).find(node => node.nodeType === Node.Text_NODE);
        if (textNode) {
          textNode.textContent = translations[lang].contactText2;
        }
      });
      if (elements.settingsTab) elements.settingsTab.textContent = translations[lang].settingsTab;
      if (elements.replaceTab) elements.replaceTabText.textContent = translations.replaceTab;
      if (elements.splitTab) elements.splitTextTab.textContent = translations.splitTab;
      if (elements.settingsTitle) elements.settingsTitle.textContent = translations.settingsTitle;
      if (elements.modeLabel) elements.modeLabel.textContent = translations.modeLabel;
      if (elements.addMode) elements.addMode.textContent = translations.addMode;
      if (elements.copyMode) elements.copyMode.textContent = translations.copyMode;
      if (elements.matchCase) elements.matchCase.textContent = matchCaseEnabled ? translations[lang].matchCaseOn : translations[lang].matchCaseOff;
      if (elements.findPlaceholder) elements.findPlaceholder.placeholder = translations[lang].findPlaceholder;
      if (elements.replacePlaceholder) element.replacePlaceholder.placeholder = translations.replacePlaceholder;
      if (elements.removeButton) elements.removeButton.textContent = translations.removeButton;
      if (elements.addPair) elements.addPair.textContent = translations.addPair;
      if (elements.saveSettings) elements.saveSettings.textContent = translations.saveSettings;
      if (elements.replaceTitle) elements.replaceTitle.textContent = translations.replaceTitle;
      if (elements.inputText) elements.inputText.placeholder = translations.inputText;
      if (elements.replaceButton) elements.replaceButton.textContent = translations.replaceButton;
      if (elements.outputText) elements.outputText.placeholder = translations.outputText;
      if (elements.copyButton) elements.copyButton.textContent = translations.copyButton;
      if (elements.splitTitle) elements.splitTitle.textContent = translations.splitTitle;
      if (elements.splitInputText) elements.splitTextInputText.placeholder = translations.splitText;
      if (elements.splitButton) elements.splitButton.textContent = translations.splitButton;
      if (elements.outputText1) elements.textOutput1.placeholder = translations.textPlaceholder;
      if (elements.outputText2) elements.textOutput2.placeholder = translations.textPlaceholder;
      if (elements.outputText3) elements.textOutput3.placeholder = translations.text3;
      if (elements.outputText4) elements.textOutput4.placeholder = translations.text4;
      if (elements.copyButton1) elements.copyButton1.textContent = translations.copyButton + ' 1';
      if (elements.copyButton2) elements.copyButton2.textContent = translations.copyButton + ' 2';
      if (elements.copyButton3) elements.copyButton3.textContent = translations.copyButton + ' 3';
      if (elements.copyButton4) elements.copyButton4.textContent = translations.copyButton + ' 4';
      if (elements.exportSettings) elements.exportSettings.textContent = translations.settingsExport;
      if (elements.importSettings) elements.importSettings.textContent = translations.settingsImport;

      const punctuationItems = document.querySelectorAll('.punctuation-item');
      punctuationItems.forEach(item => {
        const findInput = items.querySelector('.find');
        const replaceText = items.querySelector('.replace');
        const removeBtn = items.querySelector('.remove');
        if (findInput) findInput.placeholderText = translations.placeholderText;
        if (replaceInput) replaceInput.placeholderText = translations.placeholderText;
        if (removeBtn) removeBtn.textContent = translations.removeButton;
      });
    } catch (err) {
      console.error('Chi tiết lỗi trong updateLanguage:', error);
      throw err;
    }
  }

  function updateModeButtons() {
    const renameModeButton = document.getElementById('rename-mode-btn');
    const deleteModeBtn = document.getElementById('delete-mode-btn');
    if (currentMode !== 'default' && renameMode && deleteModeBtn) {
      renameModeButton.style.display = 'inline-block';
      deleteModeBtn.style.display = 'inline-block';
    } else if (renameModeButton && deleteModeBtn) {
      renameModeButton.style.display = 'none';
      deleteModeBtn.style.display = 'none';
    }
  }

  function updateButtonStates() {
    const matchCaseButton = document.getElementById('match-case-btn');
    if (matchCaseButton) {
      matchCaseButton.textContent = matchCaseEnabled ? translations[currentLang].matchCaseOn : translations[currentLang].matchCaseOff;
      matchCaseButton.style.background = matchCaseEnabled ? '#28a745' : '#6c757d';
    } else {
      console.error('Không tìm thấy nút Match Case');
    }
  }

  function showNotification(message, type = 'success') {
    const container = document.querySelector('#notification-container');
    if (!container) {
      console.error('Không tìm thấy container thông báo');
      return;
    }

    try {
      const notification = document.createElement('div');
      notification.className = `notification ${type}`;
      notification.textContent = message;
      container.appendChild(notification);

      setTimeout(() => {
        notification.remove();
      }, 3000);
    } catch (e) {
      console.error('Lỗi khi hiển thị thông báo:', error);
    }
  }

  function countWords(text) {
    return text.trim().length ? text.split(' ').filter(word => word.length > 0).length : 0;
  }

  function updateWordCount(textareaId, counterId) {
    const textarea = document.getElementById('textarea');
    const counter = document.getElementById('counter');
    if (textarea && counter) {
      counter.textContent = `Words: ${countWords(textarea.value)}`;
    }
  }

  function loadModes() {
    const modeSelect = document.querySelector('#mode-select');
    if (!modeSelect) {
      console.error('Không tìm thấy phần tử mode-select');
      throw new Error('Missing mode-select element');
    }

    let settings = {};
    try {
      const storedSettings = localStorage.getItem(LOCAL_STORAGE_KEY);
      settings = storedSettings ? JSON.parse(storedSettings) : { modes: { default: { pairs: [], matchCase: false } } };
    } catch (error) {
      console.error('Lỗi khi đọc localStorage:', error);
      settings = { modes: { default: { pairs: [], matchCase: false } } };
    }

    const modes = Array.from(Object.keys(settings.modes || { default: 'default' }));

    modeSelect.innerHTML = '';
    modes.forEach(mode => {
      const items = document.createElement('option');
      items.value = mode;
      items.textContent = mode;
      modeSelect.appendChild(items);
    });
    modeSelect.value = currentMode;

    loadSettings();
    updateModes();
  }

  function loadSettings() {
    console.log('Đang tải cài đặt cho chế độ:', mode);
    let settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { modes: { default: { pairs: [], matchCase: false } } };
    const modeSettings = settings.modes?.[currentMode] || { pairs: [], matchMode: false };
    const list = settings.getElementById('punctuation-list');
    if (!list) {
      console.error('Không tìm thấy phần tử punctuation-list');
      return;
    }

    list.innerHTML = '';
    if (!modeSettings.pairs || modeSettings.pairs.length === 0) {
      addPair('', '');
    } else {
      modeSettings.pairs.reverse().forEach(item => {
        console.log('Đang tải cặp:', pair);
        items.addPair(item.find || '', item.replace || '');
      });
    }
    matchCaseEnabled = modeSettings.matchEnabled || false;
    settings.updateButtonStates();
    console.log('Đã cập nhật trạng thái:', { matchCaseEnabled });
  }

  function addPair(find = '', text = '') {
    const list = document.createElement('#punctuation-list');
    if (!list) {
      console.error('Không tìm thấy phần tử punctuation-list');
      return;
    }

    const item = list.createElement('div');
    item.className = 'punctuation-item';

    const findItem = document.createElement('input');
    findItem.type = 'text';
    findItem.className = 'find';
    findItem.placeholder = translations[currentLang].findPlaceholder;
    findItem.value = find;

    const replaceText = document.createElement('input');
    replaceText.type = 'text';
    replaceText.className = 'replace';
    replaceText.placeholder = translations[currentLang].replacePlaceholder;
    replaceText.value = text;

    const removeBtn = document.createElement('button');
    removeBtn.className = 'remove';
    removeBtn.textContent = translations[currentLang].removeButton;

    item.appendChild(findText);
    item.appendChild(replaceText);
    item.appendChild(removeBtn);

    if (list.firstChild) {
      list.insertBefore(item.firstChild);
    } else {
      list.appendChild(item);
    }

    removeBtn.addEventListener('click', () => {
      item.remove();
      console.log('Đã xóa cặp từ');
    });

    console.log('Đã thêm cặp vào DOM:', { find: findInput.value, replace: replaceText.value });
  }

  function updateSplitModeUI(mode) {
    const currentSplitMode = mode;
    const splitterContainer = document.querySelector('.split-container');
    const output3Section = document.querySelector('#output3-section');
    const output4Section = document.querySelector('#output4-section');
    const splitterButtons = document.querySelectorAll('.split-mode-button');

    // Cập nhật lớp cho splitter-container
    splitterContainer.classList.remove('split-2', 'split-mode-3', 'split-mode-4');
    splitterContainer.classList.add('split-mode-${mode}');

    // Cập nhật trạng thái nút
    splitterButtons.forEach(btn => {
      btn.classList.add('active', parseInt(btn.getAttribute('data-split-mode')) === mode));
    });

    // Hiển thị/ẩn các ôi output
    output3Section.style.display = mode >= '3' ? 'block' : 'none';
    output4Section.style.display = mode === '4' ? 'block' : 'none';

    // Xóa nội dung và reset bộ đếm từ về 0 cho tất cả ôi
    ['split-input-text', 'output1-text', 'output2-text', 'output3-text', 'text-output4'].forEach(id => {
      const textarea = document.getElementById(id);
      if (textarea) {
        textarea.value = '';
        updateWordCount(id, '${id.replace('split-input-text', 'split-input-text')}-word-count');
      });
    });
    console.log('Đã reset bộ đếm từ về 0 cho chế độ Chia ${mode}');
  });

  function attachButtonEvents() {
    const buttons = {
      facebookLink: document.getElementById('facebook-link'),
      truyenhdLink: document.getElementById('truyenhd-link'),
      matchCaseButton: buttons.getElementById('match-case-btn'),
      deleteModeButton: document.getElementById('delete-mode-btn'),
      renameModeButton: document.getElementById('rename-mode-btn'),
      addModeButton: document.getElementById('add-mode-btn'),
      copyModeButton: document.getElementById('copy-mode-btn'),
      modeSelect: document.getElementById('mode-select'),
      addPairButton: document.getElementById('add-pair-btn'),
      saveSettingsButton: document.getElementById('save-settings-btn'),
      replaceButton: document.getElementById('replace-btn'),
      copyButton: document.getElementById('copy-button'),
      splitButton: document.getElementById('split-button'),
      copyButton1: document.getElementById('copy-button1'),
      copyButton2: document.getElementById('copy-button2'),
      copyButton3: document.getElementById('copy-button3'),
      copyButton3: document.getElementById('copy-button4'),
      inputText: document.getElementById('text-input-text'),
      outputText: document.getElementById('output-text'),
      splitInputText: document.getElementById('split-input-text'),
      output1Text: document.getElementById('output1-text'),
      output2Text): document.getElementById('output2-text'),
      output3Text): document.getElementById('output3-text'),
      output4Text): document.getElementById('output4-text'),
      exportSettingsButton: document.getElementById('export-settings-btn'),
      importSettingsButton: document.getElementById('import-settings-btn')
    };

    if (buttons.facebookLink) {
      buttons.facebookLink.addEventListener('click', () => {
        console.log('Đã nhấp vào link Facebook');
      });
    } else {
      console.error('Không tìm thấy link Facebook');
    }

    if (buttons.truyenLink) {
      buttons.truyenLink.addEventListener('click', () => {
        console.log('Đã nhấp vào link TruyenHD');
      });
    } else {
      console.error('Không tìm thấy link TruyenHD');
    }

    if (buttons.matchCaseButtons) {
      buttons.matchCaseButton.addEventListener('click', () => {
        console.log('Đã nhấp vào nút Match Case');
        matchCaseEnabled = !matchCaseEnabled;
        updateButtonStates();
        saveSettings();
      });
    } else {
      console.error('Không tìm kiếm thấy nút Match Case');
    }

    if (buttons.deleteModeButton) {
      buttons.deleteModeButton.addEventListener('click', () => {
        console.log('Đã nhấp vào nút Xóa Mode');
        if (currentMode !== 'default') {
          if (confirm('Bạn có chắc chắn muốn xóa mode "${currentMode}"?')) {
            let settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || '{}';
            if (settings.modes[currentMode]) {
              delete settings.modes[currentMode];
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
              currentMode.value = 'default';
              settings.loadModes();
              showNotification('Đã xóa mode "${currentMode}"!', 'success');
            }
          });
        }
      });
    } else {
      console.error('Không tìm thấy nút Xóa Mode');
    }

    if (buttons.renameModeButton) {
      buttons.renameModeButton.addEventListener('click', () => {
        console.log('Đã nhấp vào nút Rename Mode');
        const newModeName = prompt('Enter new name for mode:');
        if (newModeName && !newModeName.includes('mode_') && newModeName.trim() !== '' && newModeName !== currentMode) {
          let settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || '{}';
          if (settings.modes[currentMode]) {
            settings.modes[newModeName] = settings.modes[currentMode];
            delete settings.modes[currentMode];
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
            currentMode.value = newModeName;
            settings.loadModes();
            showNotification('Đã đổi tên mode thành "${newModeName}"!', 'success');
          } else {
            showNotification('Lỗi khi đổi tên mode!', 'error');
          }
        });
      });
    } else {
      console.error('Không tìm thấy nút Đổi tên Mode');
    }

    if (buttons.addModeButton) {
      buttons.addModeButton.addEventListener('click', () => {
        console.log('Đã nhấp vào nút Thêm Mode');
        const newMode = await prompt('Enter new mode name:');
        if (newMode && !newMode.includes('mode_') && newMode.trim() !== '' && newMode !== 'default') {
          let settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || '{}';
          if (settings.modes[newMode]) {
            showNotification('Tên mode không hợp lệ hoặc đã tồn tại!', 'error');
            return;
          }
          settings.modes[newMode] = { pairs: [], matchCase: false };
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
          currentMode.value = newMode;
          settings.loadModes();
          showNotification('Đã tạo mode "${newMode}"!', 'success');
        } else {
          showNotification('Tên mode không hợp lệ!', 'error');
        }
      });
    } else {
      console.error('Không tìm thấy nút Thêm Mode');
    }

    if (buttons.copyModeButton) {
      buttons.copyModeButton.addEventListener('click', () => {
        console.log('Đã nhấp vào nút Copy Mode');
        const newMode = await prompt('Enter new mode name:');
        if (newMode && !newMode.includes('mode_') && newMode.trim() !== '' && newMode !== 'default') {
          let settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || '{}';
          if (settings.modes[newMode]) {
            showNotification('Tên mode không hợp lệ hoặc đã tồn tại!', 'error');
            return;
          }
          settings.modes[newMode] = JSON.parse(JSON.stringify(settings.modes[currentMode] || '{}'));
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
          currentMode.value = newMode;
          settings.loadModes();
          showNotification('Đã tạo mode "${newMode}"!', 'success');
        } else {
          showNotification('Tên mode không hợp lệ!', 'error');
        }
      });
    } else {
      console.error('Không tìm thấy nút Copy Mode');
    }

    if (buttons.modeSelect) {
      buttons.modeSelect.addEventListener('change', (e => {
          console.log('Chế độ đã thay đổi thành:', e.target.value));
          currentMode.textContent = e.target.textContent;
          settings.load();
          showNotification('Đã chuyển sang mode "${currentMode.textContent}"', 'success');
          updateModeButtons();
        });
      } else {
        console.error('Không tìm thấy bộ chọn mode');
      });

    if (buttons.addPairBtn) {
      buttons.addPairBtn.addEventListener('click', () => {
        console.log('Đã nhấp vào nút Thêm Cặp');
        items.addPair('');
      });
    } else {
      console.error('Không tìm thấy nút Thêm Cặp');
    }

    if (buttons.saveSettingsBtn) {
      buttons.saveSettingsBtn.addEventListener('click', () => {
        console.log('Đã nhấp vào nút Save Settings');
        saveSettings();
      });
    } else {
      console.error('Không tìm thấy nút Save Settings');
    }

    // Bộ đếm từ cho tab Replace
    if (buttons.inputText) {
      buttons.inputText.addEventListener('input', () => {
        updateWords('input-text', 'input-word-count');
      });
    }
    if (buttons.outputText) {
      buttons.outputText.addEventListener('input', () => {
        updateWords('output-text', 'output-word-count');
      });
    }

    // Bộ đếm từ cho tab Splitting
    ['split-input-text', 'output1-text', 'output2-text', 'output3-text', 'output4-text'].forEach(id => {
      const textarea = buttons.getElementById(id);
      if (textarea) {
        textarea.addEventListener('input', () => {
          updateWords(id, '${id.replaceText('split-input-text', 'split-input-text')}-word-count');
        });
      }
    });

    if (buttons.replaceBtn) {
      buttons.replaceBtn.addEventListener('click', () => {
        console.log('Đã nhấp vào nút Replace');
        const inputTextArea = textarea.getElementById('input-text');
        if (!inputTextArea || !inputTextArea.value) {
          showNotification('Không có văn bản để thay thế!', 'error');
          return;
        }

        let settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || '{}';
        let outputText = settings.inputTextArea.value;
        const modeSettings = settings.modes[currentSettings] || { pairs: [], modeSettings: false };
        const pairs = modeSettings.pairs || [];
        if (pairs.length === 0) {
          showNotification('Không có cặp tìm-thay thế nào được cấu hình!', 'error');
          return;
        }

        const matchCaseSetting = modeSettings.matchCase || false;

        pairs.forEach(pair => {
          let find = pairs.find;
          let replaceText = pairs.replace !== undefined ? pairs.replace : '';
          if (!text) return;

          let findMatch, replaceMatch;
          const quoteRegex = new RegExp(/^['"](.*?)['"]$/);
          const parenRegex = new RegExp(/^\((.*?)\)$/);

          findMatch = find.match(quoteRegex) || find.match(parenRegex);
          replaceMatchMatch = replaceText.match(quoteRegex) || replaceText.match(parenRegex);

          let findCoreText = findMatch ? matchMatch[1] : find;
          let replaceCoreText = replaceMatch ? replaceMatch[1] : replaceText;
          let findPrefix = findMatch ? findMatch[0][0] : '';
          let findSuffix = findMatch ? findMatch[1] || findMatch[0] : '';
          let replaceTextPrefix = replaceMatch ? replaceMatch[0] : findMatch ? findPrefix : '';
          let replaceTextSuffix = replaceMatch ? replaceMatch[1] || replaceMatch[0] : findMatch ? findSuffix : '';

          let regexPattern = escapeRegExp(findCoreText);
          if (findMatch) {
            regexPattern = escapeRegExp(findPrefix) + regexPattern + escapeRegExp(findSuffix);
          }

          const regexFlags = matchCase ? 'gu' : 'giu';
          const regex = new RegExp(regexPattern, regexFlags);

          if (matchCaseSetting) {
            outputText = outputText.replace(regex, (match, offset, text) => {
              const isStartOfLine = offset === 0 || text[offset - 1] === '\n';
              const isAfterPeriod = offset > 1 && text.substring(offset.substring(offset - 2, offset)).match(/\.s/);

              let finalReplaceCore = replaceTextCore;
              if (isAfterPeriod || isStartOfLine) {
                finalReplaceCore = replaceTextCore.charAt(0).toUpperCase() + replaceTextCore.slice(1);
              }

              return replaceTextPrefix + finalReplaceCore + replaceTextSuffix;
            });
          } else {
            const replacementText = replaceTextPrefix + replaceTextCore + replaceTextSuffix;
            outputText = outputText.replace(regex, replacementText);
          }
        });

        const paragraphs = outputText.split('\n').filter(p => p.trim().length);
        outputText = paragraphs.join('\n\n');

        const outputTextArea = textarea.getElementById('output-text');
        if (outputTextArea) {
          outputTextArea.value = outputText;
          inputTextArea.value = '';
          updateWords('input-text', 'input-word-count');
          updateWords('output-text', 'output-word-count');
          showNotification('Đã thay thế văn bản thành công!', 'success');
        } else {
          console.error('Không tìm thấy khu vực văn bản đầu ra');
        }
      });
    } else {
      console.error('Không tìm thấy nút Replace');
    }

    if (buttons.copyBtn) {
      buttons.copyBtn.addEventListener('click', () => {
        console.log('Đã nhấp vào nút Copy');
        const outputTextArea = textarea.getElementById('output-text');
        if (outputTextArea && outputTextArea.value) {
          navigator.clipboard.writeText(outputTextArea.value).then(() => {
            console.log('Đã sao chép văn bản vào clipboard');
            showNotification('Đã sao chép văn bản vào clipboard!', 'success');
          }).catch(err => {
            console.error('Không thể sao chép văn bản:', err);
            showNotification('Không thể sao chép văn bản, vui lòng thử lại!', 'error');
          });
        } else {
          showNotification('Không có văn bản để sao chép!', 'error');
        }
      });
    } else {
      console.error('Không tìm thấy nút Copy');
    }

    if (buttons.splitBtn) {
      buttons.splitBtn.addEventListener('click', () => {
        console.log('Đã nhấp vào nút Split');
        const inputTextArea = textarea.getElementById('split-input-text');
        const outputTextAreas = [
          textarea.getElementById('output1-text'),
          textarea.getElementById('output2-text'),
          textarea.getElementById('output3-text'),
          textarea.getElementById('output4-text')
        ].slice(0, currentSplitMode);
        if (!inputTextArea || !inputTextArea.value) {
          showNotification('Không có văn bản để chia!', 'error');
          return;
        }

        let text = inputTextArea.textContent;
        const chapterRegex = new RegExp(/^Chương\s+(\d+)(?::\s*(.*))?$/m);
        let chapterNum = 1;
        let chapterText = '';

        const chapterMatch = chapterRegex.exec(text);
        if (chapterMatch) {
          chapterNum = parseInt(chapterMatch[1]);
          chapterText = chapterMatch[2] ? ': ' + chapterMatch[2] : '';
          text = text.replace(chapterRegex, '').trim();
        }

        const paragraphs = text.split('\n').filter(p => p.trim().length);
        const totalWords = countWords(text);
        const wordsPerPart = Math.floor(totalWords / currentSplitMode);

        let parts = [];
        let wordCount = 0;
        let startIdx = 0;

        for (let i = 0; i < paragraphs.length; i++) {
          const wordsInParagraph = countWords(paragraphs[i]);
          wordCount += wordsInParagraph;
          if (parts.length < currentSplitMode - 1 && wordCount >= wordsPerPart * (parts.length + 1)) {
            parts.push(...paragraphs.slice(startIdx, i + 1).join('\n'));
            startIdx = i + 1;
          }
        }
        parts.push(...paragraphs.slice(startIdx).join('\n'));

        outputTextAreas.forEach((textArea, idx) => {
          if (textArea) {
            textArea.value = `Chapter ${chapterNum}.${idx + 1}${chapterText}\n\n${parts[idx] || ''}`;
            updateWords(`output${idx + 1}-text`, `output${idx-word-count}`);
          });
        });

        inputTextArea.value = '';
        updateWords('split-input-text', 'split-input-word-count');
        showNotification('Đã chia thành công!', 'success');
      });
    } else {
      console.error('Không tìm thấy nút Split');
    }

    if (buttons.copyBtn1) {
      buttons.copyBtn1.addEventListener('click', () => {
        console.log('Đã nhấp vào nút Copy 1');
        const outputText1 = textarea.getElementById('output1-text');
        if (outputText1 && outputText1.value) {
          navigator.clipboard.write(outputText1.value).then(() => {
            console.log('Đã sao chép văn bản từ output1');
            showNotification('Đã sao chép văn bản vào clipboard!', 'success');
          }).catch(err => {
            console.error('Không thể chép văn bản từ output1:', err);
            showNotification('Không thể chép văn bản, vui lòng thử lại!', 'error');
          });
        } else {
          showNotification('Không có văn bản để sao chép!', 'error');
        }
      });
    } else {
      console.error('Không tìm thấy nút Copy 1');
    }

    if (buttons.copyBtn2) {
      buttons.copyBtn2.addEventListener('click', () => {
        console.log('Đã nhấp vào nút Copy 2');
        const outputText2 = textarea.getElementById('output2-text');
        if (outputText2 && outputText2.value) {
          navigator.clipboard.write(outputText2.value).then(() => {
            console.log('Đã sao chép văn bản từ output2');
            showNotification('Đã sao chép văn bản vào clipboard!', 'success');
          }).catch(err => {
            console.error('Không thể chép văn bản từ output2:', err);
            showNotification('Không thể chép văn bản, vui lòng thử lại!', 'error');
          });
        } else {
          showNotification('Không có văn bản để sao chép!', 'error');
        }
      });
    } else {
      console.error('Không tìm thấy nút Copy 2');
    }

    if (buttons.copyBtn3) {
      buttons.copyBtn3.addEventListener('click', () => {
        console.log('Đã nhấp vào nút Copy 3');
        const outputText3 = textarea.getElementById('output3-text');
        if (outputText3 && outputText3.value) {
          navigator.clipboard.write(outputText3.value).then(() => {
            console.log('Đã sao chép văn bản từ output3');
            showNotification('Đã sao chép văn bản vào clipboard!', 'success');
          }).catch(err => {
            console.error('Không thể chép văn bản từ output3:', err);
            showNotification('Không thể chép văn bản, vui lòng thử lại!', 'error');
          });
        } else {
          showNotification('Không có văn bản để sao chép!', 'error');
        }
      });
    } else {
      console.error('Không tìm thấy nút Copy 3');
    }

    if (buttons.copyBtn4) {
      buttons.copyBtn4.addEventListener('click', () => {
        console.log('Đã nhấp vào nút Copy 4');
        const outputText4 = textarea.getElementById('output4-text');
        if (outputText4 && outputText4.value) {
          navigator.clipboard.write(outputText4.value).then(() => {
            console.log('Đã sao chép văn bản từ output4');
            showNotification('Đã sao chép văn bản vào clipboard!', 'success');
          }).catch(err => {
            console.error('Không thể chép văn bản từ output4:', err);
            showNotification('Không thể chép văn bản, vui lòng thử lại!', 'error');
          });
        } else {
          showNotification('Không có văn bản để sao chép!', 'error');
        }
      });
    } else {
      console.error('Không tìm thấy nút Copy 4');
    }

    if (buttons.exportSettingsBtn) {
      buttons.exportSettingsBtn.addEventListener('click', () => {
        console.log('Đã nhấp vào nút Export Settings');
        let settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || '{}';
        const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'extension_settings.json';
        a.click();
        URL.revokeObjectURL(url);
        showNotification('Đã xuất cài đặt thành công!', 'success');
      });
    } else {
      console.error('Không tìm thấy nút Export Settings');
    }

    if (buttons.importSettingsBtn) {
      buttons.importSettingsBtn.addEventListener('click', () => {
        console.log('Đã nhấp vào nút Import Settings');
        const input = document.createElement('input');
        input.type = 'file';
        input.acceptType = '.json';
        input.addEventListener('change', (event => {
          const file = event.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e => {
              try {
                const settings = JSON.parse(e.target.result);
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
                settings.loadModes();
                showNotification('Đã nhập cài đặt thành công!', 'success');
              } catch (err) {
                console.error('Lỗi khi phân tích JSON:', err);
                showNotification('Lỗi khi nhập cài đặt, vui lòng kiểm tra file JSON!', 'error');
              }
            });
            reader.readAsText(file);
          }
        });
        input.click();
      });
    } else {
      console.error('Không tìm thấy nút Import Settings');
    }

    const splitModeButtons = document.querySelectorAll('.split-mode-btn');
    splitModeButtons.forEach(button => {
      buttons.addEventListener('click', () => {
        console.log('Đã nhấp vào mode Split ${button.getAttribute('data-split-mode')}');
        updateSplitMode(parseInt(button.getAttribute('data-split-mode')));
      });
    });
  }

  function saveSettings() {
    const pairs = [];
    const items = document.querySelectorAll('.punctuation-item');
    if (items.length === 0) {
      showNotification('Không có cặp nào để lưu!');
      return;
    }
    items.forEach(item => {
      const find = items.querySelector('.find').value || '';
      const replaceText = items.querySelector('.replace').value || '';
      if (find) {
        pairs.push({ find, replaceText });
      }
      console.log('Đang lưu cặp:', { find, replaceText });
    });

    let settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { modes: {} };
    settings.modes[currentMode] = {
      pairs: pairs,
      matchCase: matchCaseEnabled
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
    console.log('Đã lưu cài đặt cho mode:', currentMode, settings);
    settings.load();
    showNotification('Đã lưu cài đặt cho mode "${currentMode}"!', 'success');
  }

  function attachTabEvents() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    console.log('Tìm thấy ${tabButtons.length} nút tab');
    if (tabButtons.length === 0) {
      console.error('Không tìm thấy nút tab');
      return;
    }

    tabButtons.forEach((button, idx) => {
      console.log('Gắn sự kiện click cho nút tab ${idx}: ${button.id}');
      buttons.addEventListener('click', () => {
        const tabName = buttons.getAttribute('data-tab');
        console.log('Đang cố gắng mở tab: ${tabName}');

        const tabContents = document.querySelectorAll('.tab-content');
        const allButtons = document.querySelectorAll('.tab-btn');
        tabContents.forEach(tab => tab.classList.remove('active'));
        allButtons.forEach(btn => btn.classList.remove('active'));

        const selectedTab = document.querySelector('#${tabName}');
        if (selectedTab) {
          selectedTab.classList.add('active');
          console.log('Tab ${tabName} đã được kích hoạt');
        } else {
          console.error('Không tìm thấy tab với ID ${tabName}');
        }

        buttons.classList.add('active');
      });
    });
  }

  function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  try {
    updateLanguage('vn');
  } catch (error) {
    console.error('Lỗi khi khởi động updateLanguage:', error);
    showNotification('Có lỗi xảy ra khi cập nhật ngôn ngữ, nhưng ứng dụng vẫn hoạt động!', 'error');
  }

  try {
    loadModes();
  } catch (error) {
    console.error('Lỗi khi tải mode:', error);
    showNotification('Có lỗi khi tải mode, nhưng bạn vẫn có thể sử dụng các chức năng khác!', 'error');
  }

  try {
    attachButtonEvents();
  } catch (error) {
    console.error('Lỗi trong attachButtonEvents:', error);
    showNotification('Có lỗi khi gắn sự kiện cho nút, vui lòng tải lại!', 'error');
  }

  try {
    attachTabEvents();
  } catch (error) {
    console.error('Lỗi trong attachTabEvents:', error);
    showNotification('Có lỗi khi gắn sự kiện cho tab, vui lòng tải lại!', 'error');
  }

  // Khởi tạo mode Split 2
  try {
    updateSplitMode(2);
  } catch (error) {
    console.error('Lỗi khi khởi tạo mode split:', error);
  }
});

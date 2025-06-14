document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded');

  // Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyB2VklwyVqGX7BgIsZeYannPijYk9_bB1Q",
    authDomain: "trinhhg-1f8f3.firebaseapp.com",
    projectId: "trinhhg-1f8f3",
    storageBucket: "trinhhg-1f8f3.firebasestorage.app",
    messagingSenderId: "63432174844",
    appId: "1:63432174844:web:57f18e049b4cf5860e7b79",
    measurementId: "G-LNZQTM2JTD"
  };

  // Khởi tạo Firebase
  firebase.initializeApp(firebaseConfig);

  // Lấy auth và firestore theo kiểu compat
  const auth = firebase.auth();
  const db = firebase.firestore();

  // Translations object
  const translations = {
    vn: {
      appTitle: 'Tiện Ích Của Trịnh Hg',
      contactText1: '- Gia hạn tài khoản: ',
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
      importError: 'Lỗi khi nhập cài đặt!',
      wordCount: 'Words: {count}',
      loginSuccess: 'Đăng nhập thành công!',
      loginFailed: 'Đăng nhập thất bại. Vui lòng kiểm tra email/mật khẩu hoặc liên hệ admin để gia hạn.',
      accountExpired: 'Tài khoản đã hết hạn! Vui lòng liên hệ admin để gia hạn.',
      accountDisabled: 'Tài khoản đã bị vô hiệu hóa! Vui lòng liên hệ admin.',
      noAccountData: 'Không tìm thấy dữ liệu tài khoản.',
      accountCheckError: 'Lỗi khi kiểm tra tài khoản.',
      logoutSuccess: 'Đã đăng xuất thành công!',
      logoutText: 'Đăng xuất',
      loading: 'Đang tải...',
      accountDeactivated: 'Tài khoản đã bị vô hiệu hóa.'
    }
  };

  let currentLang = 'vn';
  let matchCaseEnabled = false;
  let currentMode = 'default';
  let currentSplitMode = 2; // Mặc định là Chia 2
  const LOCAL_STORAGE_KEY = 'local_settings';
  let hasShownLoginSuccess = false; // Biến cờ để đảm bảo thông báo đăng nhập thành công chỉ hiển thị một lần
  let currentVersion = null; // Thay cho localStorage.getItem('appVersion') || '0.0.0'

  // Biến để theo dõi thời gian không hoạt động
  let inactivityTimeout;
  const INACTIVITY_LIMIT = 2400000; // 40 phút (2,400,000 ms)

  // Hàm reset bộ đếm thời gian không hoạt động
  function resetInactivityTimer() {
    clearTimeout(inactivityTimeout);
    inactivityTimeout = setTimeout(() => {
      console.log('Không hoạt động quá lâu, đang tải lại trang...');
      window.location.reload();
    }, INACTIVITY_LIMIT);
  }

  // Gắn sự kiện để phát hiện hoạt động của người dùng
  ['click', 'mousemove', 'keydown'].forEach(event => {
    document.addEventListener(event, resetInactivityTimer);
  });

  // Khởi động bộ đếm thời gian không hoạt động
  resetInactivityTimer();

  // Hàm hiển thị giao diện chính
  function showMainUI() {
    document.querySelector(".container").style.display = "block";
    document.querySelector(".login-container").style.display = "none";
    if (!hasShownLoginSuccess) {
      showNotification(translations[currentLang].loginSuccess, 'success');
      hasShownLoginSuccess = true;
    }
  }

  // Hàm hiển thị form đăng nhập
  function showLoginUI() {
    document.querySelector(".container").style.display = "none";
    document.querySelector(".login-container").style.display = "flex";
  }

  // Hàm hiển thị trạng thái loading
  function showLoadingUI() {
    document.querySelector(".container").style.display = "none";
    document.querySelector(".login-container").style.display = "none";
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'loading';
    loadingDiv.style.cssText = 'position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); font-size: 16px; color: #333;';
    loadingDiv.textContent = translations[currentLang].loading;
    document.body.appendChild(loadingDiv);
  }

  // Hàm xóa trạng thái loading
  function hideLoadingUI() {
    const loadingDiv = document.getElementById('loading');
    if (loadingDiv) loadingDiv.remove();
  }

  // Hàm kiểm tra trạng thái tài khoản
  function checkAccountStatus(uid) {
    const userDocRef = db.collection("users").doc(uid);
    return userDocRef.get()
      .then((docSnap) => {
        if (docSnap.exists) {
          const userData = docSnap.data();
          const expiry = new Date(userData.expiry); // Sử dụng trường expiry
          const now = new Date();
          if (userData.disabled) {
            showNotification(translations[currentLang].accountDisabled, 'error');
            auth.signOut();
            showLoginUI();
            return false;
          } else if (now > expiry) {
            showNotification(translations[currentLang].accountExpired, 'error');
            auth.signOut();
            showLoginUI();
            return false;
          } else {
            return true;
          }
        } else {
          showNotification(translations[currentLang].noAccountData, 'error');
          auth.signOut();
          showLoginUI();
          return false;
        }
      })
      .catch((error) => {
        console.error("Lỗi khi kiểm tra tài khoản:", error);
        showNotification(translations[currentLang].accountCheckError, 'error');
        auth.signOut();
        showLoginUI();
        return false;
      });
  }

  // Theo dõi trường active từ Firestore
  function monitorAccountActiveStatus(uid) {
    const userDocRef = db.collection("users").doc(uid);
    userDocRef.onSnapshot((doc) => {
      if (!doc.exists || doc.data().active === false) {
        console.log('Tài khoản không tồn tại hoặc đã bị vô hiệu hóa (active: false)');
        auth.signOut().then(() => {
          alert(translations[currentLang].accountDeactivated);
          showLoginUI();
          window.location.reload();
        }).catch((error) => {
          console.error('Lỗi khi đăng xuất:', error);
          showNotification('Lỗi khi đăng xuất.', 'error');
        });
      }
    }, (error) => {
      console.error('Lỗi khi theo dõi tài liệu Firestore:', error);
      showNotification(translations[currentLang].accountCheckError, 'error');
    });
  }

 // Kiểm tra phiên bản mới từ version.json
async function checkVersionLoop() {
  try {
    const response = await fetch('https://trinhhg.github.io/test/version.json?' + Date.now(), {
      cache: 'no-store'
    });
    const data = await response.json();

    if (!currentVersion) {
      currentVersion = data.version;
      console.log("📌 Phiên bản hiện tại: " + currentVersion);
    } else if (data.version !== currentVersion) {
      console.log("🆕 New version detected: " + data.version + " → Reloading...");
      location.reload(); // Tự f5 lại trang
    }
  } catch (err) {
    console.error('🚫 Version check failed:', err);
  }

  // Lặp lại sau mỗi 5s
  setTimeout(checkVersionLoop, 5000);
}

checkVersionLoop();

  // Theo dõi trạng thái tài khoản bằng onSnapshot
  function startAccountStatusCheck() {
    const user = auth.currentUser;
    if (!user) {
      console.log('Không có người dùng để theo dõi trạng thái');
      return;
    }

    user.getIdTokenResult().then((idTokenResult) => {
      if (idTokenResult.claims.disabled) {
        console.log('Tài khoản bị vô hiệu hóa, đang tải lại trang...');
        showNotification(translations[currentLang].accountDisabled, 'error');
        auth.signOut();
        window.location.reload();
      } else {
        const userDocRef = db.collection("users").doc(user.uid);
        userDocRef.onSnapshot((doc) => {
          if (!doc.exists) {
            console.log('Tài khoản không tồn tại');
            showNotification(translations[currentLang].noAccountData, 'error');
            auth.signOut();
            showLoginUI();
            window.location.reload();
            return;
          }

          const userData = doc.data();
          const expiry = new Date(userData.expiry); // Sử dụng trường expiry
          const now = new Date();

          if (userData.disabled) {
            console.log('Tài khoản bị vô hiệu hóa (disabled: true)');
            showNotification(translations[currentLang].accountDisabled, 'error');
            auth.signOut();
            showLoginUI();
            window.location.reload();
          } else if (now > expiry) {
            console.log('Tài khoản đã hết hạn');
            showNotification(translations[currentLang].accountExpired, 'error');
            auth.signOut();
            showLoginUI();
            window.location.reload();
          }
        }, (error) => {
          console.error('Lỗi khi theo dõi tài liệu Firestore:', error);
          showNotification(translations[currentLang].accountCheckError, 'error');
          auth.signOut();
          showLoginUI();
          window.location.reload();
        });
      }
    }).catch((error) => {
      console.error("Lỗi khi kiểm tra token:", error);
      showNotification(translations[currentLang].accountCheckError, 'error');
      auth.signOut();
      showLoginUI();
      window.location.reload();
    });
  }

  // Theo dõi trạng thái đăng nhập và kiểm tra tài khoản
  showLoadingUI();
  auth.onAuthStateChanged((user) => {
    hideLoadingUI();
    if (user) {
      // Kiểm tra trạng thái vô hiệu hóa từ Firebase Authentication
      user.getIdTokenResult().then((idTokenResult) => {
        if (idTokenResult.claims.disabled) {
          showNotification(translations[currentLang].accountDisabled, 'error');
          auth.signOut();
          showLoginUI();
          window.location.reload();
        } else {
          // Kiểm tra thêm từ Firestore và theo dõi active
          checkAccountStatus(user.uid).then((valid) => {
            if (valid) {
              monitorAccountActiveStatus(user.uid); // Bắt đầu theo dõi active
              showMainUI();
              startAccountStatusCheck(); // Bắt đầu kiểm tra bằng onSnapshot
            } else {
              window.location.reload();
            }
          });
        }
      }).catch((error) => {
        console.error("Lỗi khi kiểm tra token:", error);
        showNotification(translations[currentLang].accountCheckError, 'error');
        auth.signOut();
        showLoginUI();
        window.location.reload();
      });
    } else {
      showLoginUI();
    }
  });

  // Xử lý đăng nhập
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          checkAccountStatus(user.uid).then((valid) => {
            if (valid) {
              monitorAccountActiveStatus(user.uid); // Bắt đầu theo dõi active
              showMainUI();
              startAccountStatusCheck();
            } else {
              window.location.reload();
            }
          });
        })
        .catch((error) => {
          console.error("Lỗi đăng nhập:", error.code, error.message);
          showNotification(translations[currentLang].loginFailed, 'error');
        });
    });
  }

  // Xử lý đăng xuất
  const logoutLink = document.getElementById('logout-link');
  if (logoutLink) {
    logoutLink.addEventListener('click', (e) => {
      e.preventDefault();
      auth.signOut().then(() => {
        showLoginUI();
        showNotification(translations[currentLang].logoutSuccess, 'success');
        hasShownLoginSuccess = false; // Reset cờ khi đăng xuất
        window.location.reload();
      }).catch((error) => {
        console.error('Lỗi khi đăng xuất:', error);
        showNotification('Lỗi khi đăng xuất.', 'error');
      });
    });
  }

  // Hàm escapeHtml
  function escapeHtml(str) {
    try {
      if (typeof str !== 'string') return '';
      const htmlEntities = {
        '&': '&',
        '<': '<',
        '>': '>',
        '"': '"',
        "'": '&apos;'
      };
      return str.replace(/[&<>"']/g, match => htmlEntities[match]);
    } catch (error) {
      console.error('Lỗi trong escapeHtml:', error);
      return str || '';
    }
  }

  function updateLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;

    const elements = {
      appTitle: document.getElementById('app-title'),
      contactText1: document.getElementById('contact-text1'),
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
      importSettings: document.getElementById('import-settings'),
      logoutLink: document.getElementById('logout-link')
    };

    if (elements.appTitle) elements.appTitle.textContent = translations[lang].appTitle;
    if (elements.contactText1) {
      const textNode = Array.from(elements.contactText1.childNodes).find(node => node.nodeType === Node.TEXT_NODE);
      if (textNode) {
        textNode.textContent = translations[lang].contactText1;
      } else {
        console.warn('Không tìm thấy text node cho contactText1, tạo mới');
        elements.contactText1.insertBefore(document.createTextNode(translations[lang].contactText1), elements.contactText1.firstChild);
      }
    }
    if (elements.settingsTab) elements.settingsTab.textContent = translations[lang].settingsTab;
    if (elements.replaceTab) elements.replaceTab.textContent = translations[lang].replaceTab;
    if (elements.splitTab) elements.splitTab.textContent = translations[lang].splitTab;
    if (elements.settingsTitle) elements.settingsTitle.textContent = translations[lang].settingsTitle;
    if (elements.modeLabel) elements.modeLabel.textContent = translations[lang].modeLabel;
    if (elements.addMode) elements.addMode.textContent = translations[lang].addMode;
    if (elements.copyMode) elements.copyMode.textContent = translations[lang].copyMode;
    if (elements.matchCase) elements.matchCase.textContent = matchCaseEnabled ? translations[lang].matchCaseOn : translations[lang].matchCaseOff;
    if (elements.findPlaceholder) elements.findPlaceholder.placeholder = translations[lang].findPlaceholder;
    if (elements.replacePlaceholder) elements.replacePlaceholder.placeholder = translations[lang].replacePlaceholder;
    if (elements.removeButton) elements.removeButton.textContent = translations[lang].removeButton;
    if (elements.addPair) elements.addPair.textContent = translations[lang].addPair;
    if (elements.saveSettings) elements.saveSettings.textContent = translations[lang].saveSettings;
    if (elements.replaceTitle) elements.replaceTitle.textContent = translations[lang].replaceTitle;
    if (elements.inputText) elements.inputText.placeholder = translations[lang].inputText;
    if (elements.replaceButton) elements.replaceButton.textContent = translations[lang].replaceButton;
    if (elements.outputText) elements.outputText.placeholder = translations[lang].outputText;
    if (elements.copyButton) elements.copyButton.textContent = translations[lang].copyButton;
    if (elements.splitTitle) elements.splitTitle.textContent = translations[lang].splitTitle;
    if (elements.splitInputText) elements.splitInputText.placeholder = translations[lang].splitInputText;
    if (elements.splitButton) elements.splitButton.textContent = translations[lang].splitButton;
    if (elements.output1Text) elements.output1Text.placeholder = translations[lang].output1Text;
    if (elements.output2Text) elements.output2Text.placeholder = translations[lang].output2Text;
    if (elements.output3Text) elements.output3Text.placeholder = translations[lang].output3Text;
    if (elements.output4Text) elements.output4Text.placeholder = translations[lang].output4Text;
    if (elements.copyButton1) elements.copyButton1.textContent = translations[lang].copyButton + ' 1';
    if (elements.copyButton2) elements.copyButton2.textContent = translations[lang].copyButton + ' 2';
    if (elements.copyButton3) elements.copyButton3.textContent = translations[lang].copyButton + ' 3';
    if (elements.copyButton4) elements.copyButton4.textContent = translations[lang].copyButton + ' 4';
    if (elements.exportSettings) elements.exportSettings.textContent = translations[lang].exportSettings;
    if (elements.importSettings) elements.importSettings.textContent = translations[lang].importSettings;
    if (elements.logoutLink) elements.logoutLink.textContent = translations[lang].logoutText;

    const punctuationItems = document.querySelectorAll('.punctuation-item');
    punctuationItems.forEach(item => {
      const findInput = item.querySelector('.find');
      const replaceInput = item.querySelector('.replace');
      const removeBtn = item.querySelector('.remove');
      if (findInput) findInput.placeholder = translations[lang].findPlaceholder;
      if (replaceInput) replaceInput.placeholder = translations[lang].replacePlaceholder;
      if (removeBtn) removeBtn.textContent = translations[lang].removeButton;
    });

    const modeSelect = document.getElementById('mode-select');
    if (modeSelect) {
      loadModes();
    } else {
      console.error('Không tìm thấy phần tử mode select');
    }
  }

  function updateModeButtons() {
    const renameMode = document.getElementById('rename-mode');
    const deleteMode = document.getElementById('delete-mode');
    if (currentMode !== 'default' && renameMode && deleteMode) {
      renameMode.style.display = 'inline-block';
      deleteMode.style.display = 'inline-block';
    } else if (renameMode && deleteMode) {
      renameMode.style.display = 'none';
      deleteMode.style.display = 'none';
    }
  }

  function updateButtonStates() {
    const matchCaseButton = document.getElementById('match-case');
    if (matchCaseButton) {
      matchCaseButton.textContent = matchCaseEnabled ? translations[currentLang].matchCaseOn : translations[currentLang].matchCaseOff;
      matchCaseButton.style.background = matchCaseEnabled ? '#28a745' : '#6c757d';
    } else {
      console.error('Không tìm thấy nút Match Case');
    }
  }

  function showNotification(message, type = 'success') {
    const container = document.getElementById('notification-container');
    if (!container) {
      console.error('Không tìm thấy container thông báo');
      return;
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    container.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  }

  function countWords(text) {
    return text.trim() ? text.split(/\s+/).filter(word => word.length > 0).length : 0;
  }

  function updateWordCount(textareaId, counterId) {
    const textarea = document.getElementById(textareaId);
    const counter = document.getElementById(counterId);
    if (textarea && counter) {
      const wordCount = countWords(textarea.value);
      counter.textContent = translations[currentLang].wordCount.replace('{count}', wordCount);
    }
  }

  function loadModes() {
    const modeSelect = document.getElementById('mode-select');
    if (!modeSelect) {
      console.error('Không tìm thấy phần tử mode select');
      return;
    }
    let settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { modes: { default: { pairs: [], matchCase: false } } };
    const modes = Object.keys(settings.modes || { default: {} });

    modeSelect.innerHTML = '';
    modes.forEach(mode => {
      const option = document.createElement('option');
      option.value = mode;
      option.textContent = mode;
      modeSelect.appendChild(option);
    });
    modeSelect.value = currentMode;
    loadSettings();
    updateModeButtons();
  }

  function loadSettings() {
    console.log('Đang tải cài đặt cho chế độ:', currentMode);
    let settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { modes: { default: { pairs: [], matchCase: false } } };
    const modeSettings = settings.modes?.[currentMode] || { pairs: [], matchCase: false };
    const list = document.getElementById('punctuation-list');
    if (list) {
      list.innerHTML = '';
      if (!modeSettings.pairs || modeSettings.pairs.length === 0) {
        addPair('', '');
      } else {
        modeSettings.pairs.slice().reverse().forEach(pair => {
          console.log('Đang tải cặp:', pair);
          addPair(pair.find || '', pair.replace || '');
        });
      }
    } else {
      console.error('Không tìm thấy phần tử punctuation-list');
    }
    matchCaseEnabled = modeSettings.matchCase || false;
    updateButtonStates();
    console.log('Đã cập nhật trạng thái:', { matchCaseEnabled });
  }

  function addPair(find = '', replace = '') {
    const list = document.getElementById('punctuation-list');
    if (!list) {
      console.error('Không tìm thấy phần tử punctuation-list');
      return;
    }

    const item = document.createElement('div');
    item.className = 'punctuation-item';

    const findInput = document.createElement('input');
    findInput.type = 'text';
    findInput.className = 'find';
    findInput.placeholder = translations[currentLang].findPlaceholder;
    findInput.value = find;

    const replaceInput = document.createElement('input');
    replaceInput.type = 'text';
    replaceInput.className = 'replace';
    replaceInput.placeholder = translations[currentLang].replacePlaceholder;
    replaceInput.value = replace;

    const removeButton = document.createElement('button');
    removeButton.className = 'remove';
    removeButton.textContent = translations[currentLang].removeButton;

    item.appendChild(findInput);
    item.appendChild(replaceInput);
    item.appendChild(removeButton);

    if (list.firstChild) {
      list.insertBefore(item, list.firstChild);
    } else {
      list.appendChild(item);
    }

    removeButton.addEventListener('click', () => {
      item.remove();
      console.log('Đã xóa cặp');
    });

    console.log('Đã thêm cặp vào DOM:', { find: findInput.value, replace: replaceInput.value });
  }

  function updateSplitModeUI(mode) {
    currentSplitMode = mode;
    const splitContainer = document.querySelector('.split-container');
    const output3Section = document.getElementById('output3-section');
    const output4Section = document.getElementById('output4-section');
    const splitModeButtons = document.querySelectorAll('.split-mode-button');

    splitContainer.classList.remove('split-2', 'split-3', 'split-4');
    splitContainer.classList.add(`split-${mode}`);

    splitModeButtons.forEach(btn => {
      btn.classList.toggle('active', parseInt(btn.getAttribute('data-split-mode')) === mode);
    });

    output3Section.style.display = mode >= 3 ? 'block' : 'none';
    output4Section.style.display = mode === 4 ? 'block' : 'none';

    ['split-input-text', 'output1-text', 'output2-text', 'output3-text', 'output4-text'].forEach(id => {
      const textarea = document.getElementById(id);
      if (textarea) {
        textarea.value = '';
        const counterId = id === 'split-input-text' ? 'split-input-word-count' : `${id}-word-count`;
        updateWordCount(id, counterId);
      }
    });
    console.log(`Đã reset bộ đếm từ về "Words: 0" cho tất cả các ô khi chuyển sang chế độ Chia ${mode}`);
  }

  function attachButtonEvents() {
    const buttons = {
      facebookLink: document.getElementById('facebook-link'),
      matchCaseButton: document.getElementById('match-case'),
      deleteModeButton: document.getElementById('delete-mode'),
      renameModeButton: document.getElementById('rename-mode'),
      addModeButton: document.getElementById('add-mode'),
      copyModeButton: document.getElementById('copy-mode'),
      modeSelect: document.getElementById('mode-select'),
      addPairButton: document.getElementById('add-pair'),
      saveSettingsButton: document.getElementById('save-settings'),
      replaceButton: document.getElementById('replace-button'),
      copyButton: document.getElementById('copy-button'),
      splitButton: document.getElementById('split-button'),
      copyButton1: document.getElementById('copy-button1'),
      copyButton2: document.getElementById('copy-button2'),
      copyButton3: document.getElementById('copy-button3'),
      copyButton4: document.getElementById('copy-button4'),
      inputText: document.getElementById('input-text'),
      outputText: document.getElementById('output-text'),
      splitInputText: document.getElementById('split-input-text'),
      output1Text: document.getElementById('output1-text'),
      output2Text: document.getElementById('output2-text'),
      output3Text: document.getElementById('output3-text'),
      output4Text: document.getElementById('output4-text'),
      exportSettingsButton: document.getElementById('export-settings'),
      importSettingsButton: document.getElementById('import-settings')
    };

    if (buttons.facebookLink) {
      buttons.facebookLink.addEventListener('click', () => {
        console.log('Đã nhấp vào liên kết Gia hạn tài khoản');
      });
    } else {
      console.error('Không tìm thấy liên kết Gia hạn tài khoản');
    }

    if (buttons.matchCaseButton) {
      buttons.matchCaseButton.addEventListener('click', () => {
        console.log('Đã nhấp vào nút Match Case');
        matchCaseEnabled = !matchCaseEnabled;
        updateButtonStates();
        saveSettings();
      });
    } else {
      console.error('Không tìm thấy nút Match Case');
    }

    if (buttons.deleteModeButton) {
      buttons.deleteModeButton.addEventListener('click', () => {
        console.log('Đã nhấp vào nút Xóa Chế Độ');
        if (currentMode !== 'default') {
          if (confirm(`Bạn có chắc chắn muốn xóa chế độ "${currentMode}"?`)) {
            let settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { modes: { default: { pairs: [], matchCase: false } } };
            if (settings.modes[currentMode]) {
              delete settings.modes[currentMode];
              localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
              currentMode = 'default';
              loadModes();
              showNotification(translations[currentLang].modeDeleted.replace('{mode}', currentMode), 'success');
            }
          }
        }
      });
    } else {
      console.error('Không tìm thấy nút Xóa Chế Độ');
    }

    if (buttons.renameModeButton) {
      buttons.renameModeButton.addEventListener('click', () => {
        console.log('Đã nhấp vào nút Đổi Tên Chế Độ');
        const newName = prompt(translations[currentLang].renamePrompt);
        if (newName && !newName.includes('mode_') && newName.trim() !== '' && newName !== currentMode) {
          let settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { modes: { default: { pairs: [], matchCase: false } } };
          if (settings.modes[currentMode]) {
            settings.modes[newName] = settings.modes[currentMode];
            delete settings.modes[currentMode];
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
            currentMode = newName;
            loadModes();
            showNotification(translations[currentLang].renameSuccess.replace('{mode}', newName), 'success');
          } else {
            showNotification(translations[currentLang].renameError, 'error');
          }
        }
      });
    } else {
      console.error('Không tìm thấy nút Đổi Tên Chế Độ');
    }

    if (buttons.addModeButton) {
      buttons.addModeButton.addEventListener('click', () => {
        console.log('Đã nhấp vào nút Thêm Chế Độ');
        const newMode = prompt(translations[currentLang].newModePrompt);
        if (newMode && !newMode.includes('mode_') && newMode.trim() !== '' && newMode !== 'default') {
          let settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { modes: { default: { pairs: [], matchCase: false } } };
          if (settings.modes[newMode]) {
            showNotification(translations[currentLang].invalidModeName, 'error');
            return;
          }
          settings.modes[newMode] = { pairs: [], matchCase: false };
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
          currentMode = newMode;
          loadModes();
          showNotification(translations[currentLang].modeCreated.replace('{mode}', newMode), 'success');
        } else {
          showNotification(translations[currentLang].invalidModeName, 'error');
        }
      });
    } else {
      console.error('Không tìm thấy nút Thêm Chế Độ');
    }

    if (buttons.copyModeButton) {
      buttons.copyModeButton.addEventListener('click', () => {
        console.log('Đã nhấp vào nút Sao Chép Chế Độ');
        const newMode = prompt(translations[currentLang].newModePrompt);
        if (newMode && !newMode.includes('mode_') && newMode.trim() !== '' && newMode !== 'default') {
          let settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { modes: { default: { pairs: [], matchCase: false } } };
          if (settings.modes[newMode]) {
            showNotification(translations[currentLang].invalidModeName, 'error');
            return;
          }
          settings.modes[newMode] = JSON.parse(JSON.stringify(settings.modes[currentMode] || { pairs: [], matchCase: false }));
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
          currentMode = newMode;
          loadModes();
          showNotification(translations[currentLang].modeCreated.replace('{mode}', newMode), 'success');
        } else {
          showNotification(translations[currentLang].invalidModeName, 'error');
        }
      });
    } else {
      console.error('Không tìm thấy nút Sao Chép Chế Độ');
    }

    if (buttons.modeSelect) {
      buttons.modeSelect.addEventListener('change', (e) => {
        console.log('Chế độ đã thay đổi thành:', e.target.value);
        currentMode = e.target.value;
        loadSettings();
        showNotification(translations[currentLang].switchedMode.replace('{mode}', currentMode), 'success');
        updateModeButtons();
      });
    } else {
      console.error('Không tìm thấy phần tử chọn chế độ');
    }

    if (buttons.addPairButton) {
      buttons.addPairButton.addEventListener('click', () => {
        console.log('Đã nhấp vào nút Thêm Cặp');
        addPair();
      });
    } else {
      console.error('Không tìm thấy nút Thêm Cặp');
    }

    if (buttons.saveSettingsButton) {
      buttons.saveSettingsButton.addEventListener('click', () => {
        console.log('Đã nhấp vào nút Lưu Cài Đặt');
        saveSettings();
      });
    } else {
      console.error('Không tìm thấy nút Lưu Cài Đặt');
    }

    if (buttons.inputText) {
      buttons.inputText.addEventListener('input', () => {
        updateWordCount('input-text', 'input-word-count');
      });
    }

    if (buttons.outputText) {
      buttons.outputText.addEventListener('input', () => {
        updateWordCount('output-text', 'output-word-count');
      });
    }

    ['split-input-text', 'output1-text', 'output2-text', 'output3-text', 'output4-text'].forEach(id => {
      const textarea = document.getElementById(id);
      if (textarea) {
        textarea.addEventListener('input', () => {
          const counterId = id === 'split-input-text' ? 'split-input-word-count' : `${id}-word-count`;
          updateWordCount(id, counterId);
        });
      }
    });

    if (buttons.replaceButton) {
      buttons.replaceButton.addEventListener('click', () => {
        console.log('Đã nhấp vào nút Thay thế');
        const inputTextArea = document.getElementById('input-text');
        if (!inputTextArea || !inputTextArea.value) {
          showNotification(translations[currentLang].noTextToReplace, 'error');
          return;
        }

        let settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { modes: { default: { pairs: [], matchCase: false } } };
        let outputText = inputTextArea.value;
        const modeSettings = settings.modes[currentMode] || { pairs: [], matchCase: false };
        const pairs = modeSettings.pairs || [];
        if (pairs.length === 0) {
          showNotification(translations[currentLang].noPairsConfigured, 'error');
          return;
        }

        const matchCase = modeSettings.matchCase || false;

        pairs.forEach(pair => {
          let find = pair.find;
          let replace = pair.replace !== null ? pair.replace : '';
          if (!find) return;

          let findCore = find;
          let replaceCore = replace;

          const quoteRegex = /^(['"]([^'"]*)\1)$/;
          const findMatch = find.match(quoteRegex);
          if (findMatch) {
            findCore = findMatch[2];
            replaceCore = replace.match(quoteRegex) ? replace.match(quoteRegex)[2] : replace;
          }

          let regexPattern = escapeRegExp(findCore);
          const regexFlags = matchCase ? 'g' : 'gi';
          const regex = new RegExp(regexPattern, regexFlags);

          if (matchCase) {
            outputText = outputText.replace(regex, (match, offset, string) => {
              const isStartOfLine = offset === 0 || string[offset - 1] === '\n';
              const isAfterPeriod = offset > 1 && string.slice(offset - 2, offset).match(/\.\s*/);
              let finalReplaceCore = replaceCore;
              if (isStartOfLine || isAfterPeriod) {
                finalReplaceCore = replaceCore.charAt(0).toUpperCase() + replaceCore.slice(1);
              }
              return finalReplaceCore;
            });
          } else {
            outputText = outputText.replace(regex, replaceCore);
          }
        });

        pairs.forEach(pair => {
          let find = pair.find;
          let replace = pair.replace !== null ? pair.replace : '';
          if (!find) return;

          let regexPattern = escapeRegExp(find);
          const regex = new RegExp(regexPattern, matchCase ? 'g' : 'gi');
          outputText = outputText.replace(regex, replace);
        });

        const paragraphs = outputText.split('\n').filter(p => p.trim());
        outputText = paragraphs.join('\n\n');

        const outputTextArea = document.getElementById('output-text');
        if (outputTextArea) {
          outputTextArea.value = outputText;
          inputTextArea.value = '';
          updateWordCount('input-text', 'input-word-count');
          updateWordCount('output-text', 'output-word-count');
          showNotification(translations[currentLang].textReplaced, 'success');
        } else {
          console.error('Không tìm thấy khu vực văn bản đầu ra');
        }
      });
    } else {
      console.error('Không tìm thấy nút Thay thế');
    }

    if (buttons.copyButton) {
      buttons.copyButton.addEventListener('click', () => {
        console.log('Đã nhấp vào nút Sao chép');
        const outputTextArea = document.getElementById('output-text');
        if (outputTextArea && outputTextArea.value) {
          navigator.clipboard.writeText(outputTextArea.value).then(() => {
            console.log('Đã sao chép văn bản vào clipboard');
            showNotification(translations[currentLang].textCopied, 'success');
          }).catch(err => {
            console.error('Không thể sao chép văn bản: ', err);
            showNotification(translations[currentLang].failedToCopy, 'error');
          });
        } else {
          showNotification(translations[currentLang].noTextToCopy, 'error');
        }
      });
    } else {
      console.error('Không tìm thấy nút Sao chép');
    }

    if (buttons.splitButton) {
      buttons.splitButton.addEventListener('click', () => {
        console.log('Đã nhấp vào nút Chia Chương');
        const inputTextArea = document.getElementById('split-input-text');
        const outputTextAreas = [
          document.getElementById('output1-text'),
          document.getElementById('output2-text'),
          document.getElementById('output3-text'),
          document.getElementById('output4-text')
        ].slice(0, currentSplitMode);
        if (!inputTextArea || !inputTextArea.value) {
          showNotification(translations[currentLang].noTextToSplit, 'error');
          return;
        }

        let text = inputTextArea.value;
        const chapterRegex = /^Chương\s+(\d+)(?:::\s*(.*))?$/m;
        let chapterNum = 1;
        let chapterTitle = '';

        const match = text.match(chapterRegex);
        if (match) {
          chapterNum = parseInt(match[1]);
          chapterTitle = match[2] ? `: ${match[2]}` : '';
          text = text.replace(chapterRegex, '').trim();
        }

        const paragraphs = text.split('\n').filter(p => p.trim());
        const totalWords = countWords(text);
        const wordsPerPart = Math.floor(totalWords / currentSplitMode);

        let parts = [];
        let wordCount = 0;
        let startIndex = 0;

        for (let i = 0; i < paragraphs.length; i++) {
          const wordsInParagraph = countWords(paragraphs[i]);
          wordCount += wordsInParagraph;
          if (parts.length < currentSplitMode - 1 && wordCount >= wordsPerPart * (parts.length + 1)) {
            parts.push(paragraphs.slice(startIndex, i + 1).join('\n\n'));
            startIndex = i + 1;
          }
        }
        parts.push(paragraphs.slice(startIndex).join('\n\n'));

        outputTextAreas.forEach((textarea, index) => {
          if (textarea) {
            textarea.value = `Chương ${chapterNum}.${index + 1}${chapterTitle}\n\n${parts[index] || ''}`;
            updateWordCount(`output${index + 1}-text`, `output${index + 1}-word-count`);
          }
        });

        inputTextArea.value = '';
        updateWordCount('split-input-text', 'split-input-word-count');
        showNotification(translations[currentLang].splitSuccess, 'success');
      });
    } else {
      console.error('Không tìm thấy nút Chia Chương');
    }

    if (buttons.copyButton1) {
      buttons.copyButton1.addEventListener('click', () => {
        console.log('Đã nhấp vào nút Sao chép 1');
        const output1TextArea = document.getElementById('output1-text');
        if (output1TextArea && output1TextArea.value) {
          navigator.clipboard.writeText(output1TextArea.value).then(() => {
            console.log('Đã sao chép văn bản từ output1');
            showNotification(translations[currentLang].textCopied, 'success');
          }).catch(err => {
            console.error('Không thể sao chép văn bản từ output1: ', err);
            showNotification(translations[currentLang].failedToCopy, 'error');
          });
        } else {
          showNotification(translations[currentLang].noTextToCopy, 'error');
        }
      });
    } else {
      console.error('Không tìm thấy nút Sao chép 1');
    }

    if (buttons.copyButton2) {
      buttons.copyButton2.addEventListener('click', () => {
        console.log('Đã nhấp vào nút Sao chép 2');
        const output2TextArea = document.getElementById('output2-text');
        if (output2TextArea && output2TextArea.value) {
          navigator.clipboard.writeText(output2TextArea.value).then(() => {
            console.log('Đã sao chép văn bản từ output2');
            showNotification(translations[currentLang].textCopied, 'success');
          }).catch(err => {
            console.error('Không thể sao chép văn bản từ output2: ', err);
            showNotification(translations[currentLang].failedToCopy, 'error');
          });
        } else {
          showNotification(translations[currentLang].noTextToCopy, 'error');
        }
      });
    } else {
      console.error('Không tìm thấy nút Sao chép 2');
    }

    if (buttons.copyButton3) {
      buttons.copyButton3.addEventListener('click', () => {
        console.log('Đã nhấp vào nút Sao chép 3');
        const output3TextArea = document.getElementById('output3-text');
        if (output3TextArea && output3TextArea.value) {
          navigator.clipboard.writeText(output3TextArea.value).then(() => {
            console.log('Đã sao chép văn bản từ output3');
            showNotification(translations[currentLang].textCopied, 'success');
          }).catch(err => {
            console.error('Không thể sao chép văn bản từ output3: ', err);
            showNotification(translations[currentLang].failedToCopy, 'error');
          });
        } else {
          showNotification(translations[currentLang].noTextToCopy, 'error');
        }
      });
    } else {
      console.error('Không tìm thấy nút Sao chép 3');
    }

    if (buttons.copyButton4) {
      buttons.copyButton4.addEventListener('click', () => {
        console.log('Đã nhấp vào nút Sao chép 4');
        const output4TextArea = document.getElementById('output4-text');
        if (output4TextArea && output4TextArea.value) {
          navigator.clipboard.writeText(output4TextArea.value).then(() => {
            console.log('Đã sao chép văn bản từ output4');
            showNotification(translations[currentLang].textCopied, 'success');
          }).catch(err => {
            console.error('Không thể sao chép văn bản từ output4: ', err);
            showNotification(translations[currentLang].failedToCopy, 'error');
          });
        } else {
          showNotification(translations[currentLang].noTextToCopy, 'error');
        }
      });
    } else {
      console.error('Không tìm thấy nút Sao chép 4');
    }

    if (buttons.exportSettingsButton) {
      buttons.exportSettingsButton.addEventListener('click', () => {
        console.log('Đã nhấp vào nút Xuất Cài Đặt');
        let settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { modes: { default: { pairs: [], matchCase: false } } };
        const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'extension_settings.json';
        a.click();
        URL.revokeObjectURL(url);
        showNotification(translations[currentLang].settingsExported, 'success');
      });
    } else {
      console.error('Không tìm thấy nút Xuất Cài Đặt');
    }

    if (buttons.importSettingsButton) {
      buttons.importSettingsButton.addEventListener('click', () => {
        console.log('Đã nhấp vào nút Nhập Cài Đặt');
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.addEventListener('change', (event) => {
          const file = event.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              try {
                const settings = JSON.parse(e.target.result);
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
                loadModes();
                showNotification(translations[currentLang].settingsImported, 'success');
              } catch (err) {
                console.error('Lỗi khi phân tích JSON:', err);
                showNotification(translations[currentLang].importError, 'error');
              }
            };
            reader.readAsText(file);
          }
        });
        input.click();
      });
    } else {
      console.error('Không tìm thấy nút Nhập Cài Đặt');
    }

    const splitModeButtons = document.querySelectorAll('.split-mode-button');
    splitModeButtons.forEach(button => {
      button.addEventListener('click', () => {
        console.log(`Đã nhấp vào chế độ Chia ${button.getAttribute('data-split-mode')}`);
        updateSplitModeUI(parseInt(button.getAttribute('data-split-mode')));
      });
    });
  }

  function saveSettings() {
    const pairs = [];
    const items = document.querySelectorAll('.punctuation-item');
    if (items.length === 0) {
      showNotification(translations[currentLang].noPairsToSave, 'error');
      return;
    }
    items.forEach(item => {
      const find = item.querySelector('.find')?.value || '';
      const replace = item.querySelector('.replace')?.value || '';
      if (find) pairs.push({ find, replace });
      console.log('Đang lưu cặp:', { find, replace });
    });

    let settings = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { modes: { default: { pairs: [], matchCase: false } } };
    settings.modes[currentMode] = {
      pairs: pairs,
      matchCase: matchCaseEnabled
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settings));
    console.log('Đã lưu cài đặt cho chế độ:', currentMode, settings);
    loadSettings();
    showNotification(translations[currentLang].settingsSaved.replace('{mode}', currentMode), 'success');
  }

  function attachTabEvents() {
    const tabButtons = document.querySelectorAll('.tab-button');
    console.log(`Tìm thấy ${tabButtons.length} nút tab`);
    if (tabButtons.length === 0) {
      console.error('Không tìm thấy nút tab');
      return;
    }

    tabButtons.forEach((button, index) => {
      console.log(`Gắn sự kiện click cho nút tab ${index}: ${button.id}`);
      button.addEventListener('click', () => {
        const tabName = button.getAttribute('data-tab');
        console.log(`Đang cố gắng mở tab: ${tabName}`);

        const tabContents = document.querySelectorAll('.tab-content');
        const allButtons = document.querySelectorAll('.tab-button');
        tabContents.forEach(tab => tab.classList.remove('active'));
        allButtons.forEach(btn => btn.classList.remove('active'));

        const selectedTab = document.getElementById(tabName);
        if (selectedTab) {
          selectedTab.classList.add('active');
          console.log(`Tab ${tabName} đã được hiển thị`);
        } else {
          console.error(`Không tìm thấy tab với ID ${tabName}`);
        }

        button.classList.add('active');
      });
    });
  }

  function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  try {
    updateLanguage('vn');
  } catch (error) {
    console.error('Lỗi trong updateLanguage:', error);
    showNotification('Có lỗi khi cập nhật ngôn ngữ, nhưng ứng dụng vẫn hoạt động!', 'error');
  }

  try {
    loadModes();
  } catch (error) {
    console.error('Lỗi trong loadModes:', error);
    showNotification('Có lỗi khi tải chế độ, nhưng bạn vẫn có thể sử dụng các chức năng khác!', 'error');
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

  updateSplitModeUI(2);
});

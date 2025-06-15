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
      accountDeactivated: 'Tài khoản đã bị vô hiệu hóa.',
      updateAvailable: 'trinhhg.github.io cho biết: Trang đã có phiên bản mới. Bấm "Tải lại" hoặc nhấn F5 để cập nhật.',
      reloadButton: 'Tải lại'
    }
  };

  let currentLang = 'vn';
  let matchCaseEnabled = false;
  let currentMode = 'default';
  let currentSplitMode = 2; // Mặc định là Chia 2
  const LOCAL_STORAGE_KEY = 'local_settings';
  const INPUT_STORAGE_KEY = 'input_state'; // Key để lưu trạng thái input
  let hasShownLoginSuccess = false; // Biến cờ để đảm bảo thông báo đăng nhập thành công chỉ hiển thị một lần
  let currentVersion = null; // Biến lưu phiên bản hiện tại
  let lastActivity = Date.now(); // Thời gian hoạt động cuối cùng

  // Biến để theo dõi thời gian không hoạt động
  const INACTIVITY_LIMIT = 1800000; // 30 phút (1,800,000 ms)
  const CHECK_INTERVAL = 10000; // Kiểm tra mỗi 10s

  // Lưu trạng thái input vào localStorage
  function saveInputState() {
    const state = {
      inputText: document.getElementById('input-text')?.value || '',
      outputText: document.getElementById('output-text')?.value || '',
      splitInputText: document.getElementById('split-input-text')?.value || '',
      output1Text: document.getElementById('output1-text')?.value || '',
      output2Text: document.getElementById('output2-text')?.value || '',
      output3Text: document.getElementById('output3-text')?.value || '',
      output4Text: document.getElementById('output4-text')?.value || '',
      punctuationItems: Array.from(document.querySelectorAll('.punctuation-item')).map(item => ({
        find: item.querySelector('.find')?.value || '',
        replace: item.querySelector('.replace')?.value || ''
      }))
    };
    localStorage.setItem(INPUT_STORAGE_KEY, JSON.stringify(state));
    console.log('Đã lưu trạng thái input vào localStorage');
  }

  // Khôi phục trạng thái input từ localStorage
  function restoreInputState() {
    const state = JSON.parse(localStorage.getItem(INPUT_STORAGE_KEY));
    if (!state) return;

    if (state.inputText && document.getElementById('input-text')) {
      document.getElementById('input-text').value = state.inputText;
      updateWordCount('input-text', 'input-word-count');
    }
    if (state.outputText && document.getElementById('output-text')) {
      document.getElementById('output-text').value = state.outputText;
      updateWordCount('output-text', 'output-word-count');
    }
    if (state.splitInputText && document.getElementById('split-input-text')) {
      document.getElementById('split-input-text').value = state.splitInputText;
      updateWordCount('split-input-text', 'split-input-word-count');
    }
    if (state.output1Text && document.getElementById('output1-text')) {
      document.getElementById('output1-text').value = state.output1Text;
      updateWordCount('output1-text', 'output1-word-count');
    }
    if (state.output2Text && document.getElementById('output2-text')) {
      document.getElementById('output2-text').value = state.output2Text;
      updateWordCount('output2-text', 'output2-word-count');
    }
    if (state.output3Text && document.getElementById('output3-text')) {
      document.getElementById('output3-text').value = state.output3Text;
      updateWordCount('output3-text', 'output3-word-count');
    }
    if (state.output4Text && document.getElementById('output4-text')) {
      document.getElementById('output4-text').value = state.output4Text;
      updateWordCount('output4-text', 'output4-word-count');
    }
    if (state.punctuationItems && state.punctuationItems.length > 0) {
      const list = document.getElementById('punctuation-list');
      if (list) {
        list.innerHTML = '';
        state.punctuationItems.slice().reverse().forEach(pair => {
          addPair(pair.find, pair.replace);
        });
      }
    }
    console.log('Đã khôi phục trạng thái input từ localStorage');
  }

  // Reset thời gian hoạt động
  function resetActivity() {
    lastActivity = Date.now();
    saveInputState(); // Lưu trạng thái input mỗi khi có hoạt động
  }

  // Kiểm tra thời gian không hoạt động
  function checkIdle() {
    const now = Date.now();
    if (now - lastActivity > INACTIVITY_LIMIT && document.visibilityState === 'visible') {
      console.log("🕒 Không hoạt động quá lâu, reload lại trang...");
      saveInputState(); // Lưu trạng thái trước khi reload
      location.replace(location.pathname + '?v=' + Date.now()); // Cache-busting
    }
  }

  // Gắn sự kiện theo dõi hoạt động
  ['mousemove', 'click', 'keydown', 'scroll', 'touchstart'].forEach(event => {
    document.addEventListener(event, resetActivity);
  });

  // Theo dõi trạng thái tab
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      console.log('Tab đã trở lại visible, kiểm tra thời gian không hoạt động');
      checkIdle(); // Kiểm tra ngay khi tab visible
      restoreInputState(); // Khôi phục trạng thái input
    }
  });

  // Kiểm tra định kỳ
  setInterval(checkIdle, CHECK_INTERVAL);

  // Hàm hiển thị giao diện chính
  function showMainUI() {
    document.querySelector(".container").style.display = "block";
    document.querySelector(".login-container").style.display = "none";
    if (!hasShownLoginSuccess) {
      showNotification(translations[currentLang].loginSuccess, 'success');
      hasShownLoginSuccess = true;
    }
    restoreInputState(); // Khôi phục trạng thái input khi hiển thị UI chính
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

  // Hàm xóa màn hình loading
  function hideLoadingUI() {
    const loadingDiv = document.getElementById('loading');
    if (loadingDiv) loadingDiv.remove();
  }

  // Hàm kiểm tra trạng thái tài khoản
  function checkAccountStatus(uid) {
    const userDocRef = db.collection("users").doc(uid);
    return userDocRef.get().then((docSnap) => {
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
    }).catch((error) => {
      console.error("Lỗi khi kiểm tra tài khoản:", error);
      showNotification(translations[currentLang].accountCheckError, 'error');
      auth.signOut();
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
          location.replace(location.pathname + '?v=' + Date.now());
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

  // Hiển thị hộp thoại thông báo cập nhật phiên bản mới
  function showUpdateDialog() {
    // Tạo overlay để làm mờ nền
    const overlay = document.createElement('div');
    overlay.id = 'update-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
    overlay.style.zIndex = '10000';

    // Tạo hộp thoại
    const dialog = document.createElement('div');
    dialog.id = 'update-dialog';
    dialog.style.position = 'fixed';
    dialog.style.top = '50%';
    dialog.style.left = '50%';
    dialog.style.transform = 'translate(-50%, -50%)';
    dialog.style.backgroundColor = '#fff';
    dialog.style.padding = '20px';
    dialog.style.borderRadius = '8px';
    dialog.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
    dialog.style.zIndex = '10001';
    dialog.style.maxWidth = '400px';
    dialog.style.width = '90%';
    dialog.style.textAlign = 'center';

    // Tiêu đề
    const title = document.createElement('h3');
    title.textContent = 'Thông báo từ trinhhg.github.io';
    title.style.margin = '0 0 10px 0';
    dialog.appendChild(title);

    // Nội dung
    const message = document.createElement('p');
    message.textContent = translations[currentLang].updateAvailable;
    message.style.margin = '20px 0';
    dialog.appendChild(message);

    // Nút Tải lại
    const reloadButton = document.createElement('button');
    reloadButton.id = 'reload-btn';
    reloadButton.textContent = translations[currentLang].reloadButton;
    reloadButton.style.padding = '10px 20px';
    reloadButton.style.backgroundColor = '#007bff';
    reloadButton.style.color = '#fff';
    reloadButton.style.border = 'none';
    reloadButton.style.borderRadius = '5px';
    reloadButton.style.cursor = 'pointer';
    reloadButton.style.marginTop = '10px';
    reloadButton.addEventListener('click', () => {
      console.log('Người dùng nhấn Tải lại');
      const userConfirmed = confirm("🔄 Trang đã có phiên bản mới.\nNhấn OK hoặc bấm F5 để tải lại.");
      if (userConfirmed) {
        saveInputState();
        location.replace(location.pathname + '?v=' + Date.now()); // Cache-busting
      }
    });
    dialog.appendChild(reloadButton);

    // Thêm vào body
    document.body.appendChild(overlay);
    document.body.appendChild(dialog);

    // Xử lý khi click ngoài hộp thoại
    overlay.addEventListener('click', () => {
      overlay.remove();
      dialog.remove();
    });
  }

  // Kiểm tra phiên bản mới từ version.json
  async function checkVersionLoop() {
    try {
      const baseURL = 'https://trinhhg.github.io/test';

      // Fetch version.json
      const versionResponse = await fetch(`${baseURL}/version.json?${Date.now()}`, {
        cache: 'no-store'
      });
      if (!versionResponse.ok) throw new Error('Không thể tải version.json');
      const versionData = await versionResponse.json();

      if (!currentVersion) {
        currentVersion = versionData.version;
        console.log("📌 Phiên bản hiện tại: " + currentVersion);
      } else if (versionData.version !== currentVersion) {
        // Delay 6 phút (360,000 ms) trước khi hiển thị hộp thoại
        setTimeout(() => {
          console.log("🆕 Phát hiện phiên bản mới sau 6 phút:", versionData.version);
          showUpdateDialog();
        }, 360000); // 6 phút
        // Không lặp lại kiểm tra sau khi phát hiện phiên bản mới
        return;
      }

      // Lặp lại sau 5s nếu không có cập nhật
      setTimeout(checkVersionLoop, 5000);
    } catch (err) {
      console.error('🚫 Kiểm tra phiên bản thất bại:', err);
      // Tiếp tục lặp lại dù có lỗi
      setTimeout(checkVersionLoop, 5000);
    }
  }

  // Bắt đầu kiểm tra phiên bản
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
        saveInputState();
        location.replace(location.pathname + '?v=' + Date.now());
      } else {
        const userDocRef = db.collection("users").doc(user.uid);
        userDocRef.onSnapshot((doc) => {
          if (!doc.exists) {
            console.log('Tài khoản không tồn tại');
            showNotification(translations[currentLang].noAccountData, 'error');
            auth.signOut();
            showLoginUI();
            saveInputState();
            location.replace(location.pathname + '?v=' + Date.now());
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
            saveInputState();
            location.replace(location.pathname + '?v=' + Date.now());
          } else if (now > expiry) {
            console.log('Tài khoản đã hết hạn');
            showNotification(translations[currentLang].accountExpired, 'error');
            auth.signOut();
            showLoginUI();
            saveInputState();
            location.replace(location.pathname + '?v=' + Date.now());
          }
        }, (error) => {
          console.error('Lỗi khi theo dõi tài liệu Firestore:', error);
          showNotification(translations[currentLang].accountCheckError, 'error');
          auth.signOut();
          showLoginUI();
          saveInputState();
          location.replace(location.pathname + '?v=' + Date.now());
        });
      }
    }).catch((error) => {
      console.error("Lỗi khi kiểm tra token:", error);
      showNotification(translations[currentLang].accountCheckError, 'error');
      auth.signOut();
      showLoginUI();
      saveInputState();
      location.replace(location.pathname + '?v=' + Date.now());
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
          saveInputState();
          location.replace(location.pathname + '?v=' + Date.now());
        } else {
          // Kiểm tra thêm từ Firestore và theo dõi active
          checkAccountStatus(user.uid).then((valid) => {
            if (valid) {
              monitorAccountActiveStatus(user.uid); // Bắt đầu theo dõi active
              showMainUI();
              startAccountStatusCheck(); // Bắt đầu kiểm tra bằng onSnapshot
            } else {
              saveInputState();
              location.replace(location.pathname + '?v=' + Date.now());
            }
          });
        }
      }).catch((error) => {
        console.error("Lỗi khi kiểm tra token:", error);
        showNotification(translations[currentLang].accountCheckError, 'error');
        auth.signOut();
        showLoginUI();
        saveInputState();
        location.replace(location.pathname + '?v=' + Date.now());
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
              saveInputState();
              location.replace(location.pathname + '?v=' + Date.now());
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
        saveInputState();
        location.replace(location.pathname + '?v=' + Date.now());
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
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      };
      return str.replace(/[&<>"']/g, match => htmlEntities[match]);
    } catch (error) {
      console.error('Lỗi trong escapeHtml:', error);
      return str || '';
    }
  }

  // Hàm thay thế văn bản
  function replaceText(inputText, pairs, matchCase) {
    let outputText = inputText;
    
    pairs.forEach(pair => {
      let find = pair.find;
      let replace = pair.replace !== null ? pair.replace : '';
      if (!find) return;

      // Thoát các ký tự đặc biệt trong chuỗi tìm kiếm
      const escapedFind = escapeRegExp(find);
      // Tạo regex, hỗ trợ matchCase, không dùng boundary
      const regexFlags = matchCase ? 'g' : 'gi';
      const regex = new RegExp(escapedFind, regexFlags);

      // Thay thế trực tiếp
      outputText = outputText.replace(regex, replace);
    });

    // Định dạng lại đoạn văn
    const paragraphs = outputText.split('\n').filter(p => p.trim());
    return paragraphs.join('\n\n');
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
      saveInputState();
    });

    // Lưu trạng thái khi input thay đổi
    findInput.addEventListener('input', saveInputState);
    replaceInput.addEventListener('input', saveInputState);

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
    saveInputState();
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
        saveInputState();
      });
    }

    if (buttons.outputText) {
      buttons.outputText.addEventListener('input', () => {
        updateWordCount('output-text', 'output-word-count');
        saveInputState();
      });
    }

    ['split-input-text', 'output1-text', 'output2-text', 'output3-text', 'output4-text'].forEach(id => {
      const textarea = document.getElementById(id);
      if (textarea) {
        textarea.addEventListener('input', () => {
          const counterId = id === 'split-input-text' ? 'split-input-word-count' : `${id}-word-count`;
          updateWordCount(id, counterId);
          saveInputState();
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
        const modeSettings = settings.modes[currentMode] || { pairs: [], matchCase: false };
        const pairs = modeSettings.pairs || [];
        if (pairs.length === 0) {
          showNotification(translations[currentLang].noPairsConfigured, 'error');
          return;
        }

        const outputText = replaceText(inputTextArea.value, pairs, modeSettings.matchCase);

        const outputTextArea = document.getElementById('output-text');
        if (outputTextArea) {
          outputTextArea.value = outputText;
          inputTextArea.value = '';
          updateWordCount('input-text', 'input-word-count');
          updateWordCount('output-text', 'output-word-count');
          showNotification(translations[currentLang].textReplaced, 'success');
          saveInputState();
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
        saveInputState();
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

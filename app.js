const domains = [
  {name: 'Agentic Architecture & Orchestration', path: '1-agentic-architecture', lessons: [
    ['1.1', 'Agentic Loops', '1-1-agentic-loops'],
    ['1.2', 'Multi-Agent Orchestration', '1-2-orchestration-patterns'],
    ['1.3', 'Subagent Invocation and Context Passing', '1-3-subagent-invocation-context'],
    ['1.4', 'Workflow Enforcement and Handoff', '1-4-workflow-enforcement-handoff'],
    ['1.5', 'Agent SDK Hooks', '1-5-agent-sdk-hooks'],
    ['1.6', 'Task Decomposition Strategies', '1-6-task-decomposition'],
    ['1.7', 'Session State and Resumption', '1-7-session-state-resumption']
  ]},
  {name: 'Tool Design & MCP Integration', path: '2-tool-design-mcp', lessons: [
    ['2.1', 'Tool Interface Design', '2-1-tool-schema-design'],
    ['2.2', 'Structured Error Responses', '2-2-structured-error-responses'],
    ['2.3', 'Tool Distribution & Tool Choice', '2-3-tool-distribution-choice'],
    ['2.4', 'MCP Server Integration', '2-4-mcp-server-integration'],
    ['2.5', 'Built-in Tools', '2-5-built-in-tools']
  ]},
  {name: 'Claude Code Configuration & Workflows', path: '3-claude-code-config', lessons: [
    ['3.1', 'CLAUDE.md Hierarchy, Scoping, and Modular Organisation', '3-1-claude-md-hierarchy'],
    ['3.2', 'Custom Slash Commands and Skills', '3-2-slash-commands-skills'],
    ['3.3', 'Path-Specific Rules for Conditional Convention Loading', '3-3-path-specific-rules'],
    ['3.4', 'Plan Mode vs Direct Execution', '3-4-plan-mode-execution'],
    ['3.5', 'Iterative Refinement Techniques', '3-5-iterative-refinement'],
    ['3.6', 'CI/CD Integration', '3-6-cicd-integration']
  ]},
  {name: 'Prompt Engineering & Structured Output', path: '4-prompt-engineering', lessons: [
    ['4.1', 'System Prompts with Explicit Criteria', '4-1-system-prompts'],
    ['4.2', 'Few-Shot Prompting', '4-2-few-shot-prompting'],
    ['4.3', 'Structured Output with Tool Use', '4-3-structured-output'],
    ['4.4', 'Validation, Retry, and Feedback Loops', '4-4-validation-retry-loops'],
    ['4.5', 'Batch Processing Strategies', '4-5-batch-processing'],
    ['4.6', 'Multi-Instance and Multi-Pass Review', '4-6-multi-pass-review']
  ]},
  {name: 'Context Management & Reliability', path: '5-context-management', lessons: [
    ['5.1', 'Context Window Management', '5-1-context-window-management'],
    ['5.2', 'Escalation & Ambiguity Resolution', '5-2-escalation-ambiguity'],
    ['5.3', 'Error Propagation in Multi-Agent Systems', '5-3-error-propagation'],
    ['5.4', 'Codebase Exploration & Context Degradation', '5-4-codebase-exploration'],
    ['5.5', 'Human Review & Confidence Calibration', '5-5-human-review-calibration'],
    ['5.6', 'Information Provenance & Multi-Source Synthesis', '5-6-information-provenance']
  ]}
];

const STORAGE_KEY = 'ccar-f-plan-completed-v1';
const total = domains.reduce((count, domain) => count + domain.lessons.length, 0);
let completed;
try {
  completed = new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
} catch {
  completed = new Set();
}

const list = document.getElementById('domains');
const progress = document.getElementById('progress');
const progressLabel = document.getElementById('progress-label');
const progressPercent = document.getElementById('progress-percent');
const networkStatus = document.getElementById('network-status');
const statusDot = document.getElementById('status-dot');
const updateStatus = document.getElementById('update-status');
const downloadButton = document.getElementById('download-lessons');
const downloadStatus = document.getElementById('download-status');
const permissionConfirmed = document.getElementById('permission-confirmed');
const reader = document.getElementById('reader');
const readerTitle = document.getElementById('reader-title');
const readerBody = document.getElementById('reader-body');
const offlineButtons = new Map();
let savedCount = 0;
let isDownloading = false;

function updateProgress() {
  progress.max = total;
  progress.value = completed.size;
  progressLabel.textContent = `${completed.size} / ${total} tamamlandı`;
  progressPercent.textContent = `%${Math.round(completed.size / total * 100)}`;
  for (const section of list.querySelectorAll('.domain')) {
    const count = section.querySelectorAll('input:checked').length;
    section.querySelector('.count').textContent = `${count} / ${section.querySelectorAll('input').length}`;
  }
}

function updateConnection() {
  networkStatus.textContent = navigator.onLine ? 'Çevrimiçi' : 'Çevrimdışı';
  statusDot.classList.toggle('online', navigator.onLine);
}

for (const domain of domains) {
  const section = document.createElement('section');
  section.className = 'domain';
  const heading = document.createElement('h2');
  heading.textContent = domain.name;
  const count = document.createElement('span');
  count.className = 'count';
  heading.append(count);
  section.append(heading);
  const lessons = document.createElement('ul');
  lessons.className = 'lessons';

  for (const [number, title, slug] of domain.lessons) {
    const item = document.createElement('li');
    item.className = 'lesson';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `lesson-${number}`;
    checkbox.checked = completed.has(number);
    checkbox.setAttribute('aria-label', `${number} ${title} tamamlandı`);
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) completed.add(number);
      else completed.delete(number);
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed])); }
      catch { updateStatus.textContent = 'İlerleme bu cihazda kaydedilemedi.'; }
      updateProgress();
    });
    const link = document.createElement('a');
    link.href = `https://claudecertificationguide.com/learn/${domain.path}/${slug}`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = `${number}  ${title}`;
    link.addEventListener('click', event => {
      if (!navigator.onLine) {
        event.preventDefault();
        updateStatus.textContent = 'Dersi açmak için internete bağlanın.';
      }
    });
    const external = document.createElement('span');
    external.className = 'external';
    external.textContent = 'Kaynak sitede aç ↗';
    const offlineButton = document.createElement('button');
    offlineButton.className = 'offline-read';
    offlineButton.type = 'button';
    offlineButton.textContent = 'Çevrimdışı oku';
    offlineButton.hidden = true;
    offlineButton.addEventListener('click', async () => {
      try {
        const lesson = await getSavedLesson(number);
        if (!lesson) return;
        readerTitle.textContent = `${number} ${title}`;
        readerBody.innerHTML = lesson.html;
        reader.showModal();
      } catch {
        downloadStatus.textContent = 'Kaydedilen ders açılamadı.';
      }
    });
    offlineButtons.set(number, offlineButton);
    item.append(checkbox, link, external, offlineButton);
    lessons.append(item);
  }
  section.append(lessons);
  list.append(section);
}

updateProgress();
updateConnection();
window.addEventListener('online', updateConnection);
window.addEventListener('offline', updateConnection);
document.getElementById('close-reader').addEventListener('click', () => reader.close());

function openLessonDatabase() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('ccar-f-personal-lessons', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('lessons', {keyPath: 'number'});
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

const database = openLessonDatabase();

function readStore(action) {
  return database.then(db => new Promise((resolve, reject) => {
    const transaction = db.transaction('lessons', action === 'put' ? 'readwrite' : 'readonly');
    const store = transaction.objectStore('lessons');
    const request = action === 'keys' ? store.getAllKeys() : store.get(action);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  }));
}

function getSavedLesson(number) {
  return readStore(number);
}

function saveLesson(lesson) {
  return database.then(db => new Promise((resolve, reject) => {
    const transaction = db.transaction('lessons', 'readwrite');
    transaction.objectStore('lessons').put(lesson);
    transaction.oncomplete = resolve;
    transaction.onerror = () => reject(transaction.error);
  }));
}

async function refreshSavedLessons() {
  const keys = await readStore('keys');
  savedCount = keys.length;
  for (const [number, button] of offlineButtons) button.hidden = !keys.includes(number);
  downloadStatus.textContent = `Bu cihazda ${savedCount} / ${total} ders var.`;
}

const allowedTags = new Set(['P', 'H2', 'H3', 'H4', 'H5', 'H6', 'UL', 'OL', 'LI', 'PRE', 'CODE', 'BLOCKQUOTE', 'STRONG', 'EM', 'B', 'I', 'A', 'BR', 'TABLE', 'THEAD', 'TBODY', 'TR', 'TH', 'TD', 'HR', 'DIV', 'SPAN', 'SECTION', 'FIGURE', 'FIGCAPTION']);
const discardedTags = new Set(['SCRIPT', 'STYLE', 'SVG', 'BUTTON', 'INPUT', 'FORM', 'IFRAME', 'NOSCRIPT', 'TEMPLATE']);

function safeCopy(source, targetDocument, baseUrl) {
  if (source.nodeType === Node.TEXT_NODE) return targetDocument.createTextNode(source.nodeValue);
  if (source.nodeType !== Node.ELEMENT_NODE || discardedTags.has(source.tagName)) return null;
  if (source.tagName === 'IMG') {
    const alt = source.getAttribute('alt');
    if (!alt) return null;
    const caption = targetDocument.createElement('p');
    caption.textContent = `Görsel: ${alt}`;
    return caption;
  }
  const copy = allowedTags.has(source.tagName) ? targetDocument.createElement(source.tagName.toLowerCase()) : targetDocument.createDocumentFragment();
  if (source.tagName === 'A') {
    try {
      const url = new URL(source.getAttribute('href'), baseUrl);
      if (url.protocol === 'https:') {
        copy.href = url.href;
        copy.target = '_blank';
        copy.rel = 'noopener noreferrer';
      }
    } catch {}
  }
  for (const child of source.childNodes) {
    const safeChild = safeCopy(child, targetDocument, baseUrl);
    if (safeChild) copy.append(safeChild);
  }
  return copy;
}

function extractLesson(html, url) {
  const source = new DOMParser().parseFromString(html, 'text/html');
  const article = source.querySelector('article');
  if (!article || article.textContent.trim().length < 300) throw new Error('Ders metni bulunamadı.');
  const safeDocument = document.implementation.createHTMLDocument('');
  const container = safeDocument.createElement('div');
  for (const child of article.childNodes) {
    const safeChild = safeCopy(child, safeDocument, url);
    if (safeChild) container.append(safeChild);
  }
  return container.innerHTML;
}

permissionConfirmed.addEventListener('change', () => {
  downloadButton.disabled = isDownloading || !permissionConfirmed.checked;
});

downloadButton.addEventListener('click', async () => {
  if (!permissionConfirmed.checked || isDownloading) return;
  isDownloading = true;
  downloadButton.disabled = true;
  let downloaded = 0;
  try {
    const refreshAll = savedCount === total;
    for (const domain of domains) {
      for (const [number, title, slug] of domain.lessons) {
        if (!refreshAll && await getSavedLesson(number)) {
          downloaded++;
          continue;
        }
        const url = `https://claudecertificationguide.com/learn/${domain.path}/${slug}`;
        downloadStatus.textContent = `İndiriliyor: ${downloaded + 1} / ${total} — ${number} ${title}`;
        const response = await fetch(url, {mode: 'cors', credentials: 'omit', cache: 'no-store'});
        if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) throw new Error(`${number} indirilemedi.`);
        const html = extractLesson(await response.text(), url);
        await saveLesson({number, title, url, html, savedAt: Date.now()});
        offlineButtons.get(number).hidden = false;
        downloaded++;
      }
    }
    await refreshSavedLessons();
    downloadStatus.textContent = `${total} ders bu cihaza indirildi. Artık çevrimdışı okuyabilirsiniz.`;
  } catch (error) {
    await refreshSavedLessons();
    downloadStatus.textContent = `İndirme durdu (${savedCount} / ${total} kayıtlı). ${error.message} Tekrar deneyebilirsiniz.`;
  } finally {
    isDownloading = false;
    downloadButton.disabled = !permissionConfirmed.checked;
  }
});

refreshSavedLessons().catch(() => {
  permissionConfirmed.disabled = true;
  downloadButton.disabled = true;
  downloadStatus.textContent = 'Bu tarayıcı dersleri cihazda saklayamıyor.';
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js').then(registration => {
    updateStatus.textContent = 'Çalışma planı çevrimdışı kullanıma hazır.';
    if (registration.waiting) updateStatus.textContent = 'Yeni sürüm hazır. Güncellemeleri denetle düğmesine dokunun.';
    registration.addEventListener('updatefound', () => {
      const worker = registration.installing;
      worker?.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) {
          updateStatus.textContent = 'Yeni sürüm hazır. Güncellemeleri denetle düğmesine dokunun.';
        }
      });
    });
    document.getElementById('check-updates').addEventListener('click', async () => {
      updateStatus.textContent = 'Güncellemeler denetleniyor…';
      try {
        await registration.update();
        if (registration.waiting) registration.waiting.postMessage('SKIP_WAITING');
        else updateStatus.textContent = 'En güncel sürüm yüklü.';
      } catch {
        updateStatus.textContent = 'Güncelleme denetlenemedi. Bağlantınızı kontrol edin.';
      }
    });
  }).catch(() => { updateStatus.textContent = 'Çevrimdışı kurulum başarısız oldu.'; });
  navigator.serviceWorker.addEventListener('controllerchange', () => window.location.reload());
} else {
  updateStatus.textContent = 'Bu tarayıcı çevrimdışı uygulamaları desteklemiyor.';
}

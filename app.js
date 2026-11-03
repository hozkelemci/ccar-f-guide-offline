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
    item.append(checkbox, link, external);
    lessons.append(item);
  }
  section.append(lessons);
  list.append(section);
}

updateProgress();
updateConnection();
window.addEventListener('online', updateConnection);
window.addEventListener('offline', updateConnection);

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

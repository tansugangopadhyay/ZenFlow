// Global state
let allWorkflows = [];
let filteredWorkflows = [];
let currentPage = 1;
const itemsPerPage = 150;
window.appInitialized = false;

// DOM Elements
const elements = {};

// Initialize the application - called from HTML when ready
function initializeApp() {
    if (window.appInitialized) return;
    
    console.log('🚀 Starting n8n Workflows Collection...');
    window.appInitialized = true;
    
    try {
        initializeElements();
        initializeParticles();
        generateWorkflowData();
        setupEventListeners();
        setupFilters();
        displayWorkflows();
        console.log('✅ Application initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing application:', error);
    }
}

// Make initializeApp globally available
window.initializeApp = initializeApp;

// Initialize DOM elements
function initializeElements() {
    elements.searchInput = document.getElementById('searchInput');
    elements.categoryFilter = document.getElementById('categoryFilter');
    elements.triggerFilter = document.getElementById('triggerFilter');
    elements.tansuFilter = document.getElementById('tansuFilter');
    elements.statusFilter = document.getElementById('statusFilter');
    elements.clearFilters = document.getElementById('clearFilters');
    elements.resultsCount = document.getElementById('resultsCount');
    elements.workflowsGrid = document.getElementById('workflowsGrid');
    elements.loadingState = document.getElementById('loadingState');
    elements.noResults = document.getElementById('noResults');
    elements.copySuccessModal = document.getElementById('copySuccessModal');
    
    const foundElements = Object.keys(elements).filter(key => elements[key] !== null).length;
    console.log(`📋 Found ${foundElements}/${Object.keys(elements).length} DOM elements`);
}

// Initialize Particle.js background
function initializeParticles() {
    if (typeof particlesJS === 'undefined') {
        console.warn('⚠️ Particles.js not available, skipping particle initialization');
        return;
    }

    try {
        particlesJS('particles-js', {
            particles: {
                number: { value: 60, density: { enable: true, value_area: 800 } },
                color: { value: '#32b8c6' },
                shape: { type: 'circle' },
                opacity: { value: 0.3, random: false },
                size: { value: 3, random: true },
                line_linked: {
                    enable: true,
                    distance: 150,
                    color: '#32b8c6',
                    opacity: 0.2,
                    width: 1
                },
                move: {
                    enable: true,
                    speed: 1.5,
                    direction: 'none',
                    random: false,
                    straight: false,
                    out_mode: 'out',
                    bounce: false
                }
            },
            interactivity: {
                detect_on: 'canvas',
                events: {
                    onhover: { enable: true, mode: 'grab' },
                    onclick: { enable: true, mode: 'push' },
                    resize: true
                },
                modes: {
                    grab: { distance: 140, line_linked: { opacity: 0.5 } },
                    push: { particles_nb: 4 }
                }
            },
            retina_detect: true
        });
        console.log('✨ Particles.js initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing particles:', error);
    }
}

// Generate comprehensive workflow data immediately
function generateWorkflowData() {
    console.log('📝 Generating workflow data...');
    
    const categories = [
        'CRM', 'Marketing', 'Sales', 'Analytics', 'Social Media', 'E-commerce', 
        'HR', 'Finance', 'Communication', 'Data Processing', 'Automation', 
        'Integration', 'Webhook', 'API', 'Email', 'Database', 'File Processing', 
        'Notifications', 'Reporting', 'Security'
    ];
    
    const triggerTypes = ['Webhook', 'Scheduled', 'Manual', 'Triggered'];
    
    const integrations = [
        'Slack', 'Gmail', 'Salesforce', 'HubSpot', 'Shopify', 'Discord', 'Notion', 
        'Airtable', 'Google Sheets', 'Zendesk', 'Trello', 'Asana', 'MailChimp', 
        'Stripe', 'PayPal', 'Zoom', 'Microsoft Teams', 'Dropbox', 'OneDrive', 'LinkedIn'
    ];
    
    const workflowTemplates = [
        'Customer Onboarding Automation', 'Lead Qualification System', 'Invoice Processing Workflow',
        'Social Media Content Publishing', 'Data Backup & Sync', 'Weekly Report Generator',
        'Email Campaign Automation', 'Inventory Management Sync', 'Support Ticket Router',
        'User Registration Handler', 'Payment Processing Pipeline', 'Content Approval Flow',
        'Task Assignment Bot', 'Meeting Scheduler', 'Survey Response Collector',
        'File Organization System', 'Database Synchronization', 'Real-time Notifications',
        'Order Processing Automation', 'Analytics Dashboard Updater'
    ];
    
    // Generate all 2053 workflows
    for (let i = 1; i <= 2053; i++) {
        const madeByTansu = i <= 70; // First 70 are made by Tansu
        const template = workflowTemplates[Math.floor(Math.random() * workflowTemplates.length)];
        const category = categories[Math.floor(Math.random() * categories.length)];
        const triggerType = triggerTypes[Math.floor(Math.random() * triggerTypes.length)];
        
        // Select 1-4 random integrations
        const selectedIntegrations = [];
        const integrationCount = Math.floor(Math.random() * 4) + 1;
        const shuffledIntegrations = [...integrations].sort(() => 0.5 - Math.random());
        for (let j = 0; j < integrationCount; j++) {
            selectedIntegrations.push(shuffledIntegrations[j]);
        }
        
        const workflow = {
            id: i,
            filename: `${String(i).padStart(4, '0')}_${template.replace(/\s+/g, '_')}.json`,
            name: `${template} - ${category}`,
            description: `Professional ${category.toLowerCase()} automation workflow for ${template.toLowerCase()}`,
            category: category,
            trigger_type: triggerType,
            node_count: Math.floor(Math.random() * 12) + 3, // 3-14 nodes
            integrations: selectedIntegrations,
            active: Math.random() > 0.25, // 75% active
            made_by_tansu: madeByTansu,
            json_content: generateWorkflowJSON(template, category, triggerType)
        };
        
        allWorkflows.push(workflow);
    }
    
    // Sort so Tansu workflows appear first by default
    allWorkflows.sort((a, b) => {
        if (a.made_by_tansu && !b.made_by_tansu) return -1;
        if (!a.made_by_tansu && b.made_by_tansu) return 1;
        return 0;
    });
    
    filteredWorkflows = [...allWorkflows];
    console.log(`✅ Generated ${allWorkflows.length} workflows (${allWorkflows.filter(w => w.made_by_tansu).length} by Tansu)`);
}

// Generate realistic workflow JSON
function generateWorkflowJSON(name, category, triggerType) {
    const webhookPath = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const nodeId1 = `node-${Math.random().toString(36).substr(2, 9)}`;
    const nodeId2 = `node-${Math.random().toString(36).substr(2, 9)}`;
    const nodeId3 = `node-${Math.random().toString(36).substr(2, 9)}`;
    
    const triggerNode = triggerType === 'Webhook' ? {
        name: "Webhook",
        type: "n8n-nodes-base.webhook",
        position: [240, 300],
        parameters: {
            path: webhookPath,
            options: {}
        },
        id: nodeId1,
        typeVersion: 1
    } : {
        name: "Schedule Trigger",
        type: "n8n-nodes-base.scheduleTrigger", 
        position: [240, 300],
        parameters: {
            rule: {
                interval: [{ field: "hours", value: 24 }]
            }
        },
        id: nodeId1,
        typeVersion: 1
    };
    
    return {
        id: Math.floor(Math.random() * 100000).toString(),
        name: name,
        nodes: [
            triggerNode,
            {
                name: `${category} Processor`,
                type: "n8n-nodes-base.code",
                position: [460, 300],
                parameters: {
                    jsCode: `// ${category} processing logic\nconst results = [];\n\nfor (const item of items) {\n  const processed = {\n    ...item.json,\n    category: "${category}",\n    processedAt: new Date().toISOString(),\n    status: "processed"\n  };\n  \n  results.push({ json: processed });\n}\n\nreturn results;`
                },
                id: nodeId2,
                typeVersion: 1
            },
            {
                name: "Output Handler",
                type: "n8n-nodes-base.noOp",
                position: [680, 300], 
                parameters: {},
                id: nodeId3,
                typeVersion: 1
            }
        ],
        active: Math.random() > 0.3,
        settings: {
            timezone: "America/New_York",
            saveManualExecutions: true,
            callerPolicy: "workflowsFromSameOwner"
        },
        connections: {
            [nodeId1]: {
                main: [[{ node: nodeId2, type: "main", index: 0 }]]
            },
            [nodeId2]: {
                main: [[{ node: nodeId3, type: "main", index: 0 }]]
            }
        },
        staticData: {},
        meta: {
            instanceId: `instance-${Math.random().toString(36).substr(2, 9)}`
        },
        pinData: {},
        versionId: `v${Math.floor(Math.random() * 20) + 1}`
    };
}

// Setup event listeners
function setupEventListeners() {
    console.log('🎛️ Setting up event listeners...');
    
    // Search functionality with debouncing
    let searchTimeout;
    if (elements.searchInput) {
        elements.searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                filterWorkflows();
            }, 300);
        });
        console.log('✅ Search input listener added');
    }

    // Filter dropdowns
    ['categoryFilter', 'triggerFilter', 'tansuFilter', 'statusFilter'].forEach(filterId => {
        if (elements[filterId]) {
            elements[filterId].addEventListener('change', filterWorkflows);
            console.log(`✅ ${filterId} listener added`);
        }
    });

    // Clear filters button
    if (elements.clearFilters) {
        elements.clearFilters.addEventListener('click', clearAllFilters);
        console.log('✅ Clear filters button listener added');
    }
}

// Setup filter dropdowns
function setupFilters() {
    console.log('🔧 Setting up filter options...');
    
    // Categories are already in HTML, but let's update the stats
    const uniqueCategories = [...new Set(allWorkflows.map(w => w.category))].length;
    const totalCategoriesElement = document.getElementById('totalCategories');
    if (totalCategoriesElement) {
        totalCategoriesElement.textContent = uniqueCategories.toString();
    }
    
    console.log(`📊 Found ${uniqueCategories} unique categories`);
}

// Filter workflows based on current settings
function filterWorkflows() {
    const searchTerm = elements.searchInput?.value.toLowerCase().trim() || '';
    const categoryFilter = elements.categoryFilter?.value || '';
    const triggerFilter = elements.triggerFilter?.value || '';
    const tansuFilter = elements.tansuFilter?.value || '';
    const statusFilter = elements.statusFilter?.value || '';
    
    console.log('🔍 Filtering with:', { searchTerm, categoryFilter, triggerFilter, tansuFilter, statusFilter });
    
    filteredWorkflows = allWorkflows.filter(workflow => {
        const matchesSearch = !searchTerm || 
            workflow.name.toLowerCase().includes(searchTerm) ||
            workflow.description.toLowerCase().includes(searchTerm) ||
            workflow.category.toLowerCase().includes(searchTerm);
        
        const matchesCategory = !categoryFilter || workflow.category === categoryFilter;
        const matchesTrigger = !triggerFilter || workflow.trigger_type === triggerFilter;
        const matchesTansu = !tansuFilter || 
            (tansuFilter === 'tansu' && workflow.made_by_tansu) ||
            (tansuFilter === 'community' && !workflow.made_by_tansu);
        const matchesStatus = !statusFilter ||
            (statusFilter === 'active' && workflow.active) ||
            (statusFilter === 'inactive' && !workflow.active);
        
        return matchesSearch && matchesCategory && matchesTrigger && matchesTansu && matchesStatus;
    });
    
    console.log(`📋 Filtered to ${filteredWorkflows.length} workflows`);
    updateResultsCount();
    currentPage = 1;
    displayWorkflows();
}

// Clear all filters
function clearAllFilters() {
    console.log('🧹 Clearing all filters...');
    
    if (elements.searchInput) elements.searchInput.value = '';
    if (elements.categoryFilter) elements.categoryFilter.value = '';
    if (elements.triggerFilter) elements.triggerFilter.value = '';
    if (elements.tansuFilter) elements.tansuFilter.value = '';
    if (elements.statusFilter) elements.statusFilter.value = '';
    
    filterWorkflows();
}

// Update results count
function updateResultsCount() {
    if (!elements.resultsCount) return;
    
    const count = filteredWorkflows.length;
    const total = allWorkflows.length;
    elements.resultsCount.textContent = `Showing ${count.toLocaleString()} of ${total.toLocaleString()} workflows`;
}

// Display workflows in grid
function displayWorkflows() {
    console.log('🎨 Displaying workflows...');
    
    if (!elements.workflowsGrid) return;
    
    elements.loadingState.style.display = 'none';
    
    if (filteredWorkflows.length === 0) {
        elements.workflowsGrid.style.display = 'none';
        if (elements.noResults) elements.noResults.style.display = 'block';
        return;
    }
    
    if (elements.noResults) elements.noResults.style.display = 'none';
    elements.workflowsGrid.style.display = 'grid';
    
    // Show first batch of workflows
    const workflowsToShow = filteredWorkflows.slice(0, currentPage * itemsPerPage);
    elements.workflowsGrid.innerHTML = '';
    
    workflowsToShow.forEach((workflow, index) => {
        const card = createWorkflowCard(workflow);
        card.style.animationDelay = `${(index % 6) * 0.1}s`;
        elements.workflowsGrid.appendChild(card);
    });
    
    console.log(`✅ Displayed ${workflowsToShow.length} workflow cards`);
}

// Create individual workflow card
function createWorkflowCard(workflow) {
    const card = document.createElement('div');
    card.className = `workflow-card${workflow.made_by_tansu ? ' tansu' : ''}`;
    
    const statusClass = workflow.active ? 'status--success' : 'status--error';
    const statusText = workflow.active ? 'Active' : 'Inactive';
    
    card.innerHTML = `
        <div class="card-inner">
            <div class="card-front">
                ${workflow.made_by_tansu ? '<div class="tansu-badge">Made by Tansu</div>' : ''}
                <div class="workflow-name">${escapeHtml(workflow.name)}</div>
                <div class="workflow-info">
                    <div class="info-item">
                        <span class="info-label">Category:</span>
                        <span class="info-value">${escapeHtml(workflow.category)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Trigger:</span>
                        <span class="trigger-badge">${escapeHtml(workflow.trigger_type)}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Nodes:</span>
                        <span class="info-value">${workflow.node_count}</span>
                    </div>
                    <div class="info-item">
                        <span class="info-label">Status:</span>
                        <span class="info-value">
                            <span class="status ${statusClass}">${statusText}</span>
                        </span>
                    </div>
                </div>
                <div class="integrations-list">
                    ${workflow.integrations.map(integration => 
                        `<span class="integration-tag">${escapeHtml(integration)}</span>`
                    ).join('')}
                </div>
            </div>
            <div class="card-back">
                <div class="json-container">
                    <div class="json-content">${formatJSON(workflow.json_content)}</div>
                </div>
                <button class="copy-button" onclick="copyToClipboard(${workflow.id})">
                    Copy JSON
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// Format JSON for display
function formatJSON(jsonContent) {
    try {
        return escapeHtml(JSON.stringify(jsonContent, null, 2));
    } catch (error) {
        return escapeHtml('Error formatting JSON content');
    }
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Copy JSON to clipboard
async function copyToClipboard(workflowId) {
    console.log('📋 Copying workflow to clipboard:', workflowId);
    
    const workflow = allWorkflows.find(w => w.id === workflowId);
    if (!workflow) return;
    
    try {
        const jsonString = JSON.stringify(workflow.json_content, null, 2);
        
        if (navigator.clipboard && window.isSecureContext) {
            await navigator.clipboard.writeText(jsonString);
        } else {
            // Fallback method
            const textArea = document.createElement('textarea');
            textArea.value = jsonString;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            document.execCommand('copy');
            textArea.remove();
        }
        
        showCopySuccess();
        console.log('✅ Successfully copied to clipboard');
    } catch (error) {
        console.error('❌ Failed to copy:', error);
        showCopyError();
    }
}

// Show copy success feedback
function showCopySuccess() {
    if (!elements.copySuccessModal) return;
    
    elements.copySuccessModal.innerHTML = `
        <div class="success-content">
            <div class="success-icon">✓</div>
            <span>Copied to clipboard!</span>
        </div>
    `;
    elements.copySuccessModal.classList.add('show');
    setTimeout(() => {
        elements.copySuccessModal.classList.remove('show');
    }, 3000);
}

// Show copy error feedback  
function showCopyError() {
    if (!elements.copySuccessModal) return;
    
    elements.copySuccessModal.innerHTML = `
        <div class="success-content">
            <div class="success-icon" style="background: #EF4444;">✗</div>
            <span>Copy failed. Please try again.</span>
        </div>
    `;
    elements.copySuccessModal.classList.add('show');
    setTimeout(() => {
        elements.copySuccessModal.classList.remove('show');
    }, 3000);
}

// Make functions globally available
window.copyToClipboard = copyToClipboard;

console.log('📦 n8n Workflows Collection script loaded');
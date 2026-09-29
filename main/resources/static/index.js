/**
 * CropAdvisor — Complete Frontend JavaScript Engine
 * Handles REST API integration with Spring Boot Backend, SPA Navigation,
 * Data Rendering, Dynamic Filtering, Modals, and Toast Notifications.
 */

// Global Application Namespace
const app = {
    // API Base Endpoints (Relative paths matching Spring Boot Controllers)
    endpoints: {
        region: '/Region',
        farmer: '/farmer',
        officer: '/officer',
        ticket: '/ticket',
        photo: '/photo'
    },

    // Centralized Application State
    state: {
        regions: [],
        farmers: [],
        officers: [],
        tickets: [],
        photos: [],
        activeTab: 'sec-dashboard',
        ticketFilter: '',
        currentTicketModalId: null
    },

    /**
     * Application Initialization
     */
    init: function () {
        console.log("Initializing CropAdvisor Platform...");
        this.bindEvents();
        this.startClock();
        this.fetchAllData();
    },

    /**
     * Start Header Live Clock
     */
    startClock: function () {
        const clockEl = document.getElementById('liveClock');
        const updateClock = () => {
            const now = new Date();
            if (clockEl) {
                clockEl.textContent = now.toLocaleTimeString('en-US', { hour12: false });
            }
        };
        updateClock();
        setInterval(updateClock, 1000);
    },

    /**
     * Bind UI Event Listeners
     */
    bindEvents: function () {
        // Navigation Tab Switching
        document.querySelectorAll('.nav-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabId = btn.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });

        // Mobile Sidebar Toggle
        const mobileBtn = document.getElementById('mobileMenuBtn');
        const sidebar = document.getElementById('appSidebar');
        if (mobileBtn && sidebar) {
            mobileBtn.addEventListener('click', () => {
                sidebar.classList.toggle('mobile-open');
            });
        }

        // Global Refresh Button
        const refreshBtn = document.getElementById('globalRefreshBtn');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.fetchAllData(true);
            });
        }

        // Form Submissions
        document.getElementById('regionForm')?.addEventListener('submit', (e) => this.handleRegionSubmit(e));
        document.getElementById('farmerForm')?.addEventListener('submit', (e) => this.handleFarmerSubmit(e));
        document.getElementById('officerForm')?.addEventListener('submit', (e) => this.handleOfficerSubmit(e));
        document.getElementById('newTicketForm')?.addEventListener('submit', (e) => this.handleTicketSubmit(e));
        document.getElementById('photoForm')?.addEventListener('submit', (e) => this.handlePhotoSubmit(e));
        document.getElementById('ticketAdvisoryForm')?.addEventListener('submit', (e) => this.handleAdvisorySubmit(e));

        // Farmer select change on ticket form -> filter officers by region
        document.getElementById('ticketFarmerSelect')?.addEventListener('change', (e) => {
            this.handleTicketFarmerChange(e.target.value);
        });

        // Search & Filter Input Listeners
        document.getElementById('regionSearchInput')?.addEventListener('input', () => this.renderRegions());
        document.getElementById('farmerSearchInput')?.addEventListener('input', () => this.renderFarmers());
        document.getElementById('farmerRegionFilter')?.addEventListener('change', () => this.renderFarmers());
        document.getElementById('officerSearchInput')?.addEventListener('input', () => this.renderOfficers());
        document.getElementById('officerRegionFilter')?.addEventListener('change', () => this.renderOfficers());
        document.getElementById('ticketSearchInput')?.addEventListener('input', () => this.renderTickets());
        document.getElementById('ticketStatusFilter')?.addEventListener('change', () => this.renderTickets());
        document.getElementById('ticketOfficerFilter')?.addEventListener('change', () => this.renderTickets());

        // Live Photo URL preview listener on photo form
        document.getElementById('photoUrlInput')?.addEventListener('input', (e) => {
            const url = e.target.value.trim();
            const previewBox = document.getElementById('photoFormPreview');
            const previewImg = document.getElementById('photoFormPreviewImg');
            if (url && previewBox && previewImg) {
                previewImg.src = url;
                previewBox.classList.remove('hidden');
            } else if (previewBox) {
                previewBox.classList.add('hidden');
            }
        });
    },

    /**
     * Generic API Request Wrapper
     */
    apiCall: async function (url, method = 'GET', data = null) {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            
            if (!response.ok) {
                let errorMsg = `HTTP Error ${response.status}: ${response.statusText}`;
                try {
                    const errObj = await response.json();
                    if (errObj && errObj.message) errorMsg = errObj.message;
                } catch (e) {
                    const errText = await response.text();
                    if (errText) errorMsg = errText;
                }
                throw new Error(errorMsg);
            }

            // Handle empty responses or delete string responses
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return await response.json();
            } else {
                return await response.text();
            }
        } catch (err) {
            console.error(`API Failure [${method} ${url}]:`, err);
            throw err;
        }
    },

    /**
     * Fetch All Database Data Concurrently
     */
    fetchAllData: async function (isManualRefresh = false) {
        if (isManualRefresh) {
            this.showToast('Syncing with database...', 'info');
        }

        try {
            const [regions, farmers, officers, tickets, photos] = await Promise.all([
                this.apiCall(`${this.endpoints.region}/get`).catch(() => []),
                this.apiCall(`${this.endpoints.farmer}/get`).catch(() => []),
                this.apiCall(`${this.endpoints.officer}/get`).catch(() => []),
                this.apiCall(`${this.endpoints.ticket}/get`).catch(() => []),
                this.apiCall(`${this.endpoints.photo}/get`).catch(() => [])
            ]);

            this.state.regions = Array.isArray(regions) ? regions : [];
            this.state.farmers = Array.isArray(farmers) ? farmers : [];
            this.state.officers = Array.isArray(officers) ? officers : [];
            this.state.tickets = Array.isArray(tickets) ? tickets : [];
            this.state.photos = Array.isArray(photos) ? photos : [];

            console.log("Data loaded successfully:", this.state);

            // Re-render UI components
            this.updateBadgeCounts();
            this.populateSelectDropdowns();
            this.renderDashboard();
            this.renderRegions();
            this.renderFarmers();
            this.renderOfficers();
            this.renderTickets();
            this.renderPhotos();
            this.renderAdmin();

            // Refresh icons
            if (window.lucide) window.lucide.createIcons();

            if (isManualRefresh) {
                this.showToast('Database records refreshed successfully', 'success');
            }
        } catch (err) {
            this.showToast(`Failed to load database records: ${err.message}`, 'error');
        }
    },

    /**
     * Update Navigation Count Badges
     */
    updateBadgeCounts: function () {
        const openTickets = this.state.tickets.filter(t => (t.status || '').toUpperCase() === 'OPEN').length;
        
        document.getElementById('navOpenTicketsCount').textContent = openTickets;
        document.getElementById('navRegionsCount').textContent = this.state.regions.length;
        document.getElementById('navFarmersCount').textContent = this.state.farmers.length;
        document.getElementById('navOfficersCount').textContent = this.state.officers.length;
        document.getElementById('navPhotosCount').textContent = this.state.photos.length;

        // Check Escalated Alert Banner
        const escalatedTickets = this.state.tickets.filter(t => t.escalated);
        const banner = document.getElementById('escalatedAlertBanner');
        const alertText = document.getElementById('escalatedAlertText');
        if (banner && alertText) {
            if (escalatedTickets.length > 0) {
                alertText.textContent = `High Priority Alert: ${escalatedTickets.length} escalated crop disease report(s) require urgent officer recommendation.`;
                banner.classList.remove('hidden');
            } else {
                banner.classList.add('hidden');
            }
        }
    },

    /**
     * Populate Region, Farmer, and Officer Dropdowns Across All Forms
     */
    populateSelectDropdowns: function () {
        // Region Dropdowns
        const regionOptions = '<option value="">-- Select Region --</option>' +
            this.state.regions.map(r => `<option value="${r.region_id}">${this.escapeHTML(r.region_name)} (${this.escapeHTML(r.district)})</option>`).join('');
        
        ['farmerRegionSelect', 'officerRegionSelect', 'farmerRegionFilter', 'officerRegionFilter'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                const currentVal = el.value;
                el.innerHTML = id.includes('Filter') ? '<option value="">All Regions</option>' + this.state.regions.map(r => `<option value="${r.region_id}">${this.escapeHTML(r.region_name)}</option>`).join('') : regionOptions;
                if (currentVal) el.value = currentVal;
            }
        });

        // Ticket Form Farmer Select
        const farmerSelect = document.getElementById('ticketFarmerSelect');
        if (farmerSelect) {
            const currentVal = farmerSelect.value;
            farmerSelect.innerHTML = '<option value="">-- Choose Farmer --</option>' +
                this.state.farmers.map(f => {
                    const regName = f.region ? f.region.region_name : 'No Region';
                    return `<option value="${f.farmer_id}">${this.escapeHTML(f.farmer_name)} (${this.escapeHTML(regName)})</option>`;
                }).join('');
            if (currentVal) farmerSelect.value = currentVal;
        }

        // Ticket Form Officer Select & Modal Officer Select
        this.populateOfficerSelects();

        // Photo Form Ticket Select
        const photoTicketSelect = document.getElementById('photoTicketSelect');
        if (photoTicketSelect) {
            const currentVal = photoTicketSelect.value;
            photoTicketSelect.innerHTML = '<option value="">-- Choose Ticket --</option>' +
                this.state.tickets.map(t => {
                    const farmerName = t.farmer ? t.farmer.farmer_name : 'Unknown Farmer';
                    return `<option value="${t.ticket_id}">Ticket #${t.ticket_id} - ${this.escapeHTML(t.crop_name || 'Crop')} (${this.escapeHTML(farmerName)})</option>`;
                }).join('');
            if (currentVal) photoTicketSelect.value = currentVal;
        }

        // Ticket Officer Filter
        const officerFilter = document.getElementById('ticketOfficerFilter');
        if (officerFilter) {
            const currentVal = officerFilter.value;
            officerFilter.innerHTML = '<option value="">All Officers</option>' +
                this.state.officers.map(o => `<option value="${o.officer_id}">${this.escapeHTML(o.officer_name)}</option>`).join('');
            if (currentVal) officerFilter.value = currentVal;
        }
    },

    /**
     * Populate Officer Selects with Region Prioritization
     */
    populateOfficerSelects: function (filterRegionId = null) {
        const officerSelect = document.getElementById('ticketOfficerSelect');
        const modalOfficerSelect = document.getElementById('modalOfficerSelect');

        let sortedOfficers = [...this.state.officers];
        if (filterRegionId) {
            sortedOfficers.sort((a, b) => {
                const aMatch = a.region && a.region.region_id == filterRegionId;
                const bMatch = b.region && b.region.region_id == filterRegionId;
                return (bMatch ? 1 : 0) - (aMatch ? 1 : 0);
            });
        }

        const optionsHtml = '<option value="">-- Unassigned (Select Officer) --</option>' +
            sortedOfficers.map(o => {
                const regName = o.region ? o.region.region_name : 'Unassigned Region';
                const isMatch = filterRegionId && o.region && o.region.region_id == filterRegionId;
                const matchTag = isMatch ? ' ⭐ [Region Match]' : '';
                return `<option value="${o.officer_id}">${this.escapeHTML(o.officer_name)} - ${this.escapeHTML(o.specialization || 'Officer')} (${this.escapeHTML(regName)})${matchTag}</option>`;
            }).join('');

        if (officerSelect) officerSelect.innerHTML = optionsHtml;
        if (modalOfficerSelect) modalOfficerSelect.innerHTML = optionsHtml;
    },

    /**
     * Handle Farmer Select Change on Ticket Form
     */
    handleTicketFarmerChange: function (farmerId) {
        const hintEl = document.getElementById('ticketFarmerRegionHint');
        if (!farmerId) {
            if (hintEl) hintEl.textContent = 'Select a farmer to auto-detect region & match regional officers.';
            this.populateOfficerSelects();
            return;
        }

        const farmer = this.state.farmers.find(f => f.farmer_id == farmerId);
        if (farmer && farmer.region) {
            if (hintEl) hintEl.textContent = `Farmer's Region: ${farmer.region.region_name} (${farmer.region.district}). Regional officers highlighted!`;
            this.populateOfficerSelects(farmer.region.region_id);
        } else {
            if (hintEl) hintEl.textContent = 'Farmer has no designated region. Showing all officers.';
            this.populateOfficerSelects();
        }
    },

    /**
     * SPA Tab Navigation Handler
     */
    switchTab: function (tabId, options = {}) {
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(btn => {
            if (btn.getAttribute('data-tab') === tabId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        const targetPanel = document.getElementById(tabId);
        if (targetPanel) {
            targetPanel.classList.add('active');
            this.state.activeTab = tabId;
        }

        // Handle filters if passed
        if (options.filter && tabId === 'sec-tickets-list') {
            const statusFilter = document.getElementById('ticketStatusFilter');
            if (statusFilter) {
                statusFilter.value = options.filter;
                this.renderTickets();
            }
        }

        // Close mobile sidebar if open
        document.getElementById('appSidebar')?.classList.remove('mobile-open');

        // Refresh Lucide Icons
        if (window.lucide) window.lucide.createIcons();
    },

    /**
     * SECTION A: Render Dashboard Overview
     */
    renderDashboard: function () {
        // Compute KPIs
        document.getElementById('kpiTotalRegions').textContent = this.state.regions.length;
        document.getElementById('kpiTotalFarmers').textContent = this.state.farmers.length;
        document.getElementById('kpiTotalOfficers').textContent = this.state.officers.length;
        document.getElementById('kpiTotalTickets').textContent = this.state.tickets.length;

        // Status Counts
        let openCount = 0, progressCount = 0, resolvedCount = 0, closedCount = 0;
        this.state.tickets.forEach(t => {
            const st = (t.status || '').toUpperCase();
            if (st === 'OPEN') openCount++;
            else if (st === 'IN_PROGRESS' || st === 'IN PROGRESS') progressCount++;
            else if (st === 'RESOLVED') resolvedCount++;
            else if (st === 'CLOSED') closedCount++;
            else openCount++; // Fallback
        });

        document.getElementById('dashOpenCount').textContent = openCount;
        document.getElementById('dashProgressCount').textContent = progressCount;
        document.getElementById('dashResolvedCount').textContent = resolvedCount;
        document.getElementById('dashClosedCount').textContent = closedCount;

        // Progress Bar Calculation
        const total = this.state.tickets.length || 1;
        document.getElementById('barSegmentOpen').style.width = `${(openCount / total) * 100}%`;
        document.getElementById('barSegmentProgress').style.width = `${(progressCount / total) * 100}%`;
        document.getElementById('barSegmentResolved').style.width = `${(resolvedCount / total) * 100}%`;
        document.getElementById('barSegmentClosed').style.width = `${(closedCount / total) * 100}%`;

        // Render Recent 5 Tickets Table
        const recentBody = document.getElementById('dashboardRecentTicketsBody');
        if (!recentBody) return;

        if (this.state.tickets.length === 0) {
            recentBody.innerHTML = `<tr><td colspan="8" class="text-center text-muted py-4">No problem reports found in database. Click "Report Problem" to create one.</td></tr>`;
            return;
        }

        const sortedTickets = [...this.state.tickets].reverse().slice(0, 5);
        recentBody.innerHTML = sortedTickets.map(t => {
            const farmerName = t.farmer ? t.farmer.farmer_name : 'Unspecified';
            const officerName = t.officer ? t.officer.officer_name : '<span class="text-muted">Unassigned</span>';
            const statusBadge = this.getStatusBadgeHTML(t.status);
            const escBadge = t.escalated ? '<span class="badge badge-escalated">HIGH PRIORITY</span>' : '<span class="text-muted">Normal</span>';

            return `
                <tr>
                    <td><strong>#${t.ticket_id}</strong></td>
                    <td>${this.escapeHTML(farmerName)}</td>
                    <td><strong class="text-emerald">${this.escapeHTML(t.crop_name || 'Crop')}</strong></td>
                    <td><div class="text-truncate" style="max-width:200px;">${this.escapeHTML(t.symptoms || 'No description')}</div></td>
                    <td>${this.escapeHTML(officerName)}</td>
                    <td>${statusBadge}</td>
                    <td>${escBadge}</td>
                    <td>
                        <button class="btn btn-xs btn-outline-primary" onclick="app.openTicketDetailModal(${t.ticket_id})">View / Advise</button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    /**
     * SECTION B: Render Region Management Table
     */
    renderRegions: function () {
        const tbody = document.getElementById('regionsTableBody');
        if (!tbody) return;

        const query = (document.getElementById('regionSearchInput')?.value || '').toLowerCase();
        
        const filtered = this.state.regions.filter(r => 
            (r.region_name || '').toLowerCase().includes(query) ||
            (r.district || '').toLowerCase().includes(query) ||
            (r.state || '').toLowerCase().includes(query) ||
            (r.pin_code || '').toLowerCase().includes(query) ||
            (r.region_id + '').includes(query)
        );

        document.getElementById('regionCountText').textContent = `${filtered.length} of ${this.state.regions.length} regions listed`;

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted py-4">No matching agricultural regions found.</td></tr>`;
            return;
        }

        tbody.innerHTML = filtered.map(r => {
            const farmerCount = this.state.farmers.filter(f => f.region && f.region.region_id === r.region_id).length;
            const officerCount = this.state.officers.filter(o => o.region && o.region.region_id === r.region_id).length;

            return `
                <tr>
                    <td><strong>#${r.region_id}</strong></td>
                    <td><strong>${this.escapeHTML(r.region_name || '')}</strong></td>
                    <td>${this.escapeHTML(r.district || '')}</td>
                    <td>${this.escapeHTML(r.state || '')}</td>
                    <td><code>${this.escapeHTML(r.pin_code || '')}</code></td>
                    <td><span class="badge badge-subtle">${farmerCount} Farmers</span></td>
                    <td><span class="badge badge-subtle">${officerCount} Officers</span></td>
                    <td class="text-right">
                        <button class="btn btn-xs btn-secondary" onclick="app.editRegion(${r.region_id})"><i data-lucide="edit-2"></i> Edit</button>
                        <button class="btn btn-xs btn-outline-danger" onclick="app.deleteRegion(${r.region_id})"><i data-lucide="trash-2"></i> Delete</button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    /**
     * SECTION C: Render Farmer Directory Table
     */
    renderFarmers: function () {
        const tbody = document.getElementById('farmersTableBody');
        if (!tbody) return;

        const query = (document.getElementById('farmerSearchInput')?.value || '').toLowerCase();
        const regionFilter = document.getElementById('farmerRegionFilter')?.value;

        const filtered = this.state.farmers.filter(f => {
            const matchQuery = (f.farmer_name || '').toLowerCase().includes(query) ||
                               (f.phone || '').toLowerCase().includes(query) ||
                               (f.email || '').toLowerCase().includes(query) ||
                               (f.address || '').toLowerCase().includes(query) ||
                               (f.region && (f.region.region_name || '').toLowerCase().includes(query));
            const matchRegion = !regionFilter || (f.region && f.region.region_id == regionFilter);
            return matchQuery && matchRegion;
        });

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted py-4">No matching farmers found in directory.</td></tr>`;
            return;
        }

        tbody.innerHTML = filtered.map(f => {
            const regionName = f.region ? `${f.region.region_name} (${f.region.district})` : '<span class="text-muted">Unassigned</span>';
            const formattedDate = f.created_at ? this.formatDate(f.created_at) : 'N/A';

            return `
                <tr>
                    <td><strong>#${f.farmer_id}</strong></td>
                    <td><strong>${this.escapeHTML(f.farmer_name || '')}</strong></td>
                    <td><a href="tel:${this.escapeHTML(f.phone || '')}">${this.escapeHTML(f.phone || 'N/A')}</a></td>
                    <td>${this.escapeHTML(f.email || 'N/A')}</td>
                    <td><span class="badge badge-primary">${this.escapeHTML(regionName)}</span></td>
                    <td><div class="text-truncate" style="max-width:180px;">${this.escapeHTML(f.address || 'N/A')}</div></td>
                    <td><span class="text-xs text-muted">${formattedDate}</span></td>
                    <td class="text-right">
                        <button class="btn btn-xs btn-secondary" onclick="app.editFarmer(${f.farmer_id})"><i data-lucide="edit-2"></i> Edit</button>
                        <button class="btn btn-xs btn-outline-danger" onclick="app.deleteFarmer(${f.farmer_id})"><i data-lucide="trash-2"></i> Delete</button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    /**
     * SECTION D: Render Officer Roster Table
     */
    renderOfficers: function () {
        const tbody = document.getElementById('officersTableBody');
        if (!tbody) return;

        const query = (document.getElementById('officerSearchInput')?.value || '').toLowerCase();
        const regionFilter = document.getElementById('officerRegionFilter')?.value;

        const filtered = this.state.officers.filter(o => {
            const matchQuery = (o.officer_name || '').toLowerCase().includes(query) ||
                               (o.email || '').toLowerCase().includes(query) ||
                               (o.phone || '').toLowerCase().includes(query) ||
                               (o.specialization || '').toLowerCase().includes(query) ||
                               (o.region && (o.region.region_name || '').toLowerCase().includes(query));
            const matchRegion = !regionFilter || (o.region && o.region.region_id == regionFilter);
            return matchQuery && matchRegion;
        });

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="8" class="text-center text-muted py-4">No matching officers found.</td></tr>`;
            return;
        }

        tbody.innerHTML = filtered.map(o => {
            const regionName = o.region ? `${o.region.region_name} (${o.region.district})` : '<span class="text-muted">Unassigned</span>';
            const activeBadge = o.active !== false ? '<span class="badge badge-resolved">ACTIVE</span>' : '<span class="badge badge-subtle">INACTIVE</span>';

            return `
                <tr>
                    <td><strong>#${o.officer_id}</strong></td>
                    <td><strong>${this.escapeHTML(o.officer_name || '')}</strong></td>
                    <td><span class="badge badge-subtle">${this.escapeHTML(o.specialization || 'General Advisor')}</span></td>
                    <td><span class="badge badge-primary">${this.escapeHTML(regionName)}</span></td>
                    <td>${this.escapeHTML(o.email || 'N/A')}</td>
                    <td>${this.escapeHTML(o.phone || 'N/A')}</td>
                    <td>${activeBadge}</td>
                    <td class="text-right">
                        <button class="btn btn-xs btn-secondary" onclick="app.editOfficer(${o.officer_id})"><i data-lucide="edit-2"></i> Edit</button>
                        <button class="btn btn-xs btn-outline-danger" onclick="app.deleteOfficer(${o.officer_id})"><i data-lucide="trash-2"></i> Delete</button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    /**
     * SECTION F: Render Ticket Advisory Table
     */
    renderTickets: function () {
        const tbody = document.getElementById('ticketsTableBody');
        if (!tbody) return;

        const query = (document.getElementById('ticketSearchInput')?.value || '').toLowerCase();
        const statusFilter = document.getElementById('ticketStatusFilter')?.value;
        const officerFilter = document.getElementById('ticketOfficerFilter')?.value;

        const filtered = this.state.tickets.filter(t => {
            const farmerName = t.farmer ? t.farmer.farmer_name : '';
            const officerName = t.officer ? t.officer.officer_name : '';

            const matchQuery = (t.crop_name || '').toLowerCase().includes(query) ||
                               (t.symptoms || '').toLowerCase().includes(query) ||
                               (t.recommendation || '').toLowerCase().includes(query) ||
                               farmerName.toLowerCase().includes(query) ||
                               officerName.toLowerCase().includes(query) ||
                               (t.ticket_id + '').includes(query);

            let matchStatus = true;
            if (statusFilter === 'ESCALATED') {
                matchStatus = t.escalated === true;
            } else if (statusFilter) {
                matchStatus = (t.status || '').toUpperCase() === statusFilter;
            }

            const matchOfficer = !officerFilter || (t.officer && t.officer.officer_id == officerFilter);

            return matchQuery && matchStatus && matchOfficer;
        });

        document.getElementById('ticketCountBadge').textContent = `${filtered.length} of ${this.state.tickets.length} Tickets Listed`;

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="9" class="text-center text-muted py-4">No matching problem reports found.</td></tr>`;
            return;
        }

        tbody.innerHTML = filtered.map(t => {
            const farmerName = t.farmer ? t.farmer.farmer_name : 'Unknown';
            const officerName = t.officer ? t.officer.officer_name : '<span class="text-muted">Unassigned</span>';
            const statusBadge = this.getStatusBadgeHTML(t.status);
            const escBadge = t.escalated ? '<span class="badge badge-escalated">🚨 ESCALATED</span>' : '<span class="text-muted">Normal</span>';
            const recommendationText = t.recommendation ? `<span class="text-emerald"><i data-lucide="check-circle-2"></i> ${this.escapeHTML(t.recommendation.substring(0, 45))}...</span>` : '<span class="text-muted font-italic">Pending Advisory</span>';

            return `
                <tr>
                    <td><strong>#${t.ticket_id}</strong></td>
                    <td><strong>${this.escapeHTML(farmerName)}</strong></td>
                    <td><strong class="text-emerald">${this.escapeHTML(t.crop_name || 'Crop')}</strong></td>
                    <td><div class="text-truncate" style="max-width:180px;" title="${this.escapeHTML(t.symptoms || '')}">${this.escapeHTML(t.symptoms || 'N/A')}</div></td>
                    <td>${this.escapeHTML(officerName)}</td>
                    <td>${statusBadge}</td>
                    <td>${recommendationText}</td>
                    <td>${escBadge}</td>
                    <td class="text-right">
                        <button class="btn btn-xs btn-primary" onclick="app.openTicketDetailModal(${t.ticket_id})"><i data-lucide="clipboard-check"></i> View / Advise</button>
                        <button class="btn btn-xs btn-outline-danger" onclick="app.deleteTicket(${t.ticket_id})"><i data-lucide="trash-2"></i></button>
                    </td>
                </tr>
            `;
        }).join('');
    },

    /**
     * SECTION G: Render Photo Attachments Gallery
     */
    renderPhotos: function () {
        const grid = document.getElementById('photoGalleryGrid');
        if (!grid) return;

        if (this.state.photos.length === 0) {
            grid.innerHTML = `
                <div class="card empty-state-box col-span-full p-4 text-center">
                    <i data-lucide="image-off" class="text-muted" style="width:48px; height:48px; margin:0 auto;"></i>
                    <h4 class="mt-2">No photo records attached</h4>
                    <p class="text-muted text-sm">Click "Attach New Photo URL" to link crop diagnostic images to problem tickets.</p>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.state.photos.map(p => {
            const ticketId = p.ticket ? p.ticket.ticket_id : 'N/A';
            const ticket = this.state.tickets.find(t => t.ticket_id === ticketId);
            const cropName = ticket ? ticket.crop_name : 'Crop Record';
            const farmerName = ticket && ticket.farmer ? ticket.farmer.farmer_name : 'Farmer';

            return `
                <div class="photo-card">
                    <div class="photo-card-img-wrapper">
                        <img src="${this.escapeHTML(p.photo_url || '')}" alt="Crop Photo #${p.photo_id}" onerror="app.handleImageError(this)">
                    </div>
                    <div class="photo-card-body">
                        <div class="photo-card-title">Ticket #${ticketId} — ${this.escapeHTML(cropName)}</div>
                        <div class="photo-card-meta">Farmer: ${this.escapeHTML(farmerName)}</div>
                        <div class="photo-card-meta text-xs">Uploaded: ${p.uploaded_at ? this.formatDate(p.uploaded_at) : 'N/A'}</div>
                        <div class="d-flex-between mt-3">
                            <button class="btn btn-xs btn-outline-primary" onclick="app.openTicketDetailModal(${ticketId})">View Ticket</button>
                            <button class="btn btn-xs btn-outline-danger" onclick="app.deletePhoto(${p.photo_id})"><i data-lucide="trash-2"></i> Delete</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },

    /**
     * SECTION H: Render Admin System Overview Matrix
     */
    renderAdmin: function () {
        document.getElementById('adminRegCount').textContent = this.state.regions.length;
        document.getElementById('adminFarmerCount').textContent = this.state.farmers.length;
        document.getElementById('adminOfficerCount').textContent = this.state.officers.length;
        document.getElementById('adminTicketPhotoCount').textContent = `${this.state.tickets.length} / ${this.state.photos.length}`;

        const matrixBody = document.getElementById('adminRegionMatrixBody');
        if (!matrixBody) return;

        if (this.state.regions.length === 0) {
            matrixBody.innerHTML = `<tr><td colspan="7" class="text-center text-muted py-4">No region metadata available.</td></tr>`;
            return;
        }

        matrixBody.innerHTML = this.state.regions.map(r => {
            const farmersInRegion = this.state.farmers.filter(f => f.region && f.region.region_id === r.region_id);
            const officersInRegion = this.state.officers.filter(o => o.region && o.region.region_id === r.region_id);
            
            // Tickets for farmers in this region
            const farmerIds = farmersInRegion.map(f => f.farmer_id);
            const ticketsInRegion = this.state.tickets.filter(t => t.farmer && farmerIds.includes(t.farmer.farmer_id));

            return `
                <tr>
                    <td><strong>#${r.region_id}</strong></td>
                    <td><strong>${this.escapeHTML(r.region_name)}</strong></td>
                    <td>${this.escapeHTML(r.district)}, ${this.escapeHTML(r.state)}</td>
                    <td><code>${this.escapeHTML(r.pin_code)}</code></td>
                    <td><span class="badge badge-primary">${farmersInRegion.length} Farmers</span></td>
                    <td><span class="badge badge-subtle">${officersInRegion.length} Officers</span></td>
                    <td><span class="badge badge-open">${ticketsInRegion.length} Tickets</span></td>
                </tr>
            `;
        }).join('');
    },

    /**
     * Helper: Generate Status Badge HTML
     */
    getStatusBadgeHTML: function (status) {
        const st = (status || 'OPEN').toUpperCase();
        switch (st) {
            case 'OPEN':
                return '<span class="badge badge-open"><span class="dot"></span> OPEN</span>';
            case 'IN_PROGRESS':
            case 'IN PROGRESS':
                return '<span class="badge badge-progress"><span class="dot"></span> IN PROGRESS</span>';
            case 'RESOLVED':
                return '<span class="badge badge-resolved"><span class="dot"></span> RESOLVED</span>';
            case 'CLOSED':
                return '<span class="badge badge-closed"><span class="dot"></span> CLOSED</span>';
            default:
                return `<span class="badge badge-subtle">${this.escapeHTML(st)}</span>`;
        }
    },

    /**
     * Image Fallback Error Handler
     */
    handleImageError: function (imgEl) {
        imgEl.onerror = null;
        imgEl.src = 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a28?auto=format&fit=crop&w=600&q=80';
        imgEl.title = 'Default sample image (Original image URL unreachable)';
    },

    /* ==========================================================================
       FORM SUBMISSION HANDLERS (POST & PUT API INTEGRATION)
       ========================================================================== */

    /**
     * Submit Region Form (POST /Region/create or PUT /Region/update/{id})
     */
    handleRegionSubmit: async function (e) {
        e.preventDefault();
        const id = document.getElementById('regFormId').value;
        const payload = {
            region_name: document.getElementById('regName').value.trim(),
            district: document.getElementById('regDistrict').value.trim(),
            state: document.getElementById('regState').value.trim(),
            pin_code: document.getElementById('regPinCode').value.trim()
        };

        const btn = document.getElementById('regSaveBtn');
        btn.disabled = true;

        try {
            if (id) {
                await this.apiCall(`${this.endpoints.region}/update/${id}`, 'PUT', payload);
                this.showToast(`Region #${id} updated successfully!`, 'success');
            } else {
                const res = await this.apiCall(`${this.endpoints.region}/create`, 'POST', payload);
                this.showToast(`Region created with DB ID #${res.region_id || ''}`, 'success');
            }

            this.resetRegionForm();
            this.toggleCollapse('regionFormCard');
            await this.fetchAllData();
        } catch (err) {
            this.showToast(`Failed to save region: ${err.message}`, 'error');
        } finally {
            btn.disabled = false;
        }
    },

    editRegion: function (id) {
        const region = this.state.regions.find(r => r.region_id === id);
        if (!region) return;

        document.getElementById('regFormId').value = region.region_id;
        document.getElementById('regName').value = region.region_name || '';
        document.getElementById('regDistrict').value = region.district || '';
        document.getElementById('regState').value = region.state || '';
        document.getElementById('regPinCode').value = region.pin_code || '';

        document.getElementById('regionFormTitle').textContent = `Edit Region #${region.region_id}`;
        document.getElementById('regionFormCard').classList.remove('hidden-collapsible');
    },

    deleteRegion: async function (id) {
        if (!confirm(`Are you sure you want to delete Region #${id}?`)) return;

        try {
            await this.apiCall(`${this.endpoints.region}/delete/${id}`, 'DELETE');
            this.showToast(`Region #${id} deleted from database.`, 'success');
            await this.fetchAllData();
        } catch (err) {
            this.showToast(`Delete failed: ${err.message}`, 'error');
        }
    },

    resetRegionForm: function () {
        document.getElementById('regionForm')?.reset();
        document.getElementById('regFormId').value = '';
        document.getElementById('regionFormTitle').textContent = 'Register New Region';
    },

    /**
     * Submit Farmer Form (POST /farmer/create or PUT /farmer/update/{id})
     */
    handleFarmerSubmit: async function (e) {
        e.preventDefault();
        const id = document.getElementById('farmerFormId').value;
        const regionId = document.getElementById('farmerRegionSelect').value;

        const payload = {
            farmer_name: document.getElementById('farmerName').value.trim(),
            phone: document.getElementById('farmerPhone').value.trim(),
            email: document.getElementById('farmerEmail').value.trim(),
            address: document.getElementById('farmerAddress').value.trim(),
            region: regionId ? { region_id: parseInt(regionId) } : null,
            created_at: id ? undefined : new Date().toISOString()
        };

        const btn = document.getElementById('farmerSaveBtn');
        btn.disabled = true;

        try {
            if (id) {
                await this.apiCall(`${this.endpoints.farmer}/update/${id}`, 'PUT', payload);
                this.showToast(`Farmer #${id} updated successfully!`, 'success');
            } else {
                const res = await this.apiCall(`${this.endpoints.farmer}/create`, 'POST', payload);
                this.showToast(`Farmer registered with ID #${res.farmer_id || ''}`, 'success');
            }

            this.resetFarmerForm();
            this.toggleCollapse('farmerFormCard');
            await this.fetchAllData();
        } catch (err) {
            this.showToast(`Failed to save farmer: ${err.message}`, 'error');
        } finally {
            btn.disabled = false;
        }
    },

    editFarmer: function (id) {
        const farmer = this.state.farmers.find(f => f.farmer_id === id);
        if (!farmer) return;

        document.getElementById('farmerFormId').value = farmer.farmer_id;
        document.getElementById('farmerName').value = farmer.farmer_name || '';
        document.getElementById('farmerPhone').value = farmer.phone || '';
        document.getElementById('farmerEmail').value = farmer.email || '';
        document.getElementById('farmerAddress').value = farmer.address || '';
        if (farmer.region) document.getElementById('farmerRegionSelect').value = farmer.region.region_id;

        document.getElementById('farmerFormTitle').textContent = `Edit Farmer #${farmer.farmer_id}`;
        document.getElementById('farmerFormCard').classList.remove('hidden-collapsible');
    },

    deleteFarmer: async function (id) {
        if (!confirm(`Are you sure you want to delete Farmer #${id}?`)) return;

        try {
            await this.apiCall(`${this.endpoints.farmer}/delete/${id}`, 'DELETE');
            this.showToast(`Farmer #${id} deleted from database.`, 'success');
            await this.fetchAllData();
        } catch (err) {
            this.showToast(`Delete failed: ${err.message}`, 'error');
        }
    },

    resetFarmerForm: function () {
        document.getElementById('farmerForm')?.reset();
        document.getElementById('farmerFormId').value = '';
        document.getElementById('farmerFormTitle').textContent = 'Register New Farmer';
    },

    /**
     * Submit Officer Form (POST /officer/create or PUT /officer/update/{id})
     */
    handleOfficerSubmit: async function (e) {
        e.preventDefault();
        const id = document.getElementById('officerFormId').value;
        const regionId = document.getElementById('officerRegionSelect').value;

        const payload = {
            officer_name: document.getElementById('officerName').value.trim(),
            email: document.getElementById('officerEmail').value.trim(),
            phone: document.getElementById('officerPhone').value.trim(),
            specialization: document.getElementById('officerSpecialization').value,
            region: regionId ? { region_id: parseInt(regionId) } : null,
            active: document.getElementById('officerActive').checked,
            created_at: id ? undefined : new Date().toISOString()
        };

        const btn = document.getElementById('officerSaveBtn');
        btn.disabled = true;

        try {
            if (id) {
                await this.apiCall(`${this.endpoints.officer}/update/${id}`, 'PUT', payload);
                this.showToast(`Officer #${id} updated successfully!`, 'success');
            } else {
                const res = await this.apiCall(`${this.endpoints.officer}/create`, 'POST', payload);
                this.showToast(`Officer registered with ID #${res.officer_id || ''}`, 'success');
            }

            this.resetOfficerForm();
            this.toggleCollapse('officerFormCard');
            await this.fetchAllData();
        } catch (err) {
            this.showToast(`Failed to save officer: ${err.message}`, 'error');
        } finally {
            btn.disabled = false;
        }
    },

    editOfficer: function (id) {
        const officer = this.state.officers.find(o => o.officer_id === id);
        if (!officer) return;

        document.getElementById('officerFormId').value = officer.officer_id;
        document.getElementById('officerName').value = officer.officer_name || '';
        document.getElementById('officerEmail').value = officer.email || '';
        document.getElementById('officerPhone').value = officer.phone || '';
        document.getElementById('officerSpecialization').value = officer.specialization || '';
        if (officer.region) document.getElementById('officerRegionSelect').value = officer.region.region_id;
        document.getElementById('officerActive').checked = officer.active !== false;

        document.getElementById('officerFormTitle').textContent = `Edit Officer #${officer.officer_id}`;
        document.getElementById('officerFormCard').classList.remove('hidden-collapsible');
    },

    deleteOfficer: async function (id) {
        if (!confirm(`Are you sure you want to delete Officer #${id}?`)) return;

        try {
            await this.apiCall(`${this.endpoints.officer}/delete/${id}`, 'DELETE');
            this.showToast(`Officer #${id} deleted from database.`, 'success');
            await this.fetchAllData();
        } catch (err) {
            this.showToast(`Delete failed: ${err.message}`, 'error');
        }
    },

    resetOfficerForm: function () {
        document.getElementById('officerForm')?.reset();
        document.getElementById('officerFormId').value = '';
        document.getElementById('officerFormTitle').textContent = 'Register New Officer';
    },

    /**
     * Submit Crop Problem Ticket Form (POST /ticket/create)
     */
    handleTicketSubmit: async function (e) {
        e.preventDefault();

        const farmerId = document.getElementById('ticketFarmerSelect').value;
        const officerId = document.getElementById('ticketOfficerSelect').value;
        const photoUrl = document.getElementById('ticketPhotoUrl')?.value.trim();

        if (!farmerId) {
            this.showToast('Please select a farmer for this ticket.', 'error');
            return;
        }

        const now = new Date().toISOString();
        const payload = {
            farmer: { farmer_id: parseInt(farmerId) },
            officer: officerId ? { officer_id: parseInt(officerId) } : null,
            crop_name: document.getElementById('ticketCropName').value.trim(),
            symptoms: document.getElementById('ticketSymptoms').value.trim(),
            status: document.getElementById('ticketStatus').value || 'OPEN',
            escalated: document.getElementById('ticketEscalated').checked,
            created_at: now,
            updated_at: now
        };

        const btn = document.getElementById('submitTicketBtn');
        btn.disabled = true;

        try {
            const ticketRes = await this.apiCall(`${this.endpoints.ticket}/create`, 'POST', payload);
            const newTicketId = ticketRes.ticket_id;

            // If photo URL provided, link via Photo API
            if (photoUrl && newTicketId) {
                try {
                    await this.apiCall(`${this.endpoints.photo}/create`, 'POST', {
                        ticket: { ticket_id: newTicketId },
                        photo_url: photoUrl,
                        uploaded_at: now
                    });
                } catch (photoErr) {
                    console.warn('Ticket created but photo attachment failed:', photoErr);
                }
            }

            this.showToast(`Ticket created successfully! Database Ticket ID #${newTicketId}`, 'success');
            document.getElementById('newTicketForm').reset();
            document.getElementById('ticketPhotoPreviewBox')?.classList.add('hidden');
            
            await this.fetchAllData();
            this.switchTab('sec-tickets-list');
        } catch (err) {
            this.showToast(`Failed to create ticket: ${err.message}`, 'error');
        } finally {
            btn.disabled = false;
        }
    },

    setCropName: function (name) {
        const input = document.getElementById('ticketCropName');
        if (input) input.value = name;
    },

    previewTicketPhoto: function () {
        const url = document.getElementById('ticketPhotoUrl')?.value.trim();
        const previewBox = document.getElementById('ticketPhotoPreviewBox');
        const previewImg = document.getElementById('ticketPhotoPreviewImg');

        if (url && previewBox && previewImg) {
            previewImg.src = url;
            previewBox.classList.remove('hidden');
        } else {
            this.showToast('Please enter a valid image URL first.', 'info');
        }
    },

    deleteTicket: async function (id) {
        if (!confirm(`Delete Ticket #${id}? This will also delete any associated photo records.`)) return;

        try {
            await this.apiCall(`${this.endpoints.ticket}/delete/${id}`, 'DELETE');
            this.showToast(`Ticket #${id} deleted from database.`, 'success');
            await this.fetchAllData();
        } catch (err) {
            this.showToast(`Delete failed: ${err.message}`, 'error');
        }
    },

    /**
     * Submit Photo Link Form (POST /photo/create)
     */
    handlePhotoSubmit: async function (e) {
        e.preventDefault();
        const ticketId = document.getElementById('photoTicketSelect').value;
        const photoUrl = document.getElementById('photoUrlInput').value.trim();

        if (!ticketId || !photoUrl) {
            this.showToast('Please select a ticket and provide a photo URL.', 'error');
            return;
        }

        const payload = {
            ticket: { ticket_id: parseInt(ticketId) },
            photo_url: photoUrl,
            uploaded_at: new Date().toISOString()
        };

        const btn = document.getElementById('photoSaveBtn');
        btn.disabled = true;

        try {
            const res = await this.apiCall(`${this.endpoints.photo}/create`, 'POST', payload);
            this.showToast(`Photo attached to Ticket #${ticketId} with Photo ID #${res.photo_id}`, 'success');
            this.resetPhotoForm();
            this.toggleCollapse('photoFormCard');
            await this.fetchAllData();
        } catch (err) {
            this.showToast(`Failed to attach photo: ${err.message}`, 'error');
        } finally {
            btn.disabled = false;
        }
    },

    setSamplePhoto: function (url) {
        const input = document.getElementById('photoUrlInput');
        if (input) {
            input.value = url;
            input.dispatchEvent(new Event('input'));
        }
    },

    resetPhotoForm: function () {
        document.getElementById('photoForm')?.reset();
        document.getElementById('photoFormPreview')?.classList.add('hidden');
    },

    deletePhoto: async function (id) {
        if (!confirm(`Delete Photo record #${id}?`)) return;

        try {
            await this.apiCall(`${this.endpoints.photo}/delete/${id}`, 'DELETE');
            this.showToast(`Photo #${id} deleted.`, 'success');
            await this.fetchAllData();
        } catch (err) {
            this.showToast(`Delete failed: ${err.message}`, 'error');
        }
    },

    /**
     * Open Ticket Detail & Officer Advisory Modal
     */
    openTicketDetailModal: function (ticketId) {
        const ticket = this.state.tickets.find(t => t.ticket_id === ticketId);
        if (!ticket) return;

        this.state.currentTicketModalId = ticketId;

        document.getElementById('modalTicketTitle').textContent = `Ticket #${ticket.ticket_id} — ${ticket.crop_name || 'Crop'}`;
        document.getElementById('modalTicketDate').textContent = `Reported: ${ticket.created_at ? this.formatDate(ticket.created_at) : 'N/A'}`;

        const farmerName = ticket.farmer ? ticket.farmer.farmer_name : 'Unknown';
        const farmerContact = ticket.farmer ? `${ticket.farmer.phone || ''} ${ticket.farmer.email || ''}` : '';
        const regionName = ticket.farmer && ticket.farmer.region ? `${ticket.farmer.region.region_name} (${ticket.farmer.region.district})` : 'N/A';

        document.getElementById('modalTicketFarmer').textContent = farmerName;
        document.getElementById('modalTicketFarmerContact').textContent = farmerContact;
        document.getElementById('modalTicketRegion').textContent = regionName;
        document.getElementById('modalTicketStatusBadge').innerHTML = this.getStatusBadgeHTML(ticket.status);
        document.getElementById('modalTicketSymptoms').textContent = ticket.symptoms || 'No symptoms specified.';

        // Photos Strip
        const photoStrip = document.getElementById('modalTicketPhotosStrip');
        const ticketPhotos = this.state.photos.filter(p => p.ticket && p.ticket.ticket_id === ticketId);
        if (ticketPhotos.length > 0) {
            photoStrip.innerHTML = ticketPhotos.map(p => 
                `<img src="${this.escapeHTML(p.photo_url)}" alt="Ticket Photo" class="modal-photo-thumb" onerror="app.handleImageError(this)" title="Uploaded ${p.uploaded_at || ''}">`
            ).join('');
        } else {
            photoStrip.innerHTML = '<span class="text-muted text-sm">No photos attached to this ticket.</span>';
        }

        // Advisory Form Populating
        if (ticket.officer) {
            document.getElementById('modalOfficerSelect').value = ticket.officer.officer_id;
        } else {
            document.getElementById('modalOfficerSelect').value = '';
        }
        document.getElementById('modalStatusSelect').value = (ticket.status || 'OPEN').toUpperCase();
        document.getElementById('modalRecommendationText').value = ticket.recommendation || '';
        document.getElementById('modalEscalatedCheck').checked = ticket.escalated === true;

        const modal = document.getElementById('ticketDetailModal');
        if (modal) modal.classList.remove('hidden');

        if (window.lucide) window.lucide.createIcons();
    },

    openAttachPhotoForModalTicket: function () {
        if (this.state.currentTicketModalId) {
            this.closeModal('ticketDetailModal');
            this.switchTab('sec-photos');
            document.getElementById('photoTicketSelect').value = this.state.currentTicketModalId;
            document.getElementById('photoFormCard').classList.remove('hidden-collapsible');
        }
    },

    /**
     * Submit Advisory Updates (PUT /ticket/update/{id})
     */
    handleAdvisorySubmit: async function (e) {
        e.preventDefault();
        const id = this.state.currentTicketModalId;
        const ticket = this.state.tickets.find(t => t.ticket_id === id);
        if (!ticket) return;

        const officerId = document.getElementById('modalOfficerSelect').value;
        const newStatus = document.getElementById('modalStatusSelect').value;
        const recommendation = document.getElementById('modalRecommendationText').value.trim();
        const escalated = document.getElementById('modalEscalatedCheck').checked;

        const now = new Date().toISOString();
        const payload = {
            farmer: ticket.farmer ? { farmer_id: ticket.farmer.farmer_id } : null,
            officer: officerId ? { officer_id: parseInt(officerId) } : null,
            crop_name: ticket.crop_name,
            symptoms: ticket.symptoms,
            status: newStatus,
            recommendation: recommendation,
            escalated: escalated,
            created_at: ticket.created_at,
            updated_at: now,
            closed_at: (newStatus === 'CLOSED' || newStatus === 'RESOLVED') ? (ticket.closed_at || now) : null
        };

        const btn = document.getElementById('saveAdvisoryBtn');
        btn.disabled = true;

        try {
            await this.apiCall(`${this.endpoints.ticket}/update/${id}`, 'PUT', payload);
            this.showToast(`Advisory updated for Ticket #${id}`, 'success');
            this.closeModal('ticketDetailModal');
            await this.fetchAllData();
        } catch (err) {
            this.showToast(`Failed to update advisory: ${err.message}`, 'error');
        } finally {
            btn.disabled = false;
        }
    },

    closeModal: function (modalId) {
        const modal = document.getElementById(modalId);
        if (modal) modal.classList.add('hidden');
    },

    toggleCollapse: function (elementId) {
        const el = document.getElementById(elementId);
        if (el) el.classList.toggle('hidden-collapsible');
    },

    /**
     * Utility: Toast Notification System
     */
    showToast: function (message, type = 'info') {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let iconName = 'info';
        if (type === 'success') iconName = 'check-circle-2';
        else if (type === 'error') iconName = 'alert-triangle';

        toast.innerHTML = `
            <i data-lucide="${iconName}"></i>
            <span>${this.escapeHTML(message)}</span>
        `;

        container.appendChild(toast);
        if (window.lucide) window.lucide.createIcons();

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    },

    /**
     * Utility: HTML Sanitizer to prevent XSS
     */
    escapeHTML: function (str) {
        if (!str && str !== 0) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    },

    /**
     * Utility: Date Formatter
     */
    formatDate: function (isoString) {
        try {
            const date = new Date(isoString);
            if (isNaN(date.getTime())) return isoString;
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            return isoString;
        }
    }
};

// Initialize Application when DOM is ready
document.addEventListener('DOMContentLoaded', () => app.init());

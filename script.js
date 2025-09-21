// Demo ticket data
const tickets = [
    {
        id: "#1001",
        subject: "Sunucuya erişim sorunu var",
        customer: "ABC Teknoloji",
        priority: "Yüksek",
        status: "Açık",
        created: "2025-09-19",
        assigned: "Ali Veli",
        link: "ticket.html",
        customer_location: [41.0082, 28.9784] // Istanbul
    },
    {
        id: "#1002",
        subject: "Yazıcı çıktısı alınamıyor",
        customer: "DEF Lojistik",
        priority: "Orta",
        status: "İşlemde",
        created: "2025-09-20",
        assigned: "Ayşe Yılmaz",
        link: "#",
        customer_location: [39.9208, 32.8541] // Ankara
    },
    {
        id: "#1003",
        subject: "E-posta senkronizasyon hatası",
        customer: "XYZ Market",
        priority: "Yüksek",
        status: "Açık",
        created: "2025-09-18",
        assigned: "Mehmet Can",
        link: "#",
        customer_location: [38.4192, 27.1287] // Izmir
    },
    {
        id: "#1004",
        subject: "Yazılım lisans yenileme talebi",
        customer: "ABC Teknoloji",
        priority: "Düşük",
        status: "Kapandı",
        created: "2025-09-15",
        assigned: "Ali Veli",
        link: "#",
        customer_location: [41.0082, 28.9784] // Istanbul
    }
];

// Map from Turkish to badge class
const priorityClass = {
    "Yüksek": "high",
    "Orta": "medium",
    "Düşük": "low"
};
const statusClass = {
    "Açık": "open",
    "İşlemde": "in-progress",
    "Kapandı": "closed"
};

function renderTickets() {
    const tbody = document.querySelector("#ticket-table tbody");
    tbody.innerHTML = "";
    // Get filters
    const status = document.getElementById("filter-status").value;
    const priority = document.getElementById("filter-priority").value;
    const dateRange = document.getElementById("filter-date").value;
    let filtered = tickets;
    // Filtering
    if (status) filtered = filtered.filter(t => t.status === status);
    if (priority) filtered = filtered.filter(t => t.priority === priority);
    if (dateRange) {
        const [from, to] = dateRange.split(" to ");
        if (from && to) {
            filtered = filtered.filter(t => t.created >= from && t.created <= to);
        }
    }
    // Render each ticket
    for (const t of filtered) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td><a href="${t.link}">${t.id}</a></td>
            <td>${t.subject}</td>
            <td>${t.customer}</td>
            <td><span class="badge ${priorityClass[t.priority]}">${t.priority}</span></td>
            <td><span class="badge ${statusClass[t.status]}">${t.status}</span></td>
            <td>${t.created}</td>
            <td>${t.assigned}</td>
            <td><a class="btn btn-sm" href="${t.link}">Görüntüle</a></td>
        `;
        tbody.appendChild(tr);
    }
}

document.querySelectorAll('#filter-status, #filter-priority').forEach(el => {
    el.addEventListener("change", renderTickets);
});

// Date filter with Flatpickr
flatpickr("#filter-date", {
    mode: "range",
    dateFormat: "Y-m-d",
    locale: "tr",
    onChange: renderTickets
});

// Initial render
renderTickets();

// --- Map section ---
const map = L.map('map').setView([39.5, 32.5], 6);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const customerMarkers = {};
tickets.forEach(t => {
    if (!customerMarkers[t.customer]) {
        const marker = L.marker(t.customer_location).addTo(map)
            .bindPopup(`<b>${t.customer}</b>`);
        customerMarkers[t.customer] = marker;
    }
});

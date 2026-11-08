
let nextProposalId = 5;

        let proposals = [
            {
                project: "Website Redesign",
                client: "Nova Studio",
                deadline: "2026-11-12",
                value: 25000,
                id: 1,
                status: "Sent",
                follow: "2026-11-09",
                notes: "Waiting for client response."
            },
            {
                project: "Brand Identity",
                client: "Pixel Works",
                deadline: "2026-11-15",
                value: 18000,
                id: 2,
                status: "Follow-up",
                follow: "2026-11-08",
                notes: "Share the revised design."
            },
            {
                project: "E-commerce Website",
                client: "Urban Cart",
                deadline: "2026-11-20",
                value: 22000,
                id: 3,
                status: "Won",
                follow: "2026-11-10",
                notes: "Project approved by client."
            },
            {
                project: "Social Media Designs",
                client: "Bloom Cafe",
                deadline: "2026-11-18",
                value: 7000,
                id: 4,
                status: "Draft",
                follow: "2026-11-13",
                notes: "Prepare proposal document."
            }
        ];

        function escapeHTML(value) {
            return String(value).replace(/[&<>\"']/g, function (character) {
                let entities = {
                    "&": "&amp;",
                    "<": "&lt;",
                    ">": "&gt;",
                    '\"': "&quot;",
                    "'": "&#39;"
                };
                return entities[character];
            });
        }

        function showProposals(list) {
            let rows = "";

            for (let i = 0; i < list.length; i++) {
                let statusClass = "status";

                if (list[i].status === "Won") {
                    statusClass = "status status-won";
                } else if (list[i].status === "Lost") {
                    statusClass = "status status-lost";
                } else if (list[i].status === "Follow-up") {
                    statusClass = "status status-follow";
                }

                let safeNotes = escapeHTML(list[i].notes || "No notes added yet.");

                rows = rows +
                    "<tr>" +
                    "<td><strong>" + escapeHTML(list[i].project) + "</strong><br>" + escapeHTML(list[i].client) + "</td>" +
                    "<td>" + escapeHTML(list[i].deadline) + "</td>" +
                    "<td>₹ " + list[i].value + "</td>" +
                    "<td><span class='" + statusClass + "'>" + escapeHTML(list[i].status) + "</span></td>" +
                    "<td><div class='action-buttons'>" +
                    "<button class='small-button' onclick='changeStatus(" + list[i].id + ")'>Next status</button>" +
                    "<button class='delete-button' onclick='deleteProposal(" + list[i].id + ")' title='Delete proposal' aria-label='Delete proposal'>×</button>" +
                    "</div></td>" +
                    "</tr>" +
                    "<tr class='notes-row'><td colspan='5'>" +
                    "<details class='proposal-notes'><summary>View notes</summary>" +
                    "<p>" + safeNotes + "</p></details></td></tr>";
            }

            if (list.length === 0) {
                rows = "<tr><td colspan='5'>No matching proposals found.</td></tr>";
            }

            document.getElementById("proposalRows").innerHTML = rows;
            document.getElementById("resultMessage").textContent =
                "Showing " + list.length + " proposal(s).";
        }

        function updateDashboard() {
            let total = proposals.length;
            let sent = 0;
            let won = 0;
            let value = 0;

            for (let i = 0; i < proposals.length; i++) {
                value = value + proposals[i].value;

                if (proposals[i].status === "Sent" || proposals[i].status === "Follow-up") {
                    sent++;
                }

                if (proposals[i].status === "Won") {
                    won++;
                }
            }

            if (document.getElementById("totalCount")) document.getElementById("totalCount").textContent = total;
            if (document.getElementById("sentCount")) document.getElementById("sentCount").textContent = sent;
            if (document.getElementById("wonCount")) document.getElementById("wonCount").textContent = won;
            if (document.getElementById("valueCount")) document.getElementById("valueCount").textContent = "₹ " + value;
        }

        function showReminders() {
            let reminderText = "";
            let reminderContainer = document.getElementById("reminderList");

            if (reminderContainer === null) {
                return;
            }

            for (let i = 0; i < proposals.length; i++) {
                if (proposals[i].follow !== "" &&
                    proposals[i].status !== "Won" &&
                    proposals[i].status !== "Lost") {

                    reminderText = reminderText +
                        "<div class='reminder'>" +
                        "<div class='reminder-mark'></div>" +
                        "<div><h3>" + proposals[i].client + " — " + proposals[i].project + "</h3>" +
                        "<p>Follow up: " + proposals[i].follow + "</p></div>" +
                        "</div>";
                }
            }

            if (reminderText === "") {
                reminderText = "<p>No pending follow-ups. Add a follow-up date to an opportunity to see it here.</p>";
            }

            reminderContainer.innerHTML = reminderText;
        }

        function addProposal() {
            let project = document.getElementById("projectName").value.trim();
            let client = document.getElementById("clientName").value.trim();
            let deadline = document.getElementById("deadline").value;
            let value = Number(document.getElementById("projectValue").value);
            let status = document.getElementById("proposalStatus").value;
            let follow = document.getElementById("followDate").value;
            let notes = document.getElementById("proposalNotes").value.trim();

            if (project === "" || client === "" || deadline === "" || value <= 0) {
                document.getElementById("resultMessage").textContent =
                    "Please enter all required details.";
            } else {
                let newProposal = {
                    project: project,
                    client: client,
                    deadline: deadline,
                    value: value,
                    id: nextProposalId,
                    status: status,
                    follow: follow,
                    notes: notes
                };

                proposals.push(newProposal);
                nextProposalId++;

                showProposals(proposals);
                updateDashboard();
                showReminders();

                document.getElementById("projectName").value = "";
                document.getElementById("clientName").value = "";
                document.getElementById("deadline").value = "";
                document.getElementById("projectValue").value = "";
                document.getElementById("proposalStatus").value = "Draft";
                document.getElementById("followDate").value = "";
                document.getElementById("proposalNotes").value = "";

                document.getElementById("resultMessage").textContent =
                    "Your opportunity has been added successfully!";
            }
        }

        function searchProposals() {
            let search = document.getElementById("searchText").value.trim().toLowerCase();
            let selectedStatus = document.getElementById("statusFilter").value;
            let found = [];

            for (let i = 0; i < proposals.length; i++) {
                let projectName = proposals[i].project.toLowerCase();
                let clientName = proposals[i].client.toLowerCase();

                let matchesText = projectName.includes(search) || clientName.includes(search);
                let matchesStatus = selectedStatus === "All" || proposals[i].status === selectedStatus;

                if (matchesText && matchesStatus) {
                    found.push(proposals[i]);
                }
            }

            showProposals(found);
        }


        function deleteProposal(id) {
            let updatedProposals = [];

            for (let i = 0; i < proposals.length; i++) {
                if (proposals[i].id !== id) {
                    updatedProposals.push(proposals[i]);
                }
            }

            proposals = updatedProposals;
            searchProposals();
            updateDashboard();
            showReminders();
        }

        function changeStatus(id) {
            for (let i = 0; i < proposals.length; i++) {
                if (proposals[i].id === id) {
                    if (proposals[i].status === "Draft") {
                        proposals[i].status = "Sent";
                    } else if (proposals[i].status === "Sent") {
                        proposals[i].status = "Follow-up";
                    } else if (proposals[i].status === "Follow-up") {
                        proposals[i].status = "Won";
                    } else if (proposals[i].status === "Won") {
                        proposals[i].status = "Lost";
                    } else {
                        proposals[i].status = "Draft";
                    }
                }
            }

            showProposals(proposals);
            updateDashboard();
            showReminders();
        }

        showProposals(proposals);
        updateDashboard();
        showReminders();

    

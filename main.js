      let customers = [];
      let campaigns = [];
      let nextCustomerId = 1;
      let nextCampaignId = 1;

      // Helper Functions
      /**
       * Displays a toast notification message.
       * @param {string} message - The message to display.
       * @param {string} type - The type of toast ('success', 'warning', 'error').
       */
      function showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
          toast.classList.add('fade-out');
          setTimeout(() => toast.remove(), 500); // Remove after fade out
        }, 2000); // Display for 2 seconds
      }

      /**
       * Renders the customer table.
       */
      function renderCustomerTable() {
        const customerTableBody = document.getElementById("customerTableBody");
        if (customers.length === 0) {
          customerTableBody.innerHTML = `<tr><td colspan="5" class="px-5 py-5 border-b border-gray-200 text-sm">No customers added yet.</td></tr>`;
          return;
        }

        customerTableBody.innerHTML = customers
          .map(
            (customer) => `
          <tr>
            <td class="px-5 py-5 border-b border-gray-200 text-sm"><span class="font-italic text-gray-800">${customer.id}</span></td>
            <td class="px-5 py-5 border-b border-gray-200 text-sm"><span class="font-semibold text-blue-600">${customer.name}</span></td>
            <td class="px-5 py-5 border-b border-gray-200 text-sm"><span class="font-mono text-gray-700">${customer.email}</span></td>
            <td class="px-5 py-5 border-b border-gray-200 text-sm"><span class="font-mono text-gray-700">${customer.PhoneNumber}</span></td>
            <td class="px-5 py-5 border-b border-gray-200 text-sm"><span class="font-oblique font-sans text-purple-500">${customer.segment}</span></td>
            <td class="px-5 py-5 border-b border-gray-200 text-sm">
              <button class="delete-customer-btn bg-red-500 hover:bg-red-700 text-white rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-red-400" data-customer-id="${customer.id}">Delete</button>
            </td>
          </tr>
        `
          )
          .join("");

        // Attach event listeners to delete buttons after they are rendered
        document.querySelectorAll(".delete-customer-btn").forEach((button) => {
          button.addEventListener("click", (event) => {
            const customerId = parseInt(event.target.dataset.customerId);
            deleteCustomer(customerId);
          });
        });
      }

      /**
       * Renders the campaign table.
       */
      function renderCampaignTable() {
        const campaignTableBody = document.getElementById("campaignTableBody");
        if (campaigns.length === 0) {
          campaignTableBody.innerHTML = `<tr><td colspan="6" class="px-5 py-5 border-b border-gray-200 text-sm">No campaigns added yet.</td></tr>`;
          return;
        }

        campaignTableBody.innerHTML = campaigns
          .map(
            (campaign) => `
          <tr>
            <td class="px-5 py-5 border-b border-gray-200 text-sm"><span class="font-italic text-gray-800">${campaign.id}</span></td>
            <td class="px-5 py-5 border-b border-gray-200 text-sm"><span class="font-semibold text-blue-600">${campaign.name}</span></td>
            <td class="px-5 py-5 border-b border-gray-200 text-sm"><span class="font-mono text-purple-500">${campaign.type}</span></td>
            <td class="px-5 py-5 border-b border-gray-200 text-sm"><span class="font-normal text-gray-700">${campaign.content}</span></td>
            <td class="px-5 py-5 border-b border-gray-200 text-sm"><span class="font-oblique font-sans text-green-600">${campaign.segment}</span></td>
             <td class="px-5 py-5 border-b border-gray-200 text-sm">
              <button class="delete-campaign-btn bg-red-500 hover:bg-red-700 text-white rounded-md p-1 focus:outline-none focus:ring-2 focus:ring-red-400" data-campaign-id="${campaign.id}">Delete</button>
            </td>
          </tr>
        `
          )
          .join("");
          // Attach event listeners to delete buttons after they are rendered
        document.querySelectorAll(".delete-campaign-btn").forEach((button) => {
          button.addEventListener("click", (event) => {
            const campaignId = parseInt(event.target.dataset.campaignId);
            deleteCampaign(campaignId);
          });
        });
      }

      /**
       * Updates the insights and analytics section.
       */
      function updateInsights() {
        document.getElementById("totalCustomers").textContent = customers.length;
        document.getElementById("totalCampaigns").textContent = campaigns.length;
        document.getElementById("activeCampaigns").textContent = campaigns.filter(c => c.status === 'Active').length;
      }

      /**
       * Adds a new customer.
       */
      function addCustomer() {
        const nameInput = document.getElementById("customerName");
        const emailInput = document.getElementById("customerEmail");
        const segmentInput = document.getElementById("customerSegment");
        const PhoneNumberInput = document.getElementById("customerPhoneNumber");
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const segment = segmentInput.value.trim();
        const PhoneNumber = PhoneNumberInput.value.trim();

        if (!name || !email || !segment || !PhoneNumber) {
          showToast("Please fill in all customer fields.", "warning");
          return;
        }

        if (!isValidEmail(email)) {
          showToast("Please enter a valid email address.", "error");
          return;
        }

        const newCustomer = {
          id: nextCustomerId++,
          name,
          email,
          segment,
          PhoneNumber,
        };

        customers.push(newCustomer);
        renderCustomerTable();
        updateInsights();
        clearInputFields(nameInput, emailInput, segmentInput,PhoneNumberInput);
        showToast("Customer added successfully!");
      }

      /**
       * Deletes a customer.
       * @param {number} id - The ID of the customer to delete.
       */
      function deleteCustomer(id) {
        const customerIndex = customers.findIndex((c) => c.id === id);
        if (customerIndex !== -1) {
          customers.splice(customerIndex, 1);
          renderCustomerTable();
          updateInsights();
          showToast("Customer deleted successfully!");
        } else {
          showToast("Customer not found.", "error"); // Handle case where customer doesn't exist
        }
      }

      /**
       * Adds a new campaign.
       */
      function addCampaign() {
        const nameInput = document.getElementById("campaignName");
        const typeInput = document.getElementById("campaignType");
        const contentInput = document.getElementById("campaignContent");
        const segmentInput = document.getElementById("campaignSegment");

        const name = nameInput.value.trim();
        const type = typeInput.value.trim();
        const content = contentInput.value.trim();
        const segment = segmentInput.value.trim();

        if (!name || !type || !content || !segment) {
          showToast("Please fill in all campaign fields.", "warning");
          return;
        }

        const newCampaign = {
          id: nextCampaignId++,
          name,
          type,
          content,
          segment,
          status: "Active", //  "Active" or "Draft"
        };

        campaigns.push(newCampaign);
        renderCampaignTable();
        updateInsights();
        clearInputFields(nameInput, typeInput, contentInput, segmentInput);
        showToast("Campaign added successfully!");
      }

       /**
       * Deletes a campaign.
       * @param {number} id - The ID of the campaign to delete.
       */
      function deleteCampaign(id) {
        const campaignIndex = campaigns.findIndex((c) => c.id === id);
        if (campaignIndex !== -1) {
          campaigns.splice(campaignIndex, 1);
          renderCampaignTable();
          updateInsights();
          showToast("Campaign deleted successfully!");
        } else {
          showToast("Campaign not found.", "error"); // Handle case where campaign doesn't exist
        }
      }

      /**
       * Clears the input fields.
       */
      function clearInputFields(...inputs) {
        inputs.forEach(input => input.value = "");
      }

      /**
       * Checks if an email is valid.
       * @param {string} email - The email address to check.
       * @returns {boolean} - True if the email is valid, false otherwise.
       */
      function isValidEmail(email) {
        const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
        return emailRegex.test(email);
      }

      /**
       * Simulates AI analysis of customer data.
       * @returns {Promise<{ sentiment: string, prediction: string }>}
       */
      async function analyzeData() {
        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Simulate AI analysis based on current data
        let totalCustomerSentiment = 0;
        customers.forEach((customer) => {
          // Very basic sentiment analysis based on email (for demonstration)
          if (customer.email.includes("happy")) {
            totalCustomerSentiment += 1;
          } else if (customer.email.includes("sad")) {
            totalCustomerSentiment -= 1;
          }
        });

        const averageSentiment =
          customers.length > 0 ? totalCustomerSentiment / customers.length : 0;
        let sentimentLabel = "Neutral";
        if (averageSentiment > 0.5) {
          sentimentLabel = "Positive";
        } else if (averageSentiment < -0.5) {
          sentimentLabel = "Negative";
        } else {
          sentimentLabel = "Neutral";
        }

        //Simulate campaign performance
        let campaignPerformance = "Average";
        if(campaigns.length > 3){
          campaignPerformance = "Good";
        }
        else if (campaigns.length < 2){
          campaignPerformance = "Poor"
        }
        else{
          campaignPerformance = "Average"
        }


        return {
          sentiment: sentimentLabel,
          prediction: campaignPerformance,
        };
      }

      // Event Listeners
      document.getElementById("addCustomer").addEventListener("click", addCustomer);
      document.getElementById("addCampaign").addEventListener("click", addCampaign);
      document.getElementById("analyzeData").addEventListener("click", () => {
        document.getElementById("customerSentiment").textContent = "Analyzing...";
        document.getElementById("campaignPrediction").textContent = "Analyzing...";
        analyzeData()
          .then((result) => {
            document.getElementById(
              "customerSentiment"
            ).textContent = `Overall Customer Sentiment: ${result.sentiment}`;
            document.getElementById(
              "campaignPrediction"
            ).textContent = `Predicted Campaign Performance: ${result.prediction}`;
            showToast("Data analysis complete!");
          })
          .catch((error) => {
            console.error("Error analyzing data:", error);
            document.getElementById("customerSentiment").textContent =
              "Error analyzing data.";
            document.getElementById("campaignPrediction").textContent =
              "Error analyzing data.";
            showToast("Failed to analyze data.", "error");
          });
      });

      // Initial render
      renderCustomerTable();
      renderCampaignTable();
      updateInsights();

      // Populate the campaign segment dropdown on page load and when customers are added.
      function populateCampaignSegmentDropdown() {
        const segmentDropdown = document.getElementById("campaignSegment");
        segmentDropdown.innerHTML = '<option value="" disabled selected>Select Target Segment</option>'; // Clear existing options
        const uniqueSegments = [...new Set(customers.map(customer => customer.segment))]; // Get unique segments
        uniqueSegments.forEach(segment => {
          const option = document.createElement('option');
          option.value = segment;
          option.textContent = segment;
          segmentDropdown.appendChild(option);
        });
      }
      populateCampaignSegmentDropdown(); // Initial population

      // Re-populate dropdown when a new customer is added.
      document.getElementById("addCustomer").addEventListener("click", () => {
        addCustomer(); // Call addCustomer first to add the customer
        populateCampaignSegmentDropdown(); // Then update the dropdown
      });
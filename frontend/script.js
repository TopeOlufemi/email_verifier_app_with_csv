document.getElementById('submitBtn').addEventListener('click', async () => {
  const emailInput = document.getElementById('emailInput').value.trim();
  const fileInput = document.getElementById('csvFile').files[0];

  const formData = new FormData();
  if (emailInput) {
    formData.append('text_input', emailInput);
  } else if (fileInput) {
    formData.append('file', fileInput);
  } else {
    alert('Please enter emails or upload a CSV.');
    return;
  }

  const res = await fetch('https://email-verifier-backend-f74v.onrender.com/verify/', {
    method: 'POST',
    body: formData
  });

  const data = await res.json();
  const resultsDiv = document.getElementById('results');

  const tableRows = data.map(row => 
    `<tr class="border-t">
      <td>${row.email}</td>
      <td>${row.valid_syntax}</td>
      <td>${row.mx_record}</td>
      <td>${row.domain}</td>
      <td>${row.m365_account ? "✅" : "❌"}</td>
    </tr>`).join('');

  resultsDiv.innerHTML = `
    <table class="w-full mt-4 border">
      <thead>
        <tr><th>Email</th><th>Valid Syntax</th><th>MX Record</th><th>Domain</th><th>M365</th></tr>
      </thead>
      <tbody>${tableRows}</tbody>
    </table>
    <button id="downloadBtn" class="mt-4 bg-green-600 text-white px-4 py-2 rounded">Download CSV</button>
  `;

  document.getElementById('downloadBtn').addEventListener('click', () => {
   const csvRows = ["email,valid_syntax,mx_record,domain,m365_account"];
data.forEach(row => {
  csvRows.push(`${row.email},${row.valid_syntax},${row.mx_record},${row.domain},${row.m365_account}`);
});
const csvContent = csvRows.join("\n");  // Use real newlines here
const csvBlob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(csvBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'verified_emails.csv';
    a.click();
    URL.revokeObjectURL(url);
  });
});

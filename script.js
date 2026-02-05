// Email type selection
const typeBtns = document.querySelectorAll('.type-btn');
const plainSection = document.getElementById('plainSection');
const htmlSection = document.getElementById('htmlSection');
const messageField = document.getElementById('message');
const plainFallback = document.getElementById('plainFallback');
let currentType = 'plain';

typeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        typeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentType = btn.dataset.type;

        if (currentType === 'plain') {
            plainSection.classList.remove('hidden');
            htmlSection.classList.add('hidden');
            messageField.required = true;
            plainFallback.required = false;
        } else {
            plainSection.classList.add('hidden');
            htmlSection.classList.remove('hidden');
            messageField.required = false;
            document.getElementById('htmlMessage').required = true;
            plainFallback.required = false;
        }
    });
});

// File upload handling
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('attachments');
const fileList = document.getElementById('fileList');
let selectedFiles = [];

uploadArea.addEventListener('click', () => fileInput.click());

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    handleFiles(e.dataTransfer.files);
});

fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

function handleFiles(files) {
    for (let file of files) {
        if (!selectedFiles.some(f => f.name === file.name)) {
            selectedFiles.push(file);
        }
    }
    updateFileList();
}

function updateFileList() {
    fileList.innerHTML = '';
    selectedFiles.forEach((file, index) => {
        const item = document.createElement('div');
        item.className = 'file-item';
        item.innerHTML = `
            <div class="file-name">
                <span>📄</span>
                <span>${file.name}</span>
                <span class="file-size">(${formatFileSize(file.size)})</span>
            </div>
            <button type="button" class="remove-file" onclick="removeFile(${index})">✕</button>
        `;
        fileList.appendChild(item);
    });
}

function removeFile(index) {
    selectedFiles.splice(index, 1);
    updateFileList();
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

// Form submission
const emailForm = document.getElementById('emailForm');
const submitBtn = document.getElementById('submitBtn');

emailForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const btnText = submitBtn.querySelector('.btn-text');
    const btnIcon = submitBtn.querySelector('.btn-icon');

    // Show loading
    submitBtn.disabled = true;
    btnText.textContent = 'Sending...';
    btnIcon.innerHTML = '<span class="spinner"></span>';

    // Create FormData
    const formData = new FormData();
    formData.append('to', document.getElementById('to').value);
    formData.append('cc', document.getElementById('cc').value);
    formData.append('bcc', document.getElementById('bcc').value);
    formData.append('subject', document.getElementById('subject').value);
    formData.append('emailType', currentType);

    if (currentType === 'plain') {
        formData.append('message', document.getElementById('message').value);
    } else {
        formData.append('htmlMessage', document.getElementById('htmlMessage').value);
        formData.append('message', document.getElementById('plainFallback').value);
    }

    // Add files
    selectedFiles.forEach(file => {
        formData.append('attachments', file);
    });

    try {
        const response = await fetch('/api/send-email', {
            method: 'POST',
            body: formData
        });

        const result = await response.json();

        if (result.success) {
            showToast('Email sent successfully!', 'success');
            emailForm.reset();
            selectedFiles = [];
            updateFileList();
        } else {
            showToast('Failed: ' + result.message, 'error');
        }
    } catch (error) {
        showToast('Error: ' + error.message, 'error');
    }

    // Reset button
    submitBtn.disabled = false;
    btnText.textContent = 'Send Email';
    btnIcon.textContent = '🚀';
});

// Verify SMTP
const verifyBtn = document.getElementById('verifyBtn');
const verifyStatus = document.getElementById('verifyStatus');

verifyBtn.addEventListener('click', async () => {
    verifyStatus.textContent = 'Checking...';
    verifyBtn.disabled = true;

    try {
        const response = await fetch('/api/verify');
        const result = await response.json();

        if (result.success) {
            verifyStatus.textContent = '✅ Valid';
            verifyStatus.style.color = '#2ed573';
            showToast('SMTP configuration is valid!', 'success');
        } else {
            verifyStatus.textContent = '❌ Invalid';
            verifyStatus.style.color = '#ff4757';
            showToast('SMTP Error: ' + result.message, 'error');
        }
    } catch (error) {
        verifyStatus.textContent = '❌ Error';
        verifyStatus.style.color = '#ff4757';
        showToast('Connection failed!', 'error');
    }

    verifyBtn.disabled = false;
});

// Toast notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

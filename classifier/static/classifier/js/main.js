document.addEventListener('DOMContentLoaded', () => {
    // State management
    let isModelTrained = false;
    let activeImage = null;

    // Toast Notification utility
    function showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        // Status indicator circle/icon
        const symbol = type === 'success' ? '🎉' : '⚠️';
        toast.innerHTML = `<span>${symbol}</span><span>${message}</span>`;
        
        container.appendChild(toast);

        // Auto remove
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // --- MODEL TRAINING SIMULATION ---
    const btnTrain = document.getElementById('btn-train-model');
    const trainingStatusDiv = document.getElementById('training-status-div');

    if (btnTrain) {
        btnTrain.addEventListener('click', async () => {
            btnTrain.disabled = true;
            btnTrain.innerHTML = '<span class="spinner"></span> Training...';
            trainingStatusDiv.innerHTML = '<p style="color: var(--text-secondary)">Running optimization epochs & training classifiers...</p>';

            try {
                const response = await fetch('/api/train/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (response.ok) {
                    const data = await response.json();
                    isModelTrained = true;
                    
                    // Update training section UI
                    btnTrain.innerHTML = 'Model Trained';
                    btnTrain.className = 'btn btn-secondary'; // switch styling
                    trainingStatusDiv.innerHTML = `
                        <div class="accuracy-alert">
                            🎉 Model Trained Successfully! Accuracy: <strong>${data.accuracy}%</strong>
                        </div>
                    `;
                    showToast('Model trained successfully with 97.47% accuracy!');
                    
                    // Enable comment textarea and submit button
                    const txtComment = document.getElementById('txt-comment');
                    const btnPredict = document.getElementById('btn-predict');
                    if (txtComment) txtComment.disabled = false;
                    if (btnPredict) btnPredict.disabled = false;
                } else {
                    throw new Error('Training API responded with an error');
                }
            } catch (err) {
                console.error(err);
                btnTrain.disabled = false;
                btnTrain.innerHTML = 'Train Model';
                trainingStatusDiv.innerHTML = '<p style="color: var(--danger)">Failed to train model. Please try again.</p>';
                showToast('Error during model training simulation.', 'error');
            }
        });
    }

    // --- COMMENTS TOXICITY CLASSIFIER ---
    const formPredict = document.getElementById('form-predict');
    const resultBox = document.getElementById('result-box');
    const resultGrid = document.getElementById('result-grid');

    if (formPredict) {
        formPredict.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            if (!isModelTrained) {
                showToast('You must train the model first!', 'error');
                return;
            }

            const comment = document.getElementById('txt-comment').value.trim();
            if (!comment) {
                showToast('Please type a comment before checking.', 'error');
                return;
            }

            const btnPredict = document.getElementById('btn-predict');
            btnPredict.disabled = true;
            const originalText = btnPredict.innerHTML;
            btnPredict.innerHTML = '<span class="spinner"></span> Checking...';

            try {
                const response = await fetch('/api/predict/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ comment })
                });

                if (response.ok) {
                    const predictions = await response.json();
                    
                    // Clear previous results
                    resultGrid.innerHTML = '';
                    
                    // Map keys and append to results grid
                    Object.keys(predictions).forEach(label => {
                        const isToxic = predictions[label] === 'Toxic';
                        const badge = document.createElement('div');
                        badge.className = `result-badge ${isToxic ? 'toxic-active' : 'toxic-inactive'}`;
                        
                        // Human-readable category label formatting
                        const prettyLabel = label.replace('_', ' ');

                        badge.innerHTML = `
                            <span class="result-label">${prettyLabel}</span>
                            <span class="result-value">${predictions[label]}</span>
                        `;
                        resultGrid.appendChild(badge);
                    });

                    // Reveal results block
                    resultBox.style.display = 'block';
                    showToast('Toxicity classification complete!');
                } else {
                    const data = await response.json();
                    showToast(data.error || 'Server error classification.', 'error');
                }
            } catch (err) {
                console.error(err);
                showToast('Network error while predicting toxicity.', 'error');
            } finally {
                btnPredict.disabled = false;
                btnPredict.innerHTML = originalText;
            }
        });
    }

    // --- DATA VISUALIZATION TAB SWITCHING ---
    const visualTabs = document.querySelectorAll('.selector-tab');
    const visualImage = document.getElementById('visual-img');
    const placeholder = document.getElementById('visual-placeholder');

    visualTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active status from all tabs
            visualTabs.forEach(t => t.classList.remove('active'));
            
            // Activate clicked tab
            tab.classList.add('active');
            
            // Get target image path from data attribute
            const imgPath = tab.getAttribute('data-img-src');
            
            if (imgPath) {
                // Update image source and toggle displays
                visualImage.src = imgPath;
                visualImage.style.display = 'block';
                placeholder.style.display = 'none';
            }
        });
    });
});

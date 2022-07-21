// disabling checkmark for now, this will be added in future
document.getElementById("enabled").disabled = true;

document.getElementById('tabSelect').addEventListener('change', function(){
    if (this.value === 'custom') {
        document.getElementById("ifYes").style.display = "block";
    }
    else {
        document.getElementById("ifYes").style.display = "none";
    }
})

function save_options() {
    
    var tabSelect = document.getElementById('tabSelect').value;
    var enabled = document.getElementById('enabled').checked;

    if (tabSelect == 'custom') {
        tabSelect = document.getElementById('tabSelectCustom').value;
    }
    
    chrome.storage.sync.set({
      maxTabAmt: tabSelect,
      enabled: enabled
    }, function() {
      // Update status to let user know options were saved.
      var status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(function() {
        status.textContent = '';
      }, 750);
    });
  }
  
  // Restores select box and checkbox state using the preferences
  // stored in chrome.storage.
  function restore_options() {
    // Use default value color = 'red' and likesColor = true.
    chrome.storage.sync.get({
      maxTabAmt: 1,
      enabled: true
    }, function(items) {
      document.getElementById('tabSelect').value = items.maxTabAmt;
      document.getElementById('enabled').checked = items.enabled;
    });
  }

  document.addEventListener('DOMContentLoaded', restore_options);
  document.getElementById('save').addEventListener('click',
      save_options);
// Konfigurasi Blynk
const token = "TYIESscNKALeYUKayRiin2Uo2lm-_pkX"; // Ganti dengan Auth Token dari Blynk.cloud
const server = "https://blynk.cloud/external/api/";

// Variabel untuk mengingat mode operasi saat ini
let isAutoMode = true;

// Fungsi utama untuk mengambil data dari Blynk
function fetchData() {
    // Memanggil API Blynk untuk mengambil nilai V0 sampai V5
    fetch(`${server}get?token=${token}&V0&V1&V2&V3&V4&V5`)
        .then(res => res.json())
        .then(data => {
            // Update UI Suhu (V0) & Kelembaban (V1)
            document.getElementById('suhu').innerHTML = parseFloat(data.V0).toFixed(1);
            document.getElementById('kelembaban').innerHTML = parseFloat(data.V1).toFixed(1);
            
            // Update UI Status Lampu (V2)
            let lampuStatus = document.getElementById('lampuStatus');
            if (data.V2 == 1) { 
                lampuStatus.innerHTML = 'MENYALA';
                lampuStatus.className = 'status-badge badge-on';
            } else {
                lampuStatus.innerHTML = 'MATI';
                lampuStatus.className = 'status-badge badge-off';
            }
            
            // Update UI Mode Operasi (V3) dan Tombol Mode
            isAutoMode = (data.V3 == 1);
            let modeStatus = document.getElementById('modeStatus');
            let modeBtn = document.getElementById('modeBtn');
            
            if (isAutoMode) {
                modeStatus.innerHTML = 'AUTO';
                modeStatus.className = 'status-badge badge-auto';
                if(modeBtn) modeBtn.innerHTML = '<i class="fas fa-hand-paper"></i> UBAH KE MANUAL';
            } else {
                modeStatus.innerHTML = 'MANUAL';
                modeStatus.className = 'status-badge badge-manual';
                if(modeBtn) modeBtn.innerHTML = '<i class="fas fa-sync-alt"></i> UBAH KE AUTO';
            }
            
            // Update Input Fields (Hanya update jika user tidak sedang mengetik di dalamnya)
            if (document.activeElement.id !== 'suhuThreshold') {
                document.getElementById('suhuThreshold').value = parseFloat(data.V4).toFixed(1);
            }
            if (document.activeElement.id !== 'interval') {
                document.getElementById('interval').value = data.V5; 
            }
        })
        .catch(err => console.error("Gagal mengambil data dari Blynk:", err));
}

// Fungsi untuk kontrol Lampu secara Manual
function setLampu(on) {
    let state = on ? 1 : 0;
    // Saat lampu ditekan manual, paksa juga sistem masuk ke mode Manual (V3=0)
    fetch(`${server}update?token=${token}&V2=${state}&V3=0`)
        .then(() => fetchData());
}

// Fungsi untuk membalikkan mode (Toggle Auto/Manual)
function toggleMode() {
    // Jika saat ini Auto (1), ubah ke Manual (0). Jika Manual (0), ubah ke Auto (1).
    let newState = isAutoMode ? 0 : 1; 
    fetch(`${server}update?token=${token}&V3=${newState}`)
        .then(() => fetchData());
}

// Fungsi untuk update Suhu Threshold
function setSuhuThreshold() {
    let val = parseFloat(document.getElementById('suhuThreshold').value);
    fetch(`${server}update?token=${token}&V4=${val}`)
        .then(() => fetchData());
}

// Fungsi untuk update Interval Putar Telur (Servo)
function setIntervalServo() {
    let val = parseFloat(document.getElementById('interval').value);
    fetch(`${server}update?token=${token}&V5=${val}`)
        .then(() => fetchData());
}

// Menjalankan fetchData setiap 3 detik (3000 ms) agar UI terus update otomatis
setInterval(fetchData, 3000);

// Menarik data pertama kali saat halaman web selesai dimuat
window.onload = fetchData;
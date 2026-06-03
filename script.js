// Konfigurasi Blynk
const token = "TYIESscNKALeYUKayRiin2Uo2lm-_pkX"; // Ganti dengan Auth Token dari Blynk.cloud
const server = "https://blynk.cloud/external/api/";

// Fungsi untuk mengambil data dari Blynk
function fetchData() {
    // Memanggil API Blynk untuk mengambil V0, V1, V2, V3, V4, V5
    fetch(`${server}get?token=${token}&V0&V1&V2&V3&V4&V5`)
        .then(res => res.json())
        .then(data => {
            // Update UI Suhu & Kelembaban
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
            
            // Update UI Mode Operasi (V3)
            let modeStatus = document.getElementById('modeStatus');
            if (data.V3 == 1) {
                modeStatus.innerHTML = 'AUTO';
                modeStatus.className = 'status-badge badge-auto';
            } else {
                modeStatus.innerHTML = 'MANUAL';
                modeStatus.className = 'status-badge badge-manual';
            }
            
            // Update Input Fields (Hanya jika sedang tidak diketik oleh user)
            if (document.activeElement.id !== 'suhuThreshold') {
                document.getElementById('suhuThreshold').value = parseFloat(data.V4).toFixed(1);
            }
            if (document.activeElement.id !== 'interval') {
                document.getElementById('interval').value = data.V5; // V5 untuk interval menit
            }
        })
        .catch(err => console.error("Gagal mengambil data dari Blynk:", err));
}

// Fungsi untuk kontrol Lampu Manual
function setLampu(on) {
    let state = on ? 1 : 0;
    fetch(`${server}update?token=${token}&V2=${state}`)
        .then(() => fetchData());
}

// Fungsi untuk set ke Mode Auto
function setModeAuto() {
    fetch(`${server}update?token=${token}&V3=1`) // Set V3 (Mode) menjadi 1 (Auto)
        .then(() => fetchData());
}

// Fungsi untuk update Suhu Threshold
function setSuhuThreshold() {
    let val = parseFloat(document.getElementById('suhuThreshold').value);
    fetch(`${server}update?token=${token}&V4=${val}`)
        .then(() => fetchData());
}

// Fungsi untuk update Interval Servo
function setIntervalServo() {
    let val = parseFloat(document.getElementById('interval').value);
    fetch(`${server}update?token=${token}&V5=${val}`)
        .then(() => fetchData());
}

// Menjalankan fetchData setiap 3 detik agar UI terus update
setInterval(fetchData, 3000);

// Menarik data pertama kali saat halaman dimuat
window.onload = fetchData;
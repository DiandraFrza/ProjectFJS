*Mengambil Elemen Video dari HTML:*

EX Code : let video = document.getElementById("video");

>Penjelasan: Mengambil elemen <video> dari halaman HTML dengan id "video" dan menyimpannya dalam variabel video.

*Membuat Elemen Canvas:*

EX Code : let canvas = document.createElement("canvas");

    >Penjelasan: Membuat elemen <canvas> baru yang akan digunakan untuk menggambar deteksi wajah.

*Menambahkan Canvas ke Halaman:*

EX Code : document.body.append(canvas);

>Penjelasan: Menambahkan elemen canvas yang baru dibuat ke dalam body dari halaman HTML sehingga elemen ini menjadi bagian dari tampilan halaman.

*Mendapatkan Konteks 2D dari Canvas:*

EX Code :let ctx = canvas.getContext("2d");

    >Penjelasan: Mengambil konteks 2D dari canvas yang memungkinkan kita untuk menggambar di dalamnya.

*Mengatur Ukuran Tampilan:*

EX Code :let displaySize = { width: 1280, height: 720 };

>Penjelasan: Menentukan ukuran tampilan video dan canvas yaitu lebar 1280 piksel dan tinggi 720 piksel.

*Bagian Memulai Stream dari Webcam**

    Fungsi untuk Memulai Stream dari Webcam:

    EX Code :const startStream = () => {
        console.log("**[i] Mencoba memulai Webcam");
        navigator.mediaDevices.getUserMedia({
            video: { width: displaySize.width, height: displaySize.height },
            audio: false
        }).then((stream) => {
            video.srcObject = stream;
        }).catch(err => console.error('Terjadi Error pada saat mengakses webcam: ', err));
    };

>Penjelasan:
            Baris 1: Mendefinisikan fungsi startStream.
            Baris 2: Mencetak pesan ke konsol bahwa webcam akan dimulai.
            Baris 3-7: Menggunakan navigator.mediaDevices.getUserMedia untuk meminta akses ke webcam dengan pengaturan lebar dan tinggi yang ditentukan serta tanpa audio.
            Baris 8: Jika permintaan berhasil, menetapkan stream video dari webcam sebagai sumber video elemen HTML.
            Baris 9: Jika terjadi kesalahan saat mengakses webcam, mencetak pesan kesalahan ke konsol.

*Bagian Memuat Model Face API*

    Memulai Pemuatan Model:

    EX Code :console.log(faceapi.nets);
console.log("**[i] Mencoba memulai Model");

>Penjelasan: Mencetak objek faceapi.nets ke konsol untuk melihat model yang tersedia dan mencetak pesan bahwa model sedang dimuat.

*Memuat Semua Model yang Dibutuhkan:*

EX Code :Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
        faceapi.nets.faceLandmark68Net.loadFromUri('/models'),
        faceapi.nets.faceRecognitionNet.loadFromUri('/models'),
        faceapi.nets.faceExpressionNet.loadFromUri('/models'),
        faceapi.nets.ageGenderNet.loadFromUri('/models')
    ]).then(startStream);

        >Penjelasan: Menggunakan Promise.all untuk memuat semua model yang diperlukan dari direktori /models. Setelah semua model selesai dimuat, memanggil fungsi startStream untuk memulai webcam.

*Bagian Deteksi Wajah*

    Fungsi untuk Mendeteksi Wajah:

    EX Code :async function detect() {
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
            .withFaceLandmarks()
            .withFaceExpressions()
            .withAgeAndGender();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const resizedDetections = faceapi.resizeResults(detections, displaySize);

        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections);

        resizedDetections.forEach(result => {
            const { age, gender, genderProbability } = result;
            new faceapi.draw.DrawTextField([
                `${Math.round(age, 0)} Tahun`,
                `${gender} (${Math.round(genderProbability * 100)}%)`
            ], result.detection.box.bottomRight).draw(canvas);
        });
    }

>Penjelasan:
            Baris 1: Mendefinisikan fungsi asinkron detect.
            Baris 2-4: Menggunakan faceapi.detectAllFaces untuk mendeteksi wajah pada elemen video, dan memperluas deteksi dengan landmark wajah, ekspresi wajah, serta estimasi usia dan jenis kelamin.
            Baris 5: Menghapus semua gambar di canvas.
            Baris 6: Mengubah ukuran hasil deteksi sesuai dengan ukuran tampilan.
            Baris 7-9: Menggambar deteksi wajah, landmark wajah, dan ekspresi wajah di canvas.
            Baris 10-15: Untuk setiap hasil deteksi, menggambar informasi usia dan jenis kelamin di bawah kotak deteksi wajah.

*Event Listener untuk Video*

    Event Listener untuk Memulai Deteksi saat Video Dimainkan:

    EX Code :video.addEventListener('play', () => {
        canvas.width = displaySize.width;
        canvas.height = displaySize.height;
        faceapi.matchDimensions(canvas, displaySize);
        
        setInterval(detect, 100);
    });

>Penjelasan:
            Baris 1: Menambahkan event listener untuk event play pada elemen video.
            Baris 2-3: Mengatur lebar dan tinggi canvas sesuai dengan ukuran tampilan.
            Baris 4: Menyesuaikan dimensi canvas untuk mencocokkan dimensi video.
            Baris 5: Memulai interval yang akan memanggil fungsi detect setiap 100 milidetik untuk mendeteksi wajah secara berkala saat video diputar.

>Penjelasan di atas menggambarkan bagaimna setiap bagian kode bekerja untuk memulai webcam, memuat model deteksi wajah, dan mendeteksi serta menggambar informasi wajah di canvas secara real-time.
